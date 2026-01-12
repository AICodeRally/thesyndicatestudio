import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generateText } from 'ai'
import { gateway, getProviderOptions } from '@/lib/ai/gateway'
import { isAdminUser } from '@/lib/authz'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    if (!(await isAdminUser(userId))) {
      return NextResponse.json(
        { error: 'Admin only' },
        { status: 403 }
      )
    }

    const { id } = await params

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
        { error: 'No canonical script found' },
        { status: 400 }
      )
    }

    // Extract Counsel items from script using AI
    const prompt = `Analyze this video script and extract 3-7 actionable Counsel items.

Script:
${episode.canonicalScript.content}

For each Counsel item, provide:
1. **slug**: URL-friendly identifier (e.g., "accelerator-timing-risk")
2. **title**: Clear, specific title (e.g., "Accelerator Timing Risk")
3. **oneLiner**: One-sentence insight (e.g., "Accelerators shift deal timing before they shift value")
4. **type**: NOTE, CHECKLIST, PROTOCOL, DIAGNOSTIC, TEMPLATE, or MODEL
5. **channel**: PLAN_DESIGN, MEASURES, PAYOUT_CURVES, QUOTA, SPIFFS_DRAWS, GOVERNANCE, DISPUTES, ICM_OPS, or AI_SPM
6. **difficulty**: INTRO, OPERATOR, or ARCHITECT
7. **timeToApplyMin**: Estimated minutes to apply (5-60)
8. **problemStatement**: 2-3 sentences describing the problem
9. **mechanism**: 2-3 sentences explaining why this happens
10. **tags**: 3-5 relevant tags

Return ONLY a JSON array of Counsel objects. No other text.

Example format:
[
  {
    "slug": "accelerator-timing-risk",
    "title": "Accelerator Timing Risk",
    "oneLiner": "Accelerators shift deal timing before they shift value",
    "type": "NOTE",
    "channel": "PAYOUT_CURVES",
    "difficulty": "OPERATOR",
    "timeToApplyMin": 15,
    "problemStatement": "Most comp teams focus on accelerator payout rates but ignore timing effects. Reps optimize when deals close, not just which deals close.",
    "mechanism": "When accelerators kick in at threshold (e.g., 100% attainment), reps time deal closures to land in the right period. This creates artificial demand volatility.",
    "tags": ["accelerators", "timing", "behavior", "payout-curves"]
  }
]`

    const { text } = await generateText({
      model: gateway('openai/gpt-4o'),
      prompt,
      providerOptions: getProviderOptions('analysis'),
    })

    // Parse JSON response
    let counselItems
    try {
      // Remove any markdown code blocks if present
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      counselItems = JSON.parse(cleanText)
    } catch (parseError) {
      console.error('Failed to parse AI response:', text)
      return NextResponse.json(
        { error: 'Failed to parse Counsel items from AI response' },
        { status: 500 }
      )
    }

    // Update episode with counsel references
    await prisma.episode.update({
      where: { id },
      data: {
        counselRefs: counselItems.map((c: any) => c.slug),
      },
    })

    return NextResponse.json({
      counselItems,
      count: counselItems.length,
      message: 'Counsel items extracted. Review and publish manually.',
    })
  } catch (error) {
    console.error('Error extracting Counsel:', error)
    return NextResponse.json(
      { error: 'Failed to extract Counsel' },
      { status: 500 }
    )
  }
}
