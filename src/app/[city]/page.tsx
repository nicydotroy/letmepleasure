import { notFound, redirect } from 'next/navigation'
import { CITIES } from '@/lib/cities'

type Props = {
  params: {
    city: string
  }
}

export async function generateStaticParams() {
  return CITIES.map((city) => ({
    city: city.slug,
  }))
}

export async function generateMetadata({ params }: Props) {
  const city = CITIES.find((c) => c.slug === params.city)

  if (!city) return notFound()

  return {
    title: `Free Classifieds in ${city.name} | Post & Browse Ads | Listvoo`,
    description: `Browse and post free classified ads in ${city.name}. Find escorts, call girls, massage services, and more. 100% verified listings on Listvoo.`,
    openGraph: {
      title: `Classifieds in ${city.name} | Listvoo`,
      description: `Browse verified classifieds in ${city.name}. Post free ads in 60 seconds on Listvoo.`,
    },
  }
}

export default function CityPage({ params }: Props) {
  const city = CITIES.find((c) => c.slug === params.city)

  if (!city) {
    notFound()
  }

  // Redirect to the location page which shows all listings for this city
  redirect(`/location/${city.slug}`)
}
