"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getQuizzes, getOnlineCourses, createQuiz, updateQuiz, deleteQuiz } from "@/lib/data"
import type { Quiz } from "@/lib/types"
import { Plus, Edit, Trash2, FileText, Clock, Target } from "lucide-react"
import { SearchInput } from "@/components/ui/search-input"

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(getQuizzes())
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>(getQuizzes())
  const [courses] = useState(getOnlineCourses())
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)
  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    description: "",
    passingScore: "70",
    timeLimit: "",
    attemptsAllowed: "3",
    status: "draft" as Quiz["status"],
  })

  useEffect(() => {
    loadQuizzes()
  }, [])

  useEffect(() => {
    if (quizzes.length > 0 || searchQuery.trim()) {
      filterQuizzes()
    }
  }, [searchQuery, quizzes])

  const loadQuizzes = () => {
    const loadedQuizzes = getQuizzes()
    setQuizzes(loadedQuizzes)
    setFilteredQuizzes(loadedQuizzes)
  }

  const filterQuizzes = () => {
    if (!searchQuery.trim()) {
      setFilteredQuizzes(quizzes)
      return
    }
    const query = searchQuery.toLowerCase()
    const filtered = quizzes.filter((q) =>
      q.title.toLowerCase().includes(query) ||
      q.description.toLowerCase().includes(query)
    )
    setFilteredQuizzes(filtered)
  }

  const handleOpenDialog = (quiz?: Quiz) => {
    if (quiz) {
      setEditingQuiz(quiz)
      setFormData({
        courseId: quiz.courseId,
        title: quiz.title,
        description: quiz.description,
        passingScore: quiz.passingScore.toString(),
        timeLimit: quiz.timeLimit?.toString() || "",
        attemptsAllowed: quiz.attemptsAllowed.toString(),
        status: quiz.status,
      })
    } else {
      setEditingQuiz(null)
      setFormData({
        courseId: "",
        title: "",
        description: "",
        passingScore: "70",
        timeLimit: "",
        attemptsAllowed: "3",
        status: "draft",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    const quizData = {
      courseId: formData.courseId,
      title: formData.title,
      description: formData.description,
      questions: editingQuiz?.questions || [],
      passingScore: Number(formData.passingScore),
      timeLimit: formData.timeLimit ? Number(formData.timeLimit) : undefined,
      attemptsAllowed: Number(formData.attemptsAllowed),
      status: formData.status,
    }

    if (editingQuiz) {
      updateQuiz(editingQuiz.id, quizData)
    } else {
      createQuiz(quizData)
    }

    setIsDialogOpen(false)
    loadQuizzes()
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce quiz ?")) {
      deleteQuiz(id)
      loadQuizzes()
    }
  }

  const getCourseTitle = (courseId: string) => {
    return courses.find((c) => c.id === courseId)?.title || "N/A"
  }

  const getStatusLabel = (status: Quiz["status"]) => {
    const labels: Record<Quiz["status"], string> = {
      draft: "Brouillon",
      published: "Publié",
      archived: "Archivé",
    }
    return labels[status] || status
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
            Quiz
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Gestion des quiz et évaluations
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau quiz
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-green-50/50 dark:from-slate-700/50 dark:to-slate-800/50 border-b-2 border-blue-100 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-lg sm:text-xl">Liste des quiz</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {filteredQuizzes.length} quiz sur {quizzes.length} au total
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4">
            <SearchInput
              placeholder="Rechercher un quiz..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
            />
          </div>

          {/* Vue mobile */}
          <div className="lg:hidden space-y-3">
            {filteredQuizzes.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {quizzes.length === 0 ? "Aucun quiz disponible" : "Aucun quiz trouvé avec cette recherche"}
              </div>
            ) : (
              filteredQuizzes.map((quiz) => (
                <Card key={quiz.id} className="border-2 border-blue-100 dark:border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 flex-1">
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{quiz.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{getCourseTitle(quiz.courseId)}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          quiz.status === "published"
                            ? "success"
                            : quiz.status === "archived"
                            ? "secondary"
                            : "outline"
                        }
                        className="ml-2 flex-shrink-0"
                      >
                        {getStatusLabel(quiz.status)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{quiz.questions.length} questions</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-foreground font-medium">{quiz.passingScore}%</span>
                      </div>
                      {quiz.timeLimit && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{quiz.timeLimit}min</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-blue-100 dark:border-slate-700">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleOpenDialog(quiz)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-red-600 dark:text-red-400"
                        onClick={() => handleDelete(quiz.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Vue desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Cours</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Score min</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuizzes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      Aucun quiz trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuizzes.map((quiz) => (
                    <TableRow key={quiz.id} className="hover:bg-blue-50/50 dark:hover:bg-slate-700/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          {quiz.title}
                        </div>
                      </TableCell>
                      <TableCell>{getCourseTitle(quiz.courseId)}</TableCell>
                      <TableCell>{quiz.questions.length}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
                          {quiz.passingScore}%
                        </div>
                      </TableCell>
                      <TableCell>
                        {quiz.timeLimit ? (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {quiz.timeLimit}min
                          </div>
                        ) : (
                          "Illimité"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            quiz.status === "published"
                              ? "success"
                              : quiz.status === "archived"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {getStatusLabel(quiz.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleOpenDialog(quiz)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDelete(quiz.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                          </Button>
                        </div>
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
        <DialogContent className="max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingQuiz ? "Modifier le quiz" : "Nouveau quiz"}</DialogTitle>
            <DialogDescription>
              {editingQuiz ? "Modifiez les informations du quiz" : "Créez un nouveau quiz"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 px-2 sm:px-6 py-4 sm:py-6 bg-white dark:bg-slate-800">
            <div className="space-y-2">
              <Label htmlFor="courseId">Cours</Label>
              <select
                id="courseId"
                className="flex h-10 w-full rounded-md border border-input dark:border-slate-600 bg-transparent dark:bg-slate-700 px-3 py-1 text-sm text-foreground"
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              >
                <option value="">Sélectionner un cours</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="passingScore">Score min (%)</Label>
                <Input
                  id="passingScore"
                  type="number"
                  value={formData.passingScore}
                  onChange={(e) => setFormData({ ...formData, passingScore: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeLimit">Durée (min)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  value={formData.timeLimit}
                  onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
                  placeholder="Optionnel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attemptsAllowed">Tentatives</Label>
                <Input
                  id="attemptsAllowed"
                  type="number"
                  value={formData.attemptsAllowed}
                  onChange={(e) => setFormData({ ...formData, attemptsAllowed: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input dark:border-slate-600 bg-transparent dark:bg-slate-700 px-3 py-1 text-sm text-foreground"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Quiz["status"] })}
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="archived">Archivé</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} className="bg-gradient-to-r from-blue-600 to-green-600">
              {editingQuiz ? "Modifier" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

