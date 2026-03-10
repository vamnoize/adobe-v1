"use client"

import { useState, useTransition } from "react"
import { ChevronDown, Play, Loader2 } from "lucide-react"
import { createTask } from "@/app/(dashboard)/actions/tasks"

export function TaskLauncher() {
  const [keyword, setKeyword] = useState("")
  const [modelUsed, setModelUsed] = useState("imagen-4.0")
  const [isPending, startTransition] = useTransition()

  const handleLaunch = () => {
    if (!keyword.trim()) return

    startTransition(async () => {
      await createTask(keyword, modelUsed)
      setKeyword("")
    })
  }

  return (
    <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
      <div className="space-y-6">
        <div>
          <label htmlFor="keyword" className="block text-sm font-medium mb-2 text-[var(--foreground)]">Primary Keyword or Concept</label>
          <input
            type="text"
            id="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLaunch()}
            placeholder="e.g. 'cinematic macro shot of a raindrop on a leaf'"
            className="w-full text-lg p-4 bg-transparent border-b-2 border-[var(--border)] focus:border-[var(--foreground)] text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)]"
            disabled={isPending}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="flex-1">
            <label className="block text-xs font-medium mb-2 text-[var(--muted-foreground)] uppercase tracking-wider">Image Generator Model</label>
            <div className="relative">
              <select 
                value={modelUsed}
                onChange={(e) => setModelUsed(e.target.value)}
                disabled={isPending}
                className="w-full appearance-none bg-[var(--muted)] border border-[var(--border)] rounded-md px-4 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]"
              >
                <option value="imagen-4.0-ultra-generate-001">imagen-4.0-ultra-generate-001</option>
                <option value="imagen-4.0-fast-generate-001">imagen-4.0-fast-generate-001</option>
                <option value="gemini-3-pro-image-preview">gemini-3-pro-image-preview</option>
                <option value="gemini-3.1-flash-image-preview">gemini-3.1-flash-image-preview</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" size={16} />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium mb-2 text-[var(--muted-foreground)] uppercase tracking-wider">Upscaler Model</label>
            <div className="relative">
              <select 
                disabled={isPending}
                className="w-full appearance-none bg-[var(--muted)] border border-[var(--border)] rounded-md px-4 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]"
              >
                <option>Real-ESRGAN x4</option>
                <option>Topaz Gigapixel</option>
                <option>None (Raw Resolution)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" size={16} />
            </div>
          </div>
        </div>
        
        <div className="pt-4 flex justify-end">
           <button 
             onClick={handleLaunch}
             disabled={isPending || !keyword.trim()}
             className="bg-[var(--foreground)] text-[var(--background)] px-6 py-3 rounded-md font-medium text-sm flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
           >
              {isPending ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
              Launch Pipeline
           </button>
        </div>
      </div>
    </div>
  )
}
