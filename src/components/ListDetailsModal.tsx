import React from 'react';
import { ShoppingItem, Supermarket } from '../types';
import { SUPERMARKETS } from '../constants';
import { X, DollarSign, Download } from 'lucide-react';

interface MonthlyList {
  id: string;
  name: string;
  total_optimized: number;
  items: ShoppingItem[];
  created_at: string;
}

interface ListDetailsModalProps {
  list: MonthlyList | null;
  onClose: () => void;
  onImportList: (list: MonthlyList) => void;
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const ListDetailsModal: React.FC<ListDetailsModalProps> = ({ list, onClose, onImportList }) => {
  if (!list) return null;

  const handleImportClick = () => {
    onImportList(list);
    onClose(); // Close modal after initiating import
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-lg shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-brand-primary">
            Detalhes: {list.name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Summary and Action */}
        <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
            <div className="flex flex-col">
                <div className="flex items-center p-3 bg-blue-100 rounded-md">
                    <span className="font-medium text-brand-primary flex items-center">
                        <DollarSign className="w-5 h-5 mr-2" />
                        Custo Otimizado Total
                    </span>
                    <span className="text-2xl font-bold text-brand-primary ml-4">
                        {formatCurrency(list.total_optimized)}
                    </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    Salva em: {new Date(list.created_at).toLocaleDateString('pt-BR')} | Total de {list.items.length} itens.
                </p>
            </div>
            
            <button
                className="flex items-center bg-brand-secondary text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm font-medium shadow-md"
                onClick={handleImportClick}
            >
                <Download className="w-4 h-4 mr-2" />
                Importar para Lista Atual
            </button>
        </div>

        {/* List Content (Scrollable) */}
        <div className="overflow-y-auto flex-grow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                {Object.values(SUPERMARKETS).map(name => (
                  <th key={name} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {name}
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Custo Otimizado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {list.items.map((item, index) => {
                const validPrices = (Object.values(item.prices) as number[]).filter(p => p > 0);
                const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
                const optimizedCost = minPrice * item.quantity;
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                      <span className="block text-xs text-gray-500 font-normal">
                        {item.quantity} {item.unit} ({item.category})
                      </span>
                    </td>
                    {Object.keys(SUPERMARKETS).map(marketKey => {
                      const price = item.prices[marketKey as Supermarket];
                      const isCheapest = price > 0 && price === minPrice;
                      const totalMarketCost = price * item.quantity;

                      return (
                        <td 
                          key={marketKey} 
                          className={`px-4 py-3 whitespace-nowrap text-sm text-center ${isCheapest ? 'bg-green-50 font-semibold text-green-800' : 'text-gray-700'}`}
                        >
                          {price > 0 ? formatCurrency(totalMarketCost) : '-'}
                          <span className="block text-xs text-gray-400">({formatCurrency(price)} / {item.unit})</span>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center font-bold text-brand-primary">
                        {formatCurrency(optimizedCost)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListDetailsModal;