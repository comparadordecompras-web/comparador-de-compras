
import React, { useState, useMemo, useCallback } from 'react';
import { ShoppingItem, Supermarket } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import AddItemForm from './components/AddItemForm';
import ShoppingList from './components/ShoppingList';
import Totals from './components/Totals';
import Actions from './components/Actions';
import MapSection from './components/MapSection';
import { SUPERMARKETS } from './constants';

const App: React.FC = () => {
  const [items, setItems] = useLocalStorage<ShoppingItem[]>('shoppingList', []);

  const handleAddItem = useCallback((item: Omit<ShoppingItem, 'id'>) => {
    setItems(prevItems => [...prevItems, { ...item, id: crypto.randomUUID() }]);
  }, [setItems]);

  const handleRemoveItem = useCallback((id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  }, [setItems]);
  
  const handleUpdateItem = useCallback((updatedItem: ShoppingItem) => {
    setItems(prevItems => prevItems.map(item => item.id === updatedItem.id ? updatedItem : item));
  }, [setItems]);

  const handleClearList = useCallback(() => {
    if (window.confirm('Tem certeza que deseja limpar a lista inteira?')) {
      setItems([]);
    }
  }, [setItems]);

  const totals = useMemo(() => {
    const initialTotals = Object.keys(SUPERMARKETS).reduce((acc, key) => {
      acc[key as Supermarket] = 0;
      return acc;
    }, {} as Record<Supermarket, number>);

    const marketTotals = items.reduce((acc, item) => {
      acc.iquegami += (item.prices.iquegami || 0) * item.quantity;
      acc.proenca += (item.prices.proenca || 0) * item.quantity;
      acc.max += (item.prices.max || 0) * item.quantity;
      return acc;
    }, initialTotals);

    const optimizedTotal = items.reduce((sum, item) => {
      const validPrices = Object.values(item.prices).filter(p => p > 0);
      const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
      return sum + minPrice * item.quantity;
    }, 0);

    return { ...marketTotals, optimized: optimizedTotal };
  }, [items]);

  return (
    <div className="min-h-screen bg-gray-50 text-brand-dark">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ShoppingList 
              items={items} 
              onRemoveItem={handleRemoveItem}
              onUpdateItem={handleUpdateItem} 
            />
             {items.length === 0 && (
                <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500">Sua lista de compras está vazia.</p>
                    <p className="text-gray-400 mt-2">Use o formulário para adicionar seu primeiro item!</p>
                </div>
            )}
          </div>
          <div className="space-y-8">
            <AddItemForm onAddItem={handleAddItem} />
            {items.length > 0 && <Totals totals={totals} />}
            <Actions items={items} onClearList={handleClearList} />
            <MapSection />
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Comparador de Compras Olímpia. Feito para facilitar suas compras.</p>
      </footer>
    </div>
  );
};

export default App;
