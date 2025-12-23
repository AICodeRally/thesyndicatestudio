import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "sonner"
import { RallySessionProvider } from "@rally/auth"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "The Toddfather | Intelligent SPM",
    template: "%s | The Toddfather",
  },
  description:
    "Intelligent Sales Performance Management. Collect Counsel. Apply it. Defend it.",
  keywords: [
    "SPM",
    "Sales Performance Management",
    "Compensation",
    "Sales Planning",
    "Intelligent Sales",
  ],
  authors: [{ name: "The Toddfather" }],
  creator: "The Toddfather",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://thetoddfather.com",
    title: "The Toddfather | Intelligent SPM",
    description: "Collect Counsel. Apply it. Defend it.",
    siteName: "The Toddfather",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Toddfather | Intelligent SPM",
    description: "Collect Counsel. Apply it. Defend it.",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <RallySessionProvider>
          {children}
          <Toaster richColors position="bottom-right" />
        </RallySessionProvider>
      </body>
    </html>
  )
}
