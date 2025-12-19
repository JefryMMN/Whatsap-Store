
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { AppSettings, AutomationRule } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
}

const SettingsDashboard: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  const [newRule, setNewRule] = useState<Partial<AutomationRule>>({ keyword: '', actionType: 'tag', isActive: true });

  const toggle = (key: keyof AppSettings) => {
    onUpdate({ ...settings, [key]: !settings[key] });
  };

  const addRule = () => {
    if (!newRule.keyword || !newRule.actionValue) return;
    const rule: AutomationRule = {
      id: `rule-${Date.now()}`,
      keyword: newRule.keyword,
      actionType: newRule.actionType as any,
      actionValue: newRule.actionValue,
      isActive: true
    };
    onUpdate({ ...settings, automationRules: [...settings.automationRules, rule] });
    setNewRule({ keyword: '', actionType: 'tag', isActive: true });
  };

  const removeRule = (id: string) => {
    onUpdate({ ...settings, automationRules: settings.automationRules.filter(r => r.id !== id) });
  };

  return (
    <div className="p-6 md:p-16 max-w-[1200px] mx-auto animate-fade-in bg-white">
      <div className="mb-20">
        <span className="clay-text-convex mb-4">Support Protocol</span>
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter border-b-8 border-black pb-8">Control</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Integrations Section */}
        <div className="space-y-12">
          <h3 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-black pb-2 inline-block">Ingestion Nodes</h3>
          
          <div className="grid gap-6">
            <div className={`p-6 border-4 border-black transition-all ${settings.slackConnected ? 'bg-white shadow-xl' : 'bg-gray-50 opacity-40 grayscale'}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl">💬</span>
                <button onClick={() => toggle('slackConnected')} className="text-[8px] font-black uppercase tracking-widest border-2 border-black px-4 py-1 hover:bg-black hover:text-white transition-all">
                  {settings.slackConnected ? 'Active' : 'Deploy'}
                </button>
              </div>
              <h4 className="font-black uppercase text-sm tracking-tight mb-1">Slack Channel Hook</h4>
              <p className="text-[9px] font-black uppercase opacity-40">AUTO-INGESTION: ACTIVE</p>
            </div>

            <div className={`p-6 border-4 border-black transition-all ${settings.whatsappConnected ? 'bg-white shadow-xl' : 'bg-gray-50 opacity-40 grayscale'}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl">📱</span>
                <button onClick={() => toggle('whatsappConnected')} className="text-[8px] font-black uppercase tracking-widest border-2 border-black px-4 py-1 hover:bg-black hover:text-white transition-all">
                  {settings.whatsappConnected ? 'Active' : 'Deploy'}
                </button>
              </div>
              <h4 className="font-black uppercase text-sm tracking-tight mb-1">WhatsApp Business</h4>
              <p className="text-[9px] font-black uppercase opacity-40">SMS & MESSAGE CLUSTER</p>
            </div>
            
            <div className="p-6 border-4 border-black bg-gray-50">
               <h4 className="font-black uppercase text-sm tracking-tight mb-4">CRM Intelligence Sync</h4>
               <div className="flex gap-4">
                  <button className={`flex-1 py-3 font-black uppercase text-[8px] tracking-[0.3em] border-2 border-black transition-all ${settings.crmSync.hubspot ? 'bg-black text-white' : 'hover:bg-black/5'}`}>HubSpot</button>
                  <button className={`flex-1 py-3 font-black uppercase text-[8px] tracking-[0.3em] border-2 border-black transition-all ${settings.crmSync.salesforce ? 'bg-black text-white' : 'hover:bg-black/5'}`}>Salesforce</button>
               </div>
            </div>
          </div>
        </div>

        {/* Automation Section */}
        <div className="space-y-12">
          <h3 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-black pb-2 inline-block">Automation Rules</h3>
          
          <div className="p-8 border-4 border-black bg-[#FDFDFD] space-y-6">
             <div className="space-y-4">
                {settings.automationRules.map(rule => (
                  <div key={rule.id} className="flex justify-between items-center p-4 border-2 border-black bg-white group">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[8px] font-black uppercase opacity-30">Rule Protocol</span>
                        {!rule.isActive && <span className="text-[7px] font-black uppercase text-red-500">Disabled</span>}
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-tight truncate">
                        IF "{rule.keyword}" THEN <span className="text-red-500">{rule.actionType}</span> TO "{rule.actionValue}"
                      </div>
                    </div>
                    <button onClick={() => removeRule(rule.id)} className="text-[8px] font-black uppercase opacity-20 hover:opacity-100 hover:text-red-600 ml-4 transition-all">Delete</button>
                  </div>
                ))}
             </div>

             <div className="pt-6 border-t-2 border-black/5">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4">Sequence New Logic</h5>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input 
                    placeholder="Keyword (e.g. 'refund')" 
                    className="px-4 py-2 border-2 border-black font-black uppercase text-[9px] outline-none focus:bg-black focus:text-white"
                    value={newRule.keyword}
                    onChange={e => setNewRule({...newRule, keyword: e.target.value})}
                  />
                  <select 
                    className="px-4 py-2 border-2 border-black font-black uppercase text-[9px] outline-none"
                    value={newRule.actionType}
                    onChange={e => setNewRule({...newRule, actionType: e.target.value as any})}
                  >
                    <option value="tag">Add Tag</option>
                    <option value="priority">Set Priority</option>
                    <option value="assign">Assign To</option>
                  </select>
                </div>
                <input 
                  placeholder="Action Value (e.g. 'urgent')" 
                  className="w-full px-4 py-2 border-2 border-black font-black uppercase text-[9px] outline-none focus:bg-black focus:text-white mb-4"
                  value={newRule.actionValue || ''}
                  onChange={e => setNewRule({...newRule, actionValue: e.target.value})}
                />
                <button 
                  onClick={addRule}
                  className="w-full py-4 bg-black text-white font-black uppercase tracking-[0.4em] text-[9px] hover:invert transition-all"
                >
                  Apply to Protocol
                </button>
             </div>
          </div>
        </div>
      </div>

      <div className="mt-20 pt-10 border-t-4 border-black/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30">
          <span className="text-[8px] font-black uppercase tracking-[0.5em]">SupportHub OS v4.2.0 • Schroder Labs</span>
          <div className="flex gap-4">
            <span className="text-[8px] font-black uppercase tracking-widest">Documentation</span>
            <span className="text-[8px] font-black uppercase tracking-widest">Compliance Protocol</span>
          </div>
      </div>
    </div>
  );
};

export default SettingsDashboard;
