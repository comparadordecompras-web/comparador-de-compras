import React, { useState, useCallback } from 'react';
import { ShoppingItem, Unit, Supermarket } from '../types';
import { SUPERMARKETS, UNITS, CATEGORIES } from '../constants';
import { Scan } from 'lucide-react';
import BarcodeScannerModal from './BarcodeScannerModal';
import { useProducts } from '../hooks/useProducts'; // Use the new hook
import { showSuccess, showError, showLoading } from '../utils/toast';

interface AddItemFormProps {
  onAddItem: (item: Omit<ShoppingItem, 'id'>) => void;
  onBarcodeNotFound: (barcode: string) => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem, onBarcodeNotFound }) => {
  const { findProductByBarcode } = useProducts(); // Use findProductByBarcode from useProducts
  
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState<Unit>('un');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [prices, setPrices] = useState({ iquegami: '', proenca: '', max: '' });
  const [barcode, setBarcode] = useState<string | undefined>(undefined);
  const [error, setError] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const resetForm = useCallback(() => {
    setName('');
    setQuantity(1);
    setUnit('un');
    setCategory(CATEGORIES[0]);
    setPrices({ iquegami: '', proenca: '', max: '' });
    setBarcode(undefined);
    setError('');
  }, []);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPrices(prev => ({ ...prev, [name]: value }));
  };

  const handleScanSuccess = useCallback(async (decodedText: string) => {
    setIsScannerOpen(false);
    setError('');
    
    const toastId = showLoading('Buscando produto cadastrado...');

    try {
      const product = await findProductByBarcode(decodedText);

      if (product) {
        // Product found: pre-fill form
        setName(product.name);
        setQuantity(1); // Always reset quantity to 1 for a new item
        setUnit(product.unit);
        setCategory(product.category);
        setBarcode(decodedText);
        
        // Convert prices back to string format for input fields
        setPrices({
          iquegami: product.prices.iquegami > 0 ? String(product.prices.iquegami) : '',
          proenca: product.prices.proenca > 0 ? String(product.prices.proenca) : '',
          max: product.prices.max > 0 ? String(product.prices.max) : '',
        });
        
        showSuccess(`Produto "${product.name}" encontrado e preenchido!`, toastId);
      } else {
        // Product not found: redirect to registration page
        showError('Produto não encontrado. Redirecionando para cadastro...', toastId);
        
        // Wait a moment before redirecting to allow the toast to show
        await new Promise(resolve => setTimeout(resolve, 500));
        onBarcodeNotFound(decodedText);
      }
    } catch (e) {
      showError('Erro ao buscar produto.', toastId);
      console.error(e);
    }
  }, [findProductByBarcode, onBarcodeNotFound]);

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
      barcode, // Include barcode in the item being added
    });

    // Reset form
    resetForm();
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-brand-dark">Adicionar Novo Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          {/* Item Name and Scanner Button */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Item</label>
            <div className="flex space-x-2 mt-1">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Arroz 5kg"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
              />
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center justify-center p-2 bg-brand-secondary text-white rounded-md shadow-sm hover:bg-green-600 transition-colors"
                aria-label="Escanear código de barras"
              >
                <Scan className="w-5 h-5" />
              </button>
            </div>
            {barcode && (
              <p className="text-xs text-gray-500 mt-1">
                Código de Barras: {barcode} 
                <button type="button" onClick={() => setBarcode(undefined)} className="ml-2 text-red-500 hover:text-red-700">(Limpar)</button>
              </p>
            )}
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
      
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </>
  );
};

export default AddItemForm;