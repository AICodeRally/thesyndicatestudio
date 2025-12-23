import { NoirCard, NoirCardContent } from '@/components/spm/cards/NoirCard';

export const metadata = {
  title: 'Terms of Service | Intelligent SPM',
};

export default function TermsPage() {
  return (
    <div className="w-full">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/10 to-spm-black" />
        </div>
        <div className="relative z-10 container mx-auto px-6">
          <h1 className="text-display text-white mb-6">TERMS OF SERVICE</h1>
        </div>
      </section>

      <section className="py-12 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <NoirCard variant="elevated">
            <NoirCardContent className="p-12 prose prose-invert max-w-none">
              <h2 className="text-2xl font-headline text-spm-purple mb-4">Last Updated: December 23, 2025</h2>

              <h3 className="text-xl font-headline text-white mt-8 mb-3">The Deal</h3>
              <p className="text-gray-300">
                Intelligent SPM provides SPM content, tools, and analysis. You use it at your own risk.
                We're not liable if your comp plan still breaks after using our tools.
              </p>

              <h3 className="text-xl font-headline text-white mt-8 mb-3">Content License</h3>
              <p className="text-gray-300">
                All content (glossary, vendor scorecards, benchmarks, counsel) is provided for educational purposes.
                You can use it internally. Don't republish it as your own.
              </p>

              <h3 className="text-xl font-headline text-white mt-8 mb-3">Services</h3>
              <p className="text-gray-300">
                If you engage The Toddfather for consulting services, we'll have a separate agreement.
                This just covers use of the website and tools.
              </p>

              <h3 className="text-xl font-headline text-white mt-8 mb-3">Liability</h3>
              <p className="text-gray-300">
                The tools and analysis are educational. We're not your comp consultant (unless you hire us).
                Don't make million-dollar decisions based solely on a free tool.
              </p>

              <h3 className="text-xl font-headline text-white mt-8 mb-3">Questions?</h3>
              <p className="text-gray-300">
                Email{' '}
                <a href="mailto:todd@intelligentspm.com" className="text-spm-purple hover:text-spm-purple-light">
                  todd@intelligentspm.com
                </a>
              </p>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>
    </div>
  );
}
