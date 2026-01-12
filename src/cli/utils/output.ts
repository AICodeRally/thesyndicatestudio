import chalk from 'chalk'
import Table from 'cli-table3'

export function success(message: string): void {
  console.log(chalk.green('✓'), message)
}

export function error(message: string): void {
  console.error(chalk.red('✗'), message)
}

export function info(message: string): void {
  console.log(chalk.blue('ℹ'), message)
}

export function warn(message: string): void {
  console.log(chalk.yellow('⚠'), message)
}

export function heading(text: string): void {
  console.log()
  console.log(chalk.bold.magenta(text))
  console.log(chalk.dim('─'.repeat(text.length + 4)))
}

export function createTable(headers: string[], colWidths?: number[]): Table.Table {
  return new Table({
    head: headers.map(h => chalk.cyan(h)),
    colWidths,
    style: {
      head: [],
      border: [],
    },
  })
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.substring(0, maxLength - 3) + '...'
}

export function formatDate(date: Date | string | null): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatStatus(status: string): string {
  switch (status.toUpperCase()) {
    case 'DRAFT':
      return chalk.gray(status)
    case 'GENERATING':
      return chalk.yellow(status)
    case 'PENDING_REVIEW':
      return chalk.blue(status)
    case 'PUBLISHED':
      return chalk.green(status)
    case 'PROCESSING':
      return chalk.yellow(status)
    case 'COMPLETED':
      return chalk.green(status)
    case 'FAILED':
      return chalk.red(status)
    default:
      return status
  }
}

export function json(data: unknown): void {
  console.log(JSON.stringify(data, null, 2))
}
