/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

export interface ProductFormData {
  id: string;
  name: string;
  description: string;
  price: number;
  imageFile: File | null;
  imagePreview: string | null;
}

interface AddProductsFormProps {
  onNext: (products: ProductFormData[]) => void;
  onBack: () => void;
  currency: string;
}

const AddProductsForm: React.FC<AddProductsFormProps> = ({ onNext, onBack, currency }) => {
  const [products, setProducts] = useState<ProductFormData[]>([]);
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageFile: null as File | null,
    imagePreview: null as string | null
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: 'Please select an image file' });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Image size must be less than 5MB' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentProduct({
          ...currentProduct,
          imageFile: file,
          imagePreview: reader.result as string
        });
        setErrors({ ...errors, image: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateProduct = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!currentProduct.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!currentProduct.price || parseFloat(currentProduct.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (!currentProduct.imageFile) {
      newErrors.image = 'Product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddProduct = () => {
    if (validateProduct()) {
      const newProduct: ProductFormData = {
        id: Math.random().toString(36).substr(2, 9),
        name: currentProduct.name,
        description: currentProduct.description,
        price: parseFloat(currentProduct.price),
        imageFile: currentProduct.imageFile!,
        imagePreview: currentProduct.imagePreview!
      };

      setProducts([...products, newProduct]);

      // Reset form
      setCurrentProduct({
        name: '',
        description: '',
        price: '',
        imageFile: null,
        imagePreview: null
      });
      setErrors({});
    }
  };

  const handleRemoveProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleEditProduct = (product: ProductFormData) => {
    setCurrentProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      imageFile: product.imageFile,
      imagePreview: product.imagePreview
    });
    handleRemoveProduct(product.id);
  };

  const handleNext = () => {
    if (products.length === 0) {
      setErrors({ ...errors, general: 'Please add at least one product before continuing' });
      return;
    }
    onNext(products);
  };

  return (
    <div className="bg-[#FDFDFD] pt-24 md:pt-36 pb-24 px-4 md:px-6">
      {/* Back Button - in wider container */}
      <div className="max-w-[1200px] mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-black font-bold transition-colors group text-sm"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back
        </button>
      </div>

      {/* Content - in narrower centered container */}
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl border-2 border-black shadow-xl">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-8 border-b-2 border-black pb-6">
            <span className="inline-block px-3 py-1 bg-black text-white text-xs font-black uppercase tracking-widest rounded-full mb-4">Step 2 of 3</span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mt-4">Add Products</h2>
            <p className="text-gray-500 font-bold mt-2">Add at least 1 product to your store</p>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-600 font-bold text-sm text-center">⚠️ {errors.general}</p>
            </div>
          )}

          {/* Current Product Form */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6 border-2 border-gray-200">
            <h3 className="font-black uppercase tracking-widest text-sm mb-6">New Product</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block font-black uppercase tracking-widest text-xs mb-3">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentProduct.name}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                    placeholder="e.g., Fresh Mango"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black outline-none font-bold transition-all bg-white"
                  />
                  {errors.name && <p className="text-red-500 text-xs font-bold mt-2">{errors.name}</p>}
                </div>

                {/* Product Description */}
                <div>
                  <label className="block font-black uppercase tracking-widest text-xs mb-3">
                    Product Description
                  </label>
                  <textarea
                    value={currentProduct.description}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                    placeholder="Optional description..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black outline-none font-bold transition-all bg-white resize-none"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block font-black uppercase tracking-widest text-xs mb-3">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">
                      {currency}
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={currentProduct.price}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-black outline-none font-bold transition-all bg-white"
                    />
                  </div>
                  {errors.price && <p className="text-red-500 text-xs font-bold mt-2">{errors.price}</p>}
                </div>
              </div>

              {/* Right Column - Image */}
              <div>
                <label className="block font-black uppercase tracking-widest text-xs mb-3">
                  Product Image <span className="text-red-500">*</span>
                </label>
                {currentProduct.imagePreview ? (
                  <div className="relative">
                    <img
                      src={currentProduct.imagePreview}
                      alt="Product preview"
                      className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setCurrentProduct({ ...currentProduct, imageFile: null, imagePreview: null })}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-black hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-64 bg-white rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-all">
                    <span className="text-4xl mb-2">📷</span>
                    <span className="font-bold text-gray-400 text-sm">Click to upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
                {errors.image && <p className="text-red-500 text-xs font-bold mt-2">{errors.image}</p>}
                <p className="text-gray-400 text-xs font-bold mt-2">Max 5MB</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddProduct}
              className="px-8 py-4 bg-black text-white font-black uppercase tracking-widest rounded-full border-2 border-black hover:bg-gray-900 transition-all text-sm mt-6 w-full md:w-auto"
            >
              + ADD PRODUCT
            </button>
          </div>

          {/* Products List */}
          {products.length > 0 && (
            <div className="mb-6">
              <h3 className="font-black uppercase tracking-widest text-sm mb-4">
                Added Products ({products.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="p-4 flex gap-4 bg-white rounded-xl border-2 border-gray-200">
                    <img
                      src={product.imagePreview || ''}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-black text-sm mb-1">{product.name}</h4>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">{product.description || 'No description'}</p>
                      <p className="font-black">{currency}{product.price}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-xs font-bold text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemoveProduct(product.id)}
                        className="text-xs font-bold text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t-2 border-gray-100">
            <button
              type="button"
              onClick={onBack}
              className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest rounded-full border-2 border-black hover:bg-gray-100 transition-all text-sm flex-1"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={products.length === 0}
              className="px-8 py-4 bg-black rounded-full border-2 border-black hover:bg-gray-900 transition-all text-sm flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-white font-black uppercase tracking-widest">CREATE STORE →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductsForm;