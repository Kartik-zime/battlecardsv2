import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from "@/components/ui/card";

interface TagData {
  name: string;
  value: number;
}

interface TagPieChartProps {
  data: TagData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

function renderCustomLegend(data: TagData[]) {
  return (
    <ul className="space-y-3">
      {data.map((entry, index) => (
        <li key={entry.name} className="flex items-center gap-2 text-base max-w-xs">
          <span
            className="inline-block w-4 h-4 rounded-sm"
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          />
          <span className="font-medium text-gray-800">{entry.name}</span>
          <span className="ml-2 text-gray-500">({isNaN(entry.value) ? 0 : entry.value}%)</span>
        </li>
      ))}
    </ul>
  );
}

export default function TagPieChart({ data }: TagPieChartProps) {
  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row items-center justify-center gap-12">
        <div className="w-full md:w-[400px] h-[400px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(_, __, props) => {
                  const name = props && props.payload && props.payload.name ? props.payload.name : '';
                  const value = props && props.payload && typeof props.payload.value === 'number' ? props.payload.value : 0;
                  return [`${name}: ${value}%`];
                }}
                contentStyle={{ fontSize: '1rem' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full md:w-auto flex-shrink-0">
          {renderCustomLegend(data)}
        </div>
      </div>
    </Card>
  );
} 