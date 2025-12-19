
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { Paper } from '../types';
import { getPublisherInfo } from '../constants';

interface ProductCardProps {
  product: Paper;
  onClick: (paper: Paper) => void;
  onUpvote: (id: string) => void;
  isUpvoted: boolean;
  onPublisherClick?: (publisher: string) => void;
  onToggleSave?: (paper: Paper) => void;
  isSaved?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onClick, 
  onUpvote, 
  isUpvoted, 
  onPublisherClick,
  onToggleSave,
  isSaved 
}) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isSaved) {
      setShouldAnimate(true);
      const timer = setTimeout(() => setShouldAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isSaved]);
  
  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSave) {
        onToggleSave(product);
    }
  };

  const publisherInfo = getPublisherInfo(product.publisher);

  return (
    <div 
        className="clay-card clay-bevel p-5 md:p-6 h-full flex flex-col justify-between cursor-pointer hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden group active:scale-[0.98]" 
        onClick={() => onClick(product)}
    >
      {/* 3D Depth Decoration */}
      <div 
        className="absolute -right-6 -top-6 w-24 h-24 md:w-32 md:h-32 shape-decoration-embedded opacity-60 transform group-hover:scale-110 transition-transform duration-700 pointer-events-none"
        style={{ color: publisherInfo.color }}
      ></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-4 md:mb-6">
             <div className="flex items-center gap-3">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-lg shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.2),2px_2px_4px_rgba(255,255,255,0.4)] border border-white/20" style={{ backgroundColor: publisherInfo.color }}>
                     {publisherInfo.logo}
                 </div>
                 <div>
                     <span className="block font-bold text-base md:text-lg text-[#4A4A4A] leading-tight line-clamp-1">{product.title || product.name}</span>
                     <span className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wide">{product.publisher || 'Store'}</span>
                 </div>
             </div>
             {/* Add Button - stylized as Save/Heart logic for compatibility but acts as add trigger hint */}
             <button 
                className={`w-8 h-8 md:w-10 md:h-10 clay-icon-btn ${shouldAnimate ? 'animate-pop' : ''} text-gray-300 hover:text-[#6A4FBF] flex items-center justify-center`}
              >
                 <span className="text-xl font-black text-black/20">+</span>
              </button>
        </div>

        {/* 3D Image Display */}
        {product.image && (
          <div className="mb-4 md:mb-6 h-32 md:h-40 w-full clay-img-inset relative group-hover:shadow-inner transition-shadow duration-500 rounded-xl overflow-hidden">
             <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-90" />
             <div className="absolute inset-0 bg-gradient-to-tr from-[#6A4FBF]/10 to-transparent pointer-events-none"></div>
          </div>
        )}

        <div className="mb-3 md:mb-4 flex items-baseline justify-between">
            {/* Price */}
            <span className="clay-text-convex mb-1">
                <span className="block text-xl md:text-2xl font-extrabold text-[#4A4A4A] tracking-tight">{product.currency}{product.price}</span>
            </span>
            <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">In Stock: {product.stock}</span>
        </div>
        
        <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-4 md:mb-6 font-medium line-clamp-3">
            {product.description}
        </p>

        {/* 3D Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
             {product.category && (
                 <span className="px-2 md:px-3 py-1 rounded-lg text-[9px] md:text-[10px] font-bold text-[#6A4FBF] clay-tag">
                     {product.category}
                 </span>
             )}
             {product.isFeatured && (
                 <span className="px-2 md:px-3 py-1 rounded-lg text-[9px] md:text-[10px] font-bold text-[#E6007A] clay-tag">
                     Featured
                 </span>
             )}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-200/50 flex justify-center items-center relative z-10">
          <span className="text-xs font-bold text-[#FFB673] uppercase tracking-widest group-hover:scale-105 transition-transform">Tap to Add</span>
      </div>
    </div>
  );
}

export default ProductCard;
