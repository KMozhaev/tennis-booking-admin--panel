"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, MapPin, Plus } from "lucide-react"
import type { TrainingSession } from "../types/coach-types"

// Demo training sessions
const DEMO_SESSIONS: TrainingSession[] = [
  {
    id: "1",
    coachId: "1",
    courtId: "1",
    date: "2024-06-29",
    startTime: "10:00",
    endTime: "11:30",
    duration: 90,
    totalPrice: 4350, // court (600*1.5) + coach (2500*1.5)
    status: "booked",
    clientInfo: {
      name: "Александр Смирнов",
      phone: "+7 916 555-12-34",
      email: "alex.smirnov@email.ru",
    },
    createdAt: new Date("2024-06-25"),
  },
  {
    id: "2",
    coachId: "2",
    courtId: "3",
    date: "2024-06-29",
    startTime: "16:00",
    endTime: "17:00",
    duration: 60,
    totalPrice: 3720, // court (720) + coach (3000)
    status: "available",
    createdAt: new Date("2024-06-28"),
  },
  {
    id: "3",
    coachId: "3",
    courtId: "2",
    date: "2024-06-30",
    startTime: "09:00",
    endTime: "10:30",
    duration: 90,
    totalPrice: 4020, // court (480*1.5) + coach (2200*1.5)
    status: "available",
    createdAt: new Date("2024-06-28"),
  },
]

const DEMO_COACHES = [
  { id: "1", name: "Анна Петрова", hourlyRate: 2500 },
  { id: "2", name: "Дмитрий Козлов", hourlyRate: 3000 },
  { id: "3", name: "Елена Сидорова", hourlyRate: 2200 },
  { id: "4", name: "Михаил Иванов", hourlyRate: 2800 },
]

const COURTS = [
  { id: "1", name: "Корт 1 (Хард)", basePrice: 600 },
  { id: "2", name: "Корт 2 (Хард)", basePrice: 480 },
  { id: "3", name: "Корт 3 (Грунт)", basePrice: 720 },
  { id: "4", name: "Корт 4 (Грунт)", basePrice: 600 },
  { id: "5", name: "Корт 5 (Крытый)", basePrice: 480 },
]

interface NewSession {
  coachId: string
  courtId: string
  date: string
  startTime: string
  duration: number
}

export function TrainingSessions() {
  const [sessions, setSessions] = useState<TrainingSession[]>(DEMO_SESSIONS)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newSession, setNewSession] = useState<NewSession>({
    coachId: "",
    courtId: "",
    date: "",
    startTime: "",
    duration: 60,
  })

  const calculateSessionPrice = (courtId: string, coachId: string, duration: number) => {
    const court = COURTS.find((c) => c.id === courtId)
    const coach = DEMO_COACHES.find((c) => c.id === coachId)

    if (!court || !coach) return 0

    const courtPrice = (court.basePrice / 60) * duration
    const coachPrice = (coach.hourlyRate / 60) * duration

    return Math.round(courtPrice + coachPrice)
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const startTime = newSession.startTime
    const [hours, minutes] = startTime.split(":").map(Number)
    const endMinutes = minutes + newSession.duration
    const endHours = hours + Math.floor(endMinutes / 60)
    const finalMinutes = endMinutes % 60
    const endTime = `${endHours.toString().padStart(2, "0")}:${finalMinutes.toString().padStart(2, "0")}`

    const totalPrice = calculateSessionPrice(newSession.courtId, newSession.coachId, newSession.duration)

    const session: TrainingSession = {
      id: Date.now().toString(),
      ...newSession,
      endTime,
      totalPrice,
      status: "available",
      createdAt: new Date(),
    }

    setSessions([...sessions, session])
    setShowCreateModal(false)
    setNewSession({
      coachId: "",
      courtId: "",
      date: "",
      startTime: "",
      duration: 60,
    })
  }

  const getStatusBadge = (status: TrainingSession["status"]) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800">Доступно</Badge>
      case "booked":
        return <Badge className="bg-blue-100 text-blue-800">Забронировано</Badge>
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Завершено</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Отменено</Badge>
    }
  }

  const getCoachName = (coachId: string) => {
    return DEMO_COACHES.find((c) => c.id === coachId)?.name || "Неизвестный тренер"
  }

  const getCourtName = (courtId: string) => {
    return COURTS.find((c) => c.id === courtId)?.name || "Неизвестный корт"
  }

  const currentPrice =
    newSession.coachId && newSession.courtId
      ? calculateSessionPrice(newSession.courtId, newSession.coachId, newSession.duration)
      : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Тренировочные сессии</h2>
          <p className="text-gray-600">
            Всего сессий: {sessions.length} | Доступно: {sessions.filter((s) => s.status === "available").length}
          </p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Создать сессию
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Создать тренировочную сессию</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Тренер</label>
                <select
                  required
                  value={newSession.coachId}
                  onChange={(e) => setNewSession({ ...newSession, coachId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Выберите тренера</option>
                  {DEMO_COACHES.map((coach) => (
                    <option key={coach.id} value={coach.id}>
                      {coach.name} - {coach.hourlyRate}₽/час
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Корт</label>
                <select
                  required
                  value={newSession.courtId}
                  onChange={(e) => setNewSession({ ...newSession, courtId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Выберите корт</option>
                  {COURTS.map((court) => (
                    <option key={court.id} value={court.id}>
                      {court.name} - {court.basePrice}₽/час
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Дата</label>
                  <input
                    type="date"
                    required
                    value={newSession.date}
                    onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Время</label>
                  <input
                    type="time"
                    required
                    value={newSession.startTime}
                    onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Длительность</label>
                <select
                  value={newSession.duration}
                  onChange={(e) => setNewSession({ ...newSession, duration: Number.parseInt(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={60}>60 минут</option>
                  <option value={90}>90 минут</option>
                  <option value={120}>120 минут</option>
                </select>
              </div>

              {currentPrice > 0 && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Стоимость сессии:</span>
                    <span className="text-lg font-bold text-blue-600">{currentPrice.toLocaleString()}₽</span>
                  </div>
                </div>
              )}

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
                  Создать сессию
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sessions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <Card key={session.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{getCoachName(session.coachId)}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">{getStatusBadge(session.status)}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{session.totalPrice.toLocaleString()}₽</div>
                  <div className="text-xs text-gray-500">{session.duration} мин</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(session.date).toLocaleDateString("ru-RU")}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>
                    {session.startTime} - {session.endTime}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{getCourtName(session.courtId)}</span>
                </div>
              </div>

              {session.clientInfo && (
                <div className="pt-2 border-t">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="font-medium">{session.clientInfo.name}</div>
                      <div className="text-gray-500">{session.clientInfo.phone}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {session.status === "available" && (
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Редактировать
                  </Button>
                )}
                <Button variant={session.status === "available" ? "default" : "outline"} size="sm" className="flex-1">
                  {session.status === "available" ? "Забронировать" : "Подробнее"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sessions.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Нет тренировочных сессий</h3>
          <p className="text-gray-500 mb-4">Создайте первую тренировочную сессию для начала работы</p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Создать сессию
          </Button>
        </div>
      )}
    </div>
  )
}
