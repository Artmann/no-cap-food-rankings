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

export const metadata: Metadata = {
  description: 'Vote on which country has the best food.',
  title: 'Best Chow Where?'
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
