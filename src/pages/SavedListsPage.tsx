import React, { useState, useCallback } from 'react';
import { useMonthlyLists } from '../hooks/useMonthlyLists';
import { ListChecks, Calendar, DollarSign, Trash2, Eye, Download } from 'lucide-react';
import ListDetailsModal from '../components/ListDetailsModal';
import { ShoppingItem } from '../types';

interface MonthlyList {
  id: string;
  name: string;
  total_optimized: number;
  items: ShoppingItem[];
  created_at: string;
}

interface SavedListsPageProps {
  onImportList: (listName: string, items: ShoppingItem[]) => void;
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const SavedListsPage: React.FC<SavedListsPageProps> = ({ onImportList }) => {
  const { savedLists, isLoading, removeList } = useMonthlyLists();
  const [selectedList, setSelectedList] = useState<MonthlyList | null>(null);

  const handleDelete = useCallback((listId: string, listName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a lista "${listName}"? Esta ação é irreversível.`)) {
      removeList(listId, listName);
    }
  }, [removeList]);

  const handleImport = useCallback((list: MonthlyList) => {
    onImportList(list.name, list.items);
  }, [onImportList]);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center py-16">
        <p className="text-lg text-brand-primary">Carregando listas salvas...</p>
      </div>
    );
  }

  if (savedLists.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center py-16">
        <h2 className="text-2xl font-bold text-brand-dark mb-4">Listas Mensais Salvas</h2>
        <p className="text-gray-500">Você ainda não salvou nenhuma lista mensal.</p>
        <p className="text-gray-400 mt-2">Salve sua lista atual na aba "Lista de Compras" para começar a registrar seu histórico.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-brand-dark flex items-center">
        <Calendar className="w-7 h-7 mr-3 text-brand-primary" />
        Histórico de Listas Mensais
      </h2>
      <p className="text-gray-600">Visualize e compare suas listas de compras salvas ao longo do tempo.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savedLists.map(list => (
          <div key={list.id} className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-brand-primary">{list.name}</h3>
              <span className="text-sm text-gray-500 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(list.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded-md">
                <span className="font-medium text-brand-primary flex items-center">
                  <DollarSign className="w-5 h-5 mr-1" />
                  Custo Otimizado
                </span>
                <span className="text-xl font-bold text-brand-primary">
                  {formatCurrency(list.total_optimized)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                <span className="text-gray-700 flex items-center">
                  <ListChecks className="w-5 h-5 mr-1" />
                  Total de Itens
                </span>
                <span className="font-semibold text-gray-900">
                  {list.items.length}
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-3">
              <button
                className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors flex items-center"
                onClick={() => handleImport(list)}
              >
                <Download className="w-4 h-4 mr-1" />
                Importar
              </button>
              <button
                className="text-sm text-red-600 hover:text-red-800 flex items-center transition-colors"
                onClick={() => handleDelete(list.id, list.name)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Excluir
              </button>
              <button
                className="text-sm bg-brand-secondary text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors flex items-center"
                onClick={() => setSelectedList(list)}
              >
                <Eye className="w-4 h-4 mr-1" />
                Ver Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <ListDetailsModal 
        list={selectedList} 
        onClose={() => setSelectedList(null)} 
        onImportList={handleImport} // Passando a função de importação para o modal também
      />
    </div>
  );
};

export default SavedListsPage;