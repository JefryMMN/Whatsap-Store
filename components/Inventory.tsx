
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef } from 'react';
import { Product } from '../types';
import { STORE_CATEGORIES } from '../constants';

interface InventoryProps {
  products: Product[];
  onUpdateProduct: (product: Product, action: 'add' | 'update' | 'delete') => void;
  currency: string;
}

const Inventory: React.FC<InventoryProps> = ({ products, onUpdateProduct, currency }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setImagePreview(product.image);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentProduct({
      id: `p-${Date.now()}`,
      currency: currency,
      category: 'Fashion',
      stock: 1,
      name: '',
      price: 0,
      description: ''
    });
    setImagePreview(null);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!currentProduct.name || !currentProduct.price) {
      alert("Name and Price are required.");
      return;
    }

    const productToSave = {
      ...currentProduct,
      image: imagePreview || 'https://via.placeholder.com/400',
      // Ensure compatibility fields are populated for the UI
      title: currentProduct.name,
      readTime: `${currency}${currentProduct.price}`,
      publisher: 'Store', 
      isFeatured: false, // Default
      variants: []
    } as Product;

    const action = products.find(p => p.id === productToSave.id) ? 'update' : 'add';
    onUpdateProduct(productToSave, action);
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    const p = products.find(prod => prod.id === id);
    if (p && window.confirm("Are you sure you want to delete this product?")) {
      onUpdateProduct(p, 'delete');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isEditing) {
    return (
      <div className="pt-32 pb-24 px-6 max-w-[800px] mx-auto animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            {products.find(p => p.id === currentProduct.id) ? 'Edit Product' : 'New Product'}
          </h2>
          <button 
            onClick={() => setIsEditing(false)}
            className="text-gray-400 hover:text-black font-bold uppercase tracking-widest text-xs"
          >
            Cancel
          </button>
        </div>

        <div className="clay-card p-8 bg-white border-2 border-black space-y-6">
           
           {/* Image Upload */}
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">Product Image</label>
              <div 
                className="w-full h-64 border-4 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-black hover:bg-gray-50 transition-all relative overflow-hidden group"
                onClick={() => fileInputRef.current?.click()}
              >
                 {imagePreview ? (
                   <>
                     <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white font-black uppercase tracking-widest text-xs">Change Image</span>
                     </div>
                   </>
                 ) : (
                   <div className="text-center text-gray-400">
                      <span className="text-4xl block mb-2">📷</span>
                      <span className="font-bold text-xs uppercase tracking-widest">Click to Upload</span>
                   </div>
                 )}
                 <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                 />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Name</label>
                <input 
                  value={currentProduct.name || ''}
                  onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-black outline-none font-bold rounded-lg"
                  placeholder="e.g. Retro Sneakers"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Price ({currency})</label>
                <input 
                  type="number"
                  value={currentProduct.price || ''}
                  onChange={e => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-black outline-none font-bold rounded-lg"
                  placeholder="0.00"
                />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Category</label>
                <select 
                  value={currentProduct.category}
                  onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-black outline-none font-bold rounded-lg bg-white"
                >
                  {STORE_CATEGORIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Stock Level</label>
                <input 
                  type="number"
                  value={currentProduct.stock || ''}
                  onChange={e => setCurrentProduct({...currentProduct, stock: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-black outline-none font-bold rounded-lg"
                  placeholder="1"
                />
              </div>
           </div>

           <div>
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Description</label>
              <textarea 
                value={currentProduct.description || ''}
                onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-black outline-none font-bold rounded-lg min-h-[120px]"
                placeholder="Describe your product..."
              />
           </div>

           <button 
             onClick={handleSave}
             className="w-full py-4 bg-black text-white font-black uppercase tracking-[0.2em] rounded-xl hover:bg-gray-800 transition-all"
           >
             Save Product
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-32 pb-24 px-6 max-w-[1200px] mx-auto animate-fade-in">
      <div className="flex justify-between items-end mb-12">
        <div>
          <span className="clay-text-convex mb-4 bg-black text-white border-none">Management</span>
          <h1 className="text-5xl font-black uppercase tracking-tighter">Inventory</h1>
        </div>
        <button 
          onClick={handleAddNew}
          className="px-8 py-4 bg-black text-white font-black uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-transform shadow-xl"
        >
          + Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="clay-card p-4 flex flex-col h-full group bg-white border border-gray-100 hover:border-black transition-all">
             <div className="relative aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-[10px] font-black rounded uppercase tracking-widest">
                  Stock: {product.stock}
                </div>
             </div>
             
             <div className="mb-2">
               <h3 className="font-bold text-lg leading-tight line-clamp-1">{product.name}</h3>
               <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">{product.category}</p>
             </div>
             
             <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="font-black text-xl">{currency}{product.price}</span>
                <div className="flex gap-2">
                   <button 
                     onClick={() => handleEdit(product)}
                     className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                   >
                     ✏️
                   </button>
                   <button 
                     onClick={() => handleDelete(product.id)}
                     className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                   >
                     🗑️
                   </button>
                </div>
             </div>
          </div>
        ))}
        
        {/* Empty State Add Button */}
        <button 
          onClick={handleAddNew}
          className="clay-card p-4 flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-300 text-gray-300 hover:border-black hover:text-black transition-all min-h-[300px]"
        >
           <span className="text-4xl mb-4">+</span>
           <span className="font-black uppercase tracking-widest text-xs">Add New Item</span>
        </button>
      </div>
    </div>
  );
};

export default Inventory;
