import { v2 as cloudinary } from 'cloudinary'

// Configured from environment variables (set these on Render and in .env):
//   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  )
}

// Upload an image buffer to Cloudinary and return its permanent secure URL.
export async function uploadImageToCloudinary(buffer: Buffer, mimeType: string): Promise<string> {
  const dataUri = `data:${mimeType};base64,${buffer.toString('base64')}`
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'letmepleasure/ads',
    resource_type: 'image',
    // Cap very large uploads and auto-pick the best format/quality.
    transformation: [{ width: 1600, height: 1600, crop: 'limit' }, { quality: 'auto', fetch_format: 'auto' }],
  })
  return result.secure_url
}

export { cloudinary }
