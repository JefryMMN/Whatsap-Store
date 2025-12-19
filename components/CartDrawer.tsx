/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Paper } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Paper[];
  onRemoveItem: (paper: Paper) => void;
  onItemClick: (paper: Paper) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemoveItem, onItemClick }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-[#6A4FBF]/20 backdrop-blur-sm z-[10000] transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-[#F8E9DD] z-[10001] shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-white/40">
           <h2 className="text-2xl font-extrabold text-[#4A4A4A]">Your Watchlist</h2>
           <button onClick={onClose} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-[#6A4FBF] shadow-sm">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-8 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
               <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-inner">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#ccc" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                   </svg>
               </div>
               <p className="font-bold text-gray-400">Watchlist is empty</p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div 
                key={`${item.id}-${idx}`} 
                onClick={() => { onItemClick(item); onClose(); }}
                className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center cursor-pointer hover:shadow-md transition-all border border-transparent hover:border-[#FFB673]"
              >
                  <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#6A4FBF]">
                          {item.publisher.substring(0,1)}
                      </div>
                      <div>
                          <h4 className="font-bold text-[#4A4A4A]">{item.title}</h4>
                          <span className="text-xs text-gray-400 font-semibold">{item.publisher}</span>
                      </div>
                  </div>
                  <div className="flex items-center gap-4">
                      <span className="font-bold text-[#4A4A4A]">{item.readTime}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onRemoveItem(item); }}
                        className="text-gray-300 hover:text-red-400"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                         </svg>
                      </button>
                  </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/40 bg-white/50">
           <button className="clay-button w-full py-4 font-bold text-lg">
               Start Trading
           </button>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;