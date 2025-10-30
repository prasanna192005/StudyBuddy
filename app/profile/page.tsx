//@ts-nocheck
"use client"

import { motion } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import { Navbar } from "@/components/navbar"
import { Mail, MapPin, Calendar, Edit2, Save } from "lucide-react"
import { useState } from "react"

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "Passionate learner and developer",
    location: "San Francisco, CA",
  })

  const handleSave = () => {
    setIsEditing(false)
    // Save to backend
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <motion.div
          className="glass rounded-2xl p-8 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div className="flex items-center gap-6 mb-6 sm:mb-0">
              <div className="w-24 h-24 gradient-primary rounded-full" />
              <div>
                <h1 className="text-3xl font-bold">{user?.name}</h1>
                <p className="text-muted-foreground">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-6 py-2 rounded-lg gradient-primary text-white font-semibold smooth-transition hover:shadow-lg"
            >
              {isEditing ? <Save size={20} /> : <Edit2 size={20} />}
              {isEditing ? "Save" : "Edit Profile"}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg glass focus:outline-none focus:border-primary/50 smooth-transition"
              />
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-2 rounded-lg glass focus:outline-none focus:border-primary/50 smooth-transition resize-none"
                rows={3}
              />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 rounded-lg glass focus:outline-none focus:border-primary/50 smooth-transition"
              />
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-4">{formData.bio}</p>
              <div className="flex flex-col sm:flex-row gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-primary" />
                  <span>{formData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-primary" />
                  <span>{formData.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-primary" />
                  <span>Joined 3 months ago</span>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {[
            { label: "Communities", value: "5" },
            { label: "Study Hours", value: "24.5" },
            { label: "Posts", value: "18" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="glass rounded-2xl p-6 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <p className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">{stat.value}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Communities */}
        <motion.div
          className="glass rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6">Your Communities</h2>
          <div className="space-y-3">
            {["Web Development", "Data Science", "Mobile Apps"].map((community, i) => (
              <motion.div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-white/10 smooth-transition"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-primary rounded-lg" />
                  <span className="font-semibold">{community}</span>
                </div>
                <button className="text-primary font-semibold hover:underline">View</button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
