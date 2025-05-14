import { Card } from "@/components/ui/card";

interface ObjectionHandlingTableProps {
  data: any[];
}

export default function ObjectionHandlingTable({ data }: ObjectionHandlingTableProps) {
  // Extract unique pairs of category and best_handling
  const uniquePairs = Array.from(
    data.reduce((map, row) => {
      if (row.category && row.best_handling) {
        map.set(row.category + "||" + row.best_handling, {
          category: row.category,
          best_handling: row.best_handling,
        });
      }
      return map;
    }, new Map<string, { category: string; best_handling: string }>() ).values()
  );

  return (
    <Card className="rounded-lg border bg-white shadow w-full">
      <div className="max-h-[400px] overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-50 z-10">
            <tr>
              <th className="whitespace-nowrap px-4 py-3.5 text-left text-sm font-semibold text-black tracking-wider">Detailed Objection</th>
              <th className="whitespace-nowrap px-4 py-3.5 text-left text-sm font-semibold text-black tracking-wider">Best Suggested Handling</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {uniquePairs.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center py-4 text-gray-400">
                  No data available
                </td>
              </tr>
            ) : (
              uniquePairs.map((item, idx) => {
                const pair = item as { category: string; best_handling: string };
                return (
                  <tr key={pair.category + pair.best_handling + idx}>
                    <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900 max-w-xs truncate" title={pair.category}>{pair.category}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900 max-w-xs truncate" title={pair.best_handling}>{pair.best_handling}</td>
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