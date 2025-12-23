import { prisma } from '../src/lib/db'

const WORKING_MODELS = [
  {
    slug: 'payout-curve-sanity-check',
    title: 'Payout Curve Sanity Check',
    description: 'Test if your payout curve creates rational behavior or gaming incentives. Inputs: quota, OTE, curve parameters. Outputs: payout at key attainment levels, ROI breakpoints, risk assessment.',
    category: 'PAYOUT_CURVE',
    inputSchema: {
      quota: { type: 'number', label: 'Annual Quota ($)', required: true, min: 10000 },
      ote: { type: 'number', label: 'On-Target Earnings ($)', required: true, min: 10000 },
      baseSalary: { type: 'number', label: 'Base Salary ($)', required: true, min: 0 },
      acceleratorThreshold: { type: 'number', label: 'Accelerator Starts At (%)', required: true, min: 0, max: 200, default: 100 },
      acceleratorRate: { type: 'number', label: 'Accelerator Rate (%)', required: true, min: 100, max: 300, default: 150 },
      cap: { type: 'number', label: 'Cap at Attainment (%, 0 = no cap)', required: false, min: 0, max: 300, default: 0 },
    },
  },
  {
    slug: 'accelerator-threshold-impact',
    title: 'Accelerator Threshold Impact',
    description: 'Model how changing accelerator threshold affects total comp cost and rep behavior. Compare scenarios side-by-side.',
    category: 'PAYOUT_CURVE',
    inputSchema: {
      quota: { type: 'number', label: 'Annual Quota ($)', required: true, min: 10000 },
      ote: { type: 'number', label: 'On-Target Earnings ($)', required: true, min: 10000 },
      currentThreshold: { type: 'number', label: 'Current Threshold (%)', required: true, min: 0, max: 200, default: 100 },
      currentRate: { type: 'number', label: 'Current Rate (%)', required: true, min: 100, max: 300, default: 150 },
      newThreshold: { type: 'number', label: 'Proposed Threshold (%)', required: true, min: 0, max: 200 },
      newRate: { type: 'number', label: 'Proposed Rate (%)', required: true, min: 100, max: 300 },
      teamSize: { type: 'number', label: 'Team Size', required: true, min: 1, default: 10 },
      avgAttainment: { type: 'number', label: 'Avg Attainment (%)', required: true, min: 0, max: 200, default: 95 },
    },
  },
  {
    slug: 'quota-relief-calculator',
    title: 'Quota Relief Calculator',
    description: 'Calculate fair quota relief for territory changes, account losses, or market shifts. Ensures consistency and auditability.',
    category: 'QUOTA_RELIEF',
    inputSchema: {
      originalQuota: { type: 'number', label: 'Original Quota ($)', required: true, min: 0 },
      quarterProgress: { type: 'number', label: 'Quarter Progress (%)', required: true, min: 0, max: 100, default: 50 },
      accountsLost: { type: 'number', label: 'Accounts Lost ($)', required: true, min: 0 },
      accountsGained: { type: 'number', label: 'Accounts Gained ($)', required: true, min: 0, default: 0 },
      currentAttainment: { type: 'number', label: 'Current Attainment ($)', required: true, min: 0 },
      reliefMethod: { type: 'select', label: 'Relief Method', required: true, options: ['PROPORTIONAL', 'TIME_BASED', 'PIPELINE_WEIGHTED'], default: 'PROPORTIONAL' },
    },
  },
]

async function seedModels() {
  console.log('🔢 Seeding Working Models...\n')

  for (const model of WORKING_MODELS) {
    const created = await prisma.workingModel.upsert({
      where: { slug: model.slug },
      update: {
        title: model.title,
        description: model.description,
        category: model.category,
        inputSchema: model.inputSchema,
      },
      create: {
        slug: model.slug,
        title: model.title,
        description: model.description,
        category: model.category,
        inputSchema: model.inputSchema,
      },
    })

    console.log(`✅ Seeded: ${created.slug}`)
  }

  const count = await prisma.workingModel.count()
  console.log(`\n✨ Seed complete! ${count} Working Models in database.`)
}

seedModels()
  .catch((e) => {
    console.error('❌ Model seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
