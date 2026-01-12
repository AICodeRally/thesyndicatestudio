import { Command } from 'commander'
import ora from 'ora'
import chalk from 'chalk'
import { EpisodeService, NotFoundError } from '@/services/episode.service'
import {
  createTable,
  truncate,
  formatDate,
  formatStatus,
  success,
  error,
  heading,
  json,
} from '../utils/output'

const service = new EpisodeService()

export function registerEpisodeCommands(program: Command): void {
  const episode = program
    .command('episode')
    .description('Manage episodes')

  // List episodes
  episode
    .command('list')
    .description('List all episodes')
    .option('-s, --status <status>', 'Filter by status (DRAFT, GENERATING, PENDING_REVIEW, PUBLISHED)')
    .option('-l, --limit <n>', 'Limit results', '20')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      const spinner = ora('Fetching episodes...').start()
      try {
        const episodes = await service.list({
          status: options.status?.toUpperCase(),
          limit: parseInt(options.limit, 10),
        })
        spinner.stop()

        if (options.json) {
          json(episodes)
          return
        }

        if (episodes.length === 0) {
          console.log(chalk.dim('No episodes found.'))
          return
        }

        heading(`Episodes (${episodes.length})`)
        const table = createTable(
          ['ID', 'Title', 'Series', 'Status', 'Created'],
          [28, 35, 15, 16, 14]
        )

        episodes.forEach(ep => {
          table.push([
            chalk.dim(ep.id),
            truncate(ep.title, 33),
            ep.series || '-',
            formatStatus(ep.status),
            formatDate(ep.createdAt),
          ])
        })

        console.log(table.toString())
      } catch (err: any) {
        spinner.fail('Failed to fetch episodes')
        error(err.message)
        process.exit(1)
      }
    })

  // Show episode details
  episode
    .command('show <id>')
    .description('Show episode details')
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      const spinner = ora('Fetching episode...').start()
      try {
        const ep = await service.get(id)
        spinner.stop()

        if (options.json) {
          json(ep)
          return
        }

        heading(ep.title)
        console.log()
        console.log(chalk.cyan('ID:'), ep.id)
        console.log(chalk.cyan('Series:'), ep.series)
        console.log(chalk.cyan('Status:'), formatStatus(ep.status))
        console.log(chalk.cyan('Created:'), formatDate(ep.createdAt))
        console.log()
        console.log(chalk.cyan('Premise:'))
        console.log(chalk.dim(ep.premise))

        if (ep.canonicalScript) {
          console.log()
          console.log(chalk.cyan('Script Preview:'))
          console.log(chalk.dim(truncate(ep.canonicalScript.content, 500)))
        }

        const cutsTable = createTable(['Cut ID', 'Format', 'Status'], [28, 12, 12])
        ;(ep as any).cuts?.forEach((cut: any) => {
          cutsTable.push([
            chalk.dim(cut.id),
            cut.format,
            formatStatus(cut.status),
          ])
        })

        if ((ep as any).cuts?.length > 0) {
          console.log()
          console.log(chalk.cyan('Cuts:'))
          console.log(cutsTable.toString())
        }

        const assetsTable = createTable(['Asset ID', 'Type', 'Status'], [28, 12, 12])
        ;(ep as any).assets?.forEach((asset: any) => {
          assetsTable.push([
            chalk.dim(asset.id),
            asset.type,
            formatStatus(asset.status),
          ])
        })

        if ((ep as any).assets?.length > 0) {
          console.log()
          console.log(chalk.cyan('Assets:'))
          console.log(assetsTable.toString())
        }
      } catch (err: any) {
        spinner.fail('Failed to fetch episode')
        if (err instanceof NotFoundError) {
          error('Episode not found')
        } else {
          error(err.message)
        }
        process.exit(1)
      }
    })

  // Create episode
  episode
    .command('create')
    .description('Create a new episode')
    .requiredOption('-t, --title <title>', 'Episode title')
    .requiredOption('-p, --premise <premise>', 'Episode premise')
    .option('-s, --series <series>', 'Series name', 'General')
    .option('-d, --publish-date <date>', 'Target publish date')
    .option('--json', 'Output as JSON')
    .action(async (options) => {
      const spinner = ora('Creating episode...').start()
      try {
        const ep = await service.create({
          title: options.title,
          premise: options.premise,
          series: options.series,
          publishDateTarget: options.publishDate,
        })
        spinner.succeed('Episode created')

        if (options.json) {
          json(ep)
          return
        }

        console.log()
        console.log(chalk.cyan('ID:'), ep.id)
        console.log(chalk.cyan('Title:'), ep.title)
        console.log()
        console.log(chalk.dim('Next: studio episode generate-script ' + ep.id))
      } catch (err: any) {
        spinner.fail('Failed to create episode')
        error(err.message)
        process.exit(1)
      }
    })

  // Delete episode
  episode
    .command('delete <id>')
    .description('Delete an episode')
    .option('-f, --force', 'Skip confirmation')
    .action(async (id, options) => {
      if (!options.force) {
        console.log(chalk.yellow('Warning: This will permanently delete the episode and all related data.'))
        console.log(chalk.dim('Use --force to skip this confirmation.'))
        process.exit(0)
      }

      const spinner = ora('Deleting episode...').start()
      try {
        await service.delete(id)
        spinner.succeed('Episode deleted')
      } catch (err: any) {
        spinner.fail('Failed to delete episode')
        if (err instanceof NotFoundError) {
          error('Episode not found')
        } else {
          error(err.message)
        }
        process.exit(1)
      }
    })

  // Generate script
  episode
    .command('generate-script <id>')
    .description('Generate AI script for episode')
    .option('--json', 'Output as JSON')
    .action(async (id, options) => {
      const spinner = ora('Generating script with GPT-4o...').start()
      try {
        const script = await service.generateScript(id)
        spinner.succeed('Script generated')

        if (options.json) {
          json(script)
          return
        }

        console.log()
        console.log(chalk.cyan('Script ID:'), script.id)
        console.log(chalk.cyan('Version:'), script.version)
        console.log()
        console.log(chalk.dim('Preview:'))
        console.log(truncate(script.content, 800))
        console.log()
        console.log(chalk.dim('Next: studio video render ' + id + ' --provider sora'))
      } catch (err: any) {
        spinner.fail('Failed to generate script')
        if (err instanceof NotFoundError) {
          error('Episode not found')
        } else {
          error(err.message)
        }
        process.exit(1)
      }
    })

  // Update status
  episode
    .command('status <id> <status>')
    .description('Update episode status (DRAFT, GENERATING, PENDING_REVIEW, PUBLISHED)')
    .action(async (id, status) => {
      const validStatuses = ['DRAFT', 'GENERATING', 'PENDING_REVIEW', 'PUBLISHED']
      const upperStatus = status.toUpperCase()

      if (!validStatuses.includes(upperStatus)) {
        error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`)
        process.exit(1)
      }

      const spinner = ora('Updating status...').start()
      try {
        await service.updateStatus(id, upperStatus as any)
        spinner.succeed(`Status updated to ${formatStatus(upperStatus)}`)
      } catch (err: any) {
        spinner.fail('Failed to update status')
        error(err.message)
        process.exit(1)
      }
    })
}
