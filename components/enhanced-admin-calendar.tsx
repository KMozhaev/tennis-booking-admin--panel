"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { User, Clock, Plus, Search } from "lucide-react"
import type { TrainingSession } from "../types/coach-types"

// Existing booking interface
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
    lastBooking: "2025-01-01", // 2 days ago
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
    lastBooking: "2024-12-28", // 5 days ago
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
    lastBooking: "2024-12-25", // 1 week ago
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
    lastBooking: "2024-12-30", // 3 days ago
    registrationDate: "2023-08-20",
  },
  {
    id: "5",
    name: "Ольга Васильева",
    phone: "+7 912 345-67-89",
    totalBookings: 3,
    totalSpent: 4500,
    status: "inactive",
    lastBooking: "2024-11-15", // 1.5 months ago
    registrationDate: "2024-05-01",
  },
  {
    id: "6",
    name: "Сергей Николаев",
    phone: "+7 926 678-90-12",
    email: "sergey.nikolaev@email.ru",
    totalBookings: 18,
    totalSpent: 32400,
    status: "active",
    lastBooking: "2024-12-20", // 2 weeks ago
    registrationDate: "2024-02-14",
  },
  {
    id: "7",
    name: "Мария Федорова",
    phone: "+7 915 789-01-23",
    email: "maria.fedorova@email.ru",
    totalBookings: 35,
    totalSpent: 67500,
    status: "vip",
    lastBooking: "2024-12-31", // 2 days ago
    registrationDate: "2023-11-08",
  },
  {
    id: "8",
    name: "Александр Волков",
    phone: "+7 909 234-56-78",
    totalBookings: 6,
    totalSpent: 8900,
    status: "active",
    lastBooking: "2024-12-15", // 2.5 weeks ago
    registrationDate: "2024-06-12",
  },
  {
    id: "9",
    name: "Татьяна Морозова",
    phone: "+7 918 345-67-89",
    email: "tatyana.morozova@email.ru",
    totalBookings: 52,
    totalSpent: 124800,
    status: "vip",
    lastBooking: "2025-01-01", // 2 days ago
    registrationDate: "2023-05-20",
  },
  {
    id: "10",
    name: "Игорь Соколов",
    phone: "+7 921 456-78-90",
    totalBookings: 4,
    totalSpent: 6200,
    status: "inactive",
    lastBooking: "2024-10-08", // 3 months ago
    registrationDate: "2024-07-15",
  },
]

const DEMO_BOOKINGS: Booking[] = [
  {
    id: "1",
    courtId: "2",
    date: "2025-01-03",
    timeSlots: ["08:30", "09:00"],
    duration: 60,
    clientName: "Анна Петрова",
    clientPhone: "+7 916 123-45-67",
    clientEmail: "anna.petrova@email.ru",
    totalPrice: 1497,
    status: "confirmed",
    paymentMethod: "online",
    createdBy: "system",
  },
  {
    id: "2",
    courtId: "2",
    date: "2025-01-03",
    timeSlots: ["09:30", "10:00"],
    duration: 60,
    clientName: "Михаил Иванов",
    clientPhone: "+7 903 987-65-43",
    clientEmail: "mikhail.ivanov@email.ru",
    totalPrice: 1497,
    status: "pending",
    paymentMethod: "onsite",
    createdBy: "system",
  },
]

const DEMO_TRAINING_SESSIONS: TrainingSession[] = [
  {
    id: "1",
    coachId: "1",
    courtId: "1",
    date: "2025-01-03",
    startTime: "10:00",
    endTime: "11:30",
    duration: 90,
    totalPrice: 0,
    status: "booked",
    clientInfo: {
      name: "Александр Смирнов",
      phone: "+7 916 555-12-34",
      email: "alex.smirnov@email.ru",
    },
    createdAt: new Date("2024-12-25"),
  },
  {
    id: "2",
    coachId: "2",
    courtId: "3",
    date: "2025-01-03",
    startTime: "16:00",
    endTime: "17:00",
    duration: 60,
    totalPrice: 0,
    status: "available",
    createdAt: new Date("2024-12-28"),
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

export function EnhancedAdminCalendar() {
  const [selectedDate, setSelectedDate] = useState("2025-01-03")
  const [courtTypeFilter, setCourtTypeFilter] = useState<"all" | "hard" | "clay" | "indoor">("all")
  const [selectedItem, setSelectedItem] = useState<Booking | TrainingSession | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showTrainingModal, setShowTrainingModal] = useState(false)
  const [showSlotChoiceModal, setShowSlotChoiceModal] = useState(false)
  const [showClientBookingModal, setShowClientBookingModal] = useState(false)
  const [slotClickData, setSlotClickData] = useState<SlotClickChoice | null>(null)
  const [bookings, setBookings] = useState<Booking[]>(DEMO_BOOKINGS)
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>(DEMO_TRAINING_SESSIONS)
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

  // Get booking for slot
  const getBookingForSlot = (courtId: string, date: string, time: string): Booking | null => {
    return bookings.find((b) => b.courtId === courtId && b.date === date && b.timeSlots.includes(time)) || null
  }

  // Get training session for slot
  const getTrainingSessionForSlot = (courtId: string, date: string, time: string): TrainingSession | null => {
    return (
      trainingSessions.find((s) => {
        if (s.courtId !== courtId || s.date !== date) return false
        const sessionStart = s.startTime
        const sessionEnd = s.endTime
        return time >= sessionStart && time < sessionEnd
      }) || null
    )
  }

  // Check if time slot is the start of a training session
  const isTrainingSessionStart = (session: TrainingSession, time: string): boolean => {
    return session.startTime === time
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

  const handleSlotClick = (
    courtId: string,
    time: string,
    booking: Booking | null,
    trainingSession: TrainingSession | null,
  ) => {
    if (booking) {
      setSelectedItem(booking)
    } else if (trainingSession) {
      if (trainingSession.status === "available") {
        // Open client booking form for unbooked training session
        setClientBookingForm({
          sessionId: trainingSession.id,
          clientId: "",
          clientName: "",
          clientPhone: "",
          clientEmail: "",
          notes: "",
        })
        setShowClientBookingModal(true)
      } else {
        setSelectedItem(trainingSession)
      }
    } else {
      // Empty slot clicked - show choice modal
      setSlotClickData({ courtId, time, date: selectedDate })
      setShowSlotChoiceModal(true)
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

    // Generate time slots based on duration (30-minute intervals)
    const startHour = Number.parseInt(newBooking.startTime.split(":")[0])
    const startMinute = Number.parseInt(newBooking.startTime.split(":")[1])
    const slotsNeeded = newBooking.duration / 30
    const timeSlots: string[] = []

    for (let i = 0; i < slotsNeeded; i++) {
      const slotMinute = startMinute + i * 30
      const slotHour = startHour + Math.floor(slotMinute / 60)
      const finalMinute = slotMinute % 60
      timeSlots.push(`${slotHour.toString().padStart(2, "0")}:${finalMinute.toString().padStart(2, "0")}`)
    }

    const court = COURTS.find((c) => c.id === newBooking.courtId)
    const totalPrice = timeSlots.reduce((sum, slot) => sum + calculateSlotPrice(court?.basePrice || 0, slot), 0)

    const booking: Booking = {
      id: Date.now().toString(),
      courtId: newBooking.courtId,
      date: newBooking.date,
      timeSlots,
      duration: newBooking.duration,
      clientName: newBooking.clientName,
      clientPhone: newBooking.clientPhone,
      clientEmail: newBooking.clientEmail,
      totalPrice,
      status: "pending",
      createdBy: "admin",
      notes: newBooking.notes || undefined,
    }

    setBookings([...bookings, booking])
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

    // Update training session with client info
    setTrainingSessions(
      trainingSessions.map((session) =>
        session.id === clientBookingForm.sessionId
          ? {
              ...session,
              status: "booked",
              clientInfo: {
                name: clientBookingForm.clientName,
                phone: clientBookingForm.clientPhone,
                email: clientBookingForm.clientEmail,
              },
            }
          : session,
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

  const generateRecurringSessions = (baseSession: NewTrainingSession): TrainingSession[] => {
    const sessions: TrainingSession[] = []
    const startDate = new Date(baseSession.date)
    const endDate = baseSession.recurringEndDate ? new Date(baseSession.recurringEndDate) : new Date(startDate)
    endDate.setMonth(endDate.getMonth() + 1) // Default to 1 month if no end date

    const createSession = (date: Date): TrainingSession => {
      const startTime = baseSession.startTime
      const [hours, minutes] = startTime.split(":").map(Number)
      const endMinutes = minutes + baseSession.duration
      const endHours = hours + Math.floor(endMinutes / 60)
      const finalMinutes = endMinutes % 60
      const endTime = `${endHours.toString().padStart(2, "0")}:${finalMinutes.toString().padStart(2, "0")}`

      return {
        id: `${Date.now()}-${date.getTime()}`,
        coachId: baseSession.coachId,
        courtId: baseSession.courtId,
        date: date.toISOString().split("T")[0],
        startTime,
        endTime,
        duration: baseSession.duration,
        totalPrice: 0,
        status: "available",
        createdAt: new Date(),
      }
    }

    if (baseSession.recurring === "none") {
      sessions.push(createSession(startDate))
    } else if (baseSession.recurring === "daily") {
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        sessions.push(createSession(new Date(d)))
      }
    } else if (baseSession.recurring === "weekly") {
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
        sessions.push(createSession(new Date(d)))
      }
    } else if (baseSession.recurring === "custom" && baseSession.recurringDays) {
      // Convert Monday-first to Sunday-first for Date.getDay()
      const targetDays = baseSession.recurringDays.map((day) => {
        const mondayFirst = Number.parseInt(day)
        return mondayFirst === 6 ? 0 : mondayFirst + 1 // Convert Monday-first to Sunday-first
      })
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        if (targetDays.includes(d.getDay())) {
          sessions.push(createSession(new Date(d)))
        }
      }
    }

    return sessions
  }

  const handleTrainingSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newSessions = generateRecurringSessions(newTrainingSession)
    setTrainingSessions([...trainingSessions, ...newSessions])
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

  const isBooking = (item: Booking | TrainingSession): item is Booking => {
    return "timeSlots" in item
  }

  return (
    <div className="h-screen flex flex-col bg-white">
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

      {/* Legend */}
      <div className="bg-gray-50 border-b border-gray-200 p-2">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Оплаченные брони</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>Оплата на месте</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>Забронированные тренировки</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Незабронированные тренировки</span>
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
                const booking = getBookingForSlot(court.id, selectedDate, time)
                const trainingSession = getTrainingSessionForSlot(court.id, selectedDate, time)
                const isFirstSlot = booking && booking.timeSlots[0] === time
                const isTrainingStart = trainingSession && isTrainingSessionStart(trainingSession, time)
                const slotPrice = calculateSlotPrice(court.basePrice, time)

                let slotContent = null
                let slotClass =
                  "relative text-xs border-r border-b border-gray-300 transition-all hover:shadow-md cursor-pointer "

                if (trainingSession) {
                  const coach = getCoachInfo(trainingSession.coachId)
                  if (isTrainingStart) {
                    slotClass +=
                      trainingSession.status === "booked"
                        ? "bg-purple-500 text-white hover:bg-purple-600"
                        : "bg-green-500 text-white hover:bg-green-600"

                    slotContent = (
                      <div className="p-2 h-full flex flex-col justify-center overflow-hidden">
                        <div className="font-bold text-sm truncate flex items-center gap-1">
                          <User className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{coach?.name}</span>
                        </div>
                        <div className="text-xs opacity-90 flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span>{trainingSession.duration} мин</span>
                        </div>
                        {trainingSession.clientInfo && (
                          <div className="text-xs opacity-75 truncate mt-1">{trainingSession.clientInfo.name}</div>
                        )}
                      </div>
                    )
                  } else {
                    slotClass += "bg-gray-400 opacity-50 cursor-not-allowed"
                    slotContent = <div className="h-full"></div>
                  }
                } else if (booking && isFirstSlot) {
                  slotClass +=
                    booking.status === "confirmed"
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-orange-500 text-white hover:bg-orange-600"

                  slotContent = (
                    <div className="p-2 h-full flex flex-col justify-center overflow-hidden">
                      <div className="font-bold text-sm truncate">{booking.clientName}</div>
                      <div className="text-xs opacity-90 mt-1">{booking.duration} мин</div>
                      <div className="text-xs font-semibold mt-1">{booking.totalPrice}₽</div>
                    </div>
                  )
                } else if (booking) {
                  slotClass += "bg-gray-400 opacity-50 cursor-not-allowed"
                  slotContent = <div className="h-full"></div>
                } else {
                  slotClass += "bg-gray-50 hover:bg-blue-50"
                  slotContent = (
                    <div className="p-2 h-full flex flex-col justify-center text-gray-600">
                      <div className="font-semibold text-sm">{slotPrice}₽</div>
                      <div className="text-xs mt-1">30 мин</div>
                    </div>
                  )
                }

                return (
                  <button
                    key={`${court.id}-${time}`}
                    onClick={() => handleSlotClick(court.id, time, booking, trainingSession)}
                    className={slotClass}
                  >
                    {slotContent}
                  </button>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

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

      {/* Client Booking Modal for Unbooked Training Sessions */}
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

              <div>
                <label className="block text-sm font-medium mb-2">Повторение</label>
                <select
                  value={newTrainingSession.recurring}
                  onChange={(e) =>
                    setNewTrainingSession({
                      ...newTrainingSession,
                      recurring: e.target.value as NewTrainingSession["recurring"],
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="none">Разовая тренировка</option>
                  <option value="daily">Каждый день</option>
                  <option value="weekly">Каждую неделю</option>
                  <option value="custom">В определенные дни недели</option>
                </select>
              </div>

              {newTrainingSession.recurring === "custom" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Дни недели</label>
                  <div className="grid grid-cols-7 gap-2">
                    {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          const days = newTrainingSession.recurringDays || []
                          const dayStr = index.toString()
                          setNewTrainingSession({
                            ...newTrainingSession,
                            recurringDays: days.includes(dayStr) ? days.filter((d) => d !== dayStr) : [...days, dayStr],
                          })
                        }}
                        className={`p-2 text-sm rounded border ${
                          (newTrainingSession.recurringDays || []).includes(index.toString())
                            ? "bg-purple-100 border-purple-300 text-purple-800"
                            : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {newTrainingSession.recurring !== "none" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Окончание повторений</label>
                  <input
                    type="date"
                    value={newTrainingSession.recurringEndDate}
                    onChange={(e) => setNewTrainingSession({ ...newTrainingSession, recurringEndDate: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              <div className="bg-purple-50 p-4 rounded-md">
                <p className="text-sm text-purple-800">
                  <strong>Примечание:</strong> Это создаст временные слоты для тренера. Клиенты смогут забронировать эти
                  слоты отдельно.
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

      {/* Details Modal */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isBooking(selectedItem) ? "Детали бронирования" : "Детали тренировки"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {isBooking(selectedItem) ? (
                <>
                  <div>
                    <strong>Клиент:</strong> {selectedItem.clientName}
                  </div>
                  <div>
                    <strong>Телефон:</strong> {selectedItem.clientPhone}
                  </div>
                  {selectedItem.clientEmail && (
                    <div>
                      <strong>Email:</strong> {selectedItem.clientEmail}
                    </div>
                  )}
                  <div>
                    <strong>Корт:</strong> {COURTS.find((c) => c.id === selectedItem.courtId)?.name}
                  </div>
                  <div>
                    <strong>Время:</strong> {selectedItem.timeSlots[0]} -{" "}
                    {selectedItem.timeSlots[selectedItem.timeSlots.length - 1]}
                  </div>
                  <div>
                    <strong>Сумма:</strong> {selectedItem.totalPrice}₽
                  </div>
                  <div>
                    <strong>Статус:</strong>
                    <Badge
                      className={`ml-2 ${selectedItem.status === "confirmed" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"}`}
                    >
                      {selectedItem.status === "confirmed" ? "Оплачено" : "Оплата на месте"}
                    </Badge>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <strong>Тренер:</strong> {getCoachInfo(selectedItem.coachId)?.name}
                  </div>
                  <div>
                    <strong>Корт:</strong> {COURTS.find((c) => c.id === selectedItem.courtId)?.name}
                  </div>
                  <div>
                    <strong>Время:</strong> {selectedItem.startTime} - {selectedItem.endTime}
                  </div>
                  <div>
                    <strong>Длительность:</strong> {selectedItem.duration} минут
                  </div>
                  <div>
                    <strong>Статус:</strong>
                    <Badge
                      className={`ml-2 ${selectedItem.status === "booked" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"}`}
                    >
                      {selectedItem.status === "booked" ? "Забронированная тренировка" : "Незабронированная тренировка"}
                    </Badge>
                  </div>
                  {selectedItem.clientInfo && (
                    <>
                      <div>
                        <strong>Клиент:</strong> {selectedItem.clientInfo.name}
                      </div>
                      <div>
                        <strong>Телефон:</strong> {selectedItem.clientInfo.phone}
                      </div>
                      {selectedItem.clientInfo.email && (
                        <div>
                          <strong>Email:</strong> {selectedItem.clientInfo.email}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1 bg-transparent">
                Редактировать
              </Button>
              <Button variant="destructive" className="flex-1">
                Отменить
              </Button>
              <Button variant="secondary" onClick={() => setSelectedItem(null)}>
                Закрыть
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
