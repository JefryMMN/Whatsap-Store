
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { IntegrationLog, Contact } from '../types';

interface CRMProps {
  customers: Contact[];
  sales: IntegrationLog[];
}

export default function Customers({ customers, sales }: CRMProps) {
  return (
    <div className="pt-32 pb-24 px-6 max-w-[1200px] mx-auto animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-center md:text-left">
        <div>
            <span className="clay-text-convex text-[10px] font-black text-[#2AB9A9] uppercase tracking-widest mb-3">Sync Ledger</span>
            <h1 className="text-5xl font-black text-[#4A4A4A]">CRM Integrations</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-black text-[#4A4A4A] mb-8">Activity Feed</h3>
              {sales.length === 0 ? (
                  <div className="clay-card p-20 text-center opacity-30 font-black italic">No sync activity yet.</div>
              ) : (
                sales.map(log => {
                    const contact = customers.find(c => c.id === log.contactId);
                    return (
                        <div key={log.id} className="clay-card p-6 bg-white flex items-center justify-between border-2 border-white hover:border-[#2AB9A9]/30 transition-all">
                            <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xs ${log.platform === 'LinkedIn' ? 'bg-[#0077b5]' : 'bg-[#FF7A59]'}`}>
                                    {log.platform.substring(0,2).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-black text-[#4A4A4A]">{log.message}</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase">{contact?.name || 'Lead'} • {new Date(log.timestamp).toLocaleTimeString()}</div>
                                </div>
                            </div>
                            <span className="px-4 py-1.5 rounded-full bg-green-100 text-green-600 text-[10px] font-black uppercase tracking-widest">Active</span>
                        </div>
                    );
                })
              )}
          </div>

          <div className="space-y-8">
              <div className="clay-card p-10 bg-[#FFB673] text-white shadow-2xl">
                  <h4 className="text-xl font-black mb-4">Marc's Tip</h4>
                  <p className="text-white/80 text-sm font-bold leading-relaxed italic">
                    "Every business card is a potential pivot point. Automate the capture, personalize the outreach."
                  </p>
              </div>
              <div className="clay-card p-10 bg-white border-4 border-white shadow-xl">
                  <h4 className="text-xl font-black text-[#4A4A4A] mb-6">Connected Platforms</h4>
                  <div className="space-y-4">
                      {['LinkedIn Autoconnect', 'HubSpot Lead Sync', 'Google Contacts', 'Follow-up AI'].map(p => (
                          <div key={p} className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className="text-sm font-bold text-gray-500">{p}</span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
