"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter, X } from "lucide-react"

export type FilterType = "all" | "unpaid" | "trainings" | "courts" | "available"

interface BookingFiltersProps {
  activeFilters: FilterType[]
  onFilterChange: (filters: FilterType[]) => void
  unpaidCount?: number
}

const filterConfig = [
  {
    key: "all" as FilterType,
    label: "Все",
    color: "bg-gray-800 text-white",
    activeColor: "bg-gray-900",
    hoverColor: "hover:bg-gray-700",
  },
  {
    key: "unpaid" as FilterType,
    label: "Неоплаченные",
    color: "bg-blue-300 text-white", // Matches light blue/purple unpaid slots
    activeColor: "bg-blue-400",
    hoverColor: "hover:bg-blue-400",
  },
  {
    key: "trainings" as FilterType,
    label: "Тренировки",
    color: "bg-purple-500 text-white", // Matches purple training slots
    activeColor: "bg-purple-600",
    hoverColor: "hover:bg-purple-600",
  },
  {
    key: "courts" as FilterType,
    label: "Корты",
    color: "bg-blue-500 text-white", // Matches dark blue paid courts
    activeColor: "bg-blue-600",
    hoverColor: "hover:bg-blue-600",
  },
  {
    key: "available" as FilterType,
    label: "Свободные",
    color: "bg-green-500 text-white", // Matches green available slots
    activeColor: "bg-green-600",
    hoverColor: "hover:bg-green-600",
  },
]

export function BookingFilters({ activeFilters, onFilterChange, unpaidCount = 0 }: BookingFiltersProps) {
  const toggleFilter = (filter: FilterType) => {
    if (filter === "all") {
      onFilterChange(["all"])
      return
    }

    const newFilters = activeFilters.includes("all") ? [] : [...activeFilters]

    if (newFilters.includes(filter)) {
      const filtered = newFilters.filter((f) => f !== filter)
      onFilterChange(filtered.length === 0 ? ["all"] : filtered)
    } else {
      onFilterChange([...newFilters.filter((f) => f !== "all"), filter])
    }
  }

  const clearFilters = () => {
    onFilterChange(["all"])
  }

  const hasActiveFilters = !activeFilters.includes("all") && activeFilters.length > 0

  return (
    <div className="bg-gray-50 border-b border-gray-200 p-3">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 mr-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Фильтры:</span>
        </div>

        {filterConfig.map((config) => {
          const isActive = activeFilters.includes(config.key)
          const buttonClass = isActive ? `${config.activeColor} text-white` : `${config.color} ${config.hoverColor}`

          return (
            <Button
              key={config.key}
              size="sm"
              onClick={() => toggleFilter(config.key)}
              className={`h-7 text-xs border-0 ${buttonClass}`}
            >
              {config.label}
              {config.key === "unpaid" && unpaidCount > 0 && (
                <Badge className="ml-1 h-4 px-1 text-xs bg-white text-blue-600">{unpaidCount}</Badge>
              )}
            </Button>
          )
        })}

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 text-xs text-gray-500 hover:text-gray-700"
          >
            <X className="h-3 w-3 mr-1" />
            Сбросить
          </Button>
        )}
      </div>
    </div>
  )
}
