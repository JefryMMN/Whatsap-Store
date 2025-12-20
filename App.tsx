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
import { supabase } from './services/supabase';

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
  }, []);

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
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [pendingCreateStore, setPendingCreateStore] = useState(false);
  
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

  // Handle redirect to create store after login OR show login modal if not logged in
  useEffect(() => {
    if (pendingCreateStore) {
      if (user) {
        // User is logged in - redirect to create store
        setPendingCreateStore(false);
        setShowLogin(false);
        setView('create-store');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.pushState({}, '', '/create-store');
      } else if (user === null) {
        // User is definitely not logged in (not just loading) - show login modal
        setShowLogin(true);
      }
    }
  }, [user, pendingCreateStore]);

  // Login handlers
  const handleSignIn = async () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please enter email and password');
      return;
    }

    setLoginLoading(true);
    setLoginError(null);

    try {
      await signIn(loginEmail, loginPassword);
      // Note: Redirect is handled by useEffect watching user + pendingCreateStore
      setShowLogin(false);
      setLoginEmail('');
      setLoginPassword('');
      setIsSignUp(false);
    } catch (error: any) {
      setLoginError(error.message || 'Failed to sign in');
    } finally {
      setLoginLoading(false);
    }
  };

  // Sign Up handler
  const handleSignUp = async () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please enter email and password');
      return;
    }

    if (loginPassword.length < 6) {
      setLoginError('Password must be at least 6 characters');
      return;
    }

    setLoginLoading(true);
    setLoginError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: loginEmail,
        password: loginPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/create-store`
        }
      });

      if (error) throw error;

      if (data.user && !data.session) {
        // Email confirmation required - show success message
        setSignUpSuccess(true);
        setLoginEmail('');
        setLoginPassword('');
      } else {
        // Auto-confirmed (if email confirmation is disabled in Supabase)
        // Note: Redirect is handled by useEffect watching user + pendingCreateStore
        setShowLogin(false);
        setLoginEmail('');
        setLoginPassword('');
        setIsSignUp(false);
      }
    } catch (error: any) {
      setLoginError(error.message || 'Failed to sign up');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleShowLogin = () => {
    setLoginError(null);
    setIsSignUp(false);
    setShowLogin(true);
  };

  const handleHideLogin = () => {
    setShowLogin(false);
    setLoginError(null);
    setIsSignUp(false);
    setSignUpSuccess(false);
    setPendingCreateStore(false);
  };

  // Initialization
  useEffect(() => {
    const path = window.location.pathname + window.location.hash;
    const storeMatch = path.match(/\/store\/([a-z0-9-]+)/);

    if (storeMatch) {
      setPublicStoreSlug(storeMatch[1]);
      setView('public-store');
      return;
    }

    // Handle /create-store path - set pending flag, useEffect will handle redirect when user loads
    if (path === '/create-store') {
      setPendingCreateStore(true);
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

      // Compute ownership directly from stores data
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

  // Require login before opening create store flow - NO ALERT
  const handleOpenCreateStore = () => {
    if (!user) {
      setPendingCreateStore(true);
      setShowLogin(true);
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
      loadAllProducts();
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
      {/* Dashboard content */}
    </div>
  );

  const renderShopView = () => (
    <div className="pt-24 md:pt-36 pb-24 px-4 md:px-6 max-w-[1200px] mx-auto animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => handleNav('landing')}
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-black font-bold transition-colors group text-sm"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back to Home
      </button>

      <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-5 md:mb-8">All Shops</h1>
      
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : allStores.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl mb-4 block">🏪</span>
          <p className="text-gray-500 font-bold">No stores yet. Be the first to create one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allStores.map((store) => (
            <div 
              key={store.id} 
              className="clay-card p-6 cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => {
                setPublicStoreSlug(store.slug);
                setView('public-store');
                window.history.pushState({}, '', `/store/${store.slug}`);
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                {store.logo_url ? (
                  <img src={store.logo_url} alt={store.name} className="w-16 h-16 rounded-xl object-cover" />
                ) : (
                  <div className="w-16 h-16 bg-black text-white rounded-xl flex items-center justify-center text-2xl font-black">
                    {store.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-black text-lg">{store.name}</h3>
                  <p className="text-gray-500 text-sm font-bold">{store.currency}</p>
                </div>
              </div>
              {store.description && (
                <p className="text-gray-600 text-sm font-bold line-clamp-2">{store.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderItemsView = () => (
    <div className="pt-24 md:pt-36 pb-24 px-4 md:px-6 max-w-[1200px] mx-auto animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => handleNav('landing')}
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-black font-bold transition-colors group text-sm"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Back to Home
      </button>

      <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-5 md:mb-8">All Items</h1>
      
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : allProducts.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl mb-4 block">📦</span>
          <p className="text-gray-500 font-bold">No products yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allProducts.map((product) => (
            <div key={product.id} className="clay-card overflow-hidden group">
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={product.image_url || '/placeholder-image.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => { e.currentTarget.src = '/placeholder-image.jpg'; }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-black text-lg mb-1 line-clamp-1">{product.name}</h3>
                {product.stores && (
                  <p className="text-gray-500 text-xs font-bold mb-2">from {product.stores.name}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black">
                    {product.stores?.currency || '$'}{product.price}
                  </span>
                  <button
                    onClick={() => {
                      if (product.stores) {
                        const message = encodeURIComponent(
                          `Hi! I'm interested in "${product.name}" (${product.stores.currency}${product.price})`
                        );
                        window.open(`https://wa.me/${product.stores.whatsapp_number}?text=${message}`, '_blank');
                      }
                    }}
                    className="px-4 py-2 bg-[#25D366] text-white text-xs font-black rounded-lg hover:bg-[#128C7E] transition-colors"
                  >
                    💬 Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-black font-sans selection:bg-black selection:text-white flex flex-col overflow-hidden">
      <Navbar 
        onNavClick={handleNav} 
        activeView={view} 
        user={user}
        onSignIn={handleShowLogin}
        onSignOut={async () => {
          try {
            await signOut();
            window.location.href = '/';
          } catch (err) {
            console.error('Logout error:', err);
          }
        }}
      />
      
      {/* Professional Login/SignUp Modal */}
      {showLogin && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]"
          onClick={handleHideLogin}
        >
          <div 
            className="bg-white p-8 rounded-3xl max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success State - Email Confirmation */}
            {signUpSuccess ? (
              <div className="text-center py-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">✉️</span>
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-3">Check Your Email</h2>
                <p className="text-gray-500 font-bold mb-6">
                  We've sent a confirmation link to your email address. Please click the link to activate your account.
                </p>
                <button
                  onClick={() => {
                    setSignUpSuccess(false);
                    setIsSignUp(false);
                  }}
                  className="w-full py-4 bg-black text-white font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Back to Sign In
                </button>
                <button
                  onClick={handleHideLogin}
                  className="w-full py-3 text-gray-500 font-bold hover:text-black transition-colors mt-3"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4">
                    S
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </h2>
                  <p className="text-gray-500 font-bold text-sm mt-2">
                    {pendingCreateStore 
                      ? (isSignUp ? 'Create an account to start building your store' : 'Sign in to start building your store')
                      : (isSignUp ? 'Sign up to create and manage your store' : 'Sign in to create and manage your store')}
                  </p>
                </div>

                {/* Error Message */}
                {loginError && (
                  <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                    <p className="text-red-600 font-bold text-sm text-center">⚠️ {loginError}</p>
                  </div>
                )}

                {/* Form */}
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (isSignUp ? handleSignUp() : handleSignIn())}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl font-bold focus:border-black focus:outline-none transition-colors"
                  />
                  <input
                    type="password"
                    placeholder={isSignUp ? "Password (min 6 characters)" : "Password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (isSignUp ? handleSignUp() : handleSignIn())}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl font-bold focus:border-black focus:outline-none transition-colors"
                  />
                </div>

                {/* Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={isSignUp ? handleSignUp : handleSignIn}
                    disabled={loginLoading}
                    className="w-full py-4 bg-black text-white font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loginLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {isSignUp ? 'Creating Account...' : 'Signing In...'}
                      </>
                    ) : (
                      isSignUp ? 'Create Account' : 'Sign In'
                    )}
                  </button>
                  <button
                    onClick={handleHideLogin}
                    disabled={loginLoading}
                    className="w-full py-3 text-gray-500 font-bold hover:text-black transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>

                {/* Toggle Sign In / Sign Up */}
                <p className="text-center text-sm text-gray-500 font-bold mt-6">
                  {isSignUp ? (
                    <>
                      Already have an account?{' '}
                      <button 
                        onClick={() => { setIsSignUp(false); setLoginError(null); }}
                        className="text-black font-black hover:underline"
                      >
                        Sign In
                      </button>
                    </>
                  ) : (
                    <>
                      Don't have an account?{' '}
                      <button 
                        onClick={() => { setIsSignUp(true); setLoginError(null); }}
                        className="text-black font-black hover:underline"
                      >
                        Sign Up
                      </button>
                    </>
                  )}
                </p>
              </>
            )}
          </div>
        </div>
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
          <CreateStoreFlow
            onClose={handleCloseCreateStore}
            onStoreCreated={handleStoreCreated}
          />
        )}

        {view === 'public-store' && publicStoreSlug && (
          <PublicStorePage slug={publicStoreSlug} />
        )}

        {view === 'store' && renderShopView()}

        {view === 'inventory' && renderItemsView()}

        {view === 'settings' && (
           <div className="pt-24 md:pt-36 px-4 md:px-6 max-w-[1200px] mx-auto">
             <button
               onClick={() => handleNav('landing')}
               className="mb-4 flex items-center gap-2 text-gray-600 hover:text-black font-bold transition-colors group text-sm"
             >
               <span className="group-hover:-translate-x-1 transition-transform">←</span>
               Back to Home
             </button>
           </div>
        )}
        {view === 'settings' && (
           <SettingsView 
             settings={settings}
             onUpdate={(updates) => setSettings(prev => ({ ...prev, ...updates }))}
             shopName={settings.storeProfile.shopName}
             onShopNameChange={(n) => setSettings(prev => ({ ...prev, storeProfile: { ...prev.storeProfile, shopName: n } }))}
           />
        )}

        {['privacy', 'terms', 'help'].includes(view) && (
           <div className="pt-24 md:pt-36 px-4 md:px-6 max-w-[1200px] mx-auto">
             <button
               onClick={() => handleNav('landing')}
               className="mb-4 flex items-center gap-2 text-gray-600 hover:text-black font-bold transition-colors group text-sm"
             >
               <span className="group-hover:-translate-x-1 transition-transform">←</span>
               Back to Home
             </button>
           </div>
        )}
        {['privacy', 'terms', 'help'].includes(view) && (
           <InfoPage pageId={view} />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onRemoveItem={removeFromCart}
        onItemClick={() => {}}
      />
      
      {/* Checkout Bar */}
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