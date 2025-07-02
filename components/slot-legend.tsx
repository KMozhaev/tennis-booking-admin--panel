"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Info, ChevronDown, ChevronUp } from "lucide-react"
import { SlotStatus } from "../types/coach-types"

export function SlotLegend() {
  const [isExpanded, setIsExpanded] = useState(false)

  const legendItems = [
    {
      status: SlotStatus.FREE,
      color: "bg-gray-50 border border-gray-200",
      label: "Свободный слот",
      description: "Доступен для бронирования",
    },
    {
      status: SlotStatus.COURT_PAID,
      color: "bg-blue-500",
      label: "Корт оплачен",
      description: "Бронирование оплачено",
    },
    {
      status: SlotStatus.COURT_UNPAID,
      color: "bg-orange-500",
      label: "Корт не оплачен",
      description: "Ожидает оплаты",
    },
    {
      status: SlotStatus.TRAINING_PAID,
      color: "bg-purple-500",
      label: "Тренировка оплачена",
      description: "Тренировка с оплатой",
    },
    {
      status: SlotStatus.TRAINING_UNPAID,
      color: "bg-purple-300",
      label: "Тренировка не оплачена",
      description: "Тренировка без оплаты",
    },
    {
      status: SlotStatus.TRAINER_RESERVED,
      color: "bg-green-500",
      label: "Зарезервировано тренером",
      description: "Слот зарезервирован",
    },
    {
      status: SlotStatus.BLOCKED,
      color: "bg-red-500",
      label: "Заблокировано",
      description: "Недоступно для бронирования",
    },
  ]

  return (
    <div className="fixed bottom-4 right-4 z-30">
      <Card className="shadow-lg">
        <CardContent className="p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full justify-between p-2 h-auto"
          >
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span className="text-sm font-medium">Легенда</span>
            </div>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          {isExpanded && (
            <div className="mt-3 space-y-2 min-w-[200px]">
              {legendItems.map((item) => (
                <div key={item.status} className="flex items-center gap-2 text-xs">
                  <div className={`w-3 h-3 rounded ${item.color} flex-shrink-0`}></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.label}</div>
                    <div className="text-gray-500">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
