"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter, X } from "lucide-react"

export type FilterType = "booked_courts" | "unpaid" | "booked_trainings" | "available_trainings" | "all"

interface BookingFiltersProps {
  activeFilters: FilterType[]
  onFilterChange: (filters: FilterType[]) => void
  unpaidCount?: number
}

const getFilterConfig = (filter: FilterType) => {
  switch (filter) {
    case "booked_courts":
      return { color: "bg-blue-500 text-white hover:bg-blue-600", emoji: "🔵", label: "Забронированные корты" }
    case "unpaid":
      return { color: "bg-orange-500 text-white hover:bg-orange-600", emoji: "⚠️", label: "Неоплаченные" }
    case "booked_trainings":
      return { color: "bg-purple-500 text-white hover:bg-purple-600", emoji: "🟣", label: "Забронированные тренировки" }
    case "available_trainings":
      return { color: "bg-green-500 text-white hover:bg-green-600", emoji: "🟢", label: "Незабронированные тренировки" }
    case "all":
      return { color: "bg-gray-800 text-white hover:bg-gray-900", emoji: "", label: "Все" }
  }
}

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
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1 mr-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Фильтры:</span>
      </div>

      <Button
        variant={activeFilters.includes("all") ? "default" : "outline"}
        size="sm"
        onClick={() => toggleFilter("all")}
        className={`h-7 text-xs ${getFilterConfig("all")?.color}`}
      >
        {getFilterConfig("all")?.emoji} {getFilterConfig("all")?.label}
      </Button>

      <Button
        variant={activeFilters.includes("unpaid") ? "default" : "outline"}
        size="sm"
        onClick={() => toggleFilter("unpaid")}
        className={`h-7 text-xs ${getFilterConfig("unpaid")?.color}`}
      >
        {getFilterConfig("unpaid")?.emoji} {getFilterConfig("unpaid")?.label}
        {unpaidCount > 0 && (
          <Badge className="ml-1 h-4 px-1 text-xs bg-orange-200 text-orange-800">{unpaidCount}</Badge>
        )}
      </Button>

      <Button
        variant={activeFilters.includes("booked_trainings") ? "default" : "outline"}
        size="sm"
        onClick={() => toggleFilter("booked_trainings")}
        className={`h-7 text-xs ${getFilterConfig("booked_trainings")?.color}`}
      >
        {getFilterConfig("booked_trainings")?.emoji} {getFilterConfig("booked_trainings")?.label}
      </Button>

      <Button
        variant={activeFilters.includes("booked_courts") ? "default" : "outline"}
        size="sm"
        onClick={() => toggleFilter("booked_courts")}
        className={`h-7 text-xs ${getFilterConfig("booked_courts")?.color}`}
      >
        {getFilterConfig("booked_courts")?.emoji} {getFilterConfig("booked_courts")?.label}
      </Button>

      <Button
        variant={activeFilters.includes("available_trainings") ? "default" : "outline"}
        size="sm"
        onClick={() => toggleFilter("available_trainings")}
        className={`h-7 text-xs ${getFilterConfig("available_trainings")?.color}`}
      >
        {getFilterConfig("available_trainings")?.emoji} {getFilterConfig("available_trainings")?.label}
      </Button>

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
  )
}
