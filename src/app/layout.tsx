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
    'classified ads',
    'buy and sell online',
    'free online classifieds',
  ],
  authors: [{ name: 'Listvoo', url: 'https://listvoo.com' }],
  creator: 'Listvoo',
  publisher: 'Listvoo',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  verification: {
    google: 'google-site-verification=YOUR_VERIFICATION_CODE',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: { 
      index: true, 
      follow: true, 
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://listvoo.com',
    siteName: 'Listvoo',
    title: 'Listvoo — Free Classified Ads India',
    description: 'Post free classified ads across India. Buy & Sell in your city. 100% free, no registration required.',
    images: [
      { 
        url: 'https://listvoo.com/og-image.png', 
        width: 1200, 
        height: 630, 
        alt: 'Listvoo Free Classified Ads India',
        type: 'image/png',
      },
      {
        url: 'https://listvoo.com/og-image-square.png',
        width: 800,
        height: 800,
        alt: 'Listvoo Logo',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@listvoo',
    creator: '@listvoo',
    title: 'Listvoo — Free Classified Ads India',
    description: 'Post free classified ads across India. Buy & Sell in your city.',
    images: ['https://listvoo.com/og-image.png'],
  },
  alternates: {
    canonical: 'https://listvoo.com',
    languages: {
      'en-IN': 'https://listvoo.com',
    },
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Listvoo',
  },
  category: 'Classifieds',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="theme-color" content="#060B27" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Listvoo" />
        
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Listvoo',
              url: 'https://listvoo.com',
              description: 'Free classified ads in India - Buy, Sell, Find services in your city',
              potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: 'https://listvoo.com/?q={search_term_string}' },
                'query-input': 'required name=search_term_string',
              },
              publisher: {
                '@type': 'Organization',
                name: 'Listvoo',
                url: 'https://listvoo.com',
                logo: 'https://listvoo.com/og-image.png',
                sameAs: [
                  'https://www.facebook.com/listvoo',
                  'https://twitter.com/listvoo',
                  'https://www.instagram.com/listvoo',
                ],
              },
            }),
          }}
        />
        
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Listvoo',
              url: 'https://listvoo.com',
              logo: 'https://listvoo.com/og-image.png',
              description: 'Free Classified Ads Platform in India',
              foundingDate: '2024',
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                availableLanguage: ['en'],
              },
              areaServed: 'IN',
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

