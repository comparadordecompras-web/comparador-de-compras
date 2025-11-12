export type Supermarket = 'iquegami' | 'proenca' | 'max';

export type Unit = 'un' | 'kg' | 'L' | 'g' | 'ml' | 'dz';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: Unit;
  category: string;
  prices: Record<Supermarket, number>;
  barcode?: string; // Novo campo
}

export interface ProductData {
  name: string;
  unit: Unit;
  category: string;
  prices: Record<Supermarket, number>;
  barcode?: string; // Novo campo
}

export type AppView = 'list' | 'analysis' | 'about' | 'saved_lists';

export type SortKey = 'none' | 'name' | 'category';

export type SortDirection = 'asc' | 'desc';