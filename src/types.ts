export type Supermarket = 'iquegami' | 'proenca' | 'max';

export type Unit = 'un' | 'kg' | 'L' | 'g' | 'ml' | 'dz';

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: Unit;
  category: string;
  prices: Record<Supermarket, number>;
}

export interface ProductData {
  name: string;
  unit: Unit;
  category: string;
  prices: Record<Supermarket, number>;
}

export type AppView = 'list' | 'analysis' | 'about';

export type SortKey = 'none' | 'name' | 'category';

export type SortDirection = 'asc' | 'desc';