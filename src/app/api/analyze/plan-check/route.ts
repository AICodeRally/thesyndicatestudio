import { NextResponse } from 'next/server'
import { generateText } from 'ai'
import { gateway, getProviderOptions } from '@/lib/ai/gateway'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Read file content
    const text = await file.text()

    // Analyze with AI
    const systemPrompt = `You are The Toddfather, an SPM (Sales Performance Management) expert with 20 years of experience.
Analyze the uploaded compensation plan document and provide:
1. Overall risk score (0-100, where 100 is perfect)
2. Risk level (Low/Medium/High)
3. Specific findings categorized as:
   - errors (critical issues that will break)
   - warnings (risky patterns that might cause problems)
   - success (things done well)

Focus on:
- Payout curve gotchas (accelerator cliffs, timing manipulation)
- Split rule edge cases
- Territory overlap risks
- Governance gaps
- Data integrity issues
- Change management process
- Implementation readiness

Return JSON:
{
  "overallRisk": "Medium",
  "score": 68,
  "findings": [
    { "type": "warning", "text": "..." },
    { "type": "error", "text": "..." },
    { "type": "success", "text": "..." }
  ]
}`

    const { text: analysisText } = await generateText({
      model: gateway('openai/gpt-4o'),
      prompt: `Analyze this compensation plan:\n\n${text.substring(0, 8000)}`,
      system: systemPrompt,
      providerOptions: getProviderOptions('analysis'),
    })

    // Parse AI response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {
      overallRisk: 'Medium',
      score: 70,
      findings: [
        { type: 'warning', text: 'Unable to fully analyze document format' },
      ],
    }

    return NextResponse.json(analysis)

  } catch (error) {
    console.error('Plan check error:', error)
    return NextResponse.json(
      { error: 'Analysis failed' },
      { status: 500 }
    )
  }
}
