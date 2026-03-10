"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { Database } from "@/types/database"

export type AssetWithTask = Database["public"]["Tables"]["assets"]["Row"] & {
  tasks: Pick<Database["public"]["Tables"]["tasks"]["Row"], "input_keyword" | "model_used"> | null
}

export async function getPendingAssets(): Promise<AssetWithTask[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  // Fetch assets that are pending review, joining with the parent task to get the keyword
  const { data, error } = await supabase
    .from("assets")
    .select(`
      *,
      tasks:task_id (
        input_keyword,
        model_used
      )
    `)
    .eq("user_id", user.id)
    .eq("user_status", "pending")
    .not("raw_url", "is", null) // Only fetch assets that have finished generating an image URL
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Failed to fetch pending assets:", error)
    return []
  }

  // Supabase join types can be tricky, cast to our defined type
  return data as unknown as AssetWithTask[]
}

export async function updateAssetStatus(assetId: string, status: "approved" | "rejected") {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from("assets")
    .update({ user_status: status })
    .eq("id", assetId)
    .eq("user_id", user.id)

  if (error) {
    console.error(`Failed to mark asset as ${status}:`, error)
    return { error: error.message }
  }

  revalidatePath("/curate")
  return { success: true }
}
