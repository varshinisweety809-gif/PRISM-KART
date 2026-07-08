/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Star, ShoppingCart, Check, Info } from 'lucide-react';
import { Product } from '../types';
import { formatINR } from '../utils/currency';

interface ProductCardProps {
  key?: any;
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: number) => void;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, color?: string, size?: string) => void;
}

export default function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onSelect,
  onAddToCart
}: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Default to first color/size if available
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : undefined;
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined;
    
    onAddToCart(product, 1, defaultColor, defaultSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelect(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex flex-col bg-white border border-slate-200/70 rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-lg transition-all duration-300 relative"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden shrink-0">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
        />

        {/* Wishlist Button (absolute overlay) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-xs hover:bg-white text-slate-600 hover:text-rose-600 rounded-full border border-slate-200 shadow-sm transition-all cursor-pointer z-10"
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Badges / Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 bg-slate-900/90 backdrop-blur-xs text-white text-[9px] font-mono tracking-wider uppercase font-semibold rounded-full shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Subtle quick-view or specs overlay on hover */}
        {hovered && (
          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px] transition-all flex items-center justify-center">
            <span className="px-4 py-2 bg-white/95 text-slate-900 font-medium text-xs rounded-xl shadow-md border border-slate-100 flex items-center gap-1.5 transform translate-y-1 animate-fade-in-up">
              <Info className="w-3.5 h-3.5" />
              <span>View Product Details</span>
            </span>
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">
            {product.category}
          </p>

          {/* Title */}
          <h4 className="text-sm font-semibold text-slate-900 leading-snug tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
            {product.name}
          </h4>

          {/* Short Description */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
            {product.description}
          </p>

          {/* Ratings & Star Breakdown */}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <div className="flex items-center gap-0.5 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span className="text-xs font-semibold text-slate-800 ml-0.5">{product.rating}</span>
            </div>
            <span className="text-slate-300 text-xs">&bull;</span>
            <span className="text-slate-400 text-[11px] font-medium">
              {product.reviewCount} reviews
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 shrink-0">
          {/* Price */}
          <div className="flex flex-col">
            <span className="text-base font-bold text-slate-950">{formatINR(product.price)}</span>
            {product.stock <= 5 && (
              <span className="text-[10px] text-rose-500 font-semibold mt-0.5 font-mono">
                Only {product.stock} left!
              </span>
            )}
          </div>

          {/* Cart Quick-Action */}
          <button
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className={`p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
              product.stock === 0
                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                : added
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : 'bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white shadow-xs'
            }`}
            title={product.stock === 0 ? "Out of Stock" : "Quick Add to Cart"}
          >
            {added ? (
              <Check className="w-4 h-4 stroke-[3px]" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
