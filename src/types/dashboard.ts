export interface Competitor {
  id: string;
  name: string;
  totalDeals: number;
  openDeals: number;
  closedDeals: number;
  wins: number;
  losses: number;
  winRate: number;
}

export interface FilterOptions {
  dateRange: {
    from: Date;
    to: Date;
  };
  productLine: string[];
  competitor: string[];
  salesStage: string[];
  product: string[];
  objectionCategory: string[];
}

export interface StageData {
  stage: string;
  movedToClosedDeals: number;
  losses: number;
  wins: number;
  winRate: number;
  topObjections: string[];
}

export interface ProductDiscussion {
  product: string;
  totalDeals: number;
  openDeals: number;
  closedDeals: number;
  wins: number;
  losses: number;
  winRate: number;
}

export interface RepData {
  repName: string;
  totalDeals: number;
  openDeals: number;
  closedDeals: number;
  wins: number;
  losses: number;
  winRate: number;
  topObjections: string[];
}

export interface ObjectionCategoryData {
  category: string;
  totalDeals: number;
  openDeals: number;
  closedDeals: number;
  wins: number;
  losses: number;
  winRate: number;
}
