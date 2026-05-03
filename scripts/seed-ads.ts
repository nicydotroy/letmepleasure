import { prisma } from '@/lib/prisma'
import { CITIES } from '@/lib/cities'
import { CATEGORIES } from '@/lib/categories'
import * as fs from 'fs'
import * as path from 'path'

// Sample escort profiles with descriptions
const ESCORT_PROFILES = [
  {
    name: 'Akshada Sawant',
    desc: '24-year-old independent call girl offering discreet personalized experiences. Available for outcall and incall. Real photos, verified profile. Speak English & Hindi.',
  },
  {
    name: 'Alka More',
    desc: '26-year-old premium escort providing luxury companionship services. Available 24/7. Discreet, professional, and well-mannered. Speaks English & Hindi.',
  },
  {
    name: 'Alnaya Oberoi',
    desc: '23-year-old independent companion offering genuine experiences. Real photos verified. Available for hotels, restaurants, and events. Speaks fluent English.',
  },
  {
    name: 'Alpa Sutar',
    desc: '25-year-old call girl providing discreet companionship. Available for outcall and incall services. 100% real photos. Speaks English, Hindi & Marathi.',
  },
  {
    name: 'Anishka Rai',
    desc: '22-year-old premium companion available for outcall services. Real photos, verified profile. Professional and discrete. Available 24/7.',
  },
  {
    name: 'Ankita Basu',
    desc: '24-year-old independent escort girl offering personalized services. Real verified photos. Speaks English & Bengali. Available for hotels and resorts.',
  },
  {
    name: 'Avantika Batliwala',
    desc: '26-year-old call girl providing luxury companionship. Real photos verified. Speaks English, Hindi & Gujarati. Available for outcall services.',
  },
  {
    name: 'Barisha Ahuja',
    desc: '23-year-old independent companion offering genuine experiences. Professional, discreet, and real photos. Speaks English & Punjabi.',
  },
  {
    name: 'Bhamini Gupta',
    desc: '25-year-old premium escort providing luxury services. Real photos verified. Available for incall and outcall. Speaks English & Hindi.',
  },
  {
    name: 'Bhumika Patil',
    desc: '24-year-old independent call girl offering discreet personalized experiences. Real verified photos. Speaks English, Hindi & Marathi.',
  },
  {
    name: 'Chaurya Chari',
    desc: '22-year-old companion offering genuine companionship services. Real photos, verified profile. Speaks English & Hindi. Available 24/7.',
  },
  {
    name: 'Deepali Rawat',
    desc: '25-year-old independent escort providing luxury companionship. Real verified photos. Speaks English, Hindi & Pahari. Available for outcall.',
  },
  {
    name: 'Devika Mani',
    desc: '23-year-old call girl offering personalized experiences. Real photos verified. Professional and discreet. Speaks English & Tamil.',
  },
  {
    name: 'Dipti Pilai',
    desc: '26-year-old premium escort providing luxury services. Real photos verified. Speaks English, Hindi & Malayalam. Available 24/7.',
  },
  {
    name: 'Disha Kapoor',
    desc: '24-year-old independent companion offering genuine experiences. Real verified photos. Speaks English & Hindi. Available for incall & outcall.',
  },
]

// Variation snippets — combined deterministically with (city, area, profile)
// to give every ad a unique long description and reduce duplicate-content
// signals across the 39 cities.
const OPENERS = [
  'Hi, I am',
  'Hello, this is',
  'Welcome — I am',
  'Looking for a real companion in',
  'Premium independent companion in',
  'Genuine verified profile of',
]
const VIBES = [
  'discreet & well-mannered',
  'high-class and elegant',
  'warm, friendly and professional',
  'classy, educated and respectful',
  'upscale, GFE and engaging',
  'modern, fun and easygoing',
]
const SERVICES = [
  'incall and outcall',
  'hotel visits, resorts and private apartments',
  'short bookings, dinner dates and overnight',
  'GFE, dinner dates and travel companionship',
  'private apartments and 5-star hotel meets',
  'incall, outcall and travel bookings',
]
const SAFETY = [
  '100% real photos, verified profile',
  'Real recent photos · profile manually verified',
  'Verified ID · authentic recent pictures',
  'Identity-checked · only the woman in the photos meets you',
  'No agency · no fakes · only real verified profile',
]

function buildDescription(opts: {
  profileName: string
  age: string | number
  city: string
  area: string
  category: string
  index: number
}): string {
  const i = Math.abs(opts.profileName.length + opts.area.length + opts.city.length + opts.index)
  const opener = OPENERS[i % OPENERS.length]
  const vibe = VIBES[(i + 1) % VIBES.length]
  const service = SERVICES[(i + 2) % SERVICES.length]
  const safety = SAFETY[(i + 3) % SAFETY.length]
  return [
    `${opener} ${opts.profileName}, a ${opts.age}-year-old ${opts.category.replace(/-/g, ' ')} based in ${opts.area}, ${opts.city}.`,
    `I am ${vibe}, available for ${service} across ${opts.area} and the wider ${opts.city} area.`,
    `${safety}. Speak English & Hindi. Direct WhatsApp & phone, no advance payment, no middlemen.`,
    `Bookings preferred a few hours in advance for hotels in ${opts.city}; same-day meets in ${opts.area} can usually be arranged.`,
  ].join(' ')
}

async function seedAds() {
  try {
    console.log('🌱 Starting to seed sample ads (additive — only adds to empty city/area combos)...')

    // Get the images
    const imagesDir = path.join(process.cwd(), 'public/uploads/ads/originals')
    const imageFiles = fs
      .readdirSync(imagesDir)
      .filter((f) => !f.startsWith('.'))
      .filter((f) => /\.(webp|jpg|jpeg|png)$/i.test(f))

    console.log(`📸 Found ${imageFiles.length} images`)

    if (imageFiles.length === 0) {
      console.error('❌ No images found in public/uploads/ads/originals/')
      process.exit(1)
    }

    // 1. Fix image-path casing on existing ads (production filesystems are case-sensitive)
    console.log('\n🔧 Normalizing image paths on existing ads to lowercase…')
    const allExistingAds = await prisma.ad.findMany({ select: { id: true, images: true } })
    let pathFixCount = 0
    for (const ad of allExistingAds) {
      try {
        const imgs: string[] = JSON.parse(ad.images || '[]')
        const normalized = imgs.map((p) => {
          // Lowercase only the filename portion, keep directory casing
          const idx = p.lastIndexOf('/')
          if (idx === -1) return p.toLowerCase()
          const dir = p.slice(0, idx + 1)
          const file = p.slice(idx + 1).toLowerCase()
          return dir + file
        })
        const before = JSON.stringify(imgs)
        const after = JSON.stringify(normalized)
        if (before !== after) {
          await prisma.ad.update({ where: { id: ad.id }, data: { images: after } })
          pathFixCount++
        }
      } catch {
        // skip malformed image json
      }
    }
    console.log(`✅ Updated image paths on ${pathFixCount} existing ads`)

    // 1b. Rewrite generic titles/descriptions on existing ads so each one is
    //     unique per (city, area). The original seed used 15 description
    //     templates across all 39 cities — Google sees that as duplicate
    //     content and won't index most of them.
    console.log('\n🔧 Rewriting generic titles & descriptions on existing ads…')
    const adsForRewrite = await prisma.ad.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        city: true,
        area: true,
        category: true,
      },
    })
    let rewriteCount = 0
    for (let i = 0; i < adsForRewrite.length; i++) {
      const ad = adsForRewrite[i]
      // Skip ads that already include the area name in the title (a heuristic
      // for "already rewritten or genuinely unique").
      if (ad.title.includes(ad.area)) continue
      // Skip ads whose description already mentions both city + area
      if (ad.description.includes(ad.area) && ad.description.includes(ad.city)) continue

      const ageMatch = ad.description.match(/(\d{2})-year-old/)
      const age = ageMatch ? ageMatch[1] : (22 + (i % 8)).toString()
      const newDescription = buildDescription({
        profileName: ad.title,
        age,
        city: ad.city,
        area: ad.area,
        category: ad.category,
        index: i,
      })
      const newTitle = `${ad.title} — ${ad.area}, ${ad.city}`
      try {
        await prisma.ad.update({
          where: { id: ad.id },
          data: { title: newTitle, description: newDescription },
        })
        rewriteCount++
      } catch {/* skip on conflict */}
    }
    console.log(`✅ Rewrote ${rewriteCount} ads with unique per-location titles & descriptions`)

    // 2. Find which (citySlug, areaSlug) combos already have ads
    const existingCombos = await prisma.ad.groupBy({
      by: ['citySlug', 'areaSlug'],
      _count: { id: true },
    })
    const seededKeys = new Set(existingCombos.map((c) => `${c.citySlug}::${c.areaSlug}`))
    console.log(`📊 ${seededKeys.size} city/area combos already have ads — skipping those`)

    let adCount = 0
    const adsToCreate: any[] = []

    // 3. Prepare ads ONLY for empty city/area combos
    for (const city of CITIES) {
      for (const area of city.areas) {
        const key = `${city.slug}::${area.slug}`
        if (seededKeys.has(key)) continue

        for (const category of CATEGORIES) {
          for (let i = 0; i < 2; i++) {
            const profile = ESCORT_PROFILES[adCount % ESCORT_PROFILES.length]
            const ageMatch = profile.desc.match(/(\d{2})-year-old/)
            const age = ageMatch ? ageMatch[1] : (22 + (adCount % 8)).toString()
            const randomImages = [...imageFiles]
              .sort(() => 0.5 - Math.random())
              .slice(0, 3)
              .map((img) => `/uploads/ads/originals/${img}`)

            const description = buildDescription({
              profileName: profile.name,
              age,
              city: city.name,
              area: area.name,
              category: category.name,
              index: adCount,
            })

            adsToCreate.push({
              title: `${profile.name} — ${area.name}, ${city.name}`,
              description,
              category: category.slug,
              price: `₹5000 - ₹15000/hour`,
              city: city.name,
              citySlug: city.slug,
              area: area.name,
              areaSlug: area.slug,
              phone: '+91-9229604907',
              whatsapp: '+91-9229604907',
              images: JSON.stringify(randomImages),
              status: 'approved',
              isActive: true,
              approvedAt: new Date(),
            })

            adCount++
          }
        }
      }
    }

    if (adsToCreate.length === 0) {
      console.log('\n✨ No new locations to seed — every city/area already has ads.')
      return
    }

    console.log(`\n🔄 Creating ${adsToCreate.length} ads in batches (50 at a time)...`)

    // Create all ads in batches of 50
    const batchSize = 50
    for (let i = 0; i < adsToCreate.length; i += batchSize) {
      const batch = adsToCreate.slice(i, i + batchSize)
      await Promise.all(batch.map((data) => prisma.ad.create({ data })))
      const progress = Math.min(i + batchSize, adsToCreate.length)
      console.log(`✅ Created ${progress}/${adsToCreate.length} ads`)
    }

    console.log(
      `\n🎉 Successfully added ${adsToCreate.length} ads to previously empty locations across ${CITIES.length} cities!`
    )
  } catch (error) {
    console.error('❌ Error seeding ads:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedAds()
