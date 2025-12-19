/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

const Wallet: React.FC = () => {
  return (
    <div className="min-h-screen py-20 px-6 max-w-[1000px] mx-auto animate-fade-in-up">
       <div className="clay-card p-8 md:p-12 mb-12 relative overflow-hidden">
           {/* Background Decos */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFB673] opacity-10 rounded-full blur-3xl pointer-events-none"></div>

           <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
               <div>
                   <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2 block">Knowledge Level</span>
                   <h1 className="text-5xl md:text-6xl font-extrabold text-[#4A4A4A] mb-4">Level 12</h1>
                   <div className="flex items-center gap-2 text-[#2AB9A9] font-bold">
                       <span className="bg-[#e6fffa] px-2 py-1 rounded-lg text-sm">+ 450 XP (Today)</span>
                       <span className="text-gray-400 text-sm">Keep going!</span>
                   </div>
               </div>
               <div className="flex gap-4">
                   <button className="clay-button px-8 py-3 bg-[#F8E9DD] text-[#4A4A4A]">My Badges</button>
                   <button className="px-8 py-3 rounded-full bg-white text-[#4A4A4A] font-bold shadow-sm hover:shadow-md transition-shadow">Assignments</button>
               </div>
           </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-4">
               <h3 className="text-xl font-bold text-[#4A4A4A] mb-4">Current Assignments</h3>
               {[
                   { name: "Spot the Deepfake", symbol: "Visual Literacy", amount: "Due Today", value: "500 XP", change: "In Progress", color: "#F7931A" },
                   { name: "Algorithm Logic", symbol: "Coding", amount: "Due Friday", value: "300 XP", change: "Not Started", color: "#627EEA" },
                   { name: "Data Privacy", symbol: "Safety", amount: "Completed", value: "1000 XP", change: "Done", color: "#14F195" },
               ].map((asset, i) => (
                   <div key={i} className="clay-card p-4 flex items-center justify-between hover:scale-[1.01] transition-transform cursor-pointer">
                       <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{backgroundColor: asset.color}}>
                               {asset.symbol.substring(0,2).toUpperCase()}
                           </div>
                           <div>
                               <h4 className="font-bold text-[#4A4A4A]">{asset.name}</h4>
                               <span className="text-xs text-gray-500">{asset.symbol}</span>
                           </div>
                       </div>
                       <div className="text-right">
                           <div className="font-bold text-[#4A4A4A]">{asset.value}</div>
                           <div className={`text-xs font-bold ${asset.change === 'Done' ? 'text-[#2AB9A9]' : 'text-[#FFB673]'}`}>{asset.change}</div>
                       </div>
                   </div>
               ))}
           </div>
           
           <div>
                <h3 className="text-xl font-bold text-[#4A4A4A] mb-4">Recent Activity</h3>
                <div className="clay-card p-6 min-h-[300px]">
                    <div className="space-y-6">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#F8E9DD] shadow-inner flex items-center justify-center text-[#6A4FBF]">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0V5.625a2.25 2.25 0 00-2.25-2.25h-1.5a2.25 2.25 0 00-2.25 2.25v8.625" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-bold text-[#4A4A4A]">Earned Badge</div>
                                        <div className="text-xs text-gray-400">Today, 10:23 AM</div>
                                    </div>
                                </div>
                                <span className="font-bold text-[#2AB9A9]">+100 XP</span>
                            </div>
                        ))}
                    </div>
                </div>
           </div>
       </div>
    </div>
  );
};

export default Wallet;