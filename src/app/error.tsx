'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-spm-black">
      <div className="text-center px-6">
        <h2 className="text-headline-lg text-spm-purple mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-400 mb-8">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={() => reset()}
          className="px-8 py-4 bg-spm-purple hover:bg-spm-purple-light text-white font-semibold rounded-lg transition-all hover:shadow-purple-glow"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
