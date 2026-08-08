/**
 * BreadcrumbSchema Component
 * Use this component to add breadcrumb structured data to any page
 * 
 * Usage:
 * <BreadcrumbSchema items={[
 *   { name: 'Home', url: 'https://letmepleasure.com' },
 *   { name: 'Mumbai', url: 'https://letmepleasure.com/call-girls/mumbai' },
 *   { name: 'Escorts', url: 'https://letmepleasure.com/call-girls/mumbai/escorts' }
 * ]} />
 */

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * LocalBusinessSchema Component
 * Use for city-specific pages
 */
export function LocalBusinessSchema({
  cityName,
  citySlug,
  adCount,
}: {
  cityName: string
  citySlug: string
  adCount: number
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Classifieds in ${cityName} - Letme Pleasure`,
    description: `Browse and post free classified ads in ${cityName}. ${adCount}+ active listings.`,
    url: `https://letmepleasure.com/call-girls/${citySlug}`,
    areaServed: {
      '@type': 'City',
      name: cityName,
    },
    image: 'https://letmepleasure.com/og-image.png',
    priceRange: 'Free',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressLocality: cityName,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * CollectionPageSchema Component
 * Use for category and collection pages
 */
export function CollectionPageSchema({
  name,
  description,
  url,
  itemCount,
}: {
  name: string
  description: string
  url: string
  itemCount: number
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
    numberOfItems: itemCount,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * FAQPageSchema Component
 * Use on FAQ pages
 */
export function FAQPageSchema({
  faqs,
}: {
  faqs: Array<{
    question: string
    answer: string
  }>
}) {
  const schema = {
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
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * AggregateOfferSchema Component
 * Use on category pages showing multiple listings
 */
export function AggregateOfferSchema({
  itemCount,
  description,
}: {
  itemCount: number
  description: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    price: '0',
    priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    offerCount: itemCount,
    availability: 'https://schema.org/InStock',
    description,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * ItemListSchema — renders a list of ads (or any item) as an ItemList
 * so search engines can show carousels and understand the page is a
 * collection of distinct entities.
 */
export function ItemListSchema({
  items,
  listName,
}: {
  items: Array<{ name: string; url: string; image?: string; description?: string }>
  listName?: string
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    ...(listName ? { name: listName } : {}),
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: item.url,
      name: item.name,
      ...(item.image ? { image: item.image } : {}),
      ...(item.description ? { description: item.description } : {}),
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * ServiceSchema — for individual ad detail pages. Models the listing as
 * a Service offered by the poster, with location, image and contact.
 */
export function ServiceSchema({
  name,
  description,
  image,
  city,
  area,
  url,
  phone,
  publishedISO,
}: {
  name: string
  description: string
  image?: string
  city: string
  area: string
  url: string
  phone?: string
  publishedISO?: string
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    serviceType: 'Companion Service',
    areaServed: {
      '@type': 'City',
      name: city,
      containedInPlace: { '@type': 'AdministrativeArea', name: area },
    },
    // Letme Pleasure is a national platform, not a brick-and-mortar business in
    // each ad's city — modeling the provider as Organization avoids the
    // LocalBusiness "missing address/geo" structured-data error Site Audit
    // flagged on every ad page.
    provider: {
      '@type': 'Organization',
      name: 'Letme Pleasure',
      url: 'https://letmepleasure.com',
      logo: 'https://letmepleasure.com/og-image.png',
      ...(phone ? { telephone: phone } : {}),
    },
    ...(image ? { image } : {}),
    ...(publishedISO ? { datePosted: publishedISO } : {}),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export const SchemaComponents = {
  BreadcrumbSchema,
  LocalBusinessSchema,
  CollectionPageSchema,
  FAQPageSchema,
  AggregateOfferSchema,
  ItemListSchema,
  ServiceSchema,
}
