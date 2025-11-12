import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { showError } from '../utils/toast';

interface CameraScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError: (errorMessage: string) => void;
}

const qrcodeRegionId = "qrcode-reader";

const CameraScanner: React.FC<CameraScannerProps> = ({ onScanSuccess, onScanError }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Configuração do scanner
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      disableFlip: false,
    };

    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      config,
      /* verbose= */ false
    );
    scannerRef.current = html5QrcodeScanner;

    const handleSuccess = (decodedText: string) => {
      // Parar o scanner imediatamente após o sucesso
      html5QrcodeScanner.clear().catch(error => {
        console.error("Failed to clear scanner:", error);
      });
      onScanSuccess(decodedText);
    };

    const handleError = (errorMessage: string) => {
      // console.warn(`QR Code Scan Error: ${errorMessage}`);
      // Não mostramos o erro no toast, pois ele é contínuo durante a leitura
    };

    // Iniciar o scanner
    html5QrcodeScanner.render(handleSuccess, handleError);

    // Cleanup function
    return () => {
      html5QrcodeScanner.clear().catch(error => {
        // Ignorar erros ao tentar limpar um scanner que já foi limpo
      });
    };
  }, [onScanSuccess]);

  return (
    <div className="mt-4">
      <div id={qrcodeRegionId} className="w-full h-64 border border-gray-300 rounded-lg overflow-hidden">
        {/* O scanner será renderizado aqui */}
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Aponte a câmera para o código de barras.
      </p>
    </div>
  );
};

export default CameraScanner;