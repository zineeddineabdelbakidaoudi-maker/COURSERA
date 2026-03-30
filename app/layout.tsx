import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono, Cairo } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { FaqChatbot } from "@/components/ui/chatbot"
import { Toaster } from "@/components/ui/toaster"
import { PremiumEffects } from "@/components/ui/premium-effects"
import { Footer } from "@/components/layout/footer"
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Digit Hup — Sell Your Skills. Buy What You Need. Grow Where You Are.',
    template: '%s | Digit Hup',
  },
  description:
    "Algeria's First Freelancer + Learning Ecosystem. Hire top freelancers, sell your services, and access courses, templates, and tools — all from one trusted platform built for Algeria.",
  generator: 'Digit Hup',
  keywords: [
    'freelancer',
    'algeria',
    'digital marketplace',
    'services',
    'courses',
    'templates',
    'DZD',
    'digit hup',
    'algerian freelance',
  ],
  authors: [{ name: 'Digit Hup' }],
  openGraph: {
    title: 'Digit Hup — Sell Your Skills. Buy What You Need. Grow Where You Are.',
    description: "Algeria's First Freelancer + Learning Ecosystem",
    type: 'website',
    locale: 'en_US',
    siteName: 'Digit Hup',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digit Hup',
    description: "Algeria's First Freelancer + Learning Ecosystem",
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0EA5E9',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${cairo.variable}`}
    >
      <body className="font-sans antialiased bg-background text-foreground selection:bg-primary/30 min-h-screen flex flex-col">
        <PremiumEffects />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        <FaqChatbot />
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
