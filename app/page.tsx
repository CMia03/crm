"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getEmployees,
  getDepartments,
  getLeaves,
  getEvaluations,
  getTrainings,
  getRecruitments,
} from "@/lib/data"
import { Users, Building2, Calendar, FileText, GraduationCap, UserPlus, TrendingUp } from "lucide-react"

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    pendingLeaves: 0,
    totalEvaluations: 0,
    upcomingTrainings: 0,
    openRecruitments: 0,
  })

  useEffect(() => {
    const employees = getEmployees()
    const departments = getDepartments()
    const leaves = getLeaves()
    const evaluations = getEvaluations()
    const trainings = getTrainings()
    const recruitments = getRecruitments()

    const pendingLeaves = leaves.filter((l) => l.status === "pending").length
    const upcomingTrainings = trainings.filter(
      (t) => t.status === "scheduled" && new Date(t.date) >= new Date()
    ).length
    const openRecruitments = recruitments.filter((r) => r.status === "open").length

    setStats({
      totalEmployees: employees.length,
      totalDepartments: departments.length,
      pendingLeaves,
      totalEvaluations: evaluations.length,
      upcomingTrainings,
      openRecruitments,
    })
  }, [])

  const statCards = [
    {
      title: "Employés",
      value: stats.totalEmployees,
      description: "Total des employés",
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      title: "Départements",
      value: stats.totalDepartments,
      description: "Départements actifs",
      icon: Building2,
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      title: "Congés en attente",
      value: stats.pendingLeaves,
      description: "Demandes à traiter",
      icon: Calendar,
      gradient: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      borderColor: "border-yellow-200 dark:border-yellow-800",
    },
    {
      title: "Évaluations",
      value: stats.totalEvaluations,
      description: "Total des évaluations",
      icon: FileText,
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600 dark:text-blue-400",
      borderColor: "border-blue-200",
    },
    {
      title: "Formations à venir",
      value: stats.upcomingTrainings,
      description: "Formations programmées",
      icon: GraduationCap,
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      title: "Recrutements ouverts",
      value: stats.openRecruitments,
      description: "Postes à pourvoir",
      icon: UserPlus,
      gradient: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      borderColor: "border-yellow-200 dark:border-yellow-800",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-green-600 to-yellow-600 dark:from-blue-400 dark:via-green-400 dark:to-yellow-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Vue d'ensemble de votre système de gestion RH
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card 
              key={stat.title}
              className={`relative overflow-hidden border-2 ${stat.borderColor} transition-all duration-300 hover:shadow-lg hover:scale-105 ${stat.bgColor}`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -mr-16 -mt-16`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-semibold text-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg bg-white/80 dark:bg-slate-700/80 shadow-sm`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground font-medium">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-800 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Activités récentes</CardTitle>
                <CardDescription>Dernières actions dans le système</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm border border-blue-100 dark:border-slate-700">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">Système opérationnel</p>
                  <p className="text-xs text-muted-foreground">
                    Toutes les fonctionnalités sont disponibles
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-white dark:from-slate-800 dark:to-slate-800 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Statistiques rapides</CardTitle>
                <CardDescription>Indicateurs clés de performance</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm border border-green-100 dark:border-slate-700">
                <span className="text-sm font-medium text-foreground">Taux de présence</span>
                <span className="text-sm font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">95%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm border border-green-100 dark:border-slate-700">
                <span className="text-sm font-medium text-foreground">Employés actifs</span>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                  {stats.totalEmployees} / {stats.totalEmployees}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm border border-green-100 dark:border-slate-700">
                <span className="text-sm font-medium text-foreground">Congés approuvés</span>
                <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full">
                  {getLeaves().filter((l) => l.status === "approved").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
