import { StageData } from "@/services/api";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface StageScatterProps {
  data: StageData[];
}

export function StageScatter({ data }: StageScatterProps) {
  const chartData = data.map(item => ({
    stage: item.stage,
    "Win Rate": item.winRate,
    wins: item.wins,
    losses: item.losses,
    movedToClosedDeals: item.movedToClosedDeals
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="text-sm font-semibold mb-1">{`Stage: ${label}`}</p>
          <p className="text-sm">{`Win Rate: ${payload[0].value}%`}</p>
          <p className="text-sm">{`Wins: ${payload[0].payload.wins}`}</p>
          <p className="text-sm">{`Losses: ${payload[0].payload.losses}`}</p>
          <p className="text-sm">{`Total Closed: ${payload[0].payload.movedToClosedDeals}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow">
      <div className="mb-4 text-sm font-medium">Win-rate vs. Stage</div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData}
            margin={{ top: 10, right: 30, left: 40, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="stage" 
              fontSize={12}
              tickLine={false}
              axisLine={true}
              label={{ 
                value: 'Stage', 
                position: 'bottom',
                offset: 20,
                fontSize: 12,
                fill: '#6b7280'
              }}
              tick={{ fill: '#6b7280' }}
            />
            <YAxis 
              fontSize={12}
              tickLine={false}
              axisLine={true}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              label={{ 
                value: 'Win Rate (%)', 
                angle: -90, 
                position: 'left',
                offset: 0,
                fontSize: 12,
                fill: '#6b7280'
              }}
              tick={{ fill: '#6b7280' }}
            />
            <Tooltip 
              content={CustomTooltip}
              cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
            />
            <Bar 
              dataKey="Win Rate" 
              fill="#f97316" 
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
              cursor="pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 