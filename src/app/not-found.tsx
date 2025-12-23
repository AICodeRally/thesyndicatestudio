import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-spm-black">
      <div className="text-center px-6">
        <h1 className="text-display text-white mb-4">404</h1>
        <h2 className="text-headline-lg text-spm-purple mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-spm-purple hover:bg-spm-purple-light text-white font-semibold rounded-lg transition-all hover:shadow-purple-glow"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
