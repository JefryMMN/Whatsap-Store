/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

interface StoreDetailsFormProps {
  onNext: (data: StoreFormData) => void;
  onCancel: () => void;
}

export interface StoreFormData {
  shopName: string;
  shopDescription: string;
  whatsappNumber: string;
  currency: string;
  logoFile: File | null;
  logoPreview: string | null;
}

const StoreDetailsForm: React.FC<StoreDetailsFormProps> = ({ onNext, onCancel }) => {
  const [formData, setFormData] = useState<StoreFormData>({
    shopName: '',
    shopDescription: '',
    whatsappNumber: '',
    currency: '₹',
    logoFile: null,
    logoPreview: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  const currencyOptions = [
    { value: '₹', label: '₹ (Indian Rupee)' },
    { value: '$', label: '$ (US Dollar)' },
    { value: '€', label: '€ (Euro)' },
    { value: 'AED', label: 'AED (UAE Dirham)' }
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, logo: 'Please select an image file' });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, logo: 'Image size must be less than 5MB' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          logoFile: file,
          logoPreview: reader.result as string
        });
        setErrors({ ...errors, logo: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.shopName.trim()) {
      newErrors.shopName = 'Shop name is required';
    }

    if (!formData.shopDescription.trim()) {
      newErrors.shopDescription = 'Shop description is required';
    }

    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'WhatsApp number is required';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.whatsappNumber.replace(/\s/g, ''))) {
      newErrors.whatsappNumber = 'Please enter a valid WhatsApp number with country code (e.g., +919876543210)';
    }

    if (!formData.logoFile) {
      newErrors.logo = 'Shop logo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
  };

  const handleCurrencySelect = (value: string) => {
    setFormData({ ...formData, currency: value });
    setIsCurrencyOpen(false);
  };

  return (
    <div className="bg-[#FDFDFD] pt-24 md:pt-36 pb-24 px-4 md:px-6">
      {/* Back Button - in wider container */}
      <div className="max-w-[1200px] mx-auto">
        <button
          onClick={onCancel}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-black font-bold transition-colors group text-sm"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back to Home
        </button>
      </div>

      {/* Content - in narrower centered container */}
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border-2 border-black shadow-xl">
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-8 border-b-2 border-black pb-6">
            <span className="clay-text-convex bg-black text-white border-none mb-4">Step 1 of 3</span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mt-4">Store Details</h2>
            <p className="text-gray-500 font-bold mt-2">Tell us about your shop</p>
          </div>

          {/* Shop Name */}
          <div className="mb-6">
            <label className="block font-black uppercase tracking-widest text-xs mb-3">
              Shop Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.shopName}
              onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
              placeholder="e.g., Fresh Fruit Market"
              className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none font-bold transition-all clay-card"
            />
            {errors.shopName && <p className="text-red-500 text-xs font-bold mt-2">{errors.shopName}</p>}
          </div>

          {/* Shop Description */}
          <div className="mb-6">
            <label className="block font-black uppercase tracking-widest text-xs mb-3">
              Shop Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.shopDescription}
              onChange={(e) => setFormData({ ...formData, shopDescription: e.target.value })}
              placeholder="Describe what you sell..."
              rows={4}
              className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none font-bold transition-all clay-card resize-none"
            />
            {errors.shopDescription && <p className="text-red-500 text-xs font-bold mt-2">{errors.shopDescription}</p>}
          </div>

          {/* WhatsApp Number */}
          <div className="mb-6">
            <label className="block font-black uppercase tracking-widest text-xs mb-3">
              WhatsApp Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              placeholder="+919876543210"
              className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-black outline-none font-bold transition-all clay-card"
            />
            <p className="text-gray-400 text-xs font-bold mt-2">Include country code (e.g., +91 for India)</p>
            {errors.whatsappNumber && <p className="text-red-500 text-xs font-bold mt-2">{errors.whatsappNumber}</p>}
          </div>

          {/* Currency - Custom Dropdown */}
          <div className="mb-6 relative">
            <label className="block font-black uppercase tracking-widest text-xs mb-3">
              Currency
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus-within:border-black outline-none font-bold transition-all clay-card text-left flex justify-between items-center group hover:border-black"
              >
                <span>{formData.currency}</span>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${isCurrencyOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isCurrencyOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-2xl overflow-hidden">
                  {currencyOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleCurrencySelect(option.value)}
                      className={`w-full px-5 py-3 text-left font-bold transition-all hover:bg-gray-50 focus:bg-gray-50 ${
                        formData.currency === option.value ? 'bg-black text-white' : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Logo Upload */}
          <div className="mb-8">
            <label className="block font-black uppercase tracking-widest text-xs mb-3">
              Shop Logo <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              {formData.logoPreview ? (
                <div className="relative">
                  <img
                    src={formData.logoPreview}
                    alt="Logo preview"
                    className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, logoFile: null, logoPreview: null })}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center font-black text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-2xl">📷</span>
                </div>
              )}
              <label className="px-6 py-3 cursor-pointer text-xs bg-white text-black font-black uppercase tracking-widest rounded-full border-2 border-black hover:bg-gray-100 transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                Upload Logo
              </label>
            </div>
            {errors.logo && <p className="text-red-500 text-xs font-bold mt-2">{errors.logo}</p>}
            <p className="text-gray-400 text-xs font-bold mt-2">Recommended: 500x500px, max 5MB</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t-2 border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-4 text-sm flex-1 bg-white text-black font-black uppercase tracking-widest rounded-full border-2 border-black hover:bg-gray-100 transition-all"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-8 py-4 text-sm flex-1 bg-black text-white font-black uppercase tracking-widest rounded-full border-2 border-black hover:bg-gray-900 transition-all"
            >
              ADD PRODUCTS →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoreDetailsForm;