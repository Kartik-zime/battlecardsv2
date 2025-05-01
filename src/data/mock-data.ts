
import { Competitor } from "@/types/dashboard";

export const competitors: Competitor[] = [
  {
    id: "1",
    name: "Palo Alto",
    totalDeals: 100,
    openDeals: 50,
    closedDeals: 20,
    wins: 10,
    losses: 10,
    winRate: 50
  },
  {
    id: "2",
    name: "B",
    totalDeals: 85,
    openDeals: 40,
    closedDeals: 25,
    wins: 15,
    losses: 10,
    winRate: 60
  },
  {
    id: "3",
    name: "C",
    totalDeals: 120,
    openDeals: 70,
    closedDeals: 30,
    wins: 20,
    losses: 10,
    winRate: 66.7
  },
  {
    id: "4",
    name: "D",
    totalDeals: 75,
    openDeals: 30,
    closedDeals: 20,
    wins: 12,
    losses: 8,
    winRate: 60
  },
  {
    id: "5",
    name: "E",
    totalDeals: 95,
    openDeals: 45,
    closedDeals: 25,
    wins: 15,
    losses: 10,
    winRate: 60
  },
  {
    id: "6",
    name: "F",
    totalDeals: 110,
    openDeals: 60,
    closedDeals: 30,
    wins: 18,
    losses: 12,
    winRate: 60
  },
  {
    id: "7",
    name: "G",
    totalDeals: 65,
    openDeals: 30,
    closedDeals: 20,
    wins: 10,
    losses: 10,
    winRate: 50
  }
];

export const mockFilterOptions = {
  productLine: ["Product A", "Product B", "Product C", "Product D"],
  competitor: competitors.map(comp => comp.name),
  dealStage: ["All Stages", "Discovery", "Qualification", "Solution", "Proposal", "Negotiation", "Closed"],
  stageBeforeLost: ["All Stages", "Discovery", "Qualification", "Solution", "Proposal", "Negotiation"]
};

export const scatterData = competitors.map(comp => ({
  name: comp.name,
  totalDeals: comp.totalDeals,
  winRate: comp.winRate,
}));
