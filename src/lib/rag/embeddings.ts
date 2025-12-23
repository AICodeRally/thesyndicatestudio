/**
 * Embedding service for The Toddfather RAG
 * Uses Ollama for local embeddings
 */

const OLLAMA_BASE_URL = process.env.OLLAMA_URL ?? 'http://localhost:11434'
const EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL ?? 'nomic-embed-text'

export interface EmbeddingResult {
  embedding: number[]
  model: string
  dimensions: number
}

/**
 * Generate embedding vector for text using Ollama
 */
export async function generateEmbedding(text: string): Promise<EmbeddingResult> {
  if (!text || text.trim().length === 0) {
    throw new Error('Text cannot be empty')
  }

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: EMBEDDING_MODEL,
        prompt: text,
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama embeddings API returned ${response.status}`)
    }

    const data = await response.json()

    return {
      embedding: data.embedding,
      model: EMBEDDING_MODEL,
      dimensions: data.embedding.length,
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate embedding: ${error.message}`)
    }
    throw error
  }
}

/**
 * Generate embeddings for multiple texts in batch
 */
export async function generateEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
  const results: EmbeddingResult[] = []

  for (const text of texts) {
    const result = await generateEmbedding(text)
    results.push(result)
  }

  return results
}

/**
 * Check if Ollama is available for embeddings
 */
export async function isOllamaAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Prepare Counsel document for embedding
 * Combines all relevant text into searchable format
 */
export function prepareCounselForEmbedding(counsel: {
  title: string
  oneLiner: string
  problemStatement: string
  mechanism: string
  channelPrimary: string
  type: string
  difficulty: string
}): string {
  return `Title: ${counsel.title}

One-liner: ${counsel.oneLiner}

Channel: ${counsel.channelPrimary}
Type: ${counsel.type}
Difficulty: ${counsel.difficulty}

Problem Statement:
${counsel.problemStatement}

Mechanism (Why This Happens):
${counsel.mechanism}`
}
