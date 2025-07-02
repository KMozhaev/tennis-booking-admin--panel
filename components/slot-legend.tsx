"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronUp, ChevronDown, User, CheckCircle, AlertCircle } from "lucide-react"

export function SlotLegend() {
  const [isExpanded, setIsExpanded] = useState(false)

  const legendItems = [
    {
      color: "bg-gray-50 border border-gray-200 text-gray-700",
      label: "Свободный слот",
      description: "Доступен для бронирования",
      icon: null,
    },
    {
      color: "bg-blue-500 text-white",
      label: "Корт (оплачено)",
      description: "Бронирование корта с подтвержденной оплатой",
      icon: <CheckCircle className="h-3 w-3" />,
    },
    {
      color: "bg-blue-300 text-white",
      label: "Корт (не оплачено)",
      description: "Бронирование корта, ожидает оплаты",
      icon: <AlertCircle className="h-3 w-3" />,
    },
    {
      color: "bg-purple-500 text-white",
      label: "Тренировка (оплачено)",
      description: "Тренировка с тренером, оплата подтверждена",
      icon: <CheckCircle className="h-3 w-3" />,
    },
    {
      color: "bg-purple-300 text-white",
      label: "Тренировка (не оплачено)",
      description: "Тренировка с тренером, ожидает оплаты",
      icon: <AlertCircle className="h-3 w-3" />,
    },
    {
      color: "bg-green-500 text-white",
      label: "Тренер доступен",
      description: "Зарезервированное время тренера, доступно для записи",
      icon: <User className="h-3 w-3" />,
    },
  ]

  return (
    <div className="fixed bottom-4 right-4 z-30">
      <Card className="w-80 shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Легенда</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-6 w-6 p-0">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent className="pt-0">
            <div className="space-y-2">
              {legendItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${item.color} flex items-center justify-center`}>{item.icon}</div>
                  <div className="flex-1">
                    <div className="text-xs font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                <strong>Цветовая логика:</strong> Темные цвета = оплачено, светлые = не оплачено
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
