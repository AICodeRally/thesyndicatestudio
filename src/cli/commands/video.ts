import { Command } from 'commander'
import ora from 'ora'
import chalk from 'chalk'
import { VideoService, NotFoundError, ConfigurationError } from '@/services/video.service'
import {
  createTable,
  formatStatus,
  formatDate,
  success,
  error,
  info,
  heading,
  json,
} from '../utils/output'

const service = new VideoService()

export function registerVideoCommands(program: Command): void {
  const video = program
    .command('video')
    .description('Video rendering and status')

  // Render video
  video
    .command('render <episodeId>')
    .description('Render video for episode')
    .requiredOption('--provider <provider>', 'Video provider (sora, heygen)', 'sora')
    .option('-c, --cut <cutId>', 'Specific cut ID to render')
    .option('-a, --aspect-ratio <ratio>', 'Aspect ratio (16:9, 9:16, 1:1)', '9:16')
    .option('-s, --seconds <n>', 'Duration in seconds (4, 8, or 12)', '8')
    .option('-m, --model <model>', 'Model (sora-2, sora-2-pro)', 'sora-2')
    .option('-p, --prompt <text>', 'Custom prompt override')
    .option('--json', 'Output as JSON')
    .action(async (episodeId, options) => {
      if (options.provider !== 'sora') {
        error('Currently only Sora provider is supported via CLI')
        info('For HeyGen, use the web interface')
        process.exit(1)
      }

      // Validate seconds
      const validSeconds = ['4', '8', '12']
      if (!validSeconds.includes(options.seconds)) {
        error(`Invalid duration. Must be one of: ${validSeconds.join(', ')}`)
        process.exit(1)
      }

      const spinner = ora('Starting Sora video generation...').start()
      try {
        const result = await service.renderSora({
          episodeId,
          cutId: options.cut,
          aspectRatio: options.aspectRatio,
          seconds: options.seconds as '4' | '8' | '12',
          model: options.model,
          promptOverride: options.prompt,
        })
        spinner.succeed('Video generation started')

        if (options.json) {
          json(result)
          return
        }

        console.log()
        console.log(chalk.cyan('Provider:'), result.provider)
        console.log(chalk.cyan('Video ID:'), result.videoId)
        console.log(chalk.cyan('Asset ID:'), result.assetId)
        console.log(chalk.cyan('Status:'), formatStatus(result.status))
        console.log()
        console.log(chalk.dim('Check status:'))
        console.log(chalk.dim(`  studio video status ${result.videoId}`))
        console.log()
        console.log(chalk.dim('Or poll until complete:'))
        console.log(chalk.dim(`  studio video wait ${result.videoId}`))
      } catch (err: any) {
        spinner.fail('Failed to start video generation')
        if (err instanceof NotFoundError) {
          error(err.message)
        } else if (err instanceof ConfigurationError) {
          error(err.message)
          info('Ensure OPENAI_API_KEY is set and has Sora access')
        } else {
          error(err.message)
        }
        process.exit(1)
      }
    })

  // Check status
  video
    .command('status <videoId>')
    .description('Check video generation status')
    .option('--json', 'Output as JSON')
    .action(async (videoId, options) => {
      const spinner = ora('Checking status...').start()
      try {
        const status = await service.checkSoraStatus(videoId)
        spinner.stop()

        if (options.json) {
          json(status)
          return
        }

        console.log()
        console.log(chalk.cyan('Status:'), formatStatus(status.status))

        if (status.videoUrl) {
          console.log(chalk.cyan('Video URL:'), status.videoUrl)
        }

        if (status.error) {
          console.log(chalk.red('Error:'), status.error)
        }

        if (status.errorCode) {
          console.log(chalk.red('Error Code:'), status.errorCode)
        }
      } catch (err: any) {
        spinner.fail('Failed to check status')
        error(err.message)
        process.exit(1)
      }
    })

  // Wait for completion
  video
    .command('wait <videoId>')
    .description('Wait for video generation to complete')
    .option('-i, --interval <seconds>', 'Poll interval in seconds', '10')
    .option('-t, --timeout <minutes>', 'Timeout in minutes', '30')
    .option('--json', 'Output as JSON')
    .action(async (videoId, options) => {
      const interval = parseInt(options.interval, 10) * 1000
      const timeout = parseInt(options.timeout, 10) * 60 * 1000
      const startTime = Date.now()

      const spinner = ora('Waiting for video generation...').start()

      const poll = async (): Promise<void> => {
        try {
          const status = await service.checkSoraStatus(videoId)

          if (status.status === 'completed') {
            spinner.succeed('Video generation completed!')
            if (options.json) {
              json(status)
            } else {
              console.log()
              console.log(chalk.cyan('Video URL:'), status.videoUrl)
            }
            return
          }

          if (status.status === 'failed') {
            spinner.fail('Video generation failed')
            if (options.json) {
              json(status)
            } else {
              console.log(chalk.red('Error:'), status.error)
            }
            process.exit(1)
          }

          if (Date.now() - startTime > timeout) {
            spinner.fail('Timeout waiting for video generation')
            process.exit(1)
          }

          spinner.text = `Waiting for video generation... (${Math.round((Date.now() - startTime) / 1000)}s)`
          setTimeout(poll, interval)
        } catch (err: any) {
          spinner.fail('Error checking status')
          error(err.message)
          process.exit(1)
        }
      }

      poll()
    })

  // List assets
  video
    .command('list <episodeId>')
    .description('List video assets for episode')
    .option('-t, --type <type>', 'Filter by type (SORA, BROLL, etc)')
    .option('--json', 'Output as JSON')
    .action(async (episodeId, options) => {
      const spinner = ora('Fetching assets...').start()
      try {
        const assets = await service.listAssets(episodeId, options.type)
        spinner.stop()

        if (options.json) {
          json(assets)
          return
        }

        if (assets.length === 0) {
          console.log(chalk.dim('No assets found.'))
          return
        }

        heading(`Assets (${assets.length})`)
        const table = createTable(
          ['ID', 'Type', 'Status', 'URL', 'Created'],
          [28, 10, 12, 30, 14]
        )

        assets.forEach(asset => {
          table.push([
            chalk.dim(asset.id),
            asset.type,
            formatStatus(asset.status),
            asset.url ? chalk.dim(asset.url.substring(0, 28) + '...') : '-',
            formatDate(asset.createdAt),
          ])
        })

        console.log(table.toString())
      } catch (err: any) {
        spinner.fail('Failed to fetch assets')
        error(err.message)
        process.exit(1)
      }
    })
}
