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

        <Button
          variant={activeFilters.includes("all") ? "default" : "outline"}
          size="sm"
          onClick={() => toggleFilter("all")}
          className="h-7 text-xs"
        >
          Все
        </Button>

        <Button
          variant={activeFilters.includes("unpaid") ? "default" : "outline"}
          size="sm"
          onClick={() => toggleFilter("unpaid")}
          className="h-7 text-xs bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
        >
          Неоплаченные
          {unpaidCount > 0 && (
            <Badge className="ml-1 h-4 px-1 text-xs bg-orange-200 text-orange-800">{unpaidCount}</Badge>
          )}
        </Button>

        <Button
          variant={activeFilters.includes("trainings") ? "default" : "outline"}
          size="sm"
          onClick={() => toggleFilter("trainings")}
          className="h-7 text-xs bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
        >
          Тренировки
        </Button>

        <Button
          variant={activeFilters.includes("courts") ? "default" : "outline"}
          size="sm"
          onClick={() => toggleFilter("courts")}
          className="h-7 text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
        >
          Корты
        </Button>

        <Button
          variant={activeFilters.includes("available") ? "default" : "outline"}
          size="sm"
          onClick={() => toggleFilter("available")}
          className="h-7 text-xs bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
        >
          Свободные
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
    </div>
  )
}
