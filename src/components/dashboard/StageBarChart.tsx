import { StageData } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

interface StageBarChartProps {
  data: StageData[];
}

// Custom YAxis tick to show tooltip for long labels and wrap text
function YAxisTick({ x, y, payload }: any) {
  const value: string = payload.value;
  // Split label into lines if longer than 16 chars or if it contains spaces
  const words = value.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  words.forEach(word => {
    if ((currentLine + ' ' + word).trim().length > 16) {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = currentLine ? currentLine + ' ' + word : word;
    }
  });
  if (currentLine) lines.push(currentLine);

  return (
    <g transform={`translate(${x},${y})`}>
      <title>{value}</title>
      <text x={0} y={0} dy={4 - (lines.length - 1) * 7} textAnchor="end" fill="#555" fontSize={11} style={{ pointerEvents: 'auto' }}>
        {lines.map((line, i) => (
          <tspan key={i} x={0} dy={i === 0 ? 0 : 13}>{line}</tspan>
        ))}
      </text>
    </g>
  );
}

export default function StageBarChart({ data }: StageBarChartProps) {
  // Add loseRate to each data row
  const chartData = data.map(d => ({
    ...d,
    loseRate: 100 - (d.winRate || 0)
  }));

  return (
    <Card className="h-full border shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Win-rate vs. Stage</CardTitle>
      </CardHeader>
      <CardContent className="p-0 pb-4">
        <ResponsiveContainer width="100%" height={350}>
          <RechartsBarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 20, bottom: 25, left: 35 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              label={{ value: '%', position: 'bottom', offset: 0 }}
            />
            <YAxis
              type="category"
              dataKey="stage"
              tick={YAxisTick}
              width={220}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #f0f0f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                padding: '8px 12px',
                fontSize: '12px'
              }}
              formatter={(value: number, name: string) => [`${value}%`, name === 'winRate' ? 'Win Rate' : 'Lose Rate']}
            />
            <Legend verticalAlign="top" height={36} />
            <Bar
              dataKey="winRate"
              stackId="a"
              fill="#34a853"
              name="Win Rate"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
            <Bar
              dataKey="loseRate"
              stackId="a"
              fill="#e76e50"
              name="Lose Rate"
              radius={[0, 0, 4, 4]}
              isAnimationActive={false}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 