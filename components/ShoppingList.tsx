
import React from 'react';
import { ShoppingItem } from '../types';
import ShoppingListItem from './ShoppingListItem';
import { SUPERMARKETS } from '../constants';

interface ShoppingListProps {
  items: ShoppingItem[];
  onRemoveItem: (id: string) => void;
  onUpdateItem: (item: ShoppingItem) => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ items, onRemoveItem, onUpdateItem }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-brand-dark">Sua Lista de Compras</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              {Object.values(SUPERMARKETS).map(name => (
                <th key={name} scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {name}
                  <span className="block font-normal normal-case text-gray-400">(Preço Unitário)</span>
                </th>
              ))}
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Remover</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map(item => (
              <ShoppingListItem
                key={item.id}
                item={item}
                onRemove={onRemoveItem}
                onUpdate={onUpdateItem}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShoppingList;
