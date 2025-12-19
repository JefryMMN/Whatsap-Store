
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { ThreadSet, Tweet } from '../types';

interface ThreadPreviewProps {
  thread: ThreadSet;
  onFinish: () => void;
}

const ThreadPreview: React.FC<ThreadPreviewProps> = ({ thread, onFinish }) => {
  const [tweets, setTweets] = useState<Tweet[]>(thread.tweets);

  const handleUpdateTweet = (id: string, newContent: string) => {
    setTweets(prev => prev.map(t => t.id === id ? { ...t, content: newContent } : t));
  };

  const copyAll = () => {
    const text = tweets.map((t, i) => `${i + 1}/ ${t.content}`).join('\n\n---\n\n');
    navigator.clipboard.writeText(text);
    alert('Full thread protocol copied to clipboard.');
  };

  return (
    <div className="pt-40 pb-24 px-6 max-w-[800px] mx-auto animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <span className="clay-text-convex mb-4">Structure Complete</span>
          <h1 className="text-6xl md:text-8xl font-black text-black tracking-tighter uppercase leading-none">Threaded.</h1>
          <div className="flex gap-4 mt-6">
            <div className="px-4 py-2 bg-black text-white text-[9px] font-black uppercase tracking-widest">
              SCORE: {thread.engagementScore}/100
            </div>
            <div className="px-4 py-2 border-2 border-black text-black text-[9px] font-black uppercase tracking-widest">
              {thread.hookType}
            </div>
          </div>
        </div>
        <button
          onClick={copyAll}
          className="px-10 py-5 bg-black text-white text-xs font-black uppercase tracking-[0.3em] hover:invert transition-all shrink-0"
        >
          COPY ALL TWEETS
        </button>
      </div>

      <div className="space-y-12 relative">
        {/* Vertical line connecting tweets */}
        <div className="absolute left-[39px] top-10 bottom-10 w-0.5 bg-black/5 z-0"></div>

        {tweets.map((tweet, idx) => (
          <div key={tweet.id} className="relative z-10 flex gap-8">
            <div className="w-20 h-20 bg-black flex flex-col items-center justify-center text-white shrink-0 border-4 border-black">
              <span className="text-xl font-black">{idx + 1}</span>
              <span className="text-[8px] font-black opacity-40">TWEET</span>
            </div>
            
            <div className="flex-1 clay-card p-8 bg-white border-2 border-black/5 group hover:border-black transition-all">
              <textarea
                value={tweet.content}
                onChange={(e) => handleUpdateTweet(tweet.id, e.target.value)}
                className="w-full bg-transparent text-lg font-medium text-black outline-none resize-none no-scrollbar h-24"
              />
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-black/5">
                <div className="text-[10px] font-black uppercase text-black/20 tracking-widest">
                  {tweet.content.length}/280 CHARS
                </div>
                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-[10px] font-black uppercase tracking-widest hover:text-black transition-colors text-black/40">Edit</button>
                  <button className="text-[10px] font-black uppercase tracking-widest hover:text-black transition-colors text-black/40">Remove</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 pt-12 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-10">
        <button
          onClick={onFinish}
          className="text-[10px] font-black uppercase tracking-[0.5em] text-black/40 hover:text-black transition-colors"
        >
          ← NEW BRAIN DUMP
        </button>
        <div className="text-2xl font-black uppercase">🎯 Viral Potential</div>
      </div>
    </div>
  );
};

export default ThreadPreview;
