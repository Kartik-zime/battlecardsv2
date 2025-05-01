import { StageData } from "@/services/api";

interface StageTableProps {
  data: StageData[];
}

export function StageTable({ data }: StageTableProps) {
  // Sort data by Moved to Closed Deals in descending order
  const sortedData = [...data].sort((a, b) => b.movedToClosedDeals - a.movedToClosedDeals);

  return (
    <div className="rounded-lg border bg-white shadow">
      <div className="max-h-[400px] overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-50">
            <tr>
              <th className="whitespace-nowrap px-4 py-3.5 text-left text-sm font-semibold text-black tracking-wider">Stage</th>
              <th className="whitespace-nowrap px-4 py-3.5 text-right text-sm font-semibold text-black tracking-wider">Moved to Closed Deals</th>
              <th className="whitespace-nowrap px-4 py-3.5 text-right text-sm font-semibold text-black tracking-wider">Losses</th>
              <th className="whitespace-nowrap px-4 py-3.5 text-right text-sm font-semibold text-black tracking-wider">Wins</th>
              <th className="whitespace-nowrap px-4 py-3.5 text-right text-sm font-semibold text-black tracking-wider">Win-rate</th>
              <th className="whitespace-nowrap px-4 py-3.5 text-left text-sm font-semibold text-black tracking-wider">Top Objections</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.map((item) => (
              <tr key={item.stage}>
                <td className="whitespace-nowrap px-4 py-2 text-sm font-semibold text-gray-900">{item.stage}</td>
                <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900 text-right">{item.movedToClosedDeals}</td>
                <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900 text-right">{item.losses}</td>
                <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900 text-right">{item.wins}</td>
                <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900 text-right">{item.winRate}%</td>
                <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">{item.topObjections.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 