/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { BRAND_NAME } from '../constants';
import { AppView } from '../types';

interface NavbarProps {
  onNavClick: (targetId: string) => void;
  activeView: AppView;
}

const Navbar: React.FC<NavbarProps> = ({ onNavClick, activeView }) => {
  return (
    <div className="fixed top-4 md:top-8 left-0 w-full px-2 md:px-6 flex justify-center z-[150]">
      <nav className="w-full max-w-[1200px] flex items-center justify-between px-4 md:px-8 py-4 md:py-6 bg-white/90 backdrop-blur-md border-2 md:border-4 border-black relative shadow-2xl rounded-xl md:rounded-2xl">
        
        <div className="flex items-center gap-3 md:gap-4 cursor-pointer group" onClick={() => onNavClick('landing')}>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-black flex items-center justify-center text-white font-black text-sm md:text-lg group-hover:scale-110 transition-transform shadow-md">S</div>
          <span className="font-black text-lg md:text-xl text-black tracking-tighter uppercase hidden sm:block">{BRAND_NAME}</span>
        </div>

        <div className="flex items-center gap-1.5 md:gap-4 overflow-x-auto no-scrollbar">
           {[
             { id: 'store', label: 'Shop' },
             { id: 'inventory', label: 'Items' }
           ].map((nav) => (
             <button 
                key={nav.id}
                onClick={() => onNavClick(nav.id)} 
                className={`px-3 md:px-6 py-2 md:py-3 text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] transition-all rounded-lg md:rounded-xl border md:border-2 whitespace-nowrap ${activeView === nav.id ? 'bg-black text-white border-black' : 'text-black border-transparent hover:border-black/20 hover:bg-gray-50'}`}
             >
               {nav.label}
             </button>
           ))}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;