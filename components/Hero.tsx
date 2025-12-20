
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { BRAND_NAME } from '../constants';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <section className="relative overflow-hidden pt-32 md:pt-48 pb-20 md:pb-32 px-4 md:px-6 z-0 bg-[#FAFAFA]">
      {/* Background Gradient - Orange/Peach to Blue style like reference image */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main orange gradient - right side (dominant) */}
        <div className="absolute -top-[10%] -right-[5%] w-[65%] h-[90%]" style={{
          background: 'linear-gradient(220deg, #E8954A 0%, #F2A85D 15%, #F7BC7D 35%, #FBCEA0 55%, #FDE4C8 75%, transparent 100%)',
          opacity: 1,
          filter: 'blur(40px)',
        }}></div>

        {/* Secondary warm accent - extends orange coverage */}
        <div className="absolute top-[5%] right-0 w-[45%] h-[70%]" style={{
          background: 'linear-gradient(200deg, #E8954A 0%, #F2A85D 30%, transparent 80%)',
          opacity: 0.8,
          filter: 'blur(50px)',
        }}></div>

        {/* Blue/Cyan gradient - bottom left (prominent) */}
        <div className="absolute -bottom-[15%] -left-[10%] w-[70%] h-[65%]" style={{
          background: 'linear-gradient(35deg, #5AAFC7 0%, #6EC4D8 20%, #8AD4E5 40%, #A8E2EF 60%, #C8EEF5 80%, transparent 100%)',
          opacity: 0.95,
          filter: 'blur(45px)',
        }}></div>

        {/* Secondary blue accent - reinforces bottom left */}
        <div className="absolute bottom-0 left-[5%] w-[50%] h-[50%]" style={{
          background: 'radial-gradient(ellipse at 30% 80%, #6EC4D8 0%, #8AD4E5 30%, transparent 70%)',
          opacity: 0.7,
          filter: 'blur(40px)',
        }}></div>

        {/* Center/Left white area - keeps content readable */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 35% 45%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 25%, rgba(255,255,255,0.3) 50%, transparent 75%)',
        }}></div>

        {/* Soft cream layer for warmth */}
        <div className="absolute top-[20%] left-[15%] w-[50%] h-[60%]" style={{
          background: 'radial-gradient(ellipse, rgba(253,250,245,0.9) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}></div>
      </div>
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left z-10 order-2 lg:order-1">
            <span className="inline-block px-4 md:px-6 py-2 bg-[#25D366] text-white font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] mb-6 md:mb-8 shadow-xl rounded-full">
                Sell on WhatsApp
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-black leading-[0.95] md:leading-[0.9] mb-6 md:mb-8 tracking-tighter uppercase">
                Your Store.<br/>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-500">
                    Simplified.
                </span>
            </h1>
            <p className="text-lg md:text-2xl text-black/60 mb-8 md:mb-12 max-w-md md:max-w-lg leading-relaxed font-bold tracking-tight px-4 lg:px-0">
                Create a stunning product catalog in seconds. Let customers order directly via WhatsApp message. No fees, no fuss.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full sm:w-auto px-6 sm:px-0">
                <button 
                    onClick={onStart}
                    className="clay-button-primary px-8 md:px-12 py-5 md:py-6 text-lg md:text-xl font-black uppercase tracking-[0.2em] shadow-[6px_6px_0px_#000000] md:shadow-[8px_8px_0px_#000000] hover:translate-y-[-4px] hover:shadow-[10px_10px_0px_#000000] transition-all border-2 border-black bg-white text-black"
                >
                    Create Store
                </button>
            </div>
            
            <div className="mt-12 md:mt-16 flex items-center gap-4 opacity-40">
               <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Powered By</span>
               <div className="h-px w-8 md:w-10 bg-black"></div>
               <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Schroeder Tech</span>
            </div>
        </div>

        <div className="relative flex justify-center order-1 lg:order-2 mt-8 lg:mt-0">
            {/* Phone Mockup - Scaled down slightly on mobile */}
            <div className="relative w-[260px] h-[500px] md:w-[320px] md:h-[600px] bg-black rounded-[30px] md:rounded-[40px] p-3 md:p-4 shadow-2xl rotate-[-3deg] md:rotate-[-5deg] border-4 border-black">
                <div className="w-full h-full bg-white rounded-[24px] md:rounded-[32px] overflow-hidden flex flex-col relative">
                    {/* Mockup Header */}
                    <div className="bg-[#f0f0f0] p-3 md:p-4 flex items-center gap-3 border-b border-gray-200">
                        <div className="w-6 h-6 md:w-8 md:h-8 bg-black rounded-full text-white flex items-center justify-center text-[10px] md:text-xs font-bold">S</div>
                        <div className="flex-1">
                            <div className="h-1.5 md:h-2 w-16 md:w-20 bg-black/20 rounded mb-1"></div>
                            <div className="h-1 md:h-1.5 w-10 md:w-12 bg-black/10 rounded"></div>
                        </div>
                    </div>
                    {/* Mockup Body */}
                    <div className="flex-1 p-3 md:p-4 space-y-3 md:space-y-4 bg-white">
                        <div className="flex gap-2 overflow-x-hidden">
                            <div className="w-16 md:w-20 h-6 md:h-8 bg-black rounded-full"></div>
                            <div className="w-16 md:w-20 h-6 md:h-8 bg-gray-100 rounded-full"></div>
                            <div className="w-16 md:w-20 h-6 md:h-8 bg-gray-100 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 md:gap-3">
                            <div className="aspect-square bg-gray-100 rounded-lg md:rounded-xl"></div>
                            <div className="aspect-square bg-gray-100 rounded-lg md:rounded-xl"></div>
                            <div className="aspect-square bg-gray-100 rounded-lg md:rounded-xl"></div>
                            <div className="aspect-square bg-gray-100 rounded-lg md:rounded-xl"></div>
                        </div>
                    </div>
                    {/* Mockup Overlay Button */}
                    <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 h-10 md:h-12 bg-[#25D366] rounded-lg md:rounded-xl flex items-center justify-center text-white font-black text-[10px] md:text-xs uppercase tracking-widest shadow-lg">
                        Order on WhatsApp
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
