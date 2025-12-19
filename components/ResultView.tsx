
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { FaviconSet } from '../types';

interface ResultViewProps {
  faviconSet: FaviconSet;
  onBack: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ faviconSet, onBack }) => {
  const downloadAll = () => {
    // In a production app, we would use JSZip here. 
    // For this prototype, we'll simulate the download of a single main icon or provide individual downloads.
    alert("ZIP packaging would normally initiate here. For the prototype, use individual icon downloads below.");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  return (
    <div className="min-h-screen pt-40 pb-24 px-6 max-w-[1200px] mx-auto animate-fade-in-up bg-white">
      <button 
        onClick={onBack}
        className="mb-12 text-[10px] font-black uppercase tracking-[0.5em] hover:opacity-50 transition-opacity"
      >
        ← New Generation
      </button>

      <div className="border-t-8 border-black pt-16">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-20">
          <div>
            <span className="inline-block px-4 py-1 bg-black text-white text-[9px] font-black uppercase tracking-widest mb-6">
              Asset Package Ready
            </span>
            <h1 className="text-6xl md:text-8xl font-black uppercase leading-none tracking-tighter mb-4">
              Assets Complete
            </h1>
            <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.3em]">
              ORIGIN: {faviconSet.originalFileName} • {faviconSet.icons.length} VARIATIONS GENERATED
            </p>
          </div>
          <button 
            onClick={downloadAll}
            className="px-10 py-5 bg-black text-white text-xs font-black uppercase tracking-[0.3em] hover:invert transition-all shrink-0"
          >
            Download ZIP Bundle
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Previews */}
          <div className="space-y-12">
            <h2 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-black pb-4">Icon Previews</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              {faviconSet.icons.filter(i => [16, 64, 180, 192, 512].includes(i.size)).map((icon, idx) => (
                <div key={idx} className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-gray-50 border-2 border-black/5 flex items-center justify-center relative group">
                        <img src={icon.dataUrl} alt={icon.label} style={{ width: icon.size > 100 ? 100 : icon.size }} className="shadow-sm" />
                        <a href={icon.dataUrl} download={icon.label} className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[8px] font-black tracking-widest">DL</a>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-black/40">{icon.type} {icon.size}px</span>
                </div>
              ))}
            </div>

            {/* Mockups */}
            <div className="mt-20 p-10 bg-black text-white flex flex-col items-center">
                <div className="w-12 h-12 bg-white flex items-center justify-center mb-6">
                    <img src={faviconSet.icons.find(i => i.size === 192)?.dataUrl} className="w-8 h-8" alt="Mock" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-2">Browser Mockup</h4>
                <div className="w-full h-4 bg-white/20 rounded-full"></div>
            </div>
          </div>

          {/* Implementation Code */}
          <div className="space-y-12">
            <h2 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-black pb-4">Implementation</h2>
            
            <div className="space-y-8">
                <div>
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-black/40">HTML Snippet</span>
                        <button onClick={() => copyToClipboard(faviconSet.htmlSnippet)} className="text-[9px] font-black uppercase underline tracking-widest">Copy</button>
                    </div>
                    <pre className="bg-gray-50 p-6 text-[10px] font-mono border-2 border-black/5 overflow-x-auto">
                        {faviconSet.htmlSnippet}
                    </pre>
                </div>

                <div>
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-black/40">site.webmanifest</span>
                        <button onClick={() => copyToClipboard(faviconSet.manifestJson)} className="text-[9px] font-black uppercase underline tracking-widest">Copy</button>
                    </div>
                    <pre className="bg-gray-50 p-6 text-[10px] font-mono border-2 border-black/5 overflow-x-auto h-48 overflow-y-auto">
                        {faviconSet.manifestJson}
                    </pre>
                </div>
            </div>
          </div>
        </div>

        <div className="mt-32 pt-12 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-[9px] font-black text-black/20 uppercase tracking-[0.5em]">
            PROCESSED BY FAVICONGEN ENGINE 2.0 • {new Date(faviconSet.timestamp).toLocaleString()}
          </div>
          <div className="text-2xl font-black uppercase">🎯 Perfect Clarity</div>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
