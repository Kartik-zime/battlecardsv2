import { Card } from "@/components/ui/card";

interface ObjectionHandlingTableProps {
  data: any[];
}

export default function ObjectionHandlingTable({ data }: ObjectionHandlingTableProps) {
  // Extract unique triplets of category, deal_title, and best_handling
  const uniqueRows = Array.from(
    data.reduce((map, row) => {
      if (row.category && row.deal_title && row.best_handling) {
        map.set(row.category + "||" + row.deal_title + "||" + row.best_handling, {
          category: row.category,
          deal_title: row.deal_title,
          best_handling: row.best_handling,
        });
      }
      return map;
    }, new Map<string, { category: string; deal_title: string; best_handling: string }>() ).values()
  );

  return (
    <Card className="rounded-lg border bg-white shadow w-full">
      <div className="max-h-[400px] overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-50 z-10">
            <tr>
              <th className="whitespace-nowrap px-4 py-3.5 text-left text-sm font-semibold text-black tracking-wider">Detailed Objection</th>
              <th className="whitespace-nowrap px-4 py-3.5 text-left text-sm font-semibold text-black tracking-wider">Deal Title</th>
              <th className="whitespace-nowrap px-4 py-3.5 text-left text-sm font-semibold text-black tracking-wider">Best Handling Direction</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {uniqueRows.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-400">
                  No data available
                </td>
              </tr>
            ) : (
              uniqueRows.map((item, idx) => {
                const row = item as { category: string; deal_title: string; best_handling: string };
                return (
                  <tr key={row.category + row.deal_title + row.best_handling + idx}>
                    <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900 max-w-xs truncate" title={row.category}>{row.category}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900 max-w-xs truncate" title={row.deal_title}>{row.deal_title}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900 max-w-xs truncate" title={row.best_handling}>{row.best_handling}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
} 