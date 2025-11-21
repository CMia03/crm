"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  getStudents,
  getStudentProgress,
  getOnlineCourses,
  getQuizAttempts,
  getCertifications,
  createStudent,
  updateStudent,
  deleteStudent,
} from "@/lib/data"
import type { Student, StudentProgress as StudentProgressType } from "@/lib/types"
import { Plus, Edit, Trash2, User, BookOpen, TrendingUp, Award, Clock } from "lucide-react"
import { SearchInput } from "@/components/ui/search-input"

export default function StudentsTrackingPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [progress] = useState(getStudentProgress())
  const [courses] = useState(getOnlineCourses())
  const [quizAttempts] = useState(getQuizAttempts())
  const [certifications] = useState(getCertifications())
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    enrollmentDate: new Date().toISOString().split("T")[0],
    status: "active" as Student["status"],
    program: "",
    level: "",
    address: "",
    birthDate: "",
  })

  useEffect(() => {
    loadStudents()
  }, [])

  useEffect(() => {
    filterStudents()
  }, [searchQuery, students])

  const loadStudents = () => {
    setStudents(getStudents())
  }

  const filterStudents = () => {
    if (!searchQuery.trim()) {
      setFilteredStudents(students)
      return
    }
    const query = searchQuery.toLowerCase()
    const filtered = students.filter((s) =>
      s.firstName.toLowerCase().includes(query) ||
      s.lastName.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query)
    )
    setFilteredStudents(filtered)
  }

  const handleOpenDialog = (student?: Student) => {
    if (student) {
      setEditingStudent(student)
      setFormData({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone,
        enrollmentDate: student.enrollmentDate,
        status: student.status,
        program: student.program || "",
        level: student.level || "",
        address: student.address || "",
        birthDate: student.birthDate || "",
      })
    } else {
      setEditingStudent(null)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        enrollmentDate: new Date().toISOString().split("T")[0],
        status: "active",
        program: "",
        level: "",
        address: "",
        birthDate: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    const studentData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      enrollmentDate: formData.enrollmentDate,
      status: formData.status,
      program: formData.program || undefined,
      level: formData.level || undefined,
      address: formData.address || undefined,
      birthDate: formData.birthDate || undefined,
    }

    if (editingStudent) {
      updateStudent(editingStudent.id, studentData)
    } else {
      createStudent(studentData)
    }

    setIsDialogOpen(false)
    loadStudents()
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) {
      deleteStudent(id)
      loadStudents()
    }
  }

  const getStudentProgressData = (studentId: string): StudentProgressType[] => {
    return progress.filter((p) => p.studentId === studentId)
  }

  const getStudentStats = (studentId: string) => {
    const studentProgress = getStudentProgressData(studentId)
    const totalCourses = studentProgress.length
    const completedCourses = studentProgress.filter((p) => p.status === "completed").length
    const totalQuizAttempts = quizAttempts.filter((a) => a.studentId === studentId).length
    const totalCertificates = certifications
      .flatMap((c) => c.issuedCertificates)
      .filter((cert) => cert.studentId === studentId && cert.status === "active").length

    return {
      totalCourses,
      completedCourses,
      totalQuizAttempts,
      totalCertificates,
    }
  }

  const getStatusLabel = (status: Student["status"]) => {
    const labels: Record<Student["status"], string> = {
      active: "Actif",
      inactive: "Inactif",
      graduated: "Diplômé",
      suspended: "Suspendu",
    }
    return labels[status] || status
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
            Suivi des étudiants
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Gestion et suivi des étudiants
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Nouvel étudiant
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-green-50/50 dark:from-slate-700/50 dark:to-slate-800/50 border-b-2 border-blue-100 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-lg sm:text-xl">Liste des étudiants</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {filteredStudents.length} étudiant{filteredStudents.length > 1 ? "s" : ""} sur {students.length} au total
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4">
            <SearchInput
              placeholder="Rechercher un étudiant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
            />
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Étudiant</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Programme</TableHead>
                  <TableHead>Inscription</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Cours</TableHead>
                  <TableHead>Certificats</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      Aucun étudiant trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => {
                    const stats = getStudentStats(student.id)
                    return (
                      <TableRow key={student.id} className="hover:bg-blue-50/50 dark:hover:bg-slate-700/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            {student.firstName} {student.lastName}
                          </div>
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.program || "N/A"}</TableCell>
                        <TableCell>
                          {new Date(student.enrollmentDate).toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              student.status === "active"
                                ? "success"
                                : student.status === "graduated"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {getStatusLabel(student.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            {stats.completedCourses}/{stats.totalCourses}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            {stats.totalCertificates}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleOpenDialog(student)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDelete(student.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Détails du progrès par étudiant */}
      {filteredStudents.map((student) => {
        const studentProgressData = getStudentProgressData(student.id)
        if (studentProgressData.length === 0) return null

        return (
          <Card key={student.id} className="border-2 border-blue-100 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-base">
                Progrès - {student.firstName} {student.lastName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {studentProgressData.map((prog) => {
                  const course = courses.find((c) => c.id === prog.courseId)
                  if (!course) return null

                  return (
                    <div key={prog.id} className="p-4 rounded-lg bg-blue-50/50 dark:bg-slate-700/50 border border-blue-100 dark:border-slate-700">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{course.title}</h4>
                          <p className="text-sm text-muted-foreground">{course.category}</p>
                        </div>
                        <Badge
                          variant={
                            prog.status === "completed"
                              ? "success"
                              : prog.status === "in-progress"
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {prog.status === "completed"
                            ? "Terminé"
                            : prog.status === "in-progress"
                            ? "En cours"
                            : "Inscrit"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium">{prog.progress}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {Math.floor(prog.timeSpent / 60)}h {prog.timeSpent % 60}min
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm text-muted-foreground">
                            {prog.completedModules.length}/{course.modules.length} modules
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingStudent ? "Modifier l'étudiant" : "Nouvel étudiant"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 px-2 sm:px-6 py-4 sm:py-6 bg-white dark:bg-slate-800">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="enrollmentDate">Date d'inscription</Label>
                <Input
                  id="enrollmentDate"
                  type="date"
                  value={formData.enrollmentDate}
                  onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input dark:border-slate-600 bg-transparent dark:bg-slate-700 px-3 py-1 text-sm text-foreground"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Student["status"] })}
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="graduated">Diplômé</option>
                  <option value="suspended">Suspendu</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="program">Programme</Label>
                <Input
                  id="program"
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  placeholder="Optionnel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Niveau</Label>
                <Input
                  id="level"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  placeholder="Optionnel"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} className="bg-gradient-to-r from-blue-600 to-green-600">
              {editingStudent ? "Modifier" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

