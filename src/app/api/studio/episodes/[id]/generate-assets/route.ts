import { NextResponse } from 'next/server'
import { auth } from '../../../../../../../auth'
import { prisma } from '@/lib/db'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { isAdminUser } from '@/lib/authz'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    if (!(await isAdminUser(session.user.id))) {
      return NextResponse.json(
        { error: 'Admin only' },
        { status: 403 }
      )
    }

    const { id } = await params
    const { assetTypes = ['BROLL', 'THUMBNAIL'] } = await request.json()

    const episode = await prisma.episode.findUnique({
      where: { id },
      include: {
        canonicalScript: true,
      },
    })

    if (!episode) {
      return NextResponse.json(
        { error: 'Episode not found' },
        { status: 404 }
      )
    }

    if (!episode.canonicalScript) {
      return NextResponse.json(
        { error: 'No canonical script found. Generate script first.' },
        { status: 400 }
      )
    }

    const createdAssets = []

    // Generate B-roll prompts if requested
    if (assetTypes.includes('BROLL')) {
      const prompt = `Analyze this video script and generate 5-8 B-roll video prompts for a film noir aesthetic.

Script:
${episode.canonicalScript.content.substring(0, 2000)}

For each B-roll clip, create a cinematic prompt suitable for AI video generation (Sora, Veo, Runway).

Requirements:
- Film noir style: moody lighting, high contrast, urban settings
- Relevant to the SPM topic being discussed
- Each 3-6 seconds long
- Visual metaphors for abstract concepts

Return a JSON array of objects with:
- scene: Brief description
- prompt: Detailed AI generation prompt
- duration: Seconds (3-6)
- timing: When in script (e.g., "During accelerator discussion")

Example:
[
  {
    "scene": "Ledger Pages",
    "prompt": "Close-up of vintage accounting ledger, pages turning in wind, harsh shadows, film noir lighting, black and white with amber highlights",
    "duration": 4,
    "timing": "Hook - compensation as behavior signal"
  }
]

Return ONLY the JSON array.`

      const { text } = await generateText({
        model: openai('gpt-4o'),
        prompt,
      })

      // Parse B-roll prompts
      try {
        const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        const brollPrompts = JSON.parse(cleanText)

        // Create asset records for each B-roll clip
        for (const broll of brollPrompts) {
          const asset = await prisma.asset.create({
            data: {
              episodeId: episode.id,
              type: 'BROLL',
              prompt: broll.prompt,
              status: 'PENDING',
            },
          })
          createdAssets.push(asset)
        }
      } catch (parseError) {
        console.error('Failed to parse B-roll prompts:', text)
      }
    }

    // Generate thumbnail prompt if requested
    if (assetTypes.includes('THUMBNAIL')) {
      const prompt = `Create a compelling thumbnail concept for this video:

Title: ${episode.title}
Premise: ${episode.premise}

Generate a thumbnail description that:
- Film noir aesthetic (dark, moody, high contrast)
- Toddfather character or noir motif
- Text overlay concept (punchy, readable)
- Emotional hook (curiosity, concern, insight)

Return a single JSON object:
{
  "concept": "Brief concept description",
  "imagePrompt": "Detailed AI image generation prompt",
  "textOverlay": "Main text to overlay",
  "colorScheme": "Dominant colors"
}

Return ONLY the JSON object.`

      const { text } = await generateText({
        model: openai('gpt-4o'),
        prompt,
      })

      try {
        const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        const thumbnailData = JSON.parse(cleanText)

        const asset = await prisma.asset.create({
          data: {
            episodeId: episode.id,
            type: 'THUMBNAIL',
            prompt: thumbnailData.imagePrompt,
            status: 'PENDING',
          },
        })
        createdAssets.push(asset)
      } catch (parseError) {
        console.error('Failed to parse thumbnail prompt:', text)
      }
    }

    return NextResponse.json({
      assets: createdAssets,
      count: createdAssets.length,
      message: 'Asset prompts generated. Use external APIs to generate actual assets.',
    })

  } catch (error) {
    console.error('Error generating assets:', error)
    return NextResponse.json(
      { error: 'Failed to generate assets' },
      { status: 500 }
    )
  }
}
