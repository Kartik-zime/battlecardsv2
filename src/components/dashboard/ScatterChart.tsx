import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScatterData } from "@/services/api";
import {
  ResponsiveContainer,
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface ScatterChartProps {
  data: ScatterData[];
}

export default function ScatterChart({ data }: ScatterChartProps) {
  // Calculate the maximum Y value from the data and add some padding
  const maxY = Math.max(...data.map(item => item.y));
  const yAxisMax = Math.ceil(maxY * 1.1); // Add 10% padding to the top

  return (
    <Card className="h-full border shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Win Rate vs Total Deals</CardTitle>
      </CardHeader>
      <CardContent className="p-0 pb-4">
        <ResponsiveContainer width="100%" height={350}>
          <RechartsScatterChart margin={{ top: 20, right: 20, bottom: 25, left: 35 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              dataKey="x"
              name="Win Rate"
              unit="%"
              domain={[0, 100]}
              label={{ value: 'Win Rate (%)', position: 'bottom', offset: 0 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Total Deals"
              domain={[0, yAxisMax]}
              label={{ value: 'Total Deals', angle: -90, position: 'insideLeft', offset: 15 }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid #f0f0f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                padding: '8px 12px',
                fontSize: '12px'
              }}
              formatter={(value: number, name: string) => [
                name === 'x' ? `${value}%` : value,
                name === 'x' ? 'Win Rate' : 'Total Deals'
              ]}
              labelFormatter={(label) => ''}
            />
            <Scatter
              name="Competitors"
              data={data}
              fill="#E76E50"
              shape={(props) => {
                const { cx, cy, fill } = props;
                const competitor = data.find(item => item.y === props.payload.y && item.x === props.payload.x);
                return (
                  <g>
                    <circle cx={cx} cy={cy} r={8} fill={fill} fillOpacity={0.7} />
                    {competitor && <text x={cx} y={cy - 10} textAnchor="middle" fontSize={10}>{competitor.competitor}</text>}
                  </g>
                );
              }}
            />
          </RechartsScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
