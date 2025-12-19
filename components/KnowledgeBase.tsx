
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { KBArticle } from '../types';

interface KnowledgeBaseProps {
  articles: KBArticle[];
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ articles }) => {
  const [search, setSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<KBArticle | null>(null);

  const filtered = articles.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex animate-fade-in bg-white">
      {/* List Sidebar */}
      <div className="w-[400px] border-r-4 border-black flex flex-col">
        <div className="p-8 border-b-4 border-black">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-6">Articles</h2>
          <input
            type="text"
            placeholder="Search Protocol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-6 py-3 border-2 border-black font-black uppercase tracking-widest text-[10px] outline-none"
          />
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filtered.map(article => (
            <div 
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className={`p-8 border-b-2 border-black/5 cursor-pointer transition-all hover:bg-black/5 ${selectedArticle?.id === article.id ? 'bg-black text-white' : ''}`}
            >
              <span className="text-[9px] font-black uppercase tracking-widest mb-3 block opacity-40">{article.category}</span>
              <h4 className="text-xl font-black uppercase tracking-tighter leading-none">{article.title}</h4>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-20 text-center opacity-20 font-black uppercase tracking-widest text-xs">No entries found.</div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-gray-50 flex flex-col">
        {selectedArticle ? (
          <div className="p-16 max-w-[800px] mx-auto animate-fade-in-up">
            <span className="inline-block px-4 py-1 bg-black text-white text-[9px] font-black uppercase tracking-widest mb-10">
              {selectedArticle.category} • DOCUMENTATION PROTOCOL
            </span>
            <h1 className="text-6xl font-black uppercase tracking-tighter mb-10 border-b-8 border-black pb-8 leading-none">
              {selectedArticle.title}
            </h1>
            <div className="prose prose-xl font-bold leading-relaxed text-black uppercase whitespace-pre-wrap">
              {selectedArticle.content}
            </div>
            <div className="mt-20 pt-12 border-t-4 border-black/10 flex justify-between items-center opacity-30">
              <span className="text-[9px] font-black uppercase tracking-[0.5em]">Extracted from protocol via AI</span>
              <span className="text-[9px] font-black uppercase tracking-[0.5em]">{new Date(selectedArticle.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-10">
            <div className="text-9xl mb-8">📚</div>
            <span className="text-2xl font-black uppercase tracking-[1em]">Select Article</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;
