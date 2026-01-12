import type { Metadata } from "next"
import { Libre_Baskerville, DM_Sans, JetBrains_Mono } from "next/font/google"
import { Toaster } from "sonner"
import { SessionProvider } from "next-auth/react"
import { SPMNavigation } from "@/components/spm/navigation/SPMNavigation"
import { Analytics } from "@/components/Analytics"
import { Suspense } from "react"
import "./globals.css"

// Counselor theme fonts
const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
})

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.intelligentspm.com'),
  title: {
    default: "The Syndicate Studio | The Toddfather",
    template: "%s | The Syndicate Studio",
  },
  description:
    "A private production room for scripts, cuts, and syndicate content runs. The Toddfather's studio for building and shipping.",
  keywords: [
    "SPM",
    "Sales Performance Management",
    "Compensation",
    "Sales Planning",
    "Intelligent Sales",
    "Comp Design",
    "Governance",
    "Quota",
    "Accelerator",
    "Sales Compensation",
    "ICM",
    "Incentive Compensation",
  ],
  authors: [{ name: "The Toddfather" }],
  creator: "The Toddfather",
  publisher: "Intelligent SPM",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.intelligentspm.com",
    title: "The Syndicate Studio | The Toddfather",
    description: "A private production room for scripts, cuts, and syndicate content runs.",
    siteName: "The Syndicate Studio",
    images: [
      {
        url: "/images/noir/toddfather_noir_panel_2_middle.png",
        width: 1200,
        height: 630,
        alt: "The Toddfather - Intelligent SPM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Syndicate Studio | The Toddfather",
    description: "A private production room for scripts, cuts, and syndicate content runs.",
    creator: "@thetoddfather",
    images: ["/images/noir/toddfather_noir_panel_2_middle.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="luxury-noir" suppressHydrationWarning>
      <body
        className={`${libreBaskerville.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-[#0A0A0F]`}
      >
        <SessionProvider>
          <SPMNavigation />
          <main className="relative pt-16">
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
                  <h4 className="text-sm font-semibold text-[color:var(--studio-accent)] mb-3">Syndicate</h4>
                  <ul className="space-y-2 text-sm text-[color:var(--studio-text-muted)]">
                    <li><a href="/syndicate" className="hover:text-[color:var(--studio-text)] transition-colors">Syndicate Home</a></li>
                    <li><a href="/toddfather" className="hover:text-[color:var(--studio-text)] transition-colors">The Toddfather</a></li>
                    <li><a href="/contact" className="hover:text-[color:var(--studio-text)] transition-colors">Contact</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-[color:var(--studio-border)] flex flex-col md:flex-row justify-between items-center text-sm text-[color:var(--studio-text-muted)]">
                <div className="mb-4 md:mb-0">
                  © {new Date().getFullYear()} The Syndicate Studio. All rights reserved.
                </div>
                <div className="flex space-x-6">
                  <a href="/legal/privacy" className="hover:text-[color:var(--studio-text)] transition-colors">Privacy</a>
                  <a href="/legal/terms" className="hover:text-[color:var(--studio-text)] transition-colors">Terms</a>
                  <a href="/contact" className="hover:text-[color:var(--studio-text)] transition-colors">Contact</a>
                </div>
              </div>
              <div className="mt-6 text-center text-xs text-[color:var(--studio-text-muted)]">
                <a href="/toddfather" className="hover:text-[color:var(--studio-accent)] transition-colors">
                  Powered by The Toddfather
                </a>
              </div>
            </div>
          </footer>
          <Toaster richColors position="bottom-right" />
          <Suspense fallback={null}>
            <Analytics />
          </Suspense>
        </SessionProvider>
      </body>
    </html>
  )
}
