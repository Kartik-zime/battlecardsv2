import { useState } from "react";
import { CalendarRange, X } from "lucide-react";
import { format } from "date-fns";
import { FilterOptions } from "@/types/dashboard";
import { DateRange } from "react-day-picker";
import React from "react";

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
    salesStages: string[];
    products: string[];
    objectionCategories: string[];
  };
  onFilterChange: (filters: FilterOptions) => void;
}

// Add this type for filter keys
type FilterKey = keyof Omit<FilterOptions, 'dateRange'>;

export default function FilterBar({ filters, filterOptions, onFilterChange }: FilterBarProps) {
  const [date, setDate] = useState<DateRange>({
    from: filters.dateRange.from,
    to: filters.dateRange.to,
  });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      setDate(range);
      onFilterChange({
        ...filters,
        dateRange: { from: range.from, to: range.to },
      });
    }
  };

  // Multi-select logic
  const handleMultiSelectChange = (filterType: keyof Omit<FilterOptions, 'dateRange'>, value: string) => {
    const currentValues = filters[filterType] as string[];
    let newValues: string[];
    if (value === "All") {
      newValues = ["All"];
    } else {
      if (currentValues.includes("All")) {
        newValues = [value];
      } else if (currentValues.includes(value)) {
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
  };

  const handleChipRemove = (filterType: keyof Omit<FilterOptions, 'dateRange'>, value: string) => {
    handleMultiSelectChange(filterType, value);
  };

  const filterConfigs: { key: FilterKey; label: string; options: string[] }[] = [
    {
      key: "productLine",
      label: "Product Line (from CRM)",
      options: filterOptions.productLines,
    },
    {
      key: "salesStage",
      label: "Deal Stage",
      options: filterOptions.salesStages,
    },
    {
      key: "competitor",
      label: "Competitor",
      options: filterOptions.competitors,
    },
    {
      key: "product",
      label: "Product (extracted from AI)",
      options: filterOptions.products,
    },
    {
      key: "objectionCategory",
      label: "Objection Category",
      options: filterOptions.objectionCategories,
    },
  ];

  return (
    <Card className="mb-6 border shadow-sm">
      <div className="p-4 grid grid-cols-1 md:grid-cols-6 gap-2">
        {/* Date Range Filter */}
        <div className="space-y-2 max-w-[180px]">
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
        {/* Multi-select Filters */}
        {filterConfigs.map(({ key, label, options }) => (
          <div className="space-y-2 max-w-[180px]" key={key}>
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <div className="relative">
              <Button
                variant="outline"
                className="w-full flex flex-wrap gap-1 min-h-[40px] justify-start items-center text-left font-normal pr-8"
                onClick={() => setOpenDropdown(openDropdown === key ? null : key)}
                type="button"
              >
                {filters[key][0] === "All" ? (
                  <span className="text-gray-500">All</span>
                ) : filters[key].length === 1 ? (
                  <span>{filters[key][0]}</span>
                ) : (
                  <span>{filters[key].length} selected</span>
                )}
              </Button>
              {openDropdown === key && (
                <div
                  ref={el => (dropdownRefs.current[key] = el)}
                  className="absolute left-0 top-full mt-2 z-50 bg-white border rounded shadow-lg p-3 min-w-[200px] max-h-72 overflow-y-auto"
                >
                  <div className="mb-2 font-semibold text-gray-700">Select {label}</div>
                  <div className="flex flex-col gap-1">
                    {options.map(option => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters[key].includes(option)}
                          onChange={() => handleMultiSelectChange(key, option)}
                        />
                        <span className="truncate" title={option}>{option}</span>
                      </label>
                    ))}
                  </div>
                  {filters[key][0] !== "All" && (
                    <button
                      className="mt-3 px-3 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                      onClick={e => {
                        e.stopPropagation();
                        onFilterChange({
                          ...filters,
                          [key]: ["All"],
                        });
                      }}
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
