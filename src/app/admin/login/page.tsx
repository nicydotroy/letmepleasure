'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Login failed')
        return
      }

      router.push('/admin/dashboard')
    } catch (err) {
      setError('Network error. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#060B27] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FBBF24] rounded-xl mb-4">
            <span className="text-2xl font-black text-[#060B27]">L</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Listvoo Admin</h1>
          <p className="text-blue-200">Approve ads and manage platform</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-[#0B1354] rounded-2xl p-8 border border-[#1B2F8C] shadow-2xl">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm font-bold text-blue-200 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              className="w-full px-4 py-3 bg-[#060B27] border border-[#1B2F8C] text-white placeholder-blue-400 rounded-lg focus:outline-none focus:border-[#FBBF24] transition-colors"
              disabled={loading}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-blue-200 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 bg-[#060B27] border border-[#1B2F8C] text-white placeholder-blue-400 rounded-lg focus:outline-none focus:border-[#FBBF24] transition-colors"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FBBF24] text-[#060B27] py-3 rounded-lg font-black hover:bg-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <p className="text-center text-blue-300 text-xs mt-6">
            Default credentials: admin / admin123
          </p>
        </form>

        {/* Back to Site */}
        <div className="text-center mt-6">
          <Link href="/" className="text-blue-300 hover:text-[#FBBF24] text-sm transition-colors">
            ← Back to Site
          </Link>
        </div>
      </div>
    </div>
  )
}
