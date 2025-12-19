
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { FEATURES } from '../constants';

const Learn: React.FC = () => {
  return (
    <section className="py-24 px-6 max-w-[1200px] mx-auto bg-white/40 rounded-[60px] shadow-inner mb-20 border border-white/20">
      <div className="text-center mb-16">
        <span className="clay-text-convex text-xs font-bold uppercase tracking-widest text-[#2AB9A9] mb-4">The Solution</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#4A4A4A] mb-6">One Simple App for Any Small Business</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            We built ShopSmart to be so easy that anyone can start selling in seconds. 
            Powerful features, simplified for the real world.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {FEATURES.map((feat, idx) => (
           <div key={idx} className="clay-card p-8 flex flex-col items-start hover:-translate-y-2 transition-transform cursor-default group min-h-[280px]">
               <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-3xl mb-6 shadow-lg border border-white/20" style={{backgroundColor: feat.color}}>
                  {feat.icon}
               </div>
               <h3 className="text-xl font-extrabold text-[#4A4A4A] mb-3 leading-tight">{feat.title}</h3>
               <p className="text-sm text-gray-500 font-medium leading-relaxed">{feat.desc}</p>
           </div>
        ))}
      </div>

      <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-12 border-t border-gray-200/50 pt-20">
          <div className="text-center md:text-left">
              <h4 className="text-2xl font-bold text-[#4A4A4A] mb-2">Supports All Payments</h4>
              <p className="text-gray-500 font-medium">Cash, Card, QR codes, and digital wallets.</p>
          </div>
          <div className="flex gap-4">
              {['Cash', 'Visa', 'QR', 'Mobile'].map(p => (
                  <div key={p} className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[10px] font-bold text-gray-400 border border-gray-100">
                      {p}
                  </div>
              ))}
          </div>
      </div>
    </section>
  );
};

export default Learn;
