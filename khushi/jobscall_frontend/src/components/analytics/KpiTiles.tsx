'use client';

interface KpiData {
  [key: string]: {
    value: string;
    label: string;
  };
}

interface KpiTilesProps {
  kpiData: KpiData;
  selectedKpi: string;
  onKpiSelect: (kpi: string) => void;
}

const KpiTiles: React.FC<KpiTilesProps> = ({ kpiData, selectedKpi, onKpiSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {Object.entries(kpiData).map(([key, data]) => (
        <div
          key={key}
          className={`p-4 rounded-lg border ${
            selectedKpi === key
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          } cursor-pointer transition-colors`}
          onClick={() => onKpiSelect(key)}
        >
          <p className="text-sm font-medium text-gray-500">{data.label}</p>
          <p className="text-2xl font-semibold text-gray-900">{data.value}</p>
        </div>
      ))}
    </div>
  );
};

export default KpiTiles;
