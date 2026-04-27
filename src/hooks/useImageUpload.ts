import { useState, useCallback } from 'react'
import { validateImageFile, generateFileName, getImagePath } from '@/lib/image-validation'

interface UseImageUploadOptions {
  onSuccess?: (imagePath: string, fileName: string) => void
  onError?: (error: string) => void
}

export function useImageUpload(options?: UseImageUploadOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(null)

  const uploadImage = useCallback(
    async (file: File, adId?: string) => {
      setLoading(true)
      setError(null)

      try {
        // Validate file
        const validation = await validateImageFile(file)
        if (!validation.isValid) {
          const errorMsg = validation.error || 'Validation failed'
          setError(errorMsg)
          options?.onError?.(errorMsg)
          setLoading(false)
          return null
        }

        // Upload to server
        const formData = new FormData()
        formData.append('image', file)
        formData.append('adId', adId || 'temp-' + Date.now())

        const response = await fetch('/api/ads/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Upload failed')
        }

        const data = await response.json()
        setUploadedImagePath(data.imagePath)
        options?.onSuccess?.(data.imagePath, data.fileName)

        return data
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Upload failed'
        setError(errorMsg)
        options?.onError?.(errorMsg)
        return null
      } finally {
        setLoading(false)
      }
    },
    [options]
  )

  const resetError = useCallback(() => {
    setError(null)
  }, [])

  const clearUpload = useCallback(() => {
    setUploadedImagePath(null)
    setError(null)
  }, [])

  return {
    uploadImage,
    loading,
    error,
    uploadedImagePath,
    resetError,
    clearUpload,
  }
}
