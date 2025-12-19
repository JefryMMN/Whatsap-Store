/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { useSupabase } from '../App';
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
  creator_id?: string;
  products: Product[];
}

const PublicStorePage: React.FC<PublicStorePageProps> = ({ slug }) => {
  const { supabase, user } = useSupabase();
  const [store, setStore] = useState<SupabaseStore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStore();
  }, [slug, supabase]);

  const loadStore = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select(`
          id,
          slug,
          name,
          description,
          whatsapp_number,
          currency,
          logo_url,
          creator_id,
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

      if (storeError) {
        if (storeError.code === 'PGRST116') {
          setError('Store not found');
        } else {
          console.error('Store loading error:', storeError);
          setError('Failed to load store. Please try again later.');
        }
        return;
      }

      if (storeData) {
        const mappedProducts: Product[] = (storeData.products || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          image: p.image_url || '/placeholder-image.jpg',
          category: 'All'
        }));

        const processedStore: SupabaseStore = {
          id: storeData.id,
          slug: storeData.slug,
          name: storeData.name,
          description: storeData.description,
          whatsapp_number: storeData.whatsapp_number,
          currency: storeData.currency,
          logo_url: storeData.logo_url,
          creator_id: storeData.creator_id,
          products: mappedProducts
        };

        setStore(processedStore);
      }
    } catch (err) {
      console.error('Unexpected error loading store:', err);
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

  const isOwner = user && store && store.creator_id === user.id;

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
            onClick={() => window.location.href = '/'}
            className="clay-button-primary px-8 py-4 text-sm"
          >
            Create Your Own Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-black font-sans selection:bg-black selection:text-white pb-24 relative">
      {/* Owner Management Buttons - Floating on top-right, clean and professional */}
      {isOwner && (
        <div className="fixed top-24 right-4 z-50 flex flex-col gap-3">
          <button
            onClick={() => window.location.href = '/inventory'}
            className="bg-black text-white px-6 py-4 rounded-2xl font-black uppercase tracking-wider text-sm shadow-2xl hover:shadow-xl transition-all flex items-center gap-3 hover:scale-105"
          >
            <span className="text-xl">➕</span>
            Add Product
          </button>
          <button
            onClick={() => window.location.href = '/inventory'}
            className="bg-gray-800 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-wider text-sm shadow-2xl hover:shadow-xl transition-all flex items-center gap-3 hover:scale-105"
          >
            <span className="text-xl">✏️</span>
            Edit / Delete Products
          </button>
        </div>
      )}

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
      <div className="px-4 md:px-6 pb-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
              Products ({store.products.length})
            </h2>
          </div>

          {store.products.length === 0 ? (
            <div className="clay-card p-12 md:p-20 text-center">
              <span className="text-6xl mb-4 block">📦</span>
              <p className="font-black uppercase tracking-widest text-gray-400 mb-8">
                No products available yet
              </p>
              {isOwner && (
                <button
                  onClick={() => window.location.href = '/inventory'}
                  className="clay-button bg-black text-white px-10 py-5 text-lg font-black"
                >
                  ➕ Add Your First Product
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {store.products.map((product) => (
                <div key={product.id} className="clay-card overflow-hidden group hover:shadow-2xl transition-shadow">
                  {/* Product Image */}
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={product.image || '/placeholder-image.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="font-black text-xl mb-2 line-clamp-1">{product.name}</h3>

                    {product.description && (
                      <p className="text-sm text-gray-600 font-bold mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {/* Price and Buy Button */}
                    <div className="flex items-center justify-between gap-4 pt-6 border-t-2 border-gray-100">
                      <div className="text-3xl font-black">
                        {store.currency}{product.price}
                      </div>
                      <button
                        onClick={() => handleBuyProduct(product)}
                        className="px-6 py-4 bg-[#25D366] text-white font-black uppercase tracking-widest rounded-xl hover:bg-[#128C7E] transition-all text-sm flex items-center gap-3 shadow-xl hover:shadow-2xl"
                      >
                        <span className="text-xl">💬</span>
                        <span>Buy on WhatsApp</span>
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
            Powered by ShopSmart
          </p>
          <button
            onClick={() => window.location.href = '/'}
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