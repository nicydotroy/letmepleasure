'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PlusCircle, Clock, CheckCircle, XCircle, FileText, Eye, MapPin, PenLine } from 'lucide-react'

interface Ad {
  id: string
  title: string
  category: string
  city: string
  area: string
  price?: string | null
  status: string
  rejectionReason?: string | null
  createdAt: string
}

interface Stats {
  total: number
  pending: number
  approved: number
  rejected: number
}

interface AuthUser {
  id: string
  email: string
  name: string | null
}

const STATUS_STYLES: Record<string, { label: string; cls: string; icon: typeof Clock }> = {
  pending: { label: 'Pending approval', cls: 'bg-yellow-100 text-yellow-700', icon: Clock },
  approved: { label: 'Approved · Live', cls: 'bg-green-100 text-green-700', icon: CheckCircle },
  rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-700', icon: XCircle },
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [ads, setAds] = useState<Ad[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 })
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/my-ads')
      .then(async (res) => {
        if (res.status === 401) {
          router.replace('/login')
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (!data) return
        setUser(data.user)
        setAds(data.ads || [])
        setStats(data.stats || { total: 0, pending: 0, approved: 0, rejected: 0 })
        setIsOwner(Boolean(data.isOwner))
      })
      .catch(() => router.replace('/login'))
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EEF2FF] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-[#060B27] rounded-full animate-spin" />
          <p className="text-slate-600 mt-4">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const statCards = [
    { key: 'total', label: 'Total Ads', value: stats.total, border: 'border-blue-500', text: 'text-blue-600', icon: FileText },
    { key: 'pending', label: 'Pending Approval', value: stats.pending, border: 'border-yellow-500', text: 'text-yellow-600', icon: Clock },
    { key: 'approved', label: 'Approved', value: stats.approved, border: 'border-green-500', text: 'text-green-600', icon: CheckCircle },
    { key: 'rejected', label: 'Rejected', value: stats.rejected, border: 'border-red-500', text: 'text-red-600', icon: XCircle },
  ]

  return (
    <div className="min-h-screen bg-[#EEF2FF]">
      {/* Hero */}
      <div className="bg-[#060B27] py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">My Dashboard</h1>
            <p className="text-blue-300 text-sm mt-1">
              {user?.name ? `Welcome, ${user.name}` : user?.email}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {isOwner && (
              <Link
                href="/admin/blog"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-xl font-black text-sm transition-all"
              >
                <PenLine size={16} /> Manage Blog
              </Link>
            )}
            <Link
              href="/post-ad"
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-[#060B27] px-5 py-2.5 rounded-xl font-black text-sm transition-all shadow-lg"
            >
              <PlusCircle size={16} /> Post New Ad
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.key} className={`bg-white rounded-xl p-5 border-l-4 ${s.border} shadow-sm`}>
                <div className="flex items-center justify-between">
                  <p className={`font-bold text-xs ${s.text}`}>{s.label}</p>
                  <Icon size={16} className={s.text} />
                </div>
                <p className="text-3xl font-black text-[#060B27] mt-2">{s.value}</p>
              </div>
            )
          })}
        </div>

        <p className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
          <Clock size={13} /> New ads stay <strong>pending</strong> until an admin approves them. You can&apos;t approve your own ads.
        </p>

        {/* Ads list */}
        {ads.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border-2 border-dashed border-indigo-200">
            <Eye size={40} className="mx-auto text-indigo-300 mb-3" />
            <p className="text-slate-600 font-semibold mb-1">You haven&apos;t posted any ads yet</p>
            <p className="text-slate-400 text-sm mb-5">Post your first ad — it&apos;s free.</p>
            <Link
              href="/post-ad"
              className="inline-flex items-center gap-2 bg-blue-500 text-[#060B27] px-5 py-2.5 rounded-xl font-black text-sm hover:bg-blue-400 transition-all"
            >
              <PlusCircle size={16} /> Post Free Ad
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {ads.map((ad) => {
              const s = STATUS_STYLES[ad.status] || STATUS_STYLES.pending
              const Icon = s.icon
              return (
                <div key={ad.id} className="bg-white rounded-xl p-5 shadow-sm border border-indigo-50 flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <h3 className="text-lg font-black text-[#060B27] mb-1">{ad.title}</h3>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-500 mb-2">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-semibold">{ad.category}</span>
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded-full">
                        <MapPin size={11} /> {ad.area}, {ad.city}
                      </span>
                      {ad.price && (
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded-full font-semibold">₹ {ad.price}</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">Posted {new Date(ad.createdAt).toLocaleDateString()}</p>
                    {ad.status === 'rejected' && ad.rejectionReason && (
                      <p className="text-xs text-red-500 mt-1">Reason: {ad.rejectionReason}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${s.cls}`}>
                      <Icon size={13} /> {s.label}
                    </span>
                    {ad.status === 'approved' && (
                      <Link href={`/ads/${ad.id}`} className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                        <Eye size={12} /> View live
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-bold text-sm">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
