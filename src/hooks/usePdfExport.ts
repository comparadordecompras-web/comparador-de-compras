import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useCallback } from 'react';
import { showLoading, showSuccess, showError, dismissToast } from '../utils/toast';

/**
 * Hook para exportar um elemento HTML específico para PDF.
 * @param elementId O ID do elemento HTML que deve ser capturado (e.g., o container da lista).
 * @param filename O nome do arquivo PDF.
 * @returns Uma função de callback para iniciar a exportação.
 */
export function usePdfExport(elementId: string, filename: string = 'lista_de_compras.pdf') {
  
  const exportToPdf = useCallback(async () => {
    const input = document.getElementById(elementId);
    if (!input) {
      showError('Erro: Elemento da lista não encontrado para exportação.');
      return;
    }

    const toastId = showLoading('Gerando PDF...');

    try {
      // 1. Capturar o elemento HTML como uma imagem (canvas)
      const canvas = await html2canvas(input, {
        scale: 2, // Aumenta a escala para melhor qualidade
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // 2. Adicionar a imagem ao PDF, tratando múltiplas páginas
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // 3. Salvar o PDF
      pdf.save(filename);
      
      dismissToast(toastId);
      showSuccess('PDF gerado com sucesso!');

    } catch (error) {
      dismissToast(toastId);
      console.error('Erro ao gerar PDF:', error);
      showError('Falha ao gerar PDF. Tente novamente.');
    }
  }, [elementId, filename]);

  return { exportToPdf };
}