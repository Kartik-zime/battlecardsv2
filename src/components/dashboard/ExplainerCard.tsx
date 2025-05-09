import { Card } from "@/components/ui/card";

interface ExplainerCardProps {
  title: string;
  insight: string;
}

export default function ExplainerCard({ title, insight }: ExplainerCardProps) {
  return (
    <Card className="mb-4 p-6 bg-gray-50">
      <div className="text-lg font-bold text-black mb-1">{title}</div>
      <div className="text-gray-600 text-sm">{insight}</div>
    </Card>
  );
} 