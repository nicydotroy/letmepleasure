'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, CheckCircle, XCircle, Clock, Eye, FileText, MapPin } from 'lucide-react'

interface Ad {
  id: string
  title: string
  description: string
  category: string
  city: string
  area: string
  phone: string
  status: string
  createdAt: string
  price?: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchAds()
  }, [filter])

  const fetchAds = async () => {
    try {
      const res = await fetch(`/api/admin/ads?status=${filter}`)
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      const data = await res.json()
      setAds(data.ads || [])
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (adId: string, action: 'approve' | 'reject') => {
    setActionLoading(adId)
    try {
      const res = await fetch('/api/admin/ads/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId, action }),
      })

      if (res.ok) {
        setAds(ads.filter((ad) => ad.id !== adId))
      }
    } catch (error) {
      console.error('Action error:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#FFF1F7]">
      {/* Header */}
      <header className="bg-[#2A0618] text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FBBF24] rounded-lg flex items-center justify-center">
              <span className="font-black text-[#2A0618]">L</span>
            </div>
            <h1 className="text-2xl font-black">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/content"
              className="flex items-center gap-2 bg-pink-500 hover:bg-pink-400 text-[#2A0618] px-4 py-2 rounded-lg font-bold transition-colors"
            >
              <FileText size={18} />
              Edit Page Content
            </Link>
            <Link
              href="/admin/locations"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold transition-colors"
            >
              <MapPin size={18} />
              Locations
            </Link>
            <Link
              href="/admin/blog"
              className="flex items-center gap-2 bg-pink-500 hover:bg-pink-400 text-[#2A0618] px-4 py-2 rounded-lg font-bold transition-colors"
            >
              <FileText size={18} />
              Manage Blog
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border-l-4 border-yellow-500 shadow-sm">
            <p className="text-pink-500 font-bold text-sm">Pending Review</p>
            <p className="text-3xl font-black text-[#2A0618]">
              {filter === 'pending' ? ads.length : '-'}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border-l-4 border-green-500 shadow-sm">
            <p className="text-green-600 font-bold text-sm">Approved</p>
            <p className="text-3xl font-black text-[#2A0618]">
              {filter === 'approved' ? ads.length : '-'}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border-l-4 border-red-500 shadow-sm">
            <p className="text-red-600 font-bold text-sm">Rejected</p>
            <p className="text-3xl font-black text-[#2A0618]">
              {filter === 'rejected' ? ads.length : '-'}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm">
          {(['pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status)
                setLoading(true)
              }}
              className={`px-6 py-2 rounded-lg font-bold transition-all capitalize ${
                filter === status
                  ? status === 'pending'
                    ? 'bg-yellow-500 text-white'
                    : status === 'approved'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Ads List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-pink-200 border-t-[#2A0618] rounded-full animate-spin"></div>
              <p className="text-gray-600 mt-4">Loading ads...</p>
            </div>
          ) : ads.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border-2 border-dashed border-gray-300">
              <Eye size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-semibold">No {filter} ads found</p>
            </div>
          ) : (
            ads.map((ad) => (
              <div
                key={ad.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Ad Details */}
                  <div className="md:col-span-2">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-black text-[#2A0618] mb-2">{ad.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ad.description}</p>
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full font-semibold">
                            {ad.category}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                            📍 {ad.area}, {ad.city}
                          </span>
                          {ad.price && (
                            <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full font-semibold">
                              ₹ {ad.price}
                            </span>
                          )}
                        </div>
                        <div className="mt-4 text-xs text-gray-500">
                          <p>📞 {ad.phone}</p>
                          <p>📅 {new Date(ad.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {filter === 'pending' ? (
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => handleAction(ad.id, 'approve')}
                        disabled={actionLoading === ad.id}
                        className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle size={18} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(ad.id, 'reject')}
                        disabled={actionLoading === ad.id}
                        className="flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        <XCircle size={18} />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                            filter === 'approved'
                              ? 'bg-green-100'
                              : 'bg-red-100'
                          }`}
                        >
                          {filter === 'approved' ? (
                            <CheckCircle
                              size={24}
                              className="text-green-600"
                            />
                          ) : (
                            <XCircle size={24} className="text-red-600" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 capitalize">
                          {filter}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Back to Site */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="text-pink-600 hover:text-pink-700 font-bold"
          >
            ← Back to Website
          </Link>
        </div>
      </div>
    </div>
  )
}
