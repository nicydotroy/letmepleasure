'use client'

import { useState } from 'react'
import ImageUploader from './ImageUploader'
import { AlertCircle, CheckCircle, Loader } from 'lucide-react'

interface AdFormWithImagesProps {
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

export default function AdFormWithImages({
  onSuccess,
  onError,
}: AdFormWithImagesProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [city, setCity] = useState('')
  const [area, setArea] = useState('')

  const handleImageSelect = (file: File) => {
    setSelectedImage(file)
    setUploadError(null)
    setUploadSuccess(false)
  }

  const handleUploadImage = async () => {
    if (!selectedImage) {
      setUploadError('Please select an image first')
      return
    }

    setUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('image', selectedImage)
      formData.append('adId', 'temp-' + Date.now()) // Temporary ID for new ads

      const response = await fetch('/api/ads/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setUploadedImagePath(data.imagePath)
      setUploadSuccess(true)
      setSelectedImage(null)

      // Auto-hide success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000)
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'Failed to upload image'
      setUploadError(errorMsg)
      onError?.(errorMsg)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmitAd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!title.trim()) {
      alert('Please enter a title')
      return
    }

    if (!uploadedImagePath) {
      alert('Please upload an image for your ad')
      return
    }

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('category', category)
      formData.append('price', price)
      formData.append('phone', phone)
      formData.append('whatsapp', whatsapp)
      formData.append('citySlug', city)
      formData.append('areaSlug', area)
      formData.append('images', uploadedImagePath) // Store image path in DB

      const response = await fetch('/api/ads', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create ad')
      }

      // Reset form
      setTitle('')
      setDescription('')
      setCategory('')
      setPrice('')
      setPhone('')
      setWhatsapp('')
      setCity('')
      setArea('')
      setUploadedImagePath(null)

      onSuccess?.(data)
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'Failed to create ad'
      onError?.(errorMsg)
    }
  }

  return (
    <form onSubmit={handleSubmitAd} className="space-y-6">
      {/* Image Upload Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Add Images</h3>

        <ImageUploader
          onImageSelect={handleImageSelect}
          onError={setUploadError}
        />

        <button
          type="button"
          onClick={handleUploadImage}
          disabled={!selectedImage || uploading}
          className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            'Upload Image'
          )}
        </button>

        {uploadError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{uploadError}</p>
          </div>
        )}

        {uploadSuccess && uploadedImagePath && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-green-700">Image uploaded successfully!</p>
          </div>
        )}
      </div>

      {/* Ad Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Ad Details</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter ad title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter ad description"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Select category</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="vehicles">Vehicles</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp
            </label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Enter WhatsApp number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Area
            </label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Enter area"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
      >
        Post Advertisement
      </button>
    </form>
  )
}
