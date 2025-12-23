/**
 * RAG Service for The Toddfather
 * Retrieves relevant Counsel for context-aware responses
 */

import { prisma } from '@/lib/db'
import { generateEmbedding, prepareCounselForEmbedding } from './embeddings'

export interface SearchResult {
  counselId: string
  slug: string
  title: string
  oneLiner: string
  content: string
  score: number
}

/**
 * Cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have same dimensions')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Search Counsel library with semantic similarity
 *
 * Note: This is a simplified version for SQLite.
 * For production with PostgreSQL, use pgvector extension.
 */
export async function searchCounsel(
  query: string,
  options: {
    limit?: number
    threshold?: number
    channel?: string
  } = {}
): Promise<SearchResult[]> {
  const { limit = 5, threshold = 0.5, channel } = options

  try {
    // Generate embedding for query
    const queryEmbedding = await generateEmbedding(query)

    // Get all Counsel (in production, you'd use pgvector for this)
    const counsels = await prisma.counsel.findMany({
      where: {
        status: 'PUBLISHED',
        ...(channel && { channelPrimary: channel }),
      },
    })

    // For now, do simple text matching (keyword-based)
    // TODO: Replace with vector similarity when using PostgreSQL + pgvector
    const results: SearchResult[] = []

    for (const counsel of counsels) {
      const content = prepareCounselForEmbedding(counsel)

      // Simple keyword matching as fallback
      const queryLower = query.toLowerCase()
      const contentLower = content.toLowerCase()

      let score = 0

      // Title match (highest weight)
      if (contentLower.includes(queryLower)) {
        score += 0.8
      }

      // Keyword overlap
      const queryWords = queryLower.split(/\s+/).filter(w => w.length > 3)
      const matchedWords = queryWords.filter(word => contentLower.includes(word))
      score += (matchedWords.length / queryWords.length) * 0.6

      // Channel/type relevance
      if (counsel.channelPrimary.toLowerCase().includes(queryLower)) {
        score += 0.3
      }

      if (score >= threshold) {
        results.push({
          counselId: counsel.id,
          slug: counsel.slug,
          title: counsel.title,
          oneLiner: counsel.oneLiner,
          content,
          score,
        })
      }
    }

    // Sort by score and limit
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

  } catch (error) {
    console.error('RAG search failed:', error)
    return []
  }
}

/**
 * Get context for chat (top matching Counsel)
 */
export async function getChatContext(
  query: string,
  options: {
    limit?: number
    currentCounsel?: string
  } = {}
): Promise<string> {
  const { limit = 3, currentCounsel } = options

  const results = await searchCounsel(query, { limit })

  if (results.length === 0) {
    return ''
  }

  let context = 'Relevant Counsel from the library:\n\n'

  results.forEach((result, idx) => {
    context += `${idx + 1}. ${result.title} (counsel://${result.slug})\n`
    context += `   ${result.oneLiner}\n\n`
  })

  return context
}

/**
 * Index all Counsel documents
 * (Placeholder for PostgreSQL + pgvector setup)
 */
export async function indexAllCounsel(): Promise<number> {
  // TODO: When switching to PostgreSQL:
  // 1. Add pgvector extension
  // 2. Add embedding column to Counsel table
  // 3. Generate embeddings for all Counsel
  // 4. Store vectors in database
  // 5. Use vector similarity search

  console.log('⚠️  RAG indexing not implemented for SQLite')
  console.log('   Switch to PostgreSQL and add pgvector extension for semantic search')

  const count = await prisma.counsel.count({
    where: { status: 'PUBLISHED' },
  })

  return count
}
