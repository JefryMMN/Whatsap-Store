/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { useSupabase } from '../App'; // Use the Context hook from App.tsx
import { Product } from '../types';

interface PublicStorePageProps {
  slug: string;
}

interface SupabaseStore {
  id: string;
  slug: string;
  name: string;
  description: string;
  whatsapp_number: string;
  currency: string;
  logo_url?: string;
  products: Product[];
}

const PublicStorePage: React.FC<PublicStorePageProps> = ({ slug }) => {
  const supabase = useSupabase(); // Use Context hook - no local client
  const [store, setStore] = useState<SupabaseStore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStore();
  }, [slug]);

  const loadStore = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch store by slug with products
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select(`
          *,
          products (
            id,
            name,
            description,
            price,
            image_url
          )
        `)
        .eq('slug', slug)
        .single();

      if (storeError) throw storeError;

      if (storeData) {
        // Map products to match Product type
        const mappedProducts: Product[] = storeData.products.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          image: p.image_url || '/placeholder-image.jpg',
          category: 'All'
        }));

        const processedStore: SupabaseStore = {
          ...storeData,
          whatsappNumber: storeData.whatsapp_number, // Map for compatibility
          products: mappedProducts
        };
        setStore(processedStore);
      } else {
        setError('Store not found');
      }
    } catch (err) {
      console.error('Error loading store:', err);
      setError('Failed to load store. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyProduct = (product: Product) => {
    if (!store) return;

    const message = encodeURIComponent(
      `Hi! I'm interested in buying "${product.name}" (${store.currency}${product.price}) from ${store.name}. Is it available?`
    );
    const whatsappUrl = `https://wa.me/${store.whatsapp_number}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCreateOwnStore = () => {
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-2xl font-black uppercase tracking-tighter">Loading Store...</h3>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4">
        <div className="clay-card p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">😕</span>
          </div>
          <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Store Not Found</h3>
          <p className="text-gray-500 font-bold mb-6">
            {error || 'The store you are looking for does not exist.'}
          </p>
          <button
            onClick={handleCreateOwnStore}
            className="clay-button-primary px-8 py-4 text-sm"
          >
            Create Your Own Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-black font-sans selection:bg-black selection:text-white pb-24">
      {/* Header */}
      <div className="pt-32 md:pt-40 pb-12 md:pb-16 px-4 md:px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          {/* Logo */}
          <div className="mb-6">
            {store.logo_url ? (
              <img
                src={store.logo_url}
                alt={store.name}
                className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-2xl md:rounded-3xl mx-auto shadow-2xl border-2 border-gray-100"
              />
            ) : (
              <div className="w-20 h-20 md:w-28 md:h-28 bg-black text-white mx-auto flex items-center justify-center text-3xl md:text-5xl font-black rounded-2xl md:rounded-3xl shadow-2xl">
                {store.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Store Name */}
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-none">
            {store.name}
          </h1>

          {/* Store Description */}
          <p className="text-gray-500 font-bold max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            {store.description}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 md:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
              Products ({store.products.length})
            </h2>
          </div>

          {store.products.length === 0 ? (
            <div className="clay-card p-12 md:p-20 text-center">
              <span className="text-6xl mb-4 block">📦</span>
              <p className="font-black uppercase tracking-widest text-gray-400">
                No products available yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {store.products.map((product) => (
                <div key={product.id} className="clay-card overflow-hidden group">
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={product.image || '/placeholder-image.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    <h3 className="font-black text-lg mb-2 line-clamp-1">{product.name}</h3>

                    {product.description && (
                      <p className="text-sm text-gray-500 font-bold mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {/* Price and Buy Button */}
                    <div className="flex items-center justify-between gap-4 pt-4 border-t-2 border-gray-100">
                      <div className="text-2xl font-black">
                        {store.currency}{product.price}
                      </div>
                      <button
                        onClick={() => handleBuyProduct(product)}
                        className="px-5 py-3 bg-[#25D366] text-white font-black uppercase tracking-widest rounded-xl hover:bg-[#128C7E] transition-all text-xs flex items-center gap-2 shadow-lg"
                      >
                        <span>💬</span>
                        <span className="hidden sm:inline">Buy on WhatsApp</span>
                        <span className="sm:hidden">Buy</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 py-12 border-t-2 border-gray-100">
        <div className="text-center px-4">
          <p className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">
            Powered by STORELINK
          </p>
          <button
            onClick={handleCreateOwnStore}
            className="clay-button px-8 py-4 text-sm inline-flex items-center gap-2"
          >
            <span>✨</span>
            <span>Create your own free store</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicStorePage;