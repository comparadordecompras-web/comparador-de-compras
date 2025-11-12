
import { Supermarket, Unit } from './types';

export const SUPERMARKETS: Record<Supermarket, string> = {
  iquegami: 'Iquegami',
  proenca: 'Proença',
  max: 'Max',
};

export const UNITS: Record<Unit, string> = {
  un: 'Unidade(s)',
  kg: 'Quilograma(s)',
  g: 'Grama(s)',
  L: 'Litro(s)',
  ml: 'Mililitro(s)',
  dz: 'Dúzia(s)',
};

export const CATEGORIES: string[] = [
  'Alimentos Básicos',
  'Hortifruti',
  'Carnes e Peixes',
  'Frios e Laticínios',
  'Bebidas',
  'Higiene Pessoal',
  'Limpeza',
  'Padaria',
  'Congelados',
  'Outros',
];
