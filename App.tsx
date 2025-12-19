/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
import { supabase } from './services/supabase'; // ← NEW: Import the single client

// Supabase Context (updated with auth)
const SupabaseContext = createContext<{
  supabase: any;
  user: any;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  getUser: () => Promise<any>;
}>(null!);

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
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []); // ← Empty dependency array (supabase is now imported globally)

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return { data: { user } };
  };

  return (
    <SupabaseContext.Provider value={{ supabase, user, signIn, signOut, getUser }}>
      {children}
    </SupabaseContext.Provider>
  );
};

const AppContent: React.FC = () => {
  const { supabase, user, signIn, signOut } = useSupabase();
  const [view, setView] = useState<AppView>('landing');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [publicStoreSlug, setPublicStoreSlug] = useState<string | null>(null);
  const [allStores, setAllStores] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOwnerForStore, setIsOwnerForStore] = useState<Record<string, boolean>>({});
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
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

  // Login handlers
  const handleSignIn = async () => {
    try {
      await signIn(loginEmail, loginPassword);
      setShowLogin(false);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleShowLogin = () => setShowLogin(true);
  const handleHideLogin = () => setShowLogin(false);

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

  const loadAllStores = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('stores')
      .select('id, name, slug, logo_url, description, whatsapp_number, currency, creator_id')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading stores:', error);
    } else {
      setAllStores(data || []);

      // Compute ownership directly from stores data (more reliable)
      if (user && data) {
        const ownership: Record<string, boolean> = {};
        data.forEach((store: any) => {
          ownership[store.id] = store.creator_id === user.id;
        });
        setIsOwnerForStore(ownership);
      }
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
          id, name, slug, logo_url, currency, whatsapp_number, creator_id
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

  // FIXED: Require login before opening create store flow
  const handleOpenCreateStore = () => {
    if (!user) {
      setShowLogin(true);
      alert("Please log in to create your shop!");
      return;
    }
    setView('create-store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState({}, '', '/create-store');
  };

  const handleCloseCreateStore = () => {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState({}, '', '/');
  };

  // SIMPLIFIED: creator_id is now set directly in CreateStoreFlow — no need for fallback update
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

  // Owner-only functions for inventory
  const addProductToStore = async (storeId: string, newProductData: any) => {
    if (!user || !isOwnerForStore[storeId]) return alert('Only store owners can add products!');
    const { error } = await supabase.from('products').insert({
      ...newProductData,
      store_id: storeId,
      price: parseFloat(newProductData.price.toString())
    });
    if (error) alert(error.message);
    else {
      loadAllProducts(); // Refresh
    }
  };

  const updateProduct = async (productId: string, updates: Partial<any>) => {
    if (!user) return;
    const { error } = await supabase.from('products').update(updates).eq('id', productId);
    if (error) alert(error.message);
    else {
      loadAllProducts();
    }
  };

  const deleteProduct = async (productId: string, storeId: string) => {
    if (!user || !isOwnerForStore[storeId]) return alert('Only store owners can delete!');
    if (confirm('Delete this product?')) {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) alert(error.message);
      else loadAllProducts();
    }
  };

  const renderDashboard = () => (
    <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-[1200px] mx-auto animate-fade-in">
      {/* Dashboard content unchanged */}
      {/* ... your existing dashboard code ... */}
    </div>
  );

  const renderShopView = () => (
    <div className="pt-28 md:pt-32 pb-24 px-4 md:px-6 max-w-[1200px] mx-auto animate-fade-in">
      {/* Shop view unchanged */}
      {/* ... your existing shop view code ... */}
    </div>
  );

  const renderItemsView = () => {
    // Items view unchanged — already solid
    // ... your existing renderItemsView code ...
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-black font-sans selection:bg-black selection:text-white flex flex-col overflow-hidden">
      <Navbar onNavClick={handleNav} activeView={view} />
      
      {/* Login Overlay */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-black mb-4">Login to Manage</h2>
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <button
              onClick={handleSignIn}
              className="w-full py-3 bg-black text-white font-black rounded-lg mb-2"
            >
              Sign In
            </button>
            <button
              onClick={handleHideLogin}
              className="w-full py-2 text-gray-500"
            >
              Cancel (View Only)
            </button>
          </div>
        </div>
      )}

      {!user && (view === 'inventory' || view === 'store') && (
        <button 
          onClick={handleShowLogin} 
          className="fixed top-4 right-4 z-40 bg-black text-white px-4 py-2 rounded font-bold"
        >
          Login to Manage
        </button>
      )}

      {user && (
        <button 
          onClick={signOut} 
          className="fixed top-4 right-4 z-40 bg-red-500 text-white px-4 py-2 rounded font-bold"
        >
          Logout
        </button>
      )}
      
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

        {view === 'store' && (renderShopView())}

        {view === 'inventory' && (renderItemsView())}

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

      {/* Cart Drawer & Checkout unchanged */}
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