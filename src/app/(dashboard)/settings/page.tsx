import { Copy, Eye, EyeOff } from "lucide-react";

export default function Settings() {
  return (
    <div className="max-w-3xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <h1 className="text-3xl font-light tracking-tight mb-2 text-[var(--foreground)]">Settings & Security</h1>
        <p className="text-[var(--muted-foreground)]">Manage your API keys, model configurations, and system preferences.</p>
      </div>

      <section className="space-y-6">
        <div className="border-b border-[var(--border)] pb-4">
          <h2 className="text-xl font-medium tracking-tight text-[var(--foreground)]">API Vault</h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">These keys are encrypted before being stored in the database.</p>
        </div>

        <div className="space-y-6">
          
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <label className="text-sm font-semibold text-[var(--foreground)]">Gemini API Key</label>
            <div className="relative">
              <input 
                type="password" 
                defaultValue="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full text-sm p-3 pr-24 bg-[var(--muted)] border border-[var(--border)] rounded-md focus:border-[var(--foreground)] text-[var(--foreground)] outline-none transition-colors font-mono"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <button className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors rounded-md hover:bg-[var(--border)]">
                  <Eye size={16} />
                </button>
                <button className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors rounded-md hover:bg-[var(--border)]">
                  <Copy size={16} />
                </button>
              </div>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">Required for Smart Prompt Engineering and Vision AI Quality Control.</p>
          </div>

          <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
            <label className="text-sm font-semibold text-[var(--foreground)]">Replicate / Image API Key</label>
            <div className="relative">
              <input 
                type="password" 
                placeholder="Enter your API Key..."
                className="w-full text-sm p-3 pr-24 bg-[var(--muted)] border border-[var(--border)] rounded-md focus:border-[var(--foreground)] text-[var(--foreground)] outline-none transition-colors font-mono"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <button className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors rounded-md hover:bg-[var(--border)]">
                  <Copy size={16} />
                </button>
              </div>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">Required for generating the initial images.</p>
          </div>

          <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
            <label className="text-sm font-semibold text-[var(--foreground)]">Adobe Stock SFTP Credentials</label>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1 block">Username</label>
                  <input type="text" placeholder="Member ID" className="w-full text-sm p-3 bg-[var(--muted)] border border-[var(--border)] rounded-md focus:border-[var(--foreground)] text-[var(--foreground)] outline-none font-mono" />
               </div>
               <div className="relative">
                  <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1 block">Password</label>
                  <input type="password" placeholder="SFTP Password" className="w-full text-sm p-3 pr-10 bg-[var(--muted)] border border-[var(--border)] rounded-md focus:border-[var(--foreground)] text-[var(--foreground)] outline-none font-mono" />
                  <button className="absolute right-3 top-[28px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                    <Eye size={16} />
                  </button>
               </div>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">Required for the final automated delivery step.</p>
          </div>

        </div>
      </section>

      <section className="space-y-6">
        <div className="border-b border-[var(--border)] pb-4">
          <h2 className="text-xl font-medium tracking-tight text-[var(--foreground)]">Model Config</h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Configure default endpoints and thresholds.</p>
        </div>

         <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 shadow-sm grid grid-cols-2 gap-8">
            <div>
               <label className="block text-sm font-semibold mb-2 text-[var(--foreground)]">Auto-Reject Threshold</label>
               <div className="flex items-center gap-4">
                 <input type="range" min="1" max="10" defaultValue="7" className="w-full accent-[var(--foreground)]" />
                 <span className="text-sm font-mono font-bold bg-[var(--muted)] px-3 py-1 rounded-md border border-[var(--border)]">7.0</span>
               </div>
               <p className="text-xs text-[var(--muted-foreground)] mt-2">Images scoring below this on Realism will be automatically discarded.</p>
            </div>
            
            <div>
               <label className="block text-sm font-semibold mb-2 text-[var(--foreground)]">Images Per Prompt</label>
               <input type="number" min="1" max="20" defaultValue="10" className="w-full text-sm p-3 bg-[var(--muted)] border border-[var(--border)] rounded-md focus:border-[var(--foreground)] text-[var(--foreground)] outline-none font-mono" />
               <p className="text-xs text-[var(--muted-foreground)] mt-2">Number of variants to generate for each LLM-expanded prompt.</p>
            </div>
         </div>
      </section>

      <div className="pt-8 flex justify-end">
        <button className="bg-[var(--background)] text-[var(--foreground)] border-2 border-[var(--foreground)] px-8 py-3 rounded-md font-medium text-sm hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all flex items-center gap-2">
          Save Changes
        </button>
      </div>

    </div>
  );
}
