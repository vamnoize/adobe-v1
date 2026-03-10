"use client"

import { useState, useTransition } from "react"
import { Check, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { AssetWithTask, updateAssetStatus } from "@/app/(dashboard)/actions/curation"
import { processDelivery } from "@/app/(dashboard)/actions/delivery"

interface AssetReviewGalleryProps {
  initialAssets: AssetWithTask[]
}

export function AssetReviewGallery({ initialAssets }: AssetReviewGalleryProps) {
  // We manage the list of assets to review purely in client state so we can optimistically pop them off
  const [assetsToReview, setAssetsToReview] = useState<AssetWithTask[]>(initialAssets)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPending, startTransition] = useTransition()
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null)

  // The asset currently being displayed
  const currentAsset = assetsToReview[currentIndex]

  const handleDecision = (status: "approved" | "rejected") => {
    if (!currentAsset) return

    // Optimistically update the UI to move to the next image immediately
    const nextIndex = currentIndex + 1
    
    // Fire the server action in the background
    startTransition(async () => {
      await updateAssetStatus(currentAsset.id, status)
      
      // If we've reviewed the last image, the component will naturally render the "All Caught Up" state
      setCurrentIndex(nextIndex)
    })
  }

  // If there are no assets passed from the server, or we've iterated past the end of our local array
  if (!assetsToReview.length || currentIndex >= assetsToReview.length) {
    const hasReviewedThisSession = initialAssets.length > 0;

    return (
      <div className="h-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
         <div className="text-center space-y-6">
            <h2 className="text-2xl font-light tracking-tight text-[var(--foreground)]">All Caught Up</h2>
            <p className="text-[var(--muted-foreground)] max-w-sm mx-auto">
              You have reviewed all pending generated assets. 
              {hasReviewedThisSession ? " Ready to upscale and deliver the approved assets to Adobe Stock?" : " Launch a new task to create more."}
            </p>
            
            {hasReviewedThisSession && (
              <div className="space-y-4">
                <button 
                  disabled={isPending}
                  onClick={() => {
                     setDeliveryStatus("Delivering assets to Adobe Stock...")
                     startTransition(async () => {
                       const uniqueTaskIds = Array.from(new Set(initialAssets.map(a => a.task_id)));
                       for (const tId of uniqueTaskIds) {
                         const result = await processDelivery(tId);
                         if (result.error) {
                           setDeliveryStatus(`Error: ${result.error}`)
                           return
                         }
                       }
                       setDeliveryStatus("Delivery complete! Check your Adobe Stock portal.")
                     })
                  }}
                  className="px-8 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3 mx-auto"
                >
                  {isPending ? <Loader2 className="animate-spin" size={20} /> : null}
                  {isPending ? "Processing Delivery..." : "Deliver Approved Assets"}
                </button>
                {deliveryStatus && (
                  <p className={`text-sm font-medium ${deliveryStatus.startsWith("Error") ? "text-red-500" : "text-emerald-500"}`}>
                    {deliveryStatus}
                  </p>
                )}
              </div>
            )}
         </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500 relative">
      
      {/* Preload the NEXT image so it's instantly ready when they click approve/reject */}
      {currentIndex + 1 < assetsToReview.length && assetsToReview[currentIndex + 1].raw_url && (
        <link rel="preload" as="image" href={assetsToReview[currentIndex + 1].raw_url!} />
      )}

      <div className="w-full max-w-4xl relative">
        <div className="absolute left-1/2 -top-12 -translate-x-1/2 z-20 w-max">
           <div className="bg-[var(--background)] border border-[var(--border)] px-6 py-2 rounded-full flex items-center gap-3 shadow-sm">
             <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted-foreground)]">Prompt</span>
             <p className="text-xs font-medium text-[var(--foreground)] max-w-lg truncate italic" title={currentAsset.prompt_used}>
               &quot;{currentAsset.prompt_used}&quot;
             </p>
           </div>
        </div>

        <div className="aspect-video w-full max-w-4xl mx-auto bg-black rounded-3xl overflow-hidden border border-[var(--border)] shadow-2xl relative group flex items-center justify-center">
             
             {isPending && (
                <div className="absolute inset-0 z-10 bg-[var(--background)]/50 backdrop-blur-sm flex items-center justify-center">
                   <Loader2 className="animate-spin text-[var(--foreground)]" size={32} />
                </div>
             )}

             {currentAsset.raw_url ? (
                <Image 
                    src={currentAsset.raw_url} 
                    alt="Generated Preview" 
                    fill 
                    className="object-contain"
                    priority
                    unoptimized
                />
             ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[var(--muted-foreground)]">
                   Image URL missing or invalid
                </div>
             )}
        </div>

        <div className="mt-12 flex items-center justify-center gap-12 relative z-20">
          <button 
            disabled={isPending}
            onClick={() => handleDecision("rejected")}
            className="w-20 h-20 rounded-full border-2 border-[var(--border)] bg-[var(--background)] flex items-center justify-center text-[var(--muted-foreground)] hover:border-red-500 hover:text-red-500 transition-all shadow-sm disabled:opacity-50"
            title="Reject Image"
          >
            <X size={32} strokeWidth={1.5} />
          </button>
          
          <button 
            disabled={isPending}
            onClick={() => handleDecision("approved")}
            className="w-20 h-20 rounded-full bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center hover:bg-emerald-600 hover:scale-105 transition-all shadow-md disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-[var(--foreground)]"
            title="Approve for Adobe Stock Delivery"
          >
            <Check size={32} strokeWidth={2.5} />
          </button>
        </div>
        
        <div className="mt-8 text-center text-sm text-[var(--muted-foreground)] font-medium">
          {currentIndex + 1} of {assetsToReview.length} images to review
        </div>
      </div>

    </div>
  )
}
