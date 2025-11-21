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
  getDepartments,
  getEmployees,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/lib/data"
import type { Department } from "@/lib/types"
import { Plus, Edit, Trash2, Building2 } from "lucide-react"
import { SearchInput } from "@/components/ui/search-input"

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [employees, setEmployees] = useState(getEmployees())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    managerId: "",
    budget: "",
  })

  const getManagerName = (managerId: string) => {
    const manager = employees.find((e) => e.id === managerId)
    return manager ? `${manager.firstName} ${manager.lastName}` : "N/A"
  }

  useEffect(() => {
    loadDepartments()
  }, [])

  useEffect(() => {
    filterDepartments()
  }, [searchQuery, departments, employees])

  const loadDepartments = () => {
    const allDepartments = getDepartments()
    setDepartments(allDepartments)
    setFilteredDepartments(allDepartments)
  }

  const filterDepartments = () => {
    if (!searchQuery.trim()) {
      setFilteredDepartments(departments)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = departments.filter((dept) => {
      const name = dept.name.toLowerCase()
      const description = dept.description.toLowerCase()
      const manager = getManagerName(dept.managerId).toLowerCase()
      const budget = dept.budget.toString()

      return (
        name.includes(query) ||
        description.includes(query) ||
        manager.includes(query) ||
        budget.includes(query)
      )
    })
    setFilteredDepartments(filtered)
  }

  const handleOpenDialog = (department?: Department) => {
    if (department) {
      setEditingDepartment(department)
      setFormData({
        name: department.name,
        description: department.description,
        managerId: department.managerId,
        budget: String(department.budget),
      })
    } else {
      setEditingDepartment(null)
      setFormData({
        name: "",
        description: "",
        managerId: "",
        budget: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    const departmentData = {
      name: formData.name,
      description: formData.description,
      managerId: formData.managerId,
      budget: Number(formData.budget),
      createdAt: editingDepartment?.createdAt || new Date().toISOString().split("T")[0],
    }

    if (editingDepartment) {
      updateDepartment(editingDepartment.id, departmentData)
    } else {
      createDepartment(departmentData)
    }

    setIsDialogOpen(false)
    loadDepartments()
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce département ?")) {
      deleteDepartment(id)
      loadDepartments()
    }
  }

  const getDepartmentEmployeesCount = (departmentId: string) => {
    return employees.filter((e) => e.departmentId === departmentId).length
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Départements
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Gestion des départements de l'entreprise
          </p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un département
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-green-50/50 border-b-2 border-blue-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-lg sm:text-xl">Liste des départements</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {filteredDepartments.length} département{filteredDepartments.length > 1 ? "s" : ""} sur {departments.length} au total
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4">
            <SearchInput
              placeholder="Rechercher par nom, description, manager, budget..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
            />
          </div>
          
          {/* Mobile/Tablet View - Cards */}
          <div className="block sm:hidden space-y-3">
            {filteredDepartments.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {searchQuery ? "Aucun résultat trouvé pour votre recherche" : "Aucun département trouvé"}
              </div>
            ) : (
              filteredDepartments.map((department) => (
                <Card key={department.id} className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-base text-foreground mb-1">{department.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{department.description}</p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleOpenDialog(department)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDelete(department.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-blue-100">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Manager</p>
                        <p className="text-sm font-medium">{getManagerName(department.managerId)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Employés</p>
                        <p className="text-sm font-medium">{getDepartmentEmployeesCount(department.id)}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-muted-foreground mb-1">Budget</p>
                        <p className="text-sm font-bold text-blue-600">
                          {new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          }).format(department.budget)}
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
                  <TableHead className="min-w-[150px]">Nom</TableHead>
                  <TableHead className="min-w-[200px]">Description</TableHead>
                  <TableHead className="min-w-[150px]">Manager</TableHead>
                  <TableHead className="min-w-[100px]">Employés</TableHead>
                  <TableHead className="min-w-[120px]">Budget</TableHead>
                  <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      {searchQuery ? "Aucun résultat trouvé pour votre recherche" : "Aucun département trouvé"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDepartments.map((department) => (
                    <TableRow key={department.id} className="hover:bg-blue-50/50 transition-colors">
                      <TableCell className="font-medium">{department.name}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{department.description}</TableCell>
                      <TableCell>{getManagerName(department.managerId)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {getDepartmentEmployeesCount(department.id)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-blue-600">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(department.budget)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-blue-100"
                            onClick={() => handleOpenDialog(department)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-100"
                            onClick={() => handleDelete(department.id)}
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
        <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">
              {editingDepartment ? "Modifier le département" : "Ajouter un département"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {editingDepartment
                ? "Modifiez les informations du département"
                : "Remplissez les informations pour ajouter un nouveau département"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:gap-6 px-2 sm:px-6 py-4 sm:py-6 bg-white">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">Nom</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerId" className="text-sm font-semibold">Manager</Label>
              <select
                id="managerId"
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                value={formData.managerId}
                onChange={(e) =>
                  setFormData({ ...formData, managerId: e.target.value })
                }
              >
                <option value="">Sélectionner un manager</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget" className="text-sm font-semibold">Budget (€)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
                className="h-10"
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
              {editingDepartment ? "Modifier" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

