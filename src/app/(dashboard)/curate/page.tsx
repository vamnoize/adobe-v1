import { getPendingAssets } from "../actions/curation";
import { AssetReviewGallery } from "@/components/curation/AssetReviewGallery";

export default async function Curate() {
  const pendingAssets = await getPendingAssets();

  return (
    <div className="h-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
      <AssetReviewGallery initialAssets={pendingAssets} />
    </div>
  );
}
