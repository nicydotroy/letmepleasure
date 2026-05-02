import { prisma } from '@/lib/prisma'
import * as fs from 'fs'
import * as path from 'path'

// Sample escort profiles with descriptions
const ESCORT_PROFILES = [
  {
    name: 'Akshada Sawant',
    desc: '24-year-old independent call girl offering discreet personalized experiences. Available for outcall and incall. Real photos, verified profile. Speak English & Hindi.',
    image: 'akshada-sawant.webp',
  },
  {
    name: 'Alka More',
    desc: '26-year-old premium escort providing luxury companionship services. Available 24/7. Discreet, professional, and well-mannered. Speaks English & Hindi.',
    image: 'alka-more.webp',
  },
  {
    name: 'Alnaya Oberoi',
    desc: '23-year-old independent companion offering genuine experiences. Real photos verified. Available for hotels, restaurants, and events. Speaks fluent English.',
    image: 'alnaya-oberoi.webp',
  },
  {
    name: 'Alpa Sutar',
    desc: '25-year-old call girl providing discreet companionship. Available for outcall and incall services. 100% real photos. Speaks English, Hindi & Marathi.',
    image: 'alpa-sutar.webp',
  },
  {
    name: 'Anishka Rai',
    desc: '22-year-old premium companion available for outcall services. Real photos, verified profile. Professional and discrete. Available 24/7.',
    image: 'Anishka-rai.webp',
  },
  {
    name: 'Ankita Basu',
    desc: '24-year-old independent escort girl offering personalized services. Real verified photos. Speaks English & Bengali. Available for hotels and resorts.',
    image: 'ankita-basu.webp',
  },
  {
    name: 'Avantika Batliwala',
    desc: '26-year-old call girl providing luxury companionship. Real photos verified. Speaks English, Hindi & Gujarati. Available for outcall services.',
    image: 'avantika-batliwala.webp',
  },
  {
    name: 'Barisha Ahuja',
    desc: '23-year-old independent companion offering genuine experiences. Professional, discreet, and real photos. Speaks English & Punjabi.',
    image: 'Barisha-ahuja.webp',
  },
  {
    name: 'Bhamini Gupta',
    desc: '25-year-old premium escort providing luxury services. Real photos verified. Available for incall and outcall. Speaks English & Hindi.',
    image: 'bhamini-gupta.webp',
  },
  {
    name: 'Bhumika Patil',
    desc: '24-year-old independent call girl offering discreet personalized experiences. Real verified photos. Speaks English, Hindi & Marathi.',
    image: 'Bhumika-patil.webp',
  },
  {
    name: 'Chaurya Chari',
    desc: '22-year-old companion offering genuine companionship services. Real photos, verified profile. Speaks English & Hindi. Available 24/7.',
    image: 'Chaurya-chari.webp',
  },
  {
    name: 'Deepali Rawat',
    desc: '25-year-old independent escort providing luxury companionship. Real verified photos. Speaks English, Hindi & Pahari. Available for outcall.',
    image: 'deepali-rawat.webp',
  },
  {
    name: 'Devika Mani',
    desc: '23-year-old call girl offering personalized experiences. Real photos verified. Professional and discreet. Speaks English & Tamil.',
    image: 'devika-mani.webp',
  },
  {
    name: 'Dipti Pilai',
    desc: '26-year-old premium escort providing luxury services. Real photos verified. Speaks English, Hindi & Malayalam. Available 24/7.',
    image: 'dipti-pilai.webp',
  },
  {
    name: 'Disha Kapoor',
    desc: '24-year-old independent companion offering genuine experiences. Real verified photos. Speaks English & Hindi. Available for incall & outcall.',
    image: 'disha-kapoor.webp',
  },
]

// Cities and areas
const CITIES_DATA = [
  {
    name: 'Mumbai',
    slug: 'mumbai',
    areas: ['andheri', 'bandra', 'dadar', 'worli', 'powai'],
  },
  {
    name: 'Delhi',
    slug: 'delhi',
    areas: ['connaught-place', 'greater-kailash', 'lajpat-nagar', 'dwarka', 'pitampura'],
  },
  {
    name: 'Bangalore',
    slug: 'bangalore',
    areas: ['koramangala', 'indiranagar', 'whitefield', 'marathahalli', 'jayanagar'],
  },
  {
    name: 'Hyderabad',
    slug: 'hyderabad',
    areas: ['banjara-hills', 'jubilee-hills', 'madhapur', 'gachibowli', 'kondapur'],
  },
  {
    name: 'Chennai',
    slug: 'chennai',
    areas: ['nungambakkam', 'alwarpet', 'teynampet', 'velachery', 'tambaram'],
  },
]

const CATEGORIES = [
  { slug: 'female-escorts', name: 'Female Escorts' },
  { slug: 'call-girls', name: 'Call Girls' },
  { slug: 'female-massage', name: 'Female Massage' },
]

async function seedAds() {
  try {
    console.log('🌱 Starting to seed sample ads...')

    // Get the images
    const imagesDir = path.join(process.cwd(), 'public/uploads/ads/originals')
    const imageFiles = fs
      .readdirSync(imagesDir)
      .filter((f) => f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.png'))

    console.log(`📸 Found ${imageFiles.length} images`)

    let adCount = 0

    // For each city
    for (const city of CITIES_DATA) {
      // For each area in the city
      for (const area of city.areas) {
        // For each category
        for (const category of CATEGORIES) {
          // Create ads using profiles
          const profilesPerLocation = 2 // 2 ads per category per location
          for (let i = 0; i < profilesPerLocation; i++) {
            const profile = ESCORT_PROFILES[adCount % ESCORT_PROFILES.length]
            const randomImages = imageFiles
              .sort(() => 0.5 - Math.random())
              .slice(0, 3) // Pick 3 random images
              .map((img) => `/uploads/ads/originals/${img}`)

            await prisma.ad.create({
              data: {
                title: profile.name,
                description: profile.desc,
                category: category.slug,
                price: `₹5000 - ₹15000/hour`,
                city: city.name,
                citySlug: city.slug,
                area: area.charAt(0).toUpperCase() + area.slice(1).replace('-', ' '),
                areaSlug: area,
                phone: '+91-9229604907',
                whatsapp: '+91-9229604907',
                images: JSON.stringify(randomImages),
                status: 'approved',
                isActive: true,
                approvedAt: new Date(),
              },
            })

            adCount++
            console.log(
              `✅ Created ad ${adCount}: ${profile.name} in ${city.name} - ${area} (${category.name})`
            )
          }
        }
      }
    }

    console.log(`\n🎉 Successfully created ${adCount} sample ads!`)
  } catch (error) {
    console.error('❌ Error seeding ads:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedAds()
