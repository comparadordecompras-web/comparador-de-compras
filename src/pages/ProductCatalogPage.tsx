import React, { useState, useCallback } from 'react';
import { useProducts } from '../hooks/useProducts';
import { Product, Supermarket, Unit } from '../types';
import { SUPERMARKETS, UNITS, CATEGORIES } from '../constants';
import { Package, Edit, Trash2, Save, X, Barcode } from 'lucide-react';
import { showError } from '../utils/toast';

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// --- Componente de Edição de Linha ---
interface EditableProductRowProps {
  product: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const EditableProductRow: React.FC<EditableProductRowProps> = ({ product, onSave, onCancel }) => {
  const [editedProduct, setEditedProduct] = useState(product);
  const [error, setError] = useState('');

  const handlePriceChange = (market: Supermarket, value: string) => {
    setEditedProduct(prev => ({
      ...prev,
      prices: {
        ...prev.prices,
        [market]: parseFloat(value) || 0,
      },
    }));
  };

  const handleFieldChange = (field: 'name' | 'unit' | 'category', value: string) => {
    setEditedProduct(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!editedProduct.name.trim()) {
      setError('O nome do produto é obrigatório.');
      return;
    }
    setError('');
    onSave(editedProduct);
  };

  return (
    <tr className="bg-yellow-50 border-2 border-yellow-200">
      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
        <input
          type="text"
          value={editedProduct.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          className="w-full p-1 border border-gray-300 rounded-md focus:border-brand-primary focus:ring-1"
        />
        <div className="flex space-x-2 mt-1 text-xs text-gray-500">
            <select
                value={editedProduct.unit}
                onChange={(e) => handleFieldChange('unit', e.target.value)}
                className="p-1 border border-gray-300 rounded-md bg-white"
            >
                {Object.entries(UNITS).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                ))}
            </select>
            <select
                value={editedProduct.category}
                onChange={(e) => handleFieldChange('category', e.target.value)}
                className="p-1 border border-gray-300 rounded-md bg-white"
            >
                {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </td>
      
      {Object.keys(SUPERMARKETS).map(marketKey => (
        <td key={marketKey} className="px-2 py-2 whitespace-nowrap text-sm text-center">
          <input
            type="number"
            value={editedProduct.prices[marketKey as Supermarket] || ''}
            onChange={(e) => handlePriceChange(marketKey as Supermarket, e.target.value)}
            min="0"
            step="0.01"
            placeholder="0.00"
            className="w-24 text-center p-1 border border-gray-300 rounded-md focus:border-brand-primary focus:ring-1"
          />
        </td>
      ))}

      <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium space-x-2">
        <button
          onClick={handleSave}
          className="text-brand-secondary hover:text-green-700 p-1 rounded-full"
          aria-label="Salvar alterações"
        >
          <Save className="w-5 h-5" />
        </button>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full"
          aria-label="Cancelar edição"
        >
          <X className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
};

// --- Página Principal ---
const ProductCatalogPage: React.FC = () => {
  const { products, isLoading, updateProduct, removeProduct, fetchProducts } = useProducts();
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleRemove = useCallback((id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o produto "${name}" do catálogo?`)) {
      removeProduct(id, name);
    }
  }, [removeProduct]);

  const handleSave = useCallback((product: Product) => {
    updateProduct(product);
    setEditingId(null);
  }, [updateProduct]);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center py-16">
        <p className="text-lg text-brand-primary">Carregando catálogo de produtos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-brand-dark flex items-center">
        <Package className="w-7 h-7 mr-3 text-brand-primary" />
        Catálogo de Produtos ({products.length})
      </h2>
      <p className="text-gray-600">Gerencie os produtos cadastrados via código de barras. Você pode editar preços, nomes e categorias para manter o catálogo atualizado.</p>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Produto / Detalhes
                </th>
                {Object.values(SUPERMARKETS).map(name => (
                  <th key={name} scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {name} (R$)
                  </th>
                ))}
                <th scope="col" className="relative px-4 py-3 w-20">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={Object.keys(SUPERMARKETS).length + 2} className="px-4 py-8 text-center text-gray-500">
                    Nenhum produto cadastrado no catálogo. Use o scanner na Lista de Compras para adicionar novos itens.
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  editingId === product.id ? (
                    <EditableProductRow 
                      key={product.id}
                      product={product}
                      onSave={handleSave}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                        <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                            <p>Unidade: {UNITS[product.unit]}</p>
                            <p>Categoria: {product.category}</p>
                            <p className="flex items-center text-xs font-mono text-gray-400">
                                <Barcode className="w-3 h-3 mr-1" />
                                {product.barcode}
                            </p>
                        </div>
                      </td>
                      {Object.keys(SUPERMARKETS).map(marketKey => (
                        <td key={marketKey} className="px-2 py-2 whitespace-nowrap text-sm text-center text-gray-700">
                          {product.prices[marketKey as Supermarket] > 0 
                            ? formatCurrency(product.prices[marketKey as Supermarket]) 
                            : '-'}
                        </td>
                      ))}
                      <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => setEditingId(product.id)}
                          className="text-brand-primary hover:text-blue-700 p-1 rounded-full"
                          aria-label={`Editar ${product.name}`}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleRemove(product.id, product.name)}
                          className="text-red-600 hover:text-red-800 p-1 rounded-full"
                          aria-label={`Excluir ${product.name}`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  )
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalogPage;