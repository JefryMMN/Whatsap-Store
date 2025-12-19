
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

const About: React.FC = () => {
  return (
    <div className="py-24 px-6 max-w-[1200px] mx-auto animate-fade-in-up relative">
       <div className="text-center mb-20 relative z-10">
         <span className="clay-text-convex text-xs font-bold uppercase tracking-widest text-[#6A4FBF] mb-6">The Problem</span>
         <h1 className="text-4xl md:text-6xl font-extrabold text-[#4A4A4A] mb-8 drop-shadow-sm leading-tight">
           Shops still struggle with <br/> messy notebooks and manual work.
         </h1>
         <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-medium">
           Managing a business shouldn't feel like a chore. Traditional software is too complex, and paper notebooks lead to errors and lost money.
         </p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24 relative z-10">
          <div className="relative h-[500px] clay-card clay-img-inset group">
             <img 
               src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070&auto=format&fit=crop" 
               alt="Messy shop counter" 
               className="w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105" 
             />
             <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="clay-card p-6 bg-white/95 backdrop-blur-sm rotate-3 shadow-2xl">
                    <span className="text-[#E6007A] font-bold text-lg">Stop the Chaos</span>
                </div>
             </div>
          </div>
          
          <div className="space-y-10">
             <h3 className="text-3xl font-extrabold text-[#4A4A4A]">Why merchants struggle:</h3>
             <ul className="space-y-6">
                {[
                    { t: "No track of daily sales", d: "Hard to see where your money goes at the end of the day." },
                    { t: "No customer records", d: "Forgetting your most loyal buyers and their preferences." },
                    { t: "Messy product organization", d: "Manually checking stock is slow and frustrating." },
                    { t: "Hard to know profit or loss", d: "Guesswork instead of real business growth." },
                    { t: "Complicated software", d: "Most POS systems require days of training. We require zero." }
                ].map((item, i) => (
                    <li key={i} className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-[#E6007A] flex shrink-0 items-center justify-center text-white text-xs font-bold">!</div>
                        <div>
                            <span className="block text-[#4A4A4A] font-extrabold text-lg leading-tight mb-1">{item.t}</span>
                            <span className="text-gray-500 font-medium">{item.d}</span>
                        </div>
                    </li>
                ))}
             </ul>
          </div>
       </div>
    </div>
  );
};

export default About;
