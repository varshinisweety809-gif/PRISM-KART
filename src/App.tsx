/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, SlidersHorizontal, ArrowRight, ArrowLeft, Star, Heart, CheckCircle2, ShieldAlert, Award, StarHalf, ShoppingBag, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Data & Types
import { Product, CartItem, Order, Review, UserProfile, OrderStatus, TrackingStep } from './types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from './data/products';
import { INITIAL_PROFILE } from './data/user';
import { formatINR } from './utils/currency';

// Subcomponents
import Splash from './components/Splash';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Orders from './components/Orders';
import Profile from './components/Profile';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  // Core Persistent States
  const [user, setUser] = useState<UserProfile | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Navigation / Filter States
  const [activeTab, setActiveTab] = useState<string>('home'); // home, detail, cart, checkout, orders, profile, auth
  const [profileSubTab, setProfileSubTab] = useState<'default' | 'wishlist'>('default');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Interactive Filter options (Sidebar/Drop-down)
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<number>(500);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('featured'); // price-low, price-high, rating, featured

  // Checkout intermediate checkout values
  const [appliedPromo, setAppliedPromo] = useState<string | undefined>(undefined);
  const [discountPct, setDiscountPct] = useState(0);

  // Active Promo Banner Carousel
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  // Back to Top Button states and handlers
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (activeTab === 'home' && window.scrollY > 350) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 1. Initial State Loading & Synchronization with LocalStorage
  useEffect(() => {
    // User Session
    const savedUser = localStorage.getItem('prism_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(INITIAL_PROFILE); // Preload Alex Rivera by default for premium preview
    }

    // Cart Items
    const savedCart = localStorage.getItem('prism_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Reviews List
    const savedReviews = localStorage.getItem('prism_reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      setReviews(INITIAL_REVIEWS);
    }

    // Order Tracking list (Preload a shipped order for Alex Rivera so tracking is instantly available!)
    const savedOrders = localStorage.getItem('prism_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      const initialPreloadedOrder: Order = {
        id: "PRISM-8274-X",
        date: "2026-07-06",
        items: [
          {
            id: "4-null-null",
            product: INITIAL_PRODUCTS[3], // Solis Amber Glass Candle Set
            quantity: 1
          }
        ],
        subtotal: 42,
        shipping: 12,
        discount: 0,
        tax: 3.36,
        total: 57.36,
        status: 'shipped',
        address: INITIAL_PROFILE.addresses[0],
        paymentMethod: "VISA ending in 4242",
        estimatedDelivery: "2026-07-09",
        trackingSteps: [
          { status: 'ordered', title: 'Ordered placed', description: 'Transaction secure, packaging initiated', date: '2026-07-06 14:32', isCompleted: true, isCurrent: false },
          { status: 'processed', title: 'Quality Audited', description: 'Certified at regional logistics facility', date: '2026-07-07 09:12', isCompleted: true, isCurrent: false },
          { status: 'shipped', title: 'Shipped & In Transit', description: 'Parcel departs gateway terminal', date: '2026-07-07 16:45', isCompleted: true, isCurrent: true },
          { status: 'delivered', title: 'Out for Delivery', description: 'Estimated arrival by tomorrow 18:00', date: 'Pending', isCompleted: false, isCurrent: false }
        ]
      };
      setOrders([initialPreloadedOrder]);
    }
  }, []);

  // Sync state changes back to LocalStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('prism_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('prism_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('prism_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('prism_orders', JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem('prism_reviews', JSON.stringify(reviews));
    }
  }, [reviews]);

  // Automatic Banner Switch Timer
  useEffect(() => {
    const bannerTimer = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % promoBanners.length);
    }, 6000);
    return () => clearInterval(bannerTimer);
  }, []);

  // Interactive Promotional Banners
  const promoBanners = [
    {
      title: "Pristine Acoustic Luxury",
      highlight: "Aether Pro ANC Wireless",
      desc: "Immerse yourself in adaptive high-definition noise cancellation designed for audiophiles.",
      gradient: "from-slate-900 via-indigo-950 to-indigo-900",
      tag: "BEST SELLER",
      productId: 1
    },
    {
      title: "Warm Zen Aromatherapy",
      highlight: "Solis Amber Candle Set",
      desc: "Soy candles hand-poured in custom amber apothecary jars with deep sandalwood notes.",
      gradient: "from-zinc-900 via-stone-900 to-amber-950/70",
      tag: "ESTHETIC LIVING",
      productId: 4
    },
    {
      title: "Refined Wrist Horology",
      highlight: "Chronos Minimal Watch",
      desc: "Polished stainless smart timepiece tracking vitals on an always-on AMOLED showcase.",
      gradient: "from-zinc-950 via-zinc-900 to-emerald-950/40",
      tag: "NEW RELEASE",
      productId: 2
    }
  ];

  // Helper: Toggle wishlist product ID
  const handleToggleWishlist = (productId: number) => {
    if (!user) {
      setActiveTab('auth');
      return;
    }
    const isWishlisted = user.wishlist.includes(productId);
    const updatedWishlist = isWishlisted
      ? user.wishlist.filter((id) => id !== productId)
      : [...user.wishlist, productId];

    setUser({
      ...user,
      wishlist: updatedWishlist
    });
  };

  // Helper: Add items to Shopping Cart
  const handleAddToCart = (product: Product, quantity: number, color?: string, size?: string) => {
    const cartItemId = `${product.id}-${color || 'none'}-${size || 'none'}`;
    setCart((prevCart) => {
      const existsIdx = prevCart.findIndex((item) => item.id === cartItemId);
      if (existsIdx > -1) {
        const updated = [...prevCart];
        updated[existsIdx].quantity = Math.min(product.stock, updated[existsIdx].quantity + quantity);
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: cartItemId,
            product,
            quantity,
            selectedColor: color,
            selectedSize: size
          }
        ];
      }
    });
  };

  // Buy Now: adds to cart and triggers checkout redirection instantly
  const handleBuyNow = (product: Product, quantity: number, color?: string, size?: string) => {
    handleAddToCart(product, quantity, color, size);
    setActiveTab('cart');
  };

  // Update cart item quantity
  const handleUpdateCartQuantity = (cartItemId: string, q: number) => {
    if (q <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === cartItemId ? { ...item, quantity: q } : item))
    );
  };

  // Remove item from cart
  const handleRemoveCartItem = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
  };

  // Proceed to checkout step
  const handleProceedToCheckout = (promoCode?: string, promoPct?: number) => {
    if (!user) {
      setActiveTab('auth');
      return;
    }
    setAppliedPromo(promoCode);
    setDiscountPct(promoPct || 0);
    setActiveTab('checkout');
  };

  // Place Order Action
  const handlePlaceOrder = (address: any, paymentMethod: string) => {
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const isFreeShipping = subtotal >= 150;
    const shipping = isFreeShipping ? 0 : 12;
    const discountAmount = Number(((subtotal * discountPct) / 100).toFixed(2));
    const tax = Number(((subtotal - discountAmount) * 0.08).toFixed(2));
    const total = Number((subtotal - discountAmount + shipping + tax).toFixed(2));

    const newOrder: Order = {
      id: `PRISM-${Math.floor(1000 + Math.random() * 9000)}-Z`,
      date: new Date().toISOString().split('T')[0],
      items: [...cart],
      subtotal,
      shipping,
      discount: discountAmount,
      tax,
      total,
      status: 'ordered',
      address,
      paymentMethod,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      trackingSteps: [
        { status: 'ordered', title: 'Ordered placed', description: 'Transaction secure, packaging initiated', date: new Date().toISOString().split('T')[0], isCompleted: true, isCurrent: true },
        { status: 'processed', title: 'Quality Audited', description: 'Awaiting shipping manifest release', date: 'Pending', isCompleted: false, isCurrent: false },
        { status: 'shipped', title: 'Shipped & In Transit', description: 'Estimated logistics gateway transfer', date: 'Pending', isCompleted: false, isCurrent: false },
        { status: 'delivered', title: 'Delivered', description: 'Expected delivery in 2-3 business days', date: 'Pending', isCompleted: false, isCurrent: false }
      ]
    };

    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    setCart([]); // Clear Cart
    setDiscountPct(0); // Reset coupon
    setAppliedPromo(undefined);
    setActiveTab('orders');
  };

  // Reorder Past Order items
  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      handleAddToCart(item.product, item.quantity, item.selectedColor, item.selectedSize);
    });
    setActiveTab('cart');
  };

  // LIVE STATUS ADVANCING SIMULATION
  const handleAdvanceStatus = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id !== orderId) return order;

        let nextStatus: OrderStatus = 'ordered';
        if (order.status === 'ordered') nextStatus = 'processed';
        else if (order.status === 'processed') nextStatus = 'shipped';
        else if (order.status === 'shipped') nextStatus = 'delivered';
        else return order; // already delivered

        const currentDateStr = new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 5);

        const updatedSteps = order.trackingSteps.map((step) => {
          if (step.status === nextStatus) {
            return { ...step, isCompleted: true, isCurrent: true, date: currentDateStr };
          }
          if (step.status === order.status) {
            return { ...step, isCurrent: false };
          }
          return step;
        });

        return {
          ...order,
          status: nextStatus,
          trackingSteps: updatedSteps
        };
      })
    );
  };

  // Review Addition Callback
  const handleAddReview = (newReviewData: Omit<Review, 'id' | 'date'>) => {
    const freshReview: Review = {
      ...newReviewData,
      id: `rev_${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews((prevReviews) => [...prevReviews, freshReview]);

    // Recalculate and average overall product scores
    const targetProduct = INITIAL_PRODUCTS.find((p) => p.id === newReviewData.productId);
    if (targetProduct) {
      const productReviews = [...reviews.filter((r) => r.productId === targetProduct.id), freshReview];
      const avgScore = Number((productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1));
      targetProduct.rating = avgScore;
      targetProduct.reviewCount = productReviews.length;
    }
  };

  // FILTER & SORTING EXECUTION
  const sortedAndFilteredProducts = INITIAL_PRODUCTS.filter((product) => {
    // Keyword query filtering
    const matchesSearch = searchQuery.trim() === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Category Selector
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

    // Price Filter
    const matchesPrice = product.price <= priceRange;

    // Minimum Star Ratings
    const matchesRating = product.rating >= minRating;

    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.isFeatured ? 1 : -1; // Default featured sort
  });

  const handleSelectProductFromSearch = (product: Product) => {
    setSelectedProduct(product);
    setActiveTab('detail');
  };

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none antialiased">
      {/* Dynamic Navigation Bar */}
      <Navbar
        user={user}
        cart={cart}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'profile_wishlist') {
            setProfileSubTab('wishlist');
            setActiveTab('profile');
          } else {
            setActiveTab(tab);
          }
        }}
        onSearch={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        allProducts={INITIAL_PRODUCTS}
        onSelectProduct={handleSelectProductFromSearch}
        onLogout={() => {
          setUser(null);
          setCart([]);
          setActiveTab('home');
        }}
      />

      <main className="flex-1 pb-16">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: AUTH SCREEN */}
          {activeTab === 'auth' && (
            <motion.div
              key="auth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Auth
                onLogin={(loggedInUser) => {
                  setUser(loggedInUser);
                  setActiveTab('home');
                }}
                onSkip={() => {
                  setUser(null);
                  setActiveTab('home');
                }}
              />
            </motion.div>
          )}

          {/* TAB 2: MAIN HOME BROWSE MARKET */}
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
              {/* Dynamic Promotional Banner Carousel */}
              <div className="relative rounded-3xl overflow-hidden mb-12 shadow-md">
                <div className={`p-8 md:p-12 text-left text-white bg-gradient-to-r ${promoBanners[activeBannerIdx].gradient} min-h-[250px] md:min-h-[300px] flex flex-col justify-between relative transition-all duration-700 ease-in-out`}>
                  {/* Grid overlay */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
                  
                  <div>
                    <span className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-xs border border-white/20 px-3 py-1 rounded-full text-[9px] font-mono tracking-wider font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{promoBanners[activeBannerIdx].tag}</span>
                    </span>

                    <h2 className="text-2xl md:text-4xl font-sans font-medium tracking-tight mt-6 leading-tight max-w-xl">
                      {promoBanners[activeBannerIdx].title} <br />
                      <strong className="text-emerald-400 font-extrabold">{promoBanners[activeBannerIdx].highlight}</strong>
                    </h2>
                    
                    <p className="text-zinc-300 text-xs md:text-sm mt-3 max-w-lg leading-relaxed font-sans">
                      {promoBanners[activeBannerIdx].desc}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10 z-10">
                    <button
                      onClick={() => {
                        const target = INITIAL_PRODUCTS.find(p => p.id === promoBanners[activeBannerIdx].productId);
                        if (target) {
                          setSelectedProduct(target);
                          setActiveTab('detail');
                        }
                      }}
                      className="px-5 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <span>Explore Showcase</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* Carousel Selector dots */}
                    <div className="flex gap-1.5">
                      {promoBanners.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveBannerIdx(idx)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${activeBannerIdx === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Layout (Search & Grid) */}
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Advanced Filters (Sticky Desktop sidebar / collapsible) */}
                <div className="w-full lg:w-64 shrink-0 bg-white border border-slate-200/80 rounded-2xl p-5 text-left shadow-2xs">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-full flex items-center justify-between font-sans text-sm font-semibold text-slate-800 tracking-tight lg:pointer-events-none lg:cursor-default"
                  >
                    <span className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                      <span>Adjust Parameters</span>
                    </span>
                    <span className="lg:hidden">Toggle</span>
                  </button>

                  <div className={`mt-5 space-y-6 lg:block ${showFilters ? 'block' : 'hidden lg:block'}`}>
                    {/* Price Slider */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-2">Max Price: {formatINR(priceRange)}</label>
                      <input
                        type="range"
                        min={30}
                        max={500}
                        step={10}
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                        <span>{formatINR(30)}</span>
                        <span>{formatINR(500)}</span>
                      </div>
                    </div>

                    {/* Rating Filters */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-2">Minimum Rating</label>
                      <div className="flex items-center gap-1">
                        {[0, 4, 4.5, 4.8].map((rating) => {
                          const isSelected = minRating === rating;
                          return (
                            <button
                              key={rating}
                              onClick={() => setMinRating(rating)}
                              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border cursor-pointer transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'border-slate-200 text-slate-600 hover:border-indigo-500 hover:text-indigo-600'}`}
                            >
                              {rating === 0 ? 'All' : `${rating} ★`}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sort Selector */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-2">Sort Results By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                      >
                        <option value="featured">Featured Showcase</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Top Customer Rated</option>
                      </select>
                    </div>

                    {/* Quality Badging details */}
                    <div className="border-t border-slate-100 pt-5 text-[10px] text-slate-400 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 animate-pulse" />
                        <span>All products backed by premium 1-year warranties.</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Award className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span>Curated materials and design-centric aesthetics.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommended Products Grid */}
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-baseline mb-6">
                    <h3 className="text-lg font-bold text-slate-950 tracking-tight">
                      {selectedCategory === 'All' ? 'Curated Recommendations' : `Premium ${selectedCategory}`}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">{sortedAndFilteredProducts.length} items found</p>
                  </div>

                  {sortedAndFilteredProducts.length === 0 ? (
                    <div className="p-16 border border-zinc-200 rounded-3xl bg-white text-center">
                      <ShieldAlert className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                      <h4 className="text-base font-bold text-zinc-900 tracking-tight">No products match your parameters</h4>
                      <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">Try resetting active sliders, selecting other categories, or clearing search input parameters.</p>
                      <button
                        onClick={() => {
                          setPriceRange(500);
                          setMinRating(0);
                          setSearchQuery('');
                          setSelectedCategory('All');
                        }}
                        className="mt-6 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                      >
                        Reset Filter Values
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {sortedAndFilteredProducts.map((product) => {
                        const isWishlisted = user ? user.wishlist.includes(product.id) : false;
                        return (
                          <ProductCard
                            key={product.id}
                            product={product}
                            isWishlisted={isWishlisted}
                            onToggleWishlist={handleToggleWishlist}
                            onSelect={(p) => {
                              setSelectedProduct(p);
                              setActiveTab('detail');
                            }}
                            onAddToCart={handleAddToCart}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 3: PRODUCT DETAIL SCREEN */}
          {activeTab === 'detail' && selectedProduct && (
            <motion.div
              key="detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProductDetail
                product={selectedProduct}
                reviews={reviews}
                isWishlisted={user ? user.wishlist.includes(selectedProduct.id) : false}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onAddReview={handleAddReview}
                onBack={() => {
                  setSelectedProduct(null);
                  setActiveTab('home');
                }}
              />
            </motion.div>
          )}

          {/* TAB 4: SHOPPING CART */}
          {activeTab === 'cart' && (
            <motion.div
              key="cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Cart
                cart={cart}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemoveItem={handleRemoveCartItem}
                onProceedToCheckout={handleProceedToCheckout}
                onBackToBrowse={() => setActiveTab('home')}
              />
            </motion.div>
          )}

          {/* TAB 5: EXPRESS CHECKOUT */}
          {activeTab === 'checkout' && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Checkout
                user={user}
                cart={cart}
                discountPct={discountPct}
                discountCode={appliedPromo}
                onPlaceOrder={handlePlaceOrder}
                onBackToCart={() => setActiveTab('cart')}
              />
            </motion.div>
          )}

          {/* TAB 6: ORDER TIMELINES */}
          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Orders
                orders={orders}
                onReorder={handleReorder}
                onAdvanceStatus={handleAdvanceStatus}
                onBackToShopping={() => setActiveTab('home')}
              />
            </motion.div>
          )}

          {/* TAB 7: USER PROFILE DASHBOARD */}
          {activeTab === 'profile' && user && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Profile
                user={user}
                allProducts={INITIAL_PRODUCTS}
                activeSubTab={profileSubTab}
                onUpdateUser={(updated) => {
                  setUser(updated);
                  setProfileSubTab('default');
                }}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  setActiveTab('detail');
                }}
                onAddToCart={handleAddToCart}
                onLogout={() => {
                  setUser(null);
                  setCart([]);
                  setActiveTab('home');
                }}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Curated Brand Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
          <div>
            <div className="flex items-center gap-2 mb-4 select-none">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45"></div>
              </div>
              <span className="font-bold tracking-tight text-sm text-slate-800 uppercase font-sans">PRISM MARKET</span>
            </div>
            <p className="text-slate-400 leading-relaxed font-sans max-w-xs">
              A high-fidelity design-driven retail showcase providing beautiful smart hardware, organic textiles, and artisan homeware.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Express Navigation</h4>
            <div className="flex flex-col gap-2.5 font-medium text-slate-600">
              <button onClick={() => { setActiveTab('home'); setSelectedCategory('All'); }} className="hover:text-indigo-600 text-left transition-all cursor-pointer">Browse Catalog</button>
              <button onClick={() => setActiveTab('cart')} className="hover:text-indigo-600 text-left transition-all cursor-pointer">Shopping Cart</button>
              <button onClick={() => setActiveTab('orders')} className="hover:text-indigo-600 text-left transition-all cursor-pointer">Shipment Timelines</button>
              <button onClick={() => { setProfileSubTab('wishlist'); setActiveTab('profile'); }} className="hover:text-indigo-600 text-left transition-all cursor-pointer">Personal Wishlist</button>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Simulated Security Credentials</h4>
            <p className="text-slate-400 leading-relaxed font-sans mb-3">
              Prism operates secure checkouts matching TLS 1.3 encryption keys. All payment cards remain offline in client-only storage.
            </p>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span>LOGGED IN WORKSPACE INGRESS</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[10px] text-slate-400 tracking-wider">
            &copy; 2026 PRISM DESIGN LABS &bull; PRESET PREVIEW ENVIRONMENT
          </p>
          <div className="flex gap-4 text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">
            <button className="hover:text-indigo-600">Terms</button>
            <span>&bull;</span>
            <button className="hover:text-indigo-600">Privacy Code</button>
            <span>&bull;</span>
            <button className="hover:text-indigo-600">API documentation</button>
          </div>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3.5 bg-slate-950 hover:bg-indigo-600 text-white rounded-full shadow-xl border border-slate-800 hover:border-indigo-500 hover:scale-105 active:scale-95 transition-all duration-300 z-50 cursor-pointer flex items-center justify-center group"
            title="Back to Top"
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
