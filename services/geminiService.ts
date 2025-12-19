/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Deep Triage: Categorizes, prioritizes, summarizes, and detects sentiment.
 */
export const analyzeSupportTicket = async (subject: string, message: string): Promise<any> => {
  try {
    const prompt = `
      You are the SupportHub Intelligence Core.
      Analyze this incoming support request:
      Subject: "${subject}"
      Message: "${message}"

      Requirements:
      1. Category: [General, Technical, Billing, Feature Request, Bug Report, Account, Onboarding].
      2. Priority: [low, medium, high, urgent].
      3. Confidence Score: (0-100).
      4. Summary: 1-sentence executive summary.
      5. Sentiment: [frustrated, neutral, positive, urgent_escalation].
      6. Escalation Likelihood: Is the user threatening to churn or very angry? (boolean).
      7. Reply Draft: A high-quality, professional, and empathetic response.

      Return valid JSON only.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            priority: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            sentiment: { type: Type.STRING },
            isEscalated: { type: Type.BOOLEAN },
            suggestedReply: { type: Type.STRING }
          },
          required: ["category", "priority", "summary", "sentiment", "isEscalated", "suggestedReply"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Triage Error:", error);
    return null;
  }
};

/**
 * Knowledge Base Synthesis: Updates or creates KB articles based on resolution.
 */
export const extractKBFromConversation = async (subject: string, messages: any[]): Promise<any> => {
  try {
    const convStr = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n');
    const prompt = `
      Extract actionable documentation from this resolved conversation.
      Subject: "${subject}"
      Thread:
      ${convStr}

      Requirements:
      1. Title: Search-optimized title.
      2. Content: Markdown format with clear steps.
      3. Category.
      4. Search Tags.

      Return valid JSON only.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            category: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "content", "category"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    return null;
  }
};

export const sendMessageToGemini = async (history: {role: string, text: string}[], message: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
                { role: 'user', parts: [{ text: message }] }
            ],
        });
        return response.text || "Node Offline.";
    } catch (e) {
        return "Intelligence Node Offline.";
    }
};

export const getEnrichment = async (name: string, company: string): Promise<string> => {
    const prompt = `Generate a professional conversation starter or bio for ${name} from ${company}. Keep it under 20 words.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text || "Strategic Intelligence Advisor.";
};

export const extractContactFromImage = async (base64Image: string): Promise<any> => {
     try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
                { text: "Extract business card details (name, jobTitle, company, email, phone, address) as JSON." }
            ],
            config: {
                responseMimeType: 'application/json'
            }
        });
        return JSON.parse(response.text || "{}");
     } catch (e) {
         return null;
     }
};

export const whisperFileSummary = async (fileName: string, data: string, isImage: boolean): Promise<any> => {
    const prompt = isImage ? 
        "Analyze this image document. Provide a title, a 1-sentence distillation, 3 key bullet points, and the context (e.g. Legal, Tech, Finance)." :
        `Analyze this text document (${fileName}). Provide a title, a 1-sentence distillation, 3 key bullet points, and the context. Content: ${data.substring(0, 5000)}`;
    
    const parts: any[] = [{ text: prompt }];
    if (isImage) {
        parts.unshift({ inlineData: { mimeType: 'image/jpeg', data: data } });
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: parts,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        distillation: { type: Type.STRING },
                        keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                        context: { type: Type.STRING }
                    }
                }
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (e) {
        return null;
    }
};

export const analyzeLogoForIcons = async (fileName: string, base64: string): Promise<any> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { inlineData: { mimeType: 'image/png', data: base64 } },
                { text: "Analyze this logo. Suggest a hex themeColor, a hex backgroundColor, a paddingPercentage (0-30), and a shortDescription." }
            ],
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        themeColor: { type: Type.STRING },
                        backgroundColor: { type: Type.STRING },
                        paddingPercentage: { type: Type.NUMBER },
                        shortDescription: { type: Type.STRING }
                    }
                }
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (e) {
        return { themeColor: '#000000', backgroundColor: '#ffffff', paddingPercentage: 10, shortDescription: 'Logo' };
    }
};

export const processDocumentScan = async (base64: string): Promise<any> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { inlineData: { mimeType: 'image/jpeg', data: base64 } },
                { text: "OCR this document. Return extractedText and a suggestedFileName." }
            ],
            config: {
                responseMimeType: 'application/json'
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (e) {
        return null;
    }
};

export const generateThreadFromDump = async (dump: string, tone: string): Promise<any> => {
    try {
        const prompt = `Turn this brain dump into a viral Twitter thread (array of tweets). Tone: ${tone}. Also provide a hookType (e.g. 'Question', 'Statement') and predicted engagementScore (0-100). Dump: ${dump}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        tweets: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: {type: Type.STRING}, content: {type: Type.STRING} } } },
                        hookType: { type: Type.STRING },
                        engagementScore: { type: Type.NUMBER }
                    }
                }
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (e) {
        return null;
    }
};

export const parseDocumentToNotionBlocks = async (fileName: string, data: string, isImage: boolean): Promise<any> => {
    const prompt = "Parse this document content into a hierarchical structure of Notion blocks (heading_1, heading_2, paragraph, bulleted_list_item, quote, callout, code). Return a JSON with 'title' and 'blocks' array.";
    const parts: any[] = [{ text: prompt }];
    if (isImage) {
        parts.unshift({ inlineData: { mimeType: 'image/jpeg', data: data } });
    } else {
        parts.push({ text: `Content: ${data.substring(0, 10000)}` });
    }
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: parts,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || "{}");
    } catch (e) {
        return null;
    }
};
