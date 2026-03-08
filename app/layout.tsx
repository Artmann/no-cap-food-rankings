import type { Metadata } from 'next'
import { JetBrains_Mono, Merriweather, Outfit } from 'next/font/google'
import Script from 'next/script'
import { Toaster } from '@/components/ui/sonner'
import CookieBanner from './cookie-banner'
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

const url = 'https://no-cap-food-rankings.vercel.app'

export const metadata: Metadata = {
  description: 'vote on which country has the best food.',
  metadataBase: new URL(url),
  openGraph: {
    description: 'vote on which country has the best food.',
    images: [
      {
        alt: 'no cap food rankings',
        height: 630,
        url: '/og.png',
        width: 1200
      }
    ],
    siteName: 'no cap food rankings',
    title: 'no cap food rankings',
    type: 'website',
    url
  },
  title: 'no cap food rankings',
  twitter: {
    card: 'summary_large_image',
    description: 'vote on which country has the best food.',
    images: ['/og.png'],
    title: 'no cap food rankings'
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
        <Toaster />
        <CookieBanner />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-L9L0DQ9RS2"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            window.gtag = function(){dataLayer.push(arguments);};
            window.gtag('consent', 'default', {
              analytics_storage: 'granted'
            });
            window.gtag('js', new Date());
            window.gtag('config', 'G-L9L0DQ9RS2');
          `}
        </Script>
      </body>
    </html>
  )
}
