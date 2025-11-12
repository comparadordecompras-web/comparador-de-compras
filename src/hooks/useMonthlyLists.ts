import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useSession } from '../components/SessionContextProvider';
import { ShoppingItem } from '../types';
import { showSuccess, showError, showLoading, dismissToast } from '../utils/toast';

interface MonthlyList {
  id: string;
  name: string;
  total_optimized: number;
  items: ShoppingItem[];
  created_at: string;
}

interface UseMonthlyListsResult {
  savedLists: MonthlyList[];
  isLoading: boolean;
  saveList: (listName: string, items: ShoppingItem[], totalOptimized: number) => Promise<void>;
  fetchLists: () => Promise<void>;
}

export function useMonthlyLists(): UseMonthlyListsResult {
  const { user, isLoading: isSessionLoading } = useSession();
  const [savedLists, setSavedLists] = useState<MonthlyList[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLists = useCallback(async () => {
    if (!user) {
      setSavedLists([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from('monthly_lists')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching monthly lists:', error);
      showError('Erro ao carregar listas salvas.');
    } else {
      const fetchedLists: MonthlyList[] = data.map(dbList => ({
        id: dbList.id,
        name: dbList.name,
        total_optimized: parseFloat(dbList.total_optimized),
        items: dbList.items as ShoppingItem[], // JSONB is cast back to type
        created_at: dbList.created_at,
      }));
      setSavedLists(fetchedLists);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    if (!isSessionLoading) {
      fetchLists();
    }
  }, [isSessionLoading, fetchLists]);

  const saveList = useCallback(async (listName: string, items: ShoppingItem[], totalOptimized: number) => {
    if (!user || items.length === 0) {
      showError('A lista está vazia ou você não está logado.');
      return;
    }

    const toastId = showLoading('Salvando lista mensal...');

    const newList = {
      user_id: user.id,
      name: listName,
      total_optimized: totalOptimized,
      items: items, // Supabase handles JSONB conversion
    };

    const { data, error } = await supabase
      .from('monthly_lists')
      .insert(newList)
      .select()
      .single();

    dismissToast(toastId);

    if (error) {
      console.error('Error saving monthly list:', error);
      showError('Falha ao salvar a lista. Tente novamente.');
    } else if (data) {
      const savedList: MonthlyList = {
        id: data.id,
        name: data.name,
        total_optimized: parseFloat(data.total_optimized),
        items: data.items as ShoppingItem[],
        created_at: data.created_at,
      };
      setSavedLists(prev => [savedList, ...prev]);
      showSuccess(`Lista "${listName}" salva com sucesso!`);
    }
  }, [user]);

  return { savedLists, isLoading, saveList, fetchLists };
}