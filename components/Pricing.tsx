
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

const Pricing: React.FC = () => {
  const plans = [
    { 
      name: "Monthly", 
      price: "$19", 
      period: "/month",
      features: ["Unlimited Sales", "Inventory Manager", "Customer CRM", "Email Reports"],
      color: "#FFB673"
    },
    { 
      name: "Annual", 
      price: "$159", 
      period: "/year",
      features: ["Everything in Monthly", "2 Months Free", "Priority Support", "Custom QR Codes"],
      color: "#6A4FBF",
      popular: true
    }
  ];

  return (
    <section className="py-24 px-6 bg-white/20">
      <div className="max-w-[1000px] mx-auto text-center mb-16">
        <span className="clay-text-convex text-xs font-bold uppercase tracking-widest text-[#6A4FBF] mb-4">Simple Pricing</span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#4A4A4A] mb-6">Pricing for Every Shop</h2>
        <p className="text-lg text-gray-500 font-medium">No hidden fees. No complicated contracts. Just simple plans.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-[900px] mx-auto">
        {plans.map((plan, idx) => (
          <div key={idx} className={`clay-card p-12 relative flex flex-col items-center ${plan.popular ? 'border-2 border-[#6A4FBF]' : ''}`}>
             {plan.popular && (
                <div className="absolute -top-4 bg-[#6A4FBF] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Most Popular</div>
             )}
             <h3 className="text-2xl font-extrabold text-[#4A4A4A] mb-4">{plan.name}</h3>
             <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-extrabold text-[#4A4A4A]">{plan.price}</span>
                <span className="text-gray-400 font-medium">{plan.period}</span>
             </div>
             <ul className="space-y-4 mb-10 w-full">
                {plan.features.map((f, i) => (
                   <li key={i} className="flex items-center gap-3 text-gray-500 font-medium">
                      <div className="w-5 h-5 rounded-full bg-[#2AB9A9] flex items-center justify-center text-white text-[10px]">✓</div>
                      {f}
                   </li>
                ))}
             </ul>
             <button className={`w-full py-4 rounded-full font-extrabold text-lg transition-all shadow-lg ${plan.popular ? 'bg-[#6A4FBF] text-white hover:bg-[#583eb5]' : 'bg-white text-[#4A4A4A] hover:shadow-xl'}`}>
                Choose {plan.name}
             </button>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-12 text-gray-400 font-medium">
          Start with a 14-day free trial. No credit card required.
      </div>
    </section>
  );
};

export default Pricing;
