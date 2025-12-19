
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { ScanRecord } from '../types';

interface ScanResultProps {
  record: ScanRecord;
  onFinish: () => void;
}

const ScanResult: React.FC<ScanResultProps> = ({ record, onFinish }) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!email) return;
    setIsSending(true);
    // Simulate API delivery
    setTimeout(() => {
      setIsSending(false);
      setSent(true);
      setTimeout(onFinish, 2000);
    }, 1500);
  };

  return (
    <div className="pt-40 pb-24 px-6 max-w-[900px] mx-auto animate-fade-in-up">
      <div className="mb-20">
         <span className="clay-text-convex mb-4">Extraction Complete</span>
         <h1 className="text-6xl md:text-8xl font-black text-black tracking-tighter uppercase leading-none">Scanned.</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Document Preview */}
        <div className="clay-card p-2 bg-black shadow-2xl overflow-hidden aspect-[1/1.4]">
           <div className="w-full h-full bg-white p-8 overflow-y-auto no-scrollbar relative">
              {/* Simulation of a cleaned up paper */}
              <div className="absolute inset-0 bg-white opacity-20 pointer-events-none mix-blend-multiply grain-effect"></div>
              <div className="prose prose-sm font-serif">
                <div className="text-[8px] font-black uppercase text-black/40 mb-8 border-b border-black/10 pb-2">
                  SNAPSHOT HIGH-FIDELITY OUTPUT • {new Date(record.timestamp).toLocaleDateString()}
                </div>
                <h2 className="font-black text-xl uppercase tracking-tighter mb-4">{record.fileName}</h2>
                <div className="whitespace-pre-wrap text-[11px] leading-relaxed text-black/80">
                  {record.extractedText}
                </div>
              </div>
           </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-12">
            <div className="p-10 bg-white border-4 border-black space-y-8">
                <h3 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-black pb-4">Protocol Delivery</h3>
                
                {sent ? (
                  <div className="py-12 text-center space-y-4">
                     <div className="text-5xl">✔️</div>
                     <h4 className="text-xl font-black uppercase tracking-[0.2em]">Delivered.</h4>
                     <p className="text-[10px] font-black uppercase text-black/40 tracking-widest">CHECK YOUR INBOX AT {email.toUpperCase()}</p>
                  </div>
                ) : (
                  <>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/60 leading-relaxed">
                      YOUR DOCUMENT HAS BEEN PROCESSED INTO A SEARCHABLE PDF. ENTER YOUR RECIPIENT EMAIL FOR INSTANT DELIVERY.
                    </p>
                    <div>
                      <label className="text-[9px] font-black uppercase text-black/40 mb-2 block tracking-widest ml-1">Destination Email</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@schroeder.tech"
                        className="w-full px-6 py-5 border-4 border-black font-black uppercase tracking-widest text-sm outline-none focus:bg-black focus:text-white transition-all"
                      />
                    </div>
                    <button 
                      disabled={isSending || !email}
                      onClick={handleSend}
                      className="w-full py-8 bg-black text-white text-lg font-black uppercase tracking-[0.4em] border-4 border-black hover:bg-white hover:text-black transition-all active:scale-95 disabled:opacity-10"
                    >
                      {isSending ? 'DELIVERING...' : 'FINISH & SEND'}
                    </button>
                  </>
                )}
            </div>

            <button 
              onClick={onFinish}
              className="w-full py-4 text-[10px] font-black uppercase tracking-[0.5em] text-black/40 hover:text-black transition-colors"
            >
              Discard Scan
            </button>
        </div>
      </div>
    </div>
  );
};

export default ScanResult;
