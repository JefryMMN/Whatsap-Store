
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { ConversionRecord } from '../types';

interface NotionPreviewProps {
  record: ConversionRecord;
  onConfirm: () => void;
  onBack: () => void;
}

const NotionPreview: React.FC<NotionPreviewProps> = ({ record, onConfirm, onBack }) => {
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = () => {
    setIsImporting(true);
    // Simulate Notion API import
    setTimeout(() => {
      onConfirm();
      setIsImporting(false);
    }, 2500);
  };

  const renderBlock = (block: any) => {
    switch (block.type) {
      case 'heading_1': return <h1 className="text-3xl font-bold mt-6 mb-2">{block.content}</h1>;
      case 'heading_2': return <h2 className="text-2xl font-bold mt-4 mb-2">{block.content}</h2>;
      case 'heading_3': return <h3 className="text-xl font-bold mt-3 mb-2">{block.content}</h3>;
      case 'bulleted_list_item': return <li className="ml-6 list-disc">{block.content}</li>;
      case 'numbered_list_item': return <li className="ml-6 list-decimal">{block.content}</li>;
      case 'quote': return <blockquote className="border-l-4 border-black pl-4 italic my-4">{block.content}</blockquote>;
      case 'callout': return <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg my-4 flex gap-4"><span className="text-xl">ℹ️</span>{block.content}</div>;
      case 'code': return <pre className="bg-gray-100 p-4 font-mono text-sm rounded-lg overflow-x-auto my-4">{block.content}</pre>;
      case 'divider': return <hr className="my-6 border-gray-200" />;
      default: return <p className="my-2">{block.content}</p>;
    }
  };

  return (
    <div className="pt-40 pb-24 px-6 max-w-[1200px] mx-auto animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <span className="clay-text-convex mb-4">Semantic Analysis Ready</span>
          <h1 className="text-6xl md:text-8xl font-black text-black tracking-tighter uppercase leading-none">Review.</h1>
          <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.3em] mt-4">
            MAPPING: {record.fileName} → "{record.notionPageTitle}"
          </p>
        </div>
        <div className="flex gap-4">
            <button
                onClick={onBack}
                className="px-10 py-5 border-4 border-black text-black text-xs font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all"
            >
                Edit File
            </button>
            <button
                onClick={handleImport}
                disabled={isImporting}
                className="px-10 py-5 bg-black text-white text-xs font-black uppercase tracking-[0.3em] hover:invert transition-all flex items-center gap-4 shadow-2xl"
            >
                {isImporting ? <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div> : 'Confirm Import'}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Source File Overview */}
        <div className="clay-card p-10 bg-gray-50 border-4 border-black h-full">
            <h3 className="text-xl font-black uppercase tracking-widest border-b-4 border-black pb-4 mb-8">Source Stats</h3>
            <div className="space-y-6">
                <div>
                    <label className="text-[9px] font-black uppercase text-black/40 tracking-widest block mb-2">FILENAME</label>
                    <div className="font-black text-lg">{record.fileName}</div>
                </div>
                <div>
                    <label className="text-[9px] font-black uppercase text-black/40 tracking-widest block mb-2">SIZE</label>
                    <div className="font-black text-lg">{record.fileSize}</div>
                </div>
                <div>
                    <label className="text-[9px] font-black uppercase text-black/40 tracking-widest block mb-2">IDENTIFIED ELEMENTS</label>
                    <div className="font-black text-lg">{record.blocks.length} Notion Blocks</div>
                </div>
            </div>
            <div className="mt-12 opacity-30 font-black italic">Original layout preserved in memory protocol...</div>
        </div>

        {/* Notion Block Preview */}
        <div className="clay-card p-12 bg-white border-4 border-black shadow-2xl min-h-[600px]">
            <div className="flex items-center gap-4 mb-10 border-b border-gray-100 pb-6">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black">N</div>
                <h2 className="text-3xl font-black tracking-tighter uppercase">{record.notionPageTitle}</h2>
            </div>
            <div className="prose prose-sm font-sans text-black max-w-none">
                {record.blocks.map((block, i) => (
                    <div key={block.id || i}>{renderBlock(block)}</div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default NotionPreview;
