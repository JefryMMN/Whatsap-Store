
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

const Community: React.FC = () => {
  return (
    <section className="py-24 px-6 max-w-[1200px] mx-auto min-h-screen flex flex-col justify-center">
      <div className="text-center mb-16">
        <span className="clay-text-convex text-xs font-bold uppercase tracking-widest text-[#6A4FBF] mb-4">Partner With Us</span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#4A4A4A] mb-4 leading-tight">Earn Money by Selling Our App</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
            Anyone can become a reseller. Show the app to local shops and earn a commission for each signup.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
              { t: "Show & Sell", d: "Simply demonstrate the app to local merchants.", i: "📱" },
              { t: "Help Onboard", d: "Help them set up their first 5 products.", i: "🤝" },
              { t: "Earn Commissions", d: "Get paid for every merchant that subscribes.", i: "💰" },
          ].map((item, idx) => (
              <div key={idx} className="clay-card p-10 flex flex-col items-center text-center hover:scale-[1.02] transition-transform">
                  <div className="text-5xl mb-6">{item.i}</div>
                  <h3 className="font-extrabold text-2xl text-[#4A4A4A] mb-2">{item.t}</h3>
                  <p className="text-gray-500 font-medium">{item.d}</p>
              </div>
          ))}
      </div>

      <div className="clay-card p-12 bg-[#6A4FBF] text-white text-center relative overflow-hidden">
          <div className="relative z-10">
              <h3 className="text-4xl font-extrabold mb-6">Start Your Business Today</h3>
              <p className="mb-10 text-white/80 max-w-2xl mx-auto text-lg font-medium">
                  We provide the training, the materials, and the app. You provide the local connections. 
                  Perfect for students, freelancers, or anyone looking for extra income.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <button className="px-10 py-4 rounded-full bg-white text-[#6A4FBF] font-extrabold shadow-2xl hover:scale-105 transition-transform text-lg">
                      Become a Reseller
                  </button>
                  <button className="px-10 py-4 rounded-full bg-transparent border-2 border-white/30 text-white font-extrabold hover:bg-white/10 transition-colors text-lg">
                      Download Seller Guide
                  </button>
              </div>
          </div>
          
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#FFB673] opacity-20 rounded-full blur-3xl mix-blend-screen"></div>
      </div>
    </section>
  );
};

export default Community;
