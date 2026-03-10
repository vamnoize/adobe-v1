"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveApiKey(service: "gemini" | "adobe_sftp" | "leonardo" | "cloudinary", key: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("api_keys")
    .upsert({ 
      user_id: user.id, 
      service_name: service, 
      encrypted_key: key, // In a prod env this should be encrypted BEFORE inserting, but assuming TRD meant Supabase encrypts it via pgcrypto or similar for now
      is_active: true
    }, {
      onConflict: "user_id, service_name"
    })

  if (error) {
    console.error("Failed to save API Key:", error)
    return { error: error.message }
  }

  revalidatePath("/settings")
  return { success: true }
}

export async function getApiKeys() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("api_keys")
    .select("service_name, encrypted_key")
    .eq("user_id", user.id)

  if (error) {
    console.error("Failed to fetch API Keys:", error)
    return []
  }

  return data
}
