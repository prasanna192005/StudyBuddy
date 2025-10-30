//@ts-nocheck
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Menu, X, LogOut, User, Moon, Sun } from "lucide-react"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase" // <-- make sure this exists (same as before)

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)

  // Track Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <motion.nav
      className="sticky top-0 z-50 glass border-b border-primary/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-white font-bold">
              SB
            </div>
            <span className="font-bold text-lg hidden sm:inline">StudyBuddy</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <Link href="/dashboard" className="smooth-transition hover:text-primary">
                  Dashboard
                </Link>
                <Link href="/communities" className="smooth-transition hover:text-primary">
                  Communities
                </Link>
                <Link href="/notifications" className="smooth-transition hover:text-primary">
                  Notifications
                </Link>
                <div className="flex items-center gap-4">
                  <Link href="/profile" className="flex items-center gap-2 smooth-transition hover:text-primary">
                    <User size={20} />
                    <span className="text-sm">{user.displayName || user.email}</span>
                  </Link>
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg hover:bg-primary/10 smooth-transition"
                    aria-label="Toggle dark mode"
                  >
                    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 smooth-transition"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="smooth-transition hover:text-primary">
                  Login
                </Link>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-primary/10 smooth-transition"
                  aria-label="Toggle dark mode"
                >
                  {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <Link
                  href="/auth"
                  className="px-6 py-2 rounded-lg gradient-primary text-white font-semibold smooth-transition hover:shadow-lg hover:shadow-primary/50"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button + Theme Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-primary/10 smooth-transition"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-primary/10 smooth-transition">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            className="md:hidden pb-4 space-y-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {user ? (
              <>
                <Link href="/dashboard" className="block px-4 py-2 rounded-lg hover:bg-primary/10 smooth-transition">
                  Dashboard
                </Link>
                <Link href="/communities" className="block px-4 py-2 rounded-lg hover:bg-primary/10 smooth-transition">
                  Communities
                </Link>
                <Link href="/notifications" className="block px-4 py-2 rounded-lg hover:bg-primary/10 smooth-transition">
                  Notifications
                </Link>
                <Link href="/profile" className="block px-4 py-2 rounded-lg hover:bg-primary/10 smooth-transition">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 smooth-transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth" className="block px-4 py-2 rounded-lg hover:bg-primary/10 smooth-transition">
                  Login
                </Link>
                <Link
                  href="/auth"
                  className="block px-4 py-2 rounded-lg gradient-primary text-white font-semibold smooth-transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
