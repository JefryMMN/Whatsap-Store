
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

interface ResellerProps {
  currency: string;
}

const ResellerDashboard: React.FC<ResellerProps> = ({ currency }) => {
  const handleCopyLink = () => {
    const resellerId = localStorage.getItem('ss_reseller_id') || Math.random().toString(36).substr(2, 6).toUpperCase();
    if (!localStorage.getItem('ss_reseller_id')) {
      localStorage.setItem('ss_reseller_id', resellerId);
    }
    
    const link = `https://shopsmart.app/join?ref=${resellerId}`;
    navigator.clipboard.writeText(link).then(() => {
        alert("Referral link copied! " + link);
    }).catch(err => {
        console.error('Could not copy link: ', err);
        alert("Referral code: " + resellerId);
    });
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-[1200px] mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-center md:text-left">
        <div>
            <span className="clay-text-convex text-[10px] font-black text-[#6A4FBF] uppercase tracking-widest mb-3">Community Hub</span>
            <h1 className="text-5xl font-black text-[#4A4A4A]">Partner Center</h1>
        </div>
        <div className="flex gap-4">
            <button onClick={handleCopyLink} className="px-10 py-5 clay-button-primary text-white font-black uppercase tracking-widest text-xs rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all">Copy Invite Link</button>
            <button className="px-10 py-5 bg-white text-[#6A4FBF] font-black uppercase tracking-widest text-xs rounded-full shadow-lg hover:shadow-xl transition-all">Payout Config</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          <div className="clay-card p-12 bg-[#6A4FBF] text-white shadow-2xl scale-105">
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white/50 mb-3 block">Total Commissions</span>
              <div className="text-6xl font-black tracking-tighter">{currency}1,245.00</div>
              <div className="mt-6 flex items-center gap-3">
                  <span className="bg-white/20 px-3 py-1.5 rounded-2xl text-[10px] font-black">Diamond Status</span>
              </div>
          </div>
          <div className="clay-card p-12 bg-white shadow-xl">
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-300 mb-3 block">Active Referrals</span>
              <div className="text-6xl font-black text-[#4A4A4A] tracking-tighter">18</div>
              <div className="mt-6 text-[11px] font-black text-[#2AB9A9] uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2AB9A9] animate-pulse"></span>
                Onboarded Shops
              </div>
          </div>
          <div className="clay-card p-12 bg-[#FFB673] text-white shadow-xl">
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white/50 mb-3 block">Earn Rate</span>
              <div className="text-6xl font-black tracking-tighter">20%</div>
              <div className="mt-6 text-[11px] font-black text-white/60 uppercase tracking-widest">Growth Tier</div>
          </div>
      </div>

      <div className="clay-card p-12 bg-white/90 border-4 border-white shadow-2xl overflow-hidden">
          <h3 className="text-3xl font-black mb-12 text-[#4A4A4A]">Merchant Network</h3>
          <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left min-w-[800px]">
                  <thead>
                      <tr className="text-[11px] font-black uppercase text-gray-400 tracking-[0.25em] border-b-4 border-gray-50">
                          <th className="pb-8 px-6">Merchant Shop</th>
                          <th className="pb-8 px-6">Joined Date</th>
                          <th className="pb-8 px-6">Plan Status</th>
                          <th className="pb-8 px-6 text-right">My Share (Total)</th>
                      </tr>
                  </thead>
                  <tbody>
                      {[
                          { name: "Apex Grocery", type: "Grocery", date: "2024-11-12", status: "Active", earned: 245.00, icon: "🛒" },
                          { name: "Elite Salon", type: "Salon", date: "2025-01-02", status: "Active", earned: 112.50, icon: "✂️" },
                          { name: "Bridge Meds", type: "Pharmacy", date: "2024-12-15", status: "Expired", earned: 450.00, icon: "💊" },
                          { name: "Fresh Produce", type: "Vendor", date: "2025-02-10", status: "Trial", earned: 0.00, icon: "🍎" },
                      ].map((m, i) => (
                          <tr key={i} className="border-b-2 border-gray-50 group hover:bg-[#F8E9DD]/20 transition-all cursor-pointer">
                              <td className="py-8 px-6">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl">{m.icon}</div>
                                    <div>
                                        <div className="font-black text-xl text-[#4A4A4A] group-hover:text-[#6A4FBF] transition-colors">{m.name}</div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{m.type}</div>
                                    </div>
                                </div>
                              </td>
                              <td className="py-8 px-6 font-bold text-gray-600 text-sm">{m.date}</td>
                              <td className="py-8 px-6">
                                  <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                      m.status === 'Active' ? 'bg-green-100 text-green-600' : 
                                      m.status === 'Trial' ? 'bg-blue-100 text-blue-600' : 'bg-red-50 text-red-400'
                                  }`}>
                                      {m.status}
                                  </span>
                              </td>
                              <td className="py-8 px-6 font-black text-2xl text-right tracking-tight">{currency}{m.earned.toFixed(2)}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};

export default ResellerDashboard;
