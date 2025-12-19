
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo } from 'react';
import { Paper } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  papers: Paper[];
  onProductClick: (paper: Paper) => void;
  onUpvote: (id: string) => void;
  userUpvotes: string[];
  onPublisherClick: (publisher: string) => void;
  onToggleSave: (paper: Paper) => void;
  savedPaperIds: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  hideFilters?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  papers, 
  onProductClick, 
  onUpvote, 
  userUpvotes, 
  onPublisherClick,
  onToggleSave,
  savedPaperIds,
  hideFilters = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter logic
  const filteredPapers = useMemo(() => {
    let result = papers;
    
    // Simple Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title?.toLowerCase().includes(q) || 
        p.name?.toLowerCase().includes(q) ||
        p.publisher?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [searchQuery, papers]);

  return (
    <section id="products" className="py-8 md:py-16 px-4 md:px-12 relative">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-6">
          <div className="w-full md:w-auto">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6A4FBF] mb-2 block">The Catalog</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#4A4A4A] mb-2 tracking-tight">
                Products
            </h2>
            <p className="text-sm md:text-lg text-gray-500">
                Select items to build your cart.
            </p>
          </div>

          {/* Search */}
          {!hideFilters && (
            <div className="relative w-full md:w-80">
                <input 
                    type="text" 
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl md:rounded-2xl px-5 py-3 text-sm md:text-base text-[#4A4A4A] outline-none focus:ring-2 focus:ring-[#FFB673] shadow-inner transition-all"
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#999" className="w-5 h-5 absolute right-4 top-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
          {filteredPapers.length > 0 ? (
            filteredPapers.map(paper => (
              <div key={paper.id} className="h-full">
                  <ProductCard 
                      product={paper} 
                      onClick={onProductClick}
                      onUpvote={onUpvote}
                      isUpvoted={userUpvotes.includes(paper.id)}
                      onPublisherClick={onPublisherClick}
                      onToggleSave={onToggleSave}
                      isSaved={savedPaperIds.includes(paper.id)}
                  />
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-400 font-bold text-lg">No products found.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
