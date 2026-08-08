import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AgeGate from '@/components/AgeGate'
import InstallPrompt from '@/components/InstallPrompt'

export const metadata: Metadata = {
  metadataBase: new URL('https://letmepleasure.com'),
  title: {
    default: 'Letme Pleasure — Free Classified Ads India | Buy Sell in Your City',
    template: '%s',
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
  authors: [{ name: 'Letme Pleasure', url: 'https://letmepleasure.com' }],
  creator: 'Letme Pleasure',
  publisher: 'Letme Pleasure',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  verification: {
    google: 'scEWWW-88xfCFNW6HwyncwkHCBkBo97ZQQkaen5sj-4',
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
    url: 'https://letmepleasure.com',
    siteName: 'Letme Pleasure',
    title: 'Letme Pleasure — Free Classified Ads India',
    description: 'Post free classified ads across India. Buy & Sell in your city. 100% free, no registration required.',
    images: [
      { 
        url: 'https://letmepleasure.com/og-image.png', 
        width: 1200, 
        height: 630, 
        alt: 'Letme Pleasure Free Classified Ads India',
        type: 'image/png',
      },
      {
        url: 'https://letmepleasure.com/og-image-square.png',
        width: 800,
        height: 800,
        alt: 'Letme Pleasure Logo',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Letme Pleasure',
    creator: '@Letme Pleasure',
    title: 'Letme Pleasure — Free Classified Ads India',
    description: 'Post free classified ads across India. Buy & Sell in your city.',
    images: ['https://letmepleasure.com/og-image.png'],
  },
  alternates: {
    canonical: 'https://letmepleasure.com',
    languages: {
      'en-IN': 'https://letmepleasure.com',
    },
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Letme Pleasure',
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
        <meta name="theme-color" content="#2A0618" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Letme Pleasure" />
        
        <link rel="icon" href="/logos/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logos/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logos/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/logos/favicon-48x48.png" />
        <link rel="apple-touch-icon" sizes="64x64" href="/logos/favicon-64x64.png" />
        <link rel="shortcut icon" href="/logos/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
        
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Letme Pleasure',
              url: 'https://letmepleasure.com',
              description: 'Free classified ads in India - Buy, Sell, Find services in your city',
              potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: 'https://letmepleasure.com/search/{search_term_string}' },
                'query-input': 'required name=search_term_string',
              },
              publisher: {
                '@type': 'Organization',
                name: 'Letme Pleasure',
                url: 'https://letmepleasure.com',
                logo: 'https://letmepleasure.com/og-image.png',
                sameAs: [
                  'https://www.facebook.com/letmepleasure',
                  'https://twitter.com/letmepleasure',
                  'https://www.instagram.com/letmepleasure',
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
              name: 'Letme Pleasure',
              url: 'https://letmepleasure.com',
              logo: 'https://letmepleasure.com/og-image.png',
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
        <AgeGate />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <InstallPrompt />
      </body>
    </html>
  )
}

