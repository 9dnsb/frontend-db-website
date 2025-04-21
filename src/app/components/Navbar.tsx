'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ThemeToggleButton } from './theme-toggle-button'
import { FiMenu, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)] border-b border-neutral-200 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          David Blatt
        </Link>

        {/* ✅ Full Nav (visible on md+) */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/blog" className="hover:underline">
            Blog
          </Link>
          <Link href="/puzzles" className="hover:underline">
            Puzzles
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>

          <ThemeToggleButton />
        </nav>

        {/* ✅ Hamburger Icon (visible on <md) */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* ✅ Mobile Menu (toggleable below md) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-[var(--background)] border-t border-neutral-100 dark:border-neutral-800 md:hidden"
          >
            <div className="flex flex-col items-start px-6 py-4 text-sm gap-4 border-t border-neutral-200">
              <Link
                href="/blog"
                className="hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/puzzles"
                className="hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                Puzzles
              </Link>
              <Link
                href="/about"
                className="hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                About
              </Link>

              <ThemeToggleButton />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
