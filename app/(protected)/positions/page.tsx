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
  getPositions,
  getDepartments,
  createPosition,
  updatePosition,
  deletePosition,
} from "@/lib/data"
import type { Position } from "@/lib/types"
import { Plus, Edit, Trash2, Briefcase } from "lucide-react"
import { SearchInput } from "@/components/ui/search-input"

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>([])
  const [filteredPositions, setFilteredPositions] = useState<Position[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [departments, setDepartments] = useState(getDepartments())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPosition, setEditingPosition] = useState<Position | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    departmentId: "",
    level: "",
    salaryMin: "",
    salaryMax: "",
    requirements: "",
    status: "active" as "active" | "inactive",
  })

  const getDepartmentName = (id: string) => {
    return departments.find((d) => d.id === id)?.name || "N/A"
  }

  useEffect(() => {
    loadPositions()
  }, [])

  useEffect(() => {
    filterPositions()
  }, [searchQuery, positions, departments])

  const loadPositions = () => {
    const allPositions = getPositions()
    setPositions(allPositions)
    setFilteredPositions(allPositions)
  }

  const filterPositions = () => {
    if (!searchQuery.trim()) {
      setFilteredPositions(positions)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = positions.filter((position) => {
      const title = position.title.toLowerCase()
      const department = getDepartmentName(position.departmentId).toLowerCase()
      const level = position.level.toLowerCase()
      const requirements = position.requirements.join(" ").toLowerCase()
      const salary = `${position.salaryRange.min}-${position.salaryRange.max}`

      return (
        title.includes(query) ||
        department.includes(query) ||
        level.includes(query) ||
        requirements.includes(query) ||
        salary.includes(query)
      )
    })
    setFilteredPositions(filtered)
  }

  const handleOpenDialog = (position?: Position) => {
    if (position) {
      setEditingPosition(position)
      setFormData({
        title: position.title,
        departmentId: position.departmentId,
        level: position.level,
        salaryMin: String(position.salaryRange.min),
        salaryMax: String(position.salaryRange.max),
        requirements: position.requirements.join(", "),
        status: position.status,
      })
    } else {
      setEditingPosition(null)
      setFormData({
        title: "",
        departmentId: "",
        level: "",
        salaryMin: "",
        salaryMax: "",
        requirements: "",
        status: "active",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    const positionData = {
      title: formData.title,
      departmentId: formData.departmentId,
      level: formData.level,
      salaryRange: {
        min: Number(formData.salaryMin),
        max: Number(formData.salaryMax),
      },
      requirements: formData.requirements
        .split(",")
        .map((r) => r.trim())
        .filter((r) => r.length > 0),
      status: formData.status,
    }

    if (editingPosition) {
      updatePosition(editingPosition.id, positionData)
    } else {
      createPosition(positionData)
    }

    setIsDialogOpen(false)
    loadPositions()
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce poste ?")) {
      deletePosition(id)
      loadPositions()
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
            Postes
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Gestion des postes et positions dans l'entreprise
          </p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un poste
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-green-50/50 dark:from-slate-700/50 dark:to-slate-800/50 border-b-2 border-blue-100 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-lg sm:text-xl">Liste des postes</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {filteredPositions.length} poste{filteredPositions.length > 1 ? "s" : ""} sur {positions.length} au total
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4">
            <SearchInput
              placeholder="Rechercher par titre, département, niveau, salaire..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
            />
          </div>
          
          {/* Mobile/Tablet View - Cards */}
          <div className="block sm:hidden space-y-3">
            {filteredPositions.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {searchQuery ? "Aucun résultat trouvé pour votre recherche" : "Aucun poste trouvé"}
              </div>
            ) : (
              filteredPositions.map((position) => (
                <Card key={position.id} className="border-2 border-blue-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-base text-foreground mb-1">{position.title}</h3>
                        <p className="text-sm text-muted-foreground">{getDepartmentName(position.departmentId)}</p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleOpenDialog(position)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDelete(position.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-blue-100 dark:border-slate-700">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Niveau</p>
                        <p className="text-sm font-medium">{position.level}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Statut</p>
                        <Badge variant={position.status === "active" ? "success" : "secondary"} className="text-xs">
                          {position.status === "active" ? "Actif" : "Inactif"}
                        </Badge>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-muted-foreground mb-1">Salaire</p>
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          }).format(position.salaryRange.min)}{" "}
                          -{" "}
                          {new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          }).format(position.salaryRange.max)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Titre</TableHead>
                  <TableHead className="min-w-[150px]">Département</TableHead>
                  <TableHead className="min-w-[120px]">Niveau</TableHead>
                  <TableHead className="min-w-[200px]">Salaire</TableHead>
                  <TableHead className="min-w-[100px]">Statut</TableHead>
                  <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPositions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      {searchQuery ? "Aucun résultat trouvé pour votre recherche" : "Aucun poste trouvé"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPositions.map((position) => (
                    <TableRow key={position.id} className="hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-colors">
                      <TableCell className="font-medium">{position.title}</TableCell>
                      <TableCell>{getDepartmentName(position.departmentId)}</TableCell>
                      <TableCell>{position.level}</TableCell>
                      <TableCell className="font-semibold text-blue-600 dark:text-blue-400">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(position.salaryRange.min)}{" "}
                        -{" "}
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(position.salaryRange.max)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={position.status === "active" ? "success" : "secondary"}>
                          {position.status === "active" ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-blue-100"
                            onClick={() => handleOpenDialog(position)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-100"
                            onClick={() => handleDelete(position.id)}
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
              {editingPosition ? "Modifier le poste" : "Ajouter un poste"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {editingPosition
                ? "Modifiez les informations du poste"
                : "Remplissez les informations pour ajouter un nouveau poste"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:gap-6 px-2 sm:px-6 py-4 sm:py-6 bg-white dark:bg-slate-800">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold">Titre</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-10"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departmentId">Département</Label>
                <select
                  id="departmentId"
                  className="flex h-9 w-full rounded-md border border-input dark:border-slate-600 bg-transparent dark:bg-slate-700 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
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
              <div className="space-y-2">
                <Label htmlFor="level">Niveau</Label>
                <select
                  id="level"
                  className="flex h-9 w-full rounded-md border border-input dark:border-slate-600 bg-transparent dark:bg-slate-700 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                >
                  <option value="">Sélectionner un niveau</option>
                  <option value="Junior">Junior</option>
                  <option value="Intermediate">Intermédiaire</option>
                  <option value="Senior">Senior</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salaryMin" className="text-sm font-semibold">Salaire minimum (€)</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  value={formData.salaryMin}
                  onChange={(e) =>
                    setFormData({ ...formData, salaryMin: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryMax">Salaire maximum (€)</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  value={formData.salaryMax}
                  onChange={(e) =>
                    setFormData({ ...formData, salaryMax: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Exigences (séparées par des virgules)</Label>
              <Input
                id="requirements"
                value={formData.requirements}
                onChange={(e) =>
                  setFormData({ ...formData, requirements: e.target.value })
                }
                placeholder="React, Node.js, 5 ans d'expérience"
              />
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
                    status: e.target.value as "active" | "inactive",
                  })
                }
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
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
              {editingPosition ? "Modifier" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

