"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedAdminCalendar } from "@/components/enhanced-admin-calendar"
import { AnalyticsView } from "@/components/analytics-view"
import { CoachManagement } from "@/components/coach-management"
import { ClientsManagement } from "@/components/clients-management"

export default function TennisAdminDashboard() {
  const [activeTab, setActiveTab] = useState("calendar")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Теннис Парк Сокольники</h1>
            <p className="text-gray-600">Административная панель</p>
          </div>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString("ru-RU", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="calendar" className="text-sm font-medium">
              Расписание
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm font-medium">
              Аналитика
            </TabsTrigger>
            <TabsTrigger value="coaches" className="text-sm font-medium">
              Тренеры
            </TabsTrigger>
            <TabsTrigger value="clients" className="text-sm font-medium">
              Клиенты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            <EnhancedAdminCalendar />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsView />
          </TabsContent>

          <TabsContent value="coaches" className="space-y-4">
            <CoachManagement />
          </TabsContent>

          <TabsContent value="clients" className="space-y-4">
            <ClientsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
