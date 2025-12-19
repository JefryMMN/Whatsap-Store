
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { Ticket, Message, Note, KBArticle, Sentiment, UserRole } from '../types';
import { CUSTOMER_TIERS, SOURCE_ICONS } from '../constants';

interface TicketDetailProps {
  ticket: Ticket;
  onSendMessage: (ticketId: string, text: string) => void;
  onAddNote: (ticketId: string, text: string) => void;
  onUpdateStatus: (ticketId: string, status: Ticket['status']) => void;
  onUpdateAssignment: (ticketId: string, agent: string) => void;
  onUpdateDraft: (ticketId: string, draft: string) => void;
  onResolve: (ticket: Ticket) => void;
  kbArticles: KBArticle[];
  userRole: UserRole;
}

const TicketDetail: React.FC<TicketDetailProps> = ({ 
  ticket, onSendMessage, onAddNote, onUpdateStatus, onUpdateAssignment, onUpdateDraft, onResolve, kbArticles, userRole 
}) => {
  const [reply, setReply] = useState(ticket.sharedDraft || '');
  const [activeTab, setActiveTab] = useState<'reply' | 'note'>('reply');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setReply(ticket.sharedDraft || '');
  }, [ticket.id]);

  const handleTextChange = (val: string) => {
    setReply(val);
    onUpdateDraft(ticket.id, val);
  };

  const useAI = () => {
    if (ticket.aiSuggestedReply) handleTextChange(ticket.aiSuggestedReply);
  };

  const handleSubmit = () => {
    if (!reply.trim()) return;
    if (userRole === 'viewer') {
      alert("Viewing permission only.");
      return;
    }
    if (activeTab === 'reply') {
      onSendMessage(ticket.id, reply);
      onUpdateDraft(ticket.id, '');
    } else {
      onAddNote(ticket.id, reply);
    }
    setReply('');
  };

  const getSentimentColor = (s?: Sentiment) => {
    switch(s) {
      case 'frustrated': return 'text-red-600 bg-red-50 border-red-200';
      case 'positive': return 'text-green-600 bg-green-50 border-green-200';
      case 'urgent_escalation': return 'text-white bg-black animate-pulse border-black';
      default: return 'text-black/40 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-white animate-fade-in divide-y-4 md:divide-y-0 md:divide-x-4 divide-black overflow-hidden relative">
      {/* Middle Pane: Conversation */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Header */}
        <div className="p-6 md:p-8 border-b-4 border-black flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white sticky top-0 z-10 gap-4">
          <div className="min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <span className="text-[8px] font-black text-black/40 uppercase tracking-[0.2em]">
                {ticket.id} • {ticket.category}
              </span>
              <span className="px-1.5 py-0.5 text-[8px] font-black uppercase bg-black text-white">
                {ticket.source}
              </span>
              {ticket.isEscalated && (
                <span className="px-1.5 py-0.5 text-[8px] font-black uppercase bg-red-600 text-white animate-pulse">
                  ESCALATED
                </span>
              )}
            </div>
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter truncate leading-none">{ticket.subject}</h2>
          </div>
          <div className="flex gap-2 shrink-0">
            <select 
              disabled={userRole === 'viewer'}
              value={ticket.status} 
              onChange={(e) => onUpdateStatus(ticket.id, e.target.value as any)}
              className="px-3 py-2 border-2 border-black font-black uppercase text-[9px] tracking-widest outline-none bg-white cursor-pointer disabled:opacity-30"
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="blocked">Blocked</option>
              <option value="closed">Closed</option>
            </select>
            <button 
              disabled={userRole === 'viewer'}
              onClick={() => onResolve(ticket)}
              className="px-4 py-2 bg-black text-white font-black uppercase text-[9px] tracking-widest hover:invert transition-all active:scale-95 disabled:opacity-10"
            >
              Resolve
            </button>
          </div>
        </div>

        {/* Conversation Feed */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-12 no-scrollbar bg-[#FBFBFB]">
          {ticket.summary && (
            <div className="p-6 border-4 border-black bg-white shadow-xl flex items-start gap-5 group">
              <div className="text-2xl grayscale group-hover:grayscale-0 transition-all">🤖</div>
              <div>
                <span className="text-[8px] font-black uppercase tracking-[0.4em] block mb-2 opacity-30">Schroeder Intelligence Core • Summary</span>
                <p className="text-sm font-bold leading-relaxed">{ticket.summary}</p>
              </div>
            </div>
          )}

          {[...ticket.messages.map(m => ({ ...m, type: 'msg' })), ...ticket.notes.map(n => ({ ...n, type: 'note' }))]
            .sort((a, b) => a.timestamp - b.timestamp)
            .map((item: any, idx) => (
              <div key={idx} className={`flex ${item.role === 'agent' || item.type === 'note' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] md:max-w-[85%] p-6 md:p-8 border-4 border-black shadow-[12px_12px_0px_rgba(0,0,0,0.03)] ${
                  item.type === 'note' ? 'bg-yellow-50 border-dashed border-black/10 shadow-none' :
                  item.role === 'agent' ? 'bg-black text-white' : 'bg-white text-black'
                }`}>
                  <div className="flex justify-between items-center mb-4 opacity-40">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em]">
                      {item.type === 'note' ? `TEAM NOTE • ${item.author}` : item.role === 'agent' ? `NODE • ${item.author || 'Schroeder'}` : ticket.customerName}
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-widest ml-6 shrink-0">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-base md:text-lg font-bold leading-tight whitespace-pre-wrap selection:bg-white/20">{item.text}</p>
                </div>
              </div>
            ))}
        </div>

        {/* Real-time Collaboration Strip */}
        <div className="px-8 py-3 bg-gray-50 border-t-2 border-black/5 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="flex gap-1">
                 <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"></div>
                 <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:0.2s]"></div>
                 <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-30">Agent Beta is viewing this thread...</span>
           </div>
           {ticket.sharedDraft && (
             <span className="text-[8px] font-black uppercase tracking-widest text-red-500 animate-pulse">Live Draft Syncing</span>
           )}
        </div>

        {/* Input Console */}
        <div className="p-8 md:p-10 border-t-4 border-black bg-white">
          {ticket.aiSuggestedReply && (
            <div className="mb-6 flex justify-between items-center bg-black text-white p-4 text-[9px] font-black uppercase tracking-[0.4em] shadow-lg">
              <span className="flex items-center gap-3"><span className="animate-pulse">✨</span> AI Protocol Ready</span>
              <button onClick={useAI} className="underline hover:opacity-70 transition-opacity">Commit Signal</button>
            </div>
          )}
          <div className="flex gap-6 mb-6">
            <button 
              onClick={() => setActiveTab('reply')}
              className={`text-[10px] font-black uppercase tracking-[0.4em] border-b-2 pb-2 transition-all ${activeTab === 'reply' ? 'border-black' : 'border-transparent text-black/20'}`}
            >
              Public Transmit
            </button>
            <button 
              onClick={() => setActiveTab('note')}
              className={`text-[10px] font-black uppercase tracking-[0.4em] border-b-2 pb-2 transition-all ${activeTab === 'note' ? 'border-black' : 'border-transparent text-black/20'}`}
            >
              Team Intelligence
            </button>
          </div>
          <div className="relative group">
            <textarea
              disabled={userRole === 'viewer'}
              value={reply}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={activeTab === 'reply' ? "Draft channel response..." : "Mention @teammates for collaborative triage..."}
              className={`w-full h-32 p-6 outline-none font-bold text-lg resize-none no-scrollbar border-4 border-black focus:shadow-[10px_10px_0px_rgba(0,0,0,0.1)] transition-all ${activeTab === 'note' ? 'bg-yellow-50/30' : 'bg-white'} disabled:opacity-20`}
            />
            {userRole === 'viewer' && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[1px]">
                 <span className="text-[10px] font-black uppercase tracking-[1em] text-black/30">READ_ONLY_ACCESS</span>
              </div>
            )}
          </div>
          <div className="flex justify-end mt-6">
            <button 
              disabled={userRole === 'viewer' || !reply.trim()}
              onClick={handleSubmit} 
              className="px-12 py-5 bg-black text-white font-black uppercase tracking-[0.5em] text-xs hover:invert transition-all shadow-2xl active:scale-95 disabled:opacity-10"
            >
              {activeTab === 'reply' ? 'Sync Transmit' : 'Sync Intelligence'}
            </button>
          </div>
        </div>
      </div>

      {/* Right Pane: Context Sidebar */}
      <div className="w-full md:w-[400px] shrink-0 flex flex-col p-10 space-y-12 overflow-y-auto no-scrollbar bg-white">
        <div>
          <h4 className="text-[9px] font-black text-black/30 uppercase tracking-[0.5em] mb-8 border-b border-black/5 pb-2">Context Node</h4>
          <div className="flex flex-col items-center text-center">
             <div className="w-20 h-20 bg-black text-white flex items-center justify-center text-3xl font-black mb-6 shadow-2xl">
               {ticket.customerName.charAt(0)}
             </div>
             <h3 className="text-2xl font-black uppercase tracking-tight leading-none mb-1">{ticket.customerName}</h3>
             <p className="text-xs font-black text-black/30 uppercase mb-6 tracking-widest">{ticket.customerEmail}</p>
             <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border-2 border-black ${CUSTOMER_TIERS[ticket.customerTier].color}`}>
               {ticket.customerTier} PROTOCOL
             </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-6 border-4 border-black bg-[#FAFAFA] group hover:bg-black hover:text-white transition-all">
            <span className="text-[8px] font-black text-black/30 group-hover:text-white/40 uppercase tracking-[0.4em] block mb-2">Entity Name</span>
            <div className="text-sm font-black uppercase truncate">{ticket.customerCompany}</div>
          </div>
          <div className={`p-6 border-4 border-black transition-all ${getSentimentColor(ticket.sentiment)}`}>
            <span className="text-[8px] font-black opacity-40 uppercase tracking-[0.4em] block mb-2">Sentiment Vector</span>
            <div className="text-sm font-black uppercase">
              {ticket.sentiment?.replace('_', ' ') || 'DETERMINING...'}
            </div>
          </div>
          <div className="p-6 border-4 border-black bg-[#FAFAFA]">
            <span className="text-[8px] font-black text-black/30 uppercase tracking-[0.4em] block mb-2">Assigned Unit</span>
            <select 
              disabled={userRole === 'viewer'}
              value={ticket.assignedTo || ''} 
              onChange={(e) => onUpdateAssignment(ticket.id, e.target.value)}
              className="w-full bg-transparent font-black text-xs uppercase outline-none cursor-pointer disabled:opacity-20"
            >
              <option value="">Awaiting Node</option>
              <option value="Agent Alpha">Agent Alpha (You)</option>
              <option value="Agent Beta">Agent Beta</option>
              <option value="Billing Team">Billing Cluster</option>
              <option value="DevOps Team">System Node</option>
            </select>
          </div>
        </div>

        <div>
          <h4 className="text-[9px] font-black text-black/30 uppercase tracking-[0.5em] mb-6 border-b border-black/5 pb-2">Linked Protocol</h4>
          <div className="space-y-3">
             {kbArticles.slice(0, 3).map(art => (
               <div key={art.id} className="p-4 border-4 border-black hover:bg-black hover:text-white transition-all cursor-pointer group shadow-lg">
                  <h5 className="text-[10px] font-black uppercase tracking-tight leading-snug">{art.title}</h5>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[7px] font-black opacity-30 uppercase group-hover:text-white/40">MATCH: {90 + Math.floor(Math.random() * 9)}%</span>
                    <button className="text-[8px] font-black uppercase tracking-widest group-hover:text-white underline">Cite</button>
                  </div>
               </div>
             ))}
             {kbArticles.length === 0 && <p className="text-[9px] font-black opacity-20 uppercase tracking-[0.3em]">No Context Match.</p>}
          </div>
        </div>

        <div className="pt-8 border-t-2 border-black/5">
          <h4 className="text-[9px] font-black text-black/30 uppercase tracking-[0.5em] mb-4">Identity Tags</h4>
          <div className="flex flex-wrap gap-2">
            {ticket.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-white text-black text-[8px] font-black uppercase tracking-widest border-2 border-black hover:bg-black hover:text-white transition-all cursor-default">
                {tag}
              </span>
            ))}
            <button className="px-3 py-1 bg-gray-50 text-black/30 text-[8px] font-black uppercase border-2 border-dashed border-black/10 hover:border-black transition-all">+</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
