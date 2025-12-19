
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef } from 'react';
import { parseDocumentToNotionBlocks } from '../services/geminiService';
import { ConversionRecord } from '../types';

interface FileImporterProps {
  onComplete: (record: ConversionRecord) => void;
}

const FileImporter: React.FC<FileImporterProps> = ({ onComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return;
    const file = files[0];
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      const isImage = file.type.startsWith('image/') || file.type === 'application/pdf';
      // For PDF, we treat as image/scan for Gemini to OCR properly or read as text if it's small.
      // In this version, we pass the content as text for most docs, or base64 for images/PDFs.
      const dataForAI = isImage ? result.split(',')[1] : result;

      const conversionData = await parseDocumentToNotionBlocks(file.name, dataForAI, isImage);
      
      if (conversionData) {
        const newRecord: ConversionRecord = {
          id: Math.random().toString(36).substr(2, 9),
          fileName: file.name,
          fileType: file.type || 'Unknown',
          fileSize: (file.size / 1024).toFixed(1) + ' KB',
          notionPageTitle: conversionData.title,
          blocks: conversionData.blocks,
          status: 'ready',
          timestamp: Date.now()
        };
        onComplete(newRecord);
      } else {
        alert("Conversion protocol failed. Ensure the file is readable.");
      }
      setIsProcessing(false);
    };

    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
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
      handleFiles(e.dataTransfer.files);
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
        <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
        
        {isProcessing ? (
          <div className="space-y-8 animate-pulse">
            <div className="w-24 h-24 bg-black mx-auto"></div>
            <h3 className="text-4xl font-black uppercase tracking-tighter">Analyzing Hierarchy...</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-black/40">Gemini AI is parsing your document</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-8xl mb-4">🚀</div>
            <h3 className="text-5xl font-black uppercase tracking-tighter leading-none">Drop to <br/> Notionize</h3>
            <p className="text-black/40 font-black uppercase tracking-[0.4em] text-[10px]">PDF, DOCX, HTML, MARKDOWN</p>
            <button className="clay-button-primary px-12 py-5 text-sm">Select Document</button>
          </div>
        )}

        <div className="absolute top-8 left-8 text-[10px] font-black text-black/20 uppercase tracking-[0.3em]">SCHROEDER TECHNOLOGIES</div>
        <div className="absolute bottom-8 right-8 text-[10px] font-black text-black/20 uppercase tracking-[0.3em]">GREGORIOUS STUDIOS</div>
      </div>
    </div>
  );
};

export default FileImporter;
