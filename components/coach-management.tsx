"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Calendar, Clock, User, Phone, Mail } from "lucide-react"
import type { Coach, WorkingHours } from "../types/coach-types"

const DEMO_COACHES: Coach[] = [
  {
    id: "1",
    name: "Анна Петрова",
    email: "anna.petrova@tennispark.ru",
    phone: "+7 916 123-45-67",
    hourlyRate: 2500,
    specialization: ["Начинающие", "Дети"],
    experience: 8,
    status: "active",
    workingHours: {
      monday: { start: "09:00", end: "18:00", isWorking: true },
      tuesday: { start: "09:00", end: "18:00", isWorking: true },
      wednesday: { start: "09:00", end: "18:00", isWorking: true },
      thursday: { start: "09:00", end: "18:00", isWorking: true },
      friday: { start: "09:00", end: "18:00", isWorking: true },
      saturday: { start: "10:00", end: "16:00", isWorking: true },
      sunday: { start: "", end: "", isWorking: false },
    },
    exceptions: [],
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2024-12-01"),
  },
  {
    id: "2",
    name: "Дмитрий Козлов",
    email: "dmitry.kozlov@tennispark.ru",
    phone: "+7 903 987-65-43",
    hourlyRate: 3000,
    specialization: ["Профессионалы", "Турниры"],
    experience: 12,
    status: "active",
    workingHours: {
      monday: { start: "08:00", end: "20:00", isWorking: true },
      tuesday: { start: "08:00", end: "20:00", isWorking: true },
      wednesday: { start: "08:00", end: "20:00", isWorking: true },
      thursday: { start: "08:00", end: "20:00", isWorking: true },
      friday: { start: "08:00", end: "20:00", isWorking: true },
      saturday: { start: "09:00", end: "17:00", isWorking: true },
      sunday: { start: "10:00", end: "15:00", isWorking: true },
    },
    exceptions: [
      {
        id: "1",
        date: "2025-01-10",
        type: "unavailable",
        reason: "Личные дела",
      },
    ],
    createdAt: new Date("2022-08-20"),
    updatedAt: new Date("2024-11-15"),
  },
  {
    id: "3",
    name: "Елена Сидорова",
    email: "elena.sidorova@tennispark.ru",
    phone: "+7 925 456-78-90",
    hourlyRate: 2200,
    specialization: ["Женский теннис", "Фитнес"],
    experience: 6,
    status: "active",
    workingHours: {
      monday: { start: "10:00", end: "19:00", isWorking: true },
      tuesday: { start: "10:00", end: "19:00", isWorking: true },
      wednesday: { start: "", end: "", isWorking: false },
      thursday: { start: "10:00", end: "19:00", isWorking: true },
      friday: { start: "10:00", end: "19:00", isWorking: true },
      saturday: { start: "09:00", end: "15:00", isWorking: true },
      sunday: { start: "", end: "", isWorking: false },
    },
    exceptions: [],
    createdAt: new Date("2023-05-10"),
    updatedAt: new Date("2024-10-20"),
  },
  {
    id: "4",
    name: "Михаил Иванов",
    email: "mikhail.ivanov@tennispark.ru",
    phone: "+7 917 234-56-78",
    hourlyRate: 2800,
    specialization: ["Юниоры", "Групповые занятия"],
    experience: 10,
    status: "inactive",
    workingHours: {
      monday: { start: "09:00", end: "17:00", isWorking: true },
      tuesday: { start: "09:00", end: "17:00", isWorking: true },
      wednesday: { start: "09:00", end: "17:00", isWorking: true },
      thursday: { start: "09:00", end: "17:00", isWorking: true },
      friday: { start: "09:00", end: "17:00", isWorking: true },
      saturday: { start: "", end: "", isWorking: false },
      sunday: { start: "", end: "", isWorking: false },
    },
    exceptions: [],
    createdAt: new Date("2022-03-12"),
    updatedAt: new Date("2024-09-01"),
  },
]

const SPECIALIZATIONS = [
  "Начинающие",
  "Дети",
  "Юниоры",
  "Профессионалы",
  "Женский теннис",
  "Мужской теннис",
  "Групповые занятия",
  "Индивидуальные занятия",
  "Турниры",
  "Фитнес",
]

const DAYS_OF_WEEK = [
  { key: "monday", label: "Понедельник" },
  { key: "tuesday", label: "Вторник" },
  { key: "wednesday", label: "Среда" },
  { key: "thursday", label: "Четверг" },
  { key: "friday", label: "Пятница" },
  { key: "saturday", label: "Суббота" },
  { key: "sunday", label: "Воскресенье" },
]

export function CoachManagement() {
  const [coaches, setCoaches] = useState<Coach[]>(DEMO_COACHES)
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null)
  const [showCoachModal, setShowCoachModal] = useState(false)
  const [showAddCoachModal, setShowAddCoachModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null)
  const [newCoach, setNewCoach] = useState({
    name: "",
    email: "",
    phone: "",
    hourlyRate: 2500,
    specialization: [] as string[],
    experience: 1,
  })

  const handleAddCoach = (e: React.FormEvent) => {
    e.preventDefault()

    const defaultWorkingHours: WorkingHours = {
      monday: { start: "09:00", end: "18:00", isWorking: true },
      tuesday: { start: "09:00", end: "18:00", isWorking: true },
      wednesday: { start: "09:00", end: "18:00", isWorking: true },
      thursday: { start: "09:00", end: "18:00", isWorking: true },
      friday: { start: "09:00", end: "18:00", isWorking: true },
      saturday: { start: "10:00", end: "16:00", isWorking: true },
      sunday: { start: "", end: "", isWorking: false },
    }

    const coach: Coach = {
      id: Date.now().toString(),
      ...newCoach,
      status: "active",
      workingHours: defaultWorkingHours,
      exceptions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setCoaches([...coaches, coach])
    setShowAddCoachModal(false)
    setNewCoach({
      name: "",
      email: "",
      phone: "",
      hourlyRate: 2500,
      specialization: [],
      experience: 1,
    })
  }

  const handleEditCoach = (coach: Coach) => {
    setEditingCoach(coach)
    setShowCoachModal(true)
  }

  const handleScheduleManagement = (coach: Coach) => {
    setSelectedCoach(coach)
    setShowScheduleModal(true)
  }

  const handleSpecializationToggle = (specialization: string) => {
    setNewCoach((prev) => ({
      ...prev,
      specialization: prev.specialization.includes(specialization)
        ? prev.specialization.filter((s) => s !== specialization)
        : [...prev.specialization, specialization],
    }))
  }

  const getStatusBadge = (status: Coach["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Активный</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Неактивный</Badge>
      case "on_vacation":
        return <Badge className="bg-yellow-100 text-yellow-800">В отпуске</Badge>
    }
  }

  const getWorkingDaysCount = (workingHours: WorkingHours) => {
    return Object.values(workingHours).filter((day) => day.isWorking).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Управление тренерами</h2>
          <p className="text-gray-600">
            Всего тренеров: {coaches.length} | Активных: {coaches.filter((c) => c.status === "active").length}
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddCoachModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить тренера
        </Button>
      </div>

      {/* Coaches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches.map((coach) => (
          <Card key={coach.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{coach.name}</CardTitle>
                    <p className="text-sm text-gray-500">{coach.experience} лет опыта</p>
                  </div>
                </div>
                {getStatusBadge(coach.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{coach.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{coach.email}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Специализация:</p>
                <div className="flex flex-wrap gap-1">
                  {coach.specialization.slice(0, 2).map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {coach.specialization.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{coach.specialization.length - 2}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-gray-500">Ставка:</span>
                  <span className="font-semibold ml-1">{coach.hourlyRate}₽/час</span>
                </div>
                <div>
                  <span className="text-gray-500">Рабочих дней:</span>
                  <span className="font-semibold ml-1">{getWorkingDaysCount(coach.workingHours)}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => handleEditCoach(coach)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Редактировать
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => handleScheduleManagement(coach)}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Расписание
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Coach Modal */}
      {showAddCoachModal && (
        <Dialog open={showAddCoachModal} onOpenChange={setShowAddCoachModal}>
          <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Добавить нового тренера</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCoach} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Имя и фамилия *</label>
                  <input
                    type="text"
                    required
                    value={newCoach.name}
                    onChange={(e) => setNewCoach({ ...newCoach, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Иван Петров"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Телефон *</label>
                  <input
                    type="tel"
                    required
                    value={newCoach.phone}
                    onChange={(e) => setNewCoach({ ...newCoach, phone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+7 XXX XXX-XX-XX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={newCoach.email}
                  onChange={(e) => setNewCoach({ ...newCoach, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ivan.petrov@tennispark.ru"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ставка (₽/час) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    max="10000"
                    step="100"
                    value={newCoach.hourlyRate}
                    onChange={(e) => setNewCoach({ ...newCoach, hourlyRate: Number.parseInt(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Опыт (лет) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="50"
                    value={newCoach.experience}
                    onChange={(e) => setNewCoach({ ...newCoach, experience: Number.parseInt(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Специализация</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {SPECIALIZATIONS.map((spec) => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => handleSpecializationToggle(spec)}
                      className={`p-2 text-sm rounded border text-left ${
                        newCoach.specialization.includes(spec)
                          ? "bg-blue-100 border-blue-300 text-blue-800"
                          : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowAddCoachModal(false)}
                >
                  Отмена
                </Button>
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Добавить тренера
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Coach Details/Edit Modal */}
      {showCoachModal && editingCoach && (
        <Dialog open={showCoachModal} onOpenChange={setShowCoachModal}>
          <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Детали тренера: {editingCoach.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Телефон</label>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{editingCoach.phone}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{editingCoach.email}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Статус</label>
                    <div>{getStatusBadge(editingCoach.status)}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ставка</label>
                    <div className="text-lg font-semibold">{editingCoach.hourlyRate}₽/час</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Опыт</label>
                    <div className="text-lg font-semibold">{editingCoach.experience} лет</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Рабочих дней</label>
                    <div className="text-lg font-semibold">{getWorkingDaysCount(editingCoach.workingHours)}</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Специализация</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingCoach.specialization.map((spec) => (
                    <Badge key={spec} className="bg-blue-100 text-blue-800">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Рабочие часы</h3>
                <div className="space-y-2">
                  {DAYS_OF_WEEK.map(({ key, label }) => {
                    const daySchedule = editingCoach.workingHours[key as keyof WorkingHours]
                    return (
                      <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="font-medium">{label}</span>
                        <div className="flex items-center space-x-2">
                          {daySchedule.isWorking ? (
                            <>
                              <Clock className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">
                                {daySchedule.start} - {daySchedule.end}
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-400">Выходной</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1 bg-transparent">
                Редактировать
              </Button>
              <Button variant="secondary" onClick={() => setShowCoachModal(false)}>
                Закрыть
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Schedule Management Modal */}
      {showScheduleModal && selectedCoach && (
        <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
          <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Управление расписанием: {selectedCoach.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Рабочие часы</h3>
                <div className="space-y-3">
                  {DAYS_OF_WEEK.map(({ key, label }) => {
                    const daySchedule = selectedCoach.workingHours[key as keyof WorkingHours]
                    return (
                      <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{label}</span>
                        <div className="flex items-center space-x-3">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={daySchedule.isWorking} className="rounded" readOnly />
                            <span className="text-sm">Рабочий день</span>
                          </label>
                          {daySchedule.isWorking && (
                            <div className="flex items-center space-x-2">
                              <input
                                type="time"
                                value={daySchedule.start}
                                className="px-2 py-1 border rounded text-sm"
                                readOnly
                              />
                              <span>-</span>
                              <input
                                type="time"
                                value={daySchedule.end}
                                className="px-2 py-1 border rounded text-sm"
                                readOnly
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {selectedCoach.exceptions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Исключения</h3>
                  <div className="space-y-2">
                    {selectedCoach.exceptions.map((exception) => (
                      <div key={exception.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{new Date(exception.date).toLocaleDateString("ru-RU")}</div>
                            <div className="text-sm text-gray-500">{exception.reason}</div>
                          </div>
                          <Badge
                            className={
                              exception.type === "unavailable" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                            }
                          >
                            {exception.type === "unavailable" ? "Недоступен" : "Особые часы"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1 bg-transparent">
                Редактировать расписание
              </Button>
              <Button variant="secondary" onClick={() => setShowScheduleModal(false)}>
                Закрыть
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
