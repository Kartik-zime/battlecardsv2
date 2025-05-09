import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StageData } from "@/types/dashboard";

interface StageScatterPlotProps {
  data: StageData[];
}

export default function StageScatterPlot({ data }: StageScatterPlotProps) {
  // Prepare data for scatter plot
  // Sort by movedToClosedDeals descending, label only top 5
  const sorted = [...data].sort((a, b) => b.movedToClosedDeals - a.movedToClosedDeals);
  const top5Stages = new Set(sorted.slice(0, 5).map(s => s.stage));
  const scatterData = data.map(stage => ({
    x: stage.winRate,
    y: stage.movedToClosedDeals,
    name: top5Stages.has(stage.stage) ? stage.stage : '',
    z: Math.max(40, stage.movedToClosedDeals * 6), // adjust multiplier for visual balance
  }));

  return (
    <Card className="h-full border shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Win Rate vs. Total Deals (by Stage)</CardTitle>
      </CardHeader>
      <CardContent className="p-0 pb-4">
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 25, left: 35 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              dataKey="x"
              name="Win Rate"
              label={{ value: 'Win Rate (%)', position: 'bottom', offset: 0 }}
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Total Deals"
              label={{ value: 'Total Deals', angle: -90, position: 'insideLeft', offset: 15 }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(_, name, props) => {
                if (name === 'x') return [`${props.payload.x}%`, 'Win Rate'];
                if (name === 'y') return [props.payload.y, 'Total Deals'];
                return [props.payload.name, 'Stage'];
              }}
              labelFormatter={(_, props) => props && props.length > 0 ? props[0].payload.name : ''}
            />
            <Scatter name="Stage" data={scatterData} fill="#E76E50" shape="circle" legendType="circle" z="z">
              <LabelList dataKey="name" position="top" fontSize={11} />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 