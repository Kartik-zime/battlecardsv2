import { ObjectionCategoryData } from "@/types/dashboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { ObjectionTooltipContent } from "./ObjectionTooltip";

interface ObjectionCategoryTableProps {
  data: ObjectionCategoryData[];
}

export default function ObjectionCategoryTable({ data }: ObjectionCategoryTableProps) {
  // Sort data by Total Deals in descending order
  const sortedData = [...data].sort((a, b) => b.totalDeals - a.totalDeals);

  return (
    <div className="rounded-lg border bg-white shadow">
      <div className="max-h-[400px] overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-50 z-10">
            <tr>
              <th className="whitespace-nowrap px-4 py-3.5 text-left text-sm font-semibold text-black tracking-wider">
                <div className="flex items-center gap-1">
                  Objection Category
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <button className="p-0.5 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500">
                          <QuestionMarkCircledIcon className="h-4 w-4 text-gray-500" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="right" 
                        align="start"
                        sideOffset={10}
                        className="z-50 bg-white p-4 rounded-lg shadow-lg border max-w-[800px] w-[800px]"
                        avoidCollisions={true}
                      >
                        <ObjectionTooltipContent type="category" />
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </th>
              <th className="whitespace-nowrap px-4 py-3.5 text-right text-sm font-semibold text-black tracking-wider">Total Deals</th>
              <th className="whitespace-nowrap px-4 py-3.5 text-right text-sm font-semibold text-black tracking-wider">Open Deals</th>
              <th className="whitespace-nowrap px-4 py-3.5 text-right text-sm font-semibold text-black tracking-wider">Closed Deals</th>
              <th className="whitespace-nowrap px-4 py-3.5 text-right text-sm font-semibold text-black tracking-wider">Wins</th>
              <th className="whitespace-nowrap px-4 py-3.5 text-right text-sm font-semibold text-black tracking-wider">Losses</th>
              <th className="whitespace-nowrap px-4 py-3.5 text-right text-sm font-semibold text-black tracking-wider">Win Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.map((item, index) => (
              <tr key={item.category} className={`hover:bg-gray-50 ${index < 3 ? "bg-red-100" : ""}`}>
                <td className="whitespace-nowrap px-4 py-2 text-sm font-semibold text-gray-900">{item.category}</td>
                <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900 text-right">{item.totalDeals}</td>
                <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900 text-right">{item.openDeals}</td>
                <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900 text-right">{item.closedDeals}</td>
                <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900 text-right">{item.wins}</td>
                <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900 text-right">{item.losses}</td>
                <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900 text-right">{item.winRate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 