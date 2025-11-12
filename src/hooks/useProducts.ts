import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useSession } from '../components/SessionContextProvider';
import { Product, ShoppingItem, Supermarket, Unit } from '../types';
import { showSuccess, showError, showLoading, dismissToast } from '../utils/toast';

interface ProductDataToInsert {
  barcode: string;
  name: string;
  unit: Unit;
  category: string;
  prices: Record<Supermarket, number>;
}

interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  findProductByBarcode: (barcode: string) => Promise<Product | null>;
  addProduct: (productData: ProductDataToInsert) => Promise<Product | null>;
  updateProduct: (product: Product) => Promise<void>;
  removeProduct: (id: string, name: string) => Promise<void>;
}

export function useProducts(): UseProductsResult {
  const { user, isLoading: isSessionLoading } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    if (!user) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    // Fetch all products (RLS allows authenticated users to read all)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching products:', error);
      showError('Erro ao carregar catálogo de produtos.');
    } else {
      const fetchedProducts: Product[] = data.map(dbProduct => ({
        id: dbProduct.id,
        barcode: dbProduct.barcode,
        name: dbProduct.name,
        unit: dbProduct.unit as Unit,
        category: dbProduct.category,
        prices: dbProduct.prices as Record<Supermarket, number>,
        created_at: dbProduct.created_at,
      }));
      setProducts(fetchedProducts);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    if (!isSessionLoading) {
      fetchProducts();
    }
  }, [isSessionLoading, fetchProducts]);

  const addProduct = useCallback(async (productData: ProductDataToInsert): Promise<Product | null> => {
    if (!user) return null;

    const toastId = showLoading(`Cadastrando produto "${productData.name}"...`);

    const newProduct = {
      user_id: user.id,
      barcode: productData.barcode,
      name: productData.name,
      unit: productData.unit,
      category: productData.category,
      prices: productData.prices,
    };

    const { data, error } = await supabase
      .from('products')
      .insert(newProduct)
      .select()
      .single();

    dismissToast(toastId);

    if (error) {
      console.error('Error adding product:', error);
      if (error.code === '23505') { // Unique violation error code
        showError('Falha: Este código de barras já está cadastrado.');
      } else {
        showError('Falha ao cadastrar produto. Tente novamente.');
      }
      return null;
    } else if (data) {
      const addedProduct: Product = {
        id: data.id,
        barcode: data.barcode,
        name: data.name,
        unit: data.unit as Unit,
        category: data.category,
        prices: data.prices as Record<Supermarket, number>,
        created_at: data.created_at,
      };
      setProducts(prev => [addedProduct, ...prev].sort((a, b) => a.name.localeCompare(b.name)));
      showSuccess(`Produto "${data.name}" cadastrado com sucesso!`);
      return addedProduct;
    }
    return null;
  }, [user]);
  
  const updateProduct = useCallback(async (product: Product) => {
    if (!user) return;

    const toastId = showLoading(`Atualizando produto "${product.name}"...`);

    const { error } = await supabase
      .from('products')
      .update({
        name: product.name,
        unit: product.unit,
        category: product.category,
        prices: product.prices,
        // Note: barcode is generally immutable, but we update other fields
      })
      .eq('id', product.id)
      .select()
      .single();

    dismissToast(toastId);

    if (error) {
      console.error('Error updating product:', error);
      showError(`Falha ao atualizar produto: ${product.name}`);
    } else {
      setProducts(prev => prev.map(p => (p.id === product.id ? product : p)));
      showSuccess(`Produto "${product.name}" atualizado.`);
    }
  }, [user]);

  const removeProduct = useCallback(async (id: string, name: string) => {
    if (!user) return;

    const toastId = showLoading(`Excluindo produto "${name}"...`);

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    dismissToast(toastId);

    if (error) {
      console.error('Error removing product:', error);
      showError('Falha ao excluir produto.');
    } else {
      setProducts(prev => prev.filter(p => p.id !== id));
      showSuccess(`Produto "${name}" excluído.`);
    }
  }, [user]);

  const findProductByBarcode = useCallback(async (barcode: string): Promise<Product | null> => {
    if (!user) return null;

    // Search for the product by barcode
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('barcode', barcode)
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means "No rows found"
      console.error('Error searching product by barcode:', error);
      return null;
    }

    if (data) {
      return {
        id: data.id,
        barcode: data.barcode,
        name: data.name,
        unit: data.unit as Unit,
        category: data.category,
        prices: data.prices as Record<Supermarket, number>,
        created_at: data.created_at,
      };
    }

    return null;
  }, [user]);

  return { products, isLoading, fetchProducts, findProductByBarcode, addProduct, updateProduct, removeProduct };
}