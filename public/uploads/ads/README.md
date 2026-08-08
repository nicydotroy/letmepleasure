# Ad Images Storage

This directory stores all images uploaded for ads on letmepleasure.

## Folder Structure

```
ads/
├── originals/      # Original uploaded images (full resolution)
├── thumbnails/     # Compressed/resized versions for listings
├── temp/           # Temporary files during upload processing
└── README.md       # This file
```

## Usage

### Adding Images to Ads

1. **Through Web Interface**: Upload images via the Post Ad form at `/post-ad`
2. **Manual Upload**: Add image files directly to the `originals/` folder

### Folder Details

#### `originals/`
- Contains full-resolution images as uploaded by users
- Used for detailed ad view pages
- Can be large file sizes

#### `thumbnails/`
- Compressed/resized versions for faster loading
- Used on listing pages and grid views
- Smaller file sizes for better performance

#### `temp/`
- Temporary files during upload and processing
- Safe to delete periodically
- Cleaned up automatically after processing

## API Endpoint

Upload images via the API:
```
POST /api/ads/upload
```

**Parameters:**
- `image`: File (multipart)
- `adId`: String (ad identifier)

**Response:**
```json
{
  "imagePath": "/uploads/ads/filename.jpg"
}
```

## Supported Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

## Size Limits

- Max file size: 5MB per image
- Recommended: 800x600px minimum
- Optimal: 1200x900px or larger

## File Naming

Files are automatically renamed with timestamps to prevent conflicts:
- Format: `{timestamp}_{random}_{originalname}`
- Example: `1703001234567_abc123_escortsad.jpg`

## Cleanup

To maintain disk space:
1. Archive old images regularly
2. Delete files from `temp/` folder
3. Consider CDN for scaled deployment

## Security

- Only image files are allowed
- Files are validated before storage
- Access is public (as intended for ad images)
