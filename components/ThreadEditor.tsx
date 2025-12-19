
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { generateThreadFromDump } from '../services/geminiService';
import { ThreadSet } from '../types';
import { THREAD_TONES } from '../constants';

interface ThreadEditorProps {
  onComplete: (thread: ThreadSet) => void;
}

const ThreadEditor: React.FC<ThreadEditorProps> = ({ onComplete }) => {
  const [dump, setDump] = useState('');
  const [tone, setTone] = useState('educational');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerate = async () => {
    if (!dump.trim()) return;
    setIsProcessing(true);
    const result = await generateThreadFromDump(dump, tone);
    if (result) {
      const newThread: ThreadSet = {
        id: Math.random().toString(36).substr(2, 9),
        originalDump: dump,
        tweets: result.tweets,
        hookType: result.hookType,
        engagementScore: result.engagementScore,
        timestamp: Date.now()
      };
      onComplete(newThread);
    }
    setIsProcessing(false);
  };

  return (
    <div className="pt-40 pb-24 px-4 md:px-8 max-w-[1000px] mx-auto animate-fade-in">
      <div className="space-y-12">
        <div className="text-center md:text-left">
          <span className="clay-text-convex mb-4">Content Protocol</span>
          <h1 className="text-5xl md:text-8xl font-black text-black tracking-tighter uppercase leading-none">Brain Dump.</h1>
          <p className="text-black/40 mt-4 font-black uppercase tracking-[0.4em] text-[10px]">UNSTRUCTURED THOUGHTS → VIRAL ASSETS</p>
        </div>

        <div className="clay-card p-1 bg-black shadow-2xl overflow-hidden">
          <textarea
            value={dump}
            onChange={(e) => setDump(e.target.value)}
            placeholder="Type your messy thoughts, notes, or copy-paste a long article here..."
            className="w-full h-80 p-10 bg-white text-black font-medium text-lg outline-none resize-none no-scrollbar placeholder:text-black/10"
            disabled={isProcessing}
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-4">
            {THREAD_TONES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                className={`px-6 py-3 border-2 font-black uppercase text-[10px] tracking-widest transition-all ${
                  tone === t.id ? 'bg-black text-white border-black' : 'bg-white text-black border-black/10 hover:border-black'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isProcessing || !dump.trim()}
            className="px-16 py-6 bg-black text-white font-black uppercase tracking-[0.4em] text-xs hover:invert transition-all active:scale-95 disabled:opacity-20 flex items-center gap-4"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div>
                STRUCTURING...
              </>
            ) : (
              'EXECUTE GENERATION'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThreadEditor;
