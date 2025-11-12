import React from 'react';
import { ShoppingItem } from '../types';
import { usePdfExport } from '../hooks/usePdfExport';

interface ActionsProps {
  items: ShoppingItem[];
  onClearList: () => void;
}

const Actions: React.FC<ActionsProps> = ({ items, onClearList }) => {
  // Usamos o hook para exportar o elemento com ID 'shopping-list-container'
  const { exportToPdf } = usePdfExport('shopping-list-container');

  const canPerformActions = items.length > 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-brand-dark">Ações</h2>
      <div className="flex flex-col space-y-3">
        <button
          onClick={exportToPdf}
          disabled={!canPerformActions}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Exportar para PDF
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