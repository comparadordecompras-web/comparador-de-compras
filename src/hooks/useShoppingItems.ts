import { useState, useEffect, useCallback } from 'react';
import { ShoppingItem, Supermarket } from '../types';
import { supabase } from '../integrations/supabase/client';
import { useSession } from '../components/SessionContextProvider';
import { showSuccess, showError } from '../utils/toast';

interface UseShoppingItemsResult {
  items: ShoppingItem[];
  isLoading: boolean;
  addItem: (item: Omit<ShoppingItem, 'id'>) => Promise<void>;
  addItemsBatch: (newItems: Omit<ShoppingItem, 'id'>[]) => Promise<void>;
  updateItem: (item: ShoppingItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearList: () => Promise<void>;
}

export function useShoppingItems(): UseShoppingItemsResult {
  const { user, isLoading: isSessionLoading } = useSession();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    if (!user) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from('shopping_items')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching items:', error);
      showError('Erro ao carregar lista de compras.');
    } else {
      // Map database structure back to ShoppingItem interface
      const fetchedItems: ShoppingItem[] = data.map(dbItem => ({
        id: dbItem.id,
        name: dbItem.name,
        quantity: parseFloat(dbItem.quantity),
        unit: dbItem.unit,
        category: dbItem.category,
        prices: dbItem.prices as Record<Supermarket, number>, // Cast JSONB back to type
        barcode: dbItem.barcode,
      }));
      setItems(fetchedItems);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    if (!isSessionLoading) {
      fetchItems();
    }
  }, [isSessionLoading, fetchItems]);

  const addItem = useCallback(async (item: Omit<ShoppingItem, 'id'>) => {
    if (!user) return;

    const newItem = {
      user_id: user.id,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      prices: item.prices,
      barcode: item.barcode || null, // Save barcode if present
    };

    const { data, error } = await supabase
      .from('shopping_items')
      .insert(newItem)
      .select()
      .single();

    if (error) {
      console.error('Error adding item:', error);
      showError(`Falha ao adicionar item: ${item.name}`);
    } else if (data) {
      const addedItem: ShoppingItem = {
        id: data.id,
        name: data.name,
        quantity: parseFloat(data.quantity),
        unit: data.unit,
        category: data.category,
        prices: data.prices as Record<Supermarket, number>,
        barcode: data.barcode,
      };
      setItems(prev => [...prev, addedItem]);
      showSuccess(`Item "${data.name}" adicionado.`);
    }
  }, [user]);
  
  const addItemsBatch = useCallback(async (newItems: Omit<ShoppingItem, 'id'>[]) => {
    if (!user || newItems.length === 0) return;

    const itemsToInsert = newItems.map(item => ({
      user_id: user.id,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      prices: item.prices,
      barcode: item.barcode || null,
    }));

    const { data, error } = await supabase
      .from('shopping_items')
      .insert(itemsToInsert)
      .select();

    if (error) {
      console.error('Error adding items batch:', error);
      showError(`Falha ao importar ${newItems.length} itens.`);
    } else if (data) {
      const addedItems: ShoppingItem[] = data.map(dbItem => ({
        id: dbItem.id,
        name: dbItem.name,
        quantity: parseFloat(dbItem.quantity),
        unit: dbItem.unit,
        category: dbItem.category,
        prices: dbItem.prices as Record<Supermarket, number>,
        barcode: dbItem.barcode,
      }));
      setItems(prev => [...prev, ...addedItems]);
      showSuccess(`${addedItems.length} itens importados com sucesso!`);
    }
  }, [user]);

  const updateItem = useCallback(async (item: ShoppingItem) => {
    if (!user) return;

    const { error } = await supabase
      .from('shopping_items')
      .update({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        category: item.category,
        prices: item.prices,
        barcode: item.barcode || null, // Update barcode
      })
      .eq('id', item.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating item:', error);
      showError(`Falha ao atualizar item: ${item.name}`);
    } else {
      setItems(prev => prev.map(i => (i.id === item.id ? item : i)));
    }
  }, [user]);

  const removeItem = useCallback(async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('shopping_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing item:', error);
      showError('Falha ao remover item.');
    } else {
      setItems(prev => prev.filter(i => i.id !== id));
      showSuccess('Item removido.');
    }
  }, [user]);

  const clearList = useCallback(async () => {
    if (!user) return;

    // Delete all items belonging to the current user (RLS handles the filtering)
    const { error } = await supabase
      .from('shopping_items')
      .delete()
      .eq('user_id', user.id); 

    if (error) {
      console.error('Error clearing list:', error);
      showError('Falha ao limpar a lista.');
    } else {
      setItems([]);
      showSuccess('Lista limpa com sucesso!');
    }
  }, [user]);

  return { items, isLoading, addItem, addItemsBatch, updateItem, removeItem, clearList };
}