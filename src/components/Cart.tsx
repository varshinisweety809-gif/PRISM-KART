/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowLeft, Tag, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { CartItem } from '../types';
import { formatINR } from '../utils/currency';

interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, q: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: (discountCode?: string, discountPct?: number) => void;
  onBackToBrowse: () => void;
}

export default function Cart({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onBackToBrowse
}: CartProps) {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [discountPct, setDiscountPct] = useState(0);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Dynamic Free Shipping limit at $150
  const freeShippingThreshold = 150;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingCost = subtotal === 0 ? 0 : isFreeShipping ? 0 : 12;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  // Apply Coupon Logic
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    const code = promoInput.trim().toUpperCase();
    if (code === 'PRISM20') {
      setDiscountPct(20);
      setPromoSuccess('Promo PRISM20 applied: 20% discount!');
    } else if (code === 'WELCOME10') {
      setDiscountPct(10);
      setPromoSuccess('Promo WELCOME10 applied: 10% discount!');
    } else {
      setPromoError('Invalid coupon code. Try WELCOME10 or PRISM20.');
      setDiscountPct(0);
    }
  };

  const discountAmount = Number(((subtotal * discountPct) / 100).toFixed(2));
  const taxAmount = Number(((subtotal - discountAmount) * 0.08).toFixed(2));
  const grandTotal = Number((subtotal - discountAmount + shippingCost + taxAmount).toFixed(2));

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-950 tracking-tight">Your shopping cart is empty</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
          Add items to your cart to start crafting your curated space. Discover premium electronics, clothing, and home accents.
        </p>
        <button
          onClick={onBackToBrowse}
          className="mt-8 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
        >
          Browse Recommended Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-slate-950 tracking-tight mb-8">Your Shopping Cart</h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart items list (Left) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Free Shipping Alert Banner */}
          {subtotal > 0 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
              <Truck className="w-5 h-5 text-indigo-600 shrink-0" />
              <div className="flex-1 text-xs text-slate-700">
                {isFreeShipping ? (
                  <span className="font-semibold text-indigo-600">Congratulations! You qualify for Free Express Shipping!</span>
                ) : (
                  <span>
                    Add <strong className="text-slate-950">{formatINR(remainingForFreeShipping)}</strong> more to unlock <strong className="text-indigo-600">FREE Express Shipping</strong>!
                  </span>
                )}
                {/* Visual mini progress bar */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* List Wrapper */}
          <div className="border border-slate-200 rounded-2xl bg-white divide-y divide-slate-100 overflow-hidden shadow-xs">
            {cart.map((item) => (
              <div key={item.id} className="p-5 flex flex-col sm:flex-row gap-5 text-left">
                {/* Thumbnail */}
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-slate-200 shrink-0"
                  referrerPolicy="no-referrer"
                />

                {/* Info and Quantities */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-0.5">{item.product.category}</span>
                        <h3 className="text-sm font-semibold text-slate-950 hover:text-indigo-600 cursor-pointer line-clamp-1">{item.product.name}</h3>
                      </div>
                      <span className="text-sm font-bold text-slate-950 shrink-0">{formatINR(item.product.price)}</span>
                    </div>

                    {/* Color & Size configuration metadata */}
                    <div className="flex flex-wrap gap-2.5 mt-1.5">
                      {item.selectedColor && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[10px] text-slate-600 font-medium">
                          Color: <strong>{item.selectedColor}</strong>
                        </span>
                      )}
                      {item.selectedSize && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[10px] text-slate-600 font-medium">
                          Size: <strong>{item.selectedSize}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity selectors */}
                    <div className="flex items-center gap-1 w-max border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-white rounded text-slate-500 cursor-pointer disabled:opacity-30"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold text-slate-800 min-w-6 text-center">{item.quantity}</span>
                      <button
                        disabled={item.quantity >= item.product.stock}
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-white rounded text-slate-500 cursor-pointer disabled:opacity-30"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Trash Button */}
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Shopping button */}
          <button
            onClick={onBackToBrowse}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium text-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {/* Pricing Summary Sidebar (Right) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Promo code application container */}
          <div className="p-5 border border-slate-200 bg-white rounded-2xl shadow-xs text-left">
            <h3 className="text-xs font-bold text-slate-400 font-mono tracking-widest uppercase mb-3">Promotional Discount</h3>
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="WELCOME10 / PRISM20"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs uppercase font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs shrink-0"
              >
                Apply
              </button>
            </form>
            {promoError && <p className="text-[10px] text-rose-500 font-sans mt-2">{promoError}</p>}
            {promoSuccess && (
              <p className="text-[10px] text-emerald-600 font-sans mt-2 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3 h-3 shrink-0" />
                <span>{promoSuccess}</span>
              </p>
            )}
            <div className="mt-3.5 border-t border-dashed border-slate-100 pt-3 text-[10px] text-slate-400 space-y-1">
              <p>&bull; <strong>PRISM20</strong> - Saves 20% across all luxury categories</p>
              <p>&bull; <strong>WELCOME10</strong> - Welcomes you with a 10% premium discount</p>
            </div>
          </div>

          {/* Grand Summary Details */}
          <div className="p-6 border border-slate-200 bg-white rounded-2xl shadow-xs text-left">
            <h3 className="text-xs font-bold text-slate-400 font-mono tracking-widest uppercase border-b border-slate-100 pb-3 mb-4">
              Order Breakdown
            </h3>
            
            <div className="space-y-3.5 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-semibold text-slate-950">{formatINR(subtotal)}</span>
              </div>

              {discountPct > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span className="flex items-center gap-1 font-medium">
                    <Tag className="w-3.5 h-3.5 stroke-[2.5px]" />
                    <span>Discount ({discountPct}%)</span>
                  </span>
                  <span className="font-semibold">-{formatINR(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                {shippingCost === 0 ? (
                  <span className="font-bold text-indigo-600 uppercase text-xs">FREE</span>
                ) : (
                  <span className="font-semibold text-slate-950">{formatINR(shippingCost)}</span>
                )}
              </div>

              <div className="flex justify-between">
                <span>Estimated Sales Tax (8%)</span>
                <span className="font-semibold text-slate-950">{formatINR(taxAmount)}</span>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-2 flex justify-between items-baseline">
                <span className="text-base font-bold text-slate-950">Grand Total</span>
                <span className="text-2xl font-extrabold text-slate-950">{formatINR(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => onProceedToCheckout(promoInput.trim().toUpperCase(), discountPct)}
              className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer shadow-sm text-center flex items-center justify-center gap-1.5"
            >
              <span>Proceed to Checkout</span>
            </button>

            <div className="mt-4 text-[10px] text-slate-400 text-center font-mono">
              Prices, promotions, and delivery dates finalized at payment.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
