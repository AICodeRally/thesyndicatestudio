/**
 * Custom Noir-themed SVG Icons for Intelligent SPM
 * Designed to match the woodcut/linocut aesthetic
 */

export function LearnIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 16h40v36H12V16z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="miter"
      />
      <path
        d="M16 16v36M48 16v36M12 24h40M12 32h40M12 40h40"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.6"
      />
      <path
        d="M32 8l8 8h-6v8h-4v-8h-6l8-8z"
        fill="currentColor"
      />
    </svg>
  );
}

export function AnalyzeIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="26" cy="26" r="14"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        d="M36 36l16 16M38 36l14 14"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="square"
      />
      <path
        d="M26 20v12M20 26h12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function BenchmarksIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 52h48M12 52V32M24 52V20M36 52V28M48 52V16"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="square"
      />
      <rect x="8" y="28" width="8" height="4" fill="currentColor" />
      <rect x="20" y="16" width="8" height="4" fill="currentColor" />
      <rect x="32" y="24" width="8" height="4" fill="currentColor" />
      <rect x="44" y="12" width="8" height="4" fill="currentColor" />
      <path
        d="M10 32l10-12 12 8 16-16"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="3 3"
        opacity="0.5"
      />
    </svg>
  );
}

export function VendorsIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="4" />
      <path
        d="M32 14v36M14 32h36"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle cx="32" cy="32" r="6" fill="currentColor" />
      <path
        d="M23 23l18 18M41 23L23 41"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.4"
      />
    </svg>
  );
}

export function CommunityIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="20" r="8" fill="currentColor" />
      <path
        d="M20 40c0-6.627 5.373-12 12-12s12 5.373 12 12v8H20v-8z"
        fill="currentColor"
      />
      <circle cx="16" cy="24" r="6" fill="currentColor" opacity="0.6" />
      <circle cx="48" cy="24" r="6" fill="currentColor" opacity="0.6" />
      <path
        d="M8 44c0-4.418 3.582-8 8-8h4M48 44c0-4.418 3.582-8 8-8h-4"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.6"
      />
    </svg>
  );
}

export function ServicesIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M32 8L8 24v24l24 16 24-16V24L32 8z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="miter"
      />
      <path
        d="M32 8v56M8 24l24 16M56 24L32 40"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.5"
      />
      <circle cx="32" cy="32" r="8" fill="currentColor" />
    </svg>
  );
}

export function UploadIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 16v4h16v-4M12 4v12M8 8l4-4 4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export function LibraryIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 4h16v16H4V4zM4 8h16M4 12h16M4 16h16M8 4v16M16 4v16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function ScorecardIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="2" />
      <path
        d="M3 9h18M9 3v18"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M6 6l2 2 2-2M15 6h3M15 12h3M15 18h3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}
