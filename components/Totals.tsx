
import React, { useMemo } from 'react';
import { Supermarket } from '../types';
import { SUPERMARKETS } from '../constants';

interface TotalsProps {
  totals: Record<Supermarket | 'optimized', number>;
}

const Totals: React.FC<TotalsProps> = ({ totals }) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const { cheapestMarket, highestMarketTotal } = useMemo(() => {
    let cheapestMarket: Supermarket | null = null;
    let minTotal = Infinity;
    let highestMarketTotal = 0;

    (Object.keys(SUPERMARKETS) as Supermarket[]).forEach(market => {
      const total = totals[market];
      if (total > 0 && total < minTotal) {
        minTotal = total;
        cheapestMarket = market;
      }
      if(total > highestMarketTotal) {
        highestMarketTotal = total;
      }
    });

    return { cheapestMarket, highestMarketTotal };
  }, [totals]);

  const savings = useMemo(() => {
    if (totals.optimized > 0 && highestMarketTotal > 0) {
      return highestMarketTotal - totals.optimized;
    }
    return 0;
  }, [totals.optimized, highestMarketTotal]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-brand-dark">Totais Estimados</h2>
      <div className="space-y-3">
        {Object.entries(SUPERMARKETS).map(([key, name]) => (
          <div
            key={key}
            className={`flex justify-between p-3 rounded-lg ${
              cheapestMarket === key ? 'bg-green-100 border border-green-200' : 'bg-gray-50'
            }`}
          >
            <span className={`font-medium ${cheapestMarket === key ? 'text-green-800' : 'text-gray-700'}`}>
              {name}
            </span>
            <span className={`font-semibold ${cheapestMarket === key ? 'text-green-800' : 'text-gray-900'}`}>
              {formatCurrency(totals[key as Supermarket])}
            </span>
          </div>
        ))}

        <hr className="my-4" />

        <div className="flex justify-between items-center p-3 rounded-lg bg-blue-100 border border-blue-200">
          <span className="font-bold text-brand-primary">🛒 Carrinho Otimizado</span>
          <span className="font-bold text-xl text-brand-primary">
            {formatCurrency(totals.optimized)}
          </span>
        </div>

        {savings > 0 && (
           <div className="text-center mt-4 p-3 rounded-lg bg-brand-secondary/10 text-brand-secondary">
             <p className="font-semibold">
               🎉 Economia de até {formatCurrency(savings)}!
             </p>
           </div>
        )}
      </div>
    </div>
  );
};

export default Totals;
