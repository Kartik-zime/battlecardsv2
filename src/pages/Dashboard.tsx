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
  type StageData
} from "@/services/api";
import FilterBar from "@/components/dashboard/FilterBar";
import CompetitorTable from "@/components/dashboard/CompetitorTable";
import ScatterChart from "@/components/dashboard/ScatterChart";
import { StageTable } from "@/components/dashboard/StageTable";
import StageBarChart from "@/components/dashboard/StageBarChart";
import ProductDiscussionTable from "@/components/dashboard/ProductDiscussionTable";
import ProductDiscussionScatter from "@/components/dashboard/ProductDiscussionScatter";
import RepTable from "@/components/dashboard/RepTable";
import ObjectionCategoryTable from "@/components/dashboard/ObjectionCategoryTable";
import { StageScatter } from "@/components/dashboard/StageScatter";
import { ObjectionWordCloud } from "@/components/dashboard/ObjectionWordCloud";

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

  const [rawData, setRawData] = useState([]);
  const [competitorData, setCompetitorData] = useState([]);
  const [scatterData, setScatterData] = useState([]);
  const [repData, setRepData] = useState([]);
  const [objectionData, setObjectionData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [productScatterData, setProductScatterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stageData, setStageData] = useState<StageData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const battlecardData = await fetchBattlecardData();
        setRawData(battlecardData);
        
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
    if (rawData.length > 0) {
      const filteredData = filterData(rawData, filters);
      setCompetitorData(transformToCompetitorData(filteredData));
      setScatterData(transformToScatterData(filteredData));
      setRepData(transformToRepData(filteredData));
      setObjectionData(transformToObjectionData(filteredData));
      setProductData(transformToProductData(filteredData));
      setProductScatterData(transformToProductScatterData(filteredData));
      setStageData(transformToStageData(filteredData));
    }
  }, [rawData, filters]);

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
          <h1 className="text-2xl font-bold text-gray-900">Competitor Battlecards</h1>
          <p className="text-gray-500">
            Review competitor performance and win rates across your product lines
          </p>
        </div>
        <div className="h-12">
          <img 
            src="/lovable-uploads/02026d8a-4f46-4e14-9482-d70a6e237e77.png" 
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <CompetitorTable data={competitorData} />
        </div>
        <div className="lg:col-span-1">
          <ScatterChart data={scatterData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ProductDiscussionTable data={productData} />
        </div>
        <div className="lg:col-span-1">
          <ProductDiscussionScatter data={productScatterData} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        <StageTable data={stageData} />
        <StageScatter data={stageData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ObjectionCategoryTable data={objectionData} />
        <ObjectionWordCloud data={objectionData} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <RepTable data={repData} />
      </div>
    </div>
  );
}
