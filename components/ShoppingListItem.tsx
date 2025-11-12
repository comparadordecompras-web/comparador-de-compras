
import React, { useMemo } from 'react';
import { ShoppingItem, Supermarket } from '../types';
import { SUPERMARKETS, UNITS } from '../constants';
import { TrashIcon } from './icons/TrashIcon';

interface ShoppingListItemProps {
  item: ShoppingItem;
  onRemove: (id: string) => void;
  onUpdate: (item: ShoppingItem) => void;
}

const PriceInput: React.FC<{
  item: ShoppingItem;
  market: Supermarket;
  isCheapest: boolean;
  onUpdate: (item: ShoppingItem) => void;
}> = ({ item, market, isCheapest, onUpdate }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...item,
      prices: {
        ...item.prices,
        [market]: parseFloat(e.target.value) || 0,
      },
    });
  };

  const totalPrice = item.prices[market] * item.quantity;
  const cellClass = isCheapest ? 'bg-green-100' : '';
  const inputBorderClass = isCheapest ? 'border-green-400' : 'border-gray-300';

  return (
    <td className={`px-4 py-4 whitespace-nowrap text-sm text-center align-top transition-colors ${cellClass}`}>
      <div className="flex flex-col items-center">
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">R$</span>
          <input
            type="number"
            value={item.prices[market] === 0 ? '' : item.prices[market]}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`w-28 text-center p-1 pl-7 rounded-md border focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors ${inputBorderClass}`}
            aria-label={`Preço unitário ${SUPERMARKETS[market]}`}
            placeholder="0.00"
          />
        </div>
        {totalPrice > 0 && (
          <span className="text-xs text-gray-700 mt-1 font-semibold">
            Total: {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        )}
      </div>
    </td>
  );
};


const ShoppingListItem: React.FC<ShoppingListItemProps> = ({ item, onRemove, onUpdate }) => {
  const cheapestPrice = useMemo(() => {
    // Fix: Cast Object.values to number[] to ensure correct type inference for validPrices.
    const validPrices = (Object.values(item.prices) as number[]).filter(p => p > 0);
    return validPrices.length > 0 ? Math.min(...validPrices) : 0;
  }, [item.prices]);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{item.name}</div>
        <div className="text-sm text-gray-500">
          {item.quantity} {UNITS[item.unit]}
        </div>
        <div className="text-xs text-gray-400 italic">{item.category}</div>
      </td>

      {Object.keys(SUPERMARKETS).map(marketKey => (
        <PriceInput
          key={marketKey}
          item={item}
          market={marketKey as Supermarket}
          isCheapest={cheapestPrice > 0 && item.prices[marketKey as Supermarket] === cheapestPrice}
          onUpdate={onUpdate}
        />
      ))}
      
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-full p-1"
          aria-label={`Remover ${item.name}`}
        >
          <TrashIcon />
        </button>
      </td>
    </tr>
  );
};

export default ShoppingListItem;
