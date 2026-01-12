import { z } from 'zod'

/**
 * Server-side environment variables schema
 * Validated at runtime on first access
 */
const serverEnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  DATABASE_URL_UNPOOLED: z.string().url().optional(),

  // Authentication
  AUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  AUTH_GITHUB_ID: z.string().optional(),
  AUTH_GITHUB_SECRET: z.string().optional(),
  AUTH_RESEND_KEY: z.string().startsWith('re_').optional(),
  AUTH_EMAIL_FROM: z.string().email().optional(),

  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith('sk_').optional(),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_').optional(),
  STRIPE_PRICE_ID_SPARCC: z.string().startsWith('price_').optional(),

  // Video Generation
  HEYGEN_API_KEY: z.string().optional(),
  HEYGEN_DEFAULT_AVATAR_ID: z.string().optional(),
  HEYGEN_DEFAULT_VOICE_ID: z.string().optional(),

  // Local LLM (optional)
  LOCAL_LLM_URL: z.string().url().optional(),
  LOCAL_LLM_MODEL: z.string().optional(),
  USE_LOCAL_LLM: z.enum(['true', 'false']).optional(),

  // Storage
  BLOB_READ_WRITE_TOKEN: z.string().optional(),

  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

/**
 * Cached environment after first validation
 */
let cachedEnv: z.infer<typeof serverEnvSchema> | null = null

/**
 * Validate and get server environment variables
 * Throws on first access if validation fails
 */
export function getEnv() {
  if (!cachedEnv) {
    const result = serverEnvSchema.safeParse(process.env)
    if (!result.success) {
      console.error('Environment validation failed:')
      console.error(result.error.flatten().fieldErrors)
      throw new Error('Invalid environment configuration')
    }
    cachedEnv = result.data
  }
  return cachedEnv
}

/**
 * Type-safe environment accessor
 */
export const env = {
  get server() {
    return getEnv()
  },
}

export type ServerEnv = z.infer<typeof serverEnvSchema>
