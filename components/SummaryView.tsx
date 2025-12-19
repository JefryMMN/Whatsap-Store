
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { SummaryRecord } from '../types';

interface SummaryViewProps {
  summary: SummaryRecord;
  onBack: () => void;
}

const SummaryView: React.FC<SummaryViewProps> = ({ summary, onBack }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: summary.title,
        text: summary.distillation,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(summary.shareUrl);
      alert('Shareable essence URL copied to clipboard');
    }
  };

  return (
    <div className="min-h-screen pt-40 pb-24 px-6 max-w-[900px] mx-auto animate-fade-in-up bg-white">
      <button 
        onClick={onBack}
        className="mb-12 text-[10px] font-black uppercase tracking-[0.5em] hover:opacity-50 transition-opacity"
      >
        ← Back to Whisper
      </button>

      <div className="border-t-8 border-black pt-16">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-20">
          <div>
            <span className="inline-block px-4 py-1 bg-black text-white text-[9px] font-black uppercase tracking-widest mb-6">
              {summary.context}
            </span>
            <h1 className="text-6xl md:text-8xl font-black uppercase leading-none tracking-tighter mb-4">
              {summary.title}
            </h1>
            <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.3em]">
              ORIGIN: {summary.fileName} • {summary.originalSize}
            </p>
          </div>
          <button 
            onClick={handleShare}
            className="px-10 py-5 bg-black text-white text-xs font-black uppercase tracking-[0.3em] hover:invert transition-all shrink-0"
          >
            Share Essence
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <div className="space-y-12">
            <h2 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-black pb-4">Distillation</h2>
            <p className="text-xl font-bold leading-relaxed text-black uppercase">
              {summary.distillation}
            </p>
          </div>

          <div className="space-y-12">
            <h2 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-black pb-4">Key Insights</h2>
            <ul className="space-y-6">
              {summary.keyPoints.map((point, i) => (
                <li key={i} className="flex gap-6 items-start">
                  <span className="text-3xl font-black opacity-10">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-sm font-black uppercase tracking-widest leading-relaxed pt-2">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-32 pt-12 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-[9px] font-black text-black/20 uppercase tracking-[0.5em]">
            PROCESSED BY WHISPER ENGINE 2.5 • {new Date(summary.timestamp).toLocaleString()}
          </div>
          <div className="text-2xl font-black uppercase">🌑 Essence Captured</div>
        </div>
      </div>
    </div>
  );
};

export default SummaryView;
