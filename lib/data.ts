import employeesData from "@/data/employees.json"
import departmentsData from "@/data/departments.json"
import positionsData from "@/data/positions.json"
import leavesData from "@/data/leaves.json"
import evaluationsData from "@/data/evaluations.json"
import trainingsData from "@/data/trainings.json"
import recruitmentsData from "@/data/recruitments.json"
import studentsData from "@/data/students.json"
import onlineCoursesData from "@/data/online-courses.json"
import quizzesData from "@/data/quizzes.json"
import certificationsData from "@/data/certifications.json"
import studentProgressData from "@/data/student-progress.json"
import quizAttemptsData from "@/data/quiz-attempts.json"
import resumesData from "@/data/resumes.json"
import type {
  Employee,
  Department,
  Position,
  Leave,
  Evaluation,
  Training,
  Recruitment,
  Student,
  OnlineCourse,
  Quiz,
  Certification,
  StudentProgress,
  QuizAttempt,
  Resume,
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

// Resumes (CV)
let resumes: Resume[] = initData("resumes", resumesData as Resume[])
export const getResumes = () => {
  resumes = loadFromStorage("resumes", resumesData as Resume[])
  return resumes
}
export const getResume = (id: string) => {
  resumes = loadFromStorage("resumes", resumesData as Resume[])
  return resumes.find((r) => r.id === id)
}
export const getResumesByPosition = (positionId: string) => {
  resumes = loadFromStorage("resumes", resumesData as Resume[])
  return resumes.filter((r) => r.positionId === positionId)
}
export const createResume = (resume: Omit<Resume, "id" | "submittedDate">) => {
  resumes = loadFromStorage("resumes", resumesData as Resume[])
  const newResume: Resume = {
    ...resume,
    id: String(Date.now()),
    submittedDate: new Date().toISOString(),
  }
  resumes.push(newResume)
  saveToStorage("resumes", resumes)
  return newResume
}
export const updateResume = (id: string, updates: Partial<Resume>) => {
  resumes = loadFromStorage("resumes", resumesData as Resume[])
  const index = resumes.findIndex((r) => r.id === id)
  if (index !== -1) {
    resumes[index] = { ...resumes[index], ...updates }
    saveToStorage("resumes", resumes)
    return resumes[index]
  }
  return null
}
export const deleteResume = (id: string) => {
  resumes = loadFromStorage("resumes", resumesData as Resume[])
  const index = resumes.findIndex((r) => r.id === id)
  if (index !== -1) {
    resumes.splice(index, 1)
    saveToStorage("resumes", resumes)
    return true
  }
  return false
}

// Module Éducation / eLearning - Students
let students: Student[] = initData("students", studentsData as Student[])
export const getStudents = () => {
  students = loadFromStorage("students", studentsData as Student[])
  return students
}
export const getStudent = (id: string) => {
  students = loadFromStorage("students", studentsData as Student[])
  return students.find((s) => s.id === id)
}
export const createStudent = (student: Omit<Student, "id">) => {
  students = loadFromStorage("students", studentsData as Student[])
  const newStudent: Student = {
    ...student,
    id: String(Date.now()),
  }
  students.push(newStudent)
  saveToStorage("students", students)
  return newStudent
}
export const updateStudent = (id: string, updates: Partial<Student>) => {
  students = loadFromStorage("students", studentsData as Student[])
  const index = students.findIndex((s) => s.id === id)
  if (index !== -1) {
    students[index] = { ...students[index], ...updates }
    saveToStorage("students", students)
    return students[index]
  }
  return null
}
export const deleteStudent = (id: string) => {
  students = loadFromStorage("students", studentsData as Student[])
  students = students.filter((s) => s.id !== id)
  saveToStorage("students", students)
}

// Online Courses
let onlineCourses: OnlineCourse[] = initData("onlineCourses", onlineCoursesData as OnlineCourse[])
export const getOnlineCourses = () => {
  onlineCourses = loadFromStorage("onlineCourses", onlineCoursesData as OnlineCourse[])
  return onlineCourses
}
export const getOnlineCourse = (id: string) => {
  onlineCourses = loadFromStorage("onlineCourses", onlineCoursesData as OnlineCourse[])
  return onlineCourses.find((c) => c.id === id)
}
export const createOnlineCourse = (course: Omit<OnlineCourse, "id" | "createdAt" | "updatedAt">) => {
  onlineCourses = loadFromStorage("onlineCourses", onlineCoursesData as OnlineCourse[])
  const newCourse: OnlineCourse = {
    ...course,
    id: String(Date.now()),
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  }
  onlineCourses.push(newCourse)
  saveToStorage("onlineCourses", onlineCourses)
  return newCourse
}
export const updateOnlineCourse = (id: string, updates: Partial<OnlineCourse>) => {
  onlineCourses = loadFromStorage("onlineCourses", onlineCoursesData as OnlineCourse[])
  const index = onlineCourses.findIndex((c) => c.id === id)
  if (index !== -1) {
    onlineCourses[index] = { 
      ...onlineCourses[index], 
      ...updates,
      updatedAt: new Date().toISOString().split("T")[0],
    }
    saveToStorage("onlineCourses", onlineCourses)
    return onlineCourses[index]
  }
  return null
}
export const deleteOnlineCourse = (id: string) => {
  onlineCourses = loadFromStorage("onlineCourses", onlineCoursesData as OnlineCourse[])
  onlineCourses = onlineCourses.filter((c) => c.id !== id)
  saveToStorage("onlineCourses", onlineCourses)
}

// Quizzes
let quizzes: Quiz[] = initData("quizzes", quizzesData as Quiz[])
export const getQuizzes = () => {
  quizzes = loadFromStorage("quizzes", quizzesData as Quiz[])
  return quizzes
}
export const getQuiz = (id: string) => {
  quizzes = loadFromStorage("quizzes", quizzesData as Quiz[])
  return quizzes.find((q) => q.id === id)
}
export const getQuizzesByCourse = (courseId: string) => {
  quizzes = loadFromStorage("quizzes", quizzesData as Quiz[])
  return quizzes.filter((q) => q.courseId === courseId)
}
export const createQuiz = (quiz: Omit<Quiz, "id" | "createdAt">) => {
  quizzes = loadFromStorage("quizzes", quizzesData as Quiz[])
  const newQuiz: Quiz = {
    ...quiz,
    id: String(Date.now()),
    createdAt: new Date().toISOString().split("T")[0],
  }
  quizzes.push(newQuiz)
  saveToStorage("quizzes", quizzes)
  return newQuiz
}
export const updateQuiz = (id: string, updates: Partial<Quiz>) => {
  quizzes = loadFromStorage("quizzes", quizzesData as Quiz[])
  const index = quizzes.findIndex((q) => q.id === id)
  if (index !== -1) {
    quizzes[index] = { ...quizzes[index], ...updates }
    saveToStorage("quizzes", quizzes)
    return quizzes[index]
  }
  return null
}
export const deleteQuiz = (id: string) => {
  quizzes = loadFromStorage("quizzes", quizzesData as Quiz[])
  quizzes = quizzes.filter((q) => q.id !== id)
  saveToStorage("quizzes", quizzes)
}

// Certifications
let certifications: Certification[] = initData("certifications", certificationsData as Certification[])
export const getCertifications = () => {
  certifications = loadFromStorage("certifications", certificationsData as Certification[])
  return certifications
}
export const getCertification = (id: string) => {
  certifications = loadFromStorage("certifications", certificationsData as Certification[])
  return certifications.find((c) => c.id === id)
}
export const createCertification = (certification: Omit<Certification, "id" | "createdAt" | "issuedCertificates">) => {
  certifications = loadFromStorage("certifications", certificationsData as Certification[])
  const newCertification: Certification = {
    ...certification,
    id: String(Date.now()),
    createdAt: new Date().toISOString().split("T")[0],
    issuedCertificates: [],
  }
  certifications.push(newCertification)
  saveToStorage("certifications", certifications)
  return newCertification
}
export const updateCertification = (id: string, updates: Partial<Certification>) => {
  certifications = loadFromStorage("certifications", certificationsData as Certification[])
  const index = certifications.findIndex((c) => c.id === id)
  if (index !== -1) {
    certifications[index] = { ...certifications[index], ...updates }
    saveToStorage("certifications", certifications)
    return certifications[index]
  }
  return null
}
export const issueCertificate = (certificationId: string, studentId: string, issuedBy: string) => {
  certifications = loadFromStorage("certifications", certificationsData as Certification[])
  const certification = certifications.find((c) => c.id === certificationId)
  if (!certification) return null

  const certificateNumber = `CERT-${certificationId.slice(-3)}-${new Date().getFullYear()}-${String(certification.issuedCertificates.length + 1).padStart(3, "0")}`
  const issuedDate = new Date().toISOString().split("T")[0]
  const expiryDate = certification.validityPeriod
    ? new Date(new Date(issuedDate).setMonth(new Date(issuedDate).getMonth() + certification.validityPeriod)).toISOString().split("T")[0]
    : undefined

  const newCertificate = {
    id: `cert-${Date.now()}`,
    certificationId,
    studentId,
    issuedDate,
    expiryDate,
    certificateNumber,
    status: "active" as const,
    issuedBy,
  }

  certification.issuedCertificates.push(newCertificate)
  saveToStorage("certifications", certifications)
  return newCertificate
}

// Student Progress
let studentProgress: StudentProgress[] = initData("studentProgress", studentProgressData as StudentProgress[])
export const getStudentProgress = () => {
  studentProgress = loadFromStorage("studentProgress", studentProgressData as StudentProgress[])
  return studentProgress
}
export const getStudentProgressByStudent = (studentId: string) => {
  studentProgress = loadFromStorage("studentProgress", studentProgressData as StudentProgress[])
  return studentProgress.filter((p) => p.studentId === studentId)
}
export const getStudentProgressByCourse = (courseId: string) => {
  studentProgress = loadFromStorage("studentProgress", studentProgressData as StudentProgress[])
  return studentProgress.filter((p) => p.courseId === courseId)
}
export const createStudentProgress = (progress: Omit<StudentProgress, "id" | "enrolledAt" | "lastAccessedAt">) => {
  studentProgress = loadFromStorage("studentProgress", studentProgressData as StudentProgress[])
  const newProgress: StudentProgress = {
    ...progress,
    id: String(Date.now()),
    enrolledAt: new Date().toISOString().split("T")[0],
    lastAccessedAt: new Date().toISOString(),
  }
  studentProgress.push(newProgress)
  saveToStorage("studentProgress", studentProgress)
  return newProgress
}
export const updateStudentProgress = (id: string, updates: Partial<StudentProgress>) => {
  studentProgress = loadFromStorage("studentProgress", studentProgressData as StudentProgress[])
  const index = studentProgress.findIndex((p) => p.id === id)
  if (index !== -1) {
    studentProgress[index] = { 
      ...studentProgress[index], 
      ...updates,
      lastAccessedAt: new Date().toISOString(),
    }
    saveToStorage("studentProgress", studentProgress)
    return studentProgress[index]
  }
  return null
}

// Quiz Attempts
let quizAttempts: QuizAttempt[] = initData("quizAttempts", quizAttemptsData as unknown as QuizAttempt[])
export const getQuizAttempts = () => {
  quizAttempts = loadFromStorage("quizAttempts", quizAttemptsData as unknown as QuizAttempt[])
  return quizAttempts
}
export const getQuizAttemptsByStudent = (studentId: string) => {
  quizAttempts = loadFromStorage("quizAttempts", quizAttemptsData as unknown as QuizAttempt[])
  return quizAttempts.filter((a) => a.studentId === studentId)
}
export const getQuizAttemptsByQuiz = (quizId: string) => {
  quizAttempts = loadFromStorage("quizAttempts", quizAttemptsData as unknown as QuizAttempt[])
  return quizAttempts.filter((a) => a.quizId === quizId)
}
export const createQuizAttempt = (attempt: Omit<QuizAttempt, "id" | "completedAt" | "attemptNumber">) => {
  quizAttempts = loadFromStorage("quizAttempts", quizAttemptsData as unknown as QuizAttempt[])
  const existingAttempts = quizAttempts.filter((a) => a.quizId === attempt.quizId && a.studentId === attempt.studentId)
  const newAttempt: QuizAttempt = {
    ...attempt,
    id: String(Date.now()),
    completedAt: new Date().toISOString(),
    attemptNumber: existingAttempts.length + 1,
  }
  quizAttempts.push(newAttempt)
  saveToStorage("quizAttempts", quizAttempts)
  return newAttempt
}

