/**
 * Local LLM Client for The Toddfather
 *
 * Uses Ollama for local SPM expertise
 * Fallback to OpenAI for complex tasks
 */

export interface LocalLLMConfig {
  url: string
  model?: string
  temperature?: number
  maxTokens?: number
}

export interface LocalLLMRequest {
  prompt: string
  model?: string
  temperature?: number
  max_tokens?: number
  stream?: boolean
}

export interface LocalLLMResponse {
  response?: string
  text?: string
  output?: string
  choices?: Array<{ text?: string; message?: { content?: string } }>
  [key: string]: any
}

/**
 * Call local LLM (Ollama) with a prompt
 */
export async function callLocalLLM(
  prompt: string,
  config?: Partial<LocalLLMConfig>
): Promise<string> {
  const url = config?.url ?? process.env.LOCAL_LLM_URL ?? 'http://localhost:11434/api/generate'

  if (!url) {
    throw new Error('LOCAL_LLM_URL not configured')
  }

  const requestBody: LocalLLMRequest = {
    prompt,
    model: config?.model ?? process.env.LOCAL_LLM_MODEL ?? 'llama3.2:3b-instruct-q4_K_M',
    temperature: config?.temperature ?? 0.7,
    max_tokens: config?.maxTokens ?? 2048,
    stream: false,
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Unknown error')
      throw new Error(`Local LLM request failed with status ${res.status}: ${errorText}`)
    }

    const json = (await res.json()) as LocalLLMResponse

    // Adapt to different local LLM response formats
    const output =
      json.response ?? // Ollama
      json.choices?.[0]?.message?.content ?? // OpenAI-compatible
      json.choices?.[0]?.text ?? // Completions API
      json.output ?? // vLLM
      json.text ?? // LM Studio
      JSON.stringify(json)

    return output
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Local LLM call failed: ${err.message}`)
    }
    throw new Error('Local LLM call failed with unknown error')
  }
}

/**
 * Check if local LLM is available
 */
export async function isLocalLLMAvailable(): Promise<boolean> {
  const url = process.env.LOCAL_LLM_URL ?? 'http://localhost:11434/api/generate'
  if (!url) return false

  try {
    await callLocalLLM('test', { maxTokens: 1 })
    return true
  } catch {
    return false
  }
}

/**
 * Stream from local LLM (Ollama streaming)
 */
export async function* streamLocalLLM(
  prompt: string,
  config?: Partial<LocalLLMConfig>
): AsyncGenerator<string> {
  const url = config?.url ?? process.env.LOCAL_LLM_URL ?? 'http://localhost:11434/api/generate'

  const requestBody: LocalLLMRequest = {
    prompt,
    model: config?.model ?? process.env.LOCAL_LLM_MODEL ?? 'llama3.2:3b-instruct-q4_K_M',
    temperature: config?.temperature ?? 0.7,
    max_tokens: config?.maxTokens ?? 2048,
    stream: true,
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!res.ok) {
    throw new Error(`Stream failed with status ${res.status}`)
  }

  const reader = res.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) {
    throw new Error('No response body')
  }

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(line => line.trim())

      for (const line of lines) {
        try {
          const json = JSON.parse(line)
          if (json.response) {
            yield json.response
          }
        } catch {
          // Skip invalid JSON
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}
