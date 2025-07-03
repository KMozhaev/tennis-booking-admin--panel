"use client"

import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Data Types
interface Booking {
  id: string
  courtId: string
  date: string // 'YYYY-MM-DD'
  timeSlots: string[] // ['14:00', '14:30'] for 60-min slot
  duration: number // minutes
  clientName: string
  clientPhone: string
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

// Demo Data - Updated to July 2025
const COURTS: Court[] = [
  { id: "1", name: "Корт 1 (Хард)", type: "hard", basePrice: 600 },
  { id: "2", name: "Корт 2 (Хард)", type: "hard", basePrice: 480 },
  { id: "3", name: "Корт 3 (Грунт)", type: "clay", basePrice: 720 },
  { id: "4", name: "Корт 4 (Грунт)", type: "clay", basePrice: 600 },
  { id: "5", name: "Корт 5 (Крытый)", type: "indoor", basePrice: 480 },
]

const DEMO_BOOKINGS: Booking[] = [
  {
    id: "1",
    courtId: "2",
    date: "2025-07-03",
    timeSlots: ["08:30", "09:00"],
    duration: 60,
    clientName: "Анна Петрова",
    clientPhone: "+7 916 123-45-67",
    totalPrice: 1497,
    status: "confirmed",
    paymentMethod: "online",
    createdBy: "system",
  },
  {
    id: "2",
    courtId: "2",
    date: "2025-07-03",
    timeSlots: ["09:30", "10:00"],
    duration: 60,
    clientName: "Михаил Иванов",
    clientPhone: "+7 903 987-65-43",
    totalPrice: 1497,
    status: "confirmed",
    paymentMethod: "onsite",
    createdBy: "system",
  },
  {
    id: "3",
    courtId: "1",
    date: "2025-07-03",
    timeSlots: ["14:00", "14:30"],
    duration: 60,
    clientName: "Елена Сидорова",
    clientPhone: "+7 925 456-78-90",
    totalPrice: 1800,
    status: "pending",
    createdBy: "admin",
    notes: "Звонила, попросила забронировать",
  },
  {
    id: "4",
    courtId: "3",
    date: "2025-07-03",
    timeSlots: ["18:00", "18:30"],
    duration: 60,
    clientName: "Дмитрий Козлов",
    clientPhone: "+7 917 234-56-78",
    totalPrice: 2340,
    status: "confirmed",
    paymentMethod: "online",
    createdBy: "system",
  },
]

// Generate 30-minute time slots from 8:00 to 22:00
const TIME_SLOTS: string[] = []
for (let hour = 8; hour < 22; hour++) {
  for (let minute = 0; minute < 60; minute += 30) {
    TIME_SLOTS.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`)
  }
}

interface NewBooking {
  courtId: string
  startTime: string
  date: string
  clientName: string
  clientPhone: string
  duration: number
  notes: string
}

export default function AdminCalendar() {
  const [selectedDate, setSelectedDate] = useState("2025-07-03")
  const [courtTypeFilter, setCourtTypeFilter] = useState<"all" | "hard" | "clay" | "indoor">("all")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>(DEMO_BOOKINGS)
  const [newBooking, setNewBooking] = useState<NewBooking>({
    courtId: "",
    startTime: "",
    date: "",
    clientName: "",
    clientPhone: "",
    duration: 60,
    notes: "",
  })

  // Filter courts based on type
  const filteredCourts = useMemo(() => {
    if (courtTypeFilter === "all") return COURTS
    return COURTS.filter((court) => court.type === courtTypeFilter)
  }, [courtTypeFilter])

  // Core Logic Functions
  const getBookingForSlot = (courtId: string, date: string, time: string): Booking | null => {
    return bookings.find((b) => b.courtId === courtId && b.date === date && b.timeSlots.includes(time)) || null
  }

  const calculateSlotPrice = (basePrice: number, time: string): number => {
    const hour = Number.parseInt(time.split(":")[0])
    let multiplier = 1.0
    if (hour >= 8 && hour < 16) multiplier = 0.8
    else if (hour >= 16 && hour < 19) multiplier = 1.0
    else if (hour >= 19 && hour < 22) multiplier = 1.3
    return Math.round(basePrice * multiplier)
  }

  const getEndTime = (booking: Booking): string => {
    const startTime = booking.timeSlots[0]
    const [hours, minutes] = startTime.split(":").map(Number)
    const endMinutes = minutes + booking.duration
    const endHours = hours + Math.floor(endMinutes / 60)
    const finalMinutes = endMinutes % 60
    return `${endHours.toString().padStart(2, "0")}:${finalMinutes.toString().padStart(2, "0")}`
  }

  const handleSlotClick = (courtId: string, time: string, booking: Booking | null) => {
    if (booking) {
      setSelectedBooking(booking)
    } else {
      setNewBooking({
        courtId,
        startTime: time,
        date: selectedDate,
        clientName: "",
        clientPhone: "",
        duration: 60,
        notes: "",
      })
      setShowCreateModal(true)
    }
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Generate time slots based on duration
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
      totalPrice,
      status: "pending",
      createdBy: "admin",
      notes: newBooking.notes || undefined,
    }

    setBookings([...bookings, booking])
    setShowCreateModal(false)
    setNewBooking({
      courtId: "",
      startTime: "",
      date: "",
      clientName: "",
      clientPhone: "",
      duration: 60,
      notes: "",
    })
  }

  const handleCancelBooking = (bookingId: string) => {
    setBookings(bookings.filter((b) => b.id !== bookingId))
    setSelectedBooking(null)
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

          <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700 ml-auto">
            + Создать бронирование
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        <div
          className="min-w-max"
          style={{
            display: "grid",
            gridTemplateColumns: `80px repeat(${filteredCourts.length}, 140px)`,
            gridTemplateRows: `50px repeat(${TIME_SLOTS.length}, 60px)`,
            gap: 0,
          }}
        >
          {/* Corner cell */}
          <div className="bg-white sticky top-0 left-0 z-20 border-r border-b border-gray-300 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">Время</span>
          </div>

          {/* Court headers (sticky) with updated price format */}
          {filteredCourts.map((court) => (
            <div
              key={court.id}
              className="bg-white font-medium text-center py-2 text-sm sticky top-0 z-10 border-r border-b border-gray-300 flex items-center justify-center"
            >
              <div>
                <div className="font-semibold">{court.name}</div>
                <div className="text-xs text-gray-500">от {court.basePrice}₽ /30 мин</div>
              </div>
            </div>
          ))}

          {/* Time slots */}
          {TIME_SLOTS.map((time) => (
            <React.Fragment key={time}>
              {/* Time label (sticky) */}
              <div className="bg-white text-xs font-medium py-2 px-2 text-right sticky left-0 z-10 border-r border-b border-gray-300 flex items-center justify-end">
                {time}
              </div>

              {/* Court slots for this time */}
              {filteredCourts.map((court) => {
                const booking = getBookingForSlot(court.id, selectedDate, time)
                const isFirstSlot = booking && booking.timeSlots[0] === time
                const slotPrice = calculateSlotPrice(court.basePrice, time)

                return (
                  <button
                    key={`${court.id}-${time}`}
                    onClick={() => handleSlotClick(court.id, time, booking)}
                    className={`relative text-xs border-r border-b border-gray-300 transition-all hover:shadow-md ${
                      booking
                        ? booking.status === "confirmed"
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-yellow-500 text-white hover:bg-yellow-600"
                        : "bg-gray-50 hover:bg-blue-50"
                    }`}
                  >
                    {booking && isFirstSlot ? (
                      <div className="p-2 h-full flex flex-col justify-center items-center text-center">
                        <div className="font-medium truncate text-xs text-white drop-shadow-sm">
                          {booking.clientName}
                        </div>
                        <div className="text-xs opacity-90 text-white drop-shadow-sm">{booking.duration} мин</div>
                        <div className="text-xs font-semibold text-white drop-shadow-sm">{booking.totalPrice}₽</div>
                        {booking.status === "pending" && (
                          <div className="text-xs opacity-75 text-white drop-shadow-sm">Ожидает</div>
                        )}
                      </div>
                    ) : booking ? (
                      <div className="h-full bg-gray-400 opacity-50"></div>
                    ) : (
                      <div className="p-2 h-full flex flex-col justify-center items-center text-center text-gray-600">
                        <div className="font-medium">{slotPrice}₽</div>
                        <div className="text-xs">30 мин</div>
                      </div>
                    )}
                  </button>
                )
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Детали бронирования</h3>

              <div className="space-y-3 mb-6">
                <div>
                  <strong>Клиент:</strong> {selectedBooking.clientName}
                </div>
                <div>
                  <strong>Телефон:</strong> {selectedBooking.clientPhone}
                </div>
                <div>
                  <strong>Корт:</strong> {COURTS.find((c) => c.id === selectedBooking.courtId)?.name}
                </div>
                <div>
                  <strong>Время:</strong> {selectedBooking.timeSlots[0]} - {getEndTime(selectedBooking)}
                </div>
                <div>
                  <strong>Длительность:</strong> {selectedBooking.duration} минут
                </div>
                <div>
                  <strong>Сумма:</strong> {selectedBooking.totalPrice}₽
                </div>
                <div>
                  <strong>Статус:</strong>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-xs ${
                      selectedBooking.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedBooking.status === "confirmed" ? "Подтверждено" : "Ожидает оплаты"}
                  </span>
                </div>
                {selectedBooking.paymentMethod && (
                  <div>
                    <strong>Оплата:</strong> {selectedBooking.paymentMethod === "online" ? "Онлайн" : "На месте"}
                  </div>
                )}
                {selectedBooking.notes && (
                  <div>
                    <strong>Заметки:</strong> {selectedBooking.notes}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    // TODO: Implement edit functionality
                    console.log("Edit booking:", selectedBooking.id)
                  }}
                >
                  Редактировать
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleCancelBooking(selectedBooking.id)}
                >
                  Отменить
                </Button>
                <Button variant="secondary" onClick={() => setSelectedBooking(null)}>
                  Закрыть
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Booking Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Создать бронирование</h3>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Имя клиента"
                  required
                  value={newBooking.clientName}
                  onChange={(e) => setNewBooking({ ...newBooking, clientName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <input
                  type="tel"
                  placeholder="Телефон (+7 XXX XXX-XX-XX)"
                  required
                  value={newBooking.clientPhone}
                  onChange={(e) => setNewBooking({ ...newBooking, clientPhone: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <select
                  value={newBooking.courtId}
                  onChange={(e) => setNewBooking({ ...newBooking, courtId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Выберите корт</option>
                  {COURTS.map((court) => (
                    <option key={court.id} value={court.id}>
                      {court.name}
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={newBooking.date}
                    onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />

                  <input
                    type="time"
                    value={newBooking.startTime}
                    onChange={(e) => setNewBooking({ ...newBooking, startTime: e.target.value })}
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <select
                  value={newBooking.duration}
                  onChange={(e) => setNewBooking({ ...newBooking, duration: Number.parseInt(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Отмена
                  </Button>
                  <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Создать
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
