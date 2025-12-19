
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { FEATURES, BRAND_NAME } from '../constants';

const Features: React.FC = () => {
  return (
    <section className="bg-white py-32 border-t-8 border-black">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-24">
          <span className="clay-text-convex mb-6">Capabilities</span>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight">
            Built for speed. <br/>
            Designed for humans.
          </h2>
          <p className="text-xl font-bold uppercase text-black/40 mt-6 tracking-tight max-w-2xl mx-auto">
            {BRAND_NAME} brings order back by centralizing every conversation, enriching it with context, and letting AI do the heavy lifting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {FEATURES.map((feature, idx) => (
            <div key={idx} className="p-10 border-4 border-black hover:bg-black hover:text-white transition-all group shadow-[12px_12px_0px_black]">
               <div className="text-5xl mb-10 grayscale group-hover:grayscale-0 transition-all">{feature.icon}</div>
               <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">{feature.title}</h3>
               <p className="font-bold text-sm uppercase tracking-tight leading-relaxed opacity-60 group-hover:opacity-100">
                 {feature.desc}
               </p>
            </div>
          ))}
        </div>

        {/* Workflow Section */}
        <div className="mt-40 grid grid-cols-1 lg:grid-cols-3 gap-20 items-center">
            <div className="lg:col-span-1">
               <h3 className="text-4xl font-black uppercase tracking-tighter mb-8 leading-none">How It Works</h3>
               <p className="font-bold uppercase text-black/40 tracking-widest text-xs">A simplified three-step protocol.</p>
            </div>
            <div className="lg:col-span-2 space-y-12">
               {[
                 { step: '01', title: 'Connect Your Channels', desc: 'Slack, email, and chat plug in instantly. No engineers required.' },
                 { step: '02', title: 'AI Organizes Chaos', desc: 'Frolo analyzes messages, tags them, prioritizes them, and creates summaries.' },
                 { step: '03', title: 'Respond Faster', desc: 'Your team reviews AI drafts, collaborates, and resolves in seconds.' }
               ].map((item) => (
                 <div key={item.step} className="flex gap-10 items-start border-b-4 border-black pb-8 group">
                    <span className="text-6xl font-black text-black/10 group-hover:text-black transition-colors">{item.step}</span>
                    <div>
                       <h4 className="text-xl font-black uppercase tracking-widest mb-2">{item.title}</h4>
                       <p className="font-bold text-sm uppercase text-black/60">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
        </div>

        {/* Quote Section */}
        <div className="mt-40 p-16 bg-black text-white text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="relative z-10">
               <p className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight italic">
                 “{BRAND_NAME} is the first support tool that feels like a superpower instead of a chore.”
               </p>
               <div className="mt-12 flex items-center justify-center gap-4">
                  <div className="w-12 h-1 bg-white"></div>
                  <span className="font-black uppercase tracking-[0.4em] text-xs">Early Access Quote</span>
               </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
