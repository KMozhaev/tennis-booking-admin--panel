"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Phone, Calendar, DollarSign } from "lucide-react"

const clientsData = [
  {
    id: 1,
    name: "Анна Петрова",
    phone: "+7 (916) 123-45-67",
    games: 18,
    revenue: "45,600₽",
    lastGame: "25.06.2025",
    status: "VIP",
  },
  {
    id: 2,
    name: "Михаил Волков",
    phone: "+7 (903) 234-56-78",
    games: 15,
    revenue: "38,200₽",
    lastGame: "28.06.2025",
    status: "Активный",
  },
  {
    id: 3,
    name: "Елена Смирнова",
    phone: "+7 (925) 345-67-89",
    games: 14,
    revenue: "32,800₽",
    lastGame: "29.06.2025",
    status: "Активный",
  },
  {
    id: 4,
    name: "Андрей Козлов",
    phone: "+7 (917) 456-78-90",
    games: 12,
    revenue: "28,400₽",
    lastGame: "27.06.2025",
    status: "Активный",
  },
  {
    id: 5,
    name: "Мария Иванова",
    phone: "+7 (999) 567-89-01",
    games: 11,
    revenue: "26,200₽",
    lastGame: "26.06.2025",
    status: "Активный",
  },
  {
    id: 6,
    name: "Дмитрий Соколов",
    phone: "+7 (926) 678-90-12",
    games: 10,
    revenue: "24,000₽",
    lastGame: "24.06.2025",
    status: "Активный",
  },
  {
    id: 7,
    name: "Ольга Морозова",
    phone: "+7 (915) 789-01-23",
    games: 9,
    revenue: "21,600₽",
    lastGame: "23.06.2025",
    status: "Активный",
  },
  {
    id: 8,
    name: "Павел Новиков",
    phone: "+7 (985) 890-12-34",
    games: 8,
    revenue: "19,200₽",
    lastGame: "22.06.2025",
    status: "Активный",
  },
  {
    id: 9,
    name: "Светлана Кузнецова",
    phone: "+7 (977) 901-23-45",
    games: 7,
    revenue: "16,800₽",
    lastGame: "20.06.2025",
    status: "Активный",
  },
  {
    id: 10,
    name: "Игорь Лебедев",
    phone: "+7 (964) 012-34-56",
    games: 6,
    revenue: "14,400₽",
    lastGame: "18.06.2025",
    status: "Активный",
  },
  {
    id: 11,
    name: "Татьяна Федорова",
    phone: "+7 (968) 123-45-67",
    games: 5,
    revenue: "12,000₽",
    lastGame: "15.06.2025",
    status: "Неактивный",
  },
  {
    id: 12,
    name: "Алексей Орлов",
    phone: "+7 (912) 234-56-78",
    games: 4,
    revenue: "9,600₽",
    lastGame: "10.06.2025",
    status: "Неактивный",
  },
]

const clientStats = {
  total: 284,
  active: 156,
  vip: 23,
  totalRevenue: "8,240,000₽",
}

export function ClientsView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "vip" | "inactive">("all")

  const filteredClients = clientsData.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) || client.phone.includes(searchTerm)

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && client.status === "Активный") ||
      (statusFilter === "vip" && client.status === "VIP") ||
      (statusFilter === "inactive" && client.status === "Неактивный")

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VIP":
        return "bg-yellow-100 text-yellow-800"
      case "Активный":
        return "bg-green-100 text-green-800"
      case "Неактивный":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Всего клиентов</p>
                <p className="text-2xl font-bold">{clientStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Phone className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Активных</p>
                <p className="text-2xl font-bold">{clientStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">VIP клиентов</p>
                <p className="text-2xl font-bold">{clientStats.vip}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Общая выручка</p>
                <p className="text-2xl font-bold text-green-600">{clientStats.totalRevenue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <CardTitle>База клиентов</CardTitle>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Поиск по имени или телефону..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  Все
                </Button>
                <Button
                  variant={statusFilter === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("active")}
                >
                  Активные
                </Button>
                <Button
                  variant={statusFilter === "vip" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("vip")}
                >
                  VIP
                </Button>
                <Button
                  variant={statusFilter === "inactive" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("inactive")}
                >
                  Неактивные
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Клиент
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Телефон
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Игры
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Выручка
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Последняя игра
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{client.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-600">{client.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900 font-medium">{client.games}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-green-600 font-semibold">{client.revenue}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-600">{client.lastGame}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}
                      >
                        {client.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Клиенты не найдены</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
