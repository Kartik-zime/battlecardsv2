import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import ReactWordcloud from 'react-wordcloud';
import { ObjectionCategoryData } from '@/types/dashboard';

interface ObjectionWordCloudProps {
  data: ObjectionCategoryData[];
}

export function ObjectionWordCloud({ data }: ObjectionWordCloudProps) {
  const words = data.map(item => ({
    text: item.category,
    value: item.totalDeals,
  }));

  const options = {
    rotations: 0,
    rotationAngles: [0, 0] as [number, number],
    fontSizes: [20, 60] as [number, number],
    padding: 2,
    fontFamily: 'Inter',
    colors: [
      '#f97316', // orange-500 (primary)
      '#0ea5e9', // sky-500
      '#84cc16', // lime-500
      '#8b5cf6', // violet-500
      '#ec4899', // pink-500
      '#14b8a6', // teal-500
      '#f59e0b', // amber-500
      '#6366f1', // indigo-500
    ],
    enableTooltip: true,
    deterministic: true,
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow h-full">
      <div className="mb-4 text-sm font-medium">Objection Categories Word Cloud</div>
      <div className="h-[400px]">
        <ReactWordcloud 
          words={words} 
          options={options}
        />
      </div>
    </div>
  );
} 