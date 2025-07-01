export interface Coach {
  id: string
  name: string
  phone: string // Russian format: +7 XXX XXX-XX-XX
  email: string
  photo?: string
  specializations: string[] // "Техника удара", "Подача", "Физподготовка"
  experienceYears: number
  hourlyRate: number // in rubles
  rating: number // 1-5 scale
  isActive: boolean
  createdAt: Date
  description?: string
}

export interface TrainingSession {
  id: string
  coachId: string
  courtId: string
  date: string // YYYY-MM-DD
  startTime: string // HH:mm format
  endTime: string // HH:mm format
  duration: number // minutes
  totalPrice: number // court + coach rate
  status: "available" | "booked" | "completed" | "cancelled"
  clientInfo?: {
    name: string
    phone: string
    email: string
  }
  createdAt: Date
}

export interface CoachAvailability {
  id: string
  coachId: string
  dayOfWeek: number // 0-6 (Monday-Sunday)
  startTime: string
  endTime: string
  isRecurring: boolean
  exceptions: Date[] // unavailable dates
}

export const SPECIALIZATIONS = [
  "Техника удара",
  "Подача",
  "Физподготовка",
  "Тактика игры",
  "Работа с детьми",
  "Профессиональная подготовка",
] as const
