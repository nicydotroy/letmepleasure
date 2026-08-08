'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileText, Plus, Save, Trash2, ExternalLink, HelpCircle, Search } from 'lucide-react'
import { editablePageGroups } from '@/lib/page-content'

interface Faq { q: string; a: string }
const EMPTY = { heading: '', intro: '', body: '', faqs: [] as Faq[] }

export default function AdminContentPage() {
  const router = useRouter()
  const groups = useMemo(() => editablePageGroups(), [])

  const [groupKey, setGroupKey] = useState(groups[0].key)
  const [path, setPath] = useState(groups[0].pages[0].path)
  const [filter, setFilter] = useState('')
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [error, setError] = useState('')

  const group = groups.find((g) => g.key === groupKey) ?? groups[0]

  // Long groups (300+ areas) need a filter to stay usable.
  const visiblePages = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return group.pages
    return group.pages.filter(
      (p) => p.label.toLowerCase().includes(q) || p.path.toLowerCase().includes(q)
    )
  }, [group, filter])

  const selectGroup = (key: string) => {
    const next = groups.find((g) => g.key === key)
    if (!next) return
    setGroupKey(key)
    setFilter('')
    setPath(next.pages[0].path)
  }

  // Load whenever the selected page changes.
  useEffect(() => {
    if (!path) return
    setLoading(true)
    setError('')
    setSavedAt(null)
    fetch(`/api/admin/page-content?path=${encodeURIComponent(path)}`)
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
  }, [path, router])

  const updateFaq = (i: number, key: 'q' | 'a', value: string) => {
    setForm((f) => ({ ...f, faqs: f.faqs.map((x, idx) => (idx === i ? { ...x, [key]: value } : x)) }))
  }
  const addFaq = () => setForm((f) => ({ ...f, faqs: [...f.faqs, { q: '', a: '' }] }))
  const removeFaq = (i: number) => setForm((f) => ({ ...f, faqs: f.faqs.filter((_, idx) => idx !== i) }))

  const save = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/page-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, ...form }),
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

  const clearContent = async () => {
    if (!confirm(`Remove all custom content and FAQs from ${path}?`)) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/page-content?path=${encodeURIComponent(path)}`, {
        method: 'DELETE',
      })
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      if (!res.ok) {
        setError('Failed to clear')
        return
      }
      setForm(EMPTY)
      setSavedAt(new Date().toLocaleTimeString())
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const hasContent = Boolean(form.heading || form.intro || form.body || form.faqs.length)

  return (
    <div className="min-h-screen bg-[#FFF1F7]">
      <header className="bg-[#2A0618] text-white py-6 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 flex-wrap">
          <h1 className="text-2xl font-black flex items-center gap-2">
            <FileText size={22} className="text-pink-400" /> Page Content Editor
          </h1>
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-pink-200 hover:text-white text-sm font-semibold">
            <ArrowLeft size={16} /> Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Page picker */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-pink-50 space-y-4">
          <div className="flex flex-wrap gap-2">
            {groups.map((g) => (
              <button
                key={g.key}
                onClick={() => selectGroup(g.key)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  g.key === groupKey
                    ? 'bg-[#2A0618] text-white shadow-lg'
                    : 'bg-pink-50 text-slate-600 hover:bg-pink-100 hover:text-pink-700'
                }`}
              >
                {g.label} ({g.pages.length})
              </button>
            ))}
          </div>

          {group.pages.length > 12 && (
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder={`Filter ${group.label.toLowerCase()}…`}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Page ({visiblePages.length} shown)
            </label>
            <select
              value={path}
              onChange={(e) => setPath(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm font-semibold"
            >
              {visiblePages.map((p) => (
                <option key={p.path} value={p.path}>{p.label} — {p.path}</option>
              ))}
              {visiblePages.length === 0 && <option value={path}>No match for “{filter}”</option>}
            </select>
          </div>

          <p className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
            Editing <strong className="font-mono">{path}</strong>
            <Link href={path} target="_blank" className="text-pink-600 hover:text-pink-800 font-semibold inline-flex items-center gap-1">
              View public page <ExternalLink size={11} />
            </Link>
            {hasContent && <span className="text-green-600 font-semibold">· has content</span>}
          </p>
        </div>

        {/* Content editor */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-pink-50 space-y-4">
          <h2 className="text-base font-black text-[#2A0618]">Page content</h2>

          {loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Heading (H2)</label>
                <input
                  value={form.heading}
                  onChange={(e) => setForm({ ...form, heading: e.target.value })}
                  placeholder="e.g. Verified Companions Across India"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Intro paragraph</label>
                <textarea
                  value={form.intro}
                  onChange={(e) => setForm({ ...form, intro: e.target.value })}
                  rows={2}
                  placeholder="Short opening paragraph rendered below the heading."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm resize-y"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Body</label>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  rows={10}
                  placeholder="Long-form content. Separate paragraphs with a blank line."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm resize-y leading-relaxed"
                />
                <p className="text-[11px] text-slate-400 mt-1">Tip: leave a blank line between paragraphs.</p>
              </div>
            </>
          )}
        </div>

        {/* FAQs editor */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-pink-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-[#2A0618] flex items-center gap-2">
              <HelpCircle size={16} className="text-pink-500" /> FAQs ({form.faqs.length})
            </h2>
            <button
              onClick={addFaq}
              className="flex items-center gap-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors"
            >
              <Plus size={13} /> Add FAQ
            </button>
          </div>
          {form.faqs.length === 0 ? (
            <p className="text-sm text-slate-400">
              No FAQs yet. Click <strong>Add FAQ</strong> to create one — they appear as an accordion at the bottom of the page and get FAQ rich-result schema.
            </p>
          ) : (
            <div className="space-y-3">
              {form.faqs.map((f, i) => (
                <div key={i} className="rounded-xl border border-pink-100 bg-pink-50/40 p-3 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-bold text-pink-700 uppercase tracking-wider">Question {i + 1}</span>
                    <button onClick={() => removeFaq(i)} className="text-red-500 hover:text-red-700" aria-label="Remove FAQ">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <input
                    value={f.q}
                    onChange={(e) => updateFaq(i, 'q', e.target.value)}
                    placeholder="Question…"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm font-semibold"
                  />
                  <textarea
                    value={f.a}
                    onChange={(e) => updateFaq(i, 'a', e.target.value)}
                    rows={3}
                    placeholder="Answer…"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm resize-y"
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
          <button
            onClick={clearContent}
            disabled={saving || loading || !hasContent}
            className="flex items-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-40"
          >
            <Trash2 size={15} /> Clear page
          </button>
          {savedAt && <span className="text-sm text-green-600 font-semibold">✓ Saved at {savedAt}</span>}
          {error && <span className="text-sm text-red-600 font-semibold">{error}</span>}
        </div>
      </div>
    </div>
  )
}
