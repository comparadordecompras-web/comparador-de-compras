import React, { useMemo } from 'react';
import { CATEGORIES } from '../constants';

interface CategoryTotals {
  optimized: number;
  highest: number;
}

interface CategoryDistributionChartProps {
  categoryTotals: Record<string, CategoryTotals>;
  totalOptimized: number;
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({ categoryTotals, totalOptimized }) => {
  
  const chartData = useMemo(() => {
    if (totalOptimized === 0) return [];

    return CATEGORIES
      .map(category => {
        const totals = categoryTotals[category];
        if (!totals || totals.optimized === 0) return null;

        const percentage = (totals.optimized / totalOptimized) * 100;
        
        return {
          category,
          optimized: totals.optimized,
          percentage: percentage.toFixed(1),
        };
      })
      .filter((data): data is { category: string, optimized: number, percentage: string } => data !== null)
      .sort((a, b) => b.optimized - a.optimized); // Sort descending by cost
  }, [categoryTotals, totalOptimized]);

  if (chartData.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        Nenhum gasto otimizado encontrado para análise de categorias.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {chartData.map((data, index) => (
        <div key={data.category} className="p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium text-gray-700">{data.category}</span>
            <span className="font-semibold text-brand-primary">
              {formatCurrency(data.optimized)} ({data.percentage}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-brand-primary h-3 rounded-full transition-all duration-500" 
              style={{ width: `${data.percentage}%` }}
              title={`${data.percentage}% do custo total otimizado`}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryDistributionChart;