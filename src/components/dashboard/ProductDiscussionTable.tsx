import { ProductDiscussion } from "@/types/dashboard";

interface ProductDiscussionTableProps {
  data: ProductDiscussion[];
}

export default function ProductDiscussionTable({ data }: ProductDiscussionTableProps) {
  // Sort data by Total Deals in descending order
  const sortedData = [...data].sort((a, b) => b.totalDeals - a.totalDeals);

  return (
    <div className="rounded-lg border bg-white shadow">
      <div className="max-h-[400px] overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-50">
            <tr>
              <th className="whitespace-nowrap px-4 py-3.5 text-left text-sm font-semibold text-black tracking-wider">Product Discussed</th>
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
              <tr key={item.product} className={`${index < 3 ? "bg-red-100" : ""}`}>
                <td className="whitespace-nowrap px-4 py-2 text-sm font-semibold text-gray-900">{item.product}</td>
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