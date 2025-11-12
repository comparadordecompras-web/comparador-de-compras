import React, { useEffect, useRef, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Scan } from 'lucide-react';
import { showError } from '../utils/toast';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

const qrcodeRegionId = "qrcode-reader";

const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ isOpen, onClose, onScanSuccess }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const handleScanSuccess = useCallback((decodedText: string) => {
    onScanSuccess(decodedText);
    onClose();
  }, [onScanSuccess, onClose]);

  const handleScanError = useCallback((errorMessage: string) => {
    // console.warn(`Barcode Scan Error: ${errorMessage}`);
    // We suppress minor errors to avoid spamming the user, but log major ones.
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Ensure previous scanner is stopped if it exists
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error("Failed to clear previous scanner:", e));
      }

      // Initialize scanner
      const html5QrcodeScanner = new Html5QrcodeScanner(
        qrcodeRegionId,
        { 
          fps: 10, 
          qrbox: { width: 250, height: 150 },
          disableFlip: false,
        },
        /* verbose= */ false
      );

      scannerRef.current = html5QrcodeScanner;

      // Start scanning
      html5QrcodeScanner.render(handleScanSuccess, handleScanError);
      
      // Cleanup function
      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear().catch(e => console.error("Failed to clear scanner on unmount:", e));
        }
      };
    } else {
      // Stop scanner when modal closes
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error("Failed to clear scanner on close:", e));
        scannerRef.current = null;
      }
    }
  }, [isOpen, handleScanSuccess, handleScanError]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-lg rounded-lg shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-brand-primary text-white">
          <h2 className="text-xl font-bold flex items-center">
            <Scan className="w-5 h-5 mr-2" />
            Escanear Código de Barras
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scanner Area */}
        <div className="p-6 flex flex-col items-center">
          <p className="text-sm text-gray-600 mb-4 text-center">
            Aponte a câmera para o código de barras do produto.
          </p>
          <div id={qrcodeRegionId} className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
            {/* html5-qrcode injects the video stream here */}
          </div>
          <p className="text-xs text-red-500 mt-4">
            Se a câmera não iniciar, verifique as permissões do navegador.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerModal;