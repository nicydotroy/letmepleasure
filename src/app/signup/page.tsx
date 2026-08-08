'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Sign up failed')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('Network error. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#2A0618] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-pink-500 rounded-xl mb-4">
            <span className="text-2xl font-black text-[#2A0618]">L</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Create your account</h1>
          <p className="text-pink-200">Join Letme Pleasure to post and manage your ads</p>
        </div>

        <form onSubmit={handleSignup} className="bg-[#4A0B2F] rounded-2xl p-8 border border-[#9D174D] shadow-2xl">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm font-bold text-pink-200 mb-2">Name <span className="font-normal text-pink-400">(optional)</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 bg-[#2A0618] border border-[#9D174D] text-white placeholder-pink-400 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
              disabled={loading}
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-bold text-pink-200 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-[#2A0618] border border-[#9D174D] text-white placeholder-pink-400 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
              disabled={loading}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-pink-200 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-4 py-3 bg-[#2A0618] border border-[#9D174D] text-white placeholder-pink-400 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
              disabled={loading}
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-[#2A0618] py-3 rounded-lg font-black hover:bg-pink-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          <p className="text-center text-pink-300 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-pink-400 hover:text-pink-300 font-bold">
              Sign In
            </Link>
          </p>
        </form>

        <div className="text-center mt-6">
          <Link href="/" className="text-pink-300 hover:text-pink-400 text-sm transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
