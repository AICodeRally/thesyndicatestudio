import { Command } from 'commander'
import chalk from 'chalk'
import { createTable, heading, success, error, info } from '../utils/output'

export function registerConfigCommands(program: Command): void {
  const config = program
    .command('config')
    .description('Configuration management')

  // Show config
  config
    .command('show')
    .description('Show current configuration')
    .action(() => {
      heading('Configuration')

      const envVars = [
        ['OPENAI_API_KEY', process.env.OPENAI_API_KEY ? '✓ Set' : '✗ Not set'],
        ['HEYGEN_API_KEY', process.env.HEYGEN_API_KEY ? '✓ Set' : '✗ Not set'],
        ['POSTGRES_PRISMA_URL', process.env.POSTGRES_PRISMA_URL ? '✓ Set' : '✗ Not set'],
        ['AUTH_RESEND_KEY', process.env.AUTH_RESEND_KEY ? '✓ Set' : '✗ Not set'],
        ['BLOB_READ_WRITE_TOKEN', process.env.BLOB_READ_WRITE_TOKEN ? '✓ Set' : '✗ Not set'],
      ]

      const table = createTable(['Variable', 'Status'], [25, 15])
      envVars.forEach(([name, status]) => {
        const statusColor = status.startsWith('✓') ? chalk.green(status) : chalk.red(status)
        table.push([name, statusColor])
      })

      console.log(table.toString())
    })

  // Validate config
  config
    .command('validate')
    .description('Validate configuration for video generation')
    .action(async () => {
      heading('Configuration Validation')
      let allValid = true

      // Check OpenAI key
      if (process.env.OPENAI_API_KEY) {
        info('Testing OpenAI connection...')
        try {
          const response = await fetch('https://api.openai.com/v1/models', {
            headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
          })
          if (response.ok) {
            success('OpenAI API key is valid')

            // Check for Sora access
            const data = await response.json()
            const hasSora = data.data?.some((m: any) =>
              m.id.includes('sora') || m.id.includes('video')
            )
            if (hasSora) {
              success('Sora video access detected')
            } else {
              error('Sora video access not detected - you may need to request access')
              allValid = false
            }
          } else {
            error('OpenAI API key is invalid')
            allValid = false
          }
        } catch (err) {
          error('Failed to connect to OpenAI API')
          allValid = false
        }
      } else {
        error('OPENAI_API_KEY is not set')
        allValid = false
      }

      // Check database
      if (process.env.DATABASE_URL) {
        success('DATABASE_URL is set')
      } else {
        error('DATABASE_URL is not set')
        allValid = false
      }

      // Check Vercel Blob
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        success('BLOB_READ_WRITE_TOKEN is set')
      } else {
        error('BLOB_READ_WRITE_TOKEN is not set - video uploads will fail')
        allValid = false
      }

      console.log()
      if (allValid) {
        success('All configuration valid!')
      } else {
        error('Some configuration issues found')
        info('Check your .env file and ensure all required variables are set')
      }
    })
}
