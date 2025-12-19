
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { Ticket, TicketStatus } from '../types';
import { SOURCE_ICONS } from '../constants';

interface InboxProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  selectedTicketId?: string;
}

const Inbox: React.FC<InboxProps> = ({ tickets, onSelectTicket, selectedTicketId }) => {
  const [filter, setFilter] = useState<TicketStatus | 'all'>('all');

  const filteredTickets = tickets.filter(t => filter === 'all' || t.status === filter);

  const getPriorityMarker = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-black text-white ring-4 ring-black/10';
      case 'high': return 'bg-black text-white';
      default: return 'bg-gray-100 text-black border-2 border-black/5';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white animate-fade-in">
      <div className="p-8 border-b-4 border-black bg-white sticky top-0 z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-black uppercase tracking-tighter">Signals</h2>
          <span className="text-[10px] font-black px-3 py-1 bg-black text-white tracking-[0.2em]">{filteredTickets.length}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'open', 'in-progress', 'blocked', 'closed'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as any)}
              className={`px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.3em] transition-all border-2 border-black ${
                filter === s ? 'bg-black text-white shadow-lg' : 'bg-white text-black hover:bg-black/5'
              }`}
            >
              {s.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar bg-[#FDFDFD]">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.id}
            onClick={() => onSelectTicket(ticket)}
            className={`p-6 border-b-2 border-black/5 cursor-pointer transition-all hover:bg-black/5 relative group ${
              selectedTicketId === ticket.id ? 'bg-black text-white ring-4 ring-black ring-inset' : 'bg-white'
            }`}
          >
            {ticket.isEscalated && (
               <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-600 animate-pulse"></div>
            )}
            
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{SOURCE_ICONS[ticket.source]}</span>
                <span className={`text-[7px] font-black uppercase tracking-[0.4em] px-2 py-0.5 ${getPriorityMarker(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </div>
              <span className={`text-[8px] font-black opacity-30 shrink-0 ${selectedTicketId === ticket.id ? 'text-white/40' : ''}`}>
                {new Date(ticket.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <h4 className="font-black uppercase tracking-tight text-sm mb-2 truncate leading-none">{ticket.subject}</h4>
            
            <div className="flex justify-between items-center">
              <div className="min-w-0">
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] truncate block ${selectedTicketId === ticket.id ? 'text-white/60' : 'text-black/40'}`}>
                  {ticket.customerName}
                </span>
                <span className={`text-[7px] font-black uppercase tracking-widest block mt-0.5 opacity-30 truncate ${selectedTicketId === ticket.id ? 'text-white/30' : ''}`}>
                   {ticket.customerCompany}
                </span>
              </div>
              <div className={`w-2 h-2 rounded-full border border-black/20 ${
                ticket.status === 'open' ? 'bg-black' :
                ticket.status === 'in-progress' ? 'bg-gray-400' :
                ticket.status === 'blocked' ? 'bg-red-500' : 'bg-gray-100'
              }`}></div>
            </div>
          </div>
        ))}

        {filteredTickets.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="text-6xl mb-6 opacity-5 select-none">🕳️</div>
            <p className="font-black uppercase tracking-[0.5em] text-[10px] opacity-10">Protocol Void</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
