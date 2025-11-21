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
  getOnlineCourses,
  createOnlineCourse,
  updateOnlineCourse,
  deleteOnlineCourse,
} from "@/lib/data"
import type { OnlineCourse } from "@/lib/types"
import { Plus, Edit, Trash2, BookOpen, Users, Clock, DollarSign } from "lucide-react"
import { SearchInput } from "@/components/ui/search-input"

export default function OnlineCoursesPage() {
  const [courses, setCourses] = useState<OnlineCourse[]>([])
  const [filteredCourses, setFilteredCourses] = useState<OnlineCourse[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<OnlineCourse | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    category: "",
    duration: "0",
    level: "beginner" as OnlineCourse["level"],
    price: "0",
    status: "draft" as OnlineCourse["status"],
    requirements: "",
    learningObjectives: "",
  })

  useEffect(() => {
    loadCourses()
  }, [])

  useEffect(() => {
    filterCourses()
  }, [searchQuery, courses])

  const loadCourses = () => {
    setCourses(getOnlineCourses())
  }

  const filterCourses = () => {
    if (!searchQuery.trim()) {
      setFilteredCourses(courses)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      course.instructor.toLowerCase().includes(query) ||
      course.category.toLowerCase().includes(query)
    )
    setFilteredCourses(filtered)
  }

  const handleOpenDialog = (course?: OnlineCourse) => {
    if (course) {
      setEditingCourse(course)
      setFormData({
        title: course.title,
        description: course.description,
        instructor: course.instructor,
        category: course.category,
        duration: course.duration.toString(),
        level: course.level,
        price: course.price.toString(),
        status: course.status,
        requirements: course.requirements?.join(", ") || "",
        learningObjectives: course.learningObjectives?.join(", ") || "",
      })
    } else {
      setEditingCourse(null)
      setFormData({
        title: "",
        description: "",
        instructor: "",
        category: "",
        duration: "0",
        level: "beginner",
        price: "0",
        status: "draft",
        requirements: "",
        learningObjectives: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    const courseData = {
      title: formData.title,
      description: formData.description,
      instructor: formData.instructor,
      category: formData.category,
      duration: Number(formData.duration),
      level: formData.level,
      price: Number(formData.price),
      status: formData.status,
      enrolledStudents: editingCourse?.enrolledStudents || [],
      modules: editingCourse?.modules || [],
      requirements: formData.requirements
        .split(",")
        .map((r) => r.trim())
        .filter((r) => r.length > 0),
      learningObjectives: formData.learningObjectives
        .split(",")
        .map((o) => o.trim())
        .filter((o) => o.length > 0),
    }

    if (editingCourse) {
      updateOnlineCourse(editingCourse.id, courseData)
    } else {
      createOnlineCourse(courseData)
    }

    setIsDialogOpen(false)
    loadCourses()
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) {
      deleteOnlineCourse(id)
      loadCourses()
    }
  }

  const getStatusLabel = (status: OnlineCourse["status"]) => {
    const labels: Record<OnlineCourse["status"], string> = {
      draft: "Brouillon",
      published: "Publié",
      archived: "Archivé",
    }
    return labels[status] || status
  }

  const getLevelLabel = (level: OnlineCourse["level"]) => {
    const labels: Record<OnlineCourse["level"], string> = {
      beginner: "Débutant",
      intermediate: "Intermédiaire",
      advanced: "Avancé",
    }
    return labels[level] || level
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
            Cours en ligne
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Gestion des cours en ligne
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau cours
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-green-50/50 dark:from-slate-700/50 dark:to-slate-800/50 border-b-2 border-blue-100 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-lg sm:text-xl">Liste des cours</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {filteredCourses.length} cours sur {courses.length} au total
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4">
            <SearchInput
              placeholder="Rechercher par titre, description, instructeur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
            />
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Instructeur</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Niveau</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Étudiants</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      Aucun cours trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map((course) => (
                    <TableRow key={course.id} className="hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          {course.title}
                        </div>
                      </TableCell>
                      <TableCell>{course.instructor}</TableCell>
                      <TableCell>{course.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {course.duration}h
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getLevelLabel(course.level)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                          {course.price}€
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          {course.enrolledStudents.length}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            course.status === "published"
                              ? "success"
                              : course.status === "archived"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {getStatusLabel(course.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-blue-100 dark:hover:bg-slate-700"
                            onClick={() => handleOpenDialog(course)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/30"
                            onClick={() => handleDelete(course.id)}
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

          {/* Mobile View */}
          <div className="block lg:hidden space-y-3">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="border-2 border-blue-100 dark:border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-base text-foreground mb-1">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">{course.instructor}</p>
                    </div>
                    <Badge
                      variant={
                        course.status === "published"
                          ? "success"
                          : course.status === "archived"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {getStatusLabel(course.status)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-blue-100 dark:border-slate-700">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Catégorie</p>
                      <p className="text-sm font-medium">{course.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Niveau</p>
                      <Badge variant="outline" className="text-xs">{getLevelLabel(course.level)}</Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Durée</p>
                      <p className="text-sm font-medium">{course.duration}h</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Prix</p>
                      <p className="text-sm font-medium">{course.price}€</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground mb-1">Étudiants inscrits</p>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <p className="text-sm font-medium">{course.enrolledStudents.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-blue-100 dark:border-slate-700">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenDialog(course)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 dark:text-red-400"
                      onClick={() => handleDelete(course.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">
              {editingCourse ? "Modifier le cours" : "Nouveau cours"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {editingCourse
                ? "Modifiez les informations du cours"
                : "Remplissez les informations pour créer un nouveau cours"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:gap-6 px-2 sm:px-6 py-4 sm:py-6 bg-white dark:bg-slate-800">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du cours</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Introduction au Développement Web"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description du cours..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructeur</Label>
                <Input
                  id="instructor"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  placeholder="Nom de l'instructeur"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Développement, Marketing..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Durée (heures)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Niveau</Label>
                <select
                  id="level"
                  className="flex h-10 w-full rounded-md border border-input dark:border-slate-600 bg-transparent dark:bg-slate-700 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({ ...formData, level: e.target.value as OnlineCourse["level"] })
                  }
                >
                  <option value="beginner">Débutant</option>
                  <option value="intermediate">Intermédiaire</option>
                  <option value="advanced">Avancé</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Prix (€)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <select
                id="status"
                className="flex h-10 w-full rounded-md border border-input dark:border-slate-600 bg-transparent dark:bg-slate-700 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as OnlineCourse["status"] })
                }
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="archived">Archivé</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Prérequis (séparés par des virgules)</Label>
              <Input
                id="requirements"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="Aucun prérequis, Python de base..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="learningObjectives">Objectifs d'apprentissage (séparés par des virgules)</Label>
              <Input
                id="learningObjectives"
                value={formData.learningObjectives}
                onChange={(e) => setFormData({ ...formData, learningObjectives: e.target.value })}
                placeholder="Comprendre HTML, Maîtriser CSS..."
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
              {editingCourse ? "Modifier" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

