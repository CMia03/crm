import employeesData from "@/data/employees.json"
import departmentsData from "@/data/departments.json"
import positionsData from "@/data/positions.json"
import leavesData from "@/data/leaves.json"
import evaluationsData from "@/data/evaluations.json"
import trainingsData from "@/data/trainings.json"
import recruitmentsData from "@/data/recruitments.json"
import type {
  Employee,
  Department,
  Position,
  Leave,
  Evaluation,
  Training,
  Recruitment,
} from "./types"

// Fonctions utilitaires pour localStorage
const getStorageKey = (key: string) => `hr_${key}`

const loadFromStorage = <T>(key: string, defaultValue: T[]): T[] => {
  if (typeof window === "undefined") return defaultValue
  const stored = localStorage.getItem(getStorageKey(key))
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return defaultValue
    }
  }
  return defaultValue
}

const saveToStorage = <T>(key: string, data: T[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(getStorageKey(key), JSON.stringify(data))
}

// Initialiser les données depuis localStorage ou les fichiers JSON
const initData = <T>(key: string, defaultData: T[]): T[] => {
  const stored = loadFromStorage<T>(key, defaultData)
  if (stored.length === 0) {
    saveToStorage(key, defaultData)
    return defaultData
  }
  return stored
}

// Charger les données
let employees: Employee[] = initData("employees", employeesData as Employee[])
let departments: Department[] = initData("departments", departmentsData as Department[])
let positions: Position[] = initData("positions", positionsData as Position[])
let leaves: Leave[] = initData("leaves", leavesData as Leave[])
let evaluations: Evaluation[] = initData("evaluations", evaluationsData as Evaluation[])
let trainings: Training[] = initData("trainings", trainingsData as Training[])
let recruitments: Recruitment[] = initData("recruitments", recruitmentsData as Recruitment[])

// Employees
export const getEmployees = () => {
  employees = loadFromStorage("employees", employeesData as Employee[])
  return employees
}
export const getEmployee = (id: string) => {
  employees = loadFromStorage("employees", employeesData as Employee[])
  return employees.find((e) => e.id === id)
}
export const createEmployee = (employee: Omit<Employee, "id">) => {
  employees = loadFromStorage("employees", employeesData as Employee[])
  const newEmployee: Employee = {
    ...employee,
    id: String(Date.now()),
  }
  employees.push(newEmployee)
  saveToStorage("employees", employees)
  return newEmployee
}
export const updateEmployee = (id: string, updates: Partial<Employee>) => {
  employees = loadFromStorage("employees", employeesData as Employee[])
  const index = employees.findIndex((e) => e.id === id)
  if (index !== -1) {
    employees[index] = { ...employees[index], ...updates }
    saveToStorage("employees", employees)
    return employees[index]
  }
  return null
}
export const deleteEmployee = (id: string) => {
  employees = loadFromStorage("employees", employeesData as Employee[])
  employees = employees.filter((e) => e.id !== id)
  saveToStorage("employees", employees)
}

// Departments
export const getDepartments = () => {
  departments = loadFromStorage("departments", departmentsData as Department[])
  return departments
}
export const getDepartment = (id: string) => {
  departments = loadFromStorage("departments", departmentsData as Department[])
  return departments.find((d) => d.id === id)
}
export const createDepartment = (department: Omit<Department, "id">) => {
  departments = loadFromStorage("departments", departmentsData as Department[])
  const newDepartment: Department = {
    ...department,
    id: String(Date.now()),
  }
  departments.push(newDepartment)
  saveToStorage("departments", departments)
  return newDepartment
}
export const updateDepartment = (id: string, updates: Partial<Department>) => {
  departments = loadFromStorage("departments", departmentsData as Department[])
  const index = departments.findIndex((d) => d.id === id)
  if (index !== -1) {
    departments[index] = { ...departments[index], ...updates }
    saveToStorage("departments", departments)
    return departments[index]
  }
  return null
}
export const deleteDepartment = (id: string) => {
  departments = loadFromStorage("departments", departmentsData as Department[])
  departments = departments.filter((d) => d.id !== id)
  saveToStorage("departments", departments)
}

// Positions
export const getPositions = () => {
  positions = loadFromStorage("positions", positionsData as Position[])
  return positions
}
export const getPosition = (id: string) => {
  positions = loadFromStorage("positions", positionsData as Position[])
  return positions.find((p) => p.id === id)
}
export const createPosition = (position: Omit<Position, "id">) => {
  positions = loadFromStorage("positions", positionsData as Position[])
  const newPosition: Position = {
    ...position,
    id: String(Date.now()),
  }
  positions.push(newPosition)
  saveToStorage("positions", positions)
  return newPosition
}
export const updatePosition = (id: string, updates: Partial<Position>) => {
  positions = loadFromStorage("positions", positionsData as Position[])
  const index = positions.findIndex((p) => p.id === id)
  if (index !== -1) {
    positions[index] = { ...positions[index], ...updates }
    saveToStorage("positions", positions)
    return positions[index]
  }
  return null
}
export const deletePosition = (id: string) => {
  positions = loadFromStorage("positions", positionsData as Position[])
  positions = positions.filter((p) => p.id !== id)
  saveToStorage("positions", positions)
}

// Leaves
export const getLeaves = () => {
  leaves = loadFromStorage("leaves", leavesData as Leave[])
  return leaves
}
export const getLeave = (id: string) => {
  leaves = loadFromStorage("leaves", leavesData as Leave[])
  return leaves.find((l) => l.id === id)
}
export const getEmployeeLeaves = (employeeId: string) => {
  leaves = loadFromStorage("leaves", leavesData as Leave[])
  return leaves.filter((l) => l.employeeId === employeeId)
}
export const createLeave = (leave: Omit<Leave, "id">) => {
  leaves = loadFromStorage("leaves", leavesData as Leave[])
  const newLeave: Leave = {
    ...leave,
    id: String(Date.now()),
  }
  leaves.push(newLeave)
  saveToStorage("leaves", leaves)
  return newLeave
}
export const updateLeave = (id: string, updates: Partial<Leave>) => {
  leaves = loadFromStorage("leaves", leavesData as Leave[])
  const index = leaves.findIndex((l) => l.id === id)
  if (index !== -1) {
    leaves[index] = { ...leaves[index], ...updates }
    saveToStorage("leaves", leaves)
    return leaves[index]
  }
  return null
}
export const deleteLeave = (id: string) => {
  leaves = loadFromStorage("leaves", leavesData as Leave[])
  leaves = leaves.filter((l) => l.id !== id)
  saveToStorage("leaves", leaves)
}

// Evaluations
export const getEvaluations = () => {
  evaluations = loadFromStorage("evaluations", evaluationsData as Evaluation[])
  return evaluations
}
export const getEvaluation = (id: string) => {
  evaluations = loadFromStorage("evaluations", evaluationsData as Evaluation[])
  return evaluations.find((e) => e.id === id)
}
export const getEmployeeEvaluations = (employeeId: string) => {
  evaluations = loadFromStorage("evaluations", evaluationsData as Evaluation[])
  return evaluations.filter((e) => e.employeeId === employeeId)
}
export const createEvaluation = (evaluation: Omit<Evaluation, "id">) => {
  evaluations = loadFromStorage("evaluations", evaluationsData as Evaluation[])
  const newEvaluation: Evaluation = {
    ...evaluation,
    id: String(Date.now()),
  }
  evaluations.push(newEvaluation)
  saveToStorage("evaluations", evaluations)
  return newEvaluation
}
export const updateEvaluation = (id: string, updates: Partial<Evaluation>) => {
  evaluations = loadFromStorage("evaluations", evaluationsData as Evaluation[])
  const index = evaluations.findIndex((e) => e.id === id)
  if (index !== -1) {
    evaluations[index] = { ...evaluations[index], ...updates }
    saveToStorage("evaluations", evaluations)
    return evaluations[index]
  }
  return null
}

// Trainings
export const getTrainings = () => {
  trainings = loadFromStorage("trainings", trainingsData as Training[])
  return trainings
}
export const getTraining = (id: string) => {
  trainings = loadFromStorage("trainings", trainingsData as Training[])
  return trainings.find((t) => t.id === id)
}
export const createTraining = (training: Omit<Training, "id">) => {
  trainings = loadFromStorage("trainings", trainingsData as Training[])
  const newTraining: Training = {
    ...training,
    id: String(Date.now()),
  }
  trainings.push(newTraining)
  saveToStorage("trainings", trainings)
  return newTraining
}
export const updateTraining = (id: string, updates: Partial<Training>) => {
  trainings = loadFromStorage("trainings", trainingsData as Training[])
  const index = trainings.findIndex((t) => t.id === id)
  if (index !== -1) {
    trainings[index] = { ...trainings[index], ...updates }
    saveToStorage("trainings", trainings)
    return trainings[index]
  }
  return null
}
export const deleteTraining = (id: string) => {
  trainings = loadFromStorage("trainings", trainingsData as Training[])
  trainings = trainings.filter((t) => t.id !== id)
  saveToStorage("trainings", trainings)
}

// Recruitments
export const getRecruitments = () => {
  recruitments = loadFromStorage("recruitments", recruitmentsData as Recruitment[])
  return recruitments
}
export const getRecruitment = (id: string) => {
  recruitments = loadFromStorage("recruitments", recruitmentsData as Recruitment[])
  return recruitments.find((r) => r.id === id)
}
export const createRecruitment = (recruitment: Omit<Recruitment, "id">) => {
  recruitments = loadFromStorage("recruitments", recruitmentsData as Recruitment[])
  const newRecruitment: Recruitment = {
    ...recruitment,
    id: String(Date.now()),
  }
  recruitments.push(newRecruitment)
  saveToStorage("recruitments", recruitments)
  return newRecruitment
}
export const updateRecruitment = (id: string, updates: Partial<Recruitment>) => {
  recruitments = loadFromStorage("recruitments", recruitmentsData as Recruitment[])
  const index = recruitments.findIndex((r) => r.id === id)
  if (index !== -1) {
    recruitments[index] = { ...recruitments[index], ...updates }
    saveToStorage("recruitments", recruitments)
    return recruitments[index]
  }
  return null
}

