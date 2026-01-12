import Link from 'next/link'
import Image from 'next/image'
import StudioThemeToggle from '@/components/StudioThemeToggle'

export default function HomePage() {
  return (
    <div className="studio-shell">
      <section className="studio-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-35">
            <Image
              src="/images/noir/toddfather_noir_panel_1_left.png"
              alt=""
              width={720}
              height={1080}
              className="absolute -left-24 top-1/2 -translate-y-1/2 opacity-30"
              priority
              aria-hidden="true"
            />
          </div>
          <div className="absolute inset-0 mix-blend-screen opacity-20">
            <div className="absolute inset-y-0 left-12 w-px bg-gradient-to-b from-transparent via-[color:var(--studio-accent)] to-transparent" />
            <div className="absolute inset-y-0 right-16 w-px bg-gradient-to-b from-transparent via-[color:var(--studio-accent-3)] to-transparent" />
          </div>
        </div>

        <div className="absolute right-6 top-6 z-20 hidden md:block">
          <StudioThemeToggle />
        </div>

        <div className="relative z-10 container mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <span className="studio-tag">Private production room</span>
            <div className="mt-4 md:hidden">
              <StudioThemeToggle />
            </div>
            <h1 className="mt-6 text-4xl md:text-6xl font-serif font-bold tracking-tight">
              The Syndicate Studio
            </h1>
            <p className="mt-6 text-lg md:text-xl text-[color:var(--studio-text-muted)] leading-relaxed">
              A luxury noir command center for scripts, cuts, and syndicate content runs.
              Build fast, publish clean, and keep the room under control.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/studio" className="studio-cta text-center">
                Enter the Studio
              </Link>
              <Link href="/studio/library" className="studio-cta-ghost text-center">
                Open the Library
              </Link>
            </div>
            <div className="mt-10 studio-divider" />
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-[color:var(--studio-text-muted)]">
              <span>Script desk</span>
              <span>Episode pipeline</span>
              <span>Asset vault</span>
              <span>Voice and avatar ops</span>
              <span>Publishing control</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="studio-tag">Inside the room</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-serif">
              Everything you need to run the syndicate line.
            </h2>
            <p className="mt-4 text-[color:var(--studio-text-muted)] max-w-2xl">
              One place for scripts, editorial cuts, assets, and the production proof that keeps the
              story tight.
            </p>
          </div>
          <Link href="/studio/content" className="studio-cta-ghost self-start">
            View content control
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Script Desk',
              copy: 'Draft, version, and lock scripts with clear ownership and canonical cuts.',
            },
            {
              title: 'Episode Board',
              copy: 'Track every episode from DRAFT to PUBLISHED with full lineage.',
            },
            {
              title: 'Asset Vault',
              copy: 'Keep B-roll, music, captions, and thumbnails tagged to the right cut.',
            },
            {
              title: 'Voice + Avatar Ops',
              copy: 'Assign voices and avatars with provenance and readiness states.',
            },
            {
              title: 'QC Checks',
              copy: 'Score the work, flag issues, and keep the room clean before release.',
            },
            {
              title: 'Publishing Desk',
              copy: 'Export, publish, and route final deliverables without chaos.',
            },
          ].map((card) => (
            <div key={card.title} className="studio-card p-6">
              <h3 className="text-xl font-semibold text-[color:var(--studio-accent)]">
                {card.title}
              </h3>
              <p className="mt-3 text-sm text-[color:var(--studio-text-muted)] leading-relaxed">
                {card.copy}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6">
        <div className="container mx-auto studio-card p-10 md:p-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: '1. Intake',
                copy: 'Capture the idea, assign the series, and lock a premise.',
              },
              {
                title: '2. Production',
                copy: 'Generate scripts, cuts, assets, and voices on the same rail.',
              },
              {
                title: '3. Release',
                copy: 'Ship the final package with a clean audit trail.',
              },
            ].map((step) => (
              <div key={step.title}>
                <p className="text-sm uppercase tracking-[0.18em] text-[color:var(--studio-text-muted)]">
                  {step.title}
                </p>
                <p className="mt-3 text-base text-[color:var(--studio-text)]">
                  {step.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="studio-tag">Control and clarity</p>
            <h2 className="mt-4 text-3xl md:text-4xl font-serif">
              The manager for a content syndicate.
            </h2>
            <p className="mt-4 text-[color:var(--studio-text-muted)] leading-relaxed">
              You are not running a blog. You are running a machine. The Syndicate Studio keeps
              operations tight with ordered scripts, assets, and publishing gates.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-[color:var(--studio-text-muted)]">
              {[
                'Authoritative versions, no loose cuts',
                'Structured metadata for every asset and script',
                'Clear tiered access for production and review',
                'Exportable manifests for production vendors',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[color:var(--studio-accent)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="studio-card p-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Live Room Status</h3>
              <span className="studio-tag">Private</span>
            </div>
            <div className="mt-6 space-y-5 text-sm text-[color:var(--studio-text-muted)]">
              {[
                { label: 'Episodes in motion', value: '12 active' },
                { label: 'Assets queued', value: '38 in vault' },
                { label: 'QC flags open', value: '3 pending' },
                { label: 'Publish slots', value: '2 cleared' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span>{row.label}</span>
                  <span className="text-[color:var(--studio-accent)] font-semibold">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-8 studio-divider" />
            <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[color:var(--studio-text-muted)]">
              Syndicate run log
            </p>
            <p className="mt-2 text-sm text-[color:var(--studio-text)]">
              Every move logged. Every cut traceable.
            </p>
          </div>
        </div>
      </section>

      <section className="studio-hero">
        <div className="container mx-auto px-6 py-20 text-center">
          <p className="studio-tag">Ready to run the line</p>
          <h2 className="mt-4 text-3xl md:text-4xl font-serif">
            Enter The Syndicate Studio.
          </h2>
          <p className="mt-4 text-[color:var(--studio-text-muted)] max-w-2xl mx-auto">
            Launch a new episode, manage assets, and publish with authority. This is the room where
            the syndicate story gets made.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/studio" className="studio-cta text-center">
              Enter the Studio
            </Link>
            <Link href="/studio/episodes/new" className="studio-cta-ghost text-center">
              Start an Episode
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
