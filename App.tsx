/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import SettingsView from './components/SettingsView';
import InfoPage from './components/InfoPage';
import Inventory from './components/Inventory';
import CreateStoreFlow from './components/CreateStoreFlow';
import PublicStorePage from './components/PublicStorePage';
import { AppView, Product, CartItem, Order, AppSettings } from './types';
import { ORDER_STATUSES, BRAND_NAME } from './constants';

// Supabase Context
const SupabaseContext = createContext<any>(null);

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within SupabaseProvider');
  }
  return context;
};

interface SupabaseProviderProps {
  children: ReactNode;
}

const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL as string,
    import.meta.env.VITE_SUPABASE_ANON_KEY as string
  );

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
};

const AppContent: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [publicStoreSlug, setPublicStoreSlug] = useState<string | null>(null);
  const [allStores, setAllStores] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Settings / Store Profile
  const [settings, setSettings] = useState<AppSettings>({
    language: 'en',
    darkMode: false,
    storeProfile: {
      shopName: 'My Awesome Shop',
      whatsappNumber: '15550123456',
      currency: '$',
      description: 'The best products delivered directly to you.',
      themeColor: '#000000',
      categories: ['All', 'Fashion', 'Home', 'Electronics']
    },
    slackConnected: false,
    whatsappConnected: false,
    crmSync: { hubspot: false, salesforce: false },
    automationRules: []
  });

  const [activeCategory, setActiveCategory] = useState('All');

  // Initialization
  useEffect(() => {
    const path = window.location.pathname + window.location.hash;
    const storeMatch = path.match(/\/store\/([a-z0-9-]+)/);

    if (storeMatch) {
      setPublicStoreSlug(storeMatch[1]);
      setView('public-store');
      return;
    }

    const savedOrders = localStorage.getItem('shopsmart_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    const savedSettings = localStorage.getItem('shopsmart_settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  useEffect(() => {
    localStorage.setItem('shopsmart_orders', JSON.stringify(orders));
    localStorage.setItem('shopsmart_settings', JSON.stringify(settings));
  }, [orders, settings]);

  // Fetch all stores for Shop view
  useEffect(() => {
    if (view === 'store') {
      loadAllStores();
    }
  }, [view]);

  // Fetch all products for Items view
  useEffect(() => {
    if (view === 'inventory') {
      loadAllProducts();
    }
  }, [view]);

  const supabase = useSupabase(); // Use context here if needed, but since it's provider, children use it

  const loadAllStores = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading stores:', error);
    } else {
      setAllStores(data || []);
    }
    setLoading(false);
  };

  const loadAllProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        stores (
          name,
          slug,
          logo_url,
          currency
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading products:', error);
    } else {
      setAllProducts(data || []);
    }
    setLoading(false);
  };

  const handleNav = (target: string) => {
    setView(target as AppView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCreateStore = () => {
    setView('create-store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState({}, '', '/create-store');
  };

  const handleCloseCreateStore = () => {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState({}, '', '/');
  };

  const handleStoreCreated = (slug: string) => {
    setPublicStoreSlug(slug);
    setView('public-store');
    window.history.pushState({}, '', `/store/${slug}`);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, cartId: Math.random().toString(36), quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (item: CartItem) => {
    setCart(prev => prev.filter(i => i.cartId !== item.cartId));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      customerName: 'Guest Customer',
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'new',
      timestamp: Date.now(),
      method: 'whatsapp'
    };
    setOrders(prev => [newOrder, ...prev]);

    const lineItems = cart.map(i => `• ${i.name} x${i.quantity} (${settings.storeProfile.currency}${i.price * i.quantity})`).join('%0a');
    const total = settings.storeProfile.currency + newOrder.total;
    const text = `Hello *${settings.storeProfile.shopName}*, I'd like to place an order:%0a%0a${lineItems}%0a%0a*Total: ${total}*%0a%0aOrder Ref: ${newOrder.id}`;
    
    window.open(`https://wa.me/${settings.storeProfile.whatsappNumber}?text=${text}`, '_blank');
    
    setCart([]);
    setIsCartOpen(false);
  };

  const handleProductUpdate = (product: Product, action: 'add' | 'update' | 'delete') => {
    if (action === 'add') {
      setProducts(prev => [product, ...prev]);
    } else if (action === 'update') {
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    } else if (action === 'delete') {
      setProducts(prev => prev.filter(p => p.id !== product.id));
    }
  };

  const renderDashboard = () => (
    <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-[1200px] mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 border-b-4 border-black pb-6 md:pb-8 gap-6">
        <div>
          <span className="clay-text-convex mb-4 bg-black text-white border-none">Merchant Console</span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Orders</h1>
        </div>
        <div className="text-left md:text-right w-full md:w-auto bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-xl md:rounded-none">
          <p className="font-bold text-gray-400 uppercase tracking-widest text-[10px] md:text-xs">Total Revenue</p>
          <p className="text-3xl md:text-4xl font-black">{settings.storeProfile.currency}{orders.reduce((acc, o) => acc + o.total, 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {orders.length === 0 ? (
          <div className="p-12 md:p-20 text-center opacity-30 font-black uppercase tracking-widest bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            No orders yet. Share your shop link!
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="clay-card p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between md:justify-start gap-3 mb-2">
                  <span className="text-xs font-black bg-gray-100 px-2 py-1 rounded uppercase tracking-wider">{order.id}</span>
                  <span className="text-xs font-bold text-gray-400">{new Date(order.timestamp).toLocaleDateString()}</span>
                </div>
                <div className="font-bold text-lg">{order.items.length} Items</div>
                <div className="text-sm text-gray-500 truncate max-w-xs">
                  {order.items.map(i => i.name).join(', ')}
                </div>
              </div>
              
              <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                <div className="text-xl md:text-2xl font-black">{settings.storeProfile.currency}{order.total}</div>
                <select 
                  value={order.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as Order['status'];
                    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
                  }}
                  className="clay-pill-container px-4 py-2 font-bold uppercase text-[10px] md:text-xs outline-none cursor-pointer"
                  style={{ color: ORDER_STATUSES.find(s => s.id === order.status)?.color }}
                >
                  {ORDER_STATUSES.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Render Shop view (all created stores)
  const renderShopView = () => (
    <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-[1200px] mx-auto animate-fade-in">
      <div className="text-center mb-10 md:mb-16">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">All Shops</h1>
        <p className="text-gray-500 font-bold max-w-lg mx-auto text-base md:text-lg">Browse all created stores</p>
      </div>
      {loading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-bold">Loading shops...</p>
        </div>
      ) : allStores.length === 0 ? (
        <div className="text-center py-12 opacity-30 font-black uppercase tracking-widest bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          No shops created yet. Create one to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allStores.map((store) => (
            <div key={store.id} className="clay-card p-6 cursor-pointer hover:shadow-2xl transition-shadow" onClick={() => window.location.href = `/store/${store.slug}`}>
              <div className="mb-4">
                {store.logo_url ? (
                  <img src={store.logo_url} alt={store.name} className="w-full h-48 object-cover rounded-xl" />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center text-4xl">
                    {store.name.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="font-black text-xl mb-2">{store.name}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{store.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-600">View Store</span>
                <a href={`https://wa.me/${store.whatsapp_number}`} className="text-xs font-bold text-green-600 hover:text-green-800">💬 Chat</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render Items view (all products from all shops)
  const renderItemsView = () => (
    <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-[1200px] mx-auto animate-fade-in">
      <div className="text-center mb-10 md:mb-16">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">All Items</h1>
        <p className="text-gray-500 font-bold max-w-lg mx-auto text-base md:text-lg">Browse products from all shops</p>
      </div>
      {loading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-bold">Loading items...</p>
        </div>
      ) : allProducts.length === 0 ? (
        <div className="text-center py-12 opacity-30 font-black uppercase tracking-widest bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          No products available yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProducts.map((product) => (
            <div key={product.id} className="clay-card p-4">
              <div className="aspect-square bg-gray-100 overflow-hidden mb-4">
                <img
                  src={product.image_url || '/placeholder-image.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-black text-lg mb-2 line-clamp-1">{product.name}</h3>
              {product.description && (
                <p className="text-sm text-gray-500 font-bold mb-4 line-clamp-2">{product.description}</p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-2xl font-black">{product.stores.currency || '$'}{product.price}</span>
                <button 
                  onClick={() => window.open(`https://wa.me/${product.stores.whatsapp_number}?text=Hi! I'm interested in ${product.name} for ${product.stores.currency}${product.price}.`, '_blank')}
                  className="px-4 py-2 bg-[#25D366] text-white font-black uppercase tracking-widest rounded-lg text-xs shadow-lg hover:bg-[#128C7E] transition-colors"
                >
                  Buy
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">From {product.stores.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-black font-sans selection:bg-black selection:text-white flex flex-col overflow-hidden">
      <Navbar onNavClick={handleNav} activeView={view} />
      
      <main className="flex-grow">
        {view === 'landing' && (
           <div className="animate-fade-in">
              <Hero onStart={handleOpenCreateStore} />
              <div className="py-12 md:py-20 bg-black text-white text-center">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest mb-8">Sample Storefronts</h2>
                <div className="flex justify-center gap-4 flex-wrap px-4">
                   <button onClick={() => handleNav('store')} className="clay-button bg-white text-black px-6 md:px-8 py-3 md:py-4 text-xs md:text-sm">Browse All Shops</button>
                   <button onClick={() => handleNav('inventory')} className="clay-button bg-white text-black px-6 md:px-8 py-3 md:py-4 text-xs md:text-sm">Browse All Items</button>
                </div>
              </div>
              <Footer onLinkClick={(e, id) => { e.preventDefault(); handleNav(id); }} />
           </div>
        )}

        {view === 'create-store' && (
          <div className="min-h-screen bg-[#FDFDFD]">
            <CreateStoreFlow
              onClose={handleCloseCreateStore}
              onStoreCreated={handleStoreCreated}
            />
          </div>
        )}

        {view === 'public-store' && publicStoreSlug && (
          <PublicStorePage slug={publicStoreSlug} />
        )}

        {view === 'store' && renderShopView()}

        {view === 'inventory' && renderItemsView()}

        {view === 'settings' && (
           <SettingsView 
             settings={settings}
             onUpdate={(updates) => setSettings(prev => ({ ...prev, ...updates }))}
             shopName={settings.storeProfile.shopName}
             onShopNameChange={(n) => setSettings(prev => ({ ...prev, storeProfile: { ...prev.storeProfile, shopName: n } }))}
           />
        )}

        {['privacy', 'terms', 'help'].includes(view) && (
           <InfoPage pageId={view} />
        )}
      </main>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onRemoveItem={removeFromCart}
        onItemClick={() => {}}
      />
      
      {isCartOpen && cart.length > 0 && (
        <div className="fixed bottom-0 right-0 w-full md:w-[450px] bg-white border-t border-gray-100 p-6 pb-8 md:pb-6 z-[10002] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
           <div className="flex justify-between items-center mb-4">
             <span className="font-bold text-gray-500 text-sm md:text-base">Total</span>
             <span className="text-2xl font-black">{settings.storeProfile.currency}{cart.reduce((a,b) => a + (b.price * b.quantity), 0)}</span>
           </div>
           <button 
            onClick={handleCheckout}
            className="w-full py-4 bg-[#25D366] text-white font-black uppercase tracking-widest rounded-xl hover:bg-[#128C7E] transition-all flex items-center justify-center gap-3 shadow-lg active:scale-[0.98]"
           >
             <span className="text-xl">💬</span> <span className="text-xs md:text-sm">Order via WhatsApp</span>
           </button>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <SupabaseProvider>
    <AppContent />
  </SupabaseProvider>
);

export default App;