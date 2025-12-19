
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { BRAND_NAME, COMPANY_NAME } from '../constants';

interface InfoPageProps {
  pageId: string;
}

const InfoPage: React.FC<InfoPageProps> = ({ pageId }) => {
  const contentMap: Record<string, { title: string, content: string, sections: { t: string, c: string }[] }> = {
    help: { 
        title: "Protocol Assistance", 
        content: "How can we assist your intelligence operations today? Frolo documentation is updated in real-time.",
        sections: [
            { t: "Quick Start", c: "Connect your Slack workspace via the Settings dashboard. Intelligence flow begins immediately." },
            { t: "AI Triage Logic", c: "Frolo uses Gemini 2.5 Pro to categorize signals. You can manually adjust sensitivity in the rule builder." },
            { t: "Channel Protocol", c: "Email, Chat, and Slack are supported out of the box. WhatsApp integration is currently in beta." }
        ]
    },
    privacy: { 
        title: "Privacy Protocol", 
        content: "Your signal data is your own. Frolo operates with strictly monochromatic encryption.",
        sections: [
            { t: "Data Collection", c: "We collect conversation metadata solely to improve your AI triage models." },
            { t: "Security Specs", c: "All transmissions are high-fidelity AES-256 encrypted." },
            { t: "Compliance", c: "Fully SOC2 and GDPR compliant for enterprise-grade support." }
        ]
    },
    terms: { 
        title: "Terms of Protocol", 
        content: "By using Frolo, you agree to these high-fidelity standards of communication.",
        sections: [
            { t: "Usage", c: "The platform is designed for professional support teams only." },
            { t: "Liability", c: "AI suggestions are drafts and must be reviewed by a human agent before transmission." },
            { t: "Scale", c: "Enterprise tiers support unlimited signals and custom logic nodes." }
        ]
    },
  };

  const data = contentMap[pageId] || { title: "Protocol Missing", content: "The requested signal does not exist.", sections: [] };

  return (
    <div className="py-32 px-6 max-w-[1000px] mx-auto animate-fade-in-up">
       <div className="mb-20">
           <span className="clay-text-convex mb-4">Official Documentation</span>
           <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter border-b-8 border-black pb-8 leading-none">
               {data.title}
           </h1>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
           <div className="lg:col-span-1">
               <p className="text-xl font-bold uppercase leading-relaxed text-black/60">
                   {data.content}
               </p>
           </div>
           
           <div className="lg:col-span-2 space-y-16">
               {data.sections.map((sec, i) => (
                   <div key={i} className="space-y-6">
                       <h3 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-black pb-2 inline-block">
                           {sec.t}
                       </h3>
                       <p className="text-lg font-bold uppercase tracking-tight text-black/80 leading-snug">
                           {sec.c}
                       </p>
                   </div>
               ))}
           </div>
       </div>

       <div className="mt-32 pt-16 border-t-4 border-black/10 text-center flex flex-col items-center">
           <div className="w-12 h-12 bg-black flex items-center justify-center text-white font-black text-xl mb-6 shadow-xl">F</div>
           <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30">
               © 2025 {COMPANY_NAME.toUpperCase()} • FROLO INTEL CORE v2.5
           </p>
       </div>
    </div>
  );
};

export default InfoPage;
