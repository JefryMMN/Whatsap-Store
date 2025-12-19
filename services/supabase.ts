/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase credentials
// Get them from: https://app.supabase.com/project/_/settings/api
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper function to upload image to Supabase Storage
export async function uploadImage(file: File): Promise<string> {
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.name}`;

  const { data, error } = await supabase.storage
    .from('store-images')
    .upload(fileName, file);

  if (error) {
    console.error('Upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from('store-images')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

// Helper function to generate unique slug
export async function generateUniqueSlug(name: string): Promise<string> {
  let slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Check if slug exists
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
  imageFile: File;
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
}

export interface SupabaseProduct {
  id: string;
  store_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  created_at: string;
}

export interface StoreWithProducts extends SupabaseStore {
  products: SupabaseProduct[];
}

// Create store with products
export async function createStore(storeData: StoreData, products: ProductData[]): Promise<SupabaseStore> {
  // Generate unique slug
  const slug = await generateUniqueSlug(storeData.name);

  // Upload logo if exists
  let logoUrl = null;
  if (storeData.logoFile) {
    logoUrl = await uploadImage(storeData.logoFile);
  }

  // Insert store
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .insert({
      slug,
      name: storeData.name,
      description: storeData.description,
      whatsapp_number: storeData.whatsappNumber,
      logo_url: logoUrl,
      currency: storeData.currency
    })
    .select()
    .single();

  if (storeError) {
    console.error('Store creation error:', storeError);
    throw new Error(`Failed to create store: ${storeError.message}`);
  }

  // Upload product images and insert products
  for (const product of products) {
    const imageUrl = await uploadImage(product.imageFile);

    const { error: productError } = await supabase
      .from('products')
      .insert({
        store_id: store.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image_url: imageUrl
      });

    if (productError) {
      console.error('Product creation error:', productError);
      throw new Error(`Failed to create product: ${productError.message}`);
    }
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
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    console.error('Get store error:', error);
    throw new Error(`Failed to get store: ${error.message}`);
  }

  return data as StoreWithProducts;
}
