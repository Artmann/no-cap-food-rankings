import type { Metadata } from 'next'
import { JetBrains_Mono, Merriweather, Outfit } from 'next/font/google'
import './globals.css'

const fontSans = Outfit({
  subsets: ['latin'],
  variable: '--font-sans'
})

const fontSerif = Merriweather({
  subsets: ['latin'],
  variable: '--font-serif'
})

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
})

const url = 'https://chow-where.vercel.app'

export const metadata: Metadata = {
  description: 'Vote on which country has the best food.',
  metadataBase: new URL(url),
  openGraph: {
    description: 'Vote on which country has the best food.',
    images: [
      {
        alt: 'Best Chow? Vote Now!',
        height: 630,
        url: '/og.png',
        width: 1200
      }
    ],
    siteName: 'Best Chow Where?',
    title: 'Best Chow Where?',
    type: 'website',
    url
  },
  title: 'Best Chow Where?',
  twitter: {
    card: 'summary_large_image',
    description: 'Vote on which country has the best food.',
    images: ['/og.png'],
    title: 'Best Chow Where?'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
