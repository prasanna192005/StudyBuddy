//@ts-nocheck
"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Bell, Check, Trash2 } from "lucide-react"
import { useState } from "react"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "join_request",
      message: "John requested to join Web Development",
      timestamp: "5 min ago",
      read: false,
    },
    { id: 2, type: "comment", message: "Jane commented on your post", timestamp: "1 hour ago", read: false },
    { id: 3, type: "approval", message: "Your join request was approved", timestamp: "2 hours ago", read: true },
    { id: 4, type: "message", message: "New message in React Study Group", timestamp: "3 hours ago", read: true },
  ])

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-3 mb-2">
            <Bell size={32} />
            Notifications
          </h1>
          <p className="text-muted-foreground">Stay updated with your learning community</p>
        </motion.div>

        {/* Notifications List */}
        <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              variants={itemVariants}
              className={`glass rounded-xl p-6 flex items-start justify-between hover:bg-white/20 smooth-transition ${
                !notification.read ? "border-l-4 border-primary" : ""
              }`}
            >
              <div className="flex-1">
                <p className={`${!notification.read ? "font-semibold" : ""}`}>{notification.message}</p>
                <p className="text-sm text-muted-foreground mt-1">{notification.timestamp}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="p-2 rounded-lg hover:bg-white/10 smooth-transition"
                    title="Mark as read"
                  >
                    <Check size={18} className="text-primary" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 smooth-transition"
                  title="Delete"
                >
                  <Trash2 size={18} className="text-destructive" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {notifications.length === 0 && (
          <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Bell size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">No notifications yet</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
