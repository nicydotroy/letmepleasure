'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Download, X, Share } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [show, setShow] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Register the service worker (needed for installability).
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }

    // Don't show if the app is already installed / running standalone.
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    if (standalone) return

    // Don't re-show after the user closed it during this visit.
    if (sessionStorage.getItem('pwa_dismissed') === '1') return

    const ua = window.navigator.userAgent.toLowerCase()
    const ios = /iphone|ipad|ipod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream
    setIsIOS(ios)

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)

    // iOS Safari has no beforeinstallprompt — show manual instructions instead.
    if (ios) setShow(true)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
    setShow(false)
  }

  const dismiss = () => {
    try {
      sessionStorage.setItem('pwa_dismissed', '1')
    } catch {
      /* ignore */
    }
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-4 inset-x-3 sm:inset-x-auto sm:right-5 sm:max-w-sm z-[9990]">
      <div className="bg-white rounded-2xl shadow-2xl border border-pink-100 p-4 flex items-start gap-3">
        <div className="bg-[#2A0618] rounded-xl p-1.5 shrink-0">
          <Image src="/og-image-square.png" alt="Letme Pleasure" width={44} height={44} className="rounded-lg" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-[#2A0618] text-sm leading-tight">Install the Letme Pleasure app</p>
          {isIOS ? (
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Tap <Share size={12} className="inline -mt-0.5" /> <strong>Share</strong> then{' '}
              <strong>“Add to Home Screen”</strong> for quick one-tap access.
            </p>
          ) : (
            <>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Add it to your home screen for faster, one-tap access.
              </p>
              <button
                onClick={install}
                className="mt-2.5 flex items-center gap-1.5 bg-pink-500 text-[#2A0618] px-4 py-2 rounded-xl font-black text-sm hover:bg-pink-400 transition-colors"
              >
                <Download size={15} /> Install App
              </button>
            </>
          )}
        </div>
        <button onClick={dismiss} aria-label="Close" className="text-slate-400 hover:text-slate-600 shrink-0">
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
