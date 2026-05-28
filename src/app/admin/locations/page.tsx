'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Plus, Save, Trash2, ExternalLink, HelpCircle } from 'lucide-react'
import { CITIES } from '@/lib/cities'

interface Faq { q: string; a: string }
const EMPTY = { heading: '', intro: '', body: '', faqs: [] as Faq[] }

export default function AdminLocationsPage() {
  const router = useRouter()
  const [citySlug, setCitySlug] = useState(CITIES[0]?.slug || '')
  const [areaSlug, setAreaSlug] = useState('') // '' = city-level
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [error, setError] = useState('')

  const city = CITIES.find((c) => c.slug === citySlug)
  const area = city?.areas.find((a) => a.slug === areaSlug)
  const publicUrl = areaSlug
    ? `/call-girls/${citySlug}/${areaSlug}`
    : `/call-girls/${citySlug}`

  // Fetch content whenever city/area changes.
  useEffect(() => {
    if (!citySlug) return
    setLoading(true)
    setError('')
    setSavedAt(null)
    fetch(`/api/admin/locations?city=${citySlug}&area=${encodeURIComponent(areaSlug)}`)
      .then(async (res) => {
        if (res.status === 401) {
          router.push('/admin/login')
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (!data) return
        const c = data.content
        let faqs: Faq[] = []
        if (c?.faqs) {
          try { faqs = JSON.parse(c.faqs) } catch { faqs = [] }
        }
        setForm({
          heading: c?.heading || '',
          intro: c?.intro || '',
          body: c?.body || '',
          faqs,
        })
      })
      .catch(() => setError('Failed to load content'))
      .finally(() => setLoading(false))
  }, [citySlug, areaSlug, router])

  const updateFaq = (i: number, key: 'q' | 'a', value: string) => {
    setForm((f) => ({ ...f, faqs: f.faqs.map((x, idx) => (idx === i ? { ...x, [key]: value } : x)) }))
  }
  const addFaq = () => setForm((f) => ({ ...f, faqs: [...f.faqs, { q: '', a: '' }] }))
  const removeFaq = (i: number) => setForm((f) => ({ ...f, faqs: f.faqs.filter((_, idx) => idx !== i) }))

  const save = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/locations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ citySlug, areaSlug, ...form }),
      })
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to save')
        return
      }
      setSavedAt(new Date().toLocaleTimeString())
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#EEF2FF]">
      <header className="bg-[#060B27] text-white py-6 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 flex-wrap">
          <h1 className="text-2xl font-black flex items-center gap-2">
            <MapPin size={22} className="text-blue-400" /> Location Content Editor
          </h1>
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-blue-200 hover:text-white text-sm font-semibold">
            <ArrowLeft size={16} /> Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* City / Area selectors */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-indigo-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">City</label>
              <select
                value={citySlug}
                onChange={(e) => { setCitySlug(e.target.value); setAreaSlug('') }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm font-semibold"
              >
                {CITIES.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name} — {c.state}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Area</label>
              <select
                value={areaSlug}
                onChange={(e) => setAreaSlug(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm font-semibold"
              >
                <option value="">— City-level (all areas) —</option>
                {city?.areas.map((a) => (
                  <option key={a.slug} value={a.slug}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 flex items-center gap-1.5 flex-wrap">
            Editing: <strong>{areaSlug ? `${area?.name}, ${city?.name}` : `${city?.name} (city-level)`}</strong>
            <Link href={publicUrl} target="_blank" className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1">
              View public page <ExternalLink size={11} />
            </Link>
          </p>
        </div>

        {/* Content editor */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-indigo-50 space-y-4">
          <h2 className="text-base font-black text-[#060B27]">Page content</h2>

          {loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Heading (H2)</label>
                <input
                  value={form.heading}
                  onChange={(e) => setForm({ ...form, heading: e.target.value })}
                  placeholder="e.g. Verified Call Girls & Companions in Mumbai"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Intro paragraph</label>
                <textarea
                  value={form.intro}
                  onChange={(e) => setForm({ ...form, intro: e.target.value })}
                  rows={2}
                  placeholder="Short opening paragraph rendered below the heading."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm resize-y"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Body</label>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  rows={10}
                  placeholder="Long-form content. Separate paragraphs with a blank line."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm resize-y leading-relaxed"
                />
                <p className="text-[11px] text-slate-400 mt-1">Tip: leave a blank line between paragraphs.</p>
              </div>
            </>
          )}
        </div>

        {/* FAQs editor */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-indigo-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-[#060B27] flex items-center gap-2">
              <HelpCircle size={16} className="text-indigo-500" /> FAQs ({form.faqs.length})
            </h2>
            <button
              onClick={addFaq}
              className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors"
            >
              <Plus size={13} /> Add FAQ
            </button>
          </div>
          {form.faqs.length === 0 ? (
            <p className="text-sm text-slate-400">No FAQs yet. Click <strong>Add FAQ</strong> to create one — they appear as an accordion at the bottom of the page and get FAQ rich-result schema.</p>
          ) : (
            <div className="space-y-3">
              {form.faqs.map((f, i) => (
                <div key={i} className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Question {i + 1}</span>
                    <button onClick={() => removeFaq(i)} className="text-red-500 hover:text-red-700" aria-label="Remove FAQ">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <input
                    value={f.q}
                    onChange={(e) => updateFaq(i, 'q', e.target.value)}
                    placeholder="Question…"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm font-semibold"
                  />
                  <textarea
                    value={f.a}
                    onChange={(e) => updateFaq(i, 'a', e.target.value)}
                    rows={3}
                    placeholder="Answer…"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm resize-y"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save row */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={save}
            disabled={saving || loading}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-black text-sm transition-colors disabled:opacity-50"
          >
            <Save size={15} /> {saving ? 'Saving…' : 'Save changes'}
          </button>
          {savedAt && <span className="text-sm text-green-600 font-semibold">✓ Saved at {savedAt}</span>}
          {error && <span className="text-sm text-red-600 font-semibold">{error}</span>}
        </div>
      </div>
    </div>
  )
}
