"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCertifications, getOnlineCourses, getStudents, createCertification, updateCertification, issueCertificate } from "@/lib/data"
import type { Certification } from "@/lib/types"
import { Plus, Edit, Award, Calendar, User } from "lucide-react"
import { SearchInput } from "@/components/ui/search-input"

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [filteredCertifications, setFilteredCertifications] = useState<Certification[]>([])
  const [courses] = useState(getOnlineCourses())
  const [students] = useState(getStudents())
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false)
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null)
  const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
    validityPeriod: "",
    issuer: "",
    status: "active" as Certification["status"],
    requirements: "",
  })
  const [issueData, setIssueData] = useState({
    studentId: "",
    issuedBy: "",
  })

  useEffect(() => {
    loadCertifications()
  }, [])

  useEffect(() => {
    filterCertifications()
  }, [searchQuery, certifications])

  const loadCertifications = () => {
    setCertifications(getCertifications())
  }

  const filterCertifications = () => {
    if (!searchQuery.trim()) {
      setFilteredCertifications(certifications)
      return
    }
    const query = searchQuery.toLowerCase()
    const filtered = certifications.filter((c) =>
      c.title.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query)
    )
    setFilteredCertifications(filtered)
  }

  const handleOpenDialog = (certification?: Certification) => {
    if (certification) {
      setEditingCertification(certification)
      setFormData({
        title: certification.title,
        description: certification.description,
        courseId: certification.courseId || "",
        validityPeriod: certification.validityPeriod?.toString() || "",
        issuer: certification.issuer,
        status: certification.status,
        requirements: certification.requirements.join(", "),
      })
    } else {
      setEditingCertification(null)
      setFormData({
        title: "",
        description: "",
        courseId: "",
        validityPeriod: "",
        issuer: "CRM Academy",
        status: "active",
        requirements: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleOpenIssueDialog = (certification: Certification) => {
    setSelectedCertification(certification)
    setIssueData({
      studentId: "",
      issuedBy: "",
    })
    setIsIssueDialogOpen(true)
  }

  const handleSubmit = () => {
    const certificationData = {
      title: formData.title,
      description: formData.description,
      courseId: formData.courseId || undefined,
      validityPeriod: formData.validityPeriod ? Number(formData.validityPeriod) : undefined,
      issuer: formData.issuer,
      status: formData.status,
      requirements: formData.requirements
        .split(",")
        .map((r) => r.trim())
        .filter((r) => r.length > 0),
    }

    if (editingCertification) {
      updateCertification(editingCertification.id, certificationData)
    } else {
      createCertification(certificationData)
    }

    setIsDialogOpen(false)
    loadCertifications()
  }

  const handleIssueCertificate = () => {
    if (!selectedCertification) return

    issueCertificate(
      selectedCertification.id,
      issueData.studentId,
      issueData.issuedBy
    )

    setIsIssueDialogOpen(false)
    loadCertifications()
  }

  const getCourseTitle = (courseId?: string) => {
    if (!courseId) return "N/A"
    return courses.find((c) => c.id === courseId)?.title || "N/A"
  }

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId)
    return student ? `${student.firstName} ${student.lastName}` : "N/A"
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
            Certifications
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Gestion des certifications
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle certification
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-green-50/50 dark:from-slate-700/50 dark:to-slate-800/50 border-b-2 border-blue-100 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-lg sm:text-xl">Liste des certifications</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {filteredCertifications.length} certification{filteredCertifications.length > 1 ? "s" : ""} sur {certifications.length} au total
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4">
            <SearchInput
              placeholder="Rechercher une certification..."
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
                  <TableHead>Cours</TableHead>
                  <TableHead>Émetteur</TableHead>
                  <TableHead>Validité</TableHead>
                  <TableHead>Certificats émis</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCertifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      Aucune certification trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCertifications.map((certification) => (
                    <TableRow key={certification.id} className="hover:bg-blue-50/50 dark:hover:bg-slate-700/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                          {certification.title}
                        </div>
                      </TableCell>
                      <TableCell>{getCourseTitle(certification.courseId)}</TableCell>
                      <TableCell>{certification.issuer}</TableCell>
                      <TableCell>
                        {certification.validityPeriod ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {certification.validityPeriod} mois
                          </div>
                        ) : (
                          "Permanente"
                        )}
                      </TableCell>
                      <TableCell>{certification.issuedCertificates.length}</TableCell>
                      <TableCell>
                        <Badge variant={certification.status === "active" ? "success" : "secondary"}>
                          {certification.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleOpenIssueDialog(certification)}
                            title="Émettre un certificat"
                          >
                            <User className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleOpenDialog(certification)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Détails des certificats émis */}
          {filteredCertifications.map((certification) => (
            certification.issuedCertificates.length > 0 && (
              <Card key={certification.id} className="mt-4 border-2 border-blue-100 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-base">Certificats émis - {certification.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {certification.issuedCertificates.map((cert) => (
                      <div key={cert.id} className="flex items-center justify-between p-3 rounded-lg bg-blue-50/50 dark:bg-slate-700/50">
                        <div>
                          <p className="font-medium text-foreground">{getStudentName(cert.studentId)}</p>
                          <p className="text-xs text-muted-foreground">N° {cert.certificateNumber}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Émis le {new Date(cert.issuedDate).toLocaleDateString("fr-FR")}
                          </p>
                          {cert.expiryDate && (
                            <p className="text-xs text-muted-foreground">
                              Expire le {new Date(cert.expiryDate).toLocaleDateString("fr-FR")}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          ))}
        </CardContent>
      </Card>

      {/* Dialog pour créer/modifier */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCertification ? "Modifier" : "Nouvelle certification"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 px-2 sm:px-6 py-4 sm:py-6 bg-white dark:bg-slate-800">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseId">Cours (optionnel)</Label>
                <select
                  id="courseId"
                  className="flex h-10 w-full rounded-md border border-input dark:border-slate-600 bg-transparent dark:bg-slate-700 px-3 py-1 text-sm text-foreground"
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                >
                  <option value="">Aucun</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="validityPeriod">Validité (mois)</Label>
                <Input
                  id="validityPeriod"
                  type="number"
                  value={formData.validityPeriod}
                  onChange={(e) => setFormData({ ...formData, validityPeriod: e.target.value })}
                  placeholder="Optionnel"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuer">Émetteur</Label>
              <Input
                id="issuer"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Conditions (séparées par des virgules)</Label>
              <Input
                id="requirements"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="Compléter le cours, Obtenir 80%..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} className="bg-gradient-to-r from-blue-600 to-green-600">
              {editingCertification ? "Modifier" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour émettre un certificat */}
      <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Émettre un certificat</DialogTitle>
            <DialogDescription>
              Émettez un certificat pour {selectedCertification?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 px-2 sm:px-6 py-4 sm:py-6 bg-white dark:bg-slate-800">
            <div className="space-y-2">
              <Label htmlFor="studentId">Étudiant</Label>
              <select
                id="studentId"
                className="flex h-10 w-full rounded-md border border-input dark:border-slate-600 bg-transparent dark:bg-slate-700 px-3 py-1 text-sm text-foreground"
                value={issueData.studentId}
                onChange={(e) => setIssueData({ ...issueData, studentId: e.target.value })}
              >
                <option value="">Sélectionner un étudiant</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuedBy">Émis par</Label>
              <Input
                id="issuedBy"
                value={issueData.issuedBy}
                onChange={(e) => setIssueData({ ...issueData, issuedBy: e.target.value })}
                placeholder="Nom de l'émetteur"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsIssueDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleIssueCertificate} className="bg-gradient-to-r from-blue-600 to-green-600">
              Émettre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

