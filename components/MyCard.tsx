
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { Contact } from '../types';
import { getEnrichment } from '../services/geminiService';

interface MyCardProps {
  onSave: (details: Partial<Contact>) => void;
  initialDetails: Partial<Contact>;
}

const MyCard: React.FC<MyCardProps> = ({ onSave, initialDetails }) => {
  const [details, setDetails] = useState<Partial<Contact>>({
    name: 'PATRICK BATEMAN',
    jobTitle: 'VICE PRESIDENT',
    company: 'PIERCE & PIERCE',
    phone: '212 555 6342',
    email: 'bateman@pierce.com',
    ...initialDetails,
    address: initialDetails.address || '358 Exchange Place, New York, N.Y. 100099',
    fax: initialDetails.fax || '212 555 6390',
    telex: initialDetails.telex || '10 4534',
    aiInsights: initialDetails.aiInsights || ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [designMode, setDesignMode] = useState<'modern' | 'classic'>('classic');
  const [qrUrl, setQrUrl] = useState('');

  const generateQRCode = () => {
    const contactData = JSON.stringify({
      name: details.name || '',
      jobTitle: details.jobTitle || '',
      company: details.company || '',
      email: details.email || '',
      phone: details.phone || '',
      linkedinUrl: details.linkedinUrl || '',
      aiInsights: details.aiInsights || '',
      source: 'SupportHub_QR'
    });
    const encodedData = encodeURIComponent(contactData);
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodedData}`);
  };

  useEffect(() => {
    generateQRCode();
  }, [details.name, details.jobTitle, details.company, details.email, details.phone]);

  const handleSave = () => {
    onSave(details);
    setIsEditing(false);
  };

  const handleGenerateEnrichment = async () => {
    if (!details.name || !details.company) {
      alert("Please provide a name and company for AI enrichment.");
      return;
    }
    setIsGenerating(true);
    try {
      const insight = await getEnrichment(details.name, details.company);
      setDetails(prev => ({ ...prev, aiInsights: insight }));
    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${details.name}'s Digital Identity`,
          text: `Connect with ${details.name} from ${details.company}.`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Sharing failed', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Identity link copied to clipboard!');
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-[1200px] mx-auto animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 text-center md:text-left">
        <div>
           <span className="clay-text-convex text-[10px] font-black text-[#6A4FBF] uppercase tracking-widest mb-3">Agent Protocol Identity</span>
           <h1 className="text-5xl font-black text-black tracking-tighter uppercase">ID Card</h1>
        </div>
        <div className="flex gap-4">
            <div className="clay-pill-container p-1 flex items-center bg-white/50 backdrop-blur-md">
                <button 
                    onClick={() => setDesignMode('modern')}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${designMode === 'modern' ? 'bg-[#6A4FBF] text-white shadow-lg' : 'text-gray-400'}`}
                >Modern</button>
                <button 
                    onClick={() => setDesignMode('classic')}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${designMode === 'classic' ? 'bg-black text-white shadow-lg' : 'text-gray-400'}`}
                >Classic</button>
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="px-10 py-5 bg-white border-4 border-black text-black font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Specs'}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Card Design / Preview */}
        <div className="space-y-12">
            {designMode === 'modern' ? (
                <div className="clay-card p-12 bg-white relative overflow-hidden min-h-[400px] flex flex-col justify-between group shadow-2xl hover:scale-[1.02] transition-all border-4 border-black">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rounded-bl-[100px] group-hover:scale-110 transition-transform"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="w-20 h-20 bg-black flex items-center justify-center text-white text-3xl font-black mb-10 shadow-lg">
                                {details.name?.charAt(0) || '?'}
                            </div>
                            <h2 className="text-4xl font-black text-black mb-2 uppercase tracking-tighter">{details.name || 'AGENT NAME'}</h2>
                            <p className="text-black font-black text-xl mb-1 uppercase tracking-widest">{details.jobTitle || 'SUPPORT ARCHITECT'}</p>
                            <p className="text-black/40 font-black uppercase tracking-widest text-sm">{details.company || 'SCHROEDER TECHNOLOGIES'}</p>
                            
                            {details.aiInsights && (
                              <div className="mt-8 p-4 bg-gray-50 border-2 border-black/5">
                                <span className="text-[9px] font-black uppercase text-black/40 tracking-widest block mb-2">AI Conversation Starter</span>
                                <p className="text-sm font-bold italic text-black leading-relaxed">"{details.aiInsights}"</p>
                              </div>
                            )}
                        </div>
                        <div className="mt-20 space-y-4">
                            <div className="flex items-center gap-4 text-black/60 font-black uppercase tracking-widest text-xs">
                                <span className="text-sm">✉️</span>
                                {details.email || 'SUPPORT@SCHROEDER.TECH'}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative group w-full aspect-[1.75/1] bg-white shadow-2xl p-12 flex flex-col justify-between border-4 border-black hover:scale-[1.01] transition-transform overflow-hidden font-serif">
                    <div className="flex justify-between items-start z-10">
                        <div className="text-[12px] font-black text-black uppercase tracking-[0.1em]">{details.phone || '212 555 6342'}</div>
                        <div className="text-right">
                            <div className="text-[14px] font-black text-black uppercase tracking-[0.15em] leading-tight">
                                {details.company || 'PIERCE & PIERCE'}
                            </div>
                            <div className="text-[9px] font-black text-black/60 uppercase tracking-[0.2em] mt-0.5">
                                MERGERS AND ACQUISITIONS
                            </div>
                        </div>
                    </div>

                    <div className="text-center z-10 flex flex-col items-center">
                        <h2 className="text-[32px] font-black text-black uppercase tracking-[0.2em] mb-1">
                            {details.name || 'PATRICK BATEMAN'}
                        </h2>
                        <p className="text-[16px] font-black text-black/40 uppercase tracking-[0.25em]">
                            {details.jobTitle || 'VICE PRESIDENT'}
                        </p>
                    </div>

                    <div className="flex justify-center z-10">
                        <div className="text-[10px] font-black text-black/60 uppercase tracking-[0.1em] text-center max-w-[80%] leading-relaxed">
                            {details.address || '358 Exchange Place, New York, N.Y. 100099'} 
                            <span className="mx-2 opacity-30">|</span> 
                            FAX {details.fax || '212 555 6390'} 
                            <span className="mx-2 opacity-30">|</span> 
                            TELEX {details.telex || '10 4534'}
                        </div>
                    </div>
                    
                    {details.aiInsights && (
                        <div className="absolute bottom-2 right-2 text-[8px] italic text-black/20 pointer-events-none font-sans tracking-tight">
                           AI Conversation Starter: {details.aiInsights}
                        </div>
                    )}
                </div>
            )}

            <div className="clay-card p-12 bg-black text-white shadow-2xl flex flex-col items-center text-center border-4 border-black">
                <div className="p-6 bg-white rounded-[40px] shadow-inner mb-8 border-4 border-white/20">
                    <img src={qrUrl} alt="Your QR Card" className="w-48 h-48" />
                </div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-widest">Protocol Sync</h3>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-relaxed max-w-xs mb-8">
                    ANYONE WITH THE SUPPORTHUB APP CAN INSTANTLY CAPTURE YOUR IDENTITY AND START A TICKETING PROTOCOL.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <button 
                      onClick={generateQRCode}
                      className="px-8 py-4 bg-white/10 border border-white/20 font-black text-xs uppercase tracking-[0.2em] hover:bg-white/20 transition-all"
                    >
                        Reset QR
                    </button>
                    <button 
                      onClick={handleShare}
                      className="px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-[0.2em] hover:invert transition-all shadow-xl"
                    >
                        Deploy Identity
                    </button>
                </div>
            </div>
        </div>

        {/* Edit Form */}
        <div className={`clay-card p-12 bg-white transition-all duration-500 shadow-xl border-4 border-black ${isEditing ? 'opacity-100' : 'opacity-20 grayscale pointer-events-none'}`}>
            <h3 className="text-3xl font-black mb-10 text-black uppercase tracking-tighter">Specifications</h3>
            <div className="space-y-6">
                <div>
                    <label className="text-[10px] font-black uppercase text-black/40 ml-4 mb-2 block tracking-widest">Full Name</label>
                    <input className="w-full px-6 py-4 outline-none font-black text-lg bg-white border-2 border-black" value={details.name} onChange={e => setDetails({...details, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black uppercase text-black/40 ml-4 mb-2 block tracking-widest">Title</label>
                        <input className="w-full px-4 py-3 outline-none font-black text-sm bg-white border-2 border-black" value={details.jobTitle} onChange={e => setDetails({...details, jobTitle: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-black/40 ml-4 mb-2 block tracking-widest">Firm Name</label>
                        <input className="w-full px-4 py-3 outline-none font-black text-sm bg-white border-2 border-black" value={details.company} onChange={e => setDetails({...details, company: e.target.value})} />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-[10px] font-black uppercase text-black/40 ml-4 block tracking-widest">AI Conversation Starter</label>
                        <button 
                            disabled={isGenerating}
                            onClick={handleGenerateEnrichment}
                            className="text-[9px] font-black uppercase text-black underline tracking-widest hover:text-black/50 transition-all disabled:opacity-20"
                        >
                            {isGenerating ? 'GENERATE_PROTOCOL...' : '✨ AUTO-GENERATE'}
                        </button>
                    </div>
                    <textarea 
                        className="w-full p-6 outline-none font-black text-sm bg-white border-2 border-black min-h-[100px] no-scrollbar placeholder:text-black/10" 
                        placeholder="Add a conversation starter or bio..."
                        value={details.aiInsights} 
                        onChange={e => setDetails({...details, aiInsights: e.target.value})} 
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black uppercase text-black/40 ml-4 mb-2 block tracking-widest">Office Phone</label>
                        <input className="w-full px-4 py-3 outline-none font-black text-sm bg-white border-2 border-black" value={details.phone} onChange={e => setDetails({...details, phone: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-black/40 ml-4 mb-2 block tracking-widest">Support Email</label>
                        <input className="w-full px-4 py-3 outline-none font-black text-sm bg-white border-2 border-black" value={details.email} onChange={e => setDetails({...details, email: e.target.value})} />
                    </div>
                </div>
                <button 
                  onClick={handleSave}
                  className="w-full py-6 bg-black text-white text-lg font-black uppercase tracking-[0.4em] transition-all border-4 border-black hover:bg-white hover:text-black active:scale-95"
                >
                    COMMIT IDENTITY
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MyCard;
