import { v2 as cloudinary } from 'cloudinary';

function configureCloudinary(cloudinaryUrl: string) {
  if (!cloudinaryUrl) return;
  const match = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
  console.log("Cloudinary URL match:", match);
  if (match) {
    const [, apiKey, apiSecret, cloudName] = match;
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });
  } else {
    process.env.CLOUDINARY_URL = cloudinaryUrl;
  }
}

export async function uploadImageToCloudinary(url: string, cloudinaryUrl: string, publicId: string): Promise<string> {
  if (!cloudinaryUrl) throw new Error("Cloudinary URL config missing");
  configureCloudinary(cloudinaryUrl);

  try {
    const result = await cloudinary.uploader.upload(url, {
      public_id: publicId,
      resource_type: "image",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload image to Cloudinary.");
  }
}

export async function deleteImageFromCloudinary(publicId: string, cloudinaryUrl: string) {
  configureCloudinary(cloudinaryUrl);
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error(`Failed to delete asset ${publicId} from Cloudinary:`, err);
  }
}
