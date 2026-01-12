import Link from 'next/link'

export const metadata = {
  title: 'Content Management | Studio',
  description: 'Manage SPM content: glossary, vendors, benchmarks, component cards.',
}

export default function ContentManagementPage() {
  const cards = [
    {
      title: 'SPM Glossary',
      copy: 'Define the syndicate vocabulary and keep terms clean.',
      href: '/studio/content/glossary',
    },
    {
      title: 'Vendor Scorecards',
      copy: 'Track vendor ratings, fit, and implementation reality.',
      href: '/studio/content/vendors',
    },
    {
      title: 'Benchmarks',
      copy: 'Manage curves, quota patterns, and governance maturity data.',
      href: '/studio/content/benchmarks',
    },
    {
      title: 'Component Cards',
      copy: 'Library of plan components, rules, and admin objects.',
      href: '/studio/content/components',
    },
  ]

  return (
    <div className="studio-shell min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <span className="studio-tag">Content control</span>
        <h1 className="mt-4 text-4xl font-serif">Syndicate Content Desk</h1>
        <p className="mt-3 text-[color:var(--studio-text-muted)] max-w-2xl">
          Keep the clearing house organized with tightly managed content modules.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <Link key={card.href} href={card.href} className="studio-card p-8">
              <h2 className="text-2xl font-semibold text-[color:var(--studio-text)]">
                {card.title}
              </h2>
              <p className="mt-3 text-sm text-[color:var(--studio-text-muted)]">
                {card.copy}
              </p>
              <span className="mt-6 inline-flex studio-pill">Manage →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
