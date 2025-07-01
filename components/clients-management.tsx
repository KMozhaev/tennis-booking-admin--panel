"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Plus, Phone, Mail, Calendar, User } from "lucide-react"

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
  notes?: string
}

interface BookingHistory {
  id: string
  clientId: string
  date: string
  court: string
  duration: number
  amount: number
  status: "completed" | "cancelled"
  type: "court" | "training"
  coach?: string
}

// Updated demo clients with realistic recent data and proper distribution
const DEMO_CLIENTS: Client[] = [
  // VIP Clients (30% - high activity, 50+ sessions)
  {
    id: "1",
    name: "Анна Петрова",
    phone: "+7 916 123-45-67",
    email: "anna.petrova@email.ru",
    totalBookings: 67,
    totalSpent: 156800,
    status: "vip",
    lastBooking: "2025-01-01", // 2 days ago
    registrationDate: "2023-08-15",
    notes: "Предпочитает утренние тренировки с Анной Петровой",
  },
  {
    id: "2",
    name: "Дмитрий Козлов",
    phone: "+7 917 234-56-78",
    email: "dmitry.kozlov@email.ru",
    totalBookings: 89,
    totalSpent: 234500,
    status: "vip",
    lastBooking: "2024-12-30", // 4 days ago
    registrationDate: "2023-05-20",
    notes: "Корпоративный клиент, играет в выходные",
  },
  {
    id: "3",
    name: "Татьяна Морозова",
    phone: "+7 918 345-67-89",
    email: "tatyana.morozova@email.ru",
    totalBookings: 124,
    totalSpent: 298600,
    status: "vip",
    lastBooking: "2025-01-02", // 1 day ago
    registrationDate: "2022-11-08",
    notes: "Профессиональная теннисистка, тренируется ежедневно",
  },
  {
    id: "4",
    name: "Сергей Волков",
    phone: "+7 925 678-90-12",
    email: "sergey.volkov@email.ru",
    totalBookings: 78,
    totalSpent: 187200,
    status: "vip",
    lastBooking: "2024-12-28", // 6 days ago
    registrationDate: "2023-02-14",
  },
  {
    id: "5",
    name: "Мария Федорова",
    phone: "+7 915 789-01-23",
    email: "maria.fedorova@email.ru",
    totalBookings: 52,
    totalSpent: 124800,
    status: "vip",
    lastBooking: "2024-12-31", // 3 days ago
    registrationDate: "2023-11-08",
  },

  // Active Clients (40% - moderate activity, 8-20 sessions)
  {
    id: "6",
    name: "Михаил Иванов",
    phone: "+7 903 987-65-43",
    email: "mikhail.ivanov@email.ru",
    totalBookings: 18,
    totalSpent: 43200,
    status: "active",
    lastBooking: "2024-12-25", // 1 week ago
    registrationDate: "2024-03-10",
  },
  {
    id: "7",
    name: "Елена Смирнова",
    phone: "+7 925 456-78-90",
    email: "elena.smirnova@email.ru",
    totalBookings: 14,
    totalSpent: 33600,
    status: "active",
    lastBooking: "2024-12-20", // 2 weeks ago
    registrationDate: "2024-04-05",
  },
  {
    id: "8",
    name: "Сергей Николаев",
    phone: "+7 926 678-90-12",
    email: "sergey.nikolaev@email.ru",
    totalBookings: 22,
    totalSpent: 52800,
    status: "active",
    lastBooking: "2024-12-18", // 2 weeks ago
    registrationDate: "2024-02-14",
  },
  {
    id: "9",
    name: "Александр Волков",
    phone: "+7 909 234-56-78",
    totalBookings: 11,
    totalSpent: 26400,
    status: "active",
    lastBooking: "2024-12-15", // 2.5 weeks ago
    registrationDate: "2024-06-12",
  },
  {
    id: "10",
    name: "Ирина Павлова",
    phone: "+7 921 567-89-01",
    email: "irina.pavlova@email.ru",
    totalBookings: 16,
    totalSpent: 38400,
    status: "active",
    lastBooking: "2024-12-22", // 1.5 weeks ago
    registrationDate: "2024-05-18",
  },
  {
    id: "11",
    name: "Владимир Орлов",
    phone: "+7 916 890-12-34",
    totalBookings: 9,
    totalSpent: 21600,
    status: "active",
    lastBooking: "2024-12-12", // 3 weeks ago
    registrationDate: "2024-07-22",
  },
  {
    id: "12",
    name: "Наталья Кузнецова",
    phone: "+7 925 123-45-67",
    email: "natalia.kuznetsova@email.ru",
    totalBookings: 13,
    totalSpent: 31200,
    status: "active",
    lastBooking: "2024-12-10", // 3.5 weeks ago
    registrationDate: "2024-04-30",
  },

  // Inactive Clients (30% - low activity, 3-7 sessions)
  {
    id: "13",
    name: "Ольга Васильева",
    phone: "+7 912 345-67-89",
    totalBookings: 5,
    totalSpent: 12000,
    status: "inactive",
    lastBooking: "2024-11-15", // 1.5 months ago
    registrationDate: "2024-05-01",
  },
  {
    id: "14",
    name: "Игорь Соколов",
    phone: "+7 921 456-78-90",
    totalBookings: 4,
    totalSpent: 9600,
    status: "inactive",
    lastBooking: "2024-10-08", // 3 months ago
    registrationDate: "2024-07-15",
  },
  {
    id: "15",
    name: "Екатерина Лебедева",
    phone: "+7 917 567-89-01",
    email: "ekaterina.lebedeva@email.ru",
    totalBookings: 6,
    totalSpent: 14400,
    status: "inactive",
    lastBooking: "2024-09-20", // 3.5 months ago
    registrationDate: "2024-06-10",
  },
  {
    id: "16",
    name: "Андрей Морозов",
    phone: "+7 926 678-90-12",
    totalBookings: 3,
    totalSpent: 7200,
    status: "inactive",
    lastBooking: "2024-08-25", // 4.5 months ago
    registrationDate: "2024-08-01",
  },
  {
    id: "17",
    name: "Светлана Попова",
    phone: "+7 915 789-01-23",
    email: "svetlana.popova@email.ru",
    totalBookings: 7,
    totalSpent: 16800,
    status: "inactive",
    lastBooking: "2024-07-30", // 5 months ago
    registrationDate: "2024-03-15",
  },
]

const DEMO_BOOKING_HISTORY: BookingHistory[] = [
  {
    id: "1",
    clientId: "1",
    date: "2025-01-01",
    court: "Корт 1 (Хард)",
    duration: 90,
    amount: 2250,
    status: "completed",
    type: "training",
    coach: "Анна Петрова",
  },
  {
    id: "2",
    clientId: "1",
    date: "2024-12-28",
    court: "Корт 3 (Грунт)",
    duration: 60,
    amount: 720,
    status: "completed",
    type: "court",
  },
  {
    id: "3",
    clientId: "2",
    date: "2024-12-30",
    court: "Корт 2 (Хард)",
    duration: 60,
    amount: 480,
    status: "completed",
    type: "court",
  },
  {
    id: "4",
    clientId: "3",
    date: "2025-01-02",
    court: "Корт 1 (Хард)",
    duration: 120,
    amount: 3600,
    status: "completed",
    type: "training",
    coach: "Дмитрий Козлов",
  },
]

export function ClientsManagement() {
  const [clients, setClients] = useState<Client[]>(DEMO_CLIENTS)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showClientModal, setShowClientModal] = useState(false)
  const [showAddClientModal, setShowAddClientModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "vip" | "inactive">("all")
  const [newClient, setNewClient] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  })

  // Filter clients based on search and status
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || client.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleClientClick = (client: Client) => {
    setSelectedClient(client)
    setShowClientModal(true)
  }

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault()

    const client: Client = {
      id: Date.now().toString(),
      ...newClient,
      totalBookings: 0,
      totalSpent: 0,
      status: "active",
      lastBooking: "",
      registrationDate: new Date().toISOString().split("T")[0],
    }

    setClients([...clients, client])
    setShowAddClientModal(false)
    setNewClient({
      name: "",
      phone: "",
      email: "",
      notes: "",
    })
  }

  const getStatusBadge = (status: Client["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Активный</Badge>
      case "vip":
        return <Badge className="bg-purple-100 text-purple-800">VIP</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Неактивный</Badge>
    }
  }

  const getClientBookingHistory = (clientId: string) => {
    return DEMO_BOOKING_HISTORY.filter((booking) => booking.clientId === clientId)
  }

  const getDaysAgo = (dateString: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Управление клиентами</h2>
          <p className="text-gray-600">
            Всего клиентов: {clients.length} | Активных: {clients.filter((c) => c.status === "active").length} | VIP:{" "}
            {clients.filter((c) => c.status === "vip").length}
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddClientModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить клиента
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Поиск по имени, телефону или email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Все статусы</option>
          <option value="active">Активные</option>
          <option value="vip">VIP</option>
          <option value="inactive">Неактивные</option>
        </select>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Список клиентов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Клиент</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Контакты</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Статус</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Бронирования</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Потрачено</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Последнее посещение</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    onClick={() => handleClientClick(client)}
                    className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{client.name}</div>
                          <div className="text-sm text-gray-500">ID: {client.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span>{client.phone}</span>
                        </div>
                        {client.email && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span className="truncate max-w-[200px]">{client.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(client.status)}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div className="font-medium">{client.totalBookings}</div>
                        <div className="text-gray-500">бронирований</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div className="font-medium text-green-600">{client.totalSpent.toLocaleString()}₽</div>
                        <div className="text-gray-500">всего</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        {client.lastBooking ? (
                          <>
                            <div className="font-medium">
                              {new Date(client.lastBooking).toLocaleDateString("ru-RU")}
                            </div>
                            <div className="text-gray-500">{getDaysAgo(client.lastBooking)} дней назад</div>
                          </>
                        ) : (
                          <span className="text-gray-400">Нет бронирований</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Клиенты не найдены</h3>
              <p className="text-gray-500">Попробуйте изменить параметры поиска или добавьте нового клиента</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Client Modal */}
      {showAddClientModal && (
        <Dialog open={showAddClientModal} onOpenChange={setShowAddClientModal}>
          <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Добавить нового клиента</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Имя и фамилия *</label>
                <input
                  type="text"
                  required
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Иван Петров"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Телефон *</label>
                <input
                  type="tel"
                  required
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+7 XXX XXX-XX-XX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email (необязательно)</label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ivan.petrov@email.ru"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Заметки</label>
                <textarea
                  rows={3}
                  value={newClient.notes}
                  onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Дополнительная информация о клиенте..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowAddClientModal(false)}
                >
                  Отмена
                </Button>
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Добавить клиента
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Client Details Modal */}
      {showClientModal && selectedClient && (
        <Dialog open={showClientModal} onOpenChange={setShowClientModal}>
          <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Детали клиента: {selectedClient.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Client Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Телефон</label>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{selectedClient.phone}</span>
                    </div>
                  </div>
                  {selectedClient.email && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{selectedClient.email}</span>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Статус</label>
                    <div>{getStatusBadge(selectedClient.status)}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Дата регистрации</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{new Date(selectedClient.registrationDate).toLocaleDateString("ru-RU")}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Всего бронирований</label>
                    <div className="text-lg font-semibold">{selectedClient.totalBookings}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Потрачено всего</label>
                    <div className="text-lg font-semibold text-green-600">
                      {selectedClient.totalSpent.toLocaleString()}₽
                    </div>
                  </div>
                </div>
              </div>

              {selectedClient.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Заметки</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">{selectedClient.notes}</div>
                </div>
              )}

              {/* Booking History */}
              <div>
                <h3 className="text-lg font-semibold mb-3">История бронирований</h3>
                <div className="space-y-3">
                  {getClientBookingHistory(selectedClient.id).map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {new Date(booking.date).toLocaleDateString("ru-RU")} - {booking.court}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.duration} мин • {booking.type === "training" ? "Тренировка" : "Корт"}
                              {booking.coach && ` с ${booking.coach}`}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{booking.amount.toLocaleString()}₽</div>
                          <Badge
                            className={
                              booking.status === "completed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }
                          >
                            {booking.status === "completed" ? "Завершено" : "Отменено"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  {getClientBookingHistory(selectedClient.id).length === 0 && (
                    <div className="text-center py-4 text-gray-500">История бронирований пуста</div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1 bg-transparent">
                Редактировать
              </Button>
              <Button variant="secondary" onClick={() => setShowClientModal(false)}>
                Закрыть
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
