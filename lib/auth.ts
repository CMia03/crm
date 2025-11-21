import usersData from "@/data/users.json"
import type { User } from "./types"

const AUTH_STORAGE_KEY = "hr_auth"
const SESSION_STORAGE_KEY = "hr_session"

export interface AuthSession {
  user: Omit<User, "password">
  token: string
  expiresAt: number
}

// Charger les utilisateurs depuis localStorage ou JSON
const getUsers = (): User[] => {
  if (typeof window === "undefined") return usersData as User[]
  
  const stored = localStorage.getItem("hr_users")
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return usersData as User[]
    }
  }
  
  // Initialiser avec les données JSON
  localStorage.setItem("hr_users", JSON.stringify(usersData))
  return usersData as User[]
}

// Authentifier un utilisateur
export const login = (username: string, password: string): AuthSession | null => {
  const users = getUsers()
  const user = users.find(
    (u) => u.username === username && u.password === password
  )

  if (!user) {
    return null
  }

  // Créer une session
  const session: AuthSession = {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
    token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 heures
  }

  // Sauvegarder la session
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
  }

  return session
}

// Déconnexion
export const logout = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_STORAGE_KEY)
  }
}

// Vérifier si l'utilisateur est authentifié
export const getSession = (): AuthSession | null => {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem(SESSION_STORAGE_KEY)
  if (!stored) return null

  try {
    const session: AuthSession = JSON.parse(stored)
    
    // Vérifier si la session a expiré
    if (session.expiresAt < Date.now()) {
      logout()
      return null
    }

    return session
  } catch {
    return null
  }
}

// Vérifier si l'utilisateur est authentifié
export const isAuthenticated = (): boolean => {
  return getSession() !== null
}

// Obtenir l'utilisateur actuel
export const getCurrentUser = (): Omit<User, "password"> | null => {
  const session = getSession()
  return session ? session.user : null
}

