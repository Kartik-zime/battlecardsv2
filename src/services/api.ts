import { RepData, ObjectionCategoryData, FilterOptions } from "@/types/dashboard";

const OPEN_DEAL_STAGES = [
  "Qualify (RSD/VP Qualification)",
  "Renewal Identified",
  "Finalize",
  "Partner Sign Up In Progress",
  "Non POC Deal",
  "RFP",
  "Outcome Definition",
  "Technical Win / Negotiation (if not yet secured)",
  "POC Objective Defined",
  "MQL/Prospecting",
  "POC In-Progress",
  "RFI",
  "Sale In Progress",
  "Review in Progress",
  "Pilot In-Progress",
  "Proposal",
  "Credit Hold"
];

const WIN_DEAL_STAGES = [
  "Close - Won",
  "Closed-Won",
  "Closed Won",
  "Technical Win / Negotiation",
  "Renewal Accepted/Validated by Customer",
  "Signed Partner",
  "SP/MSP Business Awarded"
];

const LOSS_DEAL_STAGES = [
  "Close - Lost",
  "Closed-Lost",
  "Closed - Invalid",
  "Closed Contingent- T&B",
  "Closed Contingent"
];

interface BattlecardResponse {
  company: string;
  prospect_company: string;
  deal_id: string;
  deal_title: string;
  deal_stage: string;
  call_date: string;
  Rep_name: string;
  Competitor_name: string;
  objection_category: string;
  sales_stage: string;
  funnel_by_product: string;
  previous_deal_stage: string;
  heading: string;
  tag: string;
}

interface CompetitorStats {
  totalDeals: Set<string>;
  openDeals: Set<string>;
  closedDeals: Set<string>;
  wins: Set<string>;
  losses: Set<string>;
}

interface ProductStats {
  totalDeals: Set<string>;
  openDeals: Set<string>;
  closedDeals: Set<string>;
  wins: Set<string>;
  losses: Set<string>;
}

const API_URL = "https://script.google.com/macros/s/AKfycbz6z1qUqGyEKh_psloIeBM5HzTk1FWV48kM0y9vva2v6sCrRovWUqi0Bj7-8x6tduQ4/exec";

export async function fetchBattlecardData() {
  const response = await fetch(API_URL);
  const data: BattlecardResponse[] = await response.json();
  return data;
}

export function getDistinctValues(data: BattlecardResponse[]) {
  const productLines = new Set<string>(["All"]);
  const competitors = new Set<string>(["All"]);
  const salesStages = new Set<string>(["All"]);
  const products = new Set<string>(["All"]);
  const objectionCategories = new Set<string>(["All"]);

  data.forEach(item => {
    if (item.funnel_by_product) {
      productLines.add(item.funnel_by_product);
    }
    if (item.Competitor_name) {
      competitors.add(item.Competitor_name);
    }
    if (item.sales_stage) {
      salesStages.add(item.sales_stage);
    }
    if (item.heading) {
      products.add(item.heading);
    }
    if (item.objection_category) {
      objectionCategories.add(item.objection_category);
    }
  });

  return {
    productLines: Array.from(productLines),
    competitors: Array.from(competitors),
    salesStages: Array.from(salesStages),
    products: Array.from(products),
    objectionCategories: Array.from(objectionCategories),
  };
}

export function filterData(data: BattlecardResponse[], filters: FilterOptions) {
  return data.filter(item => {
    const itemDate = new Date(item.call_date);
    const dateInRange = itemDate >= filters.dateRange.from && itemDate <= filters.dateRange.to;

    const productLineMatch = filters.productLine.includes("All") || filters.productLine.includes(item.funnel_by_product);
    const competitorMatch = filters.competitor.includes("All") || filters.competitor.includes(item.Competitor_name);
    const salesStageMatch = filters.salesStage.includes("All") || filters.salesStage.includes(item.sales_stage);
    const productMatch = filters.product.includes("All") || filters.product.includes(item.heading);
    const objectionCategoryMatch = filters.objectionCategory.includes("All") || filters.objectionCategory.includes(item.objection_category);

    return dateInRange && productLineMatch && competitorMatch && salesStageMatch && productMatch && objectionCategoryMatch;
  });
}

interface RepStats {
  totalDeals: Set<string>;
  openDeals: Set<string>;
  closedDeals: Set<string>;
  wins: Set<string>;
  losses: Set<string>;
  objections: Map<string, number>; // objection category -> count
}

export function transformToRepData(data: BattlecardResponse[]): RepData[] {
  const repMap = new Map<string, RepStats>();

  // Process each deal
  data.forEach(deal => {
    if (!deal.Rep_name) return;

    let stats = repMap.get(deal.Rep_name) || {
      totalDeals: new Set<string>(),
      openDeals: new Set<string>(),
      closedDeals: new Set<string>(),
      wins: new Set<string>(),
      losses: new Set<string>(),
      objections: new Map<string, number>()
    };

    // Add to total deals
    stats.totalDeals.add(deal.deal_id);

    // Categorize based on deal stage
    if (OPEN_DEAL_STAGES.includes(deal.deal_stage)) {
      stats.openDeals.add(deal.deal_id);
    }
    
    if (WIN_DEAL_STAGES.includes(deal.deal_stage)) {
      stats.closedDeals.add(deal.deal_id);
      stats.wins.add(deal.deal_id);
    }
    
    if (LOSS_DEAL_STAGES.includes(deal.deal_stage)) {
      stats.closedDeals.add(deal.deal_id);
      stats.losses.add(deal.deal_id);
    }

    // Count objections
    if (deal.objection_category && deal.objection_category !== "NA") {
      const currentCount = stats.objections.get(deal.objection_category) || 0;
      stats.objections.set(deal.objection_category, currentCount + 1);
    }

    repMap.set(deal.Rep_name, stats);
  });

  // Convert map to array and calculate metrics
  return Array.from(repMap.entries()).map(([repName, stats]) => {
    // Get top 3 objections by count
    const sortedObjections = Array.from(stats.objections.entries())
      .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
      .slice(0, 3) // Take top 3
      .map(([objection]) => objection); // Extract just the objection names

    return {
      repName,
      totalDeals: stats.totalDeals.size,
      openDeals: stats.openDeals.size,
      closedDeals: stats.closedDeals.size,
      wins: stats.wins.size,
      losses: stats.losses.size,
      winRate: stats.closedDeals.size > 0 
        ? Math.round((stats.wins.size / stats.closedDeals.size) * 100) 
        : 0,
      topObjections: sortedObjections
    };
  });
}

export function transformToObjectionData(data: BattlecardResponse[]): ObjectionCategoryData[] {
  const objectionMap = new Map<string, {
    totalDeals: number;
    openDeals: number;
    closedDeals: number;
    wins: number;
    losses: number;
  }>();

  // Process each deal
  data.forEach(deal => {
    if (!deal.objection_category || deal.objection_category === "NA") return;

    let objStats = objectionMap.get(deal.objection_category) || {
      totalDeals: 0,
      openDeals: 0,
      closedDeals: 0,
      wins: 0,
      losses: 0
    };

    objStats.totalDeals++;
    
    if (deal.sales_stage === "Closed Won") {
      objStats.wins++;
      objStats.closedDeals++;
    } else if (deal.sales_stage === "Closed-Lost") {
      objStats.losses++;
      objStats.closedDeals++;
    } else {
      objStats.openDeals++;
    }

    objectionMap.set(deal.objection_category, objStats);
  });

  // Convert map to array of ObjectionCategoryData
  return Array.from(objectionMap.entries()).map(([category, stats]) => ({
    category,
    totalDeals: stats.totalDeals,
    openDeals: stats.openDeals,
    closedDeals: stats.closedDeals,
    wins: stats.wins,
    losses: stats.losses,
    winRate: stats.closedDeals > 0 ? Math.round((stats.wins / stats.closedDeals) * 100) : 0
  }));
}

export interface ScatterData {
  competitor: string;
  x: number; // win rate
  y: number; // total deals
  size: number; // closed deals
}

export function transformToCompetitorData(data: BattlecardResponse[]) {
  const competitorMap = new Map<string, CompetitorStats>();

  // Process each deal
  data.forEach(deal => {
    if (!deal.Competitor_name) return;

    let stats = competitorMap.get(deal.Competitor_name) || {
      totalDeals: new Set<string>(),
      openDeals: new Set<string>(),
      closedDeals: new Set<string>(),
      wins: new Set<string>(),
      losses: new Set<string>()
    };

    // Add to total deals
    stats.totalDeals.add(deal.deal_id);

    // Categorize based on deal stage
    if (OPEN_DEAL_STAGES.includes(deal.deal_stage)) {
      stats.openDeals.add(deal.deal_id);
    }
    
    if (WIN_DEAL_STAGES.includes(deal.deal_stage)) {
      stats.closedDeals.add(deal.deal_id);
      stats.wins.add(deal.deal_id);
    }
    
    if (LOSS_DEAL_STAGES.includes(deal.deal_stage)) {
      stats.closedDeals.add(deal.deal_id);
      stats.losses.add(deal.deal_id);
    }

    competitorMap.set(deal.Competitor_name, stats);
  });

  // Convert map to array and calculate metrics
  return Array.from(competitorMap.entries()).map(([name, stats]) => ({
    id: name,
    name,
    totalDeals: stats.totalDeals.size,
    openDeals: stats.openDeals.size,
    closedDeals: stats.closedDeals.size,
    wins: stats.wins.size,
    losses: stats.losses.size,
    winRate: stats.closedDeals.size > 0 
      ? Math.round((stats.wins.size / stats.closedDeals.size) * 100) 
      : 0
  }));
}

export function transformToScatterData(data: BattlecardResponse[]): ScatterData[] {
  const competitorMap = new Map<string, CompetitorStats>();

  // Process each deal
  data.forEach(deal => {
    if (!deal.Competitor_name) return;

    let stats = competitorMap.get(deal.Competitor_name) || {
      totalDeals: new Set<string>(),
      openDeals: new Set<string>(),
      closedDeals: new Set<string>(),
      wins: new Set<string>(),
      losses: new Set<string>()
    };

    // Add to total deals
    stats.totalDeals.add(deal.deal_id);

    // Categorize based on deal stage
    if (OPEN_DEAL_STAGES.includes(deal.deal_stage)) {
      stats.openDeals.add(deal.deal_id);
    }
    
    if (WIN_DEAL_STAGES.includes(deal.deal_stage)) {
      stats.closedDeals.add(deal.deal_id);
      stats.wins.add(deal.deal_id);
    }
    
    if (LOSS_DEAL_STAGES.includes(deal.deal_stage)) {
      stats.closedDeals.add(deal.deal_id);
      stats.losses.add(deal.deal_id);
    }

    competitorMap.set(deal.Competitor_name, stats);
  });

  // Convert map to scatter data format
  return Array.from(competitorMap.entries()).map(([competitor, stats]) => {
    const winRate = stats.closedDeals.size > 0 
      ? Math.round((stats.wins.size / stats.closedDeals.size) * 100) 
      : 0;

    return {
      competitor,
      x: winRate,
      y: stats.totalDeals.size,
      size: stats.closedDeals.size
    };
  });
}

export interface ProductData {
  product: string;
  totalDeals: number;
  openDeals: number;
  closedDeals: number;
  wins: number;
  losses: number;
  winRate: number;
}

export interface ProductScatterData {
  competitor: string;
  x: number; // win rate
  y: number; // total deals
}

export function transformToProductData(data: BattlecardResponse[]) {
  const productMap = new Map<string, ProductStats>();

  // Process each deal
  data.forEach(deal => {
    if (!deal.heading) return;

    let stats = productMap.get(deal.heading) || {
      totalDeals: new Set<string>(),
      openDeals: new Set<string>(),
      closedDeals: new Set<string>(),
      wins: new Set<string>(),
      losses: new Set<string>()
    };

    // Add to total deals
    stats.totalDeals.add(deal.deal_id);

    // Categorize based on deal stage
    if (OPEN_DEAL_STAGES.includes(deal.deal_stage)) {
      stats.openDeals.add(deal.deal_id);
    }
    
    if (WIN_DEAL_STAGES.includes(deal.deal_stage)) {
      stats.closedDeals.add(deal.deal_id);
      stats.wins.add(deal.deal_id);
    }
    
    if (LOSS_DEAL_STAGES.includes(deal.deal_stage)) {
      stats.closedDeals.add(deal.deal_id);
      stats.losses.add(deal.deal_id);
    }

    productMap.set(deal.heading, stats);
  });

  // Convert map to array and calculate metrics
  return Array.from(productMap.entries()).map(([product, stats]) => ({
    product,
    totalDeals: stats.totalDeals.size,
    openDeals: stats.openDeals.size,
    closedDeals: stats.closedDeals.size,
    wins: stats.wins.size,
    losses: stats.losses.size,
    winRate: stats.closedDeals.size > 0 
      ? Math.round((stats.wins.size / stats.closedDeals.size) * 100) 
      : 0
  }));
}

export function transformToProductScatterData(data: BattlecardResponse[]) {
  const productData = transformToProductData(data);
  
  return productData.map(item => ({
    competitor: item.product, // Using competitor field to maintain consistency with scatter plot component
    x: item.winRate,
    y: item.totalDeals
  }));
}

export interface StageData {
  stage: string;
  movedToClosedDeals: number;
  losses: number;
  wins: number;
  winRate: number;
  topObjections: string[];
}

export function transformToStageData(data: BattlecardResponse[]): StageData[] {
  // Get all distinct previous_deal_stage values
  const stageMap = new Map<string, {
    closedDeals: Set<string>;
    wins: Set<string>;
    losses: Set<string>;
    objections: Map<string, number>;
  }>();

  data.forEach(deal => {
    if (!deal.previous_deal_stage) return;
    let stats = stageMap.get(deal.previous_deal_stage) || {
      closedDeals: new Set<string>(),
      wins: new Set<string>(),
      losses: new Set<string>(),
      objections: new Map<string, number>()
    };

    // Count closed deals
    if (WIN_DEAL_STAGES.includes(deal.deal_stage) || LOSS_DEAL_STAGES.includes(deal.deal_stage)) {
      stats.closedDeals.add(deal.deal_id);
    }
    // Count wins
    if (WIN_DEAL_STAGES.includes(deal.deal_stage)) {
      stats.wins.add(deal.deal_id);
    }
    // Count losses
    if (LOSS_DEAL_STAGES.includes(deal.deal_stage)) {
      stats.losses.add(deal.deal_id);
    }
    // Count objections
    if (deal.objection_category && deal.objection_category !== "NA") {
      const currentCount = stats.objections.get(deal.objection_category) || 0;
      stats.objections.set(deal.objection_category, currentCount + 1);
    }
    stageMap.set(deal.previous_deal_stage, stats);
  });

  return Array.from(stageMap.entries()).map(([stage, stats]) => {
    const winRate = stats.closedDeals.size > 0 ? Math.round((stats.wins.size / stats.closedDeals.size) * 100) : 0;
    const sortedObjections = Array.from(stats.objections.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([objection]) => objection);
    return {
      stage,
      movedToClosedDeals: stats.closedDeals.size,
      losses: stats.losses.size,
      wins: stats.wins.size,
      winRate,
      topObjections: sortedObjections
    };
  });
}

export interface TagData {
  name: string;
  value: number;
}

export function transformToTagData(data: BattlecardResponse[]): TagData[] {
  const tagMap = new Map<string, number>();
  const totalCallLinks = new Set<string>();

  // Count total distinct call_links
  data.forEach(item => {
    if (item.deal_id) {
      totalCallLinks.add(item.deal_id);
    }
  });

  // Count tag occurrences
  data.forEach(item => {
    if (item.tag) {
      const currentCount = tagMap.get(item.tag) || 0;
      tagMap.set(item.tag, currentCount + 1);
    }
  });

  // Convert to array and calculate percentages
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({
      name,
      value: Math.round((count / totalCallLinks.size) * 100)
    }))
    .sort((a, b) => b.value - a.value); // Sort by value in descending order
} 