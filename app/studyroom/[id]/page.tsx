//@ts-nocheck
"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Send, Users, Phone, Video, Settings, Loader } from "lucide-react"
import { useState, useEffect } from "react"
import { useSocket } from "@/context/socket-context"
import { useRealtimeMessages, useRealtimeUsers } from "@/lib/realtime-hooks"

export default function StudyRoomPage({ params }: { params: { id: string } }) {
  const roomId = params.id
  const { emit, isConnected } = useSocket()
  const realtimeMessages = useRealtimeMessages(roomId)
  const realtimeUsers = useRealtimeUsers(roomId)

  const [messages, setMessages] = useState([
    { id: 1, author: "John", message: "Hey everyone! Ready to study?", timestamp: "10:30 AM" },
    { id: 2, author: "Jane", message: "Yes! Let's start with React hooks", timestamp: "10:31 AM" },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [participants] = useState([
    { id: 1, name: "John Doe", status: "active" },
    { id: 2, name: "Jane Smith", status: "active" },
    { id: 3, name: "Mike Johnson", status: "idle" },
  ])

  useEffect(() => {
    // Join room on mount
    if (isConnected) {
      emit("room:join", { roomId, userId: "current-user" })
    }

    // Combine local and realtime messages
    setMessages((prev) => [...prev, ...realtimeMessages])
  }, [realtimeMessages, isConnected, roomId, emit])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setIsLoading(true)
      const message = {
        id: messages.length + 1,
        author: "You",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      // Emit to Socket.IO
      emit(`room:${roomId}:message`, message)

      // Add to local state
      setMessages([...messages, message])
      setNewMessage("")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Main Study Area */}
          <motion.div
            className="lg:col-span-3 glass rounded-2xl p-6 flex flex-col"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">React Study Group</h1>
                <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-white/10 smooth-transition" title="Voice call">
                  <Phone size={20} />
                </button>
                <button className="p-2 rounded-lg hover:bg-white/10 smooth-transition" title="Video call">
                  <Video size={20} />
                </button>
                <button className="p-2 rounded-lg hover:bg-white/10 smooth-transition" title="Settings">
                  <Settings size={20} />
                </button>
              </div>
            </div>

            {/* Video Area */}
            <div className="flex-1 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl mb-6 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 gradient-primary rounded-full mx-auto mb-4" />
                <p className="text-muted-foreground">Video stream would appear here</p>
              </div>
            </div>

            {/* Chat Section */}
            <div className="flex flex-col h-64">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {messages.map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    className="flex gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="w-8 h-8 rounded-full gradient-primary flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{msg.author}</span>
                        <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm bg-white/10 rounded-lg p-2">{msg.message}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 rounded-lg glass focus:outline-none focus:border-primary/50 smooth-transition disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !newMessage.trim()}
                  className="p-2 rounded-lg gradient-primary text-white smooth-transition hover:shadow-lg disabled:opacity-50"
                >
                  {isLoading ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Participants Sidebar */}
          <motion.div
            className="glass rounded-2xl p-6 flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Users size={20} />
              Participants ({participants.length})
            </h2>
            <div className="space-y-3 flex-1">
              {participants.map((participant) => (
                <motion.div
                  key={participant.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 smooth-transition"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full gradient-primary" />
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${participant.status === "active" ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{participant.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{participant.status}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
