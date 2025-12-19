
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { INDUSTRIES } from '../constants';

const Exchange: React.FC = () => {
  return (
    <div className="py-32 px-6 flex flex-col items-center justify-center relative bg-white">
      <div className="text-center mb-24 max-w-3xl z-10">
        <span className="clay-text-convex mb-6">Pipeline Protocol</span>
        <h2 className="text-5xl md:text-7xl font-black text-black mb-8 leading-none tracking-tighter uppercase">Infinite <br/> Connections</h2>
        <p className="text-black text-lg font-bold uppercase tracking-tight">
            High-fidelity OCR connected to global CRM APIs. Precision networking is now strictly monochromatic.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-[1200px] w-full z-10 mb-24">
          {INDUSTRIES.map((ind, i) => (
              <div key={i} className="clay-card p-12 flex flex-col items-center justify-center text-center border-2 border-black hover:bg-black hover:text-white group">
                  <div className="text-5xl mb-6 grayscale group-hover:invert transition-all">{ind.icon}</div>
                  <h3 className="font-black uppercase tracking-widest text-sm">{ind.name}</h3>
              </div>
          ))}
      </div>

      <div className="z-10 bg-white p-12 border-4 border-black max-w-5xl w-full text-center shadow-2xl">
          <h3 className="text-3xl font-black text-black mb-12 uppercase tracking-[0.3em]">Automated Protocol</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {[
                  { n: "01", t: "SENSE", d: "Snap high-fidelity card image." },
                  { n: "02", t: "PARS", d: "Gemini AI extracts structured data." },
                  { n: "03", t: "AUGM", d: "AI finds recent industry intelligence." },
                  { n: "04", t: "SYNC", d: "Data pushed to CRM & LinkedIn." }
              ].map(step => (
                  <div key={step.n} className="space-y-4">
                      <div className="text-4xl font-black text-black/10 leading-none">{step.n}</div>
                      <h4 className="font-black text-black uppercase tracking-widest text-lg border-b-2 border-black pb-2">{step.t}</h4>
                      <p className="text-[10px] text-black font-black uppercase tracking-widest leading-relaxed">{step.d}</p>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default Exchange;
