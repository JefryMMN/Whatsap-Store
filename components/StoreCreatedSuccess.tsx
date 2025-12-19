/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

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
  const [copied, setCopied] = useState(false);
  const [viewHovered, setViewHovered] = useState(false);
  const [whatsappHovered, setWhatsappHovered] = useState(false);

  const storeUrl = `${window.location.origin}/store/${storeSlug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = storeUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareOnWhatsApp = () => {
    const message = encodeURIComponent(`Check out my new store: ${storeUrl}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-24 md:pt-36 pb-24 px-4 md:px-6">
      {/* Back Button - in wider container */}
      <div className="max-w-[1200px] mx-auto">
        <button
          onClick={onClose}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-black font-bold transition-colors group text-sm"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back to Home
        </button>
      </div>

      {/* Content - in narrower centered container */}
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
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
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border-2 border-gray-100">
          <h3 className="font-black uppercase tracking-widest text-sm mb-4 text-center">
            Your Store Link
          </h3>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              value={storeUrl}
              readOnly
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="flex-1 w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-black font-bold bg-white cursor-pointer transition-colors"
            />
            <button
              onClick={handleCopyLink}
              className={`w-full md:w-auto px-6 py-3 font-bold uppercase tracking-widest rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
                copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-black text-white hover:bg-gray-800 active:scale-95'
              }`}
            >
              {copied ? (
                <>
                  <span>✓</span>
                  Copied!
                </>
              ) : (
                <>
                  <span>📋</span>
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {/* Share on WhatsApp */}
          <button
            onClick={handleShareOnWhatsApp}
            onMouseEnter={() => setWhatsappHovered(true)}
            onMouseLeave={() => setWhatsappHovered(false)}
            className="flex-1 px-8 py-4 bg-[#25D366] text-white font-black uppercase tracking-widest rounded-full hover:bg-[#1da851] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
          >
            <span className={`text-xl transition-transform ${whatsappHovered ? 'scale-125' : ''}`}>💬</span>
            Share on WhatsApp
          </button>

          {/* View My Store */}
          <button
            onClick={onViewStore}
            onMouseEnter={() => setViewHovered(true)}
            onMouseLeave={() => setViewHovered(false)}
            className="flex-1 px-8 py-4 bg-black text-white font-black uppercase tracking-widest rounded-full hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
          >
            <span className={`text-xl transition-transform ${viewHovered ? 'scale-125' : ''}`}>👁️</span>
            View My Store
          </button>
        </div>

        {/* Quick Tips */}
        <div className="bg-blue-50 rounded-2xl p-6 mb-6 border-2 border-blue-100">
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
            className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-full border-2 border-black hover:bg-black hover:text-white active:scale-95 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreCreatedSuccess;