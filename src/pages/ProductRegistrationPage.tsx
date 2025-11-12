import React, { useState, useCallback } from 'react';
import { ShoppingItem, Unit, Supermarket } from '../types';
import { SUPERMARKETS, UNITS, CATEGORIES } from '../constants';
import { Barcode, Save, X } from 'lucide-react';
import { showSuccess, showError } from '../utils/toast';
import { useProducts } from '../hooks/useProducts';

interface ProductRegistrationPageProps {
  onAddItem: (item: Omit<ShoppingItem, 'id'>) => void;
  onCancel: () => void;
  initialBarcode?: string;
}

const ProductRegistrationPage: React.FC<ProductRegistrationPageProps> = ({ onAddItem, onCancel, initialBarcode }) => {
  const { addProduct } = useProducts();
  
  const [name, setName] = useState('');
  const [unit, setUnit] = useState<Unit>('un');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [prices, setPrices] = useState({ iquegami: '', proenca: '', max: '' });
  const [barcode, setBarcode] = useState<string | undefined>(initialBarcode);
  const [error, setError] = useState('');

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPrices(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('O nome do item é obrigatório.');
      return;
    }
    if (!barcode) {
        setError('O código de barras é obrigatório para o cadastro de produto.');
        return;
    }
    
    setError('');

    const productData = {
      barcode,
      name,
      unit,
      category,
      prices: {
        iquegami: parseFloat(prices.iquegami) || 0,
        proenca: parseFloat(prices.proenca) || 0,
        max: parseFloat(prices.max) || 0,
      },
    };

    // 1. Save product to the catalog (products table)
    const savedProduct = await addProduct(productData);

    if (savedProduct) {
        // 2. Add the item to the current shopping list (shopping_items table)
        onAddItem({
            name: savedProduct.name,
            quantity: 1, // Default quantity for registration
            unit: savedProduct.unit,
            category: savedProduct.category,
            prices: savedProduct.prices,
            barcode: savedProduct.barcode,
        });
        
        // Success message is handled inside addProduct, just navigate back
        onCancel(); // Go back to the list view
    }
    // If savedProduct is null, addProduct already showed an error (e.g., barcode conflict)
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-brand-dark flex items-center">
          <Barcode className="w-6 h-6 mr-2 text-brand-primary" />
          Cadastro Rápido de Produto
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full"
          aria-label="Cancelar e voltar"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-500 text-sm p-3 bg-red-50 border border-red-200 rounded-md">{error}</p>}
        
        {/* Barcode Display */}
        <div className="p-3 bg-gray-100 rounded-md">
            <label className="block text-sm font-medium text-gray-700 mb-1">Código de Barras</label>
            <div className="flex items-center justify-between">
                <p className="font-mono text-lg text-brand-dark break-all">{barcode || 'Nenhum código escaneado'}</p>
                {barcode && (
                    <button type="button" onClick={() => setBarcode(undefined)} className="ml-4 text-red-500 hover:text-red-700 text-sm font-medium">
                        (Limpar)
                    </button>
                )}
            </div>
        </div>

        {/* Item Details */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Produto *</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Leite Integral 1L"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unidade *</label>
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
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria *</label>
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
        </div>

        {/* Prices */}
        <div className="space-y-2 pt-2">
          <h3 className="text-md font-medium text-gray-800 border-t pt-4">Preços Unitários (R$)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>

        <button
          type="submit"
          className="w-full bg-brand-secondary text-white py-3 px-4 rounded-md shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-colors flex items-center justify-center space-x-2 font-semibold"
        >
          <Save className="w-5 h-5" />
          <span>Cadastrar Produto e Adicionar à Lista</span>
        </button>
      </form>
    </div>
  );
};

export default ProductRegistrationPage;