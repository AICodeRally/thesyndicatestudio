import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { listHeyGenVoices } from '@/lib/video/heygen'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch custom voices from database
    const customVoices = await prisma.toddStudioAsset.findMany({
      where: { type: 'VOICE' },
      orderBy: { createdAt: 'desc' },
    })

    // Fetch HeyGen AI voices if API key is configured
    let heygenVoices = []
    if (process.env.HEYGEN_API_KEY) {
      try {
        heygenVoices = await listHeyGenVoices()
      } catch (error) {
        console.error('Failed to fetch HeyGen voices:', error)
      }
    }

    return NextResponse.json({
      voices: [
        ...customVoices.map(v => ({
          id: v.id,
          name: v.slug,
          provider: 'custom',
          providerId: v.metadataJson.providerId,
          status: v.metadataJson.status || 'ready',
        })),
        ...heygenVoices.map((v: any) => ({
          id: v.voice_id,
          name: v.display_name || v.voice_id,
          provider: 'heygen',
          providerId: v.voice_id,
          status: 'ready',
          language: v.language,
          gender: v.gender,
        })),
      ],
    })
  } catch (error) {
    console.error('Error fetching voices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch voices' },
      { status: 500 }
    )
  }
}
