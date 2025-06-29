"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Minus, Calendar, Users, DollarSign, AlertTriangle } from "lucide-react"

const kpiData = [
  {
    title: "Выручка за месяц",
    value: "3,017,000₽",
    change: "-3.3%",
    trend: "down" as const,
    period: "Июнь 2025 к маю 2025",
    icon: DollarSign,
    miniChart: [2380, 2150, 2620, 2890, 3120, 3017],
  },
  {
    title: "Загрузка кортов",
    value: "71%",
    change: "0%",
    trend: "stable" as const,
    period: "Средняя за месяц",
    icon: Calendar,
    miniChart: [63, 61, 67, 69, 71, 71],
  },
  {
    title: "Средний чек",
    value: "2,060₽",
    change: "+0.2%",
    trend: "up" as const,
    period: "За последние 30 дней",
    icon: Users,
    miniChart: [2055, 2051, 2053, 2052, 2055, 2060],
  },
  {
    title: "Процент неявок",
    value: "5%",
    change: "-2%",
    trend: "down" as const,
    period: "Снижение за месяц",
    icon: AlertTriangle,
    miniChart: [12, 15, 11, 8, 7, 5],
  },
]

const chartData = {
  "6m": [
    { period: "Янв", revenue: 2380000, occupancy: 63, bookings: 1158 },
    { period: "Фев", revenue: 2150000, occupancy: 61, bookings: 1048 },
    { period: "Мар", revenue: 2620000, occupancy: 67, bookings: 1276 },
    { period: "Апр", revenue: 2890000, occupancy: 69, bookings: 1408 },
    { period: "Май", revenue: 3120000, occupancy: 71, bookings: 1518 },
    { period: "Июн", revenue: 3017000, occupancy: 71, bookings: 1465 },
  ],
  "3m": [
    { period: "Апр", revenue: 2890000, occupancy: 69, bookings: 1408 },
    { period: "Май", revenue: 3120000, occupancy: 71, bookings: 1518 },
    { period: "Июн", revenue: 3017000, occupancy: 71, bookings: 1465 },
  ],
  "1m": [
    { period: "1 нед", revenue: 680000, occupancy: 68, bookings: 330 },
    { period: "2 нед", revenue: 720000, occupancy: 70, bookings: 350 },
    { period: "3 нед", revenue: 750000, occupancy: 72, bookings: 365 },
    { period: "4 нед", revenue: 780000, occupancy: 74, bookings: 380 },
  ],
}

const bookingSources = {
  "6m": {
    totalBookings: 1465,
    sources: [
      { name: "Сайт", value: 30, count: 440, color: "#4285f4" },
      { name: "Яндекс.Карты", value: 24, count: 352, color: "#34a853" },
      { name: "2ГИС", value: 15, count: 220, color: "#ea4335" },
      { name: "Instagram", value: 12, count: 176, color: "#9c27b0" },
      { name: "VK", value: 10, count: 147, color: "#ff9800" },
      { name: "Telegram", value: 6, count: 88, color: "#00bcd4" },
      { name: "Остальные", value: 3, count: 42, color: "#9e9e9e" },
    ],
  },
  "3m": {
    totalBookings: 1200,
    sources: [
      { name: "Сайт", value: 32, count: 384, color: "#4285f4" },
      { name: "Яндекс.Карты", value: 26, count: 312, color: "#34a853" },
      { name: "2ГИС", value: 18, count: 216, color: "#ea4335" },
      { name: "Instagram", value: 14, count: 168, color: "#9c27b0" },
      { name: "VK", value: 8, count: 96, color: "#ff9800" },
      { name: "Telegram", value: 2, count: 24, color: "#00bcd4" },
    ],
  },
  "1m": {
    totalBookings: 380,
    sources: [
      { name: "Сайт", value: 35, count: 133, color: "#4285f4" },
      { name: "Яндекс.Карты", value: 28, count: 106, color: "#34a853" },
      { name: "2ГИС", value: 20, count: 76, color: "#ea4335" },
      { name: "Instagram", value: 12, count: 46, color: "#9c27b0" },
      { name: "VK", value: 5, count: 19, color: "#ff9800" },
    ],
  },
}

const todayData = {
  date: "29 июня 2025",
  earned: "111,200₽",
  bookings: 53,
  occupancy: 78,
}

export function AnalyticsView() {
  const [selectedMetric, setSelectedMetric] = useState<"revenue" | "occupancy" | "bookings">("revenue")
  const [selectedPeriod, setSelectedPeriod] = useState<"6m" | "3m" | "1m">("6m")
  const [sourcesPeriod, setSourcesPeriod] = useState<"6m" | "3m" | "1m">("6m")

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case "stable":
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      case "stable":
        return "text-gray-600"
    }
  }

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case "revenue":
        return "Выручка (₽)"
      case "occupancy":
        return "Загрузка (%)"
      case "bookings":
        return "Бронирования"
    }
  }

  const formatValue = (value: number) => {
    switch (selectedMetric) {
      case "revenue":
        return `${(value / 1000000).toFixed(1)}М₽`
      case "occupancy":
        return `${value}%`
      case "bookings":
        return value.toString()
    }
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{kpi.title}</CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  {getTrendIcon(kpi.trend)}
                  <span className={getTrendColor(kpi.trend)}>{kpi.change}</span>
                  <span>vs прошлый период</span>
                </div>
                <div className="mt-4 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={kpi.miniChart.map((value, i) => ({ value }))}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={kpi.trend === "up" ? "#10b981" : kpi.trend === "down" ? "#ef4444" : "#6b7280"}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-gray-500 mt-2">{kpi.period}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Chart Section and Today Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Динамика показателей</CardTitle>
              <div className="flex space-x-2">
                <div className="flex rounded-md border">
                  <Button
                    variant={selectedMetric === "revenue" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedMetric("revenue")}
                    className="rounded-r-none"
                  >
                    Выручка
                  </Button>
                  <Button
                    variant={selectedMetric === "occupancy" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedMetric("occupancy")}
                    className="rounded-none border-x"
                  >
                    Загрузка
                  </Button>
                  <Button
                    variant={selectedMetric === "bookings" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedMetric("bookings")}
                    className="rounded-l-none"
                  >
                    Брони
                  </Button>
                </div>
                <div className="flex rounded-md border">
                  <Button
                    variant={selectedPeriod === "1m" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedPeriod("1m")}
                    className="rounded-r-none"
                  >
                    1М
                  </Button>
                  <Button
                    variant={selectedPeriod === "3m" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedPeriod("3m")}
                    className="rounded-none border-x"
                  >
                    3М
                  </Button>
                  <Button
                    variant={selectedPeriod === "6m" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedPeriod("6m")}
                    className="rounded-l-none"
                  >
                    6М
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData[selectedPeriod]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="period" stroke="#666" fontSize={12} />
                  <YAxis tickFormatter={formatValue} stroke="#666" fontSize={12} />
                  <Tooltip
                    formatter={(value: number) => [formatValue(value), getMetricLabel()]}
                    labelStyle={{ color: "#374151" }}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Today Block */}
        <Card>
          <CardHeader>
            <CardTitle>Сегодня</CardTitle>
            <p className="text-sm text-gray-600">{todayData.date}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Заработано</p>
              <p className="text-2xl font-bold text-green-600">{todayData.earned}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Бронирований</p>
              <p className="text-2xl font-bold">{todayData.bookings}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Загрузка</p>
              <p className="text-2xl font-bold">{todayData.occupancy}%</p>
            </div>
            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500">Обновлено в реальном времени</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Sources */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Источники бронирований</CardTitle>
              <p className="text-sm text-gray-600">Всего бронирований: {bookingSources[sourcesPeriod].totalBookings}</p>
            </div>
            <div className="flex rounded-md border">
              <Button
                variant={sourcesPeriod === "1m" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSourcesPeriod("1m")}
                className="rounded-r-none"
              >
                1М
              </Button>
              <Button
                variant={sourcesPeriod === "3m" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSourcesPeriod("3m")}
                className="rounded-none border-x"
              >
                3М
              </Button>
              <Button
                variant={sourcesPeriod === "6m" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSourcesPeriod("6m")}
                className="rounded-l-none"
              >
                6М
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingSources[sourcesPeriod].sources}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={false}
                  >
                    {bookingSources[sourcesPeriod].sources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Доля"]}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Sources List */}
            <div className="space-y-3">
              {bookingSources[sourcesPeriod].sources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                    <span className="font-medium">{source.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{source.value}%</div>
                    <div className="text-sm text-gray-600">{source.count} броней</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
