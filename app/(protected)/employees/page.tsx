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
import { Select } from "@/components/ui/select"
import {
  getEmployees,
  getDepartments,
  getPositions,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "@/lib/data"
import type { Employee } from "@/lib/types"
import { Plus, Edit, Trash2, User } from "lucide-react"
import { SearchInput } from "@/components/ui/search-input"

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [departments, setDepartments] = useState(getDepartments())
  const [positions, setPositions] = useState(getPositions())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    positionId: "",
    departmentId: "",
    hireDate: "",
    salary: "",
    address: "",
    birthDate: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
  })

  const getDepartmentName = (id: string) => {
    return departments.find((d) => d.id === id)?.name || "N/A"
  }

  const getPositionTitle = (id: string) => {
    return positions.find((p) => p.id === id)?.title || "N/A"
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  useEffect(() => {
    filterEmployees()
  }, [searchQuery, employees, departments, positions])

  const loadEmployees = () => {
    const allEmployees = getEmployees()
    setEmployees(allEmployees)
    setFilteredEmployees(allEmployees)
  }

  const filterEmployees = () => {
    if (!searchQuery.trim()) {
      setFilteredEmployees(employees)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = employees.filter((employee) => {
      const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase()
      const email = employee.email.toLowerCase()
      const department = getDepartmentName(employee.departmentId).toLowerCase()
      const position = getPositionTitle(employee.positionId).toLowerCase()
      const phone = employee.phone.toLowerCase()

      return (
        fullName.includes(query) ||
        email.includes(query) ||
        department.includes(query) ||
        position.includes(query) ||
        phone.includes(query)
      )
    })
    setFilteredEmployees(filtered)
  }

  const handleOpenDialog = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee)
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        positionId: employee.positionId,
        departmentId: employee.departmentId,
        hireDate: employee.hireDate,
        salary: String(employee.salary),
        address: employee.address,
        birthDate: employee.birthDate,
        emergencyContactName: employee.emergencyContact.name,
        emergencyContactPhone: employee.emergencyContact.phone,
        emergencyContactRelation: employee.emergencyContact.relation,
      })
    } else {
      setEditingEmployee(null)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        positionId: "",
        departmentId: "",
        hireDate: "",
        salary: "",
        address: "",
        birthDate: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        emergencyContactRelation: "",
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    const employeeData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      positionId: formData.positionId,
      departmentId: formData.departmentId,
      hireDate: formData.hireDate,
      salary: Number(formData.salary),
      status: "active" as const,
      address: formData.address,
      birthDate: formData.birthDate,
      emergencyContact: {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
        relation: formData.emergencyContactRelation,
      },
    }

    if (editingEmployee) {
      updateEmployee(editingEmployee.id, employeeData)
    } else {
      createEmployee(employeeData)
    }

    setIsDialogOpen(false)
    loadEmployees()
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      deleteEmployee(id)
      loadEmployees()
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
            Employés
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Gestion de tous les employés de l'entreprise
          </p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un employé
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-green-50/50 dark:from-slate-700/50 dark:to-slate-800/50 border-b-2 border-blue-100 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-lg sm:text-xl">Liste des employés</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {filteredEmployees.length} employé{filteredEmployees.length > 1 ? "s" : ""} sur {employees.length} au total
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4">
            <SearchInput
              placeholder="Rechercher par nom, email, département, poste..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
            />
          </div>
          
          {/* Mobile/Tablet View - Cards */}
          <div className="block lg:hidden space-y-3">
            {filteredEmployees.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {searchQuery ? "Aucun résultat trouvé pour votre recherche" : "Aucun employé trouvé"}
              </div>
            ) : (
              filteredEmployees.map((employee) => (
                <Card key={employee.id} className="border-2 border-blue-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-base text-foreground mb-1">
                          {employee.firstName} {employee.lastName}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2">{employee.email}</p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleOpenDialog(employee)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDelete(employee.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-blue-100 dark:border-slate-700">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Département</p>
                        <p className="text-sm font-medium">{getDepartmentName(employee.departmentId)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Poste</p>
                        <p className="text-sm font-medium">{getPositionTitle(employee.positionId)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Date d'embauche</p>
                        <p className="text-sm font-medium">
                          {new Date(employee.hireDate).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Statut</p>
                        <Badge
                          variant={
                            employee.status === "active"
                              ? "success"
                              : employee.status === "on_leave"
                              ? "warning"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {employee.status === "active"
                            ? "Actif"
                            : employee.status === "on_leave"
                            ? "En congé"
                            : "Inactif"}
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
                  <TableHead className="min-w-[180px]">Nom</TableHead>
                  <TableHead className="min-w-[200px]">Email</TableHead>
                  <TableHead className="min-w-[150px]">Département</TableHead>
                  <TableHead className="min-w-[150px]">Poste</TableHead>
                  <TableHead className="min-w-[130px]">Date d'embauche</TableHead>
                  <TableHead className="min-w-[100px]">Statut</TableHead>
                  <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      {searchQuery ? "Aucun résultat trouvé pour votre recherche" : "Aucun employé trouvé"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id} className="hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-colors">
                      <TableCell className="font-medium">
                        {employee.firstName} {employee.lastName}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">{employee.email}</TableCell>
                      <TableCell>{getDepartmentName(employee.departmentId)}</TableCell>
                      <TableCell>{getPositionTitle(employee.positionId)}</TableCell>
                      <TableCell>
                        {new Date(employee.hireDate).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            employee.status === "active"
                              ? "success"
                              : employee.status === "on_leave"
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {employee.status === "active"
                            ? "Actif"
                            : employee.status === "on_leave"
                            ? "En congé"
                            : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-blue-100"
                            onClick={() => handleOpenDialog(employee)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-100"
                            onClick={() => handleDelete(employee.id)}
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
              {editingEmployee ? "Modifier l'employé" : "Ajouter un employé"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {editingEmployee
                ? "Modifiez les informations de l'employé"
                : "Remplissez les informations pour ajouter un nouvel employé"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:gap-6 px-2 sm:px-6 py-4 sm:py-6 bg-white dark:bg-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-semibold">Prénom</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-semibold">Nom</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departmentId" className="text-sm font-semibold">Département</Label>
                <Select
                  id="departmentId"
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
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="positionId" className="text-sm font-semibold">Poste</Label>
                <Select
                  id="positionId"
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
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hireDate" className="text-sm font-semibold">Date d'embauche</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) =>
                    setFormData({ ...formData, hireDate: e.target.value })
                  }
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-sm font-semibold">Date de naissance</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) =>
                    setFormData({ ...formData, birthDate: e.target.value })
                  }
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary" className="text-sm font-semibold">Salaire</Label>
              <Input
                id="salary"
                type="number"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-semibold">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="h-10"
              />
            </div>

            <div className="border-t-2 border-blue-100 dark:border-slate-700 pt-4 sm:pt-6 mt-2">
              <h3 className="text-sm sm:text-base font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
                Contact d'urgence
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactName" className="text-sm font-semibold">Nom</Label>
                  <Input
                    id="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContactName: e.target.value,
                      })
                    }
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactPhone" className="text-sm font-semibold">Téléphone</Label>
                  <Input
                    id="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContactPhone: e.target.value,
                      })
                    }
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactRelation" className="text-sm font-semibold">Relation</Label>
                  <Input
                    id="emergencyContactRelation"
                    value={formData.emergencyContactRelation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContactRelation: e.target.value,
                      })
                    }
                    className="h-10"
                  />
                </div>
              </div>
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
              {editingEmployee ? "Modifier" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

