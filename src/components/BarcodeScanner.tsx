import React, { useState, useCallback } from 'react';
import { Scan, Search } from 'lucide-react';
import { fetchProductByBarcode } from '../utils/productLookup';
import { ProductData, ShoppingItem } from '../types';
import { showLoading, showSuccess, showError, dismissToast } from '../utils/toast';

interface BarcodeScannerProps {
  onProductFound: (product: Omit<ShoppingItem, 'id' | 'quantity'> & { quantity: 1 }) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onProductFound }) => {
  const [barcode, setBarcode] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedBarcode = barcode.trim();

    if (!trimmedBarcode) {
      showError('Por favor, insira um código de barras.');
      return;
    }

    setIsScanning(true);
    const toastId = showLoading(`Buscando produto para o código ${trimmedBarcode}...`);

    try {
      const productData = await fetchProductByBarcode(trimmedBarcode);

      if (productData) {
        dismissToast(toastId);
        showSuccess(`Produto encontrado: ${productData.name}`);
        
        // Adiciona o produto à lista com quantidade 1
        onProductFound({
          name: productData.name,
          quantity: 1,
          unit: productData.unit,
          category: productData.category,
          prices: productData.prices,
        });
        setBarcode(''); // Limpa o campo após sucesso
      } else {
        dismissToast(toastId);
        showError(`Produto não encontrado para o código ${trimmedBarcode}.`);
      }
    } catch (error) {
      dismissToast(toastId);
      showError('Erro ao buscar produto. Tente novamente.');
      console.error(error);
    } finally {
      setIsScanning(false);
    }
  }, [barcode, onProductFound]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-brand-secondary">
      <h2 className="text-xl font-bold mb-4 text-brand-dark flex items-center">
        <Scan className="w-5 h-5 mr-2 text-brand-secondary" />
        Leitor de Código de Barras
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Simule a leitura de um código para adicionar produtos pré-cadastrados rapidamente.
      </p>
      <form onSubmit={handleScan} className="flex space-x-2">
        <input
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Digite o código de barras (Ex: 7891000100100)"
          className="flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"
          disabled={isScanning}
        />
        <button
          type="submit"
          disabled={isScanning}
          className="bg-brand-secondary text-white p-3 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-colors disabled:bg-gray-300"
          aria-label="Buscar produto"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default BarcodeScanner;