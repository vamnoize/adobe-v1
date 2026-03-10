"use server"

import { createClient } from "@/utils/supabase/server"
import { expandPrompt, generateImageGemini } from "@/lib/gemini"
import { uploadImageToCloudinary } from "@/lib/storage"
import { evaluateImageQC } from "@/lib/vision"
import { revalidatePath } from "next/cache"

export async function runPipeline(taskId: string, keyword: string, modelUsed: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  try {
    // 1. Fetch API Keys
    const { data: apiKeys } = await supabase
      .from("api_keys")
      .select("service_name, encrypted_key")
      .eq("user_id", user.id)
      .in("service_name", ["gemini", "cloudinary"])

    const geminiKey = apiKeys?.find(k => k.service_name === "gemini")?.encrypted_key || ""
    const cloudinaryUrl = apiKeys?.find(k => k.service_name === "cloudinary")?.encrypted_key || ""

    if (!cloudinaryUrl) throw new Error("Cloudinary URL missing. Please add it in Settings > API Vault.")
    if (!geminiKey) throw new Error("Gemini API key missing. Please add it in Settings > API Vault.")

    // 2. Set status to prompting
    await supabase.from("tasks").update({ status: "prompting" }).eq("id", taskId)

    // 3. Expand Prompts (Calls the Gemini API to get 10 variations)
    console.log("DISPATCH: Expanding prompts for keyword: \"" + keyword + "\"")
    const prompts = await expandPrompt(keyword, geminiKey)

    // 4. Set status to generating
    await supabase.from("tasks").update({ status: "generating" }).eq("id", taskId)

    // 5. Build Initial Assets 
    const assetInserts = prompts.map(p => ({
      task_id: taskId,
      user_id: user.id,
      prompt_used: p.refined_prompt,
      metadata_json: { prompt_id: p.prompt_id, suggested_style: p.suggested_style },
      user_status: "pending" as const
    }))

    const { data: insertedAssets, error: assetErr } = await supabase
      .from("assets")
      .insert(assetInserts)
      .select()

    if (assetErr || !insertedAssets) {
      console.error("Failed to create assets", assetErr)
      throw new Error("Failed to create assets in database")
    }

    // 6. Generate Images (Executing in parallel for speed)
    console.log("DISPATCH: Generating images for keyword: \"" + keyword + "\"")
    await Promise.all(insertedAssets.map(async (asset) => {
      const tempUrl = await generateImageGemini(asset.prompt_used, modelUsed, geminiKey)
      const fileName = `${taskId}/${asset.id}` // Cloudinary doesn't strictly need .webp extension in public_id
      const finalUrl = await uploadImageToCloudinary(tempUrl, cloudinaryUrl, fileName)

      // Quality Control with Gemini Vision
      const qc = await evaluateImageQC(finalUrl, geminiKey)
      const isRejected = qc.realism_score < 7 || qc.has_artifacts
      const finalStatus = isRejected ? "rejected" : "pending"

      await supabase.from("assets").update({
        raw_url: finalUrl,
        ai_score: qc.realism_score,
        user_status: finalStatus,
        metadata_json: { ...asset.metadata_json as object, qc_notes: qc.notes, has_artifacts: qc.has_artifacts }
      }).eq("id", asset.id)
    }))

    // The initial automated portion of the pipeline halts here for manual curation.
    // The task status remains in 'generating' (or we could set it to 'curating' if we expand the DB enum).

  } catch (err) {
    console.error("Pipeline failed:", err)
    await supabase.from("tasks").update({ status: "failed" }).eq("id", taskId)
  }
}
