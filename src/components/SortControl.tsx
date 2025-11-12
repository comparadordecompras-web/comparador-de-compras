import React from 'react';
import { SortKey, SortDirection } from '../types';
import { ArrowDownUp, SortAsc, SortDesc } from 'lucide-react';

interface SortControlProps {
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSortChange: (key: SortKey) => void;
}

const SortControl: React.FC<SortControlProps> = ({ sortKey, sortDirection, onSortChange }) => {
  const handleSortClick = (key: SortKey) => {
    onSortChange(key);
  };

  const getButtonClass = (key: SortKey) => {
    return `flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      sortKey === key
        ? 'bg-brand-primary text-white hover:bg-blue-700'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;
  };

  const renderIcon = (key: SortKey) => {
    if (sortKey === key) {
      return sortDirection === 'asc' ? <SortAsc className="w-4 h-4 ml-1" /> : <SortDesc className="w-4 h-4 ml-1" />;
    }
    return <ArrowDownUp className="w-4 h-4 ml-1 text-gray-500" />;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-brand-dark">Organizar Lista</h2>
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={() => handleSortClick('name')}
          className={getButtonClass('name')}
        >
          Nome
          {renderIcon('name')}
        </button>
        <button
          type="button"
          onClick={() => handleSortClick('category')}
          className={getButtonClass('category')}
        >
          Categoria
          {renderIcon('category')}
        </button>
      </div>
    </div>
  );
};

export default SortControl;