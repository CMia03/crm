export interface Department {
  id: string
  name: string
  description: string
  managerId: string
  budget: number
  createdAt: string
}

export interface Position {
  id: string
  title: string
  departmentId: string
  level: string
  salaryRange: {
    min: number
    max: number
  }
  requirements: string[]
  status: "active" | "inactive"
}

export interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  positionId: string
  departmentId: string
  hireDate: string
  salary: number
  status: "active" | "inactive" | "on_leave"
  address: string
  birthDate: string
  emergencyContact: {
    name: string
    phone: string
    relation: string
  }
}

export interface Leave {
  id: string
  employeeId: string
  type: "vacation" | "sick" | "personal" | "maternity" | "paternity"
  startDate: string
  endDate: string
  days: number
  status: "pending" | "approved" | "rejected"
  reason: string
  submittedAt: string
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  rejectionReason?: string
}

export interface Evaluation {
  id: string
  employeeId: string
  evaluatorId: string
  period: string
  evaluationDate: string
  scores: {
    performance: number
    communication: number
    teamwork: number
    initiative: number
    leadership: number
  }
  overallScore: number
  strengths: string[]
  improvements: string[]
  goals: string[]
  status: "pending" | "completed"
}

export interface Training {
  id: string
  title: string
  description: string
  instructor: string
  duration: number
  date: string
  location: string
  maxParticipants: number
  participants: string[]
  status: "scheduled" | "completed" | "cancelled"
  type: "technical" | "soft-skills" | "management"
}

export interface Applicant {
  id: string
  name: string
  email: string
  phone: string
  resume: string
  status: "pending" | "interview" | "hired" | "rejected"
  appliedDate: string
  interviewDate?: string
  notes?: string
}

export interface Recruitment {
  id: string
  positionId: string
  departmentId: string
  status: "open" | "closed" | "cancelled"
  postedDate: string
  deadline: string
  applicants: Applicant[]
  hiredCandidate: string | null
}

export interface Resume {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  positionId: string // Poste pour lequel le CV est destiné
  positionTitle?: string // Titre du poste (pour affichage)
  fileUrl?: string // URL du fichier CV si uploadé
  fileContent?: string // Contenu du CV en texte
  experience: {
    company: string
    position: string
    startDate: string
    endDate?: string
    description: string
  }[]
  education: {
    institution: string
    degree: string
    field: string
    startDate: string
    endDate?: string
  }[]
  skills: string[]
  languages: {
    language: string
    level: string
  }[]
  submittedDate: string
  status: "new" | "reviewed" | "shortlisted" | "rejected"
  notes?: string
}

export interface User {
  id: string
  username: string
  password: string
  email: string
  firstName: string
  lastName: string
  role: "admin" | "manager" | "user"
}

// Module Éducation / eLearning
export interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  enrollmentDate: string
  status: "active" | "inactive" | "graduated" | "suspended"
  program?: string
  level?: string
  address?: string
  birthDate?: string
}

export interface OnlineCourse {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  duration: number // en heures
  level: "beginner" | "intermediate" | "advanced"
  price: number
  status: "draft" | "published" | "archived"
  createdAt: string
  updatedAt: string
  enrolledStudents: string[] // IDs des étudiants
  modules: CourseModule[]
  requirements?: string[]
  learningObjectives?: string[]
}

export interface CourseModule {
  id: string
  title: string
  description: string
  order: number
  content: string // URL ou contenu
  duration: number // en minutes
  type: "video" | "text" | "interactive" | "assignment"
}

export interface Quiz {
  id: string
  courseId: string
  title: string
  description: string
  questions: QuizQuestion[]
  passingScore: number // Score minimum pour réussir (en %)
  timeLimit?: number // en minutes
  attemptsAllowed: number
  status: "draft" | "published" | "archived"
  createdAt: string
}

export interface QuizQuestion {
  id: string
  question: string
  type: "multiple-choice" | "true-false" | "short-answer" | "essay"
  options?: string[] // Pour multiple-choice
  correctAnswer: string | string[]
  points: number
  explanation?: string
}

export interface QuizAttempt {
  id: string
  quizId: string
  studentId: string
  answers: Record<string, string | string[]> // questionId -> answer
  score: number
  maxScore: number
  percentage: number
  passed: boolean
  completedAt: string
  timeSpent: number // en minutes
  attemptNumber: number
}

export interface Certification {
  id: string
  title: string
  description: string
  courseId?: string
  requirements: string[] // Conditions pour obtenir la certification
  validityPeriod?: number // en mois
  issuer: string
  status: "active" | "inactive"
  createdAt: string
  issuedCertificates: IssuedCertificate[]
}

export interface IssuedCertificate {
  id: string
  certificationId: string
  studentId: string
  issuedDate: string
  expiryDate?: string
  certificateNumber: string
  status: "active" | "expired" | "revoked"
  issuedBy: string
}

export interface StudentProgress {
  id: string
  studentId: string
  courseId: string
  progress: number // en pourcentage
  completedModules: string[] // IDs des modules complétés
  lastAccessedAt: string
  enrolledAt: string
  completedAt?: string
  status: "enrolled" | "in-progress" | "completed" | "dropped"
  timeSpent: number // en minutes
  quizAttempts: string[] // IDs des tentatives de quiz
  certificates: string[] // IDs des certificats obtenus
}

