
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export const BRAND_NAME = 'ShopSmart';
export const COMPANY_NAME = 'Schroeder Technologies';
export const DESIGN_STUDIO = 'Gregorious Creative Studios';

export const STORE_CATEGORIES = [
  'All', 'Fashion', 'Electronics', 'Home', 'Beauty', 'Food'
];

export const ORDER_STATUSES = [
  { id: 'new', label: 'New Order', color: '#3B82F6' },
  { id: 'confirmed', label: 'Confirmed', color: '#8B5CF6' },
  { id: 'preparing', label: 'Packing', color: '#F59E0B' },
  { id: 'delivered', label: 'Delivered', color: '#10B981' },
  { id: 'cancelled', label: 'Cancelled', color: '#EF4444' }
];

export const FEATURES = [
  { 
    title: 'Instant Storefront', 
    desc: 'Create a beautiful product catalog in seconds. No coding, no servers, just products.', 
    icon: '🏪',
    color: '#6A4FBF'
  },
  { 
    title: 'WhatsApp Checkout', 
    desc: 'Customers browse online and order directly via WhatsApp message. Direct, personal, fast.', 
    icon: '💬',
    color: '#10B981'
  },
  { 
    title: 'Inventory Control', 
    desc: 'Manage stock, variants, and categories from your phone. Toggle visibility instantly.', 
    icon: '📦',
    color: '#F59E0B'
  },
  { 
    title: 'Smart Links', 
    desc: 'Get a unique URL and QR code for your shop to share on Instagram, TikTok, or business cards.', 
    icon: '🔗',
    color: '#EC4899'
  }
];

export const MOCK_PRODUCTS = [
  {
    id: 'p1',
    name: 'Retro High Tops',
    title: 'Retro High Tops',
    publisher: 'Nike',
    price: 120,
    currency: '$',
    description: 'Classic vibe sneakers with premium leather finish. Ultra-comfortable sole.',
    abstractPreview: 'Classic vibe sneakers with premium leather finish. Ultra-comfortable sole.',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800',
    stock: 12,
    isFeatured: true,
    readTime: '$120',
    upvotes: 12,
    publicationDate: 'New Arrival',
    aiInsights: ['Leather', 'Comfort']
  },
  {
    id: 'p2',
    name: 'Analog Watch X',
    title: 'Analog Watch X',
    publisher: 'Rolex',
    price: 250,
    currency: '$',
    description: 'Minimalist design for the modern professional. Water resistant up to 50m.',
    abstractPreview: 'Minimalist design for the modern professional. Water resistant up to 50m.',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800',
    stock: 5,
    isFeatured: true,
    readTime: '$250',
    upvotes: 5,
    publicationDate: 'Best Seller',
    aiInsights: ['Waterproof', 'Minimal']
  },
  {
    id: 'p3',
    name: 'Ceramic Pour-Over',
    title: 'Ceramic Pour-Over',
    publisher: 'HomeGoods',
    price: 45,
    currency: '$',
    description: 'Hand-crafted ceramic coffee maker. Brew the perfect cup every morning.',
    abstractPreview: 'Hand-crafted ceramic coffee maker. Brew the perfect cup every morning.',
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1572196284554-d9c252723702?auto=format&fit=crop&q=80&w=800',
    stock: 20,
    readTime: '$45',
    upvotes: 20,
    publicationDate: 'Handmade',
    aiInsights: ['Ceramic', 'Coffee']
  },
  {
    id: 'p4',
    name: 'Noise-Cancel Buds',
    title: 'Noise-Cancel Buds',
    publisher: 'Sony',
    price: 199,
    currency: '$',
    description: 'Silence the world. 24h battery life with charging case.',
    abstractPreview: 'Silence the world. 24h battery life with charging case.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800',
    stock: 8,
    readTime: '$199',
    upvotes: 8,
    publicationDate: 'Tech',
    aiInsights: ['Wireless', 'Noise Cancel']
  },
  {
    id: 'p5',
    name: 'Organic Face Oil',
    title: 'Organic Face Oil',
    publisher: 'Sephora',
    price: 35,
    currency: '$',
    description: 'Rejuvenate your skin with 100% natural ingredients.',
    abstractPreview: 'Rejuvenate your skin with 100% natural ingredients.',
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800',
    stock: 50,
    readTime: '$35',
    upvotes: 50,
    publicationDate: 'Organic',
    aiInsights: ['Natural', 'Glow']
  },
  {
    id: 'p6',
    name: 'Vintage Film Camera',
    title: 'Vintage Film Camera',
    publisher: 'Canon',
    price: 350,
    currency: '$',
    description: 'Fully restored 35mm film camera. Perfect for enthusiasts.',
    abstractPreview: 'Fully restored 35mm film camera.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
    stock: 2,
    readTime: '$350',
    upvotes: 45,
    publicationDate: 'Vintage',
    aiInsights: ['Analog', 'Photography']
  },
  {
    id: 'p7',
    name: 'Designer Lounge Chair',
    title: 'Designer Lounge Chair',
    publisher: 'Herman Miller',
    price: 899,
    currency: '$',
    description: 'Mid-century modern replica. Genuine leather and wood.',
    abstractPreview: 'Mid-century modern replica.',
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800',
    stock: 4,
    readTime: '$899',
    upvotes: 110,
    publicationDate: 'Furniture',
    aiInsights: ['Design', 'Comfort']
  },
  {
    id: 'p8',
    name: 'Mechanical Keyboard',
    title: 'Mechanical Keyboard',
    publisher: 'Keychron',
    price: 120,
    currency: '$',
    description: 'Wireless mechanical keyboard with RGB backlighting and brown switches.',
    abstractPreview: 'Wireless mechanical keyboard with RGB.',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800',
    stock: 15,
    readTime: '$120',
    upvotes: 200,
    publicationDate: 'Tech',
    aiInsights: ['Tactile', 'RGB']
  },
  {
    id: 'p9',
    name: 'Succulent Trio',
    title: 'Succulent Trio',
    publisher: 'GreenThumb',
    price: 25,
    currency: '$',
    description: 'Three low-maintenance succulents in ceramic pots.',
    abstractPreview: 'Three low-maintenance succulents.',
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800',
    stock: 30,
    readTime: '$25',
    upvotes: 85,
    publicationDate: 'Plants',
    aiInsights: ['Green', 'Decor']
  },
  {
    id: 'p10',
    name: 'Leather Wallet',
    title: 'Leather Wallet',
    publisher: 'Bellroy',
    price: 75,
    currency: '$',
    description: 'Slim bifold wallet made from vegetable-tanned leather.',
    abstractPreview: 'Slim bifold wallet.',
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1627123424574-18bd75f3194c?auto=format&fit=crop&q=80&w=800',
    stock: 25,
    readTime: '$75',
    upvotes: 60,
    publicationDate: 'Accessories',
    aiInsights: ['Leather', 'Slim']
  }
];

export const getPublisherInfo = (publisher: string = 'Default') => {
    return { color: '#000000', logo: publisher.charAt(0) };
};

// Legacy constants
export const GLOSSARY: Record<string, string> = {};
export const JOURNAL_ARTICLES: any[] = [];

export const INDUSTRIES = [
    { name: 'Finance', icon: '💰' },
    { name: 'Tech', icon: '💻' },
    { name: 'Health', icon: '🏥' },
    { name: 'Retail', icon: '🛍️' }
];

export const FAVICON_SIZES = [16, 32, 96];
export const APPLE_SIZES = [57, 60, 72, 76, 114, 120, 144, 152, 180];
export const ANDROID_SIZES = [192, 512];
export const MS_SIZES = [70, 144, 150, 310];

export const THREAD_TONES = [
    { id: 'educational', name: 'Educational' },
    { id: 'contrarian', name: 'Contrarian' },
    { id: 'storytelling', name: 'Storytelling' },
    { id: 'analytical', name: 'Analytical' }
];

export const SOURCE_ICONS: Record<string, string> = {
    email: '✉️',
    slack: '💬',
    chat_widget: '🌐',
    whatsapp: '📱'
};

export const CUSTOMER_TIERS: Record<string, { color: string }> = {
    standard: { color: 'border-gray-300 text-gray-500' },
    premium: { color: 'border-blue-500 text-blue-500' },
    enterprise: { color: 'border-purple-500 text-purple-500' },
    vip: { color: 'border-yellow-500 text-yellow-500' }
};
