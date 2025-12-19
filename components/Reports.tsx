
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Contact, IntegrationLog } from '../types';

interface StatsProps {
  sales: IntegrationLog[];
  products: Contact[];
}

const Reports: React.FC<StatsProps> = ({ sales, products }) => {
  return (
    <div className="pt-40 pb-24 px-6 max-w-[1200px] mx-auto animate-fade-in bg-white">
      <div className="mb-20">
          <span className="clay-text-convex mb-4">Metrics protocol</span>
          <h1 className="text-6xl md:text-9xl font-black text-black tracking-tighter uppercase leading-none">Stats</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="p-10 bg-black text-white border-4 border-black">
              <span className="text-[11px] font-black uppercase text-white/40 mb-4 block tracking-[0.3em]">Network Size</span>
              <div className="text-6xl font-black tracking-tighter">{products.length}</div>
              <div className="mt-6 text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">ACTIVE IDENTITIES</div>
          </div>
          <div className="p-10 bg-white text-black border-4 border-black">
              <span className="text-[11px] font-black uppercase text-black/40 mb-4 block tracking-[0.3em]">Captured (24h)</span>
              <div className="text-6xl font-black tracking-tighter">12</div>
          </div>
          <div className="p-10 bg-white text-black border-4 border-black">
              <span className="text-[11px] font-black uppercase text-black/40 mb-4 block tracking-[0.3em]">Sync Success</span>
              <div className="text-6xl font-black tracking-tighter">100%</div>
          </div>
          <div className="p-10 bg-black text-white border-4 border-black">
              <span className="text-[11px] font-black uppercase text-white/40 mb-4 block tracking-[0.3em]">Time Utility</span>
              <div className="text-6xl font-black tracking-tighter">+45m</div>
              <div className="mt-6 text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">WEEKLY SAVINGS</div>
          </div>
      </div>

      <div className="p-16 bg-white border-8 border-black">
          <h3 className="text-4xl font-black mb-16 text-black uppercase tracking-tighter">Industry Clusters</h3>
          <div className="space-y-12">
              {[
                  { name: 'TECH & AI', count: 8 },
                  { name: 'FINANCE', count: 4 },
                  { name: 'MARKETING', count: 2 }
              ].map(i => (
                  <div key={i.name}>
                      <div className="flex justify-between text-sm font-black uppercase mb-4 tracking-widest">
                          <span>{i.name}</span>
                          <span>{i.count} UNITS</span>
                      </div>
                      <div className="w-full h-8 bg-black/5 border-2 border-black overflow-hidden">
                          <div className="h-full bg-black transition-all duration-1000" style={{ width: `${(i.count / products.length) * 100}%` }}></div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default Reports;
