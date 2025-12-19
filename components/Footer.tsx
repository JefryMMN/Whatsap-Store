
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { BRAND_NAME, COMPANY_NAME, DESIGN_STUDIO } from '../constants';

interface FooterProps {
  onLinkClick: (e: React.MouseEvent, targetId: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onLinkClick }) => {
  return (
    <footer className="relative pt-20 md:pt-40 pb-12 md:pb-20 px-6 mt-20 md:mt-32 bg-black text-white overflow-hidden border-t-8 border-black">
        <div className="max-w-[1200px] mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-20 mb-20 md:mb-32 pb-12 md:pb-24 border-b-4 md:border-b-8 border-white/20">
                <div className="text-center lg:text-left">
                    <h3 className="text-4xl md:text-8xl font-black mb-6 md:mb-8 leading-[0.85] tracking-tighter uppercase">
                        {BRAND_NAME} <br/>
                        <span className="text-white/30">COMMERCE.</span>
                    </h3>
                    <p className="text-white/60 text-sm md:text-lg font-black uppercase tracking-tight max-w-md mx-auto lg:mx-0 leading-relaxed">
                        DIRECT WHATSAPP ORDERING PROTOCOL.
                    </p>
                </div>

                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                    <h4 className="text-white font-black uppercase tracking-[0.5em] text-xs mb-8 md:mb-10 border-b-4 border-white pb-2">Quick Links</h4>
                    <ul className="space-y-4 md:space-y-6">
                        <li><a href="#" onClick={(e) => onLinkClick(e, 'store')} className="text-white/60 hover:text-white font-black uppercase tracking-widest text-xs md:text-sm transition-all">Storefront</a></li>
                        <li><a href="#" onClick={(e) => onLinkClick(e, 'dashboard')} className="text-white/60 hover:text-white font-black uppercase tracking-widest text-xs md:text-sm transition-all">Dashboard</a></li>
                        <li><a href="#" onClick={(e) => onLinkClick(e, 'privacy')} className="text-white/60 hover:text-white font-black uppercase tracking-widest text-xs md:text-sm transition-all">Privacy</a></li>
                        <li><a href="#" onClick={(e) => onLinkClick(e, 'terms')} className="text-white/60 hover:text-white font-black uppercase tracking-widest text-xs md:text-sm transition-all">Terms</a></li>
                    </ul>
                </div>

                <div className="flex flex-col gap-8 md:gap-10 justify-center lg:justify-end items-center lg:items-end">
                    <button 
                      onClick={(e) => onLinkClick(e, 'store')} 
                      className="clay-button bg-white text-black px-12 md:px-16 py-5 md:py-6 font-black uppercase tracking-[0.4em] text-xs hover:invert transition-all shadow-2xl"
                    >
                      Enter Shop
                    </button>
                    <div className="flex gap-8">
                        <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 cursor-pointer">INSTAGRAM</div>
                        <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 cursor-pointer">TWITTER</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-white animate-pulse shadow-[0_0_10px_white]"></div>
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.6em] text-white">SYSTEM ONLINE</span>
                    </div>
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/40">© 2025 {COMPANY_NAME.toUpperCase()} • {DESIGN_STUDIO.toUpperCase()}</p>
                </div>
                <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                   Monochromatic Precision • Designed for Scale
                </div>
            </div>
        </div>
        
        {/* Background Decoration */}
        <div className="absolute -bottom-20 -right-20 text-[15rem] md:text-[25rem] font-black text-white/5 pointer-events-none select-none">F</div>
    </footer>
  );
};

export default Footer;
