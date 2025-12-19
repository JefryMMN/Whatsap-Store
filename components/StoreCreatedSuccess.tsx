/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

interface StoreCreatedSuccessProps {
  storeSlug: string;
  storeName: string;
  onClose: () => void;
  onViewStore: () => void;
}

const StoreCreatedSuccess: React.FC<StoreCreatedSuccessProps> = ({ 
  storeSlug, 
  storeName, 
  onClose, 
  onViewStore 
}) => {
  const storeUrl = `http://localhost:3000/store/${storeSlug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(storeUrl);
    // No popup/toast - silent copy
  };

  const handleShareOnWhatsApp = () => {
    const message = encodeURIComponent(`Check out my new store: ${storeUrl}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-32 pb-24 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✅</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-center mb-2">
          Your Store is Live!
        </h2>

        {/* Subtitle */}
        <p className="text-gray-500 font-bold text-center mb-8 text-base md:text-lg">
          Congratulations! Your store "{storeName}" has been created successfully. Share your unique link and start selling!
        </p>

        {/* Store Link Section */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 clay-card">
          <h3 className="font-black uppercase tracking-widest text-sm mb-4 text-center">
            Your Store Link
          </h3>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              value={storeUrl}
              readOnly
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none font-bold bg-white clay-card"
            />
            <button
              onClick={handleCopyLink}
              className="px-6 py-3 bg-black text-white font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-colors whitespace-nowrap clay-button"
            >
              Copy Link
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={handleShareOnWhatsApp}
            className="flex-1 px-8 py-4 bg-green-500 text-white font-bold uppercase tracking-widest rounded-full hover:bg-green-600 transition-colors flex items-center justify-center gap-2 clay-button"
          >
            <span>💬</span>
            Share on WhatsApp
          </button>
          <button
            onClick={onViewStore}
            className="flex-1 px-8 py-4 bg-black text-white font-bold uppercase tracking-widest rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 clay-button-primary"
          >
            <span>👁️</span>
            View My Store
          </button>
        </div>

        {/* Quick Tips */}
        <div className="bg-blue-50 rounded-2xl p-6 mb-6 clay-card">
          <h3 className="font-black uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
            <span>💡</span>
            Quick Tips
          </h3>
          <ul className="space-y-2 text-sm text-blue-700 font-bold">
            <li>• Share your store link on social media and with customers</li>
            <li>• Keep your WhatsApp active to receive orders</li>
            <li>• Update your products regularly to keep customers engaged</li>
          </ul>
        </div>

        {/* Close Button */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-full border-2 border-black hover:bg-black hover:text-white transition-colors clay-button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreCreatedSuccess;