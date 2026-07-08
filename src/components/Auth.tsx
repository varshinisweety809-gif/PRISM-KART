/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ShoppingBag, Eye, EyeOff, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { INITIAL_PROFILE } from '../data/user';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
  onSkip: () => void;
}

export default function Auth({ onLogin, onSkip }: AuthProps) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('alex.rivera@prism.design');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    if (!isSignIn && !name) {
      setError('Please enter your full name');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      if (isSignIn) {
        // Log in as default Alex Rivera if the email matches, or create a mock user
        if (email.toLowerCase() === 'alex.rivera@prism.design') {
          onLogin(INITIAL_PROFILE);
        } else {
          // Custom profile
          onLogin({
            name: email.split('@')[0].split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            email: email,
            phone: '+1 (555) 000-0000',
            avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
            addresses: [],
            savedCards: [],
            wishlist: []
          });
        }
      } else {
        // Sign Up custom profile
        onLogin({
          name: name,
          email: email,
          phone: '+1 (555) 000-0000',
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
          addresses: [],
          savedCards: [],
          wishlist: []
        });
      }
    }, 1000);
  };

  const handleQuickFill = () => {
    setEmail('alex.rivera@prism.design');
    setPassword('••••••••');
    setIsSignIn(true);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative overflow-hidden">
      {/* Visual Left Banner (Desktop) */}
      <div className="hidden md:flex md:w-1/2 bg-slate-950 p-16 flex-col justify-between relative text-white">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/40 via-slate-950 to-emerald-950/20" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-indigo-500 to-emerald-500 rounded-xl">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-wider font-sans uppercase">PRISM</span>
        </div>

        <div className="relative z-10 my-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-1 bg-slate-800/60 border border-slate-700/50 rounded-full px-3 py-1 text-xs text-emerald-400 mb-6 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SOPHISTICATED RETAIL</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-sans font-medium tracking-tight leading-tight">
              A curated catalog <br />for modern spaces.
            </h2>
            <p className="text-slate-400 mt-4 text-base leading-relaxed">
              Explore meticulously detailed electronics, sustainable home essentials, ethically sourced apparel, and custom collectibles.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 text-xs text-slate-500 font-mono tracking-wider uppercase">
          &copy; 2026 PRISM DESIGN LABS &bull; SECURE TRANSACTION
        </div>
      </div>

      {/* Form Right Column */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 relative">
        <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          
          <div className="flex md:hidden items-center gap-2 mb-8 justify-center">
            <div className="p-1.5 bg-gradient-to-tr from-indigo-500 to-emerald-500 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-wider uppercase font-sans">PRISM</span>
          </div>

          <div className="mb-6 text-center md:text-left">
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">
              {isSignIn ? 'Welcome Back' : 'Create Account'}
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              {isSignIn ? 'Sign in to access your curated dashboard and saved details.' : 'Start shopping premium products with seamless checkouts.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-lg font-sans">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isSignIn && (
              <div>
                <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-1.5 font-mono">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Alex Rivera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider mb-1.5 font-mono">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="alex.rivera@prism.design"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-medium text-slate-600 uppercase tracking-wider font-mono">Password</label>
                {isSignIn && (
                  <button type="button" className="text-[11px] text-slate-400 hover:text-indigo-600 font-sans">
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-900 placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-indigo-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>{isSignIn ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          {/* Quick Demo Assist */}
          {isSignIn && (
            <div className="mt-4 p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between text-xs text-slate-600">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] text-slate-400 uppercase font-semibold">DEMO ACC</span>
                <span>alex.rivera@prism.design</span>
              </div>
              <button
                type="button"
                onClick={handleQuickFill}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 font-medium rounded-lg text-[11px] text-slate-800 transition-all cursor-pointer shadow-xs"
              >
                Autofill
              </button>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 items-center justify-center text-xs">
            <p className="text-slate-500">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={() => {
                  setIsSignIn(!isSignIn);
                  setError('');
                }}
                className="font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                {isSignIn ? 'Sign Up' : 'Sign In'}
              </button>
            </p>

            <button
              onClick={onSkip}
              className="text-slate-400 hover:text-indigo-600 font-mono text-[10px] tracking-widest uppercase py-1 mt-1 transition-all cursor-pointer"
            >
              Browse as Guest &rarr;
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
