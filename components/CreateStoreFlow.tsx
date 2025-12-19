/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { useSupabase } from '../App'; // Use the Context hook from App.tsx
import StoreDetailsForm, { StoreFormData } from './StoreDetailsForm';
import AddProductsForm, { ProductFormData } from './AddProductsForm';
import StoreCreatedSuccess from './StoreCreatedSuccess';

interface CreateStoreFlowProps {
  onClose: () => void;
  onStoreCreated: (slug: string) => void;
}

type Step = 'details' | 'products' | 'success' | 'loading';

const CreateStoreFlow: React.FC<CreateStoreFlowProps> = ({ onClose, onStoreCreated }) => {
  const supabase = useSupabase(); // Use Context hook - no local client
  const [step, setStep] = useState<Step>('details');
  const [storeDetails, setStoreDetails] = useState<StoreFormData | null>(null);
  const [createdStoreSlug, setCreatedStoreSlug] = useState('');
  const [createdStoreName, setCreatedStoreName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleStoreDetailsNext = (data: StoreFormData) => {
    setStoreDetails(data);
    setStep('products');
  };

  const handleProductsBack = () => {
    setStep('details');
  };

  // Real Supabase createStore function
  const createStore = async (storeData: any, products: ProductFormData[]) => {
    try {
      // Upload logo to Supabase Storage if exists
      let logoUrl = null;
      if (storeData.logoFile) {
        const { data: logoData, error: logoError } = await supabase.storage
          .from('store-logos')
          .upload(`${storeData.name}-${Date.now()}.jpg`, storeData.logoFile);
        if (logoError) throw logoError;
        logoUrl = supabase.storage.from('store-logos').getPublicUrl(logoData.path).data.publicUrl;
      }

      // Generate unique slug
      const slug = storeData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Math.random().toString(36).substr(2, 5);

      // Insert store
      const { data: newStore, error: storeError } = await supabase
        .from('stores')
        .insert({
          slug,
          name: storeData.name,
          description: storeData.description,
          whatsapp_number: storeData.whatsappNumber,
          currency: storeData.currency,
          logo_url: logoUrl
        })
        .select()
        .single();

      if (storeError) throw storeError;

      // Upload product images and insert products
      const processedProducts = await Promise.all(
        products.map(async (p) => {
          let imageUrl = null;
          if (p.imageFile) {
            const { data: imgData, error: imgError } = await supabase.storage
              .from('product-images')
              .upload(`${newStore.id}-${p.name}-${Date.now()}.jpg`, p.imageFile);
            if (imgError) throw imgError;
            imageUrl = supabase.storage.from('product-images').getPublicUrl(imgData.path).data.publicUrl;
          }

          return {
            store_id: newStore.id,
            name: p.name,
            description: p.description,
            price: p.price,
            image_url: imageUrl
          };
        })
      );

      const { error: productsError } = await supabase
        .from('products')
        .insert(processedProducts);

      if (productsError) throw productsError;

      return { slug: newStore.slug, name: newStore.name };
    } catch (err) {
      console.error('Error creating store:', err);
      throw err;
    }
  };

  const handleProductsNext = async (products: ProductFormData[]) => {
    if (!storeDetails) return;

    setStep('loading');
    setError(null);

    try {
      const storeData = {
        name: storeDetails.shopName,
        description: storeDetails.shopDescription,
        whatsappNumber: storeDetails.whatsappNumber.replace(/\s/g, ''),
        currency: storeDetails.currency,
        logoFile: storeDetails.logoFile
      };

      const store = await createStore(storeData, products);

      setCreatedStoreSlug(store.slug);
      setCreatedStoreName(store.name);
      setStep('success');
    } catch (err) {
      console.error('Error creating store:', err);
      setError(err instanceof Error ? err.message : 'Failed to create store. Please try again.');
      setStep('products');
    }
  };

  const handleViewStore = () => {
    onStoreCreated(createdStoreSlug);
  };

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4 pt-32">
        <div className="clay-card p-12 text-center max-w-md">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Creating Your Store</h3>
          <p className="text-gray-500 font-bold">
            Uploading images and setting up your products...
          </p>
          <p className="text-sm text-gray-400 font-bold mt-4">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <StoreCreatedSuccess
        storeSlug={createdStoreSlug}
        storeName={createdStoreName}
        onClose={onClose}
        onViewStore={handleViewStore}
      />
    );
  }

  if (step === 'products' && storeDetails) {
    return (
      <>
        <AddProductsForm
          onNext={handleProductsNext}
          onBack={handleProductsBack}
          currency={storeDetails.currency}
        />
        {error && (
          <div className="fixed bottom-8 right-8 bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl max-w-md z-[10000]">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="font-black mb-1">Error Creating Store</h4>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <StoreDetailsForm
      onNext={handleStoreDetailsNext}
      onCancel={onClose}
    />
  );
};

export default CreateStoreFlow;