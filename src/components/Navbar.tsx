/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, Heart, User, Package, Menu, X, ArrowRight, Star } from 'lucide-react';
import { UserProfile, CartItem, Product } from '../types';
import { CATEGORIES } from '../data/products';
import { formatINR } from '../utils/currency';

interface NavbarProps {
  user: UserProfile | null;
  cart: CartItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearch: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onLogout: () => void;
}

export default function Navbar({
  user,
  cart,
  activeTab,
  setActiveTab,
  onSearch,
  selectedCategory,
  setSelectedCategory,
  allProducts,
  onSelectProduct,
  onLogout
}: NavbarProps) {
  const [searchVal, setSearchVal] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter products for dropdown auto-suggestions
  const filteredSuggestions = searchVal.trim()
    ? allProducts.filter(p =>
        p.name.toLowerCase().includes(searchVal.toLowerCase()) ||
        p.category.toLowerCase().includes(searchVal.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    onSearch(searchVal);
  }, [searchVal, onSearch]);

  // Click outside to close search suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Track scrolling to add subtle shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSuggestionClick = (p: Product) => {
    onSelectProduct(p);
    setSearchVal('');
    setShowSuggestions(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    setActiveTab('home');
  };

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${scrolled ? 'bg-white shadow-md border-b border-slate-200' : 'bg-white border-b border-slate-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo Brand */}
          <div 
            onClick={() => { setActiveTab('home'); setSearchVal(''); setSelectedCategory('All'); }} 
            className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 font-sans">PRISM</span>
          </div>

          {/* Intelligent Search Input */}
          <div className="hidden md:block flex-1 max-w-2xl relative" ref={suggestionsRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchVal}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 placeholder-slate-400"
              />
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
            </form>

            {/* Auto Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="p-2 border-b border-slate-100 bg-slate-50 font-mono text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                  Search Suggestions
                </div>
                <div className="divide-y divide-slate-100">
                  {filteredSuggestions.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSuggestionClick(product)}
                      className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between gap-3 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="text-left">
                          <p className="text-sm font-medium text-slate-900 line-clamp-1">{product.name}</p>
                          <p className="text-xs text-slate-400">{product.category}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-slate-900">{formatINR(product.price)}</p>
                        <div className="flex items-center gap-0.5 text-amber-500 text-[10px]">
                          <Star className="w-3 h-3 fill-amber-500" />
                          <span>{product.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            {/* Orders Tab Link */}
            <button
              onClick={() => setActiveTab('orders')}
              className={`p-2 rounded-xl flex items-center gap-1.5 text-sm transition-all cursor-pointer ${activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'}`}
              title="Track Orders"
            >
              <Package className="w-4 h-4" />
              <span className="font-medium">Orders</span>
            </button>

            {/* Wishlist Link */}
            <button
              onClick={() => setActiveTab('profile_wishlist')}
              className={`p-2 rounded-xl flex items-center gap-1.5 text-sm transition-all cursor-pointer ${activeTab === 'profile_wishlist' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'}`}
              title="Wishlist"
            >
              <div className="relative">
                <Heart className={`w-4 h-4 ${activeTab === 'profile_wishlist' ? 'fill-white text-white' : 'text-slate-600'}`} />
                {user && user.wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-indigo-600 border border-white text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                    {user.wishlist.length}
                  </span>
                )}
              </div>
              <span className="font-medium">Wishlist</span>
            </button>

            {/* Shopping Cart Link */}
            <button
              onClick={() => setActiveTab('cart')}
              className={`p-2 rounded-xl flex items-center gap-1.5 text-sm transition-all cursor-pointer ${activeTab === 'cart' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'}`}
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-indigo-600 border border-white text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="font-medium">Cart</span>
            </button>

            {/* Separator */}
            <span className="h-5 w-[1px] bg-slate-200 mx-1" />

            {/* Profile Avatar / Login */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border transition-all cursor-pointer ${activeTab === 'profile' ? 'bg-indigo-600 border-indigo-700 text-white shadow-sm' : 'border-slate-200/80 hover:bg-slate-50'}`}
                >
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-6 h-6 rounded-full object-cover border border-slate-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-xs font-medium max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                </button>
                <button 
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('auth')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Hamburger Menu (Mobile) */}
          <div className="flex items-center gap-3 md:hidden shrink-0">
            <button
              onClick={() => setActiveTab('cart')}
              className="relative p-2 text-slate-600 hover:text-indigo-600 rounded-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                  {totalCartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Input bar */}
        <div className="block md:hidden pb-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 placeholder-slate-400"
            />
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
          </form>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="bg-slate-50 border-b border-t border-slate-200/50 overflow-x-auto scrollbar-none py-1.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-mono uppercase tracking-wider text-[10px] mr-3 shrink-0 font-semibold">Categories:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setActiveTab('home');
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer shrink-0 transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-200/55'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-xl z-50 flex flex-col p-4 space-y-3">
          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl">
            {user ? (
              <>
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-slate-950">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </>
            ) : (
              <button
                onClick={() => { setActiveTab('auth'); setMobileMenuOpen(false); }}
                className="w-full py-2 bg-indigo-600 text-white rounded-xl text-center text-xs font-semibold"
              >
                Sign In / Sign Up
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
            <button
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl border flex flex-col gap-1 items-start text-left ${activeTab === 'home' ? 'bg-slate-50 border-indigo-600 font-medium text-indigo-600' : 'border-slate-200/60'}`}
            >
              <span className="text-xs text-slate-400 font-mono font-semibold">BROWSE</span>
              <span>Home Market</span>
            </button>
            <button
              onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl border flex flex-col gap-1 items-start text-left ${activeTab === 'orders' ? 'bg-slate-50 border-indigo-600 font-medium text-indigo-600' : 'border-slate-200/60'}`}
            >
              <span className="text-xs text-slate-400 font-mono font-semibold">TRACKING</span>
              <span>Your Orders</span>
            </button>
            <button
              onClick={() => { setActiveTab('profile_wishlist'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl border flex flex-col gap-1 items-start text-left ${activeTab === 'profile_wishlist' ? 'bg-slate-50 border-indigo-600 font-medium text-indigo-600' : 'border-slate-200/60'}`}
            >
              <span className="text-xs text-slate-400 font-mono font-semibold">FAVORITES</span>
              <span>Saved Items</span>
            </button>
            <button
              onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl border flex flex-col gap-1 items-start text-left ${activeTab === 'profile' ? 'bg-slate-50 border-indigo-600 font-medium text-indigo-600' : 'border-slate-200/60'}`}
            >
              <span className="text-xs text-slate-400 font-mono font-semibold">SETTINGS</span>
              <span>Manage Profile</span>
            </button>
          </div>

          {user && (
            <button
              onClick={() => { onLogout(); setMobileMenuOpen(false); }}
              className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-center text-xs font-semibold border border-rose-100"
            >
              Sign Out of Account
            </button>
          )}
        </div>
      )}
    </header>
  );
}
