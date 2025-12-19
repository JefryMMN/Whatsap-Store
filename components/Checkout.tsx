
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { Paper } from '../types';

interface CheckoutProps {
  onBack: () => void;
  onSubmit: (paper: Paper) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    publisher: '',
    link: '',
    description: '',
    category: '',
    year: new Date().getFullYear().toString()
  });
  
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.publisher || !formData.link || !formData.description) {
        setErrorMessage("Please fill out all required fields.");
        return;
    }

    // Character limit validation
    if (formData.description.length < 50) {
        setErrorMessage("Description is too short. Please provide historical context.");
        return;
    }

    // Fix: Added 'readTime' property to match the required structure of the Paper interface
    const finalReport: Paper = {
        id: `sub-${Date.now()}`,
        name: formData.title,
        price: 0,
        currency: '$',
        description: formData.description,
        image: formData.link,
        stock: 1,
        title: formData.title,
        publisher: formData.publisher,
        authors: [formData.publisher], 
        abstract: formData.description,
        abstractPreview: formData.description.substring(0, 150) + "...",
        publicationDate: formData.year,
        category: formData.category || "General",
        doi: formData.link,
        whyMatters: "Community submission pending peer review.",
        upvotes: 1,
        timestamp: Date.now(),
        aiInsights: ["Analysis pending..."], 
        publisherLogo: "US",
        readTime: "Research"
    };

    onSubmit(finalReport);
  };

  return (
    <div className="min-h-screen pt-24 pb-24 px-6 bg-white animate-fade-in-up">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#1c1917] transition-colors mb-12"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Archives
        </button>

        <div className="bg-white">
            <span className="text-xs font-bold uppercase tracking-widest text-[#b45309] mb-2 block">Acquisitions Desk</span>
            <h1 className="text-4xl font-serif text-[#1c1917] mb-4">Submit a Discovery</h1>
            <p className="text-sm text-gray-500 mb-12">
                Have you uncovered a new paper, artifact, or theory? Submit your findings to our editorial board for review.
            </p>
            
            <form className="space-y-12" onSubmit={handleSubmit}>
              
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[#1c1917] mb-2">Subject / Title *</label>
                        <input 
                            type="text" 
                            className="w-full bg-[#fdfbf7] border-b border-gray-200 py-3 px-3 text-sm focus:border-[#1c1917] outline-none transition-colors"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            placeholder="e.g. New Scrolls of Petra"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[#1c1917] mb-2">Submitted By / Institute *</label>
                        <input 
                            type="text" 
                            className="w-full bg-[#fdfbf7] border-b border-gray-200 py-3 px-3 text-sm focus:border-[#1c1917] outline-none transition-colors"
                            value={formData.publisher}
                            onChange={(e) => setFormData({...formData, publisher: e.target.value})}
                            placeholder="e.g. Oxford History Dept."
                        />
                    </div>
                  </div>

                  <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[#1c1917] mb-2">Source Link / Image URL *</label>
                        <input 
                            type="url" 
                            className="w-full bg-[#fdfbf7] border-b border-gray-200 py-3 px-3 text-sm focus:border-[#1c1917] outline-none transition-colors"
                            value={formData.link}
                            onChange={(e) => setFormData({...formData, link: e.target.value})}
                            placeholder="https://..."
                        />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[#1c1917] mb-2">Era / Year</label>
                        <input type="text" className="w-full bg-[#fdfbf7] border-b border-gray-200 py-3 px-3 text-sm focus:border-[#1c1917] outline-none transition-colors" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} placeholder="e.g. 1200 BC"/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[#1c1917] mb-2">Category</label>
                        <input type="text" className="w-full bg-[#fdfbf7] border-b border-gray-200 py-3 px-3 text-sm focus:border-[#1c1917] outline-none transition-colors" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="e.g. Antiquity, Artifacts"/>
                    </div>
                  </div>
              
                  <div>
                      <div className="flex justify-between mb-2">
                        <label className="block text-xs font-bold uppercase tracking-widest text-[#1c1917]">Description *</label>
                        <span className={`text-xs ${formData.description.length < 50 ? 'text-gray-400' : 'text-[#1c1917]'}`}>
                           {formData.description.length} chars
                        </span>
                      </div>
                      <textarea 
                          className="w-full bg-[#fdfbf7] border-b border-gray-200 py-3 px-3 text-sm resize-none focus:border-[#1c1917] outline-none transition-colors"
                          rows={6}
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          placeholder="Detail the historical significance of this finding."
                      />
                  </div>
              </div>

              {errorMessage && (
                <div className="p-4 bg-red-50 border-l-2 border-red-500 text-xs text-red-600">
                    {errorMessage}
                </div>
              )}

              <button 
                type="submit"
                className="w-full py-5 bg-[#1c1917] text-white text-sm font-bold uppercase tracking-widest rounded-full hover:bg-[#44403c] transition-colors shadow-xl"
              >
                Submit for Archival
              </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;