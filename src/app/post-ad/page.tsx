'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, CheckCircle, AlertCircle, Phone, MessageCircle, MapPin, Tag, Mail } from 'lucide-react'
import { CITIES } from '@/lib/cities'
import { CATEGORIES } from '@/lib/categories'
import { CONTACT, CONTACT_PHONE_DISPLAY } from '@/lib/contact'
import Image from 'next/image'

interface FormData {
  title: string
  description: string
  category: string
  price: string
  citySlug: string
  areaSlug: string
  phone: string
  whatsapp: string
}

export default function PostAdPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    price: '',
    citySlug: '',
    areaSlug: '',
    phone: '',
    whatsapp: '',
  })
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [adId, setAdId] = useState('')
  const [error, setError] = useState('')

  const selectedCity = CITIES.find((c) => c.slug === form.citySlug)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => {
      if (name === 'citySlug') return { ...prev, citySlug: value, areaSlug: '' }
      return { ...prev, [name]: value }
    })
  }

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const valid = files.filter(
      (f) => f.size <= 5 * 1024 * 1024 && f.type.startsWith('image/')
    )
    const remaining = 5 - images.length
    const toAdd = valid.slice(0, remaining)
    setImages((prev) => [...prev, ...toAdd])
    toAdd.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError('Please enter a valid 10-digit Indian mobile number.')
      return
    }
    if (form.whatsapp && !/^[6-9]\d{9}$/.test(form.whatsapp)) {
      setError('Please enter a valid 10-digit WhatsApp number.')
      return
    }

    setSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      images.forEach((img) => fd.append('images', img))

      const res = await fetch('/api/ads', { method: 'POST', body: fd })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to post ad. Please try again.')
        return
      }

      setAdId(data.ad.id)
      setSuccess(true)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    const waMsg = encodeURIComponent(
      `Hi, I just posted an ad on Letme Pleasure (ID: ${adId || 'N/A'}). I'd like to activate/feature it — please share the payment details.`
    )
    return (
      <div className="min-h-screen bg-[#FFF1F7] flex items-center justify-center px-4 py-12">
        <div className="text-center bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-pink-100 max-w-md mx-auto w-full">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="text-green-600" size={40} />
          </div>
          <h2 className="text-2xl font-black text-[#2A0618] mb-2">Ad Submitted!</h2>
          <p className="text-slate-600 font-semibold mb-1">✓ Your ad has been submitted successfully</p>
          <p className="text-slate-500 text-sm">⏳ Awaiting admin approval before going live</p>

          {/* Payment / contact options */}
          <div className="mt-7 bg-[#FFF1F7] rounded-2xl p-5 border border-pink-100 text-left">
            <p className="text-sm font-black text-[#2A0618] text-center mb-1">
              💳 Activate / Feature your ad faster
            </p>
            <p className="text-xs text-slate-500 text-center mb-4 leading-relaxed">
              Contact us to complete payment and get your ad approved &amp; featured at the top.
            </p>
            <div className="space-y-2.5">
              <a
                href={`https://wa.me/${CONTACT.whatsapp}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-600 transition-colors"
              >
                <MessageCircle size={16} /> Chat on WhatsApp
              </a>
              <a
                href={`tel:${CONTACT.phoneIntl}`}
                className="flex items-center justify-center gap-2 w-full bg-pink-500 text-[#2A0618] py-3 rounded-xl font-bold text-sm hover:bg-pink-400 transition-colors"
              >
                <Phone size={16} /> Call {CONTACT_PHONE_DISPLAY}
              </a>
              <a
                href={`mailto:${CONTACT.email}?subject=${encodeURIComponent('Ad payment / activation — ' + (adId || ''))}`}
                className="flex items-center justify-center gap-2 w-full bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm hover:border-pink-400 hover:text-pink-600 transition-colors"
              >
                <Mail size={16} /> {CONTACT.email}
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push(adId ? `/ads/${adId}` : '/')}
            className="mt-5 text-sm font-semibold text-pink-600 hover:text-pink-700 transition-colors"
          >
            View my ad →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF1F7]">
      {/* Hero bar */}
      <div className="bg-[#2A0618] py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-pink-500/10 text-pink-400 border border-pink-500/20 px-4 py-1.5 rounded-full text-xs font-bold mb-4">
            ✨ 100% Free · No Registration Required
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Post Your Free Ad</h1>
          <p className="text-pink-300 text-sm">Reach thousands in your city — live in 60 seconds</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-16">
        {/* Trust pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {['🆓 Zero Fees', '📸 5 Photos', '📍 12 Cities', '⚡ Live Instantly', '🔒 Secure'].map((t) => (
            <span key={t} className="text-xs bg-white border border-pink-100 text-slate-600 px-3 py-1.5 rounded-full font-semibold shadow-sm">{t}</span>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-pink-50 p-6 sm:p-8 space-y-6">

          {/* Category */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <Tag size={15} className="text-pink-600" /> Category *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Ad Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={100}
              placeholder="Write a clear, descriptive title..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
            />
            <p className="text-xs text-slate-400 mt-1">{form.title.length}/100</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              maxLength={1000}
              rows={4}
              placeholder="Describe your services in detail..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm resize-none"
            />
            <p className="text-xs text-slate-400 mt-1">{form.description.length}/1000</p>
          </div>

          {/* Price */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              ₹ Price
            </label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              type="number"
              min="0"
              placeholder="Leave blank if negotiable"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
            />
          </div>

          {/* Location */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <MapPin size={15} className="text-pink-600" /> Location *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <select
                name="citySlug"
                value={form.citySlug}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-xl border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
              >
                <option value="">Select City</option>
                {CITIES.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
              <select
                name="areaSlug"
                value={form.areaSlug}
                onChange={handleChange}
                required
                disabled={!selectedCity}
                className="px-4 py-3 rounded-xl border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">Select Area</option>
                {selectedCity?.areas.map((a) => (
                  <option key={a.slug} value={a.slug}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Photos (up to 5)</label>
            <div className="flex flex-wrap gap-3">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-pink-100">
                  <Image src={src} alt="" fill className="object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5">
                    <X size={10} />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-pink-200 flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-colors text-slate-400 hover:text-pink-600">
                  <Upload size={18} />
                  <span className="text-xs mt-1">Add</span>
                  <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
                </label>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1.5">Max 5 images, 5MB each. JPG, PNG, WebP</p>
          </div>

          {/* Contact */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
              <Phone size={15} className="text-pink-600" /> Contact Details *
            </label>
            <div className="space-y-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">+91</span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  type="tel"
                  maxLength={10}
                  placeholder="Mobile Number *"
                  pattern="[6-9][0-9]{9}"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                />
              </div>
              <div className="relative">
                <MessageCircle size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" />
                <span className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 text-sm">+91</span>
                <input
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  type="tel"
                  maxLength={10}
                  placeholder="WhatsApp Number (optional)"
                  className="w-full pl-16 pr-4 py-3 rounded-xl border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-pink-500 text-[#2A0618] py-4 rounded-xl font-black text-base hover:bg-pink-400 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Posting your ad...' : '🚀 Post Ad for FREE'}
          </button>

          <p className="text-center text-xs text-slate-400">
            By posting, you agree to our Terms of Service. Your contact info is only shared with interested buyers.
          </p>
        </form>
      </div>
    </div>
  )
}
