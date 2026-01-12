import type { Metadata } from "next"
import { Libre_Baskerville, DM_Sans, JetBrains_Mono } from "next/font/google"
import { Toaster } from "sonner"
import { Analytics } from "@/components/Analytics"
import { Suspense } from "react"
import "./globals.css"

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
    default: "IntelligentSPM | AI-Powered Sales Compensation",
    template: "%s | IntelligentSPM",
  },
  description:
    "30 years of sales compensation expertise meets AI. Strategy, transformation, vendor selection, and expert witness services.",
  keywords: [
    "SPM",
    "Sales Performance Management",
    "Sales Compensation",
    "AI SPM",
    "ICM",
    "Incentive Compensation",
    "Expert Witness",
    "Comp Design",
  ],
  authors: [{ name: "Todd LeBaron" }],
  creator: "Todd LeBaron",
  publisher: "IntelligentSPM",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.intelligentspm.com",
    title: "IntelligentSPM | AI-Powered Sales Compensation",
    description: "30 years of sales compensation expertise meets AI.",
    siteName: "IntelligentSPM",
    images: [
      {
        url: "/images/noir/toddfather_noir_panel_2_middle.png",
        width: 1200,
        height: 630,
        alt: "IntelligentSPM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IntelligentSPM | AI-Powered Sales Compensation",
    description: "30 years of sales compensation expertise meets AI.",
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
      <head>
        <link href="/genz/css/style.css" rel="stylesheet" />
      </head>
      <body
        className={`${libreBaskerville.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased min-h-screen`}
      >
        {children}
        <Toaster richColors position="bottom-right" />
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
