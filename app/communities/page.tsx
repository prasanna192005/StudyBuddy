//@ts-nocheck
"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Search, Plus, Users, MessageSquare, Lock } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)

  const mockCommunities = [
    {
      id: 1,
      name: "Web Development",
      description: "Learn web technologies together",
      members: 234,
      posts: 45,
      isPrivate: false,
    },
    {
      id: 2,
      name: "Data Science",
      description: "Explore data science and ML",
      members: 189,
      posts: 32,
      isPrivate: false,
    },
    {
      id: 3,
      name: "Mobile Apps",
      description: "iOS and Android development",
      members: 156,
      posts: 28,
      isPrivate: false,
    },
    {
      id: 4,
      name: "AI & ML",
      description: "Artificial Intelligence discussions",
      members: 312,
      posts: 67,
      isPrivate: false,
    },
    {
      id: 5,
      name: "Cloud Computing",
      description: "AWS, Azure, GCP learning",
      members: 198,
      posts: 41,
      isPrivate: false,
    },
    {
      id: 6,
      name: "DevOps Masters",
      description: "CI/CD and infrastructure",
      members: 145,
      posts: 23,
      isPrivate: true,
    },
  ]

  const filteredCommunities = mockCommunities.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Communities</h1>
          <p className="text-muted-foreground">Join communities and connect with learners worldwide</p>
        </motion.div>

        {/* Search and Create */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-12"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg glass focus:outline-none focus:border-primary/50 smooth-transition"
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 rounded-lg gradient-primary text-white font-semibold flex items-center justify-center gap-2 smooth-transition hover:shadow-lg"
          >
            <Plus size={20} />
            Create Community
          </button>
        </motion.div>

        {/* Communities Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredCommunities.map((community) => (
            <motion.div
              key={community.id}
              variants={itemVariants}
              className="glass rounded-2xl p-6 hover:bg-white/20 smooth-transition group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 gradient-primary rounded-lg group-hover:scale-110 smooth-transition" />
                {community.isPrivate && <Lock size={18} className="text-muted-foreground" />}
              </div>

              <h3 className="text-lg font-semibold mb-2">{community.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{community.description}</p>

              <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{community.members}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare size={16} />
                  <span>{community.posts}</span>
                </div>
              </div>

              <Link
                href={`/community/${community.id}`}
                className="w-full py-2 rounded-lg bg-primary/20 text-primary font-semibold text-center group-hover:bg-primary/30 smooth-transition"
              >
                View Community
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Create Community Modal */}
        {showCreateModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              className="glass rounded-2xl p-8 max-w-md w-full"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Create Community</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Community name"
                  className="w-full px-4 py-2 rounded-lg glass focus:outline-none focus:border-primary/50 smooth-transition"
                />
                <textarea
                  placeholder="Description"
                  className="w-full px-4 py-2 rounded-lg glass focus:outline-none focus:border-primary/50 smooth-transition resize-none"
                  rows={3}
                />
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-primary/30 font-semibold smooth-transition hover:bg-primary/10"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 rounded-lg gradient-primary text-white font-semibold smooth-transition hover:shadow-lg"
                  >
                    Create
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
