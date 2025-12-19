/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useMemo } from 'react';
import { Paper } from '../types';
import { getPublisherInfo, GLOSSARY } from '../constants';
import ProductCard from './ProductCard';

interface ProductDetailProps {
  product: Paper;
  relatedPapers: Paper[];
  onBack: () => void;
  onToggleSave: (paper: Paper) => void;
  isSaved: boolean;
  onPublisherClick?: (name: string) => void;
  onProductClick: (paper: Paper) => void;
}

// Helper component to render text with glossary tooltips
const TextWithTooltips: React.FC<{ text: string }> = ({ text }) => {
  const processedContent = useMemo(() => {
    // Escape special regex characters
    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Sort keys by length (descending) to match longest phrases first
    const keys = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
    const pattern = new RegExp(`\\b(${keys.map(escapeRegExp).join('|')})\\b`, 'gi');

    const parts = text.split(pattern);
    
    return parts.map((part, index) => {
      // Check if part matches a glossary key (case-insensitive)
      const matchedKey = keys.find(key => key.toLowerCase() === part.toLowerCase());
      
      if (matchedKey) {
        return (
          <span key={index} className="tooltip-trigger inline-block">
            {part}
            <span className="tooltip-content">
              {GLOSSARY[matchedKey]}
            </span>
          </span>
        );
      }
      return part;
    });
  }, [text]);

  return <p>{processedContent}</p>;
};

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, 
  relatedPapers,
  onBack, 
  onToggleSave, 
  isSaved,
  onProductClick
}) => {
  const publisherInfo = getPublisherInfo(product.publisher);

  return (
    <div className="min-h-screen pt-12 pb-24 px-6 animate-fade-in-up relative overflow-hidden">
      
      {/* 3D Decorative Floating Coins/Shapes */}
      <div className="absolute top-20 right-[-5%] w-64 h-64 rounded-full bg-gradient-to-br from-[#FFB673] to-[#FFD447] opacity-10 blur-3xl animate-float-delayed pointer-events-none"></div>
      <div className="absolute bottom-40 left-[-5%] w-80 h-80 rounded-full bg-gradient-to-tr from-[#6A4FBF] to-[#2AB9A9] opacity-10 blur-3xl animate-float pointer-events-none"></div>

      <div className="max-w-[1000px] mx-auto relative z-10">
        
        {/* Navigation */}
        <button 
            onClick={onBack}
            className="flex items-center gap-2 font-bold text-gray-500 hover:text-[#6A4FBF] transition-colors mb-8 group"
        >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
            </div>
            Back to Modules
        </button>

        {/* Main Content Card */}
        <div className="clay-card p-8 md:p-12 relative overflow-hidden bg-white/80 backdrop-blur-md">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
                <div className="w-24 h-24 rounded-[30px] flex items-center justify-center text-white text-4xl font-bold shadow-[10px_10px_20px_#d1d5db,-10px_-10px_20px_#ffffff] shrink-0" style={{ backgroundColor: publisherInfo.color }}>
                    {publisherInfo.logo}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                             <h1 className="text-4xl md:text-5xl font-extrabold text-[#4A4A4A] mb-2">{product.title}</h1>
                             <div className="flex gap-3 text-sm font-semibold text-gray-500">
                                 <span className="clay-tag px-3 py-1 rounded-lg">{product.publisher}</span>
                                 <span className="clay-tag px-3 py-1 rounded-lg">Ages {product.publicationDate}</span>
                                 <span className="bg-[#e6fffa] text-[#2AB9A9] px-3 py-1 rounded-lg shadow-sm">Verified Curriculum</span>
                             </div>
                        </div>
                        <button 
                            onClick={() => onToggleSave(product)}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff] active:shadow-[inset_4px_4px_8px_#d1d5db,inset_-4px_-4px_8px_#ffffff] ${isSaved ? 'bg-[#FFD447] text-white animate-pop' : 'bg-[#F8E9DD] text-gray-400 hover:text-[#6A4FBF]'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Price Block -> Learning Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-[#F8E9DD] rounded-2xl p-6 shadow-inner">
                    <span className="block text-sm font-bold text-gray-500 mb-1">Difficulty</span>
                    <span className="clay-text-convex">
                       <span className="block text-3xl font-extrabold text-[#4A4A4A]">{product.readTime}</span>
                    </span>
                </div>
                <div className="bg-[#e6fffa] rounded-2xl p-6 shadow-inner border border-[#2AB9A9]/10">
                    <span className="block text-sm font-bold text-[#2AB9A9] mb-1">XP Reward</span>
                    <span className="block text-3xl font-extrabold text-[#2AB9A9]">+{product.upvotes} XP</span>
                </div>
                <div className="bg-[#f3e8ff] rounded-2xl p-6 shadow-inner border border-[#6A4FBF]/10">
                    <span className="block text-sm font-bold text-[#6A4FBF] mb-1">Est. Time</span>
                    <span className="block text-3xl font-extrabold text-[#6A4FBF]">20 Mins</span>
                </div>
            </div>

            {/* Description with Tooltips */}
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-medium mb-12">
                <h3 className="text-[#4A4A4A] font-bold text-2xl mb-4">About This Module</h3>
                <TextWithTooltips text={product.abstract} />
                <br/>
                <TextWithTooltips text={product.description || ""} />
            </div>

            {/* Insights */}
            {product.aiInsights && (
                <div className="mb-12">
                    <h3 className="text-[#4A4A4A] font-bold text-xl mb-6">Learning Outcomes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product.aiInsights.map((insight, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-[4px_4px_10px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
                                <div className="w-2 h-2 rounded-full bg-[#FFB673] mt-2 shrink-0 shadow-[0_0_5px_#FFB673]"></div>
                                <span className="text-sm font-semibold text-gray-600">{insight}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                 <button className="clay-button w-full py-4 font-bold text-lg bg-[#F8E9DD] text-[#4A4A4A]">Start Lesson</button>
                 <button className="w-full py-4 font-bold text-lg rounded-full bg-white border border-gray-200 text-[#4A4A4A] hover:bg-gray-50 shadow-sm hover:shadow-md transition-all">Download Teacher Guide</button>
            </div>
        </div>

        {/* Related Assets Section */}
        {relatedPapers.length > 0 && (
            <div className="mt-20">
                <h3 className="text-2xl font-extrabold text-[#4A4A4A] mb-8 px-2">Related Modules</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {relatedPapers.map(paper => (
                        <div key={paper.id} className="h-full">
                            <ProductCard 
                                product={paper} 
                                onClick={onProductClick}
                                onUpvote={() => {}} 
                                isUpvoted={false}
                                onToggleSave={onToggleSave}
                                isSaved={isSaved} 
                            />
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;