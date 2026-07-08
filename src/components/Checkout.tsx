/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Truck, CreditCard, ChevronRight, Plus, MapPin, Check, Sparkles, Building2, Smartphone } from 'lucide-react';
import { Address, PaymentCard, CartItem, UserProfile } from '../types';
import { formatINR } from '../utils/currency';

interface CheckoutProps {
  user: UserProfile | null;
  cart: CartItem[];
  discountCode?: string;
  discountPct: number;
  onPlaceOrder: (address: Address, paymentMethod: string) => void;
  onBackToCart: () => void;
}

export default function Checkout({
  user,
  cart,
  discountCode,
  discountPct,
  onPlaceOrder,
  onBackToCart
}: CheckoutProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Addresses State
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user?.addresses.find((a) => a.isDefault)?.id || user?.addresses[0]?.id || ''
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: user?.name || '',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: user?.phone || '',
    isDefault: false
  });
  const [addressesList, setAddressesList] = useState<Address[]>(user?.addresses || []);

  // Cards / UPI State
  const [paymentType, setPaymentType] = useState<'card' | 'upi'>('card');
  const [selectedCardId, setSelectedCardId] = useState<string>(
    user?.savedCards.find((c) => c.isDefault)?.id || user?.savedCards[0]?.id || ''
  );
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [newCard, setNewCard] = useState({
    cardholderName: user?.name.toUpperCase() || '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    brand: 'visa' as 'visa' | 'mastercard'
  });
  const [cardsList, setCardsList] = useState<PaymentCard[]>(user?.savedCards || []);
  const [upiId, setUpiId] = useState('');
  const [upiVerified, setUpiVerified] = useState(false);
  const [verifyingUpi, setVerifyingUpi] = useState(false);

  // Spinner on final placing
  const [placingOrder, setPlacingOrder] = useState(false);

  // Billing calculation
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= 150;
  const shippingCost = isFreeShipping ? 0 : 12;
  const discountAmount = Number(((subtotal * discountPct) / 100).toFixed(2));
  const taxAmount = Number(((subtotal - discountAmount) * 0.08).toFixed(2));
  const grandTotal = Number((subtotal - discountAmount + shippingCost + taxAmount).toFixed(2));

  // Handle Address Addition
  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: Address = {
      id: `addr_${Date.now()}`,
      name: newAddress.name,
      street: newAddress.street,
      city: newAddress.city,
      state: newAddress.state,
      zip: newAddress.zip,
      phone: newAddress.phone,
      isDefault: newAddress.isDefault
    };

    let updatedList = [...addressesList];
    if (newAddr.isDefault) {
      updatedList = updatedList.map((a) => ({ ...a, isDefault: false }));
    }
    updatedList.push(newAddr);
    setAddressesList(updatedList);
    setSelectedAddressId(newAddr.id);
    setShowNewAddressForm(false);
    setNewAddress({
      name: user?.name || '',
      street: '',
      city: '',
      state: '',
      zip: '',
      phone: user?.phone || '',
      isDefault: false
    });
  };

  // Handle Card Addition
  const handleAddNewCard = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedNum = `**** **** **** ${newCard.cardNumber.slice(-4)}`;
    const newSavedCard: PaymentCard = {
      id: `card_${Date.now()}`,
      cardholderName: newCard.cardholderName.toUpperCase(),
      cardNumber: formattedNum,
      expiryDate: newCard.expiryDate,
      brand: newCard.brand,
      isDefault: false
    };

    setCardsList([...cardsList, newSavedCard]);
    setSelectedCardId(newSavedCard.id);
    setShowNewCardForm(false);
    setNewCard({
      cardholderName: user?.name.toUpperCase() || '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      brand: 'visa'
    });
  };

  const handleVerifyUpi = () => {
    if (!upiId.includes('@')) return;
    setVerifyingUpi(true);
    setTimeout(() => {
      setVerifyingUpi(false);
      setUpiVerified(true);
    }, 1200);
  };

  const currentAddress = addressesList.find((a) => a.id === selectedAddressId) || addressesList[0];
  const currentCard = cardsList.find((c) => c.id === selectedCardId) || cardsList[0];

  const handlePlaceOrderClick = () => {
    setPlacingOrder(true);
    setTimeout(() => {
      setPlacingOrder(false);
      // Construct payment display name
      const paymentMethodStr = paymentType === 'card'
        ? `${currentCard?.brand.toUpperCase()} ending in ${currentCard?.cardNumber.slice(-4)}`
        : `UPI Virtual Account (${upiId})`;

      onPlaceOrder(currentAddress, paymentMethodStr);
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 tracking-tight">Express Secure Checkout</h2>
          <p className="text-xs text-slate-400 font-mono mt-1">SECURE CONNECTION &bull; TLS 1.3 ENCRYPTION</p>
        </div>
        
        {/* Step Indicator Progress */}
        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <span className={`px-2.5 py-1 rounded-full ${step >= 1 ? 'bg-indigo-600 text-white font-semibold shadow-xs' : 'bg-slate-100 text-slate-500'}`}>1. Address</span>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className={`px-2.5 py-1 rounded-full ${step >= 2 ? 'bg-indigo-600 text-white font-semibold shadow-xs' : 'bg-slate-100 text-slate-500'}`}>2. Payment</span>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className={`px-2.5 py-1 rounded-full ${step >= 3 ? 'bg-indigo-600 text-white font-semibold shadow-xs' : 'bg-slate-100 text-slate-500'}`}>3. Review</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Core Steps Wizard Form (Left) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* STEP 1: SHIPPING ADDRESS */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex justify-between items-baseline border-b border-slate-100 pb-2">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Select Shipping Address</h3>
                {!showNewAddressForm && (
                  <button
                    onClick={() => setShowNewAddressForm(true)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                )}
              </div>

              {showNewAddressForm ? (
                <form onSubmit={handleAddNewAddress} className="p-6 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-4">
                  <h4 className="text-sm font-bold text-slate-950 font-mono tracking-wider uppercase mb-2">New Destination Info</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5">Recipient Full Name</label>
                      <input
                        type="text"
                        required
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5">Phone Number</label>
                      <input
                        type="text"
                        required
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5">Street Address</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 542 Horizon Way, Apt 3B"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5">City</label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5">State</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. CA"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5">Zip Code</label>
                      <input
                        type="text"
                        required
                        value={newAddress.zip}
                        onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="addrDefault"
                      checked={newAddress.isDefault}
                      onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="addrDefault" className="text-xs text-slate-600 font-medium cursor-pointer">Set as default shipping address</label>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs"
                    >
                      Save and Use Address
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  {addressesList.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
                      <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">No saved addresses found. Add a destination to ship products.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {addressesList.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`p-4 border-2 rounded-2xl cursor-pointer text-left transition-all relative flex flex-col justify-between ${isSelected ? 'border-indigo-600 bg-slate-50/50 shadow-sm' : 'border-slate-200 hover:border-indigo-500 bg-white'}`}
                          >
                            <div className="flex gap-2.5">
                              <Building2 className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                              <div>
                                <p className="text-sm font-semibold text-slate-950">{addr.name}</p>
                                <p className="text-xs text-slate-600 mt-1.5 leading-normal">{addr.street}</p>
                                <p className="text-xs text-slate-600 leading-normal">{addr.city}, {addr.state} {addr.zip}</p>
                                <p className="text-[11px] text-slate-400 mt-2 font-mono">{addr.phone}</p>
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                              {addr.isDefault ? (
                                <span className="text-[9px] font-mono uppercase bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-500">Default</span>
                              ) : <span />}
                              
                              {isSelected && (
                                <span className="p-1 bg-indigo-600 text-white rounded-full">
                                  <Check className="w-3.5 h-3.5 stroke-[3px]" />
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <button
                      disabled={!selectedAddressId}
                      onClick={() => setStep(2)}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-xl flex items-center gap-1 cursor-pointer shadow-sm transition-all"
                    >
                      <span>Proceed to Payment</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-baseline">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Select Payment Option</h3>
                <div className="flex border border-slate-200 rounded-lg p-0.5 text-xs bg-slate-50">
                  <button
                    onClick={() => { setPaymentType('card'); setShowNewCardForm(false); }}
                    className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${paymentType === 'card' ? 'bg-white shadow-xs text-slate-950' : 'text-slate-500'}`}
                  >
                    Credit / Debit Card
                  </button>
                  <button
                    onClick={() => { setPaymentType('upi'); setShowNewCardForm(false); }}
                    className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${paymentType === 'upi' ? 'bg-white shadow-xs text-slate-950' : 'text-slate-500'}`}
                  >
                    Instant UPI
                  </button>
                </div>
              </div>

              {paymentType === 'card' ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-xs font-bold text-slate-400 font-mono tracking-widest uppercase">Saved Cards</h4>
                    {!showNewCardForm && (
                      <button
                        onClick={() => setShowNewCardForm(true)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Credit Card</span>
                      </button>
                    )}
                  </div>

                  {showNewCardForm ? (
                    <form onSubmit={handleAddNewCard} className="p-6 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-4">
                      <h4 className="text-sm font-bold text-slate-950 font-mono tracking-wider uppercase mb-2">Secure Card Registration</h4>
                      
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5">Cardholder Name</label>
                        <input
                          type="text"
                          required
                          value={newCard.cardholderName}
                          onChange={(e) => setNewCard({ ...newCard, cardholderName: e.target.value })}
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs uppercase focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5">Card Number (16 digits)</label>
                          <input
                            type="text"
                            required
                            maxLength={16}
                            placeholder="4111 2222 3333 4444"
                            value={newCard.cardNumber}
                            onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value.replace(/\D/g, '') })}
                            className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5">Expiry MM/YY</label>
                            <input
                              type="text"
                              required
                              maxLength={5}
                              placeholder="12/29"
                              value={newCard.expiryDate}
                              onChange={(e) => setNewCard({ ...newCard, expiryDate: e.target.value })}
                              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5">CVV Code</label>
                            <input
                              type="password"
                              required
                              maxLength={3}
                              placeholder="***"
                              value={newCard.cvv}
                              onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value.replace(/\D/g, '') })}
                              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-baseline mt-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mb-1.5">Network</label>
                          <select
                            value={newCard.brand}
                            onChange={(e) => setNewCard({ ...newCard, brand: e.target.value as 'visa' | 'mastercard' })}
                            className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white cursor-pointer font-semibold text-slate-800"
                          >
                            <option value="visa">Visa Network</option>
                            <option value="mastercard">Mastercard Secure</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setShowNewCardForm(false)}
                            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs"
                          >
                            Register Card
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {cardsList.map((card) => {
                        const isSelected = selectedCardId === card.id;
                        return (
                          <div
                            key={card.id}
                            onClick={() => setSelectedCardId(card.id)}
                            className={`p-5 border-2 rounded-2xl cursor-pointer transition-all relative overflow-hidden bg-gradient-to-br ${isSelected ? 'from-slate-900 to-slate-950 text-white border-slate-950 shadow-md' : 'from-white to-slate-50/50 text-slate-800 border-slate-200 hover:border-slate-300'}`}
                          >
                            <div className="flex justify-between items-start">
                              <CreditCard className={`w-8 h-8 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                              <span className={`text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded ${isSelected ? 'bg-slate-850 text-slate-300' : 'bg-slate-200/50 text-slate-600'}`}>{card.brand}</span>
                            </div>

                            <p className="text-sm font-bold font-mono tracking-widest mt-6">{card.cardNumber}</p>
                            
                            <div className="mt-4 flex justify-between items-end">
                              <div>
                                <p className={`text-[9px] font-mono uppercase font-semibold ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>Cardholder</p>
                                <p className="text-[11px] font-bold tracking-tight mt-0.5 uppercase">{card.cardholderName}</p>
                              </div>
                              <div className="text-right">
                                <p className={`text-[9px] font-mono uppercase font-semibold ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>Expiry</p>
                                <p className="text-[11px] font-bold mt-0.5 font-mono">{card.expiryDate}</p>
                              </div>
                            </div>

                            {isSelected && (
                              <div className="absolute top-2 right-2 bg-emerald-500 text-white p-0.5 rounded-full">
                                <Check className="w-3 h-3 stroke-[3px]" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* UPI METHOD */
                <div className="p-6 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-4">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-6 h-6 text-indigo-600" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-950">Pay instantly via UPI Virtual ID</h4>
                      <p className="text-xs text-slate-500">Supports GPay, PhonePe, Paytm, or any banking portal.</p>
                    </div>
                  </div>

                  <div className="flex gap-2 max-w-md pt-2">
                    <input
                      type="text"
                      placeholder="e.g. alexrivera@oksbi"
                      value={upiId}
                      onChange={(e) => {
                        setUpiId(e.target.value);
                        setUpiVerified(false);
                      }}
                      className="flex-1 px-3.5 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                    />
                    <button
                      type="button"
                      disabled={!upiId.includes('@') || verifyingUpi}
                      onClick={handleVerifyUpi}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs rounded-lg cursor-pointer shrink-0 shadow-xs"
                    >
                      {verifyingUpi ? 'Verifying...' : upiVerified ? 'Verified' : 'Verify'}
                    </button>
                  </div>
                  {upiVerified && (
                    <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1 font-sans">
                      <Check className="w-3.5 h-3.5 stroke-[3px]" />
                      <span>UPI Virtual Address validated. Proceeding is secure.</span>
                    </p>
                  )}
                </div>
              )}

              {/* Step 2 Back & Proceed Buttons */}
              <div className="flex justify-between border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Back to Address
                </button>
                <button
                  type="button"
                  disabled={paymentType === 'card' ? !selectedCardId : !upiVerified}
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-xl flex items-center gap-1 cursor-pointer shadow-sm transition-all"
                >
                  <span>Review Final Order</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: FINAL REVIEW */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight border-b border-slate-100 pb-2">Final Review</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-600">
                {/* Shipping summary card */}
                <div className="p-4 border border-slate-200 bg-slate-50/20 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-1.5">Shipping Address</p>
                  <p className="font-bold text-slate-900">{currentAddress?.name}</p>
                  <p className="mt-1">{currentAddress?.street}</p>
                  <p>{currentAddress?.city}, {currentAddress?.state} {currentAddress?.zip}</p>
                  <p className="font-mono mt-1 text-slate-400">{currentAddress?.phone}</p>
                </div>

                {/* Billing Summary card */}
                <div className="p-4 border border-slate-200 bg-slate-50/20 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-1.5">Payment Method</p>
                  {paymentType === 'card' ? (
                    <>
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-slate-500" />
                        <span>Registered Card ({currentCard?.brand.toUpperCase()})</span>
                      </p>
                      <p className="font-mono mt-1 text-slate-700">{currentCard?.cardNumber}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-slate-500" />
                        <span>Instant UPI Account</span>
                      </p>
                      <p className="font-mono mt-1 text-slate-700">{upiId}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Interactive Items checklist */}
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
                <div className="p-3 bg-slate-50 font-mono text-[9px] text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-100 text-left">
                  Reviewing {cart.length} item(s) to be shipped
                </div>
                {cart.map((item) => (
                  <div key={item.id} className="p-4 flex gap-4 text-left items-center">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 object-cover border border-slate-100 rounded-lg" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-950 truncate">{item.product.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Qty: <strong>{item.quantity}</strong> 
                        {item.selectedColor && ` \u2022 Color: ${item.selectedColor}`}
                        {item.selectedSize && ` \u2022 Size: ${item.selectedSize}`}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-slate-950 shrink-0">{formatINR(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl flex items-center gap-3">
                <Sparkles className="text-emerald-600 w-5 h-5 shrink-0" />
                <p className="text-xs text-slate-700 leading-normal">
                  Order receives <strong>complementary premium gift packaging</strong>. Estimated delivery: <strong className="text-slate-950">2-3 business days</strong> with full track-and-trace monitoring.
                </p>
              </div>

              {/* Step 3 Placement and return actions */}
              <div className="flex justify-between border-t border-slate-100 pt-5 items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Back to Payment
                </button>

                <button
                  onClick={handlePlaceOrderClick}
                  disabled={placingOrder}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/10 min-w-44"
                >
                  {placingOrder ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4.5 h-4.5 stroke-[2.5px]" />
                      <span>Place Order &bull; {formatINR(grandTotal)}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Breakdown sidebar summary details (Right) */}
        <div className="lg:col-span-4 p-6 border border-slate-200 bg-white rounded-2xl shadow-xs text-left">
          <h3 className="text-xs font-bold text-slate-400 font-mono tracking-widest uppercase border-b border-slate-100 pb-3 mb-4">
            Payment Breakdown
          </h3>

          <div className="space-y-3.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal ({cart.length} items)</span>
              <span className="font-semibold text-slate-950">{formatINR(subtotal)}</span>
            </div>

            {discountPct > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span className="flex items-center gap-1">
                  <span>Coupon Discount ({discountPct}%)</span>
                </span>
                <span className="font-semibold">-{formatINR(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping cost</span>
              {isFreeShipping ? (
                <span className="font-bold text-indigo-600 uppercase">FREE</span>
              ) : (
                <span className="font-semibold text-slate-950">{formatINR(shippingCost)}</span>
              )}
            </div>

            <div className="flex justify-between">
              <span>Sales Tax (8%)</span>
              <span className="font-semibold text-slate-950">{formatINR(taxAmount)}</span>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-2 flex justify-between items-baseline text-sm">
              <span className="font-bold text-slate-950">Grand Total</span>
              <span className="text-xl font-extrabold text-slate-950">{formatINR(grandTotal)}</span>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4 flex gap-2.5 items-center text-xs text-slate-400">
            <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0" />
            <span>Encrypted billing and instant order placement guarantee.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
