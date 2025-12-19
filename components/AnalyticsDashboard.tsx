
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Ticket } from '../types';

interface AnalyticsProps {
  tickets: Ticket[];
}

const AnalyticsDashboard: React.FC<AnalyticsProps> = ({ tickets }) => {
  const total = tickets.length;
  const resolved = tickets.filter(t => t.status === 'closed').length;
  
  const sentimentCounts = tickets.reduce((acc: any, t) => {
    const s = t.sentiment || 'neutral';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 md:p-16 max-w-[1200px] mx-auto animate-fade-in bg-white overflow-y-auto no-scrollbar">
      <div className="mb-16">
        <span className="clay-text-convex mb-4">Signal Intelligence</span>
        <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter border-b-8 border-black pb-8 leading-none">Intelligence</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {[
          { label: 'Signal Stream', value: total, sub: '+8% INFLOW' },
          { label: 'Resolution Factor', value: `${total > 0 ? Math.round((resolved/total)*100) : 0}%`, sub: 'EFFICIENCY TARGET' },
          { label: 'Mean Response', value: '18m', sub: '-4m IMPROVEMENT' },
          { label: 'AI Leverage', value: '94%', sub: 'AUTONOMOUS REPLIES' }
        ].map((m, i) => (
          <div key={i} className="p-8 border-4 border-black hover:bg-black hover:text-white transition-all group shadow-[10px_10px_0px_rgba(0,0,0,0.05)]">
            <span className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-3 block group-hover:text-white/60">{m.label}</span>
            <div className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">{m.value}</div>
            <span className="text-[7px] font-black uppercase tracking-[0.2em]">{m.sub}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 p-10 border-4 border-black">
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 border-b-4 border-black pb-4">Sentiment Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             {['frustrated', 'neutral', 'positive', 'urgent_escalation'].map(s => {
               const count = sentimentCounts[s] || 0;
               const pct = total > 0 ? Math.round((count / total) * 100) : 0;
               return (
                 <div key={s} className="flex flex-col">
                   <span className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-40">{s.replace('_', ' ')}</span>
                   <div className="text-2xl font-black mb-2">{pct}%</div>
                   <div className="w-full h-1 bg-black/5 border border-black/10">
                      <div className="h-full bg-black transition-all duration-1000" style={{ width: `${pct}%` }}></div>
                   </div>
                 </div>
               );
             })}
          </div>
        </div>

        <div className="p-10 border-4 border-black bg-black text-white flex flex-col justify-between shadow-2xl">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tighter mb-4 border-b-2 border-white/20 pb-2">Priority Protocol</h3>
            <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed opacity-60">
              URGENT SECTOR LOAD: <span className="text-white opacity-100">{tickets.filter(t => t.priority === 'urgent').length} UNITS</span>
            </p>
          </div>
          <div className="mt-8">
             <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
             <span className="text-[8px] font-black uppercase tracking-[0.3em] block mt-4">REAL-TIME AGGREGATION...</span>
          </div>
        </div>
      </div>

      <div className="mt-16 p-10 bg-gray-50 border-4 border-black border-dashed">
         <h3 className="text-xl font-black uppercase tracking-tighter mb-8">Channel Efficiency Map</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {['SLACK', 'EMAIL', 'CHAT WIDGET'].map(c => (
              <div key={c} className="space-y-4">
                 <div className="text-[10px] font-black tracking-widest">{c}</div>
                 <div className="h-20 w-1 bg-black mx-auto relative overflow-hidden">
                    <div className="absolute bottom-0 w-full bg-black/10 h-full animate-pulse"></div>
                    <div className="absolute bottom-0 w-full bg-black h-1/2"></div>
                 </div>
                 <div className="text-[8px] font-black opacity-40">PROTOCOL STABLE</div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
