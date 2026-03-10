"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { runPipeline } from "./pipeline"

export async function createTask(keyword: string, modelUsed: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: user.id,
      input_keyword: keyword,
      model_used: modelUsed,
      status: "pending"
    })
    .select()
    .single()

  if (error || !data) {
    console.error("Failed to create task:", error)
    return { error: error?.message || "Failed to create task" }
  }

  // Fire and forget the pipeline processor
  runPipeline(data.id, keyword, modelUsed).catch(console.error)

  revalidatePath("/")
  return { success: true }
}

export async function getTasks() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    console.error("Failed to fetch tasks:", error)
    return []
  }

  return data
}

export async function redoTask(taskId: string, keyword: string, modelUsed: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Clear out old generated assets for this failed task so we don't pile them up
  await supabase.from("assets").delete().eq("task_id", taskId)

  // Reset the task status to pending
  await supabase.from("tasks").update({ status: "pending" }).eq("id", taskId)

  // Re-fire the pipeline
  runPipeline(taskId, keyword, modelUsed).catch(console.error)

  revalidatePath("/")
  return { success: true }
}
