import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { uploadAvatarToHeyGen } from '@/lib/video/heygen'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: Request) {
  try {
    

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('image') as File
    const name = formData.get('name') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    // Save to local public directory for development
    // TODO: Switch to Vercel Blob for production
    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${name}-${Date.now()}.png`
    const publicPath = join(process.cwd(), 'public', 'avatars', filename)

    // Ensure directory exists
    const { mkdir } = await import('fs/promises')
    await mkdir(join(process.cwd(), 'public', 'avatars'), { recursive: true })

    await writeFile(publicPath, buffer)
    const localUrl = `/avatars/${filename}`

    let heygenAvatarId = null
    let heygenStatus = 'pending'

    // Try to upload to HeyGen if API key is configured
    if (process.env.HEYGEN_API_KEY) {
      try {
        const heygenResult = await uploadAvatarToHeyGen(buffer, name)
        heygenAvatarId = heygenResult.avatarId
        heygenStatus = heygenResult.status
      } catch (error) {
        console.error('HeyGen upload failed (continuing with local only):', error)
      }
    }

    // Save to database
    const avatar = await prisma.toddStudioAsset.create({
      data: {
        type: 'CHARACTER',
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        version: '1.0.0',
        url: localUrl,
        metadataJson: {
          provider: heygenAvatarId ? 'heygen' : 'local',
          providerId: heygenAvatarId,
          heygenStatus: heygenStatus,
          originalFileName: file.name,
          uploadedAt: new Date().toISOString(),
          localPath: publicPath,
        },
      },
    })

    return NextResponse.json({
      avatar: {
        id: avatar.id,
        name: avatar.slug,
        imageUrl: avatar.url,
        provider: heygenAvatarId ? 'heygen' : 'local',
        providerId: heygenAvatarId,
        heygenStatus: heygenStatus,
      },
    })
  } catch (error) {
    console.error('Error uploading avatar:', error)
    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    )
  }
}
