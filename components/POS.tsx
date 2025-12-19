
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef } from 'react';
import { extractContactFromImage, getEnrichment } from '../services/geminiService';
import { Contact } from '../types';

interface ScannerProps {
  onCompleteSale: (contact: Contact) => void;
  shopName: string;
}

const POS: React.FC<ScannerProps> = ({ onCompleteSale, shopName }) => {
  const [mode, setMode] = useState<'scan' | 'manual'>('scan');
  const [image, setImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [formData, setFormData] = useState<Partial<Contact>>({
    company: 'PIERCE & PIERCE',
    address: '358 Exchange Place, New York, N.Y. 100099',
    fax: '212 555 6390',
    telex: '10 4534'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setImage(reader.result as string);
        processImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (base64: string) => {
    setScanning(true);
    const data = await extractContactFromImage(base64);
    if (data) {
      const enrichment = await getEnrichment(data.name, data.company);
      setFormData(prev => ({ ...prev, ...data, aiInsights: enrichment }));
    }
    setScanning(false);
  };

  const handleSave = () => {
    if (!formData.name) return;
    const newContact: Contact = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || 'Unknown',
      jobTitle: formData.jobTitle || 'Unknown',
      company: formData.company || 'Unknown',
      email: formData.email || '',
      phone: formData.phone || '',
      linkedinUrl: formData.linkedinUrl || '',
      address: formData.address || '',
      fax: formData.fax || '',
      telex: formData.telex || '',
      aiInsights: formData.aiInsights,
      status: 'active',
      timestamp: Date.now()
    };
    onCompleteSale(newContact);
    setImage(null);
    setFormData({
        company: 'PIERCE & PIERCE',
        address: '358 Exchange Place, New York, N.Y. 100099',
        fax: '212 555 6390',
        telex: '10 4534'
    });
    alert("Identity Created Successfully!");
  };

  return (
    <div className="pt-40 pb-24 px-4 md:px-8 max-w-[1200px] mx-auto animate-fade-in">
      <div className="flex justify-center mb-16">
          <div className="bg-white border-4 border-black p-1 flex items-center shadow-2xl">
              <button 
                onClick={() => setMode('scan')}
                className={`px-12 py-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all ${mode === 'scan' ? 'bg-black text-white' : 'text-black hover:bg-black/5'}`}
              >
                  Scanner
              </button>
              <button 
                onClick={() => setMode('manual')}
                className={`px-12 py-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all ${mode === 'manual' ? 'bg-black text-white' : 'text-black hover:bg-black/5'}`}
              >
                  Manual
              </button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        <div className="space-y-12">
            {mode === 'scan' ? (
                <div 
                    className="clay-card p-16 bg-white border-4 border-black flex flex-col items-center justify-center min-h-[500px] text-center shadow-2xl relative group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {!image ? (
                        <div>
                            <div className="w-24 h-24 bg-black text-white flex items-center justify-center text-5xl mb-8 shadow-2xl group-hover:scale-110 transition-transform">📷</div>
                            <h3 className="text-3xl font-black text-black uppercase tracking-tighter">Capture Card</h3>
                            <p className="text-black/40 mt-4 font-black uppercase tracking-[0.4em] text-[10px]">GEMINI AI OCR ENGINE</p>
                        </div>
                    ) : (
                        <div className="w-full relative">
                            <img src={image} className="w-full grayscale border-4 border-black shadow-2xl" alt="Scan" />
                        </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                </div>
            ) : (
                <div className="clay-card p-12 bg-white shadow-2xl border-4 border-black space-y-8">
                    <h3 className="text-3xl font-black text-black uppercase tracking-tighter mb-8 border-b-4 border-black pb-4">Manual Entry</h3>
                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black uppercase text-black/40 ml-1 mb-2 block tracking-widest">Identity Name</label>
                            <input 
                                className="w-full px-6 py-4 outline-none font-black text-lg border-2 border-black" 
                                value={formData.name || ''} 
                                onChange={e => setFormData({...formData, name: e.target.value})} 
                                placeholder="PATRICK BATEMAN"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black uppercase text-black/40 ml-1 mb-2 block tracking-widest">Title</label>
                                <input 
                                    className="w-full px-6 py-4 outline-none font-black text-sm border-2 border-black" 
                                    value={formData.jobTitle || ''} 
                                    onChange={e => setFormData({...formData, jobTitle: e.target.value})} 
                                    placeholder="VICE PRESIDENT"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-black/40 ml-1 mb-2 block tracking-widest">Firm</label>
                                <input 
                                    className="w-full px-6 py-4 outline-none font-black text-sm border-2 border-black" 
                                    value={formData.company || ''} 
                                    onChange={e => setFormData({...formData, company: e.target.value})} 
                                    placeholder="PIERCE & PIERCE"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-black/40 ml-1 mb-2 block tracking-widest">Office Address</label>
                            <input 
                                className="w-full px-6 py-4 outline-none font-black text-sm border-2 border-black" 
                                value={formData.address || ''} 
                                onChange={e => setFormData({...formData, address: e.target.value})} 
                                placeholder="358 Exchange Place, NY"
                            />
                        </div>
                    </div>
                </div>
            )}
            
            {scanning && (
                <div className="p-10 bg-black text-white text-center animate-pulse border-4 border-black">
                    <span className="font-black uppercase tracking-[0.5em] text-sm">EXTRACTING...</span>
                </div>
            )}
        </div>

        <div className="space-y-12">
            <h2 className="text-3xl font-black text-black px-4 flex justify-between items-center uppercase tracking-tighter">
                <span>Preview</span>
                {formData.name && <span className="text-[10px] font-black text-black animate-pulse tracking-widest">VERIFIED ✨</span>}
            </h2>

            <div className="relative w-full aspect-[1.75/1] bg-white shadow-2xl p-12 flex flex-col justify-between border-4 border-black font-serif overflow-hidden">
                <div className="flex justify-between items-start z-10">
                    <div className="text-[12px] font-black text-black uppercase tracking-[0.1em]">{formData.phone || '212 555 6342'}</div>
                    <div className="text-right">
                        <div className="text-[14px] font-black text-black uppercase tracking-[0.15em] leading-tight">
                            {formData.company || 'PIERCE & PIERCE'}
                        </div>
                        <div className="text-[8px] font-black text-black uppercase tracking-[0.2em] mt-0.5">
                            Mergers and Acquisitions
                        </div>
                    </div>
                </div>

                <div className="text-center z-10 flex flex-col items-center py-6">
                    <h2 className="text-[32px] font-black text-black uppercase tracking-[0.2em] mb-1 leading-none">
                        {formData.name || 'NAME'}
                    </h2>
                    <p className="text-[16px] font-black text-black/60 uppercase tracking-[0.3em]">
                        {formData.jobTitle || 'POSITION'}
                    </p>
                </div>

                <div className="flex justify-center z-10">
                    <div className="text-[10px] font-black text-black/60 uppercase tracking-[0.1em] text-center max-w-[90%] leading-relaxed border-t-2 border-black pt-4">
                        {formData.address || '358 Exchange Place, New York, N.Y. 100099'} 
                        {formData.fax && <><span className="mx-2 opacity-30">|</span> FAX {formData.fax}</>}
                    </div>
                </div>
            </div>

            <button 
                disabled={!formData.name}
                onClick={handleSave}
                className={`w-full py-10 text-2xl font-black uppercase tracking-[0.5em] shadow-2xl transition-all border-4 border-black active:scale-95 ${!formData.name ? 'bg-white text-black/10' : 'bg-black text-white hover:bg-white hover:text-black'}`}
            >
                ARCHIVE
            </button>
        </div>
      </div>
    </div>
  );
};

export default POS;
