"use server"

import { createClient } from "@/utils/supabase/server"
import { generatePhotoMetadata } from "@/lib/metadata"
import { uploadToAdobeStock } from "@/lib/sftp"
import { deleteImageFromCloudinary } from "@/lib/storage"
import { revalidatePath } from "next/cache"

export async function processDelivery(taskId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  // 1. Fetch API Keys
  const { data: apiKeys } = await supabase
    .from("api_keys")
    .select("service_name, encrypted_key")
    .eq("user_id", user.id)

  const geminiKey = apiKeys?.find(k => k.service_name === "gemini")?.encrypted_key || ""
  const cloudinaryUrl = apiKeys?.find(k => k.service_name === "cloudinary")?.encrypted_key || ""
  const sftpKeyString = apiKeys?.find(k => k.service_name === "adobe_sftp")?.encrypted_key || ""
  
  let sftpConfig = { host: "sftp.test.mock", username: "mock" };
  try {
     if (sftpKeyString) sftpConfig = JSON.parse(sftpKeyString);
  } catch {}

  // 2. Set task status
  await supabase.from("tasks").update({ status: "upscaling" }).eq("id", taskId)

  // 3. Fetch approved assets
  const { data: assets } = await supabase
    .from("assets")
    .select("*")
    .eq("task_id", taskId)
    .eq("user_status", "approved")
    .not("raw_url", "is", null)

  if (!assets || assets.length === 0) {
    await supabase.from("tasks").update({ status: "completed" }).eq("id", taskId)
    return { success: true, message: "No approved assets to deliver." }
  }

  try {
    const sftpFiles: {name: string, buffer: Buffer}[] = [];
    const csvRows = [["Filename", "Title", "Keywords", "Category"]]; // Adobe Stock basic format

    // Process each approved asset
    for (const asset of assets) {
      // A. Metadata
      const metadata = await generatePhotoMetadata(asset.prompt_used, geminiKey);
      
      // Update DB
      const finalUrl = asset.raw_url!;
      await supabase.from("assets").update({
        upscaled_url: finalUrl,
        metadata_json: { ...asset.metadata_json as object, final_title: metadata.title, final_keywords: metadata.keywords }
      }).eq("id", asset.id);

      // B. Prepare for SFTP
      // Download the image as a buffer for the SFTP put
      const res = await fetch(finalUrl);
      if (res.ok) {
         const ab = await res.arrayBuffer();
         const jpgName = `image_${asset.id.split('-')[0]}.jpg`; // Adobe prefers jpg/jpeg usually
         sftpFiles.push({ name: jpgName, buffer: Buffer.from(ab) });
         
         // Add to CSV manifest
         csvRows.push([
           jpgName, 
           `"${metadata.title.replace(/"/g, '""')}"`, 
           `"${metadata.keywords.join(", ")}"`,
           "1" // Default category 'Animals' or similar, could be dynamic
         ]);
      }
    }

    // D. SFTP Delivery
    await supabase.from("tasks").update({ status: "uploading" }).eq("id", taskId)
    
    // Create CSV buffer
    const csvString = csvRows.map(row => row.join(",")).join("\n");
    sftpFiles.push({ name: `manifest_${taskId.split('-')[0]}.csv`, buffer: Buffer.from(csvString, 'utf-8') });

    await uploadToAdobeStock(sftpConfig, sftpFiles);

    // E. Storage Cleanup (Purge raw images to save space)
    for (const asset of assets) {
       await deleteImageFromCloudinary(`${taskId}/${asset.id}`, cloudinaryUrl);
    }

    // Mark completed
    await supabase.from("tasks").update({ status: "completed" }).eq("id", taskId)

    revalidatePath("/")
    revalidatePath("/curate")
    return { success: true }

  } catch (error) {
    console.error("Delivery failed", error)
    await supabase.from("tasks").update({ status: "failed" }).eq("id", taskId)
    return { error: "Delivery pipeline failed." }
  }
}
