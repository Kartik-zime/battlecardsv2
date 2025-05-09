import { useState, useEffect } from "react";
import { stageData } from "@/data/stage-data";
import { productDiscussionData } from "@/data/product-discussion-data";
import { FilterOptions } from "@/types/dashboard";
import { 
  fetchBattlecardData, 
  filterData, 
  getDistinctValues,
  transformToCompetitorData,
  transformToScatterData,
  transformToRepData,
  transformToObjectionData,
  transformToProductData,
  transformToProductScatterData,
  transformToStageData,
  transformToTagData,
  type StageData
} from "@/services/api";
import FilterBar from "@/components/dashboard/FilterBar";
import CompetitorTable from "@/components/dashboard/CompetitorTable";
import ScatterChart from "@/components/dashboard/ScatterChart";
import { StageTable } from "@/components/dashboard/StageTable";
import StageScatterPlot from "@/components/dashboard/StageScatterPlot";
import ProductDiscussionTable from "@/components/dashboard/ProductDiscussionTable";
import ProductDiscussionScatter from "@/components/dashboard/ProductDiscussionScatter";
import RepTable from "@/components/dashboard/RepTable";
import ObjectionCategoryTable from "@/components/dashboard/ObjectionCategoryTable";
import { StageScatter } from "@/components/dashboard/StageScatter";
import { ObjectionWordCloud } from "@/components/dashboard/ObjectionWordCloud";
import TagPieChart from "@/components/dashboard/TagPieChart";
import RawDealsTable from "@/components/dashboard/RawDealsTable";
import ExplainerCard from "@/components/dashboard/ExplainerCard";

export default function Dashboard() {
  // Set default date range from Jan 1, 2024 to current date
  const today = new Date();
  const defaultDateRange = {
    from: new Date(2024, 0, 1),
    to: today
  };

  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: defaultDateRange,
    productLine: ["All"],
    competitor: ["All"],
    dealStage: ["All"],
    stageBeforeLost: ["All"],
  });

  const [filterOptions, setFilterOptions] = useState({
    productLines: ["All"],
    competitors: ["All"],
    dealStages: ["All"],
    stageBeforeLost: ["All"],
  });

  const [battlecardData, setBattlecardData] = useState([]);
  const [competitorData, setCompetitorData] = useState([]);
  const [scatterData, setScatterData] = useState([]);
  const [repData, setRepData] = useState([]);
  const [objectionData, setObjectionData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [productScatterData, setProductScatterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stageData, setStageData] = useState<StageData[]>([]);

  // Store filtered data for use in child components
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const battlecardData = await fetchBattlecardData();
        setBattlecardData(battlecardData);
        
        // Get distinct values for filters
        const distinctValues = getDistinctValues(battlecardData);
        setFilterOptions(distinctValues);
        
        // Initial data transformation
        const filteredData = filterData(battlecardData, filters);
        const transformedCompetitorData = transformToCompetitorData(filteredData);
        const transformedScatterData = transformToScatterData(filteredData);
        const transformedRepData = transformToRepData(filteredData);
        const transformedObjectionData = transformToObjectionData(filteredData);
        
        setCompetitorData(transformedCompetitorData);
        setScatterData(transformedScatterData);
        setRepData(transformedRepData);
        setObjectionData(transformedObjectionData);
        setStageData(transformToStageData(filteredData));
        setError(null);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (battlecardData.length > 0) {
      const filtered = filterData(battlecardData, filters);
      setFilteredData(filtered);
      setCompetitorData(transformToCompetitorData(filtered));
      setScatterData(transformToScatterData(filtered));
      setRepData(transformToRepData(filtered));
      setObjectionData(transformToObjectionData(filtered));
      setProductData(transformToProductData(filtered));
      setProductScatterData(transformToProductScatterData(filtered));
      setStageData(transformToStageData(filtered));
    }
  }, [battlecardData, filters]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1600px]">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Competitive Win-Loss Analysis</h1>
          <p className="text-gray-500">
            Track competitor presence, win rates, top objections, and sales performance to uncover revenue opportunities and risks.
          </p>
        </div>
        <div className="h-12">
          <img 
            src={`${import.meta.env.BASE_URL}assets/zime-logo.png`}
            alt="Zime logo" 
            className="h-full object-contain" 
          />
        </div>
      </div>

      <FilterBar 
        filters={filters} 
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange} 
      />

      <ExplainerCard
        title="Top Challengers in the Pipeline"
        insight="See which competitors show up most frequently in deals and how effectively we convert against them."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        <CompetitorTable data={competitorData} />
        <ScatterChart data={scatterData} />
      </div>

      <ExplainerCard
        title="Products Most Frequently Targeted"
        insight="Identify which of our product lines face the most competitive pressure to prioritize differentiation, enablement, and support."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        <ProductDiscussionTable data={productData} />
        <ProductDiscussionScatter data={productScatterData} />
      </div>

      <ExplainerCard
        title="Conversion Patterns Across the Funnel"
        insight="Understand where in the sales journey we win or lose competitive deals to improve stage-specific strategy."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        <StageTable data={stageData} />
        <StageScatterPlot data={stageData} />
      </div>

      <ExplainerCard
        title="Why We Lose to Competitors"
        insight="Identify the most common reasons for lost deals to strengthen our positioning, messaging, and product roadmap."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ObjectionCategoryTable data={objectionData} />
        <ObjectionWordCloud data={objectionData} />
      </div>

      <ExplainerCard
        title="Competitor Positioning with Prospect"
        insight="Assess how well competitors are known or adopted with our prospect to plan for displacement vs greenfield tactics."
      />
      <div className="grid grid-cols-1 gap-6 mb-8">
        <TagPieChart data={transformToTagData(filteredData)} />
      </div>

      <ExplainerCard
        title="Rep Performance in Competitive Deals"
        insight="Highlight which reps win despite objections and where coaching is needed to improve competitive outcomes."
      />
      <div className="grid grid-cols-1 gap-6">
        <RepTable data={repData} />
      </div>

      <div className="mt-8">
        <ExplainerCard
          title="Deal-Level Drill-Down: Calls, Stages & Outcomes"
          insight="Deep dive into individual competitive deals to review call outcomes, deal stages, and key objections raised by prospects."
        />
      </div>
      <RawDealsTable data={filteredData} />
    </div>
  );
}
