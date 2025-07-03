"use client"
import type { DailyFinancials } from "../types/coach-types"

interface FinancialSummaryProps {
  financials: DailyFinancials
  selectedDate: string
}

export function FinancialSummary({ financials, selectedDate }: FinancialSummaryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-6 flex-wrap">
          <h1 className="text-xl font-bold text-gray-900">Календарь бронирований</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="font-medium text-gray-700">{formatDate(selectedDate)}:</span>
            <span className="text-green-600 font-medium">✅ {financials.totalPaid.toLocaleString("ru-RU")} ₽</span>
            <span className="text-orange-600 font-medium">⚠️ {financials.totalUnpaid.toLocaleString("ru-RU")} ₽</span>
            <span className="text-gray-600">Загрузка: {financials.occupancyRate}%</span>
            <span className="text-gray-900 font-semibold">
              Всего: {(financials.totalPaid + financials.totalUnpaid).toLocaleString("ru-RU")} ₽
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
