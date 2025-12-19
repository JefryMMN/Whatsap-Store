/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type AppView = 'landing' | 'store' | 'dashboard' | 'inventory' | 'settings' | 'privacy' | 'terms' | 'create-store' | 'public-store';

export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  category: string;
  image: string;
  stock: number;
  variants?: string[]; // e.g., "Size: M", "Color: Red"
  isFeatured?: boolean;
  // Legacy props for UI compatibility with existing cards
  title?: string;
  publisher?: string;
  readTime?: string;
  upvotes?: number;
  abstractPreview?: string;
  aiInsights?: string[];
  publicationDate?: string;
  fileUrl?: string; 
  // Extended fields for Checkout and other components
  authors?: string[];
  abstract?: string;
  doi?: string;
  whyMatters?: string;
  publisherLogo?: string;
  timestamp?: number;
}

// Alias for compatibility with existing components
export type Paper = Product; 

export interface CartItem extends Product {
  cartId: string;
  selectedVariant?: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone?: string;
  items: CartItem[];
  total: number;
  status: 'new' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
  timestamp: number;
  method: 'whatsapp';
}

export interface StoreProfile {
  shopName: string;
  whatsappNumber: string; // e.g., "12125551234"
  currency: string;
  logoUrl?: string;
  description: string;
  themeColor: string;
  categories: string[];
}

export interface AutomationRule {
    id: string;
    keyword: string;
    actionType: 'tag' | 'priority' | 'assign';
    actionValue: string;
    isActive: boolean;
}

export interface AppSettings {
  language: 'en' | 'es' | 'fr';
  darkMode: boolean;
  storeProfile: StoreProfile;
  // Extended settings
  slackConnected?: boolean;
  whatsappConnected?: boolean;
  crmSync?: {
      hubspot: boolean;
      salesforce: boolean;
  };
  automationRules?: AutomationRule[];
}

// Chat / Assistant
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

// Journal
export interface JournalArticle {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

// Contact / POS / Customers
export interface Contact {
  id: string;
  name: string;
  email: string;
  // Extended fields
  jobTitle?: string;
  company?: string;
  phone?: string;
  linkedinUrl?: string;
  address?: string;
  fax?: string;
  telex?: string;
  aiInsights?: string;
  status?: string;
  timestamp?: number;
}

// Integration Logs
export interface IntegrationLog {
  id: string;
  contactId: string;
  platform: string;
  message: string;
  timestamp: number;
}

// File Whisperer
export interface SummaryRecord {
  id: string;
  fileName: string;
  fileType: string;
  originalSize: string;
  title: string;
  distillation: string;
  keyPoints: string[];
  context: string;
  timestamp: number;
  shareUrl: string;
}

// Icon Generator
export interface IconResult {
    size: number;
    label: string;
    dataUrl: string;
    type: 'favicon' | 'apple' | 'android' | 'ms';
}

export interface FaviconSet {
    id: string;
    originalFileName: string;
    icons: IconResult[];
    htmlSnippet: string;
    manifestJson: string;
    timestamp: number;
}

// Scanner
export interface ScanRecord {
    id: string;
    originalImage: string;
    processedImage: string;
    extractedText: string;
    fileName: string;
    timestamp: number;
    status: 'processed';
}

// Thread Editor
export interface Tweet {
    id: string;
    content: string;
}

export interface ThreadSet {
    id: string;
    originalDump: string;
    tweets: Tweet[];
    hookType: string;
    engagementScore: number;
    timestamp: number;
}

// File Importer / Notion
export interface ConversionRecord {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: string;
    notionPageTitle: string;
    blocks: any[]; 
    status: string;
    timestamp: number;
}

// Support / Inbox / Tickets
export type TicketStatus = 'open' | 'in-progress' | 'blocked' | 'closed';
export type TicketSource = 'email' | 'slack' | 'chat_widget' | 'whatsapp';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type Sentiment = 'frustrated' | 'neutral' | 'positive' | 'urgent_escalation';
export type UserRole = 'admin' | 'agent' | 'viewer';
export type CustomerTier = 'standard' | 'premium' | 'enterprise' | 'vip';

export interface Message {
    id: string;
    role: 'agent' | 'customer';
    author: string;
    text: string;
    timestamp: number;
}

export interface Note {
    id: string;
    author: string;
    text: string;
    timestamp: number;
}

export interface Ticket {
    id: string;
    subject: string;
    category: string;
    source: TicketSource;
    priority: TicketPriority;
    status: TicketStatus;
    sentiment?: Sentiment;
    customerName: string;
    customerEmail: string;
    customerCompany: string;
    customerTier: CustomerTier;
    isEscalated: boolean;
    lastMessageAt: number;
    summary?: string;
    aiSuggestedReply?: string;
    sharedDraft?: string;
    assignedTo?: string;
    tags: string[];
    messages: Message[];
    notes: Note[];
}

export interface KBArticle {
    id: string;
    title: string;
    content: string;
    category: string;
    timestamp: number;
}