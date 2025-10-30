//@ts-nocheck
"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { io, type Socket } from "socket.io-client"
import { useAuth } from "./auth-context"

interface SocketContextType {
  isConnected: boolean
  socket: Socket | null
  emit: (event: string, data: any) => void
  on: (event: string, callback: (data: any) => void) => void
  off: (event: string, callback?: (data: any) => void) => void
  joinRoom: (roomType: string, roomId: string) => void
  leaveRoom: (roomType: string, roomId: string) => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"

    const newSocket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      auth: {
        idToken: user.id, // In production, use Firebase ID token
        userId: user.id,
      },
    })

    newSocket.on("connect", () => {
      console.log("[v0] Socket connected:", newSocket.id)
      setIsConnected(true)
    })

    newSocket.on("disconnect", () => {
      console.log("[v0] Socket disconnected")
      setIsConnected(false)
    })

    newSocket.on("connect_error", (error) => {
      console.warn("[v0] Socket connection error:", error)
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [user])

  const emit = useCallback(
    (event: string, data: any) => {
      if (socket?.connected) {
        socket.emit(event, data)
      } else {
        console.warn("[v0] Socket not connected, cannot emit:", event)
      }
    },
    [socket],
  )

  const on = useCallback(
    (event: string, callback: (data: any) => void) => {
      if (socket) {
        socket.on(event, callback)
      }
    },
    [socket],
  )

  const off = useCallback(
    (event: string, callback?: (data: any) => void) => {
      if (socket) {
        socket.off(event, callback)
      }
    },
    [socket],
  )

  const joinRoom = useCallback(
    (roomType: string, roomId: string) => {
      const room = `${roomType}_${roomId}`
      emit("join_room", { room, userId: user?.id })
    },
    [emit, user?.id],
  )

  const leaveRoom = useCallback(
    (roomType: string, roomId: string) => {
      const room = `${roomType}_${roomId}`
      emit("leave_room", { room, userId: user?.id })
    },
    [emit, user?.id],
  )

  return (
    <SocketContext.Provider value={{ isConnected, socket, emit, on, off, joinRoom, leaveRoom }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider")
  }
  return context
}
