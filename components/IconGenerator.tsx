
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef } from 'react';
import { analyzeLogoForIcons } from '../services/geminiService';
import { FaviconSet, IconResult } from '../types';
import { FAVICON_SIZES, APPLE_SIZES, ANDROID_SIZES, MS_SIZES } from '../constants';

interface IconGeneratorProps {
  onComplete: (faviconSet: FaviconSet) => void;
}

const IconGenerator: React.FC<IconGeneratorProps> = ({ onComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateIcons = async (file: File): Promise<void> => {
    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      const img = new Image();
      
      img.onload = async () => {
        // 1. Analyze with AI for theme colors
        const analysis = await analyzeLogoForIcons(file.name, result.split(',')[1]);
        
        // 2. Generate all sizes via Canvas
        const generatedIcons: IconResult[] = [];
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        const processGroup = (sizes: number[], type: IconResult['type']) => {
          sizes.forEach(size => {
            canvas.width = size;
            canvas.height = size;
            ctx.clearRect(0, 0, size, size);
            
            // Draw logo with padding
            const pad = (size * (analysis.paddingPercentage || 10)) / 100;
            const drawSize = size - (pad * 2);
            ctx.drawImage(img, pad, pad, drawSize, drawSize);
            
            generatedIcons.push({
              size,
              label: `${type}-${size}x${size}.png`,
              dataUrl: canvas.toDataURL('image/png'),
              type
            });
          });
        };

        processGroup(FAVICON_SIZES, 'favicon');
        processGroup(APPLE_SIZES, 'apple');
        processGroup(ANDROID_SIZES, 'android');
        processGroup(MS_SIZES, 'ms');

        // 3. Generate HTML
        const htmlSnippet = `
<!-- FaviconGen Assets -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="msapplication-TileColor" content="${analysis.themeColor}">
<meta name="theme-color" content="${analysis.themeColor}">
        `.trim();

        // 4. Generate Manifest
        const manifestJson = JSON.stringify({
          name: file.name.split('.')[0],
          short_name: file.name.split('.')[0],
          description: analysis.shortDescription,
          icons: ANDROID_SIZES.map(s => ({
            src: `/android-chrome-${s}x${s}.png`,
            sizes: `${s}x${s}`,
            type: "image/png"
          })),
          theme_color: analysis.themeColor,
          background_color: analysis.backgroundColor,
          display: "standalone"
        }, null, 2);

        onComplete({
          id: Math.random().toString(36).substr(2, 9),
          originalFileName: file.name,
          icons: generatedIcons,
          htmlSnippet,
          manifestJson,
          timestamp: Date.now()
        });
        setIsProcessing(false);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      generateIcons(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="pt-40 pb-24 px-4 md:px-8 max-w-[1000px] mx-auto animate-fade-in">
      <div 
        className={`relative p-20 border-8 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center text-center min-h-[500px] ${
          dragActive ? 'border-black bg-black/5' : 'border-black/5 bg-white'
        } ${isProcessing ? 'pointer-events-none opacity-50' : 'hover:border-black'}`}
        onDragEnter={onDrag}
        onDragLeave={onDrag}
        onDragOver={onDrag}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => e.target.files && generateIcons(e.target.files[0])} accept="image/*" />
        
        {isProcessing ? (
          <div className="space-y-8 animate-pulse">
            <div className="w-24 h-24 bg-black mx-auto"></div>
            <h3 className="text-4xl font-black uppercase tracking-tighter">Packaging Assets...</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-black/40">Multi-resolution processing active</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-8xl mb-4">🎯</div>
            <h3 className="text-5xl font-black uppercase tracking-tighter leading-none">Drop Logo <br/> to Process</h3>
            <p className="text-black/40 font-black uppercase tracking-[0.4em] text-[10px]">SVG, PNG, JPG (TRANSPARENCY PRESERVED)</p>
            <button className="clay-button-primary px-12 py-5 text-sm">Select Image</button>
          </div>
        )}

        <div className="absolute top-8 left-8 text-[10px] font-black text-black/20 uppercase tracking-[0.3em]">SCHROEDER TECHNOLOGIES</div>
        <div className="absolute bottom-8 right-8 text-[10px] font-black text-black/20 uppercase tracking-[0.3em]">GREGORIOUS STUDIOS</div>
      </div>
    </div>
  );
};

export default IconGenerator;
