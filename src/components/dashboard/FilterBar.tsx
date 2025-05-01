import { useState } from "react";
import { CalendarRange } from "lucide-react";
import { format } from "date-fns";
import { FilterOptions } from "@/types/dashboard";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  filters: FilterOptions;
  filterOptions: {
    productLines: string[];
    competitors: string[];
    dealStages: string[];
    stageBeforeLost: string[];
  };
  onFilterChange: (filters: FilterOptions) => void;
}

export default function FilterBar({ filters, filterOptions, onFilterChange }: FilterBarProps) {
  const [date, setDate] = useState<DateRange>({
    from: filters.dateRange.from,
    to: filters.dateRange.to,
  });

  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setDate(range);
      onFilterChange({
        ...filters,
        dateRange: { from: range.from, to: range.to },
      });
    }
  };

  const handleSelectChange = (value: string, filterType: keyof Omit<FilterOptions, 'dateRange'>) => {
    if (value === "All") {
      onFilterChange({
        ...filters,
        [filterType]: ["All"],
      });
    } else {
      const currentValues = filters[filterType] as string[];
      let newValues: string[];
      
      if (currentValues.includes("All")) {
        newValues = [value];
      } else {
        if (currentValues.includes(value)) {
          newValues = currentValues.filter(v => v !== value);
          if (newValues.length === 0) newValues = ["All"];
        } else {
          newValues = [...currentValues, value];
        }
      }
      
      onFilterChange({
        ...filters,
        [filterType]: newValues,
      });
    }
  };

  return (
    <Card className="mb-6 border shadow-sm">
      <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Date Range Filter */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700">Date Range</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarRange className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd")} -{" "}
                      {format(date.to, "LLL dd, yyyy")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, yyyy")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={date}
                onSelect={handleDateChange}
                numberOfMonths={2}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Product Line Filter */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700">Product Line</span>
          <Select
            value={filters.productLine[0]}
            onValueChange={(value) => handleSelectChange(value, "productLine")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select product line" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.productLines.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Competitor Filter */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700">Competitor</span>
          <Select
            value={filters.competitor[0]}
            onValueChange={(value) => handleSelectChange(value, "competitor")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select competitor" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.competitors.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Deal Stage Filter */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700">Deal Stage</span>
          <Select
            value={filters.dealStage[0]}
            onValueChange={(value) => handleSelectChange(value, "dealStage")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select deal stage" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.dealStages.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stage Before Lost Filter */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700">Stage Before Lost</span>
          <Select
            value={filters.stageBeforeLost[0]}
            onValueChange={(value) => handleSelectChange(value, "stageBeforeLost")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.stageBeforeLost.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
