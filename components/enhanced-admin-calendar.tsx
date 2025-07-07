"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Clock, Plus, Search } from "lucide-react"
import { FinancialSummary } from "./financial-summary"
import { BookingFilters, type FilterType } from "./booking-filters"
import type { BookingSlot, SlotStatus, DailyFinancials, MergedSlot, Coach, Client } from "../types/coach-types"

// Core interfaces
interface Court {
  id: string
  name: string
  type: "clay" | "hard" | "indoor"
  basePrice: number
}

interface UnifiedBooking {
  courtId: string
  startTime: string
  date: string
  clientId?: string
  clientName: string
  clientPhone: string
  clientEmail?: string
  duration: number
  notes: string
  bookingType: "court" | "training"
  coachId?: string
}

interface ClientBookingForm {
  sessionId: string
  clientId?: string
  clientName: string
  clientPhone: string
  clientEmail?: string
  notes: string
}

// Demo data - Updated to July 2025
const COURTS: Court[] = [
  { id: "1", name: "Корт 1 (Хард)", type: "hard", basePrice: 600 },
  { id: "2", name: "Корт 2 (Хард)", type: "hard", basePrice: 480 },
  { id: "3", name: "Корт 3 (Грунт)", type: "clay", basePrice: 720 },
  { id: "4", name: "Корт 4 (Грунт)", type: "clay", basePrice: 600 },
  { id: "5", name: "Корт 5 (Крытый)", type: "indoor", basePrice: 480 },
]

const COACHES: Coach[] = [
  { id: "1", name: "Анна Петрова", hourlyRate: 2500, color: "#8B5CF6" },
  { id: "2", name: "Дмитрий Козлов", hourlyRate: 3000, color: "#10B981" },
  { id: "3", name: "Елена Сидорова", hourlyRate: 2200, color: "#F59E0B" },
  { id: "4", name: "Михаил Иванов", hourlyRate: 2800, color: "#EF4444" },
]

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

// Comprehensive demo data with 60%+ occupancy - Updated to include July 9, 12, 14, 17, 2025
const ENHANCED_DEMO_DATA: BookingSlot[] = [
  // JULY 3rd DATA (existing)
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

  // JULY 9th DATA (Wednesday)
  {
    id: "demo_jul09_001",
    courtId: "1",
    date: "2025-07-09",
    time: "08:30",
    status: "training_paid" as SlotStatus,
    trainerName: "Анна Петрова",
    clientName: "Владимир Кузнецов",
    clientPhone: "+7 916 789-01-23",
    price: 2500,
    duration: 90,
  },
  {
    id: "demo_jul09_002",
    courtId: "1",
    date: "2025-07-09",
    time: "09:00",
    status: "training_paid" as SlotStatus,
    trainerName: "Анна Петрова",
    clientName: "Владимир Кузнецов",
    clientPhone: "+7 916 789-01-23",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul09_003",
    courtId: "1",
    date: "2025-07-09",
    time: "09:30",
    status: "training_paid" as SlotStatus,
    trainerName: "Анна Петрова",
    clientName: "Владимир Кузнецов",
    clientPhone: "+7 916 789-01-23",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul09_004",
    courtId: "2",
    date: "2025-07-09",
    time: "10:00",
    status: "court_unpaid" as SlotStatus,
    clientName: "Марина Белова",
    clientPhone: "+7 925 234-56-78",
    price: 960,
    duration: 60,
  },
  {
    id: "demo_jul09_005",
    courtId: "2",
    date: "2025-07-09",
    time: "10:30",
    status: "court_unpaid" as SlotStatus,
    clientName: "Марина Белова",
    clientPhone: "+7 925 234-56-78",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_jul09_006",
    courtId: "3",
    date: "2025-07-09",
    time: "11:30",
    status: "trainer_reserved" as SlotStatus,
    trainerName: "Дмитрий Козлов",
    duration: 60,
  },
  {
    id: "demo_jul09_007",
    courtId: "4",
    date: "2025-07-09",
    time: "13:00",
    status: "court_paid" as SlotStatus,
    clientName: "Роман Попов",
    clientPhone: "+7 903 456-78-90",
    price: 1200,
    duration: 90,
  },
  {
    id: "demo_jul09_008",
    courtId: "4",
    date: "2025-07-09",
    time: "13:30",
    status: "court_paid" as SlotStatus,
    clientName: "Роман Попов",
    clientPhone: "+7 903 456-78-90",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul09_009",
    courtId: "4",
    date: "2025-07-09",
    time: "14:00",
    status: "court_paid" as SlotStatus,
    clientName: "Роман Попов",
    clientPhone: "+7 903 456-78-90",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul09_010",
    courtId: "5",
    date: "2025-07-09",
    time: "14:30",
    status: "training_unpaid" as SlotStatus,
    trainerName: "Елена Сидорова",
    clientName: "Кристина Орлова",
    clientPhone: "+7 917 345-67-89",
    price: 2200,
    duration: 60,
  },
  {
    id: "demo_jul09_011",
    courtId: "5",
    date: "2025-07-09",
    time: "15:00",
    status: "training_unpaid" as SlotStatus,
    trainerName: "Елена Сидорова",
    clientName: "Кристина Орлова",
    clientPhone: "+7 917 345-67-89",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_jul09_012",
    courtId: "1",
    date: "2025-07-09",
    time: "16:00",
    status: "court_paid" as SlotStatus,
    clientName: "Артем Соловьев",
    clientPhone: "+7 926 567-89-01",
    price: 1200,
    duration: 60,
  },
  {
    id: "demo_jul09_013",
    courtId: "1",
    date: "2025-07-09",
    time: "16:30",
    status: "court_paid" as SlotStatus,
    clientName: "Артем Соловьев",
    clientPhone: "+7 926 567-89-01",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_jul09_014",
    courtId: "2",
    date: "2025-07-09",
    time: "17:30",
    status: "court_unpaid" as SlotStatus,
    clientName: "Валентина Жукова",
    clientPhone: "+7 915 678-90-12",
    price: 960,
    duration: 60,
  },
  {
    id: "demo_jul09_015",
    courtId: "2",
    date: "2025-07-09",
    time: "18:00",
    status: "court_unpaid" as SlotStatus,
    clientName: "Валентина Жукова",
    clientPhone: "+7 915 678-90-12",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_jul09_016",
    courtId: "3",
    date: "2025-07-09",
    time: "18:30",
    status: "training_paid" as SlotStatus,
    trainerName: "Михаил Иванов",
    clientName: "Денис Макаров",
    clientPhone: "+7 909 789-01-23",
    price: 2800,
    duration: 120,
  },
  {
    id: "demo_jul09_017",
    courtId: "3",
    date: "2025-07-09",
    time: "19:00",
    status: "training_paid" as SlotStatus,
    trainerName: "Михаил Иванов",
    clientName: "Денис Макаров",
    clientPhone: "+7 909 789-01-23",
    price: 0,
    duration: 120,
  },
  {
    id: "demo_jul09_018",
    courtId: "3",
    date: "2025-07-09",
    time: "19:30",
    status: "training_paid" as SlotStatus,
    trainerName: "Михаил Иванов",
    clientName: "Денис Макаров",
    clientPhone: "+7 909 789-01-23",
    price: 0,
    duration: 120,
  },
  {
    id: "demo_jul09_019",
    courtId: "3",
    date: "2025-07-09",
    time: "20:00",
    status: "training_paid" as SlotStatus,
    trainerName: "Михаил Иванов",
    clientName: "Денис Макаров",
    clientPhone: "+7 909 789-01-23",
    price: 0,
    duration: 120,
  },
  {
    id: "demo_jul09_020",
    courtId: "4",
    date: "2025-07-09",
    time: "19:00",
    status: "court_paid" as SlotStatus,
    clientName: "Лариса Новикова",
    clientPhone: "+7 918 890-12-34",
    price: 1560,
    duration: 90,
  },
  {
    id: "demo_jul09_021",
    courtId: "4",
    date: "2025-07-09",
    time: "19:30",
    status: "court_paid" as SlotStatus,
    clientName: "Лариса Новикова",
    clientPhone: "+7 918 890-12-34",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul09_022",
    courtId: "4",
    date: "2025-07-09",
    time: "20:00",
    status: "court_paid" as SlotStatus,
    clientName: "Лариса Новикова",
    clientPhone: "+7 918 890-12-34",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul09_023",
    courtId: "5",
    date: "2025-07-09",
    time: "20:30",
    status: "training_unpaid" as SlotStatus,
    trainerName: "Анна Петрова",
    clientName: "Максим Федоров",
    clientPhone: "+7 921 901-23-45",
    price: 2500,
    duration: 60,
  },
  {
    id: "demo_jul09_024",
    courtId: "5",
    date: "2025-07-09",
    time: "21:00",
    status: "training_unpaid" as SlotStatus,
    trainerName: "Анна Петрова",
    clientName: "Максим Федоров",
    clientPhone: "+7 921 901-23-45",
    price: 0,
    duration: 60,
  },

  // JULY 12th DATA (Saturday)
  {
    id: "demo_jul12_001",
    courtId: "1",
    date: "2025-07-12",
    time: "08:00",
    status: "court_paid" as SlotStatus,
    clientName: "Григорий Волков",
    clientPhone: "+7 916 012-34-56",
    price: 1200,
    duration: 90,
  },
  {
    id: "demo_jul12_002",
    courtId: "1",
    date: "2025-07-12",
    time: "08:30",
    status: "court_paid" as SlotStatus,
    clientName: "Григорий Волков",
    clientPhone: "+7 916 012-34-56",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul12_003",
    courtId: "1",
    date: "2025-07-12",
    time: "09:00",
    status: "court_paid" as SlotStatus,
    clientName: "Григорий Волков",
    clientPhone: "+7 916 012-34-56",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul12_004",
    courtId: "2",
    date: "2025-07-12",
    time: "09:30",
    status: "training_paid" as SlotStatus,
    trainerName: "Дмитрий Козлов",
    clientName: "Алиса Романова",
    clientPhone: "+7 925 123-45-67",
    price: 3000,
    duration: 60,
  },
  {
    id: "demo_jul12_005",
    courtId: "2",
    date: "2025-07-12",
    time: "10:00",
    status: "training_paid" as SlotStatus,
    trainerName: "Дмитрий Козлов",
    clientName: "Алиса Романова",
    clientPhone: "+7 925 123-45-67",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_jul12_006",
    courtId: "3",
    date: "2025-07-12",
    time: "10:30",
    status: "court_unpaid" as SlotStatus,
    clientName: "Станислав Морозов",
    clientPhone: "+7 903 234-56-78",
    price: 1440,
    duration: 120,
  },
  {
    id: "demo_jul12_007",
    courtId: "3",
    date: "2025-07-12",
    time: "11:00",
    status: "court_unpaid" as SlotStatus,
    clientName: "Станислав Морозов",
    clientPhone: "+7 903 234-56-78",
    price: 0,
    duration: 120,
  },
  {
    id: "demo_jul12_008",
    courtId: "3",
    date: "2025-07-12",
    time: "11:30",
    status: "court_unpaid" as SlotStatus,
    clientName: "Станислав Морозов",
    clientPhone: "+7 903 234-56-78",
    price: 0,
    duration: 120,
  },
  {
    id: "demo_jul12_009",
    courtId: "3",
    date: "2025-07-12",
    time: "12:00",
    status: "court_unpaid" as SlotStatus,
    clientName: "Станислав Морозов",
    clientPhone: "+7 903 234-56-78",
    price: 0,
    duration: 120,
  },
  {
    id: "demo_jul12_010",
    courtId: "4",
    date: "2025-07-12",
    time: "11:00",
    status: "trainer_reserved" as SlotStatus,
    trainerName: "Елена Сидорова",
    duration: 90,
  },
  {
    id: "demo_jul12_011",
    courtId: "4",
    date: "2025-07-12",
    time: "11:30",
    status: "trainer_reserved" as SlotStatus,
    trainerName: "Елена Сидорова",
    duration: 90,
  },
  {
    id: "demo_jul12_012",
    courtId: "4",
    date: "2025-07-12",
    time: "12:00",
    status: "trainer_reserved" as SlotStatus,
    trainerName: "Елена Сидорова",
    duration: 90,
  },
  {
    id: "demo_jul12_013",
    courtId: "5",
    date: "2025-07-12",
    time: "12:30",
    status: "court_paid" as SlotStatus,
    clientName: "Вероника Зайцева",
    clientPhone: "+7 917 345-67-89",
    price: 960,
    duration: 60,
  },
  {
    id: "demo_jul12_014",
    courtId: "5",
    date: "2025-07-12",
    time: "13:00",
    status: "court_paid" as SlotStatus,
    clientName: "Вероника Зайцева",
    clientPhone: "+7 917 345-67-89",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_jul12_015",
    courtId: "1",
    date: "2025-07-12",
    time: "14:00",
    status: "training_unpaid" as SlotStatus,
    trainerName: "Анна Петрова",
    clientName: "Богдан Лебедев",
    clientPhone: "+7 926 456-78-90",
    price: 2500,
    duration: 90,
  },
  {
    id: "demo_jul12_016",
    courtId: "1",
    date: "2025-07-12",
    time: "14:30",
    status: "training_unpaid" as SlotStatus,
    trainerName: "Анна Петрова",
    clientName: "Богдан Лебедев",
    clientPhone: "+7 926 456-78-90",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul12_017",
    courtId: "1",
    date: "2025-07-12",
    time: "15:00",
    status: "training_unpaid" as SlotStatus,
    trainerName: "Анна Петрова",
    clientName: "Богдан Лебедев",
    clientPhone: "+7 926 456-78-90",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul12_018",
    courtId: "2",
    date: "2025-07-12",
    time: "15:30",
    status: "court_paid" as SlotStatus,
    clientName: "Инна Соколова",
    clientPhone: "+7 915 567-89-01",
    price: 960,
    duration: 60,
  },
  {
    id: "demo_jul12_019",
    courtId: "2",
    date: "2025-07-12",
    time: "16:00",
    status: "court_paid" as SlotStatus,
    clientName: "Инна Соколова",
    clientPhone: "+7 915 567-89-01",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_jul12_020",
    courtId: "3",
    date: "2025-07-12",
    time: "16:30",
    status: "training_paid" as SlotStatus,
    trainerName: "Михаил Иванов",
    clientName: "Руслан Петров",
    clientPhone: "+7 909 678-90-12",
    price: 2800,
    duration: 60,
  },
  {
    id: "demo_jul12_021",
    courtId: "3",
    date: "2025-07-12",
    time: "17:00",
    status: "training_paid" as SlotStatus,
    trainerName: "Михаил Иванов",
    clientName: "Руслан Петров",
    clientPhone: "+7 909 678-90-12",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_jul12_022",
    courtId: "4",
    date: "2025-07-12",
    time: "17:30",
    status: "court_unpaid" as SlotStatus,
    clientName: "Камилла Иванова",
    clientPhone: "+7 918 789-01-23",
    price: 960,
    duration: 90,
  },
  {
    id: "demo_jul12_023",
    courtId: "4",
    date: "2025-07-12",
    time: "18:00",
    status: "court_unpaid" as SlotStatus,
    clientName: "Камилла Иванова",
    clientPhone: "+7 918 789-01-23",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul12_024",
    courtId: "4",
    date: "2025-07-12",
    time: "18:30",
    status: "court_unpaid" as SlotStatus,
    clientName: "Камилла Иванова",
    clientPhone: "+7 918 789-01-23",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul12_025",
    courtId: "5",
    date: "2025-07-12",
    time: "19:00",
    status: "training_paid" as SlotStatus,
    trainerName: "Дмитрий Козлов",
    clientName: "Эдуард Николаев",
    clientPhone: "+7 921 890-12-34",
    price: 3000,
    duration: 90,
  },
  {
    id: "demo_jul12_026",
    courtId: "5",
    date: "2025-07-12",
    time: "19:30",
    status: "training_paid" as SlotStatus,
    trainerName: "Дмитрий Козлов",
    clientName: "Эдуард Николаев",
    clientPhone: "+7 921 890-12-34",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul12_027",
    courtId: "5",
    date: "2025-07-12",
    time: "20:00",
    status: "training_paid" as SlotStatus,
    trainerName: "Дмитрий Козлов",
    clientName: "Эдуард Николаев",
    clientPhone: "+7 921 890-12-34",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul12_028",
    courtId: "1",
    date: "2025-07-12",
    time: "20:30",
    status: "court_paid" as SlotStatus,
    clientName: "Жанна Козлова",
    clientPhone: "+7 916 901-23-45",
    price: 1560,
    duration: 60,
  },
  {
    id: "demo_jul12_029",
    courtId: "1",
    date: "2025-07-12",
    time: "21:00",
    status: "court_paid" as SlotStatus,
    clientName: "Жанна Козлова",
    clientPhone: "+7 916 901-23-45",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_jul12_030",
    courtId: "2",
    date: "2025-07-12",
    time: "20:00",
    status: "court_unpaid" as SlotStatus,
    clientName: "Тимур Алексеев",
    clientPhone: "+7 925 012-34-56",
    price: 1248,
    duration: 90,
  },
  {
    id: "demo_jul12_031",
    courtId: "2",
    date: "2025-07-12",
    time: "20:30",
    status: "court_unpaid" as SlotStatus,
    clientName: "Тимур Алексеев",
    clientPhone: "+7 925 012-34-56",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul12_032",
    courtId: "2",
    date: "2025-07-12",
    time: "21:00",
    status: "court_unpaid" as SlotStatus,
    clientName: "Тимур Алексеев",
    clientPhone: "+7 925 012-34-56",
    price: 0,
    duration: 90,
  },

  // JULY 14th DATA (Monday)
  {
    id: "demo_jul14_001",
    courtId: "2",
    date: "2025-07-14",
    time: "08:00",
    status: "training_paid" as SlotStatus,
    trainerName: "Елена Сидорова",
    clientName: "Константин Белов",
    clientPhone: "+7 903 123-45-67",
    price: 2200,
    duration: 60,
  },
  {
    id: "demo_jul14_002",
    courtId: "2",
    date: "2025-07-14",
    time: "08:30",
    status: "training_paid" as SlotStatus,
    trainerName: "Елена Сидорова",
    clientName: "Константин Белов",
    clientPhone: "+7 903 123-45-67",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_jul14_003",
    courtId: "3",
    date: "2025-07-14",
    time: "09:00",
    status: "court_unpaid" as SlotStatus,
    clientName: "Полина Егорова",
    clientPhone: "+7 917 234-56-78",
    price: 1440,
    duration: 60,
  },
  {
    id: "demo_jul14_004",
    courtId: "3",
    date: "2025-07-14",
    time: "09:30",
    status: "court_unpaid" as SlotStatus,
    clientName: "Полина Егорова",
    clientPhone: "+7 917 234-56-78",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_jul14_005",
    courtId: "4",
    date: "2025-07-14",
    time: "10:30",
    status: "trainer_reserved" as SlotStatus,
    trainerName: "Михаил Иванов",
    duration: 90,
  },
  {
    id: "demo_jul14_006",
    courtId: "4",
    date: "2025-07-14",
    time: "11:00",
    status: "trainer_reserved" as SlotStatus,
    trainerName: "Михаил Иванов",
    duration: 90,
  },
  {
    id: "demo_jul14_007",
    courtId: "4",
    date: "2025-07-14",
    time: "11:30",
    status: "trainer_reserved" as SlotStatus,
    trainerName: "Михаил Иванов",
    duration: 90,
  },
  {
    id: "demo_jul14_008",
    courtId: "5",
    date: "2025-07-14",
    time: "11:00",
    status: "court_paid" as SlotStatus,
    clientName: "Семен Орлов",
    clientPhone: "+7 926 345-67-89",
    price: 960,
    duration: 90,
  },
  {
    id: "demo_jul14_009",
    courtId: "5",
    date: "2025-07-14",
    time: "11:30",
    status: "court_paid" as SlotStatus,
    clientName: "Семен Орлов",
    clientPhone: "+7 926 345-67-89",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul14_010",
    courtId: "5",
    date: "2025-07-14",
    time: "12:00",
    status: "court_paid" as SlotStatus,
    clientName: "Семен Орлов",
    clientPhone: "+7 926 345-67-89",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul14_011",
    courtId: "1",
    date: "2025-07-14",
    time: "13:30",
    status: "training_unpaid" as SlotStatus,
    trainerName: "Анна Петрова",
    clientName: "Лидия Васильева",
    clientPhone: "+7 915 456-78-90",
    price: 2500,
    duration: 90,
  },
  {
    id: "demo_jul14_012",
    courtId: "1",
    date: "2025-07-14",
    time: "14:00",
    status: "training_unpaid" as SlotStatus,
    trainerName: "Анна Петрова",
    clientName: "Лидия Васильева",
    clientPhone: "+7 915 456-78-90",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul14_013",
    courtId: "1",
    date: "2025-07-14",
    time: "14:30",
    status: "training_unpaid" as SlotStatus,
    trainerName: "Анна Петрова",
    clientName: "Лидия Васильева",
    clientPhone: "+7 915 456-78-90",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul14_014",
    courtId: "2",
    date: "2025-07-14",
    time: "15:00",
    status: "court_paid" as SlotStatus,
    clientName: "Глеб Морозов",
    clientPhone: "+7 909 567-89-01",
    price: 960,
    duration: 60,
  },
  {
    id: "demo_jul14_015",
    courtId: "2",
    date: "2025-07-14",
    time: "15:30",
    status: "court_paid" as SlotStatus,
    clientName: "Глеб Морозов",
    clientPhone: "+7 909 567-89-01",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_jul14_016",
    courtId: "3",
    date: "2025-07-14",
    time: "16:00",
    status: "court_unpaid" as SlotStatus,
    clientName: "Нина Федорова",
    clientPhone: "+7 918 678-90-12",
    price: 1440,
    duration: 90,
  },
  {
    id: "demo_jul14_017",
    courtId: "3",
    date: "2025-07-14",
    time: "16:30",
    status: "court_unpaid" as SlotStatus,
    clientName: "Нина Федорова",
    clientPhone: "+7 918 678-90-12",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul14_018",
    courtId: "3",
    date: "2025-07-14",
    time: "17:00",
    status: "court_unpaid" as SlotStatus,
    clientName: "Нина Федорова",
    clientPhone: "+7 918 678-90-12",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul14_019",
    courtId: "4",
    date: "2025-07-14",
    time: "17:30",
    status: "training_paid" as SlotStatus,
    trainerName: "Дмитрий Козлов",
    clientName: "Артур Соколов",
    clientPhone: "+7 921 789-01-23",
    price: 3000,
    duration: 120,
  },
  {
    id: "demo_jul14_020",
    courtId: "4",
    date: "2025-07-14",
    time: "18:00",
    status: "training_paid" as SlotStatus,
    trainerName: "Дмитрий Козлов",
    clientName: "Артур Соколов",
    clientPhone: "+7 921 789-01-23",
    price: 0,
    duration: 120,
  },
  {
    id: "demo_jul14_021",
    courtId: "4",
    date: "2025-07-14",
    time: "18:30",
    status: "training_paid" as SlotStatus,
    trainerName: "Дмитрий Козлов",
    clientName: "Артур Соколов",
    clientPhone: "+7 921 789-01-23",
    price: 0,
    duration: 120,
  },
  {
    id: "demo_jul14_022",
    courtId: "4",
    date: "2025-07-14",
    time: "19:00",
    status: "training_paid" as SlotStatus,
    trainerName: "Дмитрий Козлов",
    clientName: "Артур Соколов",
    clientPhone: "+7 921 789-01-23",
    price: 0,
    duration: 120,
  },
  {
    id: "demo_jul14_023",
    courtId: "5",
    date: "2025-07-14",
    time: "18:30",
    status: "court_paid" as SlotStatus,
    clientName: "Мирослава Попова",
    clientPhone: "+7 916 890-12-34",
    price: 1248,
    duration: 60,
  },
  {
    id: "demo_jul14_024",
    courtId: "5",
    date: "2025-07-14",
    time: "19:00",
    status: "court_paid" as SlotStatus,
    clientName: "Мирослава Попова",
    clientPhone: "+7 916 890-12-34",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_jul14_025",
    courtId: "1",
    date: "2025-07-14",
    time: "19:30",
    status: "training_unpaid" as SlotStatus,
    trainerName: "Елена Сидорова",
    clientName: "Филипп Кузнецов",
    clientPhone: "+7 925 901-23-45",
    price: 2200,
    duration: 90,
  },
  {
    id: "demo_jul14_026",
    courtId: "1",
    date: "2025-07-14",
    time: "20:00",
    status: "training_unpaid" as SlotStatus,
    trainerName: "Елена Сидорова",
    clientName: "Филипп Кузнецов",
    clientPhone: "+7 925 901-23-45",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul14_027",
    courtId: "1",
    date: "2025-07-14",
    time: "20:30",
    status: "training_unpaid" as SlotStatus,
    trainerName: "Елена Сидорова",
    clientName: "Филипп Кузнецов",
    clientPhone: "+7 925 901-23-45",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul14_028",
    courtId: "2",
    date: "2025-07-14",
    time: "20:00",
    status: "court_unpaid" as SlotStatus,
    clientName: "Ангелина Новикова",
    clientPhone: "+7 903 012-34-56",
    price: 1248,
    duration: 60,
  },
  {
    id: "demo_jul14_029",
    courtId: "2",
    date: "2025-07-14",
    time: "20:30",
    status: "court_unpaid" as SlotStatus,
    clientName: "Ангелина Новикова",
    clientPhone: "+7 903 012-34-56",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_jul14_030",
    courtId: "3",
    date: "2025-07-14",
    time: "21:00",
    status: "court_paid" as SlotStatus,
    clientName: "Леонид Жуков",
    clientPhone: "+7 917 123-45-67",
    price: 1872,
    duration: 60,
  },
  {
    id: "demo_jul14_031",
    courtId: "3",
    date: "2025-07-14",
    time: "21:30",
    status: "court_paid" as SlotStatus,
    clientName: "Леонид Жуков",
    clientPhone: "+7 917 123-45-67",
    price: 0,
    duration: 60,
  },

  // JULY 17th DATA (Thursday)
  {
    id: "demo_jul17_001",
    courtId: "1",
    date: "2025-07-17",
    time: "08:30",
    status: "court_paid" as SlotStatus,
    clientName: "Виталий Романов",
    clientPhone: "+7 926 234-56-78",
    price: 1200,
    duration: 90,
  },
  {
    id: "demo_jul17_002",
    courtId: "1",
    date: "2025-07-17",
    time: "09:00",
    status: "court_paid" as SlotStatus,
    clientName: "Виталий Романов",
    clientPhone: "+7 926 234-56-78",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul17_003",
    courtId: "1",
    date: "2025-07-17",
    time: "09:30",
    status: "court_paid" as SlotStatus,
    clientName: "Виталий Романов",
    clientPhone: "+7 926 234-56-78",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul17_004",
    courtId: "2",
    date: "2025-07-17",
    time: "10:00",
    status: "training_unpaid" as SlotStatus,
    trainerName: "Анна Петрова",
    clientName: "Дарья Макарова",
    clientPhone: "+7 915 345-67-89",
    price: 2500,
    duration: 60,
  },
  {
    id: "demo_jul17_005",
    courtId: "2",
    date: "2025-07-17",
    time: "10:30",
    status: "training_unpaid" as SlotStatus,
    trainerName: "Анна Петрова",
    clientName: "Дарья Макарова",
    clientPhone: "+7 915 345-67-89",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_jul17_006",
    courtId: "3",
    date: "2025-07-17",
    time: "11:00",
    status: "court_unpaid" as SlotStatus,
    clientName: "Борис Лебедев",
    clientPhone: "+7 909 456-78-90",
    price: 1440,
    duration: 60,
  },
  {
    id: "demo_jul17_007",
    courtId: "3",
    date: "2025-07-17",
    time: "11:30",
    status: "court_unpaid" as SlotStatus,
    clientName: "Борис Лебедев",
    clientPhone: "+7 909 456-78-90",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_jul17_008",
    courtId: "4",
    date: "2025-07-17",
    time: "12:00",
    status: "trainer_reserved" as SlotStatus,
    trainerName: "Дмитрий Козлов",
    duration: 60,
  },
  {
    id: "demo_jul17_009",
    courtId: "5",
    date: "2025-07-17",
    time: "12:30",
    status: "training_paid" as SlotStatus,
    trainerName: "Михаил Иванов",
    clientName: "Оксана Зайцева",
    clientPhone: "+7 918 567-89-01",
    price: 2800,
    duration: 90,
  },
  {
    id: "demo_jul17_010",
    courtId: "5",
    date: "2025-07-17",
    time: "13:00",
    status: "training_paid" as SlotStatus,
    trainerName: "Михаил Иванов",
    clientName: "Оксана Зайцева",
    clientPhone: "+7 918 567-89-01",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul17_011",
    courtId: "5",
    date: "2025-07-17",
    time: "13:30",
    status: "training_paid" as SlotStatus,
    trainerName: "Михаил Иванов",
    clientName: "Оксана Зайцева",
    clientPhone: "+7 918 567-89-01",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul17_012",
    courtId: "1",
    date: "2025-07-17",
    time: "14:30",
    status: "court_paid" as SlotStatus,
    clientName: "Кирилл Соловьев",
    clientPhone: "+7 921 678-90-12",
    price: 1200,
    duration: 60,
  },
  {
    id: "demo_jul17_013",
    courtId: "1",
    date: "2025-07-17",
    time: "15:00",
    status: "court_paid" as SlotStatus,
    clientName: "Кирилл Соловьев",
    clientPhone: "+7 921 678-90-12",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_jul17_014",
    courtId: "2",
    date: "2025-07-17",
    time: "15:30",
    status: "training_unpaid" as SlotStatus,
    trainerName: "Елена Сидорова",
    clientName: "Яна Петрова",
    clientPhone: "+7 916 789-01-23",
    price: 2200,
    duration: 90,
  },
  {
    id: "demo_jul17_015",
    courtId: "2",
    date: "2025-07-17",
    time: "16:00",
    status: "training_unpaid" as SlotStatus,
    trainerName: "Елена Сидорова",
    clientName: "Яна Петрова",
    clientPhone: "+7 916 789-01-23",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul17_016",
    courtId: "2",
    date: "2025-07-17",
    time: "16:30",
    status: "training_unpaid" as SlotStatus,
    trainerName: "Елена Сидорова",
    clientName: "Яна Петрова",
    clientPhone: "+7 916 789-01-23",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul17_017",
    courtId: "3",
    date: "2025-07-17",
    time: "17:00",
    status: "court_paid" as SlotStatus,
    clientName: "Евгений Морозов",
    clientPhone: "+7 925 890-12-34",
    price: 1440,
    duration: 60,
  },
  {
    id: "demo_jul17_018",
    courtId: "3",
    date: "2025-07-17",
    time: "17:30",
    status: "court_paid" as SlotStatus,
    clientName: "Евгений Морозов",
    clientPhone: "+7 925 890-12-34",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_jul17_019",
    courtId: "4",
    date: "2025-07-17",
    time: "18:00",
    status: "training_paid" as SlotStatus,
    trainerName: "Дмитрий Козлов",
    clientName: "Алексей Волков",
    clientPhone: "+7 903 901-23-45",
    price: 3000,
    duration: 120,
  },
  {
    id: "demo_jul17_020",
    courtId: "4",
    date: "2025-07-17",
    time: "18:30",
    status: "training_paid" as SlotStatus,
    trainerName: "Дмитрий Козлов",
    clientName: "Алексей Волков",
    clientPhone: "+7 903 901-23-45",
    price: 0,
    duration: 120,
  },
  {
    id: "demo_jul17_021",
    courtId: "4",
    date: "2025-07-17",
    time: "19:00",
    status: "training_paid" as SlotStatus,
    trainerName: "Дмитрий Козлов",
    clientName: "Алексей Волков",
    clientPhone: "+7 903 901-23-45",
    price: 0,
    duration: 120,
  },
  {
    id: "demo_jul17_022",
    courtId: "4",
    date: "2025-07-17",
    time: "19:30",
    status: "training_paid" as SlotStatus,
    trainerName: "Дмитрий Козлов",
    clientName: "Алексей Волков",
    clientPhone: "+7 903 901-23-45",
    price: 0,
    duration: 120,
  },
  {
    id: "demo_jul17_023",
    courtId: "5",
    date: "2025-07-17",
    time: "18:30",
    status: "court_unpaid" as SlotStatus,
    clientName: "Регина Федорова",
    clientPhone: "+7 917 012-34-56",
    price: 1248,
    duration: 90,
  },
  {
    id: "demo_jul17_024",
    courtId: "5",
    date: "2025-07-17",
    time: "19:00",
    status: "court_unpaid" as SlotStatus,
    clientName: "Регина Федорова",
    clientPhone: "+7 917 012-34-56",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul17_025",
    courtId: "5",
    date: "2025-07-17",
    time: "19:30",
    status: "court_unpaid" as SlotStatus,
    clientName: "Регина Федорова",
    clientPhone: "+7 917 012-34-56",
    price: 0,
    duration: 90,
  },
  {
    id: "demo_jul17_026",
    courtId: "1",
    date: "2025-07-17",
    time: "20:00",
    status: "training_paid" as SlotStatus,
    trainerName: "Анна Петрова",
    clientName: "Матвей Николаев",
    clientPhone: "+7 926 123-45-67",
    price: 2500,
    duration: 60,
  },
  {
    id: "demo_jul17_027",
    courtId: "1",
    date: "2025-07-17",
    time: "20:30",
    status: "training_paid" as SlotStatus,
    trainerName: "Анна Петрова",
    clientName: "Матвей Николаев",
    clientPhone: "+7 926 123-45-67",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_jul17_028",
    courtId: "2",
    date: "2025-07-17",
    time: "20:30",
    status: "court_paid" as SlotStatus,
    clientName: "Софья Козлова",
    clientPhone: "+7 915 234-56-78",
    price: 1248,
    duration: 60,
  },
  {
    id: "demo_jul17_029",
    courtId: "2",
    date: "2025-07-17",
    time: "21:00",
    status: "court_paid" as SlotStatus,
    clientName: "Софья Козлова",
    clientPhone: "+7 915 234-56-78",
    price: 0,
    duration: 60,
  },
  {
    id: "demo_jul17_030",
    courtId: "3",
    date: "2025-07-17",
    time: "21:00",
    status: "training_unpaid" as SlotStatus,
    trainerName: "Михаил Иванов",
    clientName: "Игнат Попов",
    clientPhone: "+7 909 345-67-89",
    price: 2800,
    duration: 60,
  },
  {
    id: "demo_jul17_031",
    courtId: "3",
    date: "2025-07-17",
    time: "21:30",
    status: "training_unpaid" as SlotStatus,
    trainerName: "Михаил Иванов",
    clientName: "Игнат Попов",
    clientPhone: "+7 909 345-67-89",
    price: 0,
    duration: 60,
  },
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
      return "bg-purple-300 text-white hover:bg-purple-400"
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

// Phone number validation
const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+7\s\d{3}\s\d{3}-\d{2}-\d{2}$/
  return phoneRegex.test(phone)
}

// Email validation
const validateEmail = (email: string): boolean => {
  if (!email) return true // Optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function EnhancedAdminCalendar() {
  const [selectedDate, setSelectedDate] = useState("2025-07-03")
  const [courtTypeFilter, setCourtTypeFilter] = useState<"all" | "hard" | "clay" | "indoor">("all")
  const [activeFilters, setActiveFilters] = useState<FilterType[]>(["all"])
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null)
  const [showUnifiedBookingModal, setShowUnifiedBookingModal] = useState(false)
  const [showClientBookingModal, setShowClientBookingModal] = useState(false)
  const [bookingSlots, setBookingSlots] = useState<BookingSlot[]>(ENHANCED_DEMO_DATA)
  const [clients] = useState<Client[]>(DEMO_CLIENTS)
  const [clientSearch, setClientSearch] = useState("")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [unifiedBooking, setUnifiedBooking] = useState<UnifiedBooking>({
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
    coachId: "",
  })
  const [clientBookingForm, setClientBookingForm] = useState<ClientBookingForm>({
    sessionId: "",
    clientId: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    notes: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

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

  const handleSlotClick = (slot: BookingSlot) => {
    if (slot.status === "free") {
      // Empty slot clicked - open unified booking form
      setUnifiedBooking({
        ...unifiedBooking,
        courtId: slot.courtId,
        startTime: slot.time,
        date: selectedDate,
      })
      setShowUnifiedBookingModal(true)
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

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client)
    setUnifiedBooking({
      ...unifiedBooking,
      clientId: client.id,
      clientName: client.name,
      clientPhone: client.phone,
      clientEmail: client.email || "",
    })
    setClientSearch("")
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!unifiedBooking.clientName || unifiedBooking.clientName.length < 2) {
      errors.clientName = "Имя клиента должно содержать минимум 2 символа"
    }

    if (!validatePhoneNumber(unifiedBooking.clientPhone)) {
      errors.clientPhone = "Введите телефон в формате +7 XXX XXX-XX-XX"
    }

    if (unifiedBooking.clientEmail && !validateEmail(unifiedBooking.clientEmail)) {
      errors.clientEmail = "Введите корректный email адрес"
    }

    if (!unifiedBooking.courtId) {
      errors.courtId = "Выберите корт"
    }

    if (!unifiedBooking.startTime) {
      errors.startTime = "Выберите время"
    }

    if (unifiedBooking.bookingType === "training" && !unifiedBooking.coachId) {
      errors.coachId = "Выберите тренера"
    }

    if (unifiedBooking.notes && unifiedBooking.notes.length > 500) {
      errors.notes = "Заметки не должны превышать 500 символов"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleUnifiedBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const court = COURTS.find((c) => c.id === unifiedBooking.courtId)
    const basePrice = court ? calculateSlotPrice(court.basePrice, unifiedBooking.startTime) : 0

    // Generate slots based on duration and booking type
    const slotsNeeded = unifiedBooking.duration / 30
    const newSlots: BookingSlot[] = []

    for (let i = 0; i < slotsNeeded; i++) {
      const [hours, minutes] = unifiedBooking.startTime.split(":").map(Number)
      const slotMinutes = minutes + i * 30
      const slotHours = hours + Math.floor(slotMinutes / 60)
      const finalMinutes = slotMinutes % 60
      const slotTime = `${slotHours.toString().padStart(2, "0")}:${finalMinutes.toString().padStart(2, "0")}`

      let status: SlotStatus
      let trainerName: string | undefined
      let price = 0

      if (unifiedBooking.bookingType === "training") {
        status = "training_unpaid" as SlotStatus
        const coach = COACHES.find((c) => c.id === unifiedBooking.coachId)
        trainerName = coach?.name
        price = i === 0 ? coach?.hourlyRate || 0 : 0
      } else {
        status = "court_unpaid" as SlotStatus
        price = i === 0 ? basePrice * slotsNeeded : 0
      }

      newSlots.push({
        id: `${Date.now()}-${i}`,
        courtId: unifiedBooking.courtId,
        date: unifiedBooking.date,
        time: slotTime,
        status,
        clientName: unifiedBooking.clientName,
        clientPhone: unifiedBooking.clientPhone,
        clientEmail: unifiedBooking.clientEmail,
        trainerName,
        price,
        duration: unifiedBooking.duration,
        notes: unifiedBooking.notes,
      })
    }

    setBookingSlots([
      ...bookingSlots.filter(
        (s) => !newSlots.some((ns) => ns.courtId === s.courtId && ns.date === s.date && ns.time === s.time),
      ),
      ...newSlots,
    ])

    setShowUnifiedBookingModal(false)
    setUnifiedBooking({
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
      coachId: "",
    })
    setSelectedClient(null)
    setFormErrors({})
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
            <Button onClick={() => setShowUnifiedBookingModal(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Бронирование
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

      {/* Unified Booking Modal */}
      {showUnifiedBookingModal && (
        <Dialog open={showUnifiedBookingModal} onOpenChange={setShowUnifiedBookingModal}>
          <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Создать бронирование</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUnifiedBookingSubmit} className="space-y-6">
              {/* Booking Type Selection */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-700">Тип бронирования</label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={unifiedBooking.bookingType === "court" ? "default" : "outline"}
                    onClick={() => setUnifiedBooking({ ...unifiedBooking, bookingType: "court" })}
                    className="h-16 text-left justify-start bg-white border-2 hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-semibold text-gray-900">Бронирование корта</div>
                      <div className="text-sm text-gray-500">Обычное бронирование корта</div>
                    </div>
                  </Button>
                  <Button
                    type="button"
                    variant={unifiedBooking.bookingType === "training" ? "default" : "outline"}
                    onClick={() => setUnifiedBooking({ ...unifiedBooking, bookingType: "training" })}
                    className="h-16 text-left justify-start bg-green-600 hover:bg-green-700 text-white"
                  >
                    <div>
                      <div className="font-semibold">Тренировка с тренером</div>
                      <div className="text-sm opacity-90">Создать тренировочную сессию</div>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Coach Selection for training bookings */}
              {unifiedBooking.bookingType === "training" && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Тренер <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={unifiedBooking.coachId}
                    onChange={(e) => setUnifiedBooking({ ...unifiedBooking, coachId: e.target.value })}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.coachId ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Выберите тренера</option>
                    {COACHES.map((coach) => (
                      <option key={coach.id} value={coach.id}>
                        {coach.name} - {coach.hourlyRate}₽/час
                      </option>
                    ))}
                  </select>
                  {formErrors.coachId && <p className="text-red-500 text-xs mt-1">{formErrors.coachId}</p>}
                </div>
              )}

              {/* Client Selection */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Клиент</label>
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
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Имя клиента <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={unifiedBooking.clientName}
                    onChange={(e) => setUnifiedBooking({ ...unifiedBooking, clientName: e.target.value })}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.clientName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Иван Петров"
                  />
                  {formErrors.clientName && <p className="text-red-500 text-xs mt-1">{formErrors.clientName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Телефон <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={unifiedBooking.clientPhone}
                    onChange={(e) => setUnifiedBooking({ ...unifiedBooking, clientPhone: e.target.value })}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.clientPhone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="+7 XXX XXX-XX-XX"
                  />
                  {formErrors.clientPhone && <p className="text-red-500 text-xs mt-1">{formErrors.clientPhone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Email (необязательно)</label>
                <input
                  type="email"
                  value={unifiedBooking.clientEmail}
                  onChange={(e) => setUnifiedBooking({ ...unifiedBooking, clientEmail: e.target.value })}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.clientEmail ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="ivan.petrov@email.ru"
                />
                {formErrors.clientEmail && <p className="text-red-500 text-xs mt-1">{formErrors.clientEmail}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Выберите корт <span className="text-red-500">*</span>
                </label>
                <select
                  value={unifiedBooking.courtId}
                  onChange={(e) => setUnifiedBooking({ ...unifiedBooking, courtId: e.target.value })}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.courtId ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                >
                  <option value="">Выберите корт</option>
                  {COURTS.map((court) => (
                    <option key={court.id} value={court.id}>
                      {court.name}
                    </option>
                  ))}
                </select>
                {formErrors.courtId && <p className="text-red-500 text-xs mt-1">{formErrors.courtId}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Дата</label>
                  <input
                    type="date"
                    value={unifiedBooking.date}
                    onChange={(e) => setUnifiedBooking({ ...unifiedBooking, date: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Выберите время <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={unifiedBooking.startTime}
                    onChange={(e) => setUnifiedBooking({ ...unifiedBooking, startTime: e.target.value })}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.startTime ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="">Выберите время</option>
                    {TIME_SLOTS.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {formErrors.startTime && <p className="text-red-500 text-xs mt-1">{formErrors.startTime}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Длительность</label>
                <select
                  value={unifiedBooking.duration}
                  onChange={(e) => setUnifiedBooking({ ...unifiedBooking, duration: Number.parseInt(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={30}>30 минут</option>
                  <option value={60}>60 минут</option>
                  <option value={90}>90 минут</option>
                  <option value={120}>120 минут</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Заметки (необязательно)</label>
                <textarea
                  rows={3}
                  value={unifiedBooking.notes}
                  onChange={(e) => setUnifiedBooking({ ...unifiedBooking, notes: e.target.value })}
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.notes ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Дополнительная информация..."
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 mt-1">{unifiedBooking.notes.length}/500 символов</div>
                {formErrors.notes && <p className="text-red-500 text-xs mt-1">{formErrors.notes}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setShowUnifiedBookingModal(false)
                    setFormErrors({})
                  }}
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

      {/* Client Booking Modal for Trainer Reserved Slots */}
      {showClientBookingModal && (
        <Dialog open={showClientBookingModal} onOpenChange={setShowClientBookingModal}>
          <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Забронировать тренировку</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleClientBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Имя клиента <span className="text-red-500">*</span>
                </label>
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
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Телефон <span className="text-red-500">*</span>
                </label>
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
                <label className="block text-sm font-medium mb-2 text-gray-700">Email (необязательно)</label>
                <input
                  type="email"
                  value={clientBookingForm.clientEmail}
                  onChange={(e) => setClientBookingForm({ ...clientBookingForm, clientEmail: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ivan.petrov@email.ru"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Заметки</label>
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
