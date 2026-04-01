"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getResumes, getPositions, createResume, updateResume, deleteResume, getResumesByPosition } from "@/lib/data"
import type { Resume } from "@/lib/types"
import { Plus, Edit, Trash2, FileText, Mail, Phone, Briefcase, User, X } from "lucide-react"
import { SearchInput } from "@/components/ui/search-input"

export default function CVsPage() {
  const [resumes, setResumes] = useState<Resume[]>(getResumes())
  const [filteredResumes, setFilteredResumes] = useState<Resume[]>(getResumes())
  const [positions] = useState(getPositions())
  const [selectedPosition, setSelectedPosition] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [editingResume, setEditingResume] = useState<Resume | null>(null)
  const [viewingResume, setViewingResume] = useState<Resume | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    positionId: "",
    fileContent: "",
    status: "new" as Resume["status"],
    notes: "",
  })

  useEffect(() => {
    loadResumes()
  }, [])

  useEffect(() => {
    filterResumes()
  }, [searchQuery, selectedPosition, resumes])

  const loadResumes = () => {
    const loadedResumes = getResumes()
    setResumes(loadedResumes)
    setFilteredResumes(loadedResumes)
  }

  const filterResumes = () => {
    let filtered = resumes

    // Filtrer par poste
    if (selectedPosition) {
      filtered = filtered.filter((r) => r.positionId === selectedPosition)
    }

    // Filtrer par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (r) =>
          r.firstName.toLowerCase().includes(query) ||
          r.lastName.toLowerCase().includes(query) ||
          r.email.toLowerCase().includes(query) ||
          r.positionTitle?.toLowerCase().includes(query)
      )
    }

    setFilteredResumes(filtered)
  }

  const handleOpenDialog = (resume?: Resume) => {
    if (resume) {
      setEditingResume(resume)
      setFormData({
        firstName: resume.firstName,
        lastName: resume.lastName,
        email: resume.email,
        phone: resume.phone,
        positionId: resume.positionId,
        fileContent: resume.fileContent || "",
        status: resume.status,
        notes: resume.notes || "",
      })
    } else {
      setEditingResume(null)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        positionId: "",
        fileContent: "",
        status: "new",
        notes: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleViewResume = (resume: Resume) => {
    setViewingResume(resume)
    setIsViewDialogOpen(true)
  }

  const handleSubmit = () => {
    const position = positions.find((p) => p.id === formData.positionId)
    const resumeData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      positionId: formData.positionId,
      positionTitle: position?.title,
      fileContent: formData.fileContent,
      experience: editingResume?.experience || [],
      education: editingResume?.education || [],
      skills: editingResume?.skills || [],
      languages: editingResume?.languages || [],
      status: formData.status,
      notes: formData.notes || undefined,
    }

    if (editingResume) {
      updateResume(editingResume.id, resumeData)
    } else {
      createResume(resumeData)
    }

    setIsDialogOpen(false)
    loadResumes()
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce CV ?")) {
      deleteResume(id)
      loadResumes()
    }
  }

  const getPositionTitle = (positionId: string) => {
    return positions.find((p) => p.id === positionId)?.title || "N/A"
  }

  const getStatusLabel = (status: Resume["status"]) => {
    const labels: Record<Resume["status"], string> = {
      new: "Nouveau",
      reviewed: "Consulté",
      shortlisted: "Sélectionné",
      rejected: "Rejeté",
    }
    return labels[status] || status
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
            Gestion des CV
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Ajouter et consulter les CV par poste
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un CV
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-green-50/50 dark:from-slate-700/50 dark:to-slate-800/50 border-b-2 border-blue-100 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-lg sm:text-xl">Liste des CV</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {filteredResumes.length} CV{filteredResumes.length > 1 ? "s" : ""} sur {resumes.length} au total
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 space-y-4">
            <SearchInput
              placeholder="Rechercher un CV..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
            />
            <div className="flex items-center gap-2">
              <Label htmlFor="positionFilter" className="text-sm font-medium whitespace-nowrap">
                Filtrer par poste:
              </Label>
              <select
                id="positionFilter"
                className="flex h-10 w-full rounded-md border border-input dark:border-slate-600 bg-transparent dark:bg-slate-700 px-3 py-1 text-sm text-foreground"
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
              >
                <option value="">Tous les postes</option>
                {positions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({getResumesByPosition(p.id).length} CV)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Vue mobile */}
          <div className="lg:hidden space-y-3">
            {filteredResumes.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {resumes.length === 0 ? "Aucun CV disponible" : "Aucun CV trouvé avec ces critères"}
              </div>
            ) : (
              filteredResumes.map((resume) => (
                <Card key={resume.id} className="border-2 border-blue-100 dark:border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 flex-1">
                        <User className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">
                            {resume.firstName} {resume.lastName}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">{getPositionTitle(resume.positionId)}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          resume.status === "shortlisted"
                            ? "success"
                            : resume.status === "rejected"
                            ? "secondary"
                            : resume.status === "reviewed"
                            ? "default"
                            : "outline"
                        }
                        className="ml-2 flex-shrink-0"
                      >
                        {getStatusLabel(resume.status)}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground truncate">{resume.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{resume.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-foreground font-medium">{resume.experience.length} expérience(s)</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-blue-100 dark:border-slate-700">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleViewResume(resume)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Voir
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleOpenDialog(resume)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-red-600 dark:text-red-400"
                        onClick={() => handleDelete(resume.id)}
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
                  <TableHead>Candidat</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Expérience</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResumes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      Aucun CV trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResumes.map((resume) => (
                    <TableRow key={resume.id} className="hover:bg-blue-50/50 dark:hover:bg-slate-700/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          {resume.firstName} {resume.lastName}
                        </div>
                      </TableCell>
                      <TableCell>{getPositionTitle(resume.positionId)}</TableCell>
                      <TableCell>{resume.email}</TableCell>
                      <TableCell>{resume.phone}</TableCell>
                      <TableCell>{resume.experience.length} expérience(s)</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            resume.status === "shortlisted"
                              ? "success"
                              : resume.status === "rejected"
                              ? "secondary"
                              : resume.status === "reviewed"
                              ? "default"
                              : "outline"
                          }
                        >
                          {getStatusLabel(resume.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleViewResume(resume)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleOpenDialog(resume)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDelete(resume.id)}
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

      {/* Dialog pour créer/modifier */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingResume ? "Modifier le CV" : "Ajouter un CV"}</DialogTitle>
            <DialogDescription>
              {editingResume ? "Modifiez les informations du CV" : "Ajoutez un nouveau CV au système"}
            </DialogDescription>
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

            <div className="space-y-2">
              <Label htmlFor="positionId">Poste</Label>
              <select
                id="positionId"
                className="flex h-10 w-full rounded-md border border-input dark:border-slate-600 bg-transparent dark:bg-slate-700 px-3 py-1 text-sm text-foreground"
                value={formData.positionId}
                onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
              >
                <option value="">Sélectionner un poste</option>
                {positions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileContent">Contenu du CV (texte)</Label>
              <textarea
                id="fileContent"
                className="flex min-h-[100px] w-full rounded-md border border-input dark:border-slate-600 bg-transparent dark:bg-slate-700 px-3 py-2 text-sm text-foreground"
                value={formData.fileContent}
                onChange={(e) => setFormData({ ...formData, fileContent: e.target.value })}
                placeholder="Collez ici le contenu du CV ou une description..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <select
                  id="status"
                  className="flex h-10 w-full rounded-md border border-input dark:border-slate-600 bg-transparent dark:bg-slate-700 px-3 py-1 text-sm text-foreground"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Resume["status"] })}
                >
                  <option value="new">Nouveau</option>
                  <option value="reviewed">Consulté</option>
                  <option value="shortlisted">Sélectionné</option>
                  <option value="rejected">Rejeté</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                className="flex min-h-[80px] w-full rounded-md border border-input dark:border-slate-600 bg-transparent dark:bg-slate-700 px-3 py-2 text-sm text-foreground"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notes internes sur ce candidat..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} className="bg-[#0a4f7a] hover:bg-[#084060]">
              {editingResume ? "Modifier" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour voir le CV */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>CV - {viewingResume?.firstName} {viewingResume?.lastName}</DialogTitle>
            <DialogDescription>
              Poste: {viewingResume ? getPositionTitle(viewingResume.positionId) : ""}
            </DialogDescription>
          </DialogHeader>

          {viewingResume && (
            <div className="space-y-6 px-2 sm:px-6 py-4 sm:py-6 bg-white dark:bg-slate-800">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Email</p>
                  <p className="text-sm text-foreground">{viewingResume.email}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Téléphone</p>
                  <p className="text-sm text-foreground">{viewingResume.phone}</p>
                </div>
              </div>

              {viewingResume.fileContent && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Contenu du CV</p>
                  <div className="p-4 rounded-lg bg-blue-50/50 dark:bg-slate-700/50 border border-blue-100 dark:border-slate-700">
                    <p className="text-sm text-foreground whitespace-pre-wrap">{viewingResume.fileContent}</p>
                  </div>
                </div>
              )}

              {viewingResume.experience.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Expérience</p>
                  <div className="space-y-3">
                    {viewingResume.experience.map((exp, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-blue-50/50 dark:bg-slate-700/50 border border-blue-100 dark:border-slate-700">
                        <p className="text-sm font-semibold text-foreground">{exp.position} - {exp.company}</p>
                        <p className="text-xs text-muted-foreground">
                          {exp.startDate} - {exp.endDate || "Présent"}
                        </p>
                        <p className="text-xs text-foreground mt-1">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {viewingResume.education.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Formation</p>
                  <div className="space-y-2">
                    {viewingResume.education.map((edu, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-green-50/50 dark:bg-slate-700/50 border border-green-100 dark:border-slate-700">
                        <p className="text-sm font-semibold text-foreground">{edu.degree} - {edu.field}</p>
                        <p className="text-xs text-muted-foreground">{edu.institution}</p>
                        <p className="text-xs text-muted-foreground">
                          {edu.startDate} - {edu.endDate || "Présent"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {viewingResume.skills.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Compétences</p>
                  <div className="flex flex-wrap gap-2">
                    {viewingResume.skills.map((skill, idx) => (
                      <Badge key={idx} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {viewingResume.notes && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">Notes</p>
                  <div className="p-3 rounded-lg bg-yellow-50/50 dark:bg-slate-700/50 border border-yellow-100 dark:border-slate-700">
                    <p className="text-sm text-foreground">{viewingResume.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

