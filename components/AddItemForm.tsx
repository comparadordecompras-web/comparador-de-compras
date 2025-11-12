
import React, { useState } from 'react';
import { ShoppingItem, Unit } from '../types';
import { SUPERMARKETS, UNITS, CATEGORIES } from '../constants';

interface AddItemFormProps {
  onAddItem: (item: Omit<ShoppingItem, 'id'>) => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<Unit>('un');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [prices, setPrices] = useState({ iquegami: '', proenca: '', max: '' });
  const [error, setError] = useState('');

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPrices(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('O nome do item é obrigatório.');
      return;
    }
    if (quantity <= 0) {
      setError('A quantidade deve ser maior que zero.');
      return;
    }
    
    setError('');

    onAddItem({
      name,
      quantity,
      unit,
      category,
      prices: {
        iquegami: parseFloat(prices.iquegami) || 0,
        proenca: parseFloat(prices.proenca) || 0,
        max: parseFloat(prices.max) || 0,
      },
    });

    // Reset form
    setName('');
    setQuantity(1);
    setUnit('un');
    setCategory(CATEGORIES[0]);
    setPrices({ iquegami: '', proenca: '', max: '' });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-brand-dark">Adicionar Novo Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Item</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Arroz 5kg"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantidade</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value))}
              min="0.1"
              step="any"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unidade</label>
            <select
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value as Unit)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary bg-white"
            >
              {Object.entries(UNITS).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
        </div>

        <div className="space-y-2 pt-2">
          <h3 className="text-md font-medium text-gray-800">Preços (R$)</h3>
          {Object.entries(SUPERMARKETS).map(([key, value]) => (
            <div key={key}>
              <label htmlFor={key} className="block text-sm font-medium text-gray-700">{value}</label>
              <input
                type="number"
                id={key}
                name={key}
                value={prices[key as keyof typeof prices]}
                onChange={handlePriceChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-brand-primary text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
        >
          Adicionar à Lista
        </button>
      </form>
    </div>
  );
};

export default AddItemForm;
