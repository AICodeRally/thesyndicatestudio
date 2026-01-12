import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient
  pool: Pool
}

// Lazy initialization to ensure env vars are loaded before creating client
function createPrismaClient(): PrismaClient {
  // Use unpooled connection for schema support (search_path not supported in pooled)
  const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || ''

  if (!connectionString) {
    throw new Error('DATABASE_URL or DATABASE_URL_UNPOOLED environment variable is not set')
  }

  // Create a pg Pool for connection management with schema search path
  const pool = new Pool({
    connectionString,
    // Set search_path to use our schema (works with unpooled connection)
    options: '-c search_path=thesyndicatestudio,public'
  })

  const adapter = new PrismaPg(pool)

  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    adapter,
  })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.pool = pool
  }

  return client
}

// Lazily create the Prisma client on first access
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient()
    }
    return (globalForPrisma.prisma as any)[prop]
  }
})
