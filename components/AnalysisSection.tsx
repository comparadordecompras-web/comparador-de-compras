import React, { useMemo } from 'react';
import { ShoppingItem, Supermarket } from '../types';
import { SUPERMARKETS, CATEGORIES } from '../constants';
import { DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';

interface AnalysisSectionProps {
  items: ShoppingItem[];
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const AnalysisSection: React.FC<AnalysisSectionProps> = ({ items }) => {

  const analysisData = useMemo(() => {
    const categoryTotals: Record<string, { optimized: number, highest: number }> = {};
    const marketDistribution: Record<Supermarket, { count: number, totalCost: number }> = {
      iquegami: { count: 0, totalCost: 0 },
      proenca: { count: 0, totalCost: 0 },
      max: { count: 0, totalCost: 0 },
    };

    let totalSavings = 0;
    let totalOptimized = 0;
    let totalHighest = 0;

    items.forEach(item => {
      // Fix 1: Explicitly cast price to number and filter
      const prices = (Object.entries(item.prices) as [Supermarket, number][])
        .filter(([, price]) => price > 0)
        .map(([market, price]) => ({ market: market as Supermarket, price }));

      if (prices.length === 0) return;

      const minPriceEntry = prices.reduce((min, current) => (current.price < min.price ? current : min), prices[0]);
      const maxPriceEntry = prices.reduce((max, current) => (current.price > max.price ? current : max), prices[0]);

      // Fix 2 & 3: minPriceEntry.price and maxPriceEntry.price are now correctly typed as number
      const optimizedCost = minPriceEntry.price * item.quantity;
      const highestCost = maxPriceEntry.price * item.quantity;

      // 1. Category Totals
      const category = item.category || 'Outros';
      if (!categoryTotals[category]) {
        categoryTotals[category] = { optimized: 0, highest: 0 };
      }
      categoryTotals[category].optimized += optimizedCost;
      categoryTotals[category].highest += highestCost;

      // 2. Market Distribution (Optimized)
      marketDistribution[minPriceEntry.market].count += 1;
      marketDistribution[minPriceEntry.market].totalCost += optimizedCost;

      // 3. Global Totals
      totalOptimized += optimizedCost;
      totalHighest += highestCost;
    });

    totalSavings = totalHighest - totalOptimized;

    return { categoryTotals, marketDistribution, totalSavings, totalOptimized, totalHighest };
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
        <h2 className="text-xl font-bold mb-4 text-brand-dark">Análise de Compras</h2>
        <div className="text-center py-16 text-gray-500">
          Adicione itens à sua lista para visualizar a análise de economia e distribuição por categoria.
        </div>
      </div>
    );
  }

  const { categoryTotals, marketDistribution, totalSavings, totalOptimized, totalHighest } = analysisData;

  return (
    <div className="lg:col-span-2 space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-brand-dark flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-brand-secondary" />
          Resumo da Economia
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 font-medium">Custo Otimizado</p>
            <p className="text-2xl font-bold text-brand-primary mt-1">{formatCurrency(totalOptimized)}</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-700 font-medium">Custo Máximo (Pior Cenário)</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(totalHighest)}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-700 font-medium">Economia Potencial</p>
            <p className="text-2xl font-bold text-brand-secondary mt-1">{formatCurrency(totalSavings)}</p>
          </div>
        </div>
      </div>

      {/* Market Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 text-brand-dark flex items-center">
          <ShoppingBag className="w-5 h-5 mr-2 text-brand-primary" />
          Distribuição do Carrinho Otimizado
        </h3>
        <p className="text-sm text-gray-500 mb-4">Onde comprar cada item para obter o menor custo total.</p>
        <div className="space-y-3">
          {(Object.keys(SUPERMARKETS) as Supermarket[]).map(marketKey => {
            const data = marketDistribution[marketKey];
            const percentage = totalOptimized > 0 ? (data.totalCost / totalOptimized) * 100 : 0;
            const marketName = SUPERMARKETS[marketKey];

            return (
              <div key={marketKey} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-700">{marketName} ({data.count} itens)</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(data.totalCost)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-brand-primary h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${percentage}%` }}
                    title={`${percentage.toFixed(1)}% do custo total otimizado`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 text-brand-dark flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-brand-secondary" />
          Gastos por Categoria
        </h3>
        <p className="text-sm text-gray-500 mb-4">Comparação entre o custo otimizado e o custo máximo por categoria.</p>
        <div className="space-y-4">
          {CATEGORIES.map(category => {
            const totals = categoryTotals[category];
            if (!totals || totals.optimized === 0) return null;

            const savings = totals.highest - totals.optimized;
            const percentageSavings = totals.highest > 0 ? (savings / totals.highest) * 100 : 0;

            return (
              <div key={category} className="border-b pb-3">
                <h4 className="font-semibold text-gray-800 mb-1">{category}</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Otimizado</p>
                    <p className="font-bold text-brand-primary">{formatCurrency(totals.optimized)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Máximo</p>
                    <p className="font-bold text-red-600">{formatCurrency(totals.highest)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Economia</p>
                    <p className="font-bold text-brand-secondary">
                      {formatCurrency(savings)} ({percentageSavings.toFixed(0)}%)
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalysisSection;