'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

export default function StudyBuddyNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Study Groups", href: "/groups", icon: "👥" },
    { name: "Resources", href: "/resources", icon: "📚" },
    { name: "Calendar", href: "/calendar", icon: "📅" },
  ];

  // 🔥 Listen for Firebase Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 🟢 Sign in with Google
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // 🔴 Sign out
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsProfileOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <nav className="bg-gray-900 text-gray-300 p-4 text-center">
        Loading...
      </nav>
    );
  }

  return (
    <nav className="bg-gray-900/95 backdrop-blur-xl border-b border-orange-500/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-3xl">🎓</div>
            <span className="text-2xl font-bold text-white">
              Study<span className="text-orange-400">Buddy</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-orange-500/10 transition-all duration-300 flex items-center space-x-2 group"
              >
                <span className="group-hover:scale-110 transition-transform duration-300">
                  {link.icon}
                </span>
                <span className="font-medium">{link.name}</span>
              </a>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 px-4 py-2 pl-10 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
              />
              <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg text-gray-300 hover:text-white hover:bg-orange-500/10 transition-all duration-300">
              <span className="text-xl">🔔</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            </button>

            {/* If user is logged in */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-orange-500/10 transition-all duration-300"
                >
                  <img
                    src={user.photoURL || 'https://ui-avatars.com/api/?name=User'}
                    alt={user.displayName || 'User'}
                    className="w-9 h-9 rounded-full ring-2 ring-orange-500/50"
                  />
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-semibold text-white">
                      {user.displayName}
                    </p>
                    <p className="text-xs text-gray-400">Student</p>
                  </div>
                  <span className="text-gray-400">▼</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-2xl border border-orange-500/20 py-2 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm font-semibold text-white">
                        {user.displayName}
                      </p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <a href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-orange-500/10 hover:text-white transition-all duration-300">
                      👤 My Profile
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-orange-400 hover:bg-orange-500/10 transition-all duration-300"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300"
              >
                Sign In with Google
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-orange-500/10 transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu (optional to expand login/logout) */}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
}
