/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
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

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  imageFile: File | null;
  imagePreview: string | null;
}

const initialProductForm: ProductFormData = {
  name: '',
  description: '',
  price: '',
  imageFile: null,
  imagePreview: null
};

const PublicStorePage: React.FC<PublicStorePageProps> = ({ slug }) => {
  const { supabase, user } = useSupabase();
  const [store, setStore] = useState<SupabaseStore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<ProductFormData>(initialProductForm);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

        // Update page title to store name
        document.title = `${storeData.name} | Storefront`;
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

  // ========== IMAGE HANDLING ==========
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProductImage = async (file: File): Promise<string | null> => {
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.name}`;

    try {
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (err) {
      console.error('Image upload failed:', err);
      return null;
    }
  };

  // ========== ADD PRODUCT ==========
  const openAddModal = () => {
    setProductForm(initialProductForm);
    setActionError(null);
    setShowAddModal(true);
  };

  const handleAddProduct = async () => {
    if (!store || !user) return;

    if (!productForm.name.trim() || !productForm.price.trim()) {
      setActionError('Name and price are required');
      return;
    }

    const price = parseFloat(productForm.price);
    if (isNaN(price) || price < 0) {
      setActionError('Please enter a valid price');
      return;
    }

    setSubmitting(true);
    setActionError(null);

    try {
      let imageUrl: string | null = null;
      if (productForm.imageFile) {
        imageUrl = await uploadProductImage(productForm.imageFile);
      }

      const { error: insertError } = await supabase
        .from('products')
        .insert({
          store_id: store.id,
          name: productForm.name.trim(),
          description: productForm.description.trim(),
          price: price,
          image_url: imageUrl
        });

      if (insertError) throw insertError;

      setShowAddModal(false);
      setProductForm(initialProductForm);
      await loadStore();
    } catch (err: any) {
      console.error('Add product error:', err);
      setActionError(err.message || 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  // ========== EDIT PRODUCT ==========
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      imageFile: null,
      imagePreview: product.image || null
    });
    setActionError(null);
    setShowEditModal(true);
  };

  const handleEditProduct = async () => {
    if (!store || !user || !editingProduct) return;

    if (!productForm.name.trim() || !productForm.price.trim()) {
      setActionError('Name and price are required');
      return;
    }

    const price = parseFloat(productForm.price);
    if (isNaN(price) || price < 0) {
      setActionError('Please enter a valid price');
      return;
    }

    setSubmitting(true);
    setActionError(null);

    try {
      let imageUrl: string | undefined = undefined;

      if (productForm.imageFile) {
        const uploadedUrl = await uploadProductImage(productForm.imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const updateData: any = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        price: price
      };

      if (imageUrl) {
        updateData.image_url = imageUrl;
      }

      const { error: updateError } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', editingProduct.id);

      if (updateError) throw updateError;

      setShowEditModal(false);
      setEditingProduct(null);
      setProductForm(initialProductForm);
      await loadStore();
    } catch (err: any) {
      console.error('Edit product error:', err);
      setActionError(err.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  // ========== DELETE PRODUCT ==========
  const handleDeleteProduct = async (product: Product) => {
    if (!store || !user) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (deleteError) throw deleteError;

      await loadStore();
    } catch (err: any) {
      console.error('Delete product error:', err);
      alert(err.message || 'Failed to delete product');
    }
  };

  const isOwner = user && store && store.creator_id === user.id;

  // ========== MODAL COMPONENT ==========
  const ProductModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onSubmit: () => void;
    submitText: string;
  }> = ({ isOpen, onClose, title, onSubmit, submitText }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
        <div
          className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white px-8 py-6 border-b-2 border-gray-100 flex items-center justify-between">
            <h2 className="text-2xl font-black uppercase tracking-tighter">{title}</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <label className="block font-black uppercase tracking-widest text-sm mb-3">
                Product Image
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-video bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 hover:border-black cursor-pointer transition-colors flex items-center justify-center overflow-hidden"
              >
                {productForm.imagePreview ? (
                  <img
                    src={productForm.imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-8">
                    <span className="text-4xl mb-2 block">📷</span>
                    <span className="text-gray-500 font-bold text-sm">Click to upload image</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <div>
              <label className="block font-black uppercase tracking-widest text-sm mb-3">
                Product Name *
              </label>
              <input
                type="text"
                value={productForm.name}
                onChange={e => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Handmade Leather Bag"
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none font-bold transition-colors"
              />
            </div>

            <div>
              <label className="block font-black uppercase tracking-widest text-sm mb-3">
                Price ({store?.currency}) *
              </label>
              <input
                type="number"
                value={productForm.price}
                onChange={e => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none font-bold transition-colors"
              />
            </div>

            <div>
              <label className="block font-black uppercase tracking-widest text-sm mb-3">
                Description
              </label>
              <textarea
                value={productForm.description}
                onChange={e => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your product..."
                rows={3}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-black focus:outline-none font-bold transition-colors resize-none"
              />
            </div>

            {actionError && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-xl font-bold text-sm">
                ⚠️ {actionError}
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-white px-8 py-6 border-t-2 border-gray-100 flex gap-4">
            <button
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-4 border-2 border-black text-black font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={submitting}
              className="flex-1 py-4 bg-black text-white font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                submitText
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-2xl font-black uppercase tracking-tighter">Loading Store...</h3>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="clay-card p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">😕</span>
          </div>
          <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Store Not Found</h3>
          <p className="text-gray-500 font-bold mb-6">
            {error || 'The store you are looking for does not exist.'}
          </p>
          <button
            onClick={() => window.location.href = '/create-store'}
            className="px-8 py-4 bg-black rounded-full border-2 border-black hover:bg-gray-900 transition-all"
          >
            <span className="text-white text-sm font-black uppercase tracking-widest">Create Your Own Store</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-black font-sans selection:bg-black selection:text-white pb-24 relative overflow-hidden">
      {/* Background Gradient - Orange/Peach to Blue style matching Hero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main orange gradient - right side (dominant) */}
        <div className="absolute -top-[10%] -right-[5%] w-[65%] h-[90%]" style={{
          background: 'linear-gradient(220deg, #E8954A 0%, #F2A85D 15%, #F7BC7D 35%, #FBCEA0 55%, #FDE4C8 75%, transparent 100%)',
          opacity: 1,
          filter: 'blur(40px)',
        }}></div>

        {/* Secondary warm accent - extends orange coverage */}
        <div className="absolute top-[5%] right-0 w-[45%] h-[70%]" style={{
          background: 'linear-gradient(200deg, #E8954A 0%, #F2A85D 30%, transparent 80%)',
          opacity: 0.8,
          filter: 'blur(50px)',
        }}></div>

        {/* Blue/Cyan gradient - bottom left (prominent) */}
        <div className="absolute -bottom-[15%] -left-[10%] w-[70%] h-[65%]" style={{
          background: 'linear-gradient(35deg, #5AAFC7 0%, #6EC4D8 20%, #8AD4E5 40%, #A8E2EF 60%, #C8EEF5 80%, transparent 100%)',
          opacity: 0.95,
          filter: 'blur(45px)',
        }}></div>

        {/* Secondary blue accent - reinforces bottom left */}
        <div className="absolute bottom-0 left-[5%] w-[50%] h-[50%]" style={{
          background: 'radial-gradient(ellipse at 30% 80%, #6EC4D8 0%, #8AD4E5 30%, transparent 70%)',
          opacity: 0.7,
          filter: 'blur(40px)',
        }}></div>

        {/* Center/Left white area - keeps content readable */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 35% 45%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 25%, rgba(255,255,255,0.3) 50%, transparent 75%)',
        }}></div>

        {/* Soft cream layer for warmth */}
        <div className="absolute top-[20%] left-[15%] w-[50%] h-[60%]" style={{
          background: 'radial-gradient(ellipse, rgba(253,250,245,0.9) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}></div>
      </div>

      {/* Owner Management Buttons */}
      {isOwner && (
        <div className="fixed bottom-8 right-6 z-50 flex flex-col gap-3">
          <button
            onClick={() => {
              const storeUrl = `${window.location.origin}/store/${slug}`;
              navigator.clipboard.writeText(storeUrl).then(() => {
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 2000);
              }).catch(() => {
                const textArea = document.createElement('textarea');
                textArea.value = storeUrl;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 2000);
              });
            }}
            className={`px-6 py-4 rounded-2xl font-black uppercase tracking-wider text-sm shadow-2xl hover:shadow-xl transition-all flex items-center gap-3 hover:scale-105 ${
              linkCopied
                ? 'bg-green-500 text-white'
                : 'bg-white text-black border-2 border-black'
            }`}
          >
            <span className="text-xl">{linkCopied ? '✓' : '🔗'}</span>
            {linkCopied ? 'COPIED!' : 'SHARE STORE'}
          </button>

          <button
            onClick={openAddModal}
            className="bg-black text-white px-6 py-4 rounded-2xl font-black uppercase tracking-wider text-sm shadow-2xl hover:shadow-xl transition-all flex items-center gap-3 hover:scale-105"
          >
            <span className="text-xl">➕</span>
            ADD PRODUCT
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="relative">
        <div className="relative pt-8 md:pt-12 pb-16 md:pb-28 px-4 md:px-6">
          <div className="max-w-[1200px] mx-auto">
            {isOwner && (
              <button
                onClick={() => window.location.href = '/'}
                className="mb-4 flex items-center gap-2 text-gray-700 hover:text-black font-bold transition-colors group text-sm"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                Back to Home
              </button>
            )}

            <div className="text-center">
              <div className="mb-6">
                {store.logo_url ? (
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-black/10 rounded-2xl md:rounded-3xl blur-xl transform translate-y-2"></div>
                    <img
                      src={store.logo_url}
                      alt={store.name}
                      className="relative w-24 h-24 md:w-32 md:h-32 object-cover rounded-2xl md:rounded-3xl mx-auto shadow-2xl border-4 border-white"
                    />
                  </div>
                ) : (
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-black/20 rounded-2xl md:rounded-3xl blur-xl transform translate-y-2"></div>
                    <div className="relative w-24 h-24 md:w-32 md:h-32 bg-black text-white mx-auto flex items-center justify-center text-4xl md:text-6xl font-black rounded-2xl md:rounded-3xl shadow-2xl">
                      {store.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-none">
                {store.name}
              </h1>

              <p className="text-gray-500 font-bold max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                {store.description}
              </p>

              <div className="flex items-center justify-center gap-3 mt-8">
                <div className="w-12 h-0.5 bg-black/20 rounded-full"></div>
                <div className="w-2 h-2 bg-black/30 rounded-full"></div>
                <div className="w-12 h-0.5 bg-black/20 rounded-full"></div>
              </div>
            </div>
          </div>
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
                  onClick={openAddModal}
                  className="clay-button bg-black text-white px-10 py-5 text-lg font-black"
                >
                  ➕ Add Your First Product
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {store.products.map((product) => (
                <div key={product.id} className="clay-card overflow-hidden group hover:shadow-2xl transition-shadow relative">
                  {isOwner && (
                    <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(product);
                        }}
                        className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50 transition-colors border-2 border-gray-100"
                        title="Edit Product"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(product);
                        }}
                        className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors border-2 border-gray-100"
                        title="Delete Product"
                      >
                        🗑️
                      </button>
                    </div>
                  )}

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

                  <div className="p-6">
                    <h3 className="font-black text-xl mb-2 line-clamp-1">{product.name}</h3>

                    {product.description && (
                      <p className="text-sm text-gray-600 font-bold mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-4 pt-6 border-t-2 border-gray-100">
                      <div className="text-3xl font-black">
                        {store.currency}{product.price}
                      </div>
                      <button
                        onClick={() => handleBuyProduct(product)}
                        className="px-6 py-4 bg-[#25D366] text-white font-black uppercase tracking-widest rounded-xl hover:bg-[#128C7E] transition-all text-sm flex items-center gap-3 shadow-xl hover:shadow-2xl"
                      >
                        <span className="text-xl">💬</span>
                        <span>Buy</span>
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
            Powered by Storefront
          </p>
          <button
            onClick={() => window.location.href = '/create-store'}
            className="px-10 py-4 bg-white rounded-full border-2 border-black hover:bg-black hover:text-white transition-all shadow-lg inline-flex items-center gap-3 group"
          >
            <span className="text-lg">✨</span>
            <span className="text-sm font-black uppercase tracking-wider">Create Your Own Free Store</span>
          </button>
        </div>
      </div>

      <ProductModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setProductForm(initialProductForm);
          setActionError(null);
        }}
        title="Add Product"
        onSubmit={handleAddProduct}
        submitText="Add Product"
      />

      <ProductModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingProduct(null);
          setProductForm(initialProductForm);
          setActionError(null);
        }}
        title="Edit Product"
        onSubmit={handleEditProduct}
        submitText="Save Changes"
      />
    </div>
  );
};

export default PublicStorePage;
