import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { uploadCustomVoice } from '@/lib/video/heygen'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('audio') as File
    const name = formData.get('name') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${name}-${Date.now()}.mp3`
    const publicPath = join(process.cwd(), 'public', 'voices', filename)

    const { mkdir } = await import('fs/promises')
    await mkdir(join(process.cwd(), 'public', 'voices'), { recursive: true })

    await writeFile(publicPath, buffer)
    const localUrl = `/voices/${filename}`

    let heygenVoiceId = null
    let heygenStatus = 'pending'

    if (process.env.HEYGEN_API_KEY) {
      try {
        const heygenResult = await uploadCustomVoice(buffer, name)
        heygenVoiceId = heygenResult.voiceId
        heygenStatus = heygenResult.status
      } catch (error) {
        console.error('HeyGen voice upload failed (continuing with local only):', error)
      }
    }

    const voice = await prisma.toddStudioAsset.create({
      data: {
        type: 'VOICE',
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        version: '1.0.0',
        url: localUrl,
        metadataJson: {
          provider: heygenVoiceId ? 'heygen' : 'local',
          providerId: heygenVoiceId,
          heygenStatus: heygenStatus,
          originalFileName: file.name,
          uploadedAt: new Date().toISOString(),
          localPath: publicPath,
        },
      },
    })

    return NextResponse.json({
      voice: {
        id: voice.id,
        name: voice.slug,
        audioUrl: voice.url,
        provider: heygenVoiceId ? 'heygen' : 'local',
        providerId: heygenVoiceId,
        heygenStatus: heygenStatus,
      },
    })
  } catch (error) {
    console.error('Error uploading voice:', error)
    return NextResponse.json(
      { error: 'Failed to upload voice' },
      { status: 500 }
    )
  }
}
