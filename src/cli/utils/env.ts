import { config } from 'dotenv'
import { resolve } from 'path'

export function loadEnv(): void {
  // Load .env from project root
  config({ path: resolve(process.cwd(), '.env') })

  // Also try .env.local
  config({ path: resolve(process.cwd(), '.env.local') })
}
