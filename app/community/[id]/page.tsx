//@ts-nocheck
"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { MessageSquare, Users, Heart, MessageCircle, Share2, Loader } from "lucide-react"
import { useState, useEffect } from "react"


export default function CommunityPage({ params }: { params: { id: string } }) {
  const communityId = params.id
  const { emit, isConnected } = useSocket()

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "John Doe",
      content: "Just finished the React course! Feeling great",
      likes: 24,
      comments: 5,
      timestamp: "2h ago",
      liked: false,
    },
    {
      id: 2,
      author: "Jane Smith",
      content: "Anyone interested in a study group for Next.js?",
      likes: 18,
      comments: 12,
      timestamp: "4h ago",
      liked: false,
    },
  ])
  const [newPost, setNewPost] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [members] = useState([
    { id: 1, name: "John Doe", role: "Admin" },
    { id: 2, name: "Jane Smith", role: "Member" },
    { id: 3, name: "Mike Johnson", role: "Member" },
  ])

  useEffect(() => {
    // Join community on mount
    if (isConnected) {
      emit("community:join", { communityId, userId: "current-user" })
    }
  }, [isConnected, communityId, emit])

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      setIsLoading(true)
      const post = {
        id: posts.length + 1,
        author: "You",
        content: newPost,
        likes: 0,
        comments: 0,
        timestamp: "now",
        liked: false,
      }

      // Emit to Socket.IO
      emit(`community:${communityId}:post`, post)

      // Add to local state
      setPosts([post, ...posts])
      setNewPost("")
      setIsLoading(false)
    }
  }

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
              liked: !post.liked,
            }
          : post,
      ),
    )

    // Emit like event
    emit(`community:${communityId}:like`, { postId })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Community Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 mb-12"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Web Development</h1>
              <p className="text-muted-foreground">Learn web technologies together</p>
            </div>
            <button className="px-6 py-2 rounded-lg gradient-primary text-white font-semibold smooth-transition hover:shadow-lg hover:shadow-primary/50">
              Join Community
            </button>
          </div>
          <div className="flex gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Users size={18} />
              <span>{members.length} members</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare size={18} />
              <span>{posts.length} posts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-xs">{isConnected ? "Live" : "Offline"}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Posts Section */}
          <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            {/* New Post */}
            <motion.div
              className="glass rounded-2xl p-6 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your thoughts with the community..."
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg glass focus:outline-none focus:border-primary/50 smooth-transition resize-none mb-4 disabled:opacity-50"
                rows={3}
              />
              <div className="flex justify-end">
                <button
                  onClick={handlePostSubmit}
                  disabled={isLoading || !newPost.trim()}
                  className="px-6 py-2 rounded-lg gradient-primary text-white font-semibold smooth-transition hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading ? <Loader size={18} className="animate-spin" /> : null}
                  {isLoading ? "Posting..." : "Post"}
                </button>
              </div>
            </motion.div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  className="glass rounded-2xl p-6 hover:bg-white/20 smooth-transition"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{post.author}</h3>
                      <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                    </div>
                  </div>
                  <p className="mb-4">{post.content}</p>
                  <div className="flex gap-6 text-muted-foreground">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 smooth-transition ${post.liked ? "text-red-500" : "hover:text-primary"}`}
                    >
                      <Heart size={18} fill={post.liked ? "currentColor" : "none"} />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-primary smooth-transition">
                      <MessageCircle size={18} />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-primary smooth-transition">
                      <Share2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Members Sidebar */}
          <motion.div className="glass rounded-2xl p-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-bold mb-4">Members</h2>
            <div className="space-y-3">
              {members.map((member) => (
                <motion.div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-white/10 smooth-transition"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div>
                    <p className="font-semibold text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full gradient-primary" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
