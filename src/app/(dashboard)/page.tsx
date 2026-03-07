import { ChevronDown, Play } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div>
        <h1 className="text-3xl font-light tracking-tight mb-2 text-[var(--foreground)]">Task Launcher</h1>
        <p className="text-[var(--muted-foreground)]">Enter a keyword to initiate the automated stock photo pipeline.</p>
      </div>

      <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
        <div className="space-y-6">
          <div>
            <label htmlFor="keyword" className="block text-sm font-medium mb-2 text-[var(--foreground)]">Primary Keyword or Concept</label>
            <input
              type="text"
              id="keyword"
              placeholder="e.g. 'cinematic macro shot of a raindrop on a leaf'"
              className="w-full text-lg p-4 bg-transparent border-b-2 border-[var(--border)] focus:border-[var(--foreground)] text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted-foreground)]"
            />
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-xs font-medium mb-2 text-[var(--muted-foreground)] uppercase tracking-wider">Image Generator Model</label>
              <div className="relative">
                <select className="w-full appearance-none bg-[var(--muted)] border border-[var(--border)] rounded-md px-4 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]">
                  <option>Replicate / Flux.1</option>
                  <option>Leonardo.ai</option>
                  <option>Stable Diffusion XL</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" size={16} />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium mb-2 text-[var(--muted-foreground)] uppercase tracking-wider">Upscaler Model</label>
              <div className="relative">
                <select className="w-full appearance-none bg-[var(--muted)] border border-[var(--border)] rounded-md px-4 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]">
                  <option>Real-ESRGAN x4</option>
                  <option>Topaz Gigapixel</option>
                  <option>None (Raw Resolution)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] pointer-events-none" size={16} />
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
             <button className="bg-[var(--foreground)] text-[var(--background)] px-6 py-3 rounded-md font-medium text-sm flex items-center gap-2 hover:opacity-90 transition-opacity">
                <Play size={16} />
                Launch Pipeline
             </button>
          </div>
        </div>
      </div>

      <div className="pt-8">
        <h2 className="text-xl font-medium tracking-tight mb-8 text-[var(--foreground)]">Active Workflows</h2>
        
        {/* Sample Workflow Item */}
        <div className="border border-[var(--border)] rounded-xl p-6 relative overflow-hidden bg-[var(--background)]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-medium text-lg text-[var(--foreground)]">"Cinematic macro shot of a raindrop"</h3>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">Started 2 mins ago • 10 variants</p>
            </div>
            <span className="text-xs font-medium px-3 py-1 bg-[var(--foreground)] text-[var(--background)] rounded-full">Generating</span>
          </div>

          {/* Minimal Progress Tracker */}
          <div className="relative pt-4 pb-2">
            <div className="absolute top-6 left-0 w-full h-[2px] bg-[var(--border)]">
              <div className="h-full bg-[var(--foreground)] transition-all duration-1000" style={{ width: '40%' }}></div>
            </div>
            
            <div className="flex justify-between relative z-10 px-2">
              <div className="flex flex-col items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[var(--foreground)] flex items-center justify-center border-[3px] border-[var(--background)] shadow-sm"></div>
                <span className="text-xs font-medium text-[var(--foreground)]">Prompting</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[var(--foreground)] flex items-center justify-center border-[3px] border-[var(--background)] shadow-sm">
                   <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-[var(--background)]"></div>
                </div>
                <span className="text-xs font-medium text-[var(--foreground)]">Generating</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[var(--muted)] border-[3px] border-[var(--background)] shadow-sm"></div>
                <span className="text-xs text-[var(--muted-foreground)]">Upscaling</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[var(--muted)] border-[3px] border-[var(--background)] shadow-sm"></div>
                <span className="text-xs text-[var(--muted-foreground)]">Uploading</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
