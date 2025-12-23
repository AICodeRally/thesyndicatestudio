import type { Metadata } from "next"
import { Playfair_Display, Cinzel, Lora, Geist_Mono } from "next/font/google"
import { Toaster } from "sonner"
import { RallySessionProvider } from "@rally/auth"
import { SPMNavigation } from "@/components/spm/navigation/SPMNavigation"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
})

const cinzel = Cinzel({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

const lora = Lora({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Intelligent SPM | The Toddfather",
    template: "%s | Intelligent SPM",
  },
  description:
    "The clearing house for sales compensation, governance, and performance truth.",
  keywords: [
    "SPM",
    "Sales Performance Management",
    "Compensation",
    "Sales Planning",
    "Intelligent Sales",
    "Comp Design",
    "Governance",
  ],
  authors: [{ name: "The Toddfather" }],
  creator: "The Toddfather",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://intelligentspm.com",
    title: "Intelligent SPM | The Toddfather",
    description: "The clearing house for sales compensation, governance, and performance truth.",
    siteName: "Intelligent SPM",
  },
  twitter: {
    card: "summary_large_image",
    title: "Intelligent SPM | The Toddfather",
    description: "The clearing house for sales compensation, governance, and performance truth.",
    creator: "@thetoddfather",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Cinzel:wght@400;600;700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${playfairDisplay.variable} ${cinzel.variable} ${lora.variable} ${geistMono.variable} antialiased min-h-screen bg-spm-black`}
      >
        <RallySessionProvider>
          <SPMNavigation />
          <main className="relative pt-16">
            {/* Noir texture overlay */}
            <div
              className="fixed inset-0 noir-texture opacity-5 pointer-events-none z-0"
              aria-hidden="true"
            />
            <div className="relative z-10">{children}</div>
          </main>
          <footer className="relative z-10 bg-spm-black-soft border-t border-spm-purple-dark/30 mt-20">
            <div className="container mx-auto px-6 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-xl font-display text-white mb-4">
                    Intelligent SPM
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    The clearing house for sales compensation, governance, and performance truth.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-headline text-spm-purple mb-3">Learn</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="/learn/spm-101" className="hover:text-white transition-colors">SPM 101</a></li>
                    <li><a href="/learn/glossary" className="hover:text-white transition-colors">Glossary</a></li>
                    <li><a href="/learn/component-cards" className="hover:text-white transition-colors">Component Cards</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-headline text-spm-purple mb-3">Tools</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="/analyze/plan-check" className="hover:text-white transition-colors">Plan Check</a></li>
                    <li><a href="/benchmarks" className="hover:text-white transition-colors">Benchmarks</a></li>
                    <li><a href="/vendors" className="hover:text-white transition-colors">Vendors</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-headline text-spm-purple mb-3">Connect</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="/syndicate" className="hover:text-white transition-colors">Community</a></li>
                    <li><a href="/services" className="hover:text-white transition-colors">Services</a></li>
                    <li><a href="/toddfather" className="hover:text-white transition-colors">About The Toddfather</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-spm-purple-dark/20 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                <div className="mb-4 md:mb-0">
                  © {new Date().getFullYear()} Intelligent SPM. All rights reserved.
                </div>
                <div className="flex space-x-6">
                  <a href="/legal/privacy" className="hover:text-white transition-colors">Privacy</a>
                  <a href="/legal/terms" className="hover:text-white transition-colors">Terms</a>
                  <a href="/contact" className="hover:text-white transition-colors">Contact</a>
                </div>
              </div>
              <div className="mt-6 text-center text-xs text-gray-600">
                <a href="/toddfather" className="hover:text-spm-purple transition-colors">
                  Powered by The Toddfather
                </a>
              </div>
            </div>
          </footer>
          <Toaster richColors position="bottom-right" />
        </RallySessionProvider>
      </body>
    </html>
  )
}
