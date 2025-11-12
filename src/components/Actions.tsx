import React, { useCallback } from 'react';
import { ShoppingItem } from '../types';
import { usePdfExport } from '../hooks/usePdfExport';
import { useMonthlyLists } from '../hooks/useMonthlyLists';
import { showError } from '../utils/toast';

interface ActionsProps {
  items: ShoppingItem[];
  onClearList: () => void;
  totalOptimized: number;
}

const Actions: React.FC<ActionsProps> = ({ items, onClearList, totalOptimized }) => {
  const { exportToPdf } = usePdfExport('shopping-list-container');
  const { saveList } = useMonthlyLists();

  const canPerformActions = items.length > 0;

  const handleSaveList = useCallback(() => {
    if (!canPerformActions) {
      showError('A lista está vazia.');
      return;
    }

    const defaultName = `Lista Mensal - ${new Date().toLocaleDateString('pt-BR')}`;
    const listName = prompt('Digite um nome para esta lista mensal:', defaultName);

    if (listName && listName.trim()) {
      saveList(listName.trim(), items, totalOptimized);
    } else if (listName !== null) {
      showError('O nome da lista não pode ser vazio.');
    }
  }, [canPerformActions, items, totalOptimized, saveList]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-brand-dark">Ações</h2>
      <div className="flex flex-col space-y-3">
        <button
          onClick={handleSaveList}
          disabled={!canPerformActions}
          className="w-full bg-brand-secondary text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Salvar Lista Mensal
        </button>
        <button
          onClick={exportToPdf}
          disabled={!canPerformActions}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
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