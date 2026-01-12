/**
 * AI Gateway Configuration
 *
 * Uses Vercel AI Gateway with BYOK for all AI calls.
 * API keys are configured in Vercel Dashboard -> AI Gateway -> BYOK
 * No need to set OPENAI_API_KEY or ANTHROPIC_API_KEY in environment.
 */
import { gateway } from 'ai'

// Model configurations by use case
export const AI_MODELS = {
  // Chat - needs fast responses, good at conversation
  chat: {
    primary: 'openai/gpt-4o',
    fallbacks: ['anthropic/claude-sonnet-4', 'openai/gpt-4o-mini'],
  },
  // Content generation - needs creativity
  content: {
    primary: 'openai/gpt-4o',
    fallbacks: ['anthropic/claude-sonnet-4'],
  },
  // Analysis - needs precision and structured output
  analysis: {
    primary: 'openai/gpt-4o',
    fallbacks: ['anthropic/claude-sonnet-4'],
  },
  // Quick tasks - cost optimized
  quick: {
    primary: 'openai/gpt-4o-mini',
    fallbacks: ['anthropic/claude-3-5-haiku-latest'],
  },
} as const

export type ModelUseCase = keyof typeof AI_MODELS

/**
 * Get the primary model for a use case
 */
export function getModel(useCase: ModelUseCase = 'content') {
  return gateway(AI_MODELS[useCase].primary)
}

/**
 * Get gateway provider options with fallback configuration
 */
export function getProviderOptions(useCase: ModelUseCase = 'content') {
  const config = AI_MODELS[useCase]

  return {
    gateway: {
      // Fallback models tried in order if primary fails
      models: config.fallbacks,
    }
  }
}

// Re-export gateway for direct usage
export { gateway }
