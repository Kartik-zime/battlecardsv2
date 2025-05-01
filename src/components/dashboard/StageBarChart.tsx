import { StageData } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface StageBarChartProps {
  data: StageData[];
}

export default function StageBarChart({ data }: StageBarChartProps) {
  return (
    <Card className="h-full border shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Win-rate vs. Stage</CardTitle>
      </CardHeader>
      <CardContent className="p-0 pb-4">
        <ResponsiveContainer width="100%" height={350}>
          <RechartsBarChart data={data} margin={{ top: 20, right: 20, bottom: 25, left: 35 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="stage"
              label={{ value: 'Stage', position: 'bottom', offset: 0 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              label={{ value: 'Win Rate (%)', angle: -90, position: 'insideLeft', offset: 15 }}
              tick={{ fontSize: 12 }}
              domain={[0, 100]}
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
              formatter={(value: number) => [`${value}%`, 'Win Rate']}
            />
            <Bar
              dataKey="winRate"
              fill="#E76E50"
              radius={[4, 4, 0, 0]}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 