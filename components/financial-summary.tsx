"use client"

import { TrendingUp, TrendingDown, DollarSign, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { DailyFinancials } from "../types/coach-types"

interface FinancialSummaryProps {
  financials: DailyFinancials
  selectedDate: string
}

export function FinancialSummary({ financials, selectedDate }: FinancialSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  return (
    <Card className="border-b border-gray-200 rounded-none bg-gradient-to-r from-blue-50 to-purple-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">{formatDate(selectedDate)}:</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-lg font-bold text-green-700">{formatCurrency(financials.totalPaid)}</span>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">✅ Оплачено</span>
              </div>

              <div className="text-gray-400">+</div>

              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-orange-500" />
                <span className="text-lg font-bold text-orange-600">{formatCurrency(financials.totalUnpaid)}</span>
                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">⏳ Ожидает</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {financials.unpaidCount > 0 && (
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-700">⚠️ Неоплачено: {financials.unpaidCount}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-gray-700">📈 Загрузка:</div>
              <div className="text-lg font-bold text-blue-700">{financials.occupancyRate}%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
