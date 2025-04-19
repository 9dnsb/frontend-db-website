// src/app/layout.tsx
import './globals.css'
import { Geist, Geist_Mono } from 'next/font/google'
import Link from 'next/link'
import { ThemeToggleButton } from './components/theme-toggle-button'

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
      <body>
        <header className="w-full px-6 py-4 border-b border-neutral-200">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight">
              David Blatt
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/blog" className="hover:underline">
                Blog
              </Link>
              <Link href="/about" className="hover:underline">
                About
              </Link>
              <ThemeToggleButton />
            </nav>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-12">{children}</main>
      </body>
    </html>
  )
}
