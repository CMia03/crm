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
  getRecruitments,
  getPositions,
  getDepartments,
  createRecruitment,
  updateRecruitment,
} from "@/lib/data"
import type { Recruitment, Applicant } from "@/lib/types"
import { Plus, Edit, UserPlus, Users, Check, X } from "lucide-react"

export default function RecruitmentsPage() {
  const [recruitments, setRecruitments] = useState<Recruitment[]>([])
  const [positions, setPositions] = useState(getPositions())
  const [departments, setDepartments] = useState(getDepartments())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isApplicantDialogOpen, setIsApplicantDialogOpen] = useState(false)
  const [editingRecruitment, setEditingRecruitment] = useState<Recruitment | null>(null)
  const [selectedRecruitment, setSelectedRecruitment] = useState<Recruitment | null>(null)
  const [formData, setFormData] = useState({
    positionId: "",
    departmentId: "",
    postedDate: "",
    deadline: "",
    status: "open" as Recruitment["status"],
  })
  const [applicantData, setApplicantData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: "",
    notes: "",
  })

  useEffect(() => {
    loadRecruitments()
  }, [])

  const loadRecruitments = () => {
    setRecruitments(getRecruitments())
  }

  const handleOpenDialog = (recruitment?: Recruitment) => {
    if (recruitment) {
      setEditingRecruitment(recruitment)
      setFormData({
        positionId: recruitment.positionId,
        departmentId: recruitment.departmentId,
        postedDate: recruitment.postedDate,
        deadline: recruitment.deadline,
        status: recruitment.status,
      })
    } else {
      setEditingRecruitment(null)
      setFormData({
        positionId: "",
        departmentId: "",
        postedDate: new Date().toISOString().split("T")[0],
        deadline: "",
        status: "open",
      })
    }
    setIsDialogOpen(true)
  }

  const handleOpenApplicantDialog = (recruitment: Recruitment) => {
    setSelectedRecruitment(recruitment)
    setApplicantData({
      name: "",
      email: "",
      phone: "",
      resume: "",
      notes: "",
    })
    setIsApplicantDialogOpen(true)
  }

  const handleSubmit = () => {
    const recruitmentData = {
      positionId: formData.positionId,
      departmentId: formData.departmentId,
      status: formData.status,
      postedDate: formData.postedDate,
      deadline: formData.deadline,
      applicants: editingRecruitment?.applicants || [],
      hiredCandidate: editingRecruitment?.hiredCandidate || null,
    }

    if (editingRecruitment) {
      updateRecruitment(editingRecruitment.id, recruitmentData)
    } else {
      createRecruitment(recruitmentData)
    }

    setIsDialogOpen(false)
    loadRecruitments()
  }

  const handleAddApplicant = () => {
    if (!selectedRecruitment) return

    const newApplicant: Applicant = {
      id: String((selectedRecruitment.applicants.length || 0) + 1),
      name: applicantData.name,
      email: applicantData.email,
      phone: applicantData.phone,
      resume: applicantData.resume,
      status: "pending",
      appliedDate: new Date().toISOString().split("T")[0],
      notes: applicantData.notes,
    }

    const updatedApplicants = [...selectedRecruitment.applicants, newApplicant]
    updateRecruitment(selectedRecruitment.id, {
      applicants: updatedApplicants,
    })

    setIsApplicantDialogOpen(false)
    loadRecruitments()
  }

  const handleUpdateApplicantStatus = (
    recruitmentId: string,
    applicantId: string,
    status: Applicant["status"]
  ) => {
    const recruitment = recruitments.find((r) => r.id === recruitmentId)
    if (!recruitment) return

    const updatedApplicants = recruitment.applicants.map((a) =>
      a.id === applicantId ? { ...a, status } : a
    )

    updateRecruitment(recruitmentId, {
      applicants: updatedApplicants,
      hiredCandidate: status === "hired" ? applicantId : recruitment.hiredCandidate,
      status: status === "hired" ? "closed" : recruitment.status,
    })

    loadRecruitments()
  }

  const getPositionTitle = (id: string) => {
    return positions.find((p) => p.id === id)?.title || "N/A"
  }

  const getDepartmentName = (id: string) => {
    return departments.find((d) => d.id === id)?.name || "N/A"
  }

  const getStatusLabel = (status: Recruitment["status"]) => {
    const labels: Record<Recruitment["status"], string> = {
      open: "Ouvert",
      closed: "Fermé",
      cancelled: "Annulé",
    }
    return labels[status] || status
  }

  const getApplicantStatusLabel = (status: Applicant["status"]) => {
    const labels: Record<Applicant["status"], string> = {
      pending: "En attente",
      interview: "Entretien",
      hired: "Embauché",
      rejected: "Refusé",
    }
    return labels[status] || status
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Recrutements
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Gestion des processus de recrutement
          </p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau recrutement
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-green-50/50 border-b-2 border-blue-100">
          <div>
            <CardTitle className="text-lg sm:text-xl">Liste des recrutements</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {recruitments.length} recrutement{recruitments.length > 1 ? "s" : ""} au total
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="hidden lg:block overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Poste</TableHead>
                <TableHead>Département</TableHead>
                <TableHead>Date de publication</TableHead>
                <TableHead>Date limite</TableHead>
                <TableHead>Candidats</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
              <TableBody>
                {recruitments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      Aucun recrutement trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  recruitments.map((recruitment) => (
                    <TableRow key={recruitment.id} className="hover:bg-blue-50/50 transition-colors">
                      <TableCell className="font-medium">
                        {getPositionTitle(recruitment.positionId)}
                      </TableCell>
                      <TableCell>{getDepartmentName(recruitment.departmentId)}</TableCell>
                      <TableCell>
                        {new Date(recruitment.postedDate).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>
                        {new Date(recruitment.deadline).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {recruitment.applicants.length} candidat
                          {recruitment.applicants.length > 1 ? "s" : ""}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            recruitment.status === "open"
                              ? "success"
                              : recruitment.status === "closed"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {getStatusLabel(recruitment.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-blue-100"
                            onClick={() => handleOpenApplicantDialog(recruitment)}
                            title="Ajouter un candidat"
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-blue-100"
                            onClick={() => handleOpenDialog(recruitment)}
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
          
          {/* Mobile/Tablet View - Cards */}
          <div className="block lg:hidden space-y-3">
            {recruitments.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Aucun recrutement trouvé
              </div>
            ) : (
              recruitments.map((recruitment) => (
                <Card key={recruitment.id} className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-base text-foreground mb-1">
                          {getPositionTitle(recruitment.positionId)}
                        </h3>
                        <p className="text-sm text-muted-foreground">{getDepartmentName(recruitment.departmentId)}</p>
                      </div>
                      <Badge
                        variant={
                          recruitment.status === "open"
                            ? "success"
                            : recruitment.status === "closed"
                            ? "default"
                            : "destructive"
                        }
                        className="text-xs"
                      >
                        {getStatusLabel(recruitment.status)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-blue-100">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Date de publication</p>
                        <p className="text-sm font-medium">
                          {new Date(recruitment.postedDate).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Date limite</p>
                        <p className="text-sm font-medium">
                          {new Date(recruitment.deadline).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-muted-foreground mb-1">Candidats</p>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <p className="text-sm font-bold text-blue-600">
                            {recruitment.applicants.length} candidat{recruitment.applicants.length > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-blue-100">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleOpenApplicantDialog(recruitment)}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Ajouter candidat
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleOpenDialog(recruitment)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {recruitments.map((recruitment) => (
        <Card key={recruitment.id} className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50/50 to-green-50/50 border-b-2 border-blue-100">
            <CardTitle className="text-lg sm:text-xl">
              Candidats - {getPositionTitle(recruitment.positionId)}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {recruitment.applicants.length} candidat
              {recruitment.applicants.length > 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {recruitment.applicants.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Aucun candidat</p>
            ) : (
              <>
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Date de candidature</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recruitment.applicants.map((applicant) => (
                    <TableRow key={applicant.id}>
                      <TableCell className="font-medium">{applicant.name}</TableCell>
                      <TableCell>{applicant.email}</TableCell>
                      <TableCell>{applicant.phone}</TableCell>
                      <TableCell>
                        {new Date(applicant.appliedDate).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            applicant.status === "hired"
                              ? "success"
                              : applicant.status === "rejected"
                              ? "destructive"
                              : applicant.status === "interview"
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {getApplicantStatusLabel(applicant.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {applicant.status !== "hired" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleUpdateApplicantStatus(
                                  recruitment.id,
                                  applicant.id,
                                  "interview"
                                )
                              }
                              title="Planifier un entretien"
                            >
                              <Check className="h-4 w-4 text-blue-600" />
                            </Button>
                          )}
                          {applicant.status === "interview" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleUpdateApplicantStatus(
                                    recruitment.id,
                                    applicant.id,
                                    "hired"
                                  )
                                }
                                title="Embaucher"
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleUpdateApplicantStatus(
                                    recruitment.id,
                                    applicant.id,
                                    "rejected"
                                  )
                                }
                                title="Refuser"
                              >
                                <X className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
              
              {/* Mobile View - Cards for Applicants */}
              <div className="block lg:hidden space-y-3">
                {recruitment.applicants.map((applicant) => (
                  <Card key={applicant.id} className="border-2 border-blue-100">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-foreground mb-1">{applicant.name}</h4>
                          <p className="text-xs text-muted-foreground">{applicant.email}</p>
                        </div>
                        <Badge
                          variant={
                            applicant.status === "hired"
                              ? "success"
                              : applicant.status === "rejected"
                              ? "destructive"
                              : applicant.status === "interview"
                              ? "warning"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {getApplicantStatusLabel(applicant.status)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-blue-100">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Téléphone</p>
                          <p className="text-xs font-medium">{applicant.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Date</p>
                          <p className="text-xs font-medium">
                            {new Date(applicant.appliedDate).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>
                      {applicant.status !== "hired" && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-blue-100">
                          {applicant.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs"
                              onClick={() =>
                                handleUpdateApplicantStatus(
                                  recruitment.id,
                                  applicant.id,
                                  "interview"
                                )
                              }
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Entretien
                            </Button>
                          )}
                          {applicant.status === "interview" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 text-xs text-green-600 border-green-200"
                                onClick={() =>
                                  handleUpdateApplicantStatus(
                                    recruitment.id,
                                    applicant.id,
                                    "hired"
                                  )
                                }
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Embaucher
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 text-xs text-red-600 border-red-200"
                                onClick={() =>
                                  handleUpdateApplicantStatus(
                                    recruitment.id,
                                    applicant.id,
                                    "rejected"
                                  )
                                }
                              >
                                <X className="h-3 w-3 mr-1" />
                                Refuser
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">
              {editingRecruitment ? "Modifier le recrutement" : "Nouveau recrutement"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {editingRecruitment
                ? "Modifiez les informations du recrutement"
                : "Remplissez les informations pour créer un nouveau recrutement"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:gap-6 px-2 sm:px-6 py-4 sm:py-6 bg-white">
            <div className="space-y-2">
              <Label htmlFor="positionId">Poste</Label>
              <select
                id="positionId"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.positionId}
                onChange={(e) =>
                  setFormData({ ...formData, positionId: e.target.value })
                }
              >
                <option value="">Sélectionner un poste</option>
                {positions.map((pos) => (
                  <option key={pos.id} value={pos.id}>
                    {pos.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="departmentId">Département</Label>
              <select
                id="departmentId"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.departmentId}
                onChange={(e) =>
                  setFormData({ ...formData, departmentId: e.target.value })
                }
              >
                <option value="">Sélectionner un département</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postedDate">Date de publication</Label>
                <Input
                  id="postedDate"
                  type="date"
                  value={formData.postedDate}
                  onChange={(e) =>
                    setFormData({ ...formData, postedDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Date limite</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <select
                id="status"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as Recruitment["status"],
                  })
                }
              >
                <option value="open">Ouvert</option>
                <option value="closed">Fermé</option>
                <option value="cancelled">Annulé</option>
              </select>
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
              {editingRecruitment ? "Modifier" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isApplicantDialogOpen} onOpenChange={setIsApplicantDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">Ajouter un candidat</DialogTitle>
            <DialogDescription className="text-sm">
              Remplissez les informations du candidat
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:gap-6 px-2 sm:px-6 py-4 sm:py-6 bg-white">
            <div className="space-y-2">
              <Label htmlFor="applicantName" className="text-sm font-semibold">Nom complet</Label>
              <Input
                id="applicantName"
                value={applicantData.name}
                onChange={(e) =>
                  setApplicantData({ ...applicantData, name: e.target.value })
                }
                className="h-10"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="applicantEmail">Email</Label>
                <Input
                  id="applicantEmail"
                  type="email"
                  value={applicantData.email}
                  onChange={(e) =>
                    setApplicantData({ ...applicantData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="applicantPhone">Téléphone</Label>
                <Input
                  id="applicantPhone"
                  value={applicantData.phone}
                  onChange={(e) =>
                    setApplicantData({ ...applicantData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicantResume">CV (nom du fichier)</Label>
              <Input
                id="applicantResume"
                value={applicantData.resume}
                onChange={(e) =>
                  setApplicantData({ ...applicantData, resume: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicantNotes">Notes</Label>
              <Input
                id="applicantNotes"
                value={applicantData.notes}
                onChange={(e) =>
                  setApplicantData({ ...applicantData, notes: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 px-2 sm:px-6 pb-4 sm:pb-6">
            <Button 
              variant="outline" 
              onClick={() => setIsApplicantDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleAddApplicant}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

