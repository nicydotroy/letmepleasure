# 🖼️ Image Upload System - Quick Start Guide

## ✅ What Was Created

I've built a complete image upload system for your Letme Pleasure application with:

### 📁 Folders Created
- `public/logos/` - For your website logo and branding
- `public/assets/` - For general website assets (icons, banners)
- `public/uploads/ads/` - For user-uploaded advertisement images

### 📝 Files Created

1. **`src/lib/image-validation.ts`** - Image validation utilities
   - File size validation (5MB max)
   - Image format validation
   - Dimension checking
   - Safe filename generation

2. **`src/app/api/ads/upload/route.ts`** - Upload API endpoint
   - Handle POST requests for image uploads
   - Server-side validation
   - Returns image paths
   - DELETE endpoint for removing images

3. **`src/components/ImageUploader.tsx`** - Upload component
   - Drag & drop support
   - File preview
   - Real-time validation
   - Error display

4. **`src/components/AdImageGallery.tsx`** - Image display component
   - Multiple image support
   - Lightbox modal
   - Navigation arrows
   - Responsive design

5. **`src/components/AdFormWithImages.tsx`** - Complete ad form
   - Image upload integrated
   - Ad details fields
   - Form validation
   - Success/error feedback

6. **`src/hooks/useImageUpload.ts`** - Custom React hook
   - Reusable upload logic
   - State management
   - Error handling

7. **`IMAGE_UPLOAD_GUIDE.md`** - Full documentation

---

## 🚀 Quick Integration Steps

### Step 1: Create Post-Ad Page with Images

Create a new file: `src/app/post-ad/page.tsx`

```tsx
'use client'

import AdFormWithImages from '@/components/AdFormWithImages'
import { useRouter } from 'next/navigation'

export default function PostAdPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Post Your Advertisement</h1>
        
        <AdFormWithImages
          onSuccess={(data) => {
            alert('Ad posted successfully!')
            router.push(`/ads/${data.id}`)
          }}
          onError={(error) => {
            alert('Error: ' + error)
          }}
        />
      </div>
    </div>
  )
}
```

### Step 2: Display Images in Ad Details

Update your ad details page: `src/app/ads/[id]/page.tsx`

```tsx
import AdImageGallery from '@/components/AdImageGallery'

export default function AdDetailPage({ params }: { params: { id: string } }) {
  // Fetch ad from database
  const ad = await fetchAd(params.id)
  const images = JSON.parse(ad.images || '[]')

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <AdImageGallery
            images={images}
            title={ad.title}
            className="h-96"
          />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{ad.title}</h1>
          <p className="text-lg text-gray-600">{ad.description}</p>
          {/* Rest of ad details */}
        </div>
      </div>
    </div>
  )
}
```

### Step 3: Update Ad List to Show Images

In `src/components/AdCard.tsx` (already supports images):

```tsx
import AdImageGallery from '@/components/AdImageGallery'

export default function AdCard({ ad }: { ad: Ad }) {
  const images: string[] = JSON.parse(ad.images || '[]')

  return (
    <Link href={`/ads/${ad.id}`}>
      <div className="rounded-2xl overflow-hidden shadow-lg">
        <AdImageGallery
          images={images}
          title={ad.title}
          className="h-48"
        />
        {/* Rest of card content */}
      </div>
    </Link>
  )
}
```

### Step 4: Database Setup

Ensure your Prisma schema has the images field:

```prisma
model Ad {
  id          String   @id @default(cuid())
  title       String
  description String?
  images      String   @default("[]") // JSON array of image paths
  category    String
  price       String?
  phone       String
  whatsapp    String?
  citySlug    String
  areaSlug    String
  status      String   @default("pending")
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 💻 Using the Components

### ImageUploader Component

```tsx
import ImageUploader from '@/components/ImageUploader'

function MyComponent() {
  const [image, setImage] = useState<File | null>(null)

  return (
    <ImageUploader
      onImageSelect={(file) => setImage(file)}
      onError={(error) => console.error(error)}
    />
  )
}
```

### useImageUpload Hook

```tsx
import { useImageUpload } from '@/hooks/useImageUpload'

function MyComponent() {
  const { uploadImage, loading, error, uploadedImagePath } = useImageUpload({
    onSuccess: (path, fileName) => {
      console.log('Uploaded:', path)
    },
    onError: (error) => {
      console.error('Upload error:', error)
    },
  })

  const handleUpload = async (file: File) => {
    await uploadImage(file, 'ad-123')
  }

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      {uploadedImagePath && (
        <p className="text-green-500">Uploaded: {uploadedImagePath}</p>
      )}
    </div>
  )
}
```

### AdImageGallery Component

```tsx
import AdImageGallery from '@/components/AdImageGallery'

function MyComponent() {
  const images = [
    '/uploads/ads/image1.jpg',
    '/uploads/ads/image2.jpg',
    '/uploads/ads/image3.jpg',
  ]

  return (
    <AdImageGallery
      images={images}
      title="Product Photos"
      className="h-96 rounded-lg"
    />
  )
}
```

---

## 🔒 Security Features

✅ **File Type Validation**
- Only JPEG, PNG, WebP, GIF allowed
- MIME type and extension checked

✅ **File Size Limits**
- Maximum 5MB per file
- Prevents large uploads

✅ **Image Dimension Limits**
- Maximum 4000x4000 pixels
- Prevents huge image files

✅ **Filename Sanitization**
- Safe filename generation
- Prevents path traversal attacks
- Timestamp + random string added

✅ **Server-Side Validation**
- All validations re-run on server
- Never trust client-only validation

---

## 📋 Supported Image Formats

- JPEG/JPG
- PNG
- WebP (modern, compressed)
- GIF (including animated)

---

## 🧪 Testing the System

### Test Upload via API

```bash
# Create a test image
curl -X POST http://localhost:3000/api/ads/upload \
  -F "image=@test-image.jpg" \
  -F "adId=test-ad-123"
```

### Expected Response

```json
{
  "success": true,
  "fileName": "my-image-1234567890-abc123.jpg",
  "imagePath": "/uploads/ads/my-image-1234567890-abc123.jpg",
  "url": "/uploads/ads/my-image-1234567890-abc123.jpg"
}
```

### Access Uploaded Image

```
http://localhost:3000/uploads/ads/my-image-1234567890-abc123.jpg
```

---

## ⚠️ Important Notes

1. **Database Field**: Make sure your Ad model has an `images` field (JSON string)
2. **Directory Permissions**: Ensure `public/uploads/ads/` is writable
3. **Storage**: Uploaded images are saved locally. For production on Render:
   - Consider using cloud storage (S3, Cloudinary, etc.)
   - Local uploads won't persist between deployments

4. **Storing Multiple Images**:
   ```typescript
   const imagePaths = ['/uploads/ads/img1.jpg', '/uploads/ads/img2.jpg']
   const ad = await prisma.ad.create({
     data: {
       title: 'My Item',
       images: JSON.stringify(imagePaths),
       // ... other data
     }
   })
   ```

---

## 🔧 Customization

### Change Max File Size

In `src/lib/image-validation.ts`:
```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB instead of 5MB
```

### Add More Image Formats

In `src/lib/image-validation.ts`:
```typescript
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml', // Add SVG
]
```

### Change Upload Directory

In `src/app/api/ads/upload/route.ts`:
```typescript
const uploadsDir = path.join(
  process.cwd(),
  'public',
  'uploads',
  'custom-dir' // Change directory
)
```

---

## 🚨 Troubleshooting

**Images not uploading?**
- Check file size (max 5MB)
- Verify file format
- Check browser console for errors

**Images not displaying?**
- Verify image path in database
- Check file exists: `public/uploads/ads/`
- Test direct URL: `http://localhost:3000/uploads/ads/{filename}`

**Permission denied errors?**
- Run: `chmod -R 755 public/uploads/`
- Check directory ownership

---

## 📚 Next Steps

1. ✅ Create `/post-ad` page with `AdFormWithImages`
2. ✅ Update ad detail pages to use `AdImageGallery`
3. ✅ Update `AdCard` component to display images
4. ✅ Test image uploads thoroughly
5. ✅ For production, consider cloud storage solution
6. ✅ Update `.gitignore` (already done!)

---

## 📞 Support

For full documentation, see: **IMAGE_UPLOAD_GUIDE.md**

All components support TypeScript and have proper type definitions. Feel free to customize styling and behavior to match your design system!
