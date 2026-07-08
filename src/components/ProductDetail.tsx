/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Star, Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Plus, Minus, ThumbsUp, Send, User } from 'lucide-react';
import { Product, Review, CartItem } from '../types';
import { formatINR } from '../utils/currency';

interface ProductDetailProps {
  product: Product;
  reviews: Review[];
  isWishlisted: boolean;
  onToggleWishlist: (productId: number) => void;
  onAddToCart: (product: Product, quantity: number, color?: string, size?: string) => void;
  onBuyNow: (product: Product, quantity: number, color?: string, size?: string) => void;
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
  onBack: () => void;
}

export default function ProductDetail({
  product,
  reviews,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onAddReview,
  onBack
}: ProductDetailProps) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description');
  const [addedMessage, setAddedMessage] = useState(false);

  // Review Form States
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Filter reviews for this product
  const productReviews = reviews.filter((r) => r.productId === product.id);

  // Calculate rating breakdown (simulate realistic count of stars)
  const ratingDistribution = [0, 0, 0, 0, 0]; // index 0 for 1 star, 4 for 5 star
  productReviews.forEach((r) => {
    const starIdx = Math.max(1, Math.min(5, Math.round(r.rating))) - 1;
    ratingDistribution[starIdx]++;
  });
  const totalReviewsCount = productReviews.length || 1;

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedColor || undefined, selectedSize || undefined);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2500);
  };

  const handleBuyNow = () => {
    onBuyNow(product, quantity, selectedColor || undefined, selectedSize || undefined);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    onAddReview({
      productId: product.id,
      author: newReviewAuthor,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${newReviewAuthor}`,
      rating: newReviewRating,
      comment: newReviewComment,
      isVerifiedPurchase: true,
      helpfulCount: 0
    });

    setNewReviewAuthor('');
    setNewReviewComment('');
    setNewReviewRating(5);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Breadcrumb */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium text-sm mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to products</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: sticky visual gallery */}
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
          {/* Thumbnails list (Desktop Left) */}
          <div className="flex md:flex-col order-2 md:order-1 gap-2.5 shrink-0 overflow-x-auto md:overflow-y-auto scrollbar-none md:max-h-[500px]">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIdx(idx)}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${selectedImageIdx === idx ? 'border-indigo-600 shadow-md' : 'border-slate-200 hover:border-indigo-500'}`}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>

          {/* Main Showcase Image */}
          <div className="flex-1 order-1 md:order-2 aspect-square rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden relative">
            <img
              src={product.images[selectedImageIdx]}
              alt={product.name}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 ease-out"
              referrerPolicy="no-referrer"
            />
            {product.tags && product.tags.length > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-slate-900 text-white font-mono text-[9px] tracking-widest uppercase font-semibold rounded-full shadow-md">
                {product.tags[0]}
              </span>
            )}
          </div>
        </div>

        {/* Right Column: product parameters */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              {product.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-950 mt-1 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Quick Ratings header */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <div className="flex items-center gap-0.5 text-amber-500">
                <Star className="w-4.5 h-4.5 fill-amber-500" />
                <span className="text-sm font-semibold text-slate-800 ml-1">{product.rating}</span>
              </div>
              <span className="text-slate-300 text-sm">&bull;</span>
              <span className="text-slate-500 text-xs font-medium">
                {totalReviewsCount} customer ratings
              </span>
              <span className="text-slate-300 text-sm">&bull;</span>
              <span className="text-emerald-600 text-xs font-semibold">Verified Product</span>
            </div>

            {/* Price Frame */}
            <div className="mt-5 p-4 bg-slate-50 border border-slate-200/50 rounded-2xl flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-950">{formatINR(product.price)}</span>
              <span className="text-slate-400 text-xs">GST & local delivery taxes included.</span>
            </div>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-6">
                <label className="block text-xs font-bold text-slate-500 font-mono tracking-wider uppercase mb-2">
                  Select Color: <span className="text-slate-900 normal-case font-sans ml-1 font-medium">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color;
                    // Mock solid colors depending on names
                    const colorBg = color.toLowerCase().includes('black') || color.toLowerCase().includes('obsidian') ? 'bg-slate-900' :
                                    color.toLowerCase().includes('white') || color.toLowerCase().includes('alabaster') ? 'bg-slate-100 border-slate-300' :
                                    color.toLowerCase().includes('green') || color.toLowerCase().includes('sage') ? 'bg-emerald-700' :
                                    color.toLowerCase().includes('silver') ? 'bg-slate-300' :
                                    color.toLowerCase().includes('rose') ? 'bg-rose-300' :
                                    color.toLowerCase().includes('teal') ? 'bg-teal-700' : 'bg-amber-600';
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full ${colorBg} border-2 flex items-center justify-center transition-all cursor-pointer ${isSelected ? 'ring-2 ring-indigo-600 scale-110' : 'border-transparent hover:scale-105'}`}
                        title={color}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selectors */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-5">
                <label className="block text-xs font-bold text-slate-500 font-mono tracking-wider uppercase mb-2">
                  Select Size: <span className="text-slate-900 normal-case font-sans ml-1 font-medium">{selectedSize}</span>
                </label>
                <div className="flex items-center gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg border-2 transition-all cursor-pointer ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600'}`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mt-5">
              <label className="block text-xs font-bold text-slate-500 font-mono tracking-wider uppercase mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-1.5 w-max border border-slate-200 rounded-xl bg-white p-1">
                <button
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(q => q - 1)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-all cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-sm font-semibold text-slate-900 min-w-8 text-center">{quantity}</span>
                <button
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-all cursor-pointer disabled:opacity-30"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              {product.stock <= 5 && (
                <p className="text-[10px] text-rose-500 font-mono mt-1.5 font-semibold">
                  Hurry, only {product.stock} items left in inventory!
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-indigo-200"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
              
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Buy It Now</span>
              </button>

              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`p-3 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${isWishlisted ? 'bg-rose-50 border-rose-200 text-rose-600' : 'border-slate-200 text-slate-400 hover:border-indigo-500 hover:text-indigo-600'}`}
                title="Wishlist Toggle"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {addedMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-sans text-center flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Success: {quantity}x item(s) added to your cart!</span>
              </motion.div>
            )}

            {/* Delivery Guarantees */}
            <div className="mt-6 border-t border-slate-200 pt-5 space-y-3 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Free Express Delivery for orders over $150. Delivery in 2-3 days.</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Secure checkouts with standard 256-bit encryption.</span>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="w-4 h-4 text-slate-400 shrink-0" />
                <span>30-Day Hassle-Free Returns with pre-paid return labels.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description / Technical Specs */}
      <div className="mt-16 border-b border-slate-200">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-4 text-sm font-semibold border-b-2 tracking-tight transition-all cursor-pointer ${activeTab === 'description' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-indigo-600'}`}
          >
            Product Description
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-4 text-sm font-semibold border-b-2 tracking-tight transition-all cursor-pointer ${activeTab === 'specs' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-indigo-600'}`}
          >
            Specifications
          </button>
        </div>
      </div>

      <div className="py-6 text-sm text-slate-600 leading-relaxed max-w-4xl">
        {activeTab === 'description' ? (
          <p className="whitespace-pre-line text-slate-600 leading-relaxed">{product.fullDescription}</p>
        ) : (
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <tbody className="divide-y divide-slate-200">
                {Object.entries(product.specs).map(([label, val]) => (
                  <tr key={label} className="hover:bg-slate-50">
                    <td className="px-4 py-3 bg-slate-50/50 font-bold font-mono text-slate-500 uppercase tracking-wider w-1/3">{label}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ratings & Reviews Section */}
      <div className="mt-16 border-t border-slate-200 pt-12">
        <h3 className="text-xl font-bold text-slate-950 tracking-tight mb-8">Customer Ratings & Reviews</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Rating Summary Breakdown (Left) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="p-6 bg-slate-50 border border-slate-200/50 rounded-2xl text-center">
              <h4 className="text-sm font-bold text-slate-500 font-mono tracking-wider uppercase">Overall Rating</h4>
              <p className="text-5xl font-extrabold text-slate-950 mt-2">{product.rating}</p>
              <div className="flex items-center justify-center gap-0.5 text-amber-500 mt-2">
                {[...Array(5)].map((_, idx) => {
                  const val = idx + 1;
                  return (
                    <Star
                       key={idx}
                       className={`w-5 h-5 ${val <= Math.round(product.rating) ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`}
                    />
                  );
                })}
              </div>
              <p className="text-xs text-slate-400 mt-3 font-medium">Based on {totalReviewsCount} reviews</p>
            </div>

            {/* Simulated Star distribution bars */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingDistribution[stars - 1];
                const pct = Math.round((count / totalReviewsCount) * 100);
                return (
                  <div key={stars} className="flex items-center gap-3 text-xs">
                    <span className="w-12 text-slate-500 font-medium font-mono shrink-0">{stars} star</span>
                    <div className="flex-1 h-2 bg-slate-200/80 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-right text-slate-400 font-mono font-medium">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Reviews List & Write a Review Form (Right) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Form Box */}
            <div className="p-6 border border-slate-200 rounded-2xl bg-slate-50/30">
              <h4 className="text-sm font-bold text-slate-950 font-mono tracking-wider uppercase mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500" />
                <span>Write A Product Review</span>
              </h4>
              {reviewSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs text-center font-sans">
                  Thank you! Your verified review was added successfully and updated overall score.
                </div>
              )}
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Robin Carter"
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5">Select Rating</label>
                    <div className="flex items-center gap-1.5 h-9">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star className={`w-6 h-6 ${star <= newReviewRating ? 'fill-amber-500' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5">Review Details</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe your experience with this item. What did you like? What could be improved?"
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-750 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Listed Reviews */}
            <div className="space-y-6">
              <h4 className="text-xs font-bold text-slate-400 font-mono tracking-widest uppercase border-b border-slate-100 pb-3">
                Customer Feedbacks ({productReviews.length})
              </h4>
              
              {productReviews.length === 0 ? (
                <p className="text-slate-400 text-sm italic">No customer reviews yet. Be the first to review this product!</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {productReviews.slice().reverse().map((rev) => (
                    <div key={rev.id} className="py-6 flex gap-4 text-left first:pt-0">
                      <img src={rev.avatar} alt={rev.author} className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 object-cover shrink-0" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-slate-900">{rev.author}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`} />
                            ))}
                          </div>
                          {rev.isVerifiedPurchase && (
                            <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
                              Verified Purchase
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">{rev.comment}</p>

                        <div className="mt-4 flex items-center gap-3">
                          <button
                            type="button"
                            className="text-[11px] text-slate-400 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>Helpful ({rev.helpfulCount})</span>
                          </button>
                          <span className="text-slate-200 text-xs">|</span>
                          <button type="button" className="text-[11px] text-slate-400 hover:text-slate-800 cursor-pointer">
                            Report abuse
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
