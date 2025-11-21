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
} from "lucide-react"
import { useState } from "react"

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
  const [isOpen, setIsOpen] = useState(false)

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
          "fixed top-0 left-0 z-40 h-screen w-64 bg-white lg:bg-gradient-to-b lg:from-white lg:via-blue-50/30 lg:to-green-50/30 border-r-2 border-blue-200 shadow-xl transition-transform lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full px-4 py-4 overflow-y-auto">
          <div className="mb-8 mt-12 lg:mt-4 pb-6 border-b-2 border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-green-500 shadow-md">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                HR Manager
              </h1>
            </div>
            <p className="text-sm text-muted-foreground ml-11">Ressources Humaines</p>
          </div>

          <nav className="space-y-2">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href
              const colors = [
                { bg: "bg-blue-500", hover: "hover:bg-blue-100", text: "text-blue-600", active: "bg-blue-500" },
                { bg: "bg-green-500", hover: "hover:bg-green-100", text: "text-green-600", active: "bg-green-500" },
                { bg: "bg-yellow-500", hover: "hover:bg-yellow-100", text: "text-yellow-600", active: "bg-yellow-500" },
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

