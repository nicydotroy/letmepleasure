import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { validateImageFile, generateFileName, getImagePath } from '@/lib/image-validation'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File | null
    const adId = formData.get('adId') as string | null

    // Validate inputs
    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
    }

    if (!adId) {
      return NextResponse.json({ error: 'No ad ID provided' }, { status: 400 })
    }

    // Validate image file
    const validation = await validateImageFile(file)
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Generate safe filename
    const fileName = validation.fileName || generateFileName(file.name)

    // Save file to public/uploads/ads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'ads')
    const filePath = path.join(uploadsDir, fileName)

    // Create directory if it doesn't exist
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      console.error('Error creating uploads directory:', error)
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Return response with image path
    const imagePath = getImagePath(fileName)

    return NextResponse.json(
      {
        success: true,
        fileName,
        imagePath,
        url: imagePath,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get('fileName')

    if (!fileName) {
      return NextResponse.json({ error: 'No file name provided' }, { status: 400 })
    }

    // Security: ensure fileName doesn't contain path traversal attempts
    if (fileName.includes('..') || fileName.includes('/')) {
      return NextResponse.json({ error: 'Invalid file name' }, { status: 400 })
    }

    // Delete file from disk (optional)
    try {
      const filePath = path.join(process.cwd(), 'public', 'uploads', 'ads', fileName)
      // Uncomment if you want to actually delete files:
      // await unlink(filePath)
    } catch (error) {
      console.error('Error deleting file:', error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Image deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
