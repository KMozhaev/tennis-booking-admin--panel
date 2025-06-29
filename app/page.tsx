"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminCalendar from "../admin-calendar"
import { AnalyticsView } from "@/components/analytics-view"
import { ClientsView } from "@/components/clients-view"

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Теннис Парк Сокольники</h1>
        <p className="text-sm text-gray-600">Административная панель</p>
      </header>

      <div className="p-6">
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="calendar">Календарь</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
            <TabsTrigger value="clients">Клиенты</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <AdminCalendar />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsView />
          </TabsContent>

          <TabsContent value="clients">
            <ClientsView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
