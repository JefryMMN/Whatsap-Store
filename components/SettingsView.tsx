
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { AppSettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onUpdate: (updates: Partial<AppSettings>) => void;
  shopName: string;
  onShopNameChange: (n: string) => void;
}

const SettingsView: React.FC<SettingsProps> = ({ settings, onUpdate, shopName, onShopNameChange }) => {
  return (
    <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-[900px] mx-auto animate-fade-in">
      <div className="text-center md:text-left mb-10 md:mb-16">
        <span className="clay-text-convex text-[9px] md:text-[10px] font-black text-[#6A4FBF] uppercase tracking-widest mb-3">Configuration</span>
        <h1 className="text-4xl md:text-6xl font-black text-[#4A4A4A] tracking-tighter">Store Setup</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:gap-10">
        <div className="clay-card p-6 md:p-12 bg-white border-2 md:border-4 border-white shadow-xl">
          <h3 className="text-2xl md:text-3xl font-black mb-6 md:mb-10 text-[#4A4A4A]">Contact & Link</h3>
          <div className="space-y-6 md:space-y-8">
            <div>
              <label className="text-[9px] md:text-[10px] font-black uppercase text-gray-400 ml-2 md:ml-4 mb-2 block tracking-widest">Business Name</label>
              <input 
                type="text" 
                className="w-full clay-pill-container px-6 md:px-8 py-4 md:py-5 font-black text-lg md:text-xl outline-none shadow-inner bg-white/60" 
                value={shopName} 
                onChange={e => onShopNameChange(e.target.value)} 
              />
            </div>
            <div>
              <label className="text-[9px] md:text-[10px] font-black uppercase text-gray-400 ml-2 md:ml-4 mb-2 block tracking-widest">WhatsApp Number (with Country Code)</label>
              <input 
                type="text" 
                placeholder="e.g. 15551234567"
                className="w-full clay-pill-container px-6 md:px-8 py-4 md:py-5 font-black text-lg md:text-xl outline-none shadow-inner bg-white/60" 
                value={settings.storeProfile?.whatsappNumber} 
                onChange={e => onUpdate({ storeProfile: { ...settings.storeProfile, whatsappNumber: e.target.value } })} 
              />
              <p className="ml-4 mt-2 text-[9px] md:text-[10px] font-bold text-gray-400">Orders will be sent to this number.</p>
            </div>
          </div>
        </div>

        <div className="clay-card p-6 md:p-12 bg-white border-2 md:border-4 border-white shadow-xl">
          <h3 className="text-2xl md:text-3xl font-black mb-6 md:mb-10 text-[#4A4A4A]">Store Details</h3>
          <div className="space-y-6 md:space-y-8">
             <div>
                <label className="text-[9px] md:text-[10px] font-black uppercase text-gray-400 ml-2 md:ml-4 mb-2 block tracking-widest">Description</label>
                <textarea 
                  className="w-full clay-pill-container px-6 md:px-8 py-4 md:py-5 font-bold text-xs md:text-sm outline-none shadow-inner bg-white/60 min-h-[100px]" 
                  value={settings.storeProfile?.description} 
                  onChange={e => onUpdate({ storeProfile: { ...settings.storeProfile, description: e.target.value } })}
                />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-[9px] md:text-[10px] font-black uppercase text-gray-400 ml-2 md:ml-4 mb-2 block tracking-widest">Currency Symbol</label>
                    <input 
                        type="text" 
                        className="w-full clay-pill-container px-6 md:px-8 py-4 md:py-5 font-black text-lg md:text-xl outline-none shadow-inner bg-white/60" 
                        value={settings.storeProfile?.currency} 
                        onChange={e => onUpdate({ storeProfile: { ...settings.storeProfile, currency: e.target.value } })} 
                    />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
