"use client"

import { Database } from "@/types/database"
import { formatDistanceToNow } from "date-fns"
import { useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { redoTask } from "@/app/(dashboard)/actions/tasks"

type Task = Database["public"]["Tables"]["tasks"]["Row"]

interface ActiveWorkflowsProps {
  tasks: Task[]
}

export function ActiveWorkflows({ tasks }: ActiveWorkflowsProps) {
  const router = useRouter()

  useEffect(() => {
    // Poll the server every 3 seconds to get the latest task statuses
    // if there is any task that is not completed or failed
    const hasActiveTasks = tasks.some(t => t.status !== "completed" && t.status !== "failed")
    
    if (hasActiveTasks) {
      const interval = setInterval(() => {
        router.refresh()
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [tasks, router])

  if (tasks.length === 0) {
    return (
      <div className="border border-[var(--border)] border-dashed rounded-xl p-12 text-center bg-[var(--background)]">
        <p className="text-[var(--muted-foreground)]">No active workflows. Launch a new task above.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <WorkflowItem key={task.id} task={task} />
      ))}
    </div>
  )
}

function WorkflowItem({ task }: { task: Task }) {
  const [isPending, startTransition] = useTransition()

  // Simple state machine for progress UI
  // Statuses: pending -> prompting -> generating -> upscaling -> uploading -> completed | failed
  const getProgress = (status: Task["status"]) => {
    switch (status) {
      case "pending": return 0
      case "prompting": return 20
      case "generating": return 50
      case "upscaling": return 75
      case "uploading": return 90
      case "completed": return 100
      case "failed": return 100
      default: return 0
    }
  }

  const progress = getProgress(task.status)

  return (
    <div className="border border-[var(--border)] rounded-xl p-6 relative overflow-hidden bg-[var(--background)] group">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-medium text-lg text-[var(--foreground)] truncate max-w-[400px]" title={task.input_keyword}>
            &quot;{task.input_keyword}&quot;
          </h3>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Started {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })} • {task.model_used}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {task.status === "failed" && (
            <button 
              onClick={() => startTransition(() => { redoTask(task.id, task.input_keyword, task.model_used) })}
              disabled={isPending}
              className="text-xs font-medium px-4 py-1.5 bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white border border-red-600/20 hover:border-red-600 rounded-full transition-all flex items-center gap-1 disabled:opacity-50"
            >
              {isPending ? "Starting..." : "Redo Task"}
            </button>
          )}
          <span className={`text-xs font-medium px-3 py-1 bg-[var(--foreground)] text-[var(--background)] rounded-full ${task.status === "failed" ? "bg-red-600" : ""}`}>
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Minimal Progress Tracker */}
      <div className="relative pt-4 pb-2">
        <div className="absolute top-6 left-0 w-full h-[2px] bg-[var(--border)]">
          <div 
            className={`h-full transition-all duration-1000 ${task.status === "failed" ? "bg-red-600" : "bg-[var(--foreground)]"}`} 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between relative z-10 px-2">
          
          <Step 
            label="Prompting" 
            isActive={progress >= 20} 
            isCurrent={task.status === "prompting"} 
            isFailed={task.status === "failed" && progress < 50}
          />
          <Step 
            label="Generating" 
            isActive={progress >= 50} 
            isCurrent={task.status === "generating"} 
            isFailed={task.status === "failed" && progress >= 20 && progress < 75}
          />
          <Step 
            label="Upscaling" 
            isActive={progress >= 75} 
            isCurrent={task.status === "upscaling"} 
            isFailed={task.status === "failed" && progress >= 50 && progress < 90}
          />
          <Step 
            label="Uploading" 
            isActive={progress >= 90} 
            isCurrent={task.status === "uploading"} 
            isFailed={task.status === "failed" && progress >= 75}
          />

        </div>
      </div>
    </div>
  )
}

function Step({ label, isActive, isCurrent, isFailed }: { label: string, isActive: boolean, isCurrent: boolean, isFailed: boolean }) {
  
  let circleClass = "w-5 h-5 rounded-full border-[3px] border-[var(--background)] shadow-sm flex items-center justify-center "
  if (isFailed) {
    circleClass += "bg-red-600"
  } else if (isActive) {
     circleClass += "bg-[var(--foreground)]"
  } else {
     circleClass += "bg-[var(--muted)]"
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={circleClass}>
         {isCurrent && !isFailed && <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-[var(--background)]" />}
      </div>
      <span className={`text-xs ${isActive ? "font-medium text-[var(--foreground)]" : "text-[var(--muted-foreground)]"} ${isFailed ? "text-red-600" : ""}`}>
        {label}
      </span>
    </div>
  )
}
