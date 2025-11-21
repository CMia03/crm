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

export interface User {
  id: string
  username: string
  password: string
  email: string
  firstName: string
  lastName: string
  role: "admin" | "manager" | "user"
}

