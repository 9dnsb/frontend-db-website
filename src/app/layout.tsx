// src/app/layout.tsx
import Navbar from './components/Navbar'
import './globals.css'
import { Geist, Geist_Mono } from 'next/font/google'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'David Blatt',
  description: 'Personal blog by David Blatt',
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
