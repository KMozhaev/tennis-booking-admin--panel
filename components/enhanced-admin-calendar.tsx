"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Clock, Plus, Search } from "lucide-react"
import { FinancialSummary } from "./financial-summary"
import { BookingFilters, type FilterType } from "./booking-filters"
import type { BookingSlot, SlotStatus, DailyFinancials, MergedSlot } from "../types/coach-types"

// Existing interfaces remain the same
interface Booking {
  id: string
  courtId: string
  date: string
  timeSlots: string[]
  duration: number
  clientName: string
  clientPhone: string
  clientEmail?: string
  totalPrice: number
  status: "confirmed" | "pending"
  paymentMethod?: "online" | "onsite"
  createdBy: "system" | "admin"
  notes?: string
}

interface Court {
  id: string
  name: string
  type: "clay" | "hard" | "indoor"
  basePrice: number
}

interface Client {
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

interface NewBooking {
  courtId: string
  startTime: string
  date: string
  clientId?: string
  clientName: string
  clientPhone: string
  clientEmail?: string
  duration: number
  notes: string
  bookingType: "court" | "training_with_coach"
}

interface NewTrainingSession {
  coachId: string
  courtId: string
  date: string
  startTime: string
  duration: number
  recurring: "none" | "daily" | "weekly" | "custom"
  recurringDays?: string[]
  recurringEndDate?: string
}

interface SlotClickChoice {
  courtId: string
  time: string
  date: string
}

interface ClientBookingForm {
  sessionId: string
  clientId?: string
  clientName: string
  clientPhone: string
  clientEmail?: string
  notes: string
}

// Demo data with updated realistic information - Updated to July 2025
const COURTS: Court[] = [
  { id: "1", name: "Корт 1 (Хард)", type: "hard", basePrice: 600 },
  { id: "2", name: "Корт 2 (Хард)", type: "hard", basePrice: 480 },
  { id: "3", name: "Корт 3 (Грунт)", type: "clay", basePrice: 720 },
  { id: "4", name: "Корт 4 (Грунт)", type: "clay", basePrice: 600 },
  { id: "5", name: "Корт 5 (Крытый)", type: "indoor", basePrice: 480 },
]

// Enhanced demo clients with realistic recent data
const DEMO_CLIENTS: Client[] = [
  {
    id: "1",
    name: "Анна Петрова",
    phone: "+7 916 123-45-67",
    email: "anna.petrova@email.ru",
    totalBookings: 24,
    totalSpent: 48600,
    status: "vip",
    lastBooking: "2025-07-01",
    registrationDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Михаил Иванов",
    phone: "+7 903 987-65-43",
    email: "mikhail.ivanov@email.ru",
    totalBookings: 12,
    totalSpent: 18900,
    status: "active",
    lastBooking: "2025-06-28",
    registrationDate: "2024-03-10",
  },
  {
    id: "3",
    name: "Елена Смирнова",
    phone: "+7 925 456-78-90",
    email: "elena.smirnova@email.ru",
    totalBookings: 8,
    totalSpent: 12400,
    status: "active",
    lastBooking: "2025-06-25",
    registrationDate: "2024-04-05",
  },
  {
    id: "4",
    name: "Дмитрий Козлов",
    phone: "+7 917 234-56-78",
    email: "dmitry.kozlov@email.ru",
    totalBookings: 45,
    totalSpent: 89200,
    status: "vip",
    lastBooking: "2025-06-30",
    registrationDate: "2023-08-20",
  },
  {
    id: "5",
    name: "Ольга Васильева",
    phone: "+7 912 345-67-89",
    totalBookings: 3,
    totalSpent: 4500,
    status: "inactive",
    lastBooking: "2025-05-15",
    registrationDate: "2024-05-01",
  },
]

// Comprehensive demo data with 60%+ occupancy - Updated to July 2025
const ENHANCED_DEMO_DATA: BookingSlot[] = [
  // Morning slots (08:00-12:00) - 40-50% occupancy
  {
    id: "demo_001",
    courtId: "1",
    date: "2025-07-03",
    time: "08:00",
    status: "court_paid" as SlotStatus,
    clientName: "Анна Петрова",
    clientPhone: "+7 916 123-45-67",
    price: 1200,
    duration: 60,
  },
  {
    id: "demo_002",
    courtId: "1",
    date: "2025-07-03",
    time: "08:30",
    status: "court_paid" as SlotStatus,
    clientName: "Анна Петрова",
    clientPhone: "+7 916 123-45-67",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_003",
    courtId: "2",
    date: "2025-07-03",
    time: "09:00",
    status: "training_paid" as SlotStatus,
    trainerName: "Дмитрий Козлов",
    clientName: "Михаил Иванов",
    clientPhone: "+7 903 987-65-43",
    price: 2500,
    duration: 90,
  },
  {
    id: "demo_004",
    courtId: "2",
    date: "2025-07-03",
    time: "09:30",
    status: "training_paid" as SlotStatus,
    trainerName: "Дмитрий Козлов",
    clientName: "Михаил Иванов",
    clientPhone: "+7 903 987-65-43",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_005",
    courtId: "2",
    date: "2025-07-03",
    time: "10:00",
    status: "training_paid" as SlotStatus,
    trainerName: "Дмитрий Козлов",
    clientName: "Михаил Иванов",
    clientPhone: "+7 903 987-65-43",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_006",
    courtId: "3",
    date: "2025-07-03",
    time: "10:30",
    status: "court_unpaid" as SlotStatus,
    clientName: "Елена Смирнова",
    clientPhone: "+7 925 456-78-90",
    price: 1440,
    duration: 60,
  },
  {
    id: "demo_007",
    courtId: "3",
    date: "2025-07-03",
    time: "11:00",
    status: "court_unpaid" as SlotStatus,
    clientName: "Елена Смирнова",
    clientPhone: "+7 925 456-78-90",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_008",
    courtId: "4",
    date: "2025-07-03",
    time: "11:30",
    status: "trainer_reserved" as SlotStatus,
    trainerName: "Анна Петрова",
    duration: 60,
  },

  // Afternoon slots (12:00-18:00) - 60-70% occupancy
  {
    id: "demo_009",
    courtId: "1",
    date: "2025-07-03",
    time: "12:00",
    status: "court_paid" as SlotStatus,
    clientName: "Игорь Соколов",
    clientPhone: "+7 921 456-78-90",
    price: 1200,
    duration: 90,
  },
  {
    id: "demo_010",
    courtId: "1",
    date: "2025-07-03",
    time: "12:30",
    status: "court_paid" as SlotStatus,
    clientName: "Игорь Соколов",
    clientPhone: "+7 921 456-78-90",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_011",
    courtId: "1",
    date: "2025-07-03",
    time: "13:00",
    status: "court_paid" as SlotStatus,
    clientName: "Игорь Соколов",
    clientPhone: "+7 921 456-78-90",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_012",
    courtId: "2",
    date: "2025-07-03",
    time: "13:30",
    status: "training_unpaid" as SlotStatus,
    trainerName: "Елена Сидорова",
    clientName: "Мария Федорова",
    clientPhone: "+7 915 789-01-23",
    price: 2200,
    duration: 60,
  },
  {
    id: "demo_013",
    courtId: "2",
    date: "2025-07-03",
    time: "14:00",
    status: "training_unpaid" as SlotStatus,
    trainerName: "Елена Сидорова",
    clientName: "Мария Федорова",
    clientPhone: "+7 915 789-01-23",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_014",
    courtId: "3",
    date: "2025-07-03",
    time: "14:30",
    status: "court_paid" as SlotStatus,
    clientName: "Сергей Николаев",
    clientPhone: "+7 926 678-90-12",
    price: 1440,
    duration: 60,
  },
  {
    id: "demo_015",
    courtId: "3",
    date: "2025-07-03",
    time: "15:00",
    status: "court_paid" as SlotStatus,
    clientName: "Сергей Николаев",
    clientPhone: "+7 926 678-90-12",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_016",
    courtId: "4",
    date: "2025-07-03",
    time: "15:30",
    status: "training_paid" as SlotStatus,
    trainerName: "Михаил Иванов",
    clientName: "Татьяна Морозова",
    clientPhone: "+7 918 345-67-89",
    price: 2800,
    duration: 90,
  },
  {
    id: "demo_017",
    courtId: "4",
    date: "2025-07-03",
    time: "16:00",
    status: "training_paid" as SlotStatus,
    trainerName: "Михаил Иванов",
    clientName: "Татьяна Морозова",
    clientPhone: "+7 918 345-67-89",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_018",
    courtId: "4",
    date: "2025-07-03",
    time: "16:30",
    status: "training_paid" as SlotStatus,
    trainerName: "Михаил Иванов",
    clientName: "Татьяна Морозова",
    clientPhone: "+7 918 345-67-89",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_019",
    courtId: "5",
    date: "2025-07-03",
    time: "17:00",
    status: "court_unpaid" as SlotStatus,
    clientName: "Александр Волков",
    clientPhone: "+7 909 234-56-78",
    price: 960,
    duration: 60,
  },
  {
    id: "demo_020",
    courtId: "5",
    date: "2025-07-03",
    time: "17:30",
    status: "court_unpaid" as SlotStatus,
    clientName: "Александр Волков",
    clientPhone: "+7 909 234-56-78",
    price: 0,
    duration: 60,
  },

  // Peak evening slots (18:00-22:00) - 80-90% occupancy
  {
    id: "demo_021",
    courtId: "1",
    date: "2025-07-03",
    time: "18:00",
    status: "training_paid" as SlotStatus,
    trainerName: "Дмитрий Козлов",
    clientName: "Виктор Петров",
    clientPhone: "+7 916 111-22-33",
    price: 3000,
    duration: 120,
  },
  {
    id: "demo_022",
    courtId: "1",
    date: "2025-07-03",
    time: "18:30",
    status: "training_paid" as SlotStatus,
    trainerName: "Дмитрий Козлов",
    clientName: "Виктор Петров",
    clientPhone: "+7 916 111-22-33",
    price: 0,
    duration: 120,
  },
  {
    id: "demo_023",
    courtId: "1",
    date: "2025-07-03",
    time: "19:00",
    status: "training_paid" as SlotStatus,
    trainerName: "Дмитрий Козлов",
    clientName: "Виктор Петров",
    clientPhone: "+7 916 111-22-33",
    price: 0,
    duration: 120,
  },
  {
    id: "demo_024",
    courtId: "1",
    date: "2025-07-03",
    time: "19:30",
    status: "training_paid" as SlotStatus,
    trainerName: "Дмитрий Козлов",
    clientName: "Виктор Петров",
    clientPhone: "+7 916 111-22-33",
    price: 0,
    duration: 120,
  },
  {
    id: "demo_025",
    courtId: "2",
    date: "2025-07-03",
    time: "18:30",
    status: "court_paid" as SlotStatus,
    clientName: "Наталья Кузнецова",
    clientPhone: "+7 925 444-55-66",
    price: 1560,
    duration: 90,
  },
  {
    id: "demo_026",
    courtId: "2",
    date: "2025-07-03",
    time: "19:00",
    status: "court_paid" as SlotStatus,
    clientName: "Наталья Кузнецова",
    clientPhone: "+7 925 444-55-66",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_027",
    courtId: "2",
    date: "2025-07-03",
    time: "19:30",
    status: "court_paid" as SlotStatus,
    clientName: "Наталья Кузнецова",
    clientPhone: "+7 925 444-55-66",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_028",
    courtId: "3",
    date: "2025-07-03",
    time: "18:00",
    status: "training_unpaid" as SlotStatus,
    trainerName: "Анна Петрова",
    clientName: "Олег Смирнов",
    clientPhone: "+7 917 777-88-99",
    price: 2500,
    duration: 60,
  },
  {
    id: "demo_029",
    courtId: "3",
    date: "2025-07-03",
    time: "18:30",
    status: "training_unpaid" as SlotStatus,
    trainerName: "Анна Петрова",
    clientName: "Олег Смирнов",
    clientPhone: "+7 917 777-88-99",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_030",
    courtId: "3",
    date: "2025-07-03",
    time: "19:30",
    status: "court_paid" as SlotStatus,
    clientName: "Ирина Васильева",
    clientPhone: "+7 903 333-44-55",
    price: 1872,
    duration: 60,
  },
  {
    id: "demo_031",
    courtId: "3",
    date: "2025-07-03",
    time: "20:00",
    status: "court_paid" as SlotStatus,
    clientName: "Ирина Васильева",
    clientPhone: "+7 903 333-44-55",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_032",
    courtId: "4",
    date: "2025-07-03",
    time: "19:00",
    status: "trainer_reserved" as SlotStatus,
    trainerName: "Елена Сидорова",
    duration: 90,
  },
  {
    id: "demo_033",
    courtId: "4",
    date: "2025-07-03",
    time: "19:30",
    status: "trainer_reserved" as SlotStatus,
    trainerName: "Елена Сидорова",
    duration: 90,
  },
  {
    id: "demo_034",
    courtId: "4",
    date: "2025-07-03",
    time: "20:00",
    status: "trainer_reserved" as SlotStatus,
    trainerName: "Елена Сидорова",
    duration: 90,
  },
  {
    id: "demo_035",
    courtId: "5",
    date: "2025-07-03",
    time: "18:30",
    status: "court_unpaid" as SlotStatus,
    clientName: "Павел Морозов",
    clientPhone: "+7 926 666-77-88",
    price: 1248,
    duration: 90,
  },
  {
    id: "demo_036",
    courtId: "5",
    date: "2025-07-03",
    time: "19:00",
    status: "court_unpaid" as SlotStatus,
    clientName: "Павел Морозов",
    clientPhone: "+7 926 666-77-88",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_037",
    courtId: "5",
    date: "2025-07-03",
    time: "19:30",
    status: "court_unpaid" as SlotStatus,
    clientName: "Павел Морозов",
    clientPhone: "+7 926 666-77-88",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_038",
    courtId: "5",
    date: "2025-07-03",
    time: "20:30",
    status: "training_paid" as SlotStatus,
    trainerName: "Михаил Иванов",
    clientName: "Светлана Попова",
    clientPhone: "+7 915 222-33-44",
    price: 2800,
    duration: 60,
  },
  {
    id: "demo_039",
    courtId: "5",
    date: "2025-07-03",
    time: "21:00",
    status: "training_paid" as SlotStatus,
    trainerName: "Михаил Иванов",
    clientName: "Светлана Попова",
    clientPhone: "+7 915 222-33-44",
    price: 0,
    duration: 60,
  },

  // Additional scattered bookings for realistic distribution
  {
    id: "demo_040",
    courtId: "2",
    date: "2025-07-03",
    time: "20:30",
    status: "court_paid" as SlotStatus,
    clientName: "Андрей Козлов",
    clientPhone: "+7 917 888-99-00",
    price: 1248,
    duration: 60,
  },
  {
    id: "demo_041",
    courtId: "2",
    date: "2025-07-03",
    time: "21:00",
    status: "court_paid" as SlotStatus,
    clientName: "Андрей Козлов",
    clientPhone: "+7 917 888-99-00",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_042",
    courtId: "1",
    date: "2025-07-03",
    time: "20:30",
    status: "court_unpaid" as SlotStatus,
    clientName: "Юлия Сидорова",
    clientPhone: "+7 925 555-66-77",
    price: 1560,
    duration: 60,
  },
  {
    id: "demo_043",
    courtId: "1",
    date: "2025-07-03",
    time: "21:00",
    status: "court_unpaid" as SlotStatus,
    clientName: "Юлия Сидорова",
    clientPhone: "+7 925 555-66-77",
    price: 0,
    duration: 60,
  },
]

const COACHES = [
  { id: "1", name: "Анна Петрова", hourlyRate: 2500, color: "#8B5CF6" },
  { id: "2", name: "Дмитрий Козлов", hourlyRate: 3000, color: "#10B981" },
  { id: "3", name: "Елена Сидорова", hourlyRate: 2200, color: "#F59E0B" },
  { id: "4", name: "Михаил Иванов", hourlyRate: 2800, color: "#EF4444" },
]

// Generate time slots with 30-minute intervals only
const TIME_SLOTS: string[] = []
for (let hour = 8; hour < 22; hour++) {
  TIME_SLOTS.push(`${hour.toString().padStart(2, "0")}:00`)
  TIME_SLOTS.push(`${hour.toString().padStart(2, "0")}:30`)
}

// Utility functions
const getSlotColors = (status: SlotStatus) => {
  switch (status) {
    case "free":
      return "bg-gray-50 hover:bg-blue-50 text-gray-700 border border-gray-200"
    case "court_paid":
      return "bg-blue-500 text-white hover:bg-blue-600"
    case "court_unpaid":
      return "bg-blue-300 text-white hover:bg-blue-400"
    case "training_paid":
      return "bg-purple-500 text-white hover:bg-purple-600"
    case "training_unpaid":
      return "bg-purple-400 text-white hover:bg-purple-500"
    case "trainer_reserved":
      return "bg-green-500 text-white hover:bg-green-600"
    case "blocked":
      return "bg-red-500 text-white hover:bg-red-600"
    default:
      return "bg-gray-50 hover:bg-blue-50 text-gray-700"
  }
}

// Slot merging algorithm for training sessions
const mergeTrainingSlots = (slots: BookingSlot[], courtId: string, date: string): MergedSlot[] => {
  const courtSlots = slots.filter((s) => s.courtId === courtId && s.date === date)
  const mergedSlots: MergedSlot[] = []
  const processed = new Set<string>()

  for (const slot of courtSlots) {
    if (processed.has(slot.id) || (!slot.status.includes("training") && slot.status !== "trainer_reserved")) {
      continue
    }

    // Find consecutive slots for same trainer/client
    const consecutiveSlots = [slot]
    processed.add(slot.id)

    let currentTime = slot.time
    while (true) {
      const [hours, minutes] = currentTime.split(":").map(Number)
      const nextMinutes = minutes + 30
      const nextHours = hours + Math.floor(nextMinutes / 60)
      const finalMinutes = nextMinutes % 60
      const nextTime = `${nextHours.toString().padStart(2, "0")}:${finalMinutes.toString().padStart(2, "0")}`

      const nextSlot = courtSlots.find(
        (s) =>
          s.time === nextTime &&
          s.trainerName === slot.trainerName &&
          s.clientName === slot.clientName &&
          s.status === slot.status &&
          !processed.has(s.id),
      )

      if (!nextSlot) break

      consecutiveSlots.push(nextSlot)
      processed.add(nextSlot.id)
      currentTime = nextTime
    }

    if (consecutiveSlots.length > 1) {
      const totalPrice = consecutiveSlots.reduce((sum, s) => sum + (s.price || 0), 0)
      const duration = consecutiveSlots.length * 30

      mergedSlots.push({
        id: `merged-${slot.id}`,
        startTime: slot.time,
        endTime: consecutiveSlots[consecutiveSlots.length - 1].time,
        duration,
        totalPrice,
        spanSlots: consecutiveSlots.length,
        originalSlots: consecutiveSlots,
      })
    }
  }

  return mergedSlots
}

// Court booking slot merging algorithm
const mergeCourtBookingSlots = (slots: BookingSlot[], courtId: string, date: string): MergedSlot[] => {
  const courtSlots = slots.filter((s) => s.courtId === courtId && s.date === date)
  const mergedSlots: MergedSlot[] = []
  const processed = new Set<string>()

  for (const slot of courtSlots) {
    if (processed.has(slot.id) || !slot.status.includes("court")) {
      continue
    }

    // Find consecutive slots for same client
    const consecutiveSlots = [slot]
    processed.add(slot.id)

    let currentTime = slot.time
    while (true) {
      const [hours, minutes] = currentTime.split(":").map(Number)
      const nextMinutes = minutes + 30
      const nextHours = hours + Math.floor(nextMinutes / 60)
      const finalMinutes = nextMinutes % 60
      const nextTime = `${nextHours.toString().padStart(2, "0")}:${finalMinutes.toString().padStart(2, "0")}`

      const nextSlot = courtSlots.find(
        (s) =>
          s.time === nextTime && s.clientName === slot.clientName && s.status === slot.status && !processed.has(s.id),
      )

      if (!nextSlot) break

      consecutiveSlots.push(nextSlot)
      processed.add(nextSlot.id)
      currentTime = nextTime
    }

    if (consecutiveSlots.length > 1) {
      const totalPrice = consecutiveSlots.reduce((sum, s) => sum + (s.price || 0), 0)
      const duration = consecutiveSlots.length * 30

      mergedSlots.push({
        id: `merged-court-${slot.id}`,
        startTime: slot.time,
        endTime: consecutiveSlots[consecutiveSlots.length - 1].time,
        duration,
        totalPrice,
        spanSlots: consecutiveSlots.length,
        originalSlots: consecutiveSlots,
      })
    }
  }

  return mergedSlots
}

// Isolated slot prevention algorithm
const validateSlotBooking = (
  slots: BookingSlot[],
  courtId: string,
  date: string,
  startTime: string,
  duration: number,
): {
  isValid: boolean
  suggestion?: string
  reason?: string
} => {
  const slotsNeeded = duration / 30
  const courtSlots = slots.filter((s) => s.courtId === courtId && s.date === date && s.status !== "free")

  // Check for isolated slots that would be created
  for (let i = 0; i < slotsNeeded; i++) {
    const [hours, minutes] = startTime.split(":").map(Number)
    const slotMinutes = minutes + i * 30
    const slotHours = hours + Math.floor(slotMinutes / 60)
    const finalMinutes = slotMinutes % 60
    const currentSlotTime = `${slotHours.toString().padStart(2, "0")}:${finalMinutes.toString().padStart(2, "0")}`

    // Check previous slot
    const prevMinutes = finalMinutes - 30
    const prevHours = slotHours + Math.floor(prevMinutes / 60)
    const prevFinalMinutes = prevMinutes < 0 ? 60 + prevMinutes : prevMinutes
    const prevTime = `${(prevHours < 0 ? 23 : prevHours).toString().padStart(2, "0")}:${prevFinalMinutes.toString().padStart(2, "0")}`

    // Check next slot after booking end
    const nextMinutes = finalMinutes + 30
    const nextHours = slotHours + Math.floor(nextMinutes / 60)
    const nextFinalMinutes = nextMinutes % 60
    const nextTime = `${nextHours.toString().padStart(2, "0")}:${nextFinalMinutes.toString().padStart(2, "0")}`

    const prevSlot = courtSlots.find((s) => s.time === prevTime)
    const nextSlot = courtSlots.find((s) => s.time === nextTime)

    // Check if we would create a 30-minute gap
    if (prevSlot && nextSlot) {
      const timeBetweenPrevAndNext = getTimeDifference(prevTime, nextTime)
      if (timeBetweenPrevAndNext === 60) {
        // Would create isolated 30-minute slot
        return {
          isValid: false,
          suggestion: `Рекомендуем забронировать на ${duration + 30} минут или выбрать другое время`,
          reason: "Бронирование создаст изолированный 30-минутный слот",
        }
      }
    }
  }

  return { isValid: true }
}

const getTimeDifference = (time1: string, time2: string): number => {
  const [h1, m1] = time1.split(":").map(Number)
  const [h2, m2] = time2.split(":").map(Number)
  return h2 * 60 + m2 - (h1 * 60 + m1)
}

export function EnhancedAdminCalendar() {
  const [selectedDate, setSelectedDate] = useState("2025-07-03")
  const [courtTypeFilter, setCourtTypeFilter] = useState<"all" | "hard" | "clay" | "indoor">("all")
  const [activeFilters, setActiveFilters] = useState<FilterType[]>(["all"])
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showTrainingModal, setShowTrainingModal] = useState(false)
  const [showSlotChoiceModal, setShowSlotChoiceModal] = useState(false)
  const [showClientBookingModal, setShowClientBookingModal] = useState(false)
  const [slotClickData, setSlotClickData] = useState<SlotClickChoice | null>(null)
  const [bookingSlots, setBookingSlots] = useState<BookingSlot[]>(ENHANCED_DEMO_DATA)
  const [clients] = useState<Client[]>(DEMO_CLIENTS)
  const [clientSearch, setClientSearch] = useState("")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [newBooking, setNewBooking] = useState<NewBooking>({
    courtId: "",
    startTime: "",
    date: "",
    clientId: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    duration: 60,
    notes: "",
    bookingType: "court",
  })
  const [newTrainingSession, setNewTrainingSession] = useState<NewTrainingSession>({
    coachId: "",
    courtId: "",
    date: "",
    startTime: "",
    duration: 60,
    recurring: "none",
    recurringDays: [],
    recurringEndDate: "",
  })
  const [clientBookingForm, setClientBookingForm] = useState<ClientBookingForm>({
    sessionId: "",
    clientId: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    notes: "",
  })

  // Calculate daily financials with mathematical accuracy
  const dailyFinancials = useMemo((): DailyFinancials => {
    const daySlots = bookingSlots.filter((slot) => slot.date === selectedDate)
    const totalSlots = COURTS.length * TIME_SLOTS.length
    const occupiedSlots = daySlots.filter((slot) => slot.status !== "free").length

    const totalPaid = daySlots
      .filter((slot) => slot.status === "court_paid" || slot.status === "training_paid")
      .reduce((sum, slot) => sum + (slot.price || 0), 0)

    const totalUnpaid = daySlots
      .filter((slot) => slot.status === "court_unpaid" || slot.status === "training_unpaid")
      .reduce((sum, slot) => sum + (slot.price || 0), 0)

    const unpaidCount = daySlots.filter(
      (slot) => slot.status === "court_unpaid" || slot.status === "training_unpaid",
    ).length

    return {
      totalPaid,
      totalUnpaid,
      unpaidCount,
      occupancyRate: Math.round((occupiedSlots / totalSlots) * 100),
    }
  }, [bookingSlots, selectedDate])

  // Filter courts based on type
  const filteredCourts = useMemo(() => {
    if (courtTypeFilter === "all") return COURTS
    return COURTS.filter((court) => court.type === courtTypeFilter)
  }, [courtTypeFilter])

  // Filter clients for search
  const filteredClients = useMemo(() => {
    if (!clientSearch) return []
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
        client.phone.includes(clientSearch) ||
        (client.email && client.email.toLowerCase().includes(clientSearch.toLowerCase())),
    )
  }, [clients, clientSearch])

  // Get merged slots for each court
  const mergedSlotsByCourtAndDate = useMemo(() => {
    const merged: Record<string, MergedSlot[]> = {}
    for (const court of COURTS) {
      const key = `${court.id}-${selectedDate}`
      merged[key] = mergeTrainingSlots(bookingSlots, court.id, selectedDate)
    }
    return merged
  }, [bookingSlots, selectedDate])

  // Get merged court booking slots for each court
  const mergedCourtSlotsByCourtAndDate = useMemo(() => {
    const merged: Record<string, MergedSlot[]> = {}
    for (const court of COURTS) {
      const key = `${court.id}-${selectedDate}`
      merged[key] = mergeCourtBookingSlots(bookingSlots, court.id, selectedDate)
    }
    return merged
  }, [bookingSlots, selectedDate])

  // Get slot data for specific court and time
  const getSlotData = (courtId: string, date: string, time: string): BookingSlot => {
    const existingSlot = bookingSlots.find(
      (slot) => slot.courtId === courtId && slot.date === date && slot.time === time,
    )

    if (existingSlot) {
      return existingSlot
    }

    // Return free slot with calculated price
    const court = COURTS.find((c) => c.id === courtId)
    const price = court ? calculateSlotPrice(court.basePrice, time) : 0

    return {
      id: `free-${courtId}-${time}`,
      courtId,
      date,
      time,
      status: "free" as SlotStatus,
      price,
    }
  }

  // Check if slot is part of a merged session (training or court)
  const isSlotMerged = (courtId: string, time: string): MergedSlot | null => {
    const mergedTrainingSlots = mergedSlotsByCourtAndDate[`${courtId}-${selectedDate}`] || []
    const mergedCourtSlots = mergedCourtSlotsByCourtAndDate[`${courtId}-${selectedDate}`] || []

    return (
      mergedTrainingSlots.find((merged) => merged.originalSlots.some((slot) => slot.time === time)) ||
      mergedCourtSlots.find((merged) => merged.originalSlots.some((slot) => slot.time === time)) ||
      null
    )
  }

  // Check if slot is the first slot of a merged training session
  const isFirstSlotOfMerged = (courtId: string, time: string): boolean => {
    const merged = isSlotMerged(courtId, time)
    return merged ? merged.startTime === time : false
  }

  // Filter slots based on active filters
  const shouldShowSlot = (slot: BookingSlot): boolean => {
    if (activeFilters.includes("all")) return true

    if (activeFilters.includes("booked_courts") && (slot.status === "court_paid" || slot.status === "court_unpaid")) {
      return true
    }

    if (activeFilters.includes("unpaid") && (slot.status === "court_unpaid" || slot.status === "training_unpaid")) {
      return true
    }

    if (
      activeFilters.includes("booked_trainings") &&
      (slot.status === "training_paid" || slot.status === "training_unpaid")
    ) {
      return true
    }

    if (activeFilters.includes("available_trainings") && slot.status === "trainer_reserved") {
      return true
    }

    return false
  }

  const calculateSlotPrice = (basePrice: number, time: string): number => {
    const hour = Number.parseInt(time.split(":")[0])
    let multiplier = 1.0
    if (hour >= 8 && hour < 16) multiplier = 0.8
    else if (hour >= 16 && hour < 19) multiplier = 1.0
    else if (hour >= 19 && hour < 22) multiplier = 1.3
    return Math.round(basePrice * multiplier)
  }

  const getCoachInfo = (coachId: string) => {
    return COACHES.find((c) => c.id === coachId)
  }

  const handleSlotClick = (slot: BookingSlot) => {
    if (slot.status === "free") {
      // Empty slot clicked - show choice modal
      setSlotClickData({ courtId: slot.courtId, time: slot.time, date: selectedDate })
      setShowSlotChoiceModal(true)
    } else if (slot.status === "trainer_reserved") {
      // Open client booking form for trainer reserved slot
      setClientBookingForm({
        sessionId: slot.id,
        clientId: "",
        clientName: "",
        clientPhone: "",
        clientEmail: "",
        notes: "",
      })
      setShowClientBookingModal(true)
    } else {
      // Show slot details
      setSelectedSlot(slot)
    }
  }

  const handleSlotChoiceSelection = (choice: "court" | "training") => {
    if (!slotClickData) return

    setShowSlotChoiceModal(false)

    if (choice === "court") {
      setNewBooking({
        ...newBooking,
        courtId: slotClickData.courtId,
        startTime: slotClickData.time,
        date: slotClickData.date,
        bookingType: "court",
      })
      setShowBookingModal(true)
    } else {
      setNewTrainingSession({
        ...newTrainingSession,
        courtId: slotClickData.courtId,
        startTime: slotClickData.time,
        date: slotClickData.date,
      })
      setShowTrainingModal(true)
    }
  }

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client)
    setNewBooking({
      ...newBooking,
      clientId: client.id,
      clientName: client.name,
      clientPhone: client.phone,
      clientEmail: client.email || "",
    })
    setClientSearch("")
  }

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const court = COURTS.find((c) => c.id === newBooking.courtId)
    const price = court ? calculateSlotPrice(court.basePrice, newBooking.startTime) : 0

    // Validate slot booking to prevent isolated slots
    const validation = validateSlotBooking(
      bookingSlots,
      newBooking.courtId,
      newBooking.date,
      newBooking.startTime,
      newBooking.duration,
    )

    if (!validation.isValid) {
      if (confirm(`${validation.reason}\n\n${validation.suggestion}\n\nВы хотите продолжить с текущими параметрами?`)) {
        // User chose to proceed despite warning
      } else {
        return // Cancel booking
      }
    }

    // Generate slots based on duration and booking type
    const slotsNeeded = newBooking.duration / 30
    const newSlots: BookingSlot[] = []

    for (let i = 0; i < slotsNeeded; i++) {
      const [hours, minutes] = newBooking.startTime.split(":").map(Number)
      const slotMinutes = minutes + i * 30
      const slotHours = hours + Math.floor(slotMinutes / 60)
      const finalMinutes = slotMinutes % 60
      const slotTime = `${slotHours.toString().padStart(2, "0")}:${finalMinutes.toString().padStart(2, "0")}`

      let status: SlotStatus
      let trainerName: string | undefined

      if (newBooking.bookingType === "training_with_coach") {
        status = "training_unpaid" as SlotStatus
        const coach = COACHES.find((c) => c.id === newBooking.coachId)
        trainerName = coach?.name
      } else {
        status = "court_unpaid" as SlotStatus
      }

      newSlots.push({
        id: `${Date.now()}-${i}`,
        courtId: newBooking.courtId,
        date: newBooking.date,
        time: slotTime,
        status,
        clientName: newBooking.clientName,
        clientPhone: newBooking.clientPhone,
        clientEmail: newBooking.clientEmail,
        trainerName,
        price: i === 0 ? price * slotsNeeded : 0, // Only first slot has price
        duration: newBooking.duration,
        notes: newBooking.notes,
      })
    }

    setBookingSlots([
      ...bookingSlots.filter(
        (s) => !newSlots.some((ns) => ns.courtId === s.courtId && ns.date === s.date && ns.time === s.time),
      ),
      ...newSlots,
    ])

    setShowBookingModal(false)
    setNewBooking({
      courtId: "",
      startTime: "",
      date: selectedDate,
      clientId: "",
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      duration: 60,
      notes: "",
      bookingType: "court",
    })
    setSelectedClient(null)
  }

  const handleClientBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Update trainer reserved slot to training session with proper purple coloring
    setBookingSlots(
      bookingSlots.map((slot) =>
        slot.id === clientBookingForm.sessionId
          ? {
              ...slot,
              status: "training_unpaid" as SlotStatus,
              clientName: clientBookingForm.clientName,
              clientPhone: clientBookingForm.clientPhone,
              clientEmail: clientBookingForm.clientEmail,
              notes: clientBookingForm.notes,
            }
          : slot,
      ),
    )

    setShowClientBookingModal(false)
    setClientBookingForm({
      sessionId: "",
      clientId: "",
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      notes: "",
    })
  }

  const handleTrainingSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const coach = COACHES.find((c) => c.id === newTrainingSession.coachId)

    // Enforce minimum 60 minutes (2 slots) for training sessions
    const slotsNeeded = Math.max(2, newTrainingSession.duration / 30)
    const actualDuration = slotsNeeded * 30
    const newSlots: BookingSlot[] = []

    for (let i = 0; i < slotsNeeded; i++) {
      const [hours, minutes] = newTrainingSession.startTime.split(":").map(Number)
      const slotMinutes = minutes + i * 30
      const slotHours = hours + Math.floor(slotMinutes / 60)
      const finalMinutes = slotMinutes % 60
      const slotTime = `${slotHours.toString().padStart(2, "0")}:${finalMinutes.toString().padStart(2, "0")}`

      newSlots.push({
        id: `${Date.now()}-${i}`,
        courtId: newTrainingSession.courtId,
        date: newTrainingSession.date,
        time: slotTime,
        status: "trainer_reserved" as SlotStatus,
        trainerName: coach?.name,
        duration: actualDuration,
      })
    }

    setBookingSlots([
      ...bookingSlots.filter(
        (s) => !newSlots.some((ns) => ns.courtId === s.courtId && ns.date === s.date && ns.time === s.time),
      ),
      ...newSlots,
    ])

    setShowTrainingModal(false)
    setNewTrainingSession({
      coachId: "",
      courtId: "",
      date: selectedDate,
      startTime: "",
      duration: 60,
      recurring: "none",
      recurringDays: [],
      recurringEndDate: "",
    })
  }

  const renderSlotContent = (slot: BookingSlot, merged?: MergedSlot) => {
    if (merged) {
      const originalSlot = merged.originalSlots[0]

      // Handle merged court bookings
      if (originalSlot.status.includes("court")) {
        return (
          <div className="p-2 h-full flex flex-col justify-center items-center text-center overflow-hidden">
            <div className="font-bold text-sm truncate text-white drop-shadow-sm">{originalSlot.clientName}</div>
            <div className="text-xs opacity-90 mt-1 text-white drop-shadow-sm">
              {merged.duration} мин • {merged.totalPrice}₽
            </div>
            <div className="text-xs mt-1 text-white drop-shadow-sm">
              {originalSlot.status === "court_paid" ? "✅" : "⏳"}
            </div>
          </div>
        )
      }

      // Handle merged training sessions with consistent purple styling
      return (
        <div className="p-2 h-full flex flex-col justify-center items-center text-center overflow-hidden">
          <div className="font-bold text-sm truncate text-white drop-shadow-sm">{originalSlot.trainerName}</div>
          <div className="text-xs truncate mt-1 text-white drop-shadow-sm">{originalSlot.clientName}</div>
          <div className="text-xs opacity-90 flex items-center gap-1 mt-1 text-white drop-shadow-sm">
            <Clock className="h-3 w-3 flex-shrink-0" />
            <span>{merged.duration} мин</span>
          </div>
          {merged.totalPrice > 0 && (
            <div className="text-xs font-semibold mt-1 text-white drop-shadow-sm">{merged.totalPrice}₽</div>
          )}
          <div className="text-xs mt-1 text-white drop-shadow-sm">
            {originalSlot.status === "training_paid" ? "✅" : "⏳"}
          </div>
        </div>
      )
    }

    switch (slot.status) {
      case "free":
        return (
          <div className="p-2 h-full flex flex-col justify-center items-center text-center">
            <div className="font-semibold text-sm text-gray-700">{slot.price}₽</div>
            <div className="text-xs mt-1 text-gray-600">30 мин</div>
          </div>
        )

      case "court_paid":
        return (
          <div className="p-2 h-full flex flex-col justify-center items-center text-center overflow-hidden">
            <div className="font-bold text-sm truncate text-white drop-shadow-sm">{slot.clientName}</div>
            <div className="text-xs mt-1 text-white drop-shadow-sm">✅</div>
          </div>
        )

      case "court_unpaid":
        return (
          <div className="p-2 h-full flex flex-col justify-center items-center text-center overflow-hidden">
            <div className="font-bold text-sm truncate text-white drop-shadow-sm">{slot.clientName}</div>
            <div className="text-xs mt-1 text-white drop-shadow-sm">⏳</div>
          </div>
        )

      case "training_paid":
        return (
          <div className="p-2 h-full flex flex-col justify-center items-center text-center overflow-hidden">
            <div className="font-bold text-sm truncate text-white drop-shadow-sm">{slot.trainerName}</div>
            <div className="text-xs truncate mt-1 text-white drop-shadow-sm">{slot.clientName}</div>
            <div className="text-xs mt-1 text-white drop-shadow-sm">✅</div>
          </div>
        )

      case "training_unpaid":
        return (
          <div className="p-2 h-full flex flex-col justify-center items-center text-center overflow-hidden">
            <div className="font-bold text-sm truncate text-white drop-shadow-sm">{slot.trainerName}</div>
            <div className="text-xs truncate mt-1 text-white drop-shadow-sm">{slot.clientName}</div>
            <div className="text-xs mt-1 text-white drop-shadow-sm">⏳</div>
          </div>
        )

      case "trainer_reserved":
        return (
          <div className="p-2 h-full flex flex-col justify-center items-center text-center overflow-hidden">
            <div className="font-bold text-sm truncate text-white drop-shadow-sm">{slot.trainerName}</div>
            <div className="text-xs opacity-90 mt-1 text-white drop-shadow-sm">Доступно</div>
          </div>
        )

      case "blocked":
        return (
          <div className="p-2 h-full flex flex-col justify-center items-center text-center overflow-hidden">
            <div className="font-bold text-sm truncate text-white drop-shadow-sm">Заблокировано</div>
            <div className="text-xs opacity-90 mt-1 truncate text-white drop-shadow-sm">{slot.blockReason}</div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Optimized Financial Summary Header */}
      <FinancialSummary financials={dailyFinancials} selectedDate={selectedDate} />

      {/* Compact Filters Section - Single Row Layout */}
      <div className="bg-white border-b border-gray-200 py-2 px-4">
        <div className="flex items-center gap-4 flex-wrap">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          <select
            value={courtTypeFilter}
            onChange={(e) => setCourtTypeFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Все корты</option>
            <option value="hard">Хард</option>
            <option value="clay">Грунт</option>
            <option value="indoor">Крытый</option>
          </select>

          <div className="flex-1">
            <BookingFilters
              activeFilters={activeFilters}
              onFilterChange={setActiveFilters}
              unpaidCount={dailyFinancials.unpaidCount}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowBookingModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Бронирование
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => setShowTrainingModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Тренировка
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        <div
          className="min-w-max"
          style={{
            display: "grid",
            gridTemplateColumns: `90px repeat(${filteredCourts.length}, 150px)`,
            gridTemplateRows: `50px repeat(${TIME_SLOTS.length}, 75px)`,
            gap: 0,
          }}
        >
          {/* Corner cell */}
          <div className="bg-white sticky top-0 left-0 z-20 border-r border-b border-gray-300 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-700">Время</span>
          </div>

          {/* Court headers with updated price format */}
          {filteredCourts.map((court) => (
            <div
              key={court.id}
              className="bg-white font-medium text-center py-2 text-sm sticky top-0 z-10 border-r border-b border-gray-300 flex items-center justify-center"
            >
              <div>
                <div className="font-semibold text-gray-900">{court.name}</div>
                <div className="text-xs text-gray-500">от {court.basePrice}₽ /30 мин</div>
              </div>
            </div>
          ))}

          {/* Time slots */}
          {TIME_SLOTS.map((time) => (
            <React.Fragment key={time}>
              {/* Time label */}
              <div className="bg-white text-sm font-semibold py-2 px-3 text-right sticky left-0 z-10 border-r border-b border-gray-300 flex items-center justify-end text-gray-700">
                {time}
              </div>

              {/* Court slots */}
              {filteredCourts.map((court) => {
                const slot = getSlotData(court.id, selectedDate, time)
                const shouldShow = shouldShowSlot(slot)
                const merged = isSlotMerged(court.id, time)
                const isFirstOfMerged = isFirstSlotOfMerged(court.id, time)

                if (!shouldShow && !activeFilters.includes("all")) {
                  return (
                    <div
                      key={`${court.id}-${time}`}
                      className="bg-gray-100 opacity-30 border-r border-b border-gray-300"
                    />
                  )
                }

                // If this is part of a merged slot but not the first, don't render
                if (merged && !isFirstOfMerged) {
                  return null
                }

                const slotClass = `relative text-xs border-r border-b border-gray-300 transition-all hover:shadow-md cursor-pointer ${getSlotColors(slot.status)}`

                return (
                  <button
                    key={`${court.id}-${time}`}
                    onClick={() => handleSlotClick(slot)}
                    className={slotClass}
                    disabled={slot.status === "blocked"}
                    style={
                      merged && isFirstOfMerged
                        ? {
                            gridRowEnd: `span ${merged.spanSlots}`,
                            zIndex: 1,
                          }
                        : {}
                    }
                  >
                    {renderSlotContent(slot, merged || undefined)}
                  </button>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* All existing modals with updated terminology */}
      {/* Slot Choice Modal */}
      {showSlotChoiceModal && (
        <Dialog open={showSlotChoiceModal} onOpenChange={setShowSlotChoiceModal}>
          <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Как хотите забронировать?</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">
                Выберите тип бронирования для{" "}
                {slotClickData && COURTS.find((c) => c.id === slotClickData.courtId)?.name} на {slotClickData?.time}
              </p>
              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant="outline"
                  className="h-16 text-left justify-start bg-transparent"
                  onClick={() => handleSlotChoiceSelection("court")}
                >
                  <div>
                    <div className="font-semibold">Бронирование корта</div>
                    <div className="text-sm text-gray-500">Обычное бронирование корта</div>
                  </div>
                </Button>
                <Button
                  className="h-16 text-left justify-start bg-green-600 hover:bg-green-700"
                  onClick={() => handleSlotChoiceSelection("training")}
                >
                  <div>
                    <div className="font-semibold">Тренировка с тренером</div>
                    <div className="text-sm opacity-90">Создать тренировочную сессию</div>
                  </div>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Client Booking Modal for Trainer Reserved Slots */}
      {showClientBookingModal && (
        <Dialog open={showClientBookingModal} onOpenChange={setShowClientBookingModal}>
          <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Забронировать тренировку</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleClientBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Имя клиента *</label>
                <input
                  type="text"
                  required
                  value={clientBookingForm.clientName}
                  onChange={(e) => setClientBookingForm({ ...clientBookingForm, clientName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Иван Петров"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Телефон *</label>
                <input
                  type="tel"
                  required
                  value={clientBookingForm.clientPhone}
                  onChange={(e) => setClientBookingForm({ ...clientBookingForm, clientPhone: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+7 XXX XXX-XX-XX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email (необязательно)</label>
                <input
                  type="email"
                  value={clientBookingForm.clientEmail}
                  onChange={(e) => setClientBookingForm({ ...clientBookingForm, clientEmail: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ivan.petrov@email.ru"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Заметки</label>
                <textarea
                  rows={3}
                  value={clientBookingForm.notes}
                  onChange={(e) => setClientBookingForm({ ...clientBookingForm, notes: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Дополнительная информация..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowClientBookingModal(false)}
                >
                  Отмена
                </Button>
                <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                  Забронировать
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Enhanced Booking Creation Modal with Training Option */}
      {showBookingModal && (
        <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
          <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Создать бронирование</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* Booking Type Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Тип бронирования</label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={newBooking.bookingType === "court" ? "default" : "outline"}
                    onClick={() => setNewBooking({ ...newBooking, bookingType: "court" })}
                    className="h-12"
                  >
                    Бронирование корта
                  </Button>
                  <Button
                    type="button"
                    variant={newBooking.bookingType === "training_with_coach" ? "default" : "outline"}
                    onClick={() => setNewBooking({ ...newBooking, bookingType: "training_with_coach" })}
                    className="h-12 bg-green-600 hover:bg-green-700"
                  >
                    Тренировка с тренером
                  </Button>
                </div>
              </div>

              {/* Coach Selection for training bookings */}
              {newBooking.bookingType === "training_with_coach" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Тренер *</label>
                  <select
                    required
                    value={newBooking.coachId}
                    onChange={(e) => setNewBooking({ ...newBooking, coachId: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Выберите тренера</option>
                    {COACHES.map((coach) => (
                      <option key={coach.id} value={coach.id}>
                        {coach.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Client Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Клиент</label>
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Поиск существующего клиента..."
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {filteredClients.length > 0 && clientSearch && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {filteredClients.map((client) => (
                        <button
                          key={client.id}
                          type="button"
                          onClick={() => handleClientSelect(client)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-gray-500">{client.phone}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Имя клиента *</label>
                  <input
                    type="text"
                    required
                    value={newBooking.clientName}
                    onChange={(e) => setNewBooking({ ...newBooking, clientName: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Иван Петров"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Телефон *</label>
                  <input
                    type="tel"
                    required
                    value={newBooking.clientPhone}
                    onChange={(e) => setNewBooking({ ...newBooking, clientPhone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+7 XXX XXX-XX-XX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email (необязательно)</label>
                <input
                  type="email"
                  value={newBooking.clientEmail}
                  onChange={(e) => setNewBooking({ ...newBooking, clientEmail: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ivan.petrov@email.ru"
                />
              </div>

              <select
                value={newBooking.courtId}
                onChange={(e) => setNewBooking({ ...newBooking, courtId: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Выберите корт</option>
                {COURTS.map((court) => (
                  <option key={court.id} value={court.id}>
                    {court.name}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={newBooking.date}
                  onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                  className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />

                <select
                  value={newBooking.startTime}
                  onChange={(e) => setNewBooking({ ...newBooking, startTime: e.target.value })}
                  className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Выберите время</option>
                  {TIME_SLOTS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={newBooking.duration}
                onChange={(e) => setNewBooking({ ...newBooking, duration: Number.parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={60}>60 минут</option>
                <option value={90}>90 минут</option>
                <option value={120}>120 минут</option>
              </select>

              <textarea
                placeholder="Заметки (необязательно)"
                rows={3}
                value={newBooking.notes}
                onChange={(e) => setNewBooking({ ...newBooking, notes: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowBookingModal(false)}
                >
                  Отмена
                </Button>
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Создать
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Training Session Creation Modal */}
      {showTrainingModal && (
        <Dialog open={showTrainingModal} onOpenChange={setShowTrainingModal}>
          <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Создать тренировочную сессию</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleTrainingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Тренер</label>
                <select
                  required
                  value={newTrainingSession.coachId}
                  onChange={(e) => setNewTrainingSession({ ...newTrainingSession, coachId: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Выберите тренера</option>
                  {COACHES.map((coach) => (
                    <option key={coach.id} value={coach.id}>
                      {coach.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Корт</label>
                <select
                  required
                  value={newTrainingSession.courtId}
                  onChange={(e) => setNewTrainingSession({ ...newTrainingSession, courtId: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Выберите корт</option>
                  {COURTS.map((court) => (
                    <option key={court.id} value={court.id}>
                      {court.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Дата</label>
                  <input
                    type="date"
                    required
                    value={newTrainingSession.date}
                    onChange={(e) => setNewTrainingSession({ ...newTrainingSession, date: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Время</label>
                  <select
                    required
                    value={newTrainingSession.startTime}
                    onChange={(e) => setNewTrainingSession({ ...newTrainingSession, startTime: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Выберите время</option>
                    {TIME_SLOTS.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Длительность</label>
                <select
                  value={newTrainingSession.duration}
                  onChange={(e) =>
                    setNewTrainingSession({ ...newTrainingSession, duration: Number.parseInt(e.target.value) })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={60}>60 минут</option>
                  <option value={90}>90 минут</option>
                  <option value={120}>120 минут</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Минимальная длительность тренировки: 60 минут</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-md">
                <p className="text-sm text-purple-800">
                  <strong>Примечание:</strong> Это создаст зарезервированные слоты для тренера минимум на 60 минут.
                  Клиенты смогут забронировать эти слоты отдельно.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowTrainingModal(false)}
                >
                  Отмена
                </Button>
                <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
                  Создать сессию
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Slot Details Modal */}
      {selectedSlot && (
        <Dialog open={!!selectedSlot} onOpenChange={() => setSelectedSlot(null)}>
          <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedSlot.status.includes("court")
                  ? "Детали бронирования"
                  : selectedSlot.status.includes("training")
                    ? "Детали тренировки"
                    : selectedSlot.status === "blocked"
                      ? "Заблокированный слот"
                      : "Детали слота"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <strong>Корт:</strong> {COURTS.find((c) => c.id === selectedSlot.courtId)?.name}
              </div>
              <div>
                <strong>Время:</strong> {selectedSlot.time}
              </div>
              <div>
                <strong>Длительность:</strong> {selectedSlot.duration} минут
              </div>

              {selectedSlot.clientName && (
                <>
                  <div>
                    <strong>Клиент:</strong> {selectedSlot.clientName}
                  </div>
                  <div>
                    <strong>Телефон:</strong> {selectedSlot.clientPhone}
                  </div>
                  {selectedSlot.clientEmail && (
                    <div>
                      <strong>Email:</strong> {selectedSlot.clientEmail}
                    </div>
                  )}
                </>
              )}

              {selectedSlot.trainerName && (
                <div>
                  <strong>Тренер:</strong> {selectedSlot.trainerName}
                </div>
              )}

              {selectedSlot.price && (
                <div>
                  <strong>Сумма:</strong> {selectedSlot.price}₽
                </div>
              )}

              {selectedSlot.blockReason && (
                <div>
                  <strong>Причина блокировки:</strong> {selectedSlot.blockReason}
                </div>
              )}

              <div>
                <strong>Статус:</strong>
                <Badge
                  className={`ml-2 ${
                    selectedSlot.status === "court_paid" || selectedSlot.status === "training_paid"
                      ? "bg-green-100 text-green-800"
                      : selectedSlot.status === "court_unpaid" || selectedSlot.status === "training_unpaid"
                        ? "bg-orange-100 text-orange-800"
                        : selectedSlot.status === "trainer_reserved"
                          ? "bg-green-100 text-green-800"
                          : selectedSlot.status === "blocked"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {selectedSlot.status === "court_paid" && "Корт оплачен"}
                  {selectedSlot.status === "court_unpaid" && "Корт не оплачен"}
                  {selectedSlot.status === "training_paid" && "Тренировка оплачена"}
                  {selectedSlot.status === "training_unpaid" && "Тренировка не оплачена"}
                  {selectedSlot.status === "trainer_reserved" && "Зарезервировано тренером"}
                  {selectedSlot.status === "blocked" && "Заблокировано"}
                </Badge>
              </div>

              {selectedSlot.notes && (
                <div>
                  <strong>Заметки:</strong> {selectedSlot.notes}
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-4">
              {selectedSlot.status !== "blocked" && selectedSlot.status !== "free" && (
                <>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Редактировать
                  </Button>
                  <Button variant="destructive" className="flex-1">
                    Отменить
                  </Button>
                </>
              )}
              <Button variant="secondary" onClick={() => setSelectedSlot(null)}>
                Закрыть
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
