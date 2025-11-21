"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getSession, logout as logoutUser, type AuthSession } from "@/lib/auth"

interface AuthContextType {
  session: AuthSession | null
  isLoading: boolean
  logout: () => void
  refresh: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const refresh = () => {
    const currentSession = getSession()
    setSession(currentSession)
  }

  const logout = () => {
    logoutUser()
    setSession(null)
    router.push("/login")
  }

  useEffect(() => {
    const currentSession = getSession()
    setSession(currentSession)
    setIsLoading(false)

    // Vérifier l'authentification sur les routes protégées
    if (pathname !== "/login" && !currentSession) {
      router.push("/login")
    }
  }, [pathname, router])

  return (
    <AuthContext.Provider value={{ session, isLoading, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

