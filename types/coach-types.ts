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

export enum SlotStatus {
  FREE = "free",
  COURT_PAID = "court_paid",
  COURT_UNPAID = "court_unpaid",
  TRAINING_PAID = "training_paid",
  TRAINING_UNPAID = "training_unpaid",
  TRAINER_RESERVED = "trainer_reserved",
  BLOCKED = "blocked",
}

export interface BookingSlot {
  id: string
  courtId: string
  date: string
  time: string
  status: SlotStatus
  price?: number
  clientName?: string
  trainerName?: string
  paymentStatus?: "paid" | "unpaid"
  blockReason?: string
  duration?: number
  clientPhone?: string
  clientEmail?: string
  notes?: string
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
  paymentStatus?: "paid" | "unpaid"
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

export interface DailyFinancials {
  totalPaid: number
  totalUnpaid: number
  unpaidCount: number
  occupancyRate: number
}

export const SPECIALIZATIONS = [
  "Техника удара",
  "Подача",
  "Физподготовка",
  "Тактика игры",
  "Работа с детьми",
  "Профессиональная подготовка",
] as const
