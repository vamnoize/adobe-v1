"use client"

import { useState, useTransition } from "react"
import { Copy, Eye, EyeOff, CheckCircle2, Loader2 } from "lucide-react"
import { saveApiKey } from "@/app/(dashboard)/settings/actions/api-keys"

interface ApiVaultProps {
  initialKeys: { service_name: string; encrypted_key: string }[]
}

export function ApiVault({ initialKeys }: ApiVaultProps) {
  const [isPending, startTransition] = useTransition()
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")
  
  // State for keys
  const [keys, setKeys] = useState(() => {
    const defaultState = { gemini: "", cloudinary: "", adobeUser: "", adobePass: "" }
    const safeKeys = initialKeys || [];
    safeKeys.forEach(k => {
      if (k.service_name === "gemini") defaultState.gemini = k.encrypted_key
      if (k.service_name === "cloudinary") defaultState.cloudinary = k.encrypted_key
      // Assuming adobe_sftp stores "$user:$pass"
      if (k.service_name === "adobe_sftp") {
         const [u, p] = k.encrypted_key.split(":")
         if (u) defaultState.adobeUser = u
         if (p) defaultState.adobePass = p
      }
    })
    return defaultState
  })

  // State for visibility toggling
  const [showGemini, setShowGemini] = useState(false)
  const [showCloudinary, setShowCloudinary] = useState(false)
  const [showAdobePass, setShowAdobePass] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleSave = () => {
    setSaveStatus("saving")
    startTransition(async () => {
       try {
         if (keys.gemini) await saveApiKey("gemini", keys.gemini)
         if (keys.cloudinary) await saveApiKey("cloudinary", keys.cloudinary)
         if (keys.adobeUser || keys.adobePass) {
             await saveApiKey("adobe_sftp", `${keys.adobeUser}:${keys.adobePass}`)
         }
         setSaveStatus("success")
         setTimeout(() => setSaveStatus("idle"), 2000)
       } catch {
         setSaveStatus("error")
         setTimeout(() => setSaveStatus("idle"), 3000)
       }
    })
  }

  return (
    <>
      <section className="space-y-6">
        <div className="border-b border-[var(--border)] pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium tracking-tight text-[var(--foreground)]">API Vault</h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">These keys are encrypted before being stored in the database.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isPending || saveStatus === "success"}
            className="bg-[var(--foreground)] text-[var(--background)] px-6 py-2 rounded-md font-medium text-sm hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isPending && <Loader2 className="animate-spin" size={16} />}
            {saveStatus === "success" && <CheckCircle2 size={16} />}
            {saveStatus === "success" ? "Saved" : saveStatus === "error" ? "Error" : "Save Keys"}
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <label className="text-sm font-semibold text-[var(--foreground)]">Gemini API Key</label>
            <div className="relative">
              <input 
                type={showGemini ? "text" : "password"} 
                value={keys.gemini}
                onChange={(e) => setKeys({...keys, gemini: e.target.value})}
                placeholder="AIzaSy..."
                className="w-full text-sm p-3 pr-24 bg-[var(--muted)] border border-[var(--border)] rounded-md focus:border-[var(--foreground)] text-[var(--foreground)] outline-none transition-colors font-mono"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <button type="button" onClick={() => setShowGemini(!showGemini)} className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors rounded-md hover:bg-[var(--border)]">
                  {showGemini ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button type="button" onClick={() => handleCopy(keys.gemini)} className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors rounded-md hover:bg-[var(--border)]">
                  <Copy size={16} />
                </button>
              </div>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">Required for Smart Prompt Engineering and Vision AI Quality Control.</p>
          </div>

          <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
            <label className="text-sm font-semibold text-[var(--foreground)]">Cloudinary URL</label>
            <div className="relative">
              <input 
                type={showCloudinary ? "text" : "password"} 
                value={keys.cloudinary}
                onChange={(e) => setKeys({...keys, cloudinary: e.target.value})}
                placeholder="cloudinary://API_KEY:API_SECRET@CLOUD_NAME"
                className="w-full text-sm p-3 pr-24 bg-[var(--muted)] border border-[var(--border)] rounded-md focus:border-[var(--foreground)] text-[var(--foreground)] outline-none transition-colors font-mono"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <button type="button" onClick={() => setShowCloudinary(!showCloudinary)} className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors rounded-md hover:bg-[var(--border)]">
                  {showCloudinary ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button type="button" onClick={() => handleCopy(keys.cloudinary)} className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors rounded-md hover:bg-[var(--border)]">
                  <Copy size={16} />
                </button>
              </div>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">Required for storing the generated AI images.</p>
          </div>


          <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
            <label className="text-sm font-semibold text-[var(--foreground)]">Adobe Stock SFTP Credentials</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1 block">Member ID / Username</label>
                  <input 
                    type="text" 
                    value={keys.adobeUser}
                    onChange={(e) => setKeys({...keys, adobeUser: e.target.value})}
                    placeholder="Member ID" 
                    className="w-full text-sm p-3 bg-[var(--muted)] border border-[var(--border)] rounded-md focus:border-[var(--foreground)] text-[var(--foreground)] outline-none font-mono" 
                />
               </div>
               <div className="relative">
                  <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1 block">SFTP Password</label>
                  <input 
                    type={showAdobePass ? "text" : "password"} 
                    value={keys.adobePass}
                    onChange={(e) => setKeys({...keys, adobePass: e.target.value})}
                    placeholder="SFTP Password" 
                    className="w-full text-sm p-3 pr-10 bg-[var(--muted)] border border-[var(--border)] rounded-md focus:border-[var(--foreground)] text-[var(--foreground)] outline-none font-mono" 
                />
                  <button type="button" onClick={() => setShowAdobePass(!showAdobePass)} className="absolute right-3 top-[28px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                    {showAdobePass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
               </div>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">Required for the final automated delivery step.</p>
          </div>
        </div>
      </section>
    </>
  )
}
