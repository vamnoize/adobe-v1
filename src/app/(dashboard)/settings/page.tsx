import { getApiKeys } from "./actions/api-keys";
import { ApiVault } from "@/components/settings/ApiVault";

export default async function Settings() {
  const apiKeys = await getApiKeys();

  return (
    <div className="max-w-3xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <h1 className="text-3xl font-light tracking-tight mb-2 text-[var(--foreground)]">Settings & Security</h1>
        <p className="text-[var(--muted-foreground)]">Manage your API keys, model configurations, and system preferences.</p>
      </div>

      <ApiVault initialKeys={apiKeys as unknown as { service_name: string; encrypted_key: string }[]} />

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
