import { SPMNavigation } from '@/components/spm/navigation/SPMNavigation';

export default function SPMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-spm-black">
      <SPMNavigation />

      {/* Main content with top padding for fixed nav */}
      <main className="relative pt-16">
        {/* Noir texture overlay - subtle grain effect across entire site */}
        <div
          className="fixed inset-0 noir-texture opacity-5 pointer-events-none z-0"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-spm-black-soft border-t border-spm-purple-dark/30 mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-display text-white mb-4">
                Intelligent SPM
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The clearing house for sales compensation, governance, and
                performance truth.
              </p>
            </div>

            {/* Learn */}
            <div>
              <h4 className="text-sm font-headline text-spm-purple mb-3">
                Learn
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="/learn/spm-101" className="hover:text-white transition-colors">
                    SPM 101
                  </a>
                </li>
                <li>
                  <a href="/learn/glossary" className="hover:text-white transition-colors">
                    Glossary
                  </a>
                </li>
                <li>
                  <a href="/learn/component-cards" className="hover:text-white transition-colors">
                    Component Cards
                  </a>
                </li>
              </ul>
            </div>

            {/* Tools */}
            <div>
              <h4 className="text-sm font-headline text-spm-purple mb-3">
                Tools
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="/analyze/plan-check" className="hover:text-white transition-colors">
                    Plan Check
                  </a>
                </li>
                <li>
                  <a href="/benchmarks" className="hover:text-white transition-colors">
                    Benchmarks
                  </a>
                </li>
                <li>
                  <a href="/vendors" className="hover:text-white transition-colors">
                    Vendors
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-sm font-headline text-spm-purple mb-3">
                Connect
              </h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="/syndicate" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="/services" className="hover:text-white transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="/toddfather" className="hover:text-white transition-colors">
                    About The Toddfather
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-spm-purple-dark/20 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div className="mb-4 md:mb-0">
              © {new Date().getFullYear()} Intelligent SPM. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="/legal/privacy" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="/legal/terms" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="/contact" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* Powered by */}
          <div className="mt-6 text-center text-xs text-gray-600">
            <a
              href="/toddfather"
              className="hover:text-spm-purple transition-colors"
            >
              Powered by The Toddfather
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
