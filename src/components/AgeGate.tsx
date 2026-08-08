'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const STORAGE_KEY = 'Letme Pleasure_age_verified'

export default function AgeGate() {
  // Block by default; hide once we confirm a prior "yes" in localStorage.
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === 'yes') setVisible(false)
    } catch {
      /* localStorage unavailable — keep the gate up */
    }
  }, [])

  // Lock background scroll while the gate is open.
  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [visible])

  const enter = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'yes')
    } catch {
      /* ignore */
    }
    setVisible(false)
  }

  const leave = () => {
    window.location.replace('https://www.google.com')
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#2A0618]/95 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 sm:p-10 text-center shadow-2xl border border-pink-100">
        <div className="bg-[#2A0618] inline-flex rounded-2xl px-4 py-3 mb-6">
          <Image
            src="/logos/logo.png"
            alt="Letme Pleasure logo"
            width={1024}
            height={1024}
            className="h-16 w-auto"
            priority
          />
        </div>

        <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 px-3 py-1 rounded-full text-xs font-black mb-4">
          🔞 ADULTS ONLY
        </div>

        <h2 className="text-2xl font-black text-[#2A0618] mb-3">Are you 18 or older?</h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-7">
          This website contains age-restricted material intended for adults only. By entering you
          confirm that you are at least <strong>18 years of age</strong> and agree to view such
          content. If you are under 18, please leave now.
        </p>

        <div className="space-y-3">
          <button
            onClick={enter}
            className="w-full bg-pink-500 text-[#2A0618] py-3.5 rounded-xl font-black text-base hover:bg-pink-400 transition-colors shadow-md"
          >
            Yes, I am 18 or older — Enter
          </button>
          <button
            onClick={leave}
            className="w-full bg-slate-100 text-slate-600 py-3.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
          >
            No, I am under 18 — Leave
          </button>
        </div>

        <p className="text-[11px] text-slate-400 mt-6 leading-relaxed">
          By entering this site you agree to our Terms of Service and confirm that viewing adult
          content is legal in your location.
        </p>
      </div>
    </div>
  )
}
