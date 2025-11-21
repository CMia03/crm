"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Calendar,
  FileText,
  GraduationCap,
  UserPlus,
  Menu,
  LogOut,
  UserCircle,
} from "lucide-react"
import { useState, useEffect } from "react"
import { getSession, logout as logoutUser } from "@/lib/auth"
import { useRouter } from "next/navigation"
import type { AuthSession } from "@/lib/auth"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Employés", href: "/employees", icon: Users },
  { name: "Départements", href: "/departments", icon: Building2 },
  { name: "Postes", href: "/positions", icon: Briefcase },
  { name: "Congés", href: "/leaves", icon: Calendar },
  { name: "Évaluations", href: "/evaluations", icon: FileText },
  { name: "Formations", href: "/trainings", icon: GraduationCap },
  { name: "Recrutements", href: "/recruitments", icon: UserPlus },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [session, setSession] = useState<AuthSession | null>(null)

  useEffect(() => {
    setSession(getSession())
  }, [])

  const logout = () => {
    logoutUser()
    setSession(null)
    router.push("/login")
  }

  return (
    <>
      <button
        className="lg:hidden  fixed top-4 left-4 z-50 p-2 rounded-md bg-background border"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-slate-800 lg:bg-gradient-to-b lg:from-white lg:via-blue-50/30 lg:to-green-50/30 dark:lg:from-slate-800 dark:lg:via-slate-800/50 dark:lg:to-slate-900 border-r-2 border-blue-200 dark:border-slate-700 shadow-xl transition-transform lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full px-4 py-4 overflow-y-auto">
          <div className="mb-8 mt-12 lg:mt-4 pb-6 border-b-2 border-blue-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-green-500 shadow-md">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
                HR Manager
              </h1>
            </div>
            <p className="text-sm text-muted-foreground ml-11">Ressources Humaines</p>
          </div>

          <nav className="space-y-2">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href
              const colors = [
                { bg: "bg-blue-500", hover: "hover:bg-blue-100 dark:hover:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400", active: "bg-blue-500" },
                { bg: "bg-green-500", hover: "hover:bg-green-100 dark:hover:bg-green-900/30", text: "text-green-600 dark:text-green-400", active: "bg-green-500" },
                { bg: "bg-yellow-500", hover: "hover:bg-yellow-100 dark:hover:bg-yellow-900/30", text: "text-yellow-600 dark:text-yellow-400", active: "bg-yellow-500" },
              ]
              const color = colors[index % 3]
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group",
                    isActive
                      ? `${color.active} text-white shadow-lg transform scale-105`
                      : `text-muted-foreground ${color.hover} hover:text-foreground hover:shadow-md`
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive ? "text-white" : color.text,
                    "group-hover:scale-110"
                  )} />
                  <span className={isActive ? "text-white font-bold" : ""}>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto pt-6 border-t-2 border-blue-100 dark:border-slate-700">
            {session && (
              <div className="mb-4 px-4 py-2 rounded-lg bg-blue-50/50 dark:bg-slate-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <UserCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <p className="text-xs font-semibold text-foreground">
                    {session.user.firstName} {session.user.lastName}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  {session.user.role}
                </p>
              </div>
            )}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:shadow-md"
            >
              <LogOut className="h-5 w-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

