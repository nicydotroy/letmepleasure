'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trash2, Edit3, Eye, FileText, Plus, X } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  status: string
  publishedAt: string | null
  createdAt: string
}

const EMPTY = { title: '', excerpt: '', coverImage: '', content: '' }

export default function AdminBlogPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchPosts = async () => {
    const res = await fetch('/api/admin/blog')
    if (res.status === 401) {
      router.push('/admin/login')
      return
    }
    const data = await res.json()
    setPosts(data.posts || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resetForm = () => {
    setForm(EMPTY)
    setEditingId(null)
    setError('')
  }

  const startEdit = (p: Post) => {
    setEditingId(p.id)
    setForm({
      title: p.title,
      excerpt: p.excerpt || '',
      coverImage: p.coverImage || '',
      content: p.content,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const save = async (status: 'draft' | 'published') => {
    setError('')
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required.')
      return
    }
    setSaving(true)
    try {
      const url = editingId ? `/api/admin/blog/${editingId}` : '/api/admin/blog'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status }),
      })
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to save')
        return
      }
      resetForm()
      await fetchPosts()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const togglePublish = async (p: Post) => {
    await fetch(`/api/admin/blog/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: p.title,
        content: p.content,
        excerpt: p.excerpt,
        coverImage: p.coverImage,
        status: p.status === 'published' ? 'draft' : 'published',
      }),
    })
    fetchPosts()
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this article permanently?')) return
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
    if (editingId === id) resetForm()
    fetchPosts()
  }

  return (
    <div className="min-h-screen bg-[#EEF2FF]">
      <header className="bg-[#060B27] text-white py-6 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <h1 className="text-2xl font-black flex items-center gap-2">
            <FileText size={22} className="text-blue-400" /> Blog Editor
          </h1>
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-blue-200 hover:text-white text-sm font-semibold">
            <ArrowLeft size={16} /> Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Editor */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-indigo-50">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-black text-[#060B27]">
              {editingId ? 'Edit Article' : 'Write New Article'}
            </h2>
            {editingId && (
              <button onClick={resetForm} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
                <X size={14} /> Cancel edit
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>
          )}

          <div className="space-y-4">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Article title *"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg font-bold"
            />
            <input
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="Short summary / excerpt (optional)"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            />
            <input
              value={form.coverImage}
              onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
              placeholder="Cover image URL (optional, e.g. /uploads/cover.jpg)"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            />
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write your article here... Separate paragraphs with a blank line."
              rows={12}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm resize-y"
            />

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => save('published')}
                disabled={saving}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-black text-sm transition-colors disabled:opacity-50"
              >
                <Plus size={16} /> {saving ? 'Saving...' : editingId ? 'Update & Publish' : 'Publish'}
              </button>
              <button
                onClick={() => save('draft')}
                disabled={saving}
                className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
              >
                Save as Draft
              </button>
            </div>
          </div>
        </div>

        {/* Existing posts */}
        <div>
          <h2 className="text-lg font-black text-[#060B27] mb-4">All Articles ({posts.length})</h2>
          {loading ? (
            <p className="text-slate-500 text-sm">Loading...</p>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border-2 border-dashed border-indigo-200">
              <p className="text-slate-500 font-semibold">No articles yet. Write your first one above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((p) => (
                <div key={p.id} className="bg-white rounded-xl p-5 shadow-sm border border-indigo-50 flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-black text-[#060B27]">{p.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">/blog/{p.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.status === 'published' && (
                      <Link href={`/blog/${p.slug}`} target="_blank" className="p-2 rounded-lg text-blue-600 hover:bg-blue-50" title="View live">
                        <Eye size={16} />
                      </Link>
                    )}
                    <button onClick={() => startEdit(p)} className="p-2 rounded-lg text-slate-600 hover:bg-slate-100" title="Edit">
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => togglePublish(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold ${p.status === 'published' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                    >
                      {p.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button onClick={() => remove(p.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
