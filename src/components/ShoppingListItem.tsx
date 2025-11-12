import React, { useMemo } from 'react';
import { ShoppingItem, Supermarket, Unit } from '../types';
import { SUPERMARKETS, UNITS, CATEGORIES } from '../constants';
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
    const validPrices = (Object.values(item.prices) as number[]).filter(p => p > 0);
    return validPrices.length > 0 ? Math.min(...validPrices) : 0;
  }, [item.prices]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...item, name: e.target.value });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseFloat(e.target.value);
    if (newQuantity >= 0.1 || e.target.value === '') {
      onUpdate({ ...item, quantity: newQuantity || 0.1 });
    }
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ ...item, unit: e.target.value as Unit });
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ ...item, category: e.target.value });
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        {/* Nome do Item (Editável) */}
        <input
          type="text"
          value={item.name}
          onChange={handleNameChange}
          className="text-sm font-medium text-gray-900 w-full p-1 border border-gray-200 rounded-md focus:border-brand-primary focus:ring-brand-primary focus:ring-1"
          aria-label={`Editar nome do item ${item.name}`}
        />
        
        {/* Quantidade e Unidade (Editáveis) */}
        <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
          <input
            type="number"
            value={item.quantity}
            onChange={handleQuantityChange}
            min="0.1"
            step="any"
            className="w-16 p-1 border border-gray-200 rounded-md focus:border-brand-primary focus:ring-brand-primary focus:ring-1 text-center"
            aria-label={`Editar quantidade de ${item.name}`}
          />
          <select
            value={item.unit}
            onChange={handleUnitChange}
            className="p-1 border border-gray-200 rounded-md focus:border-brand-primary focus:ring-brand-primary focus:ring-1 bg-white"
            aria-label={`Editar unidade de ${item.name}`}
          >
            {Object.entries(UNITS).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
        
        {/* Categoria (Editável) */}
        <div className="mt-1">
            <select
                value={item.category}
                onChange={handleCategoryChange}
                className="text-xs text-gray-600 italic p-1 border border-gray-200 rounded-md focus:border-brand-primary focus:ring-brand-primary focus:ring-1 bg-white w-full max-w-xs"
                aria-label={`Editar categoria de ${item.name}`}
            >
                {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
        </div>
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