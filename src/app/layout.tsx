import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  metadataBase: new URL('https://listvoo.com'),
  title: {
    default: 'Listvoo — Free Classified Ads India | Buy Sell in Your City',
    template: '%s | Listvoo India',
  },
  description:
    'Post free classified ads in India. Buy, sell & find Real Estate, Jobs, Cars, Electronics in Mumbai, Delhi, Bangalore, Hyderabad, Chennai & all metro cities. 100% Free, No Registration.',
  keywords: [
    'free classified ads India',
    'post free ad',
    'buy sell India',
    'Mumbai classified',
    'Delhi classified',
    'Bangalore classified',
    'free ads India',
    'OLX alternative',
    'quikr alternative',
  ],
  authors: [{ name: 'Listvoo', url: 'https://listvoo.com' }],
  creator: 'Listvoo',
  publisher: 'Listvoo',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://listvoo.com',
    siteName: 'Listvoo',
    title: 'Listvoo — Free Classified Ads India',
    description: 'Post free classified ads across India. Buy & Sell in your city.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Listvoo Free Classified Ads India' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Listvoo — Free Classified Ads India',
    description: 'Post free classified ads across India.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://listvoo.com',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Listvoo',
              url: 'https://listvoo.com',
              description: 'Free classified ads in India',
              potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: 'https://listvoo.com/?q={search_term_string}' },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

