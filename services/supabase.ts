/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper function to upload image with timeout and fallback
async function uploadImage(file: File, bucket: 'store-logos' | 'product-images'): Promise<string | null> {
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.name}`;

  try {
    const uploadTask = supabase.storage
      .from(bucket)
      .upload(fileName, file);

    // 60-second timeout
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Upload timeout')), 60000)
    );

    const { data, error } = await Promise.race([uploadTask, timeout]);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (err) {
    console.error(`Upload failed for ${bucket}:`, err);
    return null; // Continue without image
  }
}

// Helper function to generate unique slug
export async function generateUniqueSlug(name: string): Promise<string> {
  let slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const { data: existing } = await supabase
    .from('stores')
    .select('slug')
    .eq('slug', slug)
    .single();

  if (existing) {
    slug = slug + '-' + Math.random().toString(36).substr(2, 4);
  }

  return slug;
}

export interface StoreData {
  name: string;
  description: string;
  whatsappNumber: string;
  currency: string;
  logoFile?: File | null;
}

export interface ProductData {
  name: string;
  description: string;
  price: number;
  imageFile?: File | null; // Made optional to allow no image
}

export interface SupabaseStore {
  id: string;
  slug: string;
  name: string;
  description: string;
  whatsapp_number: string;
  logo_url: string | null;
  currency: string;
  created_at: string;
  creator_id: string;
}

export interface SupabaseProduct {
  id: string;
  store_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  created_at: string;
}

export interface StoreWithProducts extends SupabaseStore {
  products: SupabaseProduct[];
}

// Create store with products — robust version
export async function createStore(storeData: StoreData, products: ProductData[]): Promise<SupabaseStore> {
  const currentUser = (await supabase.auth.getUser()).data.user;
  if (!currentUser) {
    throw new Error('You must be logged in to create a store.');
  }

  const slug = await generateUniqueSlug(storeData.name);

  // Upload logo with fallback
  let logoUrl: string | null = null;
  if (storeData.logoFile) {
    logoUrl = await uploadImage(storeData.logoFile, 'store-logos');
  }

  // Insert store with creator_id
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .insert({
      slug,
      name: storeData.name,
      description: storeData.description,
      whatsapp_number: storeData.whatsappNumber,
      logo_url: logoUrl,
      currency: storeData.currency,
      creator_id: currentUser.id  // Critical for RLS
    })
    .select()
    .single();

  if (storeError) {
    console.error('Store creation error:', storeError);
    throw new Error(`Failed to create store: ${storeError.message}`);
  }

  // Upload product images in parallel with timeout/fallback
  const processedProducts = await Promise.all(
    products.map(async (product) => {
      let imageUrl: string | null = null;
      if (product.imageFile) {
        imageUrl = await uploadImage(product.imageFile, 'product-images');
      }

      return {
        store_id: store.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image_url: imageUrl
      };
    })
  );

  const { error: productsError } = await supabase
    .from('products')
    .insert(processedProducts);

  if (productsError) {
    console.error('Products creation error:', productsError);
    throw new Error(`Failed to create products: ${productsError.message}`);
  }

  return store;
}

// Get store by slug with products
export async function getStoreBySlug(slug: string): Promise<StoreWithProducts | null> {
  const { data, error } = await supabase
    .from('stores')
    .select(`
      *,
      products (*)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Get store error:', error);
    throw new Error(`Failed to get store: ${error.message}`);
  }

  return data as StoreWithProducts;
}