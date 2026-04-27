/**
 * Image validation and utilities for advertisement uploads
 */

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif']
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_DIMENSION = 4000 // pixels

export interface ImageValidationResult {
  isValid: boolean
  error?: string
  fileName?: string
}

/**
 * Validate image file
 */
export async function validateImageFile(file: File): Promise<ImageValidationResult> {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
    }
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`,
    }
  }

  // Check file extension
  const fileName = file.name.toLowerCase()
  const extension = fileName.split('.').pop()
  if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      isValid: false,
      error: `Invalid file extension. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`,
    }
  }

  // Validate image dimensions
  try {
    const dimensions = await getImageDimensions(file)
    if (dimensions.width > MAX_DIMENSION || dimensions.height > MAX_DIMENSION) {
      return {
        isValid: false,
        error: `Image dimensions exceed ${MAX_DIMENSION}x${MAX_DIMENSION}px limit`,
      }
    }
  } catch (error) {
    return {
      isValid: false,
      error: 'Failed to validate image dimensions',
    }
  }

  // Generate safe filename
  const safeFileName = generateFileName(fileName)

  return {
    isValid: true,
    fileName: safeFileName,
  }
}

/**
 * Get image dimensions
 */
async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }
      img.src = event.target?.result as string
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Generate safe filename with timestamp
 */
export function generateFileName(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg'

  // Remove special characters and spaces
  const baseName = originalName
    .split('.')[0]
    .replace(/[^a-z0-9]/gi, '-')
    .toLowerCase()
    .substring(0, 20)

  return `${baseName}-${timestamp}-${random}.${extension}`
}

/**
 * Get image path for URL
 */
export function getImagePath(fileName: string): string {
  return `/uploads/ads/${fileName}`
}

/**
 * Validate multiple files
 */
export async function validateMultipleImages(
  files: File[]
): Promise<{ valid: File[]; invalid: ImageValidationResult[] }> {
  const results = await Promise.all(files.map((file) => validateImageFile(file)))

  const valid: File[] = []
  const invalid: ImageValidationResult[] = []

  files.forEach((file, index) => {
    if (results[index].isValid) {
      valid.push(file)
    } else {
      invalid.push(results[index])
    }
  })

  return { valid, invalid }
}
