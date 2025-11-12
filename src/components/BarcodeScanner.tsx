import React, { useState, useCallback } from 'react';
import { Scan, Search, CameraOff } from 'lucide-react';
import { lookupProductByBarcode } from '../utils/productLookup';
import { ShoppingItem } from '../types';
import { showLoading, showSuccess, showError, dismissToast } from '../utils/toast';
import CameraScanner from './CameraScanner';

interface BarcodeScannerProps {
  onProductFound: (product: Omit<ShoppingItem, 'id' | 'quantity'> & { quantity: 1 }) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onProductFound }) => {
  const [barcode, setBarcode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const processBarcode = useCallback((code: string) => {
    const trimmedBarcode = code.trim();
    if (!trimmedBarcode) return;

    const toastId = showLoading(`Buscando produto para o código ${trimmedBarcode}...`);

    // Simulação de busca de produto
    const productData = lookupProductByBarcode(trimmedBarcode);

    dismissToast(toastId);

    if (productData) {
      showSuccess(`Produto encontrado: ${productData.name}`);
      
      onProductFound({
        name: productData.name,
        quantity: 1,
        unit: productData.unit,
        category: productData.category,
        prices: productData.prices,
      });
      setBarcode(''); // Limpa o campo
    } else {
      showError(`Produto não encontrado para o código ${trimmedBarcode}.`);
    }
  }, [onProductFound]);

  const handleManualSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    processBarcode(barcode);
    setIsSearching(false);
  }, [barcode, processBarcode]);

  const handleScanSuccess = useCallback((decodedText: string) => {
    setIsCameraActive(false); // Desativa a câmera após o sucesso
    processBarcode(decodedText);
  }, [processBarcode]);

  const handleScanError = useCallback((errorMessage: string) => {
    // Apenas logamos erros de câmera, mas não interrompemos a UI
    console.error("Camera scan error:", errorMessage);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-brand-secondary">
      <h2 className="text-xl font-bold mb-4 text-brand-dark flex items-center">
        <Scan className="w-5 h-5 mr-2 text-brand-secondary" />
        Adicionar por Código de Barras
      </h2>

      {/* Botão de Ativar/Desativar Câmera */}
      <button
        onClick={() => setIsCameraActive(prev => !prev)}
        className={`w-full flex items-center justify-center py-2 px-4 rounded-md shadow-sm transition-colors mb-4 ${
          isCameraActive
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-brand-secondary text-white hover:bg-green-600'
        }`}
      >
        {isCameraActive ? (
          <>
            <CameraOff className="w-5 h-5 mr-2" />
            Parar Câmera
          </>
        ) : (
          <>
            <Scan className="w-5 h-5 mr-2" />
            {window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia ? 'Ativar Leitor (Câmera)' : 'Ativar Leitor (Simulação)'}
          </>
        )}
      </button>

      {/* Visualização da Câmera */}
      {isCameraActive && (
        <CameraScanner 
          onScanSuccess={handleScanSuccess} 
          onScanError={handleScanError} 
        />
      )}

      {/* Entrada Manual (Fallback) */}
      <div className="mt-6 border-t pt-4 border-gray-100">
        <p className="text-sm text-gray-600 mb-3 font-medium">
          Ou digite o código manualmente:
        </p>
        <form onSubmit={handleManualSearch} className="flex space-x-2">
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Ex: 7891000100100"
            className="flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"
            disabled={isSearching || isCameraActive}
          />
          <button
            type="submit"
            disabled={isSearching || isCameraActive}
            className="bg-gray-400 text-white p-3 rounded-md shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors disabled:bg-gray-300"
            aria-label="Buscar produto"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default BarcodeScanner;