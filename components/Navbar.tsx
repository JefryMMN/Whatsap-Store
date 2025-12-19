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
  user: any;
  onSignIn: () => void;
  onSignOut: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavClick, activeView, user, onSignIn, onSignOut }) => {
  return (
    <div className="fixed top-4 md:top-8 left-0 w-full px-2 md:px-6 flex justify-center z-[150]">
      <nav className="w-full max-w-[1200px] flex items-center justify-between px-4 md:px-8 py-4 md:py-6 bg-white/90 backdrop-blur-md border-2 md:border-4 border-black relative shadow-2xl rounded-xl md:rounded-2xl">
        
        {/* Logo */}
        <div className="flex items-center gap-3 md:gap-4 cursor-pointer group" onClick={() => onNavClick('landing')}>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-black flex items-center justify-center text-white font-black text-sm md:text-lg group-hover:scale-110 transition-transform shadow-md">S</div>
          <span className="font-black text-lg md:text-xl text-black tracking-tighter uppercase hidden sm:block">{BRAND_NAME}</span>
        </div>

        {/* Nav Items + Auth Button */}
        <div className="flex items-center gap-1.5 md:gap-3 overflow-x-auto no-scrollbar">
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

           {/* Divider */}
           <div className="w-px h-6 bg-gray-300 mx-1 md:mx-2 hidden sm:block"></div>

           {/* Auth Button */}
           {!user ? (
             <button 
               onClick={onSignIn}
               className="px-3 md:px-5 py-2 md:py-2.5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.15em] bg-black text-white rounded-lg md:rounded-xl hover:bg-gray-800 transition-colors whitespace-nowrap"
             >
               Sign In
             </button>
           ) : (
             <button 
               onClick={onSignOut}
               className="px-3 md:px-5 py-2 md:py-2.5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.15em] bg-red-500 text-white rounded-lg md:rounded-xl hover:bg-red-600 transition-colors whitespace-nowrap"
             >
               Logout
             </button>
           )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
