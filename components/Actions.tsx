
import React from 'react';
import { ShoppingItem } from '../types';
import { SUPERMARKETS } from '../constants';

interface ActionsProps {
  items: ShoppingItem[];
  onClearList: () => void;
}

const Actions: React.FC<ActionsProps> = ({ items, onClearList }) => {
  const exportToCSV = () => {
    if (items.length === 0) {
      alert('A lista está vazia. Adicione itens antes de exportar.');
      return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = ['Item', 'Quantidade', 'Unidade', 'Categoria', `Preço ${SUPERMARKETS.iquegami}`, `Preço ${SUPERMARKETS.proenca}`, `Preço ${SUPERMARKETS.max}`].join(',');
    csvContent += headers + '\r\n';

    items.forEach(item => {
      const row = [
        `"${item.name}"`,
        item.quantity,
        item.unit,
        `"${item.category}"`,
        item.prices.iquegami,
        item.prices.proenca,
        item.prices.max
      ].join(',');
      csvContent += row + '\r\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'lista_de_compras.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const canPerformActions = items.length > 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-brand-dark">Ações</h2>
      <div className="flex flex-col space-y-3">
        <button
          onClick={exportToCSV}
          disabled={!canPerformActions}
          className="w-full bg-brand-secondary text-white py-2 px-4 rounded-md shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Exportar para CSV
        </button>
        <button
          onClick={onClearList}
          disabled={!canPerformActions}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Limpar Lista
        </button>
      </div>
    </div>
  );
};

export default Actions;
