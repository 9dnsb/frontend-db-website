// src/app/layout.tsx
import Navbar from './components/Navbar'
import './globals.css'
import { Geist, Geist_Mono } from 'next/font/google'
import type { Metadata } from 'next'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "David Blatt's Website",
  description: 'Learn how AI might fit into your own life',
  openGraph: {
    title: "David Blatt's Website",
    description: 'Learn how AI might fit into your own life',
    url: 'https://davidblatt.ca',
    siteName: "David Blatt's Website",
    images: [
      {
        url: 'https://davidblatt.ca/og.png',
        width: 1200,
        height: 630,
        alt: "David Blatt's Website",
      },
    ],
    locale: 'en_CA',
    type: 'website',
  },
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="pt-[72px]">
        {' '}
        {/* ensure content isn't hidden behind navbar */}
        <Navbar />
        <main className="max-w-4xl mx-auto px-6 py-12">{children}</main>
      </body>
    </html>
  )
}
