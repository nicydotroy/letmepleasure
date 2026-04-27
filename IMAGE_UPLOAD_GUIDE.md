# Image Upload System Documentation

## Overview
This system provides complete functionality for handling advertisement image uploads, validation, storage, and display in the ListVoo application.

## Folder Structure

```
public/
├── logos/              # Website logo and branding images
├── assets/             # General website assets (icons, banners)
└── uploads/
    └── ads/            # User-uploaded advertisement images
```

## Files Created

### 1. **Image Validation Library** (`src/lib/image-validation.ts`)
Handles all image validation logic including:
- File size validation (5MB max)
- MIME type validation
- File extension validation
- Image dimension validation (4000x4000px max)
- Safe filename generation

**Key Functions:**
```typescript
// Validate a single image file
const validation = await validateImageFile(file)

// Validate multiple files
const { valid, invalid } = await validateMultipleImages(files)

// Generate safe filename
const fileName = generateFileName(originalName)

// Get image URL path
const path = getImagePath(fileName)
```

### 2. **Upload API Route** (`src/app/api/ads/upload/route.ts`)
RESTful API endpoint for handling image uploads.

**POST `/api/ads/upload`**
- Accepts multipart form data with `image` file
- Requires `adId` for tracking
- Returns: `{ success, fileName, imagePath, url }`
- Validates file on server-side
- Saves to `public/uploads/ads/`

**DELETE `/api/ads/upload?fileName={name}`**
- Deletes uploaded image (security-protected)

**Example Usage:**
```typescript
const formData = new FormData()
formData.append('image', file)
formData.append('adId', adId)

const response = await fetch('/api/ads/upload', {
  method: 'POST',
  body: formData,
})

const data = await response.json()
console.log(data.imagePath) // '/uploads/ads/my-image-123456.jpg'
```

### 3. **Image Uploader Component** (`src/components/ImageUploader.tsx`)
Client-side component for uploading images.

**Features:**
- Drag and drop support
- File preview
- Client-side validation
- Error display
- Supports: JPG, PNG, WebP, GIF
- Max size: 5MB

**Usage:**
```tsx
import ImageUploader from '@/components/ImageUploader'

export default function MyComponent() {
  const handleImageSelect = (file: File) => {
    console.log('Selected:', file)
  }

  return (
    <ImageUploader
      onImageSelect={handleImageSelect}
      onError={(error) => console.error(error)}
      adId="ad-123"
    />
  )
}
```

### 4. **Image Gallery Component** (`src/components/AdImageGallery.tsx`)
Display images in a gallery with lightbox functionality.

**Features:**
- Multiple image support
- Navigation arrows
- Thumbnail preview
- Full-screen lightbox modal
- Image counter
- Responsive design

**Usage:**
```tsx
import AdImageGallery from '@/components/AdImageGallery'

const images = [
  '/uploads/ads/image1.jpg',
  '/uploads/ads/image2.jpg',
]

export default function AdDetail() {
  return (
    <AdImageGallery
      images={images}
      title="Product Photos"
      className="h-96"
    />
  )
}
```

### 5. **Ad Form with Images** (`src/components/AdFormWithImages.tsx`)
Complete form component for creating ads with image upload.

**Features:**
- Image upload with validation
- Form fields for ad details
- Real-time upload feedback
- Error handling
- Success confirmation

**Usage:**
```tsx
import AdFormWithImages from '@/components/AdFormWithImages'

export default function PostAdPage() {
  return (
    <AdFormWithImages
      onSuccess={(data) => console.log('Ad created:', data)}
      onError={(error) => console.error('Error:', error)}
    />
  )
}
```

## Configuration

### Supported Image Formats
- JPEG/JPG
- PNG
- WebP
- GIF

### Size Limits
- Maximum file size: 5MB
- Maximum image dimensions: 4000x4000 pixels

### Storage Location
- Images are saved to: `public/uploads/ads/`
- Files are automatically served by Next.js static file serving
- Access via: `http://localhost:3000/uploads/ads/{filename}`

## Using the Image Gallery in Existing Components

To update the existing AdCard component to use the gallery:

```tsx
import AdImageGallery from '@/components/AdImageGallery'

export default function AdCard({ ad }: { ad: Ad }) {
  const images: string[] = JSON.parse(ad.images || '[]')
  
  return (
    <div>
      <AdImageGallery
        images={images}
        title={ad.title}
        className="h-48"
      />
      {/* Rest of card content */}
    </div>
  )
}
```

## Database Schema

Make sure your Prisma schema includes the images field:

```prisma
model Ad {
  id        String   @id @default(cuid())
  title     String
  images    String   @default("[]") // JSON array of image paths
  // ... other fields
}
```

To store multiple images:
```typescript
const imagePaths = ['/uploads/ads/img1.jpg', '/uploads/ads/img2.jpg']
await prisma.ad.create({
  data: {
    title: 'My Item',
    images: JSON.stringify(imagePaths),
    // ... other data
  }
})
```

## Error Handling

### Client-Side Validation Errors
- File too large
- Invalid file type
- Unsupported extension
- Image dimensions too large

### Server-Side Validation
- All validations are re-run on the server
- Path traversal attempts are blocked
- Secure filename generation prevents conflicts

## Best Practices

1. **Always validate on both client and server**
   - Client validation for better UX
   - Server validation for security

2. **Store image paths as JSON in database**
   ```typescript
   const images = ['/uploads/ads/img1.jpg', '/uploads/ads/img2.jpg']
   images_json: JSON.stringify(images)
   ```

3. **Use the ImageGallery component for consistent display**
   - Provides lightbox experience
   - Handles multiple images properly
   - Responsive design

4. **Handle upload errors gracefully**
   ```tsx
   const [uploadError, setUploadError] = useState<string | null>(null)
   
   const handleUpload = async () => {
     try {
       // upload logic
     } catch (error) {
       setUploadError('Failed to upload image')
     }
   }
   ```

## Security Considerations

1. **Filename Sanitization**: All user-provided filenames are sanitized
2. **Path Traversal Protection**: `..` and `/` in filenames are blocked on deletion
3. **File Type Validation**: MIME type and extension checked
4. **File Size Limits**: 5MB maximum enforced
5. **Server-Side Re-validation**: Always validate on server, never trust client

## Testing the System

1. **Upload an image:**
   ```bash
   curl -X POST http://localhost:3000/api/ads/upload \
     -F "image=@/path/to/image.jpg" \
     -F "adId=test-123"
   ```

2. **Access uploaded image:**
   ```
   http://localhost:3000/uploads/ads/{filename}
   ```

3. **Delete an image:**
   ```bash
   curl -X DELETE http://localhost:3000/api/ads/upload?fileName={filename}
   ```

## Troubleshooting

**Images not uploading:**
- Check file size (max 5MB)
- Verify file format (JPG, PNG, WebP, GIF)
- Ensure upload directory exists: `public/uploads/ads/`

**Images not displaying:**
- Verify image path is correct in database
- Check file exists in `public/uploads/ads/`
- Test direct URL access: `http://localhost:3000/uploads/ads/{filename}`

**Permission errors:**
- Ensure `public/uploads/ads/` directory is writable
- Check file permissions in the directory

## Next Steps

1. Add the `AdFormWithImages` component to your post-ad page
2. Update existing ad creation forms to use `ImageUploader`
3. Update ad display pages to use `AdImageGallery`
4. Test image uploads thoroughly before production deployment
