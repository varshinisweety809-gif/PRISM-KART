/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ShoppingBag } from 'lucide-react';

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 600); // smooth exit
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 overflow-hidden select-none">
      {/* Decorative ambient glowing background circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="relative flex flex-col items-center">
        {/* Animated Prism Brand Icon Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative flex items-center justify-center w-24 h-24 mb-6 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-emerald-500 p-[2px] shadow-[0_0_50px_rgba(99,102,241,0.25)]"
        >
          <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-white" />
            <motion.div 
              className="absolute top-2 right-2 text-emerald-400"
              animate={{ rotate: [0, 360], scale: [0.8, 1.2, 0.8] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
          </div>
        </motion.div>

        {/* Brand Typographic Title */}
        <motion.h1
          initial={{ letterSpacing: "0.1em", opacity: 0 }}
          animate={{ letterSpacing: "0.3em", opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-white text-3xl font-sans font-semibold tracking-[0.3em] uppercase pl-[0.3em]"
        >
          PRISM
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-slate-400 text-xs tracking-widest mt-2 uppercase font-mono"
        >
          Premium E-Commerce Experience
        </motion.p>

        {/* Progress Bar Container */}
        <div className="w-64 h-[2px] bg-slate-800/80 rounded-full mt-12 relative overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Interactive Skip Button */}
        <motion.button
          onClick={onComplete}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          whileHover={{ opacity: 1, scale: 1.05 }}
          className="mt-8 text-slate-500 hover:text-slate-300 font-mono text-[10px] tracking-widest uppercase transition-all duration-200 cursor-pointer"
        >
          Skip Intro &rarr;
        </motion.button>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 flex flex-col items-center gap-1">
        <p className="text-slate-600 font-mono text-[9px] tracking-widest uppercase">
          Version 1.0.0 &bull; Secure Connection
        </p>
      </div>
    </div>
  );
}
