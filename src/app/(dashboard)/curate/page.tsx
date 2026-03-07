import { Check, X } from "lucide-react";
import Image from "next/image";

export default function Curate() {
  return (
    <div className="h-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
      
      <div className="w-full max-w-4xl relative">
        <div className="absolute right-0 top-0 -translate-y-full pb-4">
           <div className="bg-[var(--muted)] border border-[var(--border)] px-4 py-3 rounded-lg flex items-center justify-between gap-8 shadow-sm">
             <div>
               <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider font-semibold mb-1">Generated Prompt</p>
               <p className="text-sm font-medium text-[var(--foreground)] truncate max-w-sm">"Cinematic macro shot of a raindrop..."</p>
             </div>
             <div className="text-right border-l border-[var(--border)] pl-6">
               <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider font-semibold mb-1">Realism Score</p>
               <p className="text-sm font-bold text-emerald-600">9.2 / 10</p>
             </div>
           </div>
        </div>

        <div className="aspect-video w-full bg-[var(--muted)] rounded-2xl overflow-hidden border border-[var(--border)] shadow-md relative group flex items-center justify-center">
             {/* Using a placeholder for the generated image */}
             <div className="absolute inset-0 bg-gradient-to-tr from-zinc-200 to-zinc-100 flex items-center justify-center text-zinc-400">
                [High Res Generated Image Preview]
             </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-12">
          <button className="w-20 h-20 rounded-full border-2 border-[var(--border)] flex items-center justify-center text-[var(--muted-foreground)] hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm">
            <X size={32} strokeWidth={1.5} />
          </button>
          <button className="w-20 h-20 rounded-full bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center hover:bg-emerald-600 hover:scale-105 transition-all shadow-md">
            <Check size={32} strokeWidth={2.5} />
          </button>
        </div>
        
        <div className="mt-8 text-center text-sm text-[var(--muted-foreground)] font-medium">
          3 of 10 images reviewed
        </div>
      </div>

    </div>
  );
}
