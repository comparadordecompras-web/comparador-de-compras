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

// New types for sorting
export type SortKey = 'name' | 'category' | 'none';
export type SortDirection = 'asc' | 'desc';