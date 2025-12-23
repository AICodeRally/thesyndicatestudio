import { NoirCard, NoirCardContent } from '@/components/spm/cards/NoirCard';

export const metadata = {
  title: 'Privacy Policy | Intelligent SPM',
};

export default function PrivacyPage() {
  return (
    <div className="w-full">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-spm-black via-spm-purple-dark/10 to-spm-black" />
        </div>
        <div className="relative z-10 container mx-auto px-6">
          <h1 className="text-display text-white mb-6">PRIVACY POLICY</h1>
        </div>
      </section>

      <section className="py-12 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <NoirCard variant="elevated">
            <NoirCardContent className="p-12 prose prose-invert max-w-none">
              <h2 className="text-2xl font-headline text-spm-purple mb-4">Last Updated: December 23, 2025</h2>

              <h3 className="text-xl font-headline text-white mt-8 mb-3">What We Collect</h3>
              <p className="text-gray-300">
                When you use Intelligent SPM, we collect:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>Email address (when you subscribe or sign in)</li>
                <li>Usage data (pages visited, features used)</li>
                <li>Content you create (if you use Studio features)</li>
              </ul>

              <h3 className="text-xl font-headline text-white mt-8 mb-3">How We Use It</h3>
              <p className="text-gray-300">
                We use your data to:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>Send you The SPM Syndicate weekly digest (if subscribed)</li>
                <li>Improve the site and tools</li>
                <li>Provide personalized SPM content</li>
              </ul>

              <h3 className="text-xl font-headline text-white mt-8 mb-3">What We Don't Do</h3>
              <p className="text-gray-300">
                We will NEVER:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>Sell your email to vendors</li>
                <li>Share your data with third parties (except service providers like Resend for email)</li>
                <li>Spam you with marketing</li>
              </ul>

              <h3 className="text-xl font-headline text-white mt-8 mb-3">Your Rights</h3>
              <p className="text-gray-300">
                You can unsubscribe anytime. Email{' '}
                <a href="mailto:todd@intelligentspm.com" className="text-spm-purple hover:text-spm-purple-light">
                  todd@intelligentspm.com
                </a>{' '}
                to request data deletion.
              </p>
            </NoirCardContent>
          </NoirCard>
        </div>
      </section>
    </div>
  );
}
