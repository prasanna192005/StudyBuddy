//@ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore"
import { useRouter } from "next/navigation"

export default function StudyBuddyDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login")
        return
      }

      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
      if (userDoc.exists()) {
        setUser(userDoc.data())
      }

      // Load joined communities
      const memberQuery = query(collection(db, "members"), where("userId", "==", firebaseUser.uid))
      const memberDocs = await getDocs(memberQuery)
      const communityIds = memberDocs.docs.map((doc) => doc.data().communityId)

      if (communityIds.length > 0) {
        const communityPromises = communityIds.map((id) => getDoc(doc(db, "communities", id)))
        const results = await Promise.all(communityPromises)
        setCommunities(results.filter((r) => r.exists()).map((r) => r.data()))
      }

      setLoading(false)
    })
    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-2xl">
        Loading Dashboard...
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-orange-900/30 relative overflow-hidden">
      {/* Navbar */}
      <nav className="relative z-20 bg-gray-900/50 backdrop-blur-xl border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-purple-600 rounded-lg flex items-center justify-center">
              🎯
            </div>
            <span className="text-xl font-bold text-white">
              Study<span className="text-orange-400">Buddy</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => signOut(auth)}
              className="text-sm text-orange-400 hover:text-orange-300 transition"
            >
              Logout
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
              {user.name?.charAt(0) || "S"}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-gray-400 mb-6">Here’s your learning summary</p>

        {/* Communities */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">Your Communities</h2>
          {communities.length === 0 ? (
            <p className="text-gray-400">You haven’t joined any communities yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {communities.map((c) => (
                <div
                  key={c.communityId}
                  className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 hover:border-orange-500 transition"
                >
                  <h3 className="text-lg font-bold text-white mb-1">{c.name}</h3>
                  <p className="text-sm text-gray-400">{c.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-gray-500 text-center mt-12 text-sm">
          Made with ❤️ by StudyBuddy
        </div>
      </div>
    </div>
  )
}
