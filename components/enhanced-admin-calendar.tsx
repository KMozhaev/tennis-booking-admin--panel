"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { User, Clock, Plus, Search, CheckCircle, AlertCircle } from "lucide-react"
import { FinancialSummary } from "./financial-summary"
import { BookingFilters, type FilterType } from "./booking-filters"
import { SlotLegend } from "./slot-legend"
import type { BookingSlot, BookingType, PaymentStatus, DailyFinancials } from "../types/coach-types"

// Existing booking interface for backward compatibility
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

// Demo data with updated realistic information
const COURTS: Court[] = [
  { id: "1", name: "Корт 1 (Хард)", type: "hard", basePrice: 600 },
  { id: "2", name: "Корт 2 (Хард)", type: "hard", basePrice: 480 },
  { id: "3", name: "Корт 3 (Грунт)", type: "clay", basePrice: 720 },
  { id: "4", name: "Корт 4 (Грунт)", type: "clay", basePrice: 600 },
  { id: "5", name: "Корт 5 (Крытый)", type: "indoor", basePrice: 480 },
]

// Updated demo clients with realistic recent data
const DEMO_CLIENTS: Client[] = [
  {
    id: "1",
    name: "Анна Петрова",
    phone: "+7 916 123-45-67",
    email: "anna.petrova@email.ru",
    totalBookings: 24,
    totalSpent: 48600,
    status: "vip",
    lastBooking: "2025-01-01",
    registrationDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Михаил Волков",
    phone: "+7 903 987-65-43",
    email: "mikhail.volkov@gmail.com",
    totalBookings: 18,
    totalSpent: 32400,
    status: "active",
    lastBooking: "2024-12-30",
    registrationDate: "2024-02-20",
  },
  {
    id: "3",
    name: "Елена Смирнова",
    phone: "+7 925 456-78-90",
    email: "elena.smirnova@yandex.ru",
    totalBookings: 15,
    totalSpent: 28750,
    status: "active",
    lastBooking: "2024-12-28",
    registrationDate: "2024-03-10",
  },
  {
    id: "4",
    name: "Дмитрий Козлов",
    phone: "+7 917 234-56-78",
    email: "dmitry.kozlov@email.ru",
    totalBookings: 45,
    totalSpent: 89200,
    status: "vip",
    lastBooking: "2024-12-31",
    registrationDate: "2023-08-20",
  },
  {
    id: "5",
    name: "Мария Иванова",
    phone: "+7 926 345-67-89",
    email: "maria.ivanova@gmail.com",
    totalBookings: 22,
    totalSpent: 41800,
    status: "active",
    lastBooking: "2025-01-02",
    registrationDate: "2024-01-05",
  },
  {
    id: "6",
    name: "Сергей Николаев",
    phone: "+7 915 678-90-12",
    email: "sergey.nikolaev@email.ru",
    totalBookings: 31,
    totalSpent: 67500,
    status: "vip",
    lastBooking: "2025-01-01",
    registrationDate: "2023-11-15",
  },
  {
    id: "7",
    name: "Ольга Морозова",
    phone: "+7 903 789-01-23",
    email: "olga.morozova@yandex.ru",
    totalBookings: 12,
    totalSpent: 23400,
    status: "active",
    lastBooking: "2024-12-29",
    registrationDate: "2024-04-12",
  },
  {
    id: "8",
    name: "Павел Новиков",
    phone: "+7 916 890-12-34",
    email: "pavel.novikov@gmail.com",
    totalBookings: 8,
    totalSpent: 15600,
    status: "active",
    lastBooking: "2024-12-27",
    registrationDate: "2024-05-20",
  },
  {
    id: "9",
    name: "Светлана Кузнецова",
    phone: "+7 925 901-23-45",
    email: "svetlana.kuznetsova@email.ru",
    totalBookings: 19,
    totalSpent: 36750,
    status: "active",
    lastBooking: "2025-01-02",
    registrationDate: "2024-02-28",
  },
  {
    id: "10",
    name: "Игорь Лебедев",
    phone: "+7 917 012-34-56",
    email: "igor.lebedev@yandex.ru",
    totalBookings: 27,
    totalSpent: 52300,
    status: "vip",
    lastBooking: "2025-01-01",
    registrationDate: "2023-09-10",
  },
  {
    id: "11",
    name: "Татьяна Федорова",
    phone: "+7 926 123-45-67",
    email: "tatyana.fedorova@gmail.com",
    totalBookings: 14,
    totalSpent: 26800,
    status: "active",
    lastBooking: "2024-12-30",
    registrationDate: "2024-03-15",
  },
  {
    id: "12",
    name: "Алексей Орлов",
    phone: "+7 915 234-56-78",
    email: "alexey.orlov@email.ru",
    totalBookings: 33,
    totalSpent: 71200,
    status: "vip",
    lastBooking: "2025-01-02",
    registrationDate: "2023-07-22",
  },
  {
    id: "13",
    name: "Наталья Попова",
    phone: "+7 903 345-67-89",
    email: "natalya.popova@yandex.ru",
    totalBookings: 11,
    totalSpent: 19500,
    status: "active",
    lastBooking: "2024-12-26",
    registrationDate: "2024-06-08",
  },
  {
    id: "14",
    name: "Владимир Соколов",
    phone: "+7 916 456-78-90",
    email: "vladimir.sokolov@gmail.com",
    totalBookings: 25,
    totalSpent: 48900,
    status: "active",
    lastBooking: "2025-01-01",
    registrationDate: "2024-01-30",
  },
  {
    id: "15",
    name: "Ирина Павлова",
    phone: "+7 925 567-89-01",
    email: "irina.pavlova@email.ru",
    totalBookings: 16,
    totalSpent: 31200,
    status: "active",
    lastBooking: "2024-12-31",
    registrationDate: "2024-04-18",
  },
  {
    id: "16",
    name: "Андрей Козлов",
    phone: "+7 917 678-90-12",
    email: "andrey.kozlov@yandex.ru",
    totalBookings: 29,
    totalSpent: 58700,
    status: "vip",
    lastBooking: "2025-01-02",
    registrationDate: "2023-10-05",
  },
  {
    id: "17",
    name: "Екатерина Волкова",
    phone: "+7 926 789-01-23",
    email: "ekaterina.volkova@gmail.com",
    totalBookings: 13,
    totalSpent: 24600,
    status: "active",
    lastBooking: "2024-12-28",
    registrationDate: "2024-05-12",
  },
  {
    id: "18",
    name: "Максим Петров",
    phone: "+7 915 890-12-34",
    email: "maxim.petrov@email.ru",
    totalBookings: 21,
    totalSpent: 42300,
    status: "active",
    lastBooking: "2025-01-01",
    registrationDate: "2024-02-14",
  },
  {
    id: "19",
    name: "Юлия Сидорова",
    phone: "+7 903 901-23-45",
    email: "yulia.sidorova@yandex.ru",
    totalBookings: 17,
    totalSpent: 33800,
    status: "active",
    lastBooking: "2024-12-29",
    registrationDate: "2024-03-25",
  },
  {
    id: "20",
    name: "Роман Иванов",
    phone: "+7 916 012-34-56",
    email: "roman.ivanov@gmail.com",
    totalBookings: 35,
    totalSpent: 78400,
    status: "vip",
    lastBooking: "2025-01-02",
    registrationDate: "2023-06-18",
  },
]

// Updated demo data with new simplified slot structure
const DEMO_BOOKING_SLOTS: BookingSlot[] = [
  // 8:00 AM - 60-minute court booking (2 slots)
  {
    id: "slot-1",
    courtId: "2",
    date: "2025-01-03",
    time: "08:00",
    type: "court",
    paymentStatus: "paid",
    isFirstSlot: true,
    isContinuation: false,
    totalDuration: 60,
    spanRows: 2,
    clientName: "Анна Петрова",
    price: 2000,
    clientPhone: "+7 916 123-45-67",
    clientEmail: "anna.petrova@email.ru",
  },
  {
    id: "slot-1-cont",
    courtId: "2",
    date: "2025-01-03",
    time: "08:30",
    type: "court",
    paymentStatus: "paid",
    isFirstSlot: false,
    isContinuation: true,
    totalDuration: 60,
    spanRows: 1,
    clientName: "Анна Петрова",
    price: 0,
    clientPhone: "+7 916 123-45-67",
    clientEmail: "anna.petrova@email.ru",
  },

  // 8:00 AM - 90-minute training session (3 slots)
  {
    id: "slot-2",
    courtId: "3",
    date: "2025-01-03",
    time: "08:00",
    type: "training",
    paymentStatus: "paid",
    isFirstSlot: true,
    isContinuation: false,
    totalDuration: 90,
    spanRows: 3,
    trainerName: "Дмитрий Козлов",
    clientName: "Михаил Волков",
    price: 3750,
    clientPhone: "+7 903 987-65-43",
    clientEmail: "mikhail.volkov@gmail.com",
  },
  {
    id: "slot-2-cont-1",
    courtId: "3",
    date: "2025-01-03",
    time: "08:30",
    type: "training",
    paymentStatus: "paid",
    isFirstSlot: false,
    isContinuation: true,
    totalDuration: 90,
    spanRows: 1,
    trainerName: "Дмитрий Козлов",
    clientName: "Михаил Волков",
    price: 0,
    clientPhone: "+7 903 987-65-43",
    clientEmail: "mikhail.volkov@gmail.com",
  },
  {
    id: "slot-2-cont-2",
    courtId: "3",
    date: "2025-01-03",
    time: "09:00",
    type: "training",
    paymentStatus: "paid",
    isFirstSlot: false,
    isContinuation: true,
    totalDuration: 90,
    spanRows: 1,
    trainerName: "Дмитрий Козлов",
    clientName: "Михаил Волков",
    price: 0,
    clientPhone: "+7 903 987-65-43",
    clientEmail: "mikhail.volkov@gmail.com",
  },

  // 8:30 AM - Unpaid court booking
  {
    id: "slot-3",
    courtId: "4",
    date: "2025-01-03",
    time: "08:30",
    type: "court",
    paymentStatus: "unpaid",
    isFirstSlot: true,
    isContinuation: false,
    totalDuration: 60,
    spanRows: 2,
    clientName: "Елена Смирнова",
    price: 2000,
    clientPhone: "+7 925 456-78-90",
    clientEmail: "elena.smirnova@yandex.ru",
  },
  {
    id: "slot-3-cont",
    courtId: "4",
    date: "2025-01-03",
    time: "09:00",
    type: "court",
    paymentStatus: "unpaid",
    isFirstSlot: false,
    isContinuation: true,
    totalDuration: 60,
    spanRows: 1,
    clientName: "Елена Смирнова",
    price: 0,
    clientPhone: "+7 925 456-78-90",
    clientEmail: "elena.smirnova@yandex.ru",
  },

  // 8:30 AM - Trainer available
  {
    id: "slot-4",
    courtId: "5",
    date: "2025-01-03",
    time: "08:30",
    type: "trainer_available",
    isFirstSlot: true,
    isContinuation: false,
    totalDuration: 60,
    spanRows: 2,
    trainerName: "Анна Петрова",
  },
  {
    id: "slot-4-cont",
    courtId: "5",
    date: "2025-01-03",
    time: "09:00",
    type: "trainer_available",
    isFirstSlot: false,
    isContinuation: true,
    totalDuration: 60,
    spanRows: 1,
    trainerName: "Анна Петрова",
  },

  // 9:30 AM - Paid court booking
  {
    id: "slot-5",
    courtId: "2",
    date: "2025-01-03",
    time: "09:30",
    type: "court",
    paymentStatus: "paid",
    isFirstSlot: true,
    isContinuation: false,
    totalDuration: 90,
    spanRows: 3,
    clientName: "Мария Иванова",
    price: 3000,
    clientPhone: "+7 926 345-67-89",
    clientEmail: "maria.ivanova@gmail.com",
  },
  {
    id: "slot-5-cont-1",
    courtId: "2",
    date: "2025-01-03",
    time: "10:00",
    type: "court",
    paymentStatus: "paid",
    isFirstSlot: false,
    isContinuation: true,
    totalDuration: 90,
    spanRows: 1,
    clientName: "Мария Иванова",
    price: 0,
    clientPhone: "+7 926 345-67-89",
    clientEmail: "maria.ivanova@gmail.com",
  },
  {
    id: "slot-5-cont-2",
    courtId: "2",
    date: "2025-01-03",
    time: "10:30",
    type: "court",
    paymentStatus: "paid",
    isFirstSlot: false,
    isContinuation: true,
    totalDuration: 90,
    spanRows: 1,
    clientName: "Мария Иванова",
    price: 0,
    clientPhone: "+7 926 345-67-89",
    clientEmail: "maria.ivanova@gmail.com",
  },

  // 10:00 AM - Unpaid training session
  {
    id: "slot-6",
    courtId: "3",
    date: "2025-01-03",
    time: "10:00",
    type: "training",
    paymentStatus: "unpaid",
    isFirstSlot: true,
    isContinuation: false,
    totalDuration: 60,
    spanRows: 2,
    trainerName: "Елена Сидорова",
    clientName: "Сергей Николаев",
    price: 2700,
    clientPhone: "+7 915 678-90-12",
    clientEmail: "sergey.nikolaev@email.ru",
  },
  {
    id: "slot-6-cont",
    courtId: "3",
    date: "2025-01-03",
    time: "10:30",
    type: "training",
    paymentStatus: "unpaid",
    isFirstSlot: false,
    isContinuation: true,
    totalDuration: 60,
    spanRows: 1,
    trainerName: "Елена Сидорова",
    clientName: "Сергей Николаев",
    price: 0,
    clientPhone: "+7 915 678-90-12",
    clientEmail: "sergey.nikolaev@email.ru",
  },

  // 10:30 AM - Trainer available
  {
    id: "slot-7",
    courtId: "4",
    date: "2025-01-03",
    time: "10:30",
    type: "trainer_available",
    isFirstSlot: true,
    isContinuation: false,
    totalDuration: 90,
    spanRows: 3,
    trainerName: "Михаил Иванов",
  },
  {
    id: "slot-7-cont-1",
    courtId: "4",
    date: "2025-01-03",
    time: "11:00",
    type: "trainer_available",
    isFirstSlot: false,
    isContinuation: true,
    totalDuration: 90,
    spanRows: 1,
    trainerName: "Михаил Иванов",
  },
  {
    id: "slot-7-cont-2",
    courtId: "4",
    date: "2025-01-03",
    time: "11:30",
    type: "trainer_available",
    isFirstSlot: false,
    isContinuation: true,
    totalDuration: 90,
    spanRows: 1,
    trainerName: "Михаил Иванов",
  },

  // 11:00 AM - Unpaid court booking
  {
    id: "slot-8",
    courtId: "5",
    date: "2025-01-03",
    time: "11:00",
    type: "court",
    paymentStatus: "unpaid",
    isFirstSlot: true,
    isContinuation: false,
    totalDuration: 60,
    spanRows: 2,
    clientName: "Ольга Морозова",
    price: 2200,
    clientPhone: "+7 903 789-01-23",
    clientEmail: "olga.morozova@yandex.ru",
  },
  {
    id: "slot-8-cont",
    courtId: "5",
    date: "2025-01-03",
    time: "11:30",
    type: "court",
    paymentStatus: "unpaid",
    isFirstSlot: false,
    isContinuation: true,
    totalDuration: 60,
    spanRows: 1,
    clientName: "Ольга Морозова",
    price: 0,
    clientPhone: "+7 903 789-01-23",
    clientEmail: "olga.morozova@yandex.ru",
  },

  // 12:00 PM - Paid court booking
  {
    id: "slot-9",
    courtId: "1",
    date: "2025-01-03",
    time: "12:00",
    type: "court",
    paymentStatus: "paid",
    isFirstSlot: true,
    isContinuation: false,
    totalDuration: 60,
    spanRows: 2,
    clientName: "Павел Новиков",
    price: 2500,
    clientPhone: "+7 916 890-12-34",
    clientEmail: "pavel.novikov@gmail.com",
  },
  {
    id: "slot-9-cont",
    courtId: "1",
    date: "2025-01-03",
    time: "12:30",
    type: "court",
    paymentStatus: "paid",
    isFirstSlot: false,
    isContinuation: true,
    totalDuration: 60,
    spanRows: 1,
    clientName: "Павел Новиков",
    price: 0,
    clientPhone: "+7 916 890-12-34",
    clientEmail: "pavel.novikov@gmail.com",
  },

  // 12:00 PM - Paid training session
  {
    id: "slot-10",
    courtId: "2",
    date: "2025-01-03",
    time: "12:00",
    type: "training",
    paymentStatus: "paid",
    isFirstSlot: true,
    isContinuation: false,
    totalDuration: 90,
    spanRows: 3,
    trainerName: "Анна Петрова",
    clientName: "Светлана Кузнецова",
    price: 4125,
    clientPhone: "+7 925 901-23-45",
    clientEmail: "svetlana.kuznetsova@email.ru",
  },
  {
    id: "slot-10-cont-1",
    courtId: "2",
    date: "2025-01-03",
    time: "12:30",
    type: "training",
    paymentStatus: "paid",
    isFirstSlot: false,
    isContinuation: true,
    totalDuration: 90,
    spanRows: 1,
    trainerName: "Анна Петрова",
    clientName: "Светлана Кузнецова",
    price: 0,
    clientPhone: "+7 925 901-23-45",
    clientEmail: "svetlana.kuznetsova@email.ru",
  },
  {
    id: "slot-10-cont-2",
    courtId: "2",
    date: "2025-01-03",
    time: "13:00",
    type: "training",
    paymentStatus: "paid",
    isFirstSlot: false,
    isContinuation: true,
    totalDuration: 90,
    spanRows: 1,
    trainerName: "Анна Петрова",
    clientName: "Светлана Кузнецова",
    price: 0,
    clientPhone: "+7 925 901-23-45",
    clientEmail: "svetlana.kuznetsova@email.ru",
  },

  // 18:00 PM - Peak hour training (paid)
  {
    id: "slot-11",
    courtId: "1",
    date: "2025-01-03",
    time: "18:00",
    type: "training",
    paymentStatus: "paid",
    isFirstSlot: true,
    isContinuation: false,
    totalDuration: 90,
    spanRows: 3,
    trainerName: "Елена Сидорова",
    clientName: "Максим Петров",
    price: 4875,
    clientPhone: "+7 915 890-12-34",
    clientEmail: "maxim.petrov@email.ru",
  },
  {
    id: "slot-11-cont-1",
    courtId: "1",
    date: "2025-01-03",
    time: "18:30",
    type: "training",
    paymentStatus: "paid",
    isFirstSlot: false,
    isContinuation: true,
    totalDuration: 90,
    spanRows: 1,
    trainerName: "Елена Сидорова",
    clientName: "Максим Петров",
    price: 0,
    clientPhone: "+7 915 890-12-34",
    clientEmail: "maxim.petrov@email.ru",
  },
  {
    id: "slot-11-cont-2",
    courtId: "1",
    date: "2025-01-03",
    time: "19:00",
    type: "training",
    paymentStatus: "paid",
    isFirstSlot: false,
    isContinuation: true,
    totalDuration: 90,
    spanRows: 1,
    trainerName: "Елена Сидорова",
    clientName: "Максим Петров",
    price: 0,
    clientPhone: "+7 915 890-12-34",
    clientEmail: "maxim.petrov@email.ru",
  },

  // 18:00 PM - Peak hour court (paid)
  {
    id: "slot-12",
    courtId: "3",
    date: "2025-01-03",
    time: "18:00",
    type: "court",
    paymentStatus: "paid",
    isFirstSlot: true,
    isContinuation: false,
    totalDuration: 60,
    spanRows: 2,
    clientName: "Юлия Сидорова",
    price: 3500,
    clientPhone: "+7 903 901-23-45",
    clientEmail: "yulia.sidorova@yandex.ru",
  },
  {
    id: "slot-12-cont",
    courtId: "3",
    date: "2025-01-03",
    time: "18:30",
    type: "court",
    paymentStatus: "paid",
    isFirstSlot: false,
    isContinuation: true,
    totalDuration: 60,
    spanRows: 1,
    clientName: "Юлия Сидорова",
    price: 0,
    clientPhone: "+7 903 901-23-45",
    clientEmail: "yulia.sidorova@yandex.ru",
  },

  // 19:30 PM - Unpaid training session
  {
    id: "slot-13",
    courtId: "3",
    date: "2025-01-03",
    time: "19:30",
    type: "training",
    paymentStatus: "unpaid",
    isFirstSlot: true,
    isContinuation: false,
    totalDuration: 60,
    spanRows: 2,
    trainerName: "Дмитрий Козлов",
    clientName: "Мария Иванова",
    price: 4200,
    clientPhone: "+7 926 345-67-89",
    clientEmail: "maria.ivanova@gmail.com",
  },
  {
    id: "slot-13-cont",
    courtId: "3",
    date: "2025-01-03",
    time: "20:00",
    type: "training",
    paymentStatus: "unpaid",
    isFirstSlot: false,
    isContinuation: true,
    totalDuration: 60,
    spanRows: 1,
    trainerName: "Дмитрий Козлов",
    clientName: "Мария Иванова",
    price: 0,
    clientPhone: "+7 926 345-67-89",
    clientEmail: "maria.ivanova@gmail.com",
  },

  // 19:00 PM - Unpaid court booking
  {
    id: "slot-14",
    courtId: "2",
    date: "2025-01-03",
    time: "19:00",
    type: "court",
    paymentStatus: "unpaid",
    isFirstSlot: true,
    isContinuation: false,
    totalDuration: 60,
    spanRows: 2,
    clientName: "Анна Петрова",
    price: 3600,
    clientPhone: "+7 916 123-45-67",
    clientEmail: "anna.petrova@email.ru",
  },
  {
    id: "slot-14-cont",
    courtId: "2",
    date: "2025-01-03",
    time: "19:30",
    type: "court",
    paymentStatus: "unpaid",
    isFirstSlot: false,
    isContinuation: true,
    totalDuration: 60,
    spanRows: 1,
    clientName: "Анна Петрова",
    price: 0,
    clientPhone: "+7 916 123-45-67",
    clientEmail: "anna.petrova@email.ru",
  },

  // 19:30 PM - Trainer available
  {
    id: "slot-15",
    courtId: "5",
    date: "2025-01-03",
    time: "19:30",
    type: "trainer_available",
    isFirstSlot: true,
    isContinuation: false,
    totalDuration: 90,
    spanRows: 3,
    trainerName: "Анна Петрова",
  },
  {
    id: "slot-15-cont-1",
    courtId: "5",
    date: "2025-01-03",
    time: "20:00",
    type: "trainer_available",
    isFirstSlot: false,
    isContinuation: true,
    totalDuration: 90,
    spanRows: 1,
    trainerName: "Анна Петрова",
  },
  {
    id: "slot-15-cont-2",
    courtId: "5",
    date: "2025-01-03",
    time: "20:30",
    type: "trainer_available",
    isFirstSlot: false,
    isContinuation: true,
    totalDuration: 90,
    spanRows: 1,
    trainerName: "Анна Петрова",
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
const getSlotColor = (type: BookingType, paymentStatus?: PaymentStatus) => {
  switch (type) {
    case "court":
      return paymentStatus === "paid"
        ? "bg-blue-500 text-white hover:bg-blue-600"
        : "bg-blue-300 text-white hover:bg-blue-400"

    case "training":
      return paymentStatus === "paid"
        ? "bg-purple-500 text-white hover:bg-purple-600"
        : "bg-purple-300 text-white hover:bg-purple-400"

    case "trainer_available":
      return "bg-green-500 text-white hover:bg-green-600"

    case "free":
      return "bg-gray-50 hover:bg-blue-50 text-gray-700 border border-gray-200"

    default:
      return "bg-gray-50"
  }
}

export function EnhancedAdminCalendar() {
  const [selectedDate, setSelectedDate] = useState("2025-01-03")
  const [courtTypeFilter, setCourtTypeFilter] = useState<"all" | "hard" | "clay" | "indoor">("all")
  const [activeFilters, setActiveFilters] = useState<FilterType[]>(["all"])
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showTrainingModal, setShowTrainingModal] = useState(false)
  const [showSlotChoiceModal, setShowSlotChoiceModal] = useState(false)
  const [showClientBookingModal, setShowClientBookingModal] = useState(false)
  const [slotClickData, setSlotClickData] = useState<SlotClickChoice | null>(null)
  const [bookingSlots, setBookingSlots] = useState<BookingSlot[]>(DEMO_BOOKING_SLOTS)
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

  // Calculate daily financials
  const dailyFinancials = useMemo((): DailyFinancials => {
    const daySlots = bookingSlots.filter((slot) => slot.date === selectedDate && slot.isFirstSlot)
    const totalSlots = COURTS.length * TIME_SLOTS.length
    const occupiedSlots = daySlots.filter((slot) => slot.type !== "free").length

    const totalPaid = daySlots
      .filter((slot) => slot.paymentStatus === "paid")
      .reduce((sum, slot) => sum + (slot.price || 0), 0)

    const totalUnpaid = daySlots
      .filter((slot) => slot.paymentStatus === "unpaid")
      .reduce((sum, slot) => sum + (slot.price || 0), 0)

    const unpaidCount = daySlots.filter((slot) => slot.paymentStatus === "unpaid").length

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
      type: "free",
      isFirstSlot: true,
      isContinuation: false,
      totalDuration: 30,
      spanRows: 1,
      price,
    }
  }

  // Filter slots based on active filters
  const shouldShowSlot = (slot: BookingSlot): boolean => {
    if (activeFilters.includes("all")) return true

    if (activeFilters.includes("unpaid") && slot.paymentStatus === "unpaid") {
      return true
    }

    if (activeFilters.includes("trainings") && (slot.type === "training" || slot.type === "trainer_available")) {
      return true
    }

    if (activeFilters.includes("courts") && slot.type === "court") {
      return true
    }

    if (activeFilters.includes("available") && (slot.type === "free" || slot.type === "trainer_available")) {
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
    // Don't allow clicking on continuation slots
    if (slot.isContinuation) return

    if (slot.type === "free") {
      // Empty slot clicked - show choice modal
      setSlotClickData({ courtId: slot.courtId, time: slot.time, date: selectedDate })
      setShowSlotChoiceModal(true)
    } else if (slot.type === "trainer_available") {
      // Open client booking form for trainer available slot
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

    // Generate slots based on duration
    const slotsNeeded = newBooking.duration / 30
    const newSlots: BookingSlot[] = []

    for (let i = 0; i < slotsNeeded; i++) {
      const [hours, minutes] = newBooking.startTime.split(":").map(Number)
      const slotMinutes = minutes + i * 30
      const slotHours = hours + Math.floor(slotMinutes / 60)
      const finalMinutes = slotMinutes % 60
      const slotTime = `${slotHours.toString().padStart(2, "0")}:${finalMinutes.toString().padStart(2, "0")}`

      newSlots.push({
        id: i === 0 ? `${Date.now()}` : `${Date.now()}-cont-${i}`,
        courtId: newBooking.courtId,
        date: newBooking.date,
        time: slotTime,
        type: "court",
        paymentStatus: "unpaid",
        isFirstSlot: i === 0,
        isContinuation: i > 0,
        totalDuration: newBooking.duration,
        spanRows: i === 0 ? slotsNeeded : 1,
        clientName: newBooking.clientName,
        clientPhone: newBooking.clientPhone,
        clientEmail: newBooking.clientEmail,
        price: i === 0 ? price * slotsNeeded : 0,
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
    })
    setSelectedClient(null)
  }

  const handleClientBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Update trainer available slot to training session
    setBookingSlots(
      bookingSlots.map((slot) =>
        slot.id === clientBookingForm.sessionId || slot.id.startsWith(clientBookingForm.sessionId + "-cont")
          ? {
              ...slot,
              type: "training" as BookingType,
              paymentStatus: "unpaid" as PaymentStatus,
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

    const newSlot: BookingSlot = {
      id: Date.now().toString(),
      courtId: newTrainingSession.courtId,
      date: newTrainingSession.date,
      time: newTrainingSession.startTime,
      type: "trainer_available",
      isFirstSlot: true,
      isContinuation: false,
      totalDuration: newTrainingSession.duration,
      spanRows: newTrainingSession.duration / 30,
      trainerName: coach?.name,
    }

    setBookingSlots([
      ...bookingSlots.filter(
        (s) => !(s.courtId === newSlot.courtId && s.date === newSlot.date && s.time === newSlot.time),
      ),
      newSlot,
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

  const getSlotContent = (slot: BookingSlot) => {
    // No content for continuation slots
    if (slot.isContinuation) return null

    // Free slots show price
    if (slot.type === "free") {
      return (
        <div className="p-2 h-full flex flex-col justify-center">
          <div className="font-semibold text-sm">{slot.price}₽</div>
          <div className="text-xs mt-1">30 мин</div>
        </div>
      )
    }

    // Trainer available slots
    if (slot.type === "trainer_available") {
      return (
        <div className="p-2 h-full flex flex-col justify-center overflow-hidden">
          <div className="font-bold text-sm truncate flex items-center gap-1">
            <User className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{slot.trainerName}</span>
          </div>
          <div className="text-xs opacity-90 flex items-center gap-1 mt-1">
            <Clock className="h-3 w-3 flex-shrink-0" />
            <span>{slot.totalDuration} мин</span>
          </div>
          <div className="text-xs opacity-75 mt-1">Доступно</div>
        </div>
      )
    }

    // Court bookings
    if (slot.type === "court") {
      return (
        <div className="p-2 h-full flex flex-col justify-center overflow-hidden">
          <div className="font-bold text-sm truncate flex items-center gap-1">
            {slot.paymentStatus === "paid" ? (
              <CheckCircle className="h-3 w-3 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-3 w-3 flex-shrink-0" />
            )}
            <span className="truncate">{slot.clientName}</span>
          </div>
          <div className="text-xs opacity-90 mt-1 flex items-center gap-1">
            <Clock className="h-3 w-3 flex-shrink-0" />
            <span>{slot.totalDuration} мин</span>
          </div>
          {slot.price && slot.price > 0 && <div className="text-xs font-semibold mt-1">{slot.price}₽</div>}
        </div>
      )
    }

    // Training sessions
    if (slot.type === "training") {
      return (
        <div className="p-2 h-full flex flex-col justify-center overflow-hidden">
          <div className="font-bold text-sm truncate flex items-center gap-1">
            <User className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{slot.trainerName}</span>
          </div>
          {slot.clientName && (
            <div className="text-xs opacity-75 truncate mt-1 flex items-center gap-1">
              {slot.paymentStatus === "paid" ? (
                <CheckCircle className="h-3 w-3 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-3 w-3 flex-shrink-0" />
              )}
              <span className="truncate">{slot.clientName}</span>
            </div>
          )}
          <div className="text-xs opacity-90 flex items-center gap-1 mt-1">
            <Clock className="h-3 w-3 flex-shrink-0" />
            <span>{slot.totalDuration} мин</span>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Financial Summary */}
      <FinancialSummary financials={dailyFinancials} selectedDate={selectedDate} />

      {/* Filters Section */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-4">
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

          <div className="ml-auto flex gap-2">
            <Button variant="outline" onClick={() => setShowBookingModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Бронирование
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setShowTrainingModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Тренировка
            </Button>
          </div>
        </div>
      </div>

      {/* Booking Filters */}
      <BookingFilters
        activeFilters={activeFilters}
        onFilterChange={setActiveFilters}
        unpaidCount={dailyFinancials.unpaidCount}
      />

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

          {/* Court headers */}
          {filteredCourts.map((court) => (
            <div
              key={court.id}
              className="bg-white font-medium text-center py-2 text-sm sticky top-0 z-10 border-r border-b border-gray-300 flex items-center justify-center"
            >
              <div>
                <div className="font-semibold text-gray-900">{court.name}</div>
                <div className="text-xs text-gray-500">от {court.basePrice}₽</div>
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

                if (!shouldShow && !activeFilters.includes("all")) {
                  return (
                    <div
                      key={`${court.id}-${time}`}
                      className="bg-gray-100 opacity-30 border-r border-b border-gray-300"
                    />
                  )
                }

                // For continuation slots, render minimal/invisible content
                if (slot.isContinuation) {
                  return (
                    <div
                      key={`${court.id}-${time}`}
                      className={`border-r border-b border-gray-300 ${getSlotColor(slot.type, slot.paymentStatus)}`}
                    />
                  )
                }

                const slotClass = `relative text-xs border-r border-b border-gray-300 transition-all hover:shadow-md cursor-pointer ${getSlotColor(slot.type, slot.paymentStatus)}`

                return (
                  <button
                    key={`${court.id}-${time}`}
                    onClick={() => handleSlotClick(slot)}
                    className={slotClass}
                    style={slot.spanRows > 1 ? { gridRow: `span ${slot.spanRows}` } : {}}
                  >
                    {getSlotContent(slot)}
                  </button>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Slot Legend */}
      <SlotLegend />

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
                    <div className="font-semibold">Просто корт</div>
                    <div className="text-sm text-gray-500">Обычное бронирование корта</div>
                  </div>
                </Button>
                <Button
                  className="h-16 text-left justify-start bg-purple-600 hover:bg-purple-700"
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

      {/* Client Booking Modal for Trainer Available Slots */}
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

      {/* Booking Creation Modal */}
      {showBookingModal && (
        <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
          <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Создать бронирование</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
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
              </div>

              <div className="bg-purple-50 p-4 rounded-md">
                <p className="text-sm text-purple-800">
                  <strong>Примечание:</strong> Это создаст зарезервированный слот для тренера. Клиенты смогут
                  забронировать этот слот отдельно.
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
                {selectedSlot.type === "court"
                  ? "Детали бронирования"
                  : selectedSlot.type === "training"
                    ? "Детали тренировки"
                    : selectedSlot.type === "trainer_available"
                      ? "Доступный тренер"
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
                <strong>Длительность:</strong> {selectedSlot.totalDuration} минут
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

              {selectedSlot.price && selectedSlot.price > 0 && (
                <div>
                  <strong>Сумма:</strong> {selectedSlot.price}₽
                </div>
              )}

              {selectedSlot.paymentStatus && (
                <div>
                  <strong>Статус оплаты:</strong>
                  <Badge
                    className={`ml-2 ${
                      selectedSlot.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {selectedSlot.paymentStatus === "paid" ? "Оплачено ✅" : "Не оплачено ⏳"}
                  </Badge>
                </div>
              )}

              {selectedSlot.notes && (
                <div>
                  <strong>Заметки:</strong> {selectedSlot.notes}
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-4">
              {selectedSlot.type !== "free" && (
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
