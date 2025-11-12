import React, { useState, useCallback, useEffect } from 'react';
import { Unit, Supermarket, Product } from '../types';
import { SUPERMARKETS, UNITS, CATEGORIES } from '../constants';
import { Save, X, Package, Barcode } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { showError } from '../utils/toast';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: (product: Product) => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onProductAdded }) => {
  const { addProduct } = useProducts();
  
  const [name, setName] = useState('');
  const [unit, setUnit] = useState<Unit>('un');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [prices, setPrices] = useState({ iquegami: '', proenca: '', max: '' });
  const [barcode, setBarcode] = useState('');
  const [error, setError] = useState('');

  const resetForm = useCallback(() => {
    setName('');
    setUnit('un');
    setCategory(CATEGORIES[0]);
    setPrices({ iquegami: '', proenca: '', max: '' });
    setBarcode('');
    setError('');
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPrices(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('O nome do produto é obrigatório.');
      return;
    }
    if (!barcode.trim()) {
        setError('O código de barras é obrigatório.');
        return;
    }
    
    setError('');

    const productData = {
      barcode: barcode.trim(),
      name: name.trim(),
      unit,
      category,
      prices: {
        iquegami: parseFloat(prices.iquegami) || 0,
        proenca: parseFloat(prices.proenca) || 0,
        max: parseFloat(prices.max) || 0,
      },
    };

    const savedProduct = await addProduct(productData);

    if (savedProduct) {
        onProductAdded(savedProduct);
        onClose();
    }
    // Error handling is done inside addProduct hook
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-lg shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-brand-primary text-white">
          <h2 className="text-xl font-bold flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Cadastrar Novo Produto
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm p-3 bg-red-50 border border-red-200 rounded-md">{error}</p>}
            
            {/* Barcode Input */}
            <div>
                <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">Código de Barras *</label>
                <div className="flex items-center mt-1">
                    <Barcode className="w-5 h-5 text-gray-400 mr-2" />
                    <input
                        type="text"
                        id="barcode"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        placeholder="Digite o código de barras (EAN)"
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                    />
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
              <span>Cadastrar Produto no Catálogo</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;