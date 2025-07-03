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
  color: string
}

export type SlotStatus =
  | "free"
  | "court_paid"
  | "court_unpaid"
  | "training_paid"
  | "training_unpaid"
  | "trainer_reserved"
  | "blocked"

export interface MergedSlot {
  id: string
  startTime: string
  endTime: string
  duration: number
  totalPrice: number
  spanSlots: number
  originalSlots: BookingSlot[]
}

export interface BookingSlot {
  id: string
  courtId: string
  date: string
  time: string
  status: SlotStatus
  clientName?: string
  clientPhone?: string
  clientEmail?: string
  trainerName?: string
  price?: number
  duration?: number
  notes?: string
  blockReason?: string
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

export interface Client {
  id: string
  name: string
  phone: string
  email?: string
  totalBookings: number
  totalSpent: number
  status: "active" | "vip" | "inactive"
  lastBooking: string
  registrationDate: string
}

export const SPECIALIZATIONS = [
  "Техника удара",
  "Подача",
  "Физподготовка",
  "Тактика игры",
  "Работа с детьми",
  "Профессиональная подготовка",
] as const
