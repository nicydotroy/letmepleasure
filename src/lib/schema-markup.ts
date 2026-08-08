/**
 * Schema Markup Utilities for SEO
 * Generates structured data for better search engine understanding
 */

import { CONTACT } from '@/lib/contact'

interface BreadcrumbItem {
  name: string
  url: string
}

interface SchemaMarkupOptions {
  breadcrumbs?: BreadcrumbItem[]
  city?: string
  category?: string
  area?: string
}

/**
 * Generate BreadcrumbList schema markup
 * @param items Array of breadcrumb items
 * @returns JSON-LD structured data string
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  })
}

/**
 * Generate LocalBusiness schema for city pages
 */
export function generateLocalBusinessSchema(cityName: string, citySlug: string) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `${cityName} Classifieds - letmepleasure`,
    description: `Browse and post classified ads in ${cityName}`,
    url: `https://letmepleasure.com/call-girls/${citySlug}`,
    areaServed: {
      '@type': 'City',
      name: cityName,
    },
    image: 'https://letmepleasure.com/og-image.png',
    priceRange: '$$',
    telephone: '+91-XXXXXXXXXX', // Add actual phone if needed
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressLocality: cityName,
    },
  })
}

/**
 * Generate SearchAction schema for search functionality
 */
export function generateSearchActionSchema() {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://letmepleasure.com/?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  })
}

/**
 * Generate FAQPage schema
 */
export function generateFAQPageSchema(faqs: Array<{ question: string; answer: string }>) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  })
}

/**
 * Generate Article schema for ad details
 */
export function generateArticleSchema(ad: {
  title: string
  description: string
  image?: string
  publishedDate: Date
  author?: string
}) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: ad.title,
    description: ad.description,
    image: ad.image || 'https://letmepleasure.com/og-image.png',
    datePublished: ad.publishedDate.toISOString(),
    author: {
      '@type': 'Organization',
      name: ad.author || 'letmepleasure',
    },
    publisher: {
      '@type': 'Organization',
      name: 'letmepleasure',
      logo: {
        '@type': 'ImageObject',
        url: 'https://letmepleasure.com/og-image.png',
      },
    },
  })
}

/**
 * Generate AggregateOffer schema for listings
 */
export function generateAggregateOfferSchema(adCount: number, cityName: string) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    price: '0', // Free listings
    offerCount: adCount,
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: 'letmepleasure',
      url: 'https://letmepleasure.com',
    },
    description: `Available listings in ${cityName}`,
  })
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema() {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'letmepleasure',
    url: 'https://letmepleasure.com',
    logo: 'https://letmepleasure.com/og-image.png',
    description: 'Free Classifieds Platform in India',
    sameAs: [
      'https://www.facebook.com/letmepleasure',
      'https://twitter.com/letmepleasure',
      'https://www.instagram.com/letmepleasure',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: CONTACT.email,
      telephone: CONTACT.phoneIntl,
      availableLanguage: ['en', 'hi'],
    },
    areaServed: 'IN',
  })
}

/**
 * Generate CollectionPage schema for category pages
 */
export function generateCollectionPageSchema(categoryName: string, cityName: string, itemCount: number) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} in ${cityName}`,
    description: `Browse ${categoryName} listings in ${cityName}`,
    url: `https://letmepleasure.com/${cityName}/${categoryName}`,
    numberOfItems: itemCount,
    potentialAction: {
      '@type': 'SearchAction',
      target: `https://letmepleasure.com/?city=${cityName}&category=${categoryName}`,
    },
  })
}

export const SchemaMarkup = {
  breadcrumb: generateBreadcrumbSchema,
  localBusiness: generateLocalBusinessSchema,
  searchAction: generateSearchActionSchema,
  faq: generateFAQPageSchema,
  article: generateArticleSchema,
  aggregateOffer: generateAggregateOfferSchema,
  organization: generateOrganizationSchema,
  collectionPage: generateCollectionPageSchema,
}
