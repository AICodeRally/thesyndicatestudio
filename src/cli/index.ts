#!/usr/bin/env node
// Load environment BEFORE any other imports to ensure Prisma gets the env vars
// Load .env.local first (Vercel/Neon credentials), then .env as fallback
// Use override to ensure .env.local takes precedence
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local'), override: true })
config({ path: resolve(process.cwd(), '.env') })

import { Command } from 'commander'
import chalk from 'chalk'
import { registerEpisodeCommands } from './commands/episode'
import { registerVideoCommands } from './commands/video'
import { registerConfigCommands } from './commands/config'

const program = new Command()

program
  .name('studio')
  .description(chalk.magenta('The Syndicate Studio') + ' - Video production pipeline CLI')
  .version('1.0.0')

// Register command groups
registerEpisodeCommands(program)
registerVideoCommands(program)
registerConfigCommands(program)

// Add some helpful examples
program.addHelpText('after', `

${chalk.cyan('Examples:')}
  $ studio episode list                          # List all episodes
  $ studio episode create -t "Title" -p "Premise" # Create episode
  $ studio episode generate-script <id>          # Generate AI script
  $ studio video render <id> --provider sora     # Render with Sora
  $ studio video status <videoId>                # Check render status
  $ studio config validate                       # Validate configuration

${chalk.cyan('Workflow:')}
  1. Create episode:    studio episode create -t "..." -p "..."
  2. Generate script:   studio episode generate-script <id>
  3. Render video:      studio video render <id> --provider sora
  4. Check status:      studio video wait <videoId>
`)

// Parse and run
async function main(): Promise<void> {
  try {
    await program.parseAsync(process.argv)
  } catch (error: any) {
    if (error.code === 'commander.helpDisplayed') {
      process.exit(0)
    }
    console.error(chalk.red('Error:'), error.message)
    process.exit(1)
  }
}

main()
