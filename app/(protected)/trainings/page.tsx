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
  getTrainings,
  getEmployees,
  createTraining,
  updateTraining,
  deleteTraining,
} from "@/lib/data"
import type { Training } from "@/lib/types"
import { Plus, Edit, Trash2, GraduationCap, Users } from "lucide-react"
import { SearchInput } from "@/components/ui/search-input"

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<Training[]>([])
  const [filteredTrainings, setFilteredTrainings] = useState<Training[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [employees, setEmployees] = useState(getEmployees())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTraining, setEditingTraining] = useState<Training | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    duration: "",
    date: "",
    location: "",
    maxParticipants: "",
    type: "technical" as Training["type"],
    status: "scheduled" as Training["status"],
  })

  const getTrainingTypeLabel = (type: Training["type"]) => {
    const labels: Record<Training["type"], string> = {
      technical: "Technique",
      "soft-skills": "Compétences comportementales",
      management: "Management",
    }
    return labels[type] || type
  }

  const getStatusLabel = (status: Training["status"]) => {
    const labels: Record<Training["status"], string> = {
      scheduled: "Programmée",
      completed: "Terminée",
      cancelled: "Annulée",
    }
    return labels[status] || status
  }

  useEffect(() => {
    loadTrainings()
  }, [])

  useEffect(() => {
    filterTrainings()
  }, [searchQuery, trainings])

  const loadTrainings = () => {
    const allTrainings = getTrainings()
    setTrainings(allTrainings)
    setFilteredTrainings(allTrainings)
  }

  const filterTrainings = () => {
    if (!searchQuery.trim()) {
      setFilteredTrainings(trainings)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = trainings.filter((training) => {
      const title = training.title.toLowerCase()
      const description = training.description.toLowerCase()
      const instructor = training.instructor.toLowerCase()
      const location = training.location.toLowerCase()
      const type = getTrainingTypeLabel(training.type).toLowerCase()
      const status = getStatusLabel(training.status).toLowerCase()
      const duration = training.duration.toString()
      const participants = training.participants.length.toString()
      const maxParticipants = training.maxParticipants.toString()

      return (
        title.includes(query) ||
        description.includes(query) ||
        instructor.includes(query) ||
        location.includes(query) ||
        type.includes(query) ||
        status.includes(query) ||
        duration.includes(query) ||
        participants.includes(query) ||
        maxParticipants.includes(query) ||
        training.date.includes(query)
      )
    })
    setFilteredTrainings(filtered)
  }

  const handleOpenDialog = (training?: Training) => {
    if (training) {
      setEditingTraining(training)
      setFormData({
        title: training.title,
        description: training.description,
        instructor: training.instructor,
        duration: String(training.duration),
        date: training.date,
        location: training.location,
        maxParticipants: String(training.maxParticipants),
        type: training.type,
        status: training.status,
      })
    } else {
      setEditingTraining(null)
      setFormData({
        title: "",
        description: "",
        instructor: "",
        duration: "",
        date: "",
        location: "",
        maxParticipants: "",
        type: "technical",
        status: "scheduled",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    const trainingData = {
      title: formData.title,
      description: formData.description,
      instructor: formData.instructor,
      duration: Number(formData.duration),
      date: formData.date,
      location: formData.location,
      maxParticipants: Number(formData.maxParticipants),
      participants: editingTraining?.participants || [],
      type: formData.type,
      status: formData.status,
    }

    if (editingTraining) {
      updateTraining(editingTraining.id, trainingData)
    } else {
      createTraining(trainingData)
    }

    setIsDialogOpen(false)
    loadTrainings()
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) {
      deleteTraining(id)
      loadTrainings()
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
            Formations
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Gestion des formations et du développement des compétences
          </p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle formation
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-green-50/50 dark:from-slate-700/50 dark:to-slate-800/50 border-b-2 border-blue-100 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-lg sm:text-xl">Liste des formations</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {filteredTrainings.length} formation{filteredTrainings.length > 1 ? "s" : ""} sur {trainings.length} au total
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4">
            <SearchInput
              placeholder="Rechercher par titre, type, formateur, lieu, date, statut..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
            />
          </div>
          
          {/* Mobile/Tablet View - Cards */}
          <div className="block lg:hidden space-y-3">
            {filteredTrainings.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {searchQuery ? "Aucun résultat trouvé pour votre recherche" : "Aucune formation trouvée"}
              </div>
            ) : (
              filteredTrainings.map((training) => (
                <Card key={training.id} className="border-2 border-blue-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-base text-foreground mb-1">{training.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{getTrainingTypeLabel(training.type)}</p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleOpenDialog(training)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDelete(training.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-blue-100 dark:border-slate-700">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Formateur</p>
                        <p className="text-sm font-medium">{training.instructor}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Date</p>
                        <p className="text-sm font-medium">
                          {new Date(training.date).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Durée</p>
                        <p className="text-sm font-medium">{training.duration} jour(s)</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Participants</p>
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {training.participants.length} / {training.maxParticipants}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-muted-foreground mb-1">Statut</p>
                        <Badge
                          variant={
                            training.status === "completed"
                              ? "success"
                              : training.status === "cancelled"
                              ? "destructive"
                              : "default"
                          }
                          className="text-xs"
                        >
                          {getStatusLabel(training.status)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Titre</TableHead>
                  <TableHead className="min-w-[150px]">Type</TableHead>
                  <TableHead className="min-w-[150px]">Formateur</TableHead>
                  <TableHead className="min-w-[130px]">Date</TableHead>
                  <TableHead className="min-w-[100px]">Durée</TableHead>
                  <TableHead className="min-w-[120px]">Participants</TableHead>
                  <TableHead className="min-w-[100px]">Statut</TableHead>
                  <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrainings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      {searchQuery ? "Aucun résultat trouvé pour votre recherche" : "Aucune formation trouvée"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTrainings.map((training) => (
                    <TableRow key={training.id} className="hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-colors">
                      <TableCell className="font-medium">{training.title}</TableCell>
                      <TableCell>{getTrainingTypeLabel(training.type)}</TableCell>
                      <TableCell>{training.instructor}</TableCell>
                      <TableCell>
                        {new Date(training.date).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>{training.duration} jour(s)</TableCell>
                      <TableCell className="font-semibold text-blue-600 dark:text-blue-400">
                        {training.participants.length} / {training.maxParticipants}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            training.status === "completed"
                              ? "success"
                              : training.status === "cancelled"
                              ? "destructive"
                              : "default"
                          }
                        >
                          {getStatusLabel(training.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-blue-100"
                            onClick={() => handleOpenDialog(training)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-100"
                            onClick={() => handleDelete(training.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
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
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">
              {editingTraining ? "Modifier la formation" : "Nouvelle formation"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {editingTraining
                ? "Modifiez les informations de la formation"
                : "Remplissez les informations pour créer une nouvelle formation"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:gap-6 px-2 sm:px-6 py-4 sm:py-6 bg-white dark:bg-slate-800">
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
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instructor">Formateur</Label>
                <Input
                  id="instructor"
                  value={formData.instructor}
                  onChange={(e) =>
                    setFormData({ ...formData, instructor: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Durée (jours)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Lieu</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Participants maximum</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) =>
                    setFormData({ ...formData, maxParticipants: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  className="flex h-9 w-full rounded-md border border-input dark:border-slate-600 bg-transparent dark:bg-slate-700 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as Training["type"],
                    })
                  }
                >
                  <option value="technical">Technique</option>
                  <option value="soft-skills">Compétences comportementales</option>
                  <option value="management">Management</option>
                </select>
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
                    status: e.target.value as Training["status"],
                  })
                }
              >
                <option value="scheduled">Programmée</option>
                <option value="completed">Terminée</option>
                <option value="cancelled">Annulée</option>
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
              className="w-full sm:w-auto bg-[#0a4f7a] hover:bg-[#084060]"
            >
              {editingTraining ? "Modifier" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

