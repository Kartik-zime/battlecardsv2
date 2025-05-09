import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface RawDealsTableProps {
  data: any[];
}

const columns = [
  "funnel_by_product",
  "deal_title",
  "deal_stage",
  "sales_stage",
  "previous_deal_stage",
  "call_title",
  "heading",
  "category",
  "tag",
  "detail",
  "excerpt",
  "timestamp",
  "Nature",
  "Rep_name",
  "Rep_handling",
  "Competitor_name",
  "objection_category",
];

const columnDisplayNames: Record<string, string> = {
  funnel_by_product: "Product Line",
  deal_title: "Deal Title",
  deal_stage: "Current Deal Stage",
  sales_stage: "Deal Stage During Call",
  previous_deal_stage: "Previous Deal Stage",
  call_title: "Call Title",
  heading: "Product Discussed",
  category: "Summary",
  tag: "Current status of competitor",
  detail: "What prospect said?",
  excerpt: "Excerpt",
  timestamp: "Timestamp",
  Nature: "Type of insight",
  Rep_name: "Rep Name",
  Rep_handling: "Rep Handling",
  Competitor_name: "Competitor Name",
  objection_category: "Objection Category",
};

export default function RawDealsTable({ data }: RawDealsTableProps) {
  const [filters, setFilters] = useState<{ [col: string]: Set<string> }>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [col: string]: HTMLDivElement | null }>({});

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (openDropdown) {
        const ref = dropdownRefs.current[openDropdown];
        if (ref && !ref.contains(e.target as Node)) {
          setOpenDropdown(null);
        }
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openDropdown]);

  // Get unique values for a column
  const getUniqueValues = (col: string) => {
    const values = new Set<string>();
    data.forEach((row) => {
      if (row[col] !== undefined && row[col] !== null && row[col] !== "") {
        values.add(row[col]);
      }
    });
    return Array.from(values).sort();
  };

  // Filtering logic
  const filteredData = data.filter((row) =>
    columns.every((col) => {
      if (!filters[col] || filters[col].size === 0) return true;
      return filters[col].has(row[col]);
    })
  );

  // Handle filter change
  const handleFilterChange = (col: string, value: string) => {
    setFilters((prev) => {
      const newSet = new Set(prev[col] || []);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return { ...prev, [col]: newSet };
    });
  };

  // Clear filter for a column
  const clearFilter = (col: string) => {
    setFilters((prev) => ({ ...prev, [col]: new Set() }));
  };

  return (
    <div className="rounded-lg border bg-white shadow mt-8">
      <div className="max-h-[400px] overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-50 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="relative whitespace-nowrap px-4 py-3.5 text-left text-sm font-semibold text-black tracking-wider cursor-pointer select-none group"
                  onClick={() => setOpenDropdown(openDropdown === col ? null : col)}
                >
                  <span>{columnDisplayNames[col] || col}</span>
                  <span className="ml-1 text-xs text-gray-400">▼</span>
                  {/* Dropdown */}
                  {openDropdown === col && (
                    <div
                      ref={(el) => (dropdownRefs.current[col] = el)}
                      className="absolute left-0 top-full mt-2 z-50 bg-white border rounded shadow-lg p-3 min-w-[200px] max-h-72 overflow-y-auto"
                    >
                      <div className="mb-2 font-semibold text-gray-700">Filter {columnDisplayNames[col] || col}</div>
                      <div className="flex flex-col gap-1">
                        {getUniqueValues(col).map((val) => (
                          <label key={val} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={filters[col]?.has(val) || false}
                              onChange={() => handleFilterChange(col, val)}
                            />
                            <span className="truncate" title={val}>{val}</span>
                          </label>
                        ))}
                      </div>
                      {(filters[col] && filters[col].size > 0) && (
                        <button
                          className="mt-3 px-3 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                          onClick={(e) => { e.stopPropagation(); clearFilter(col); }}
                        >
                          Clear Filter
                        </button>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-gray-400">
                  No data available
                </td>
              </tr>
            ) : (
              filteredData.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col} className="whitespace-nowrap px-4 py-2 text-sm text-gray-900 max-w-xs truncate" title={row[col] || ''}>
                      {col === 'timestamp' && row["call_link"] ? (
                        <a
                          href={row["call_link"]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          {row[col] || ''}
                        </a>
                      ) : (
                        row[col] || ''
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 