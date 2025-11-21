"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  getEvaluations,
  getEmployees,
  createEvaluation,
  updateEvaluation,
} from "@/lib/data"
import type { Evaluation } from "@/lib/types"
import { Plus, FileText, Star } from "lucide-react"
import { SearchInput } from "@/components/ui/search-input"

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [filteredEvaluations, setFilteredEvaluations] = useState<Evaluation[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [employees, setEmployees] = useState(getEmployees())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    employeeId: "",
    period: "",
    performance: "0",
    communication: "0",
    teamwork: "0",
    initiative: "0",
    leadership: "0",
    strengths: "",
    improvements: "",
    goals: "",
  })

  const getEmployeeName = (id: string) => {
    const employee = employees.find((e) => e.id === id)
    return employee ? `${employee.firstName} ${employee.lastName}` : "N/A"
  }

  useEffect(() => {
    loadEvaluations()
  }, [])

  useEffect(() => {
    filterEvaluations()
  }, [searchQuery, evaluations, employees])

  const loadEvaluations = () => {
    const allEvaluations = getEvaluations()
    setEvaluations(allEvaluations)
    setFilteredEvaluations(allEvaluations)
  }

  const filterEvaluations = () => {
    if (!searchQuery.trim()) {
      setFilteredEvaluations(evaluations)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = evaluations.filter((evaluation) => {
      const employeeName = getEmployeeName(evaluation.employeeId).toLowerCase()
      const period = evaluation.period.toLowerCase()
      const overallScore = evaluation.overallScore.toString()
      const performance = evaluation.scores.performance.toString()
      const communication = evaluation.scores.communication.toString()
      const teamwork = evaluation.scores.teamwork.toString()
      const initiative = evaluation.scores.initiative.toString()
      const leadership = evaluation.scores.leadership.toString()
      const strengths = evaluation.strengths.join(" ").toLowerCase()
      const improvements = evaluation.improvements.join(" ").toLowerCase()
      const goals = evaluation.goals.join(" ").toLowerCase()
      const status = evaluation.status === "completed" ? "terminée" : "en attente"

      return (
        employeeName.includes(query) ||
        period.includes(query) ||
        overallScore.includes(query) ||
        performance.includes(query) ||
        communication.includes(query) ||
        teamwork.includes(query) ||
        initiative.includes(query) ||
        leadership.includes(query) ||
        strengths.includes(query) ||
        improvements.includes(query) ||
        goals.includes(query) ||
        status.includes(query)
      )
    })
    setFilteredEvaluations(filtered)
  }

  const handleOpenDialog = () => {
    setFormData({
      employeeId: "",
      period: "",
      performance: "0",
      communication: "0",
      teamwork: "0",
      initiative: "0",
      leadership: "0",
      strengths: "",
      improvements: "",
      goals: "",
    })
    setIsDialogOpen(true)
  }

  const calculateOverallScore = () => {
    const scores = [
      Number(formData.performance),
      Number(formData.communication),
      Number(formData.teamwork),
      Number(formData.initiative),
      Number(formData.leadership),
    ]
    return scores.reduce((a, b) => a + b, 0) / scores.length
  }

  const handleSubmit = () => {
    const overallScore = calculateOverallScore()
    const evaluationData = {
      employeeId: formData.employeeId,
      evaluatorId: "1",
      period: formData.period,
      evaluationDate: new Date().toISOString().split("T")[0],
      scores: {
        performance: Number(formData.performance),
        communication: Number(formData.communication),
        teamwork: Number(formData.teamwork),
        initiative: Number(formData.initiative),
        leadership: Number(formData.leadership),
      },
      overallScore,
      strengths: formData.strengths
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
      improvements: formData.improvements
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i.length > 0),
      goals: formData.goals
        .split(",")
        .map((g) => g.trim())
        .filter((g) => g.length > 0),
      status: "completed" as const,
    }

    createEvaluation(evaluationData)
    setIsDialogOpen(false)
    loadEvaluations()
  }

  const getScoreColor = (score: number) => {
    if (score >= 4) return "text-green-600 dark:text-green-400"
    if (score >= 3) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
            Évaluations
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Gestion des évaluations de performance
          </p>
        </div>
        <Button 
          onClick={handleOpenDialog}
          className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle évaluation
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-green-50/50 dark:from-slate-700/50 dark:to-slate-800/50 border-b-2 border-blue-100 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-lg sm:text-xl">Liste des évaluations</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {filteredEvaluations.length} évaluation{filteredEvaluations.length > 1 ? "s" : ""} sur {evaluations.length} au total
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4">
            <SearchInput
              placeholder="Rechercher par employé, période, scores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
            />
          </div>
          
          {/* Mobile/Tablet View - Cards */}
          <div className="block xl:hidden space-y-3">
            {filteredEvaluations.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {searchQuery ? "Aucun résultat trouvé pour votre recherche" : "Aucune évaluation trouvée"}
              </div>
            ) : (
              filteredEvaluations.map((evaluation) => (
                <Card key={evaluation.id} className="border-2 border-blue-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-base text-foreground mb-1">
                          {getEmployeeName(evaluation.employeeId)}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2">{evaluation.period}</p>
                      </div>
                      <Badge variant={evaluation.status === "completed" ? "success" : "warning"} className="text-xs">
                        {evaluation.status === "completed" ? "Terminée" : "En attente"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Performance</p>
                        <p className={`text-sm font-semibold ${getScoreColor(evaluation.scores.performance)}`}>
                          {evaluation.scores.performance.toFixed(1)}/5
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Communication</p>
                        <p className={`text-sm font-semibold ${getScoreColor(evaluation.scores.communication)}`}>
                          {evaluation.scores.communication.toFixed(1)}/5
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Esprit d'équipe</p>
                        <p className={`text-sm font-semibold ${getScoreColor(evaluation.scores.teamwork)}`}>
                          {evaluation.scores.teamwork.toFixed(1)}/5
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Initiative</p>
                        <p className={`text-sm font-semibold ${getScoreColor(evaluation.scores.initiative)}`}>
                          {evaluation.scores.initiative.toFixed(1)}/5
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-blue-100 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">Leadership</p>
                        <p className={`text-sm font-semibold ${getScoreColor(evaluation.scores.leadership)}`}>
                          {evaluation.scores.leadership.toFixed(1)}/5
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs font-semibold text-foreground">Score global</p>
                        <div className="flex items-center gap-1">
                          <Star className={`h-4 w-4 ${getScoreColor(evaluation.overallScore)} fill-current`} />
                          <span className={`font-bold text-base ${getScoreColor(evaluation.overallScore)}`}>
                            {evaluation.overallScore.toFixed(1)}/5
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden xl:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Employé</TableHead>
                  <TableHead className="min-w-[100px]">Période</TableHead>
                  <TableHead className="min-w-[100px]">Performance</TableHead>
                  <TableHead className="min-w-[120px]">Communication</TableHead>
                  <TableHead className="min-w-[120px]">Esprit d'équipe</TableHead>
                  <TableHead className="min-w-[100px]">Initiative</TableHead>
                  <TableHead className="min-w-[100px]">Leadership</TableHead>
                  <TableHead className="min-w-[120px]">Score global</TableHead>
                  <TableHead className="min-w-[100px]">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvaluations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      {searchQuery ? "Aucun résultat trouvé pour votre recherche" : "Aucune évaluation trouvée"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvaluations.map((evaluation) => (
                    <TableRow key={evaluation.id} className="hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-colors">
                      <TableCell className="font-medium">
                        {getEmployeeName(evaluation.employeeId)}
                      </TableCell>
                      <TableCell>{evaluation.period}</TableCell>
                      <TableCell>
                        <span className={`font-semibold ${getScoreColor(evaluation.scores.performance)}`}>
                          {evaluation.scores.performance.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${getScoreColor(evaluation.scores.communication)}`}>
                          {evaluation.scores.communication.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${getScoreColor(evaluation.scores.teamwork)}`}>
                          {evaluation.scores.teamwork.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${getScoreColor(evaluation.scores.initiative)}`}>
                          {evaluation.scores.initiative.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${getScoreColor(evaluation.scores.leadership)}`}>
                          {evaluation.scores.leadership.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className={`h-4 w-4 ${getScoreColor(evaluation.overallScore)} fill-current`} />
                          <span className={`font-bold ${getScoreColor(evaluation.overallScore)}`}>
                            {evaluation.overallScore.toFixed(1)}/5
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={evaluation.status === "completed" ? "success" : "warning"}>
                          {evaluation.status === "completed" ? "Terminée" : "En attente"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">Nouvelle évaluation</DialogTitle>
            <DialogDescription className="text-sm">
              Créez une nouvelle évaluation de performance
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:gap-6 px-2 sm:px-6 py-4 sm:py-6 bg-white dark:bg-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employé</Label>
                <select
                  id="employeeId"
                  className="flex h-9 w-full rounded-md border border-input dark:border-slate-600 bg-transparent dark:bg-slate-700 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                  value={formData.employeeId}
                  onChange={(e) =>
                    setFormData({ ...formData, employeeId: e.target.value })
                  }
                >
                  <option value="">Sélectionner un employé</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="period">Période</Label>
                <Input
                  id="period"
                  value={formData.period}
                  onChange={(e) =>
                    setFormData({ ...formData, period: e.target.value })
                  }
                  placeholder="2024-Q1"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold mb-4">Scores (0-5)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="performance">Performance</Label>
                  <Input
                    id="performance"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.performance}
                    onChange={(e) =>
                      setFormData({ ...formData, performance: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="communication">Communication</Label>
                  <Input
                    id="communication"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.communication}
                    onChange={(e) =>
                      setFormData({ ...formData, communication: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamwork">Esprit d'équipe</Label>
                  <Input
                    id="teamwork"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.teamwork}
                    onChange={(e) =>
                      setFormData({ ...formData, teamwork: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="initiative">Initiative</Label>
                  <Input
                    id="initiative"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.initiative}
                    onChange={(e) =>
                      setFormData({ ...formData, initiative: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leadership">Leadership</Label>
                  <Input
                    id="leadership"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.leadership}
                    onChange={(e) =>
                      setFormData({ ...formData, leadership: e.target.value })
                    }
                  />
                </div>
              </div>
              {formData.performance !== "0" && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Score global : {calculateOverallScore().toFixed(1)}/5
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="strengths">Points forts (séparés par des virgules)</Label>
              <Input
                id="strengths"
                value={formData.strengths}
                onChange={(e) =>
                  setFormData({ ...formData, strengths: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="improvements">Points à améliorer (séparés par des virgules)</Label>
              <Input
                id="improvements"
                value={formData.improvements}
                onChange={(e) =>
                  setFormData({ ...formData, improvements: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goals">Objectifs (séparés par des virgules)</Label>
              <Input
                id="goals"
                value={formData.goals}
                onChange={(e) =>
                  setFormData({ ...formData, goals: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 px-2 sm:px-6 pb-4 sm:pb-6">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSubmit}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

