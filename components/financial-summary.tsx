"use client"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react"
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
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()

    if (isToday) {
      return "Сегодня"
    }

    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
    })
  }

  return (
    <div className="bg-white border-b border-gray-200 py-2 px-4">
      {/* Optimized Header Layout - Single Row */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">{formatDate(selectedDate)}:</span>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-green-700">{formatCurrency(financials.totalPaid)}</span>
            </div>
            <span className="text-gray-400">+</span>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="font-semibold text-orange-700">{formatCurrency(financials.totalUnpaid)}</span>
            </div>
          </div>

          <div className="h-6 w-px bg-gray-300" />

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-gray-600">Неоплачено:</span>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                {financials.unpaidCount}
              </Badge>
            </div>

            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">Загрузка:</span>
              <Badge
                variant="outline"
                className={`${
                  financials.occupancyRate >= 80
                    ? "bg-green-50 text-green-700 border-green-200"
                    : financials.occupancyRate >= 60
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {financials.occupancyRate}%
              </Badge>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Всего:{" "}
          <span className="font-semibold text-gray-900">
            {formatCurrency(financials.totalPaid + financials.totalUnpaid)}
          </span>
        </div>
      </div>
    </div>
  )
}
