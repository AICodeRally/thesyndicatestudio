import { SPMNavigation } from "@/components/spm/navigation/SPMNavigation"

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="studio-override">
      <style>{`
        .studio-override,
        .studio-override * {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
          color: #EEE9DF;
        }
        .studio-override .text-\\[color\\:var\\(--studio-text-muted\\)\\] {
          color: #B2A99A !important;
        }
        .studio-override a { color: #C7A36B; }
        .studio-override button { color: inherit; }
        .studio-override input, .studio-override textarea, .studio-override select {
          color: #EEE9DF !important;
          background: #1B1B24 !important;
        }
      `}</style>
      <SPMNavigation />
      <main className="relative pt-16 bg-[#0A0A0F] min-h-screen">
        <div className="relative z-10">{children}</div>
      </main>
      <footer className="relative z-10 mt-20 border-t border-[color:var(--studio-border)] bg-[color:var(--studio-surface)]">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-serif text-[color:var(--studio-accent)] mb-4">
                The Syndicate Studio
              </h3>
              <p className="text-sm leading-relaxed text-[color:var(--studio-text-muted)]">
                The private production room for scripts, cuts, and syndicate content runs.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[color:var(--studio-accent)] mb-3">Studio</h4>
              <ul className="space-y-2 text-sm text-[color:var(--studio-text-muted)]">
                <li><a href="/studio" className="hover:text-[color:var(--studio-text)] transition-colors">Dashboard</a></li>
                <li><a href="/studio/library" className="hover:text-[color:var(--studio-text)] transition-colors">Library</a></li>
                <li><a href="/studio/episodes/new" className="hover:text-[color:var(--studio-text)] transition-colors">Start an Episode</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[color:var(--studio-accent)] mb-3">Content Ops</h4>
              <ul className="space-y-2 text-sm text-[color:var(--studio-text-muted)]">
                <li><a href="/studio/content" className="hover:text-[color:var(--studio-text)] transition-colors">Content Hub</a></li>
                <li><a href="/studio/content/glossary" className="hover:text-[color:var(--studio-text)] transition-colors">Glossary</a></li>
                <li><a href="/studio/content/components" className="hover:text-[color:var(--studio-text)] transition-colors">Component Cards</a></li>
                <li><a href="/studio/content/vendors" className="hover:text-[color:var(--studio-text)] transition-colors">Vendors</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[color:var(--studio-accent)] mb-3">Links</h4>
              <ul className="space-y-2 text-sm text-[color:var(--studio-text-muted)]">
                <li><a href="/" className="hover:text-[color:var(--studio-text)] transition-colors">Home</a></li>
                <li><a href="/toddfather" className="hover:text-[color:var(--studio-text)] transition-colors">The Toddfather</a></li>
                <li><a href="/contact" className="hover:text-[color:var(--studio-text)] transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[color:var(--studio-border)] flex flex-col md:flex-row justify-between items-center text-sm text-[color:var(--studio-text-muted)]">
            <div className="mb-4 md:mb-0">
              © {new Date().getFullYear()} IntelligentSPM. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="/legal/privacy" className="hover:text-[color:var(--studio-text)] transition-colors">Privacy</a>
              <a href="/legal/terms" className="hover:text-[color:var(--studio-text)] transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
