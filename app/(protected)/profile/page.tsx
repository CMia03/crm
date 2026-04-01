"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCurrentUser, getSession } from "@/lib/auth"
import { UserCircle, Mail, Phone, Calendar, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(getCurrentUser())
  const [session, setSession] = useState(getSession())

  useEffect(() => {
    const currentUser = getCurrentUser()
    const currentSession = getSession()
    
    if (!currentUser || !currentSession) {
      router.push("/login")
      return
    }

    setUser(currentUser)
    setSession(currentSession)
  }, [router])

  if (!user || !session) {
    return null
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: "Administrateur",
      manager: "Manager",
      user: "Utilisateur",
    }
    return labels[role] || role
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a4f7a] dark:text-[#60a5fa]">
            Mon Profil
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Informations de votre compte
          </p>
        </div>
        <Link href="/">
          <Button variant="outline" className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au dashboard
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informations personnelles */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-[#f0f9ff]/50 dark:bg-[#084060]/50 border-b-2 border-[#e0f2fe] dark:border-[#063147]">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-[#0a4f7a] shadow-md">
                <UserCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl">Informations personnelles</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Vos informations de compte
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f0f9ff]/50 dark:bg-[#084060]/50 border border-[#e0f2fe] dark:border-[#063147]">
                <UserCircle className="h-5 w-5 text-[#0a4f7a] dark:text-[#60a5fa]" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Nom complet</p>
                  <p className="text-sm font-semibold text-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f0f9ff]/50 dark:bg-[#084060]/50 border border-[#e0f2fe] dark:border-[#063147]">
                <Mail className="h-5 w-5 text-[#0a4f7a] dark:text-[#60a5fa]" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="text-sm font-semibold text-foreground">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f0f9ff]/50 dark:bg-[#084060]/50 border border-[#e0f2fe] dark:border-[#063147]">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Rôle</p>
                  <p className="text-sm font-semibold text-foreground">{getRoleLabel(user.role)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f0f9ff]/50 dark:bg-[#084060]/50 border border-[#e0f2fe] dark:border-[#063147]">
                <Calendar className="h-5 w-5 text-[#0a4f7a] dark:text-[#60a5fa]" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Nom d'utilisateur</p>
                  <p className="text-sm font-semibold text-foreground">{user.username}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informations de session */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-[#f0f9ff]/50 dark:bg-[#084060]/50 border-b-2 border-[#e0f2fe] dark:border-[#063147]">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-[#0a4f7a] shadow-md">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl">Informations de session</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Détails de votre session actuelle
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-[#f0fdf4]/50 dark:bg-[#063147]/50 border border-[#dcfce7] dark:border-[#14532d]">
                <p className="text-xs text-muted-foreground mb-1">Statut de la session</p>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">Active</p>
              </div>

              <div className="p-3 rounded-lg bg-[#f0f9ff]/50 dark:bg-[#084060]/50 border border-[#e0f2fe] dark:border-[#063147]">
                <p className="text-xs text-muted-foreground mb-1">Date d'expiration</p>
                <p className="text-sm font-semibold text-foreground">
                  {new Date(session.expiresAt).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#fefce8]/50 dark:bg-[#063147]/50 border border-[#fef9c3] dark:border-[#14532d]">
                <p className="text-xs text-muted-foreground mb-1">Temps restant</p>
                <p className="text-sm font-semibold text-foreground">
                  {Math.floor((session.expiresAt - Date.now()) / (1000 * 60 * 60))} heures
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

