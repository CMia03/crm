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
  getLeaves,
  getEmployees,
  createLeave,
  updateLeave,
  deleteLeave,
} from "@/lib/data"
import type { Leave } from "@/lib/types"
import { Plus, Edit, Trash2, Calendar, Check, X } from "lucide-react"
import { SearchInput } from "@/components/ui/search-input"

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<Leave[]>([])
  const [filteredLeaves, setFilteredLeaves] = useState<Leave[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [employees, setEmployees] = useState(getEmployees())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLeave, setEditingLeave] = useState<Leave | null>(null)
  const [formData, setFormData] = useState({
    employeeId: "",
    type: "vacation" as Leave["type"],
    startDate: "",
    endDate: "",
    reason: "",
  })

  useEffect(() => {
    loadLeaves()
  }, [])

  const loadLeaves = () => {
    const allLeaves = getLeaves()
    setLeaves(allLeaves)
    setFilteredLeaves(allLeaves)
  }

  const handleOpenDialog = (leave?: Leave) => {
    if (leave) {
      setEditingLeave(leave)
      setFormData({
        employeeId: leave.employeeId,
        type: leave.type,
        startDate: leave.startDate,
        endDate: leave.endDate,
        reason: leave.reason,
      })
    } else {
      setEditingLeave(null)
      setFormData({
        employeeId: "",
        type: "vacation",
        startDate: "",
        endDate: "",
        reason: "",
      })
    }
    setIsDialogOpen(true)
  }

  const calculateDays = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const handleSubmit = () => {
    const days = calculateDays(formData.startDate, formData.endDate)
    const leaveData = {
      employeeId: formData.employeeId,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days,
      status: "pending" as const,
      reason: formData.reason,
      submittedAt: new Date().toISOString().split("T")[0],
    }

    if (editingLeave) {
      updateLeave(editingLeave.id, leaveData)
    } else {
      createLeave(leaveData)
    }

    setIsDialogOpen(false)
    loadLeaves()
  }

  const handleApprove = (id: string) => {
    updateLeave(id, {
      status: "approved",
      approvedBy: "1",
      approvedAt: new Date().toISOString().split("T")[0],
    })
    loadLeaves()
  }

  const handleReject = (id: string) => {
    const reason = prompt("Raison du refus :")
    if (reason) {
      updateLeave(id, {
        status: "rejected",
        rejectedBy: "1",
        rejectedAt: new Date().toISOString().split("T")[0],
        rejectionReason: reason,
      })
      loadLeaves()
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette demande de congé ?")) {
      deleteLeave(id)
      loadLeaves()
    }
  }

  const getEmployeeName = (id: string) => {
    const employee = employees.find((e) => e.id === id)
    return employee ? `${employee.firstName} ${employee.lastName}` : "N/A"
  }

  const getLeaveTypeLabel = (type: Leave["type"]) => {
    const labels: Record<Leave["type"], string> = {
      vacation: "Vacances",
      sick: "Maladie",
      personal: "Personnel",
      maternity: "Maternité",
      paternity: "Paternité",
    }
    return labels[type] || type
  }

  useEffect(() => {
    filterLeaves()
  }, [searchQuery, leaves, employees])

  const filterLeaves = () => {
    if (!searchQuery.trim()) {
      setFilteredLeaves(leaves)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = leaves.filter((leave) => {
      const employeeName = getEmployeeName(leave.employeeId).toLowerCase()
      const type = getLeaveTypeLabel(leave.type).toLowerCase()
      const reason = leave.reason.toLowerCase()
      const status = leave.status === "approved" ? "approuvé" : leave.status === "rejected" ? "refusé" : "en attente"

      return (
        employeeName.includes(query) ||
        type.includes(query) ||
        reason.includes(query) ||
        status.includes(query) ||
        leave.startDate.includes(query) ||
        leave.endDate.includes(query)
      )
    })
    setFilteredLeaves(filtered)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
            Congés
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Gestion des demandes de congés
          </p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle demande
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-green-50/50 dark:from-slate-700/50 dark:to-slate-800/50 border-b-2 border-blue-100 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-lg sm:text-xl">Liste des congés</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {filteredLeaves.length} demande{filteredLeaves.length > 1 ? "s" : ""} sur {leaves.length} au total
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4">
            <SearchInput
              placeholder="Rechercher par employé, type, raison, statut, dates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
            />
          </div>
          
          {/* Mobile/Tablet View - Cards */}
          <div className="block lg:hidden space-y-3">
            {filteredLeaves.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {searchQuery ? "Aucun résultat trouvé pour votre recherche" : "Aucune demande de congé trouvée"}
              </div>
            ) : (
              filteredLeaves.map((leave) => (
                <Card key={leave.id} className="border-2 border-blue-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-base text-foreground mb-1">
                          {getEmployeeName(leave.employeeId)}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2">{getLeaveTypeLabel(leave.type)}</p>
                      </div>
                      <Badge
                        variant={
                          leave.status === "approved"
                            ? "success"
                            : leave.status === "rejected"
                            ? "destructive"
                            : "warning"
                        }
                        className="text-xs"
                      >
                        {leave.status === "approved"
                          ? "Approuvé"
                          : leave.status === "rejected"
                          ? "Refusé"
                          : "En attente"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-blue-100 dark:border-slate-700">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Date de début</p>
                        <p className="text-sm font-medium">
                          {new Date(leave.startDate).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Date de fin</p>
                        <p className="text-sm font-medium">
                          {new Date(leave.endDate).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-muted-foreground mb-1">Durée</p>
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{leave.days} jour(s)</p>
                      </div>
                    </div>
                    {leave.status === "pending" && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-blue-100 dark:border-slate-700">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30"
                          onClick={() => handleApprove(leave.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approuver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30"
                          onClick={() => handleReject(leave.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Refuser
                        </Button>
                      </div>
                    )}
                    <div className="flex gap-2 mt-3 pt-3 border-t border-blue-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleOpenDialog(leave)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(leave.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
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
                  <TableHead className="min-w-[150px]">Employé</TableHead>
                  <TableHead className="min-w-[120px]">Type</TableHead>
                  <TableHead className="min-w-[130px]">Date de début</TableHead>
                  <TableHead className="min-w-[130px]">Date de fin</TableHead>
                  <TableHead className="min-w-[100px]">Jours</TableHead>
                  <TableHead className="min-w-[100px]">Statut</TableHead>
                  <TableHead className="text-right min-w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeaves.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      {searchQuery ? "Aucun résultat trouvé pour votre recherche" : "Aucune demande de congé trouvée"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeaves.map((leave) => (
                    <TableRow key={leave.id} className="hover:bg-blue-50/50 transition-colors">
                      <TableCell className="font-medium">
                        {getEmployeeName(leave.employeeId)}
                      </TableCell>
                      <TableCell>{getLeaveTypeLabel(leave.type)}</TableCell>
                      <TableCell>
                        {new Date(leave.startDate).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>
                        {new Date(leave.endDate).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell className="font-semibold text-blue-600 dark:text-blue-400">{leave.days} jour(s)</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            leave.status === "approved"
                              ? "success"
                              : leave.status === "rejected"
                              ? "destructive"
                              : "warning"
                          }
                        >
                          {leave.status === "approved"
                            ? "Approuvé"
                            : leave.status === "rejected"
                            ? "Refusé"
                            : "En attente"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {leave.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-green-100 dark:hover:bg-green-900/30"
                                onClick={() => handleApprove(leave.id)}
                                title="Approuver"
                              >
                                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/30"
                                onClick={() => handleReject(leave.id)}
                                title="Refuser"
                              >
                                <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-blue-100"
                            onClick={() => handleOpenDialog(leave)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-100"
                            onClick={() => handleDelete(leave.id)}
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
              {editingLeave ? "Modifier la demande" : "Nouvelle demande de congé"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {editingLeave
                ? "Modifiez les informations de la demande"
                : "Remplissez les informations pour créer une nouvelle demande"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:gap-6 px-2 sm:px-6 py-4 sm:py-6 bg-white dark:bg-slate-800">
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employé</Label>
              <select
                id="employeeId"
                  className="flex h-9 w-full rounded-md border border-input dark:border-slate-600 bg-transparent dark:bg-slate-700 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                value={formData.employeeId}
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: e.target.value })
                }
              >
                <option value="">Sélectionner un employé</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type de congé</Label>
              <select
                id="type"
                  className="flex h-9 w-full rounded-md border border-input dark:border-slate-600 bg-transparent dark:bg-slate-700 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground"
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as Leave["type"],
                  })
                }
              >
                <option value="vacation">Vacances</option>
                <option value="sick">Maladie</option>
                <option value="personal">Personnel</option>
                <option value="maternity">Maternité</option>
                <option value="paternity">Paternité</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Date de début</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Date de fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            {formData.startDate && formData.endDate && (
              <div className="text-sm text-muted-foreground">
                Durée : {calculateDays(formData.startDate, formData.endDate)} jour(s)
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="reason">Raison</Label>
              <Input
                id="reason"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
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
              {editingLeave ? "Modifier" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

