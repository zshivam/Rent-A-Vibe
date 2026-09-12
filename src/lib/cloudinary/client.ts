import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure:     true,
});

/**
 * Shared Cloudinary SDK instance.
 * ⚠️  Server-side only — contains the api_secret.
 */
export { cloudinary };

/**
 * Generates a signed upload URL for KYC document uploads.
 * Called from the /api/kyc/get-upload-url route so the api_secret
 * never touches the browser.
 *
 * @param userId    - The user's Supabase UUID (used as folder path)
 * @param bookingId - The booking ID for context
 */
export async function generateKycUploadSignature(userId: string, bookingId: string) {
  const timestamp = Math.round(Date.now() / 1000);
  const folder = `rent-a-vibe/kyc/${userId}`;
  const publicId = `${bookingId}-id-document`;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  const paramsToSign = {
    folder,
    public_id: publicId,
    timestamp,
    upload_preset: uploadPreset,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    signature,
    timestamp,
    folder,
    public_id: publicId,
    upload_preset: uploadPreset,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
  };
}
