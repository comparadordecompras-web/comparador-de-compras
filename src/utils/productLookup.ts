import { ProductData, Unit } from '../types';
import { CATEGORIES } from '../constants';

// Simulação de um banco de dados de produtos
export const MOCK_PRODUCTS: Record<string, ProductData> = {
  "7891000100100": {
    name: "Arroz Branco Tipo 1 (5kg)",
    unit: 'un' as Unit,
    category: CATEGORIES[0], // Alimentos Básicos
    prices: { iquegami: 25.99, proenca: 24.50, max: 23.90 },
  },
  "7891991010010": {
    name: "Leite Integral (1L)",
    unit: 'L' as Unit,
    category: CATEGORIES[3], // Frios e Laticínios
    prices: { iquegami: 4.89, proenca: 4.99, max: 4.75 },
  },
  "7896000000010": {
    name: "Sabão em Pó (1kg)",
    unit: 'kg' as Unit,
    category: CATEGORIES[6], // Limpeza
    prices: { iquegami: 12.50, proenca: 11.99, max: 13.00 },
  },
};

/**
 * Função utilitária para buscar dados de um produto por código de barras (simulado).
 * @param barcode O código de barras a ser procurado.
 * @returns ProductData ou null.
 */
export function lookupProductByBarcode(barcode: string): ProductData | null {
  return MOCK_PRODUCTS[barcode] || null;
}