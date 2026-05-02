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
            const randomImages = [...imageFiles]
              .sort(() => 0.5 - Math.random())
              .slice(0, 3)
              .map((img) => `/uploads/ads/originals/${img}`)

            adsToCreate.push({
              title: profile.name,
              description: profile.desc,
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
