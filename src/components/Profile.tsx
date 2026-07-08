/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, MapPin, CreditCard, Heart, Check, Plus, Trash2, ShieldCheck, Mail, Phone, Settings, AlertCircle } from 'lucide-react';
import { UserProfile, Address, PaymentCard, Product } from '../types';
import { formatINR } from '../utils/currency';

interface ProfileProps {
  user: UserProfile;
  allProducts: Product[];
  activeSubTab: 'default' | 'wishlist'; // allows deep linking
  onUpdateUser: (updatedUser: UserProfile) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, color?: string, size?: string) => void;
  onLogout: () => void;
}

export default function Profile({
  user,
  allProducts,
  activeSubTab,
  onUpdateUser,
  onSelectProduct,
  onAddToCart,
  onLogout
}: ProfileProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'cards' | 'wishlist'>(
    activeSubTab === 'wishlist' ? 'wishlist' : 'profile'
  );

  // Profile Edit States
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profilePhone, setProfilePhone] = useState(user.phone);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Address Dialog / Form
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: user.name,
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: user.phone,
    isDefault: false
  });

  // Card Dialog / Form
  const [cardFormOpen, setCardFormOpen] = useState(false);
  const [newCard, setNewCard] = useState({
    cardholderName: user.name.toUpperCase(),
    cardNumber: '',
    expiryDate: '',
    brand: 'visa' as 'visa' | 'mastercard'
  });

  // Settings
  const [notifications, setNotifications] = useState(true);

  // Filter products in Wishlist
  const wishlistedProducts = allProducts.filter((p) => user.wishlist.includes(p.id));

  // Save profile updates
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name: profileName,
      email: profileEmail,
      phone: profilePhone
    });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2500);
  };

  // Add Address
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const addr: Address = {
      id: `addr_${Date.now()}`,
      name: newAddress.name,
      street: newAddress.street,
      city: newAddress.city,
      state: newAddress.state,
      zip: newAddress.zip,
      phone: newAddress.phone,
      isDefault: newAddress.isDefault
    };

    let updatedAddresses = [...user.addresses];
    if (addr.isDefault) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
    }
    updatedAddresses.push(addr);

    onUpdateUser({
      ...user,
      addresses: updatedAddresses
    });
    setAddressFormOpen(false);
    setNewAddress({
      name: user.name,
      street: '',
      city: '',
      state: '',
      zip: '',
      phone: user.phone,
      isDefault: false
    });
  };

  // Delete Address
  const handleDeleteAddress = (id: string) => {
    const updated = user.addresses.filter((a) => a.id !== id);
    // If deleted was default, make first remaining default
    if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
      updated[0].isDefault = true;
    }
    onUpdateUser({
      ...user,
      addresses: updated
    });
  };

  // Add Card
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedNum = `**** **** **** ${newCard.cardNumber.slice(-4)}`;
    const savedCard: PaymentCard = {
      id: `card_${Date.now()}`,
      cardholderName: newCard.cardholderName.toUpperCase(),
      cardNumber: formattedNum,
      expiryDate: newCard.expiryDate,
      brand: newCard.brand,
      isDefault: false
    };

    onUpdateUser({
      ...user,
      savedCards: [...user.savedCards, savedCard]
    });
    setCardFormOpen(false);
    setNewCard({
      cardholderName: user.name.toUpperCase(),
      cardNumber: '',
      expiryDate: '',
      brand: 'visa'
    });
  };

  // Delete Card
  const handleDeleteCard = (id: string) => {
    const updated = user.savedCards.filter((c) => c.id !== id);
    onUpdateUser({
      ...user,
      savedCards: updated
    });
  };

  // Toggle wishlist item removal
  const handleRemoveWishlist = (productId: number) => {
    onUpdateUser({
      ...user,
      wishlist: user.wishlist.filter((id) => id !== productId)
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav Buttons (Left Column) */}
        <div className="md:w-1/4 space-y-6">
          <div className="p-6 bg-white border border-zinc-200/80 rounded-2xl text-center shadow-2xs">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full mx-auto border-2 border-zinc-200 bg-zinc-50 object-cover shadow-xs"
              referrerPolicy="no-referrer"
            />
            <h3 className="text-base font-bold text-zinc-950 mt-4 tracking-tight leading-none">{user.name}</h3>
            <p className="text-zinc-500 text-xs mt-1.5 font-sans break-all">{user.email}</p>
            
            <button
              onClick={onLogout}
              className="mt-6 w-full py-2 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Sign Out Account
            </button>
          </div>

          <div className="flex flex-col border border-zinc-200/60 rounded-2xl bg-white overflow-hidden shadow-2xs">
            <button
              onClick={() => setActiveTab('profile')}
              className={`p-3.5 text-xs font-bold font-mono tracking-wider uppercase text-left border-b border-zinc-100 flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === 'profile' ? 'bg-zinc-900 text-white border-zinc-900' : 'text-zinc-600 hover:bg-zinc-50'}`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Personal Details</span>
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`p-3.5 text-xs font-bold font-mono tracking-wider uppercase text-left border-b border-zinc-100 flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === 'addresses' ? 'bg-zinc-900 text-white border-zinc-900' : 'text-zinc-600 hover:bg-zinc-50'}`}
            >
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Saved Addresses ({user.addresses.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('cards')}
              className={`p-3.5 text-xs font-bold font-mono tracking-wider uppercase text-left border-b border-zinc-100 flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === 'cards' ? 'bg-zinc-900 text-white border-zinc-900' : 'text-zinc-600 hover:bg-zinc-50'}`}
            >
              <CreditCard className="w-4 h-4 shrink-0" />
              <span>Saved Payment Cards ({user.savedCards.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`p-3.5 text-xs font-bold font-mono tracking-wider uppercase text-left flex items-center gap-2.5 transition-all cursor-pointer ${activeTab === 'wishlist' ? 'bg-zinc-900 text-white border-zinc-900' : 'text-zinc-600 hover:bg-zinc-50'}`}
            >
              <Heart className="w-4 h-4 shrink-0" />
              <span>Your Wishlist ({user.wishlist.length})</span>
            </button>
          </div>
        </div>

        {/* Dashboard Panels (Right Column) */}
        <div className="flex-1 bg-white border border-zinc-200/80 rounded-2xl p-6 md:p-8 shadow-2xs">
          
          {/* TAB 1: EDIT PROFILE DETAILS */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight border-b border-zinc-100 pb-2">Personal Identity Details</h3>
              {profileSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center gap-1 font-medium font-sans animate-fade-in">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Your account profile details have been saved securely!</span>
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono mb-1.5">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full pl-3.5 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono mb-1.5">Phone Number</label>
                    <div className="relative text-zinc-400">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="w-3.5 h-3.5" /></span>
                      <input
                        type="tel"
                        required
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono mb-1.5">Email Address</label>
                  <div className="relative text-zinc-400">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="w-3.5 h-3.5" /></span>
                    <input
                      type="email"
                      required
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
                  <span className="text-[11px] text-zinc-400 font-mono">ID: user_prism_623a</span>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs rounded-xl cursor-pointer shadow-sm transition-all"
                  >
                    Save Modifications
                  </button>
                </div>
              </form>

              {/* Advanced App parameters */}
              <div className="mt-8 border-t border-zinc-100 pt-6 space-y-4">
                <h4 className="text-xs font-bold text-zinc-400 font-mono tracking-widest uppercase flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-zinc-400" />
                  <span>Preferences & Settings</span>
                </h4>

                <div className="flex items-center justify-between p-3.5 bg-zinc-50 border border-zinc-200/50 rounded-xl text-xs">
                  <div>
                    <p className="font-bold text-zinc-900">Email Newsletters</p>
                    <p className="text-zinc-500 mt-0.5">Receive notifications of limited inventory drops.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-950 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADDRESS MANAGEMENT */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-baseline border-b border-zinc-100 pb-2">
                <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Saved Delivery Locations</h3>
                {!addressFormOpen && (
                  <button
                    onClick={() => setAddressFormOpen(true)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New</span>
                  </button>
                )}
              </div>

              {addressFormOpen ? (
                <form onSubmit={handleAddAddress} className="p-5 border border-zinc-200 rounded-xl bg-zinc-50/50 space-y-4">
                  <h4 className="text-xs font-bold text-zinc-400 font-mono tracking-widest uppercase">Register Address Location</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono mb-1.5">Recipient Full Name</label>
                      <input
                        type="text"
                        required
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono mb-1.5">Street Address Details</label>
                    <input
                      type="text"
                      required
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono mb-1.5">City</label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono mb-1.5">State</label>
                      <input
                        type="text"
                        required
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono mb-1.5">Zip Code</label>
                      <input
                        type="text"
                        required
                        value={newAddress.zip}
                        onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="checkbox"
                      id="addrProfileDef"
                      checked={newAddress.isDefault}
                      onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                      className="rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950 cursor-pointer"
                    />
                    <label htmlFor="addrProfileDef" className="text-xs text-zinc-600 font-medium cursor-pointer">Set as default shipping destination</label>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setAddressFormOpen(false)}
                      className="px-3.5 py-1.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-600 text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {user.addresses.length === 0 ? (
                    <p className="text-sm text-zinc-400 italic">No shipping addresses registered yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {user.addresses.map((addr) => (
                        <div key={addr.id} className="p-4 border border-zinc-200 rounded-xl text-left bg-zinc-50/20 relative flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-bold text-zinc-950">{addr.name}</p>
                              <button
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="text-zinc-400 hover:text-rose-600 p-1 rounded-lg transition-all cursor-pointer"
                                title="Delete address"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-xs text-zinc-600 mt-2">{addr.street}</p>
                            <p className="text-xs text-zinc-600">{addr.city}, {addr.state} {addr.zip}</p>
                            <p className="text-[10px] text-zinc-400 font-mono mt-2">{addr.phone}</p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[10px]">
                            {addr.isDefault ? (
                              <span className="font-bold text-indigo-600 font-mono uppercase bg-indigo-50 px-1.5 py-0.5 rounded">Default</span>
                            ) : <span />}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PAYMENT CARDS */}
          {activeTab === 'cards' && (
            <div className="space-y-6">
              <div className="flex justify-between items-baseline border-b border-zinc-100 pb-2">
                <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Saved Credit/Debit Cards</h3>
                {!cardFormOpen && (
                  <button
                    onClick={() => setCardFormOpen(true)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New</span>
                  </button>
                )}
              </div>

              {cardFormOpen ? (
                <form onSubmit={handleAddCard} className="p-5 border border-zinc-200 rounded-xl bg-zinc-50/50 space-y-4">
                  <h4 className="text-xs font-bold text-zinc-400 font-mono tracking-widest uppercase">Secure Card Enrolment</h4>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono mb-1.5">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={newCard.cardholderName}
                      onChange={(e) => setNewCard({ ...newCard, cardholderName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono mb-1.5">Card Number</label>
                      <input
                        type="text"
                        required
                        maxLength={16}
                        placeholder="4111222233334444"
                        value={newCard.cardNumber}
                        onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono mb-1.5">Expiry MM/YY</label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          placeholder="12/29"
                          value={newCard.expiryDate}
                          onChange={(e) => setNewCard({ ...newCard, expiryDate: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono mb-1.5">Brand</label>
                        <select
                          value={newCard.brand}
                          onChange={(e) => setNewCard({ ...newCard, brand: e.target.value as 'visa' | 'mastercard' })}
                          className="w-full px-2 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-semibold"
                        >
                          <option value="visa">Visa</option>
                          <option value="mastercard">Mastercard</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setCardFormOpen(false)}
                      className="px-3.5 py-1.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-600 text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg cursor-pointer shadow-xs"
                    >
                      Register Card
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {user.savedCards.length === 0 ? (
                    <p className="text-sm text-zinc-400 italic">No credit cards registered yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {user.savedCards.map((card) => (
                        <div key={card.id} className="p-4 border border-zinc-200 bg-zinc-50/10 rounded-xl relative overflow-hidden flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <CreditCard className="w-7 h-7 text-zinc-400" />
                            <div className="flex items-center gap-1">
                              <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded">{card.brand}</span>
                              <button
                                onClick={() => handleDeleteCard(card.id)}
                                className="text-zinc-400 hover:text-rose-600 p-1 rounded-lg transition-all cursor-pointer"
                                title="Delete card"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-sm font-semibold font-mono tracking-widest mt-4">{card.cardNumber}</p>
                          <p className="text-[11px] font-bold mt-2 uppercase">{card.cardholderName}</p>

                          <div className="mt-3 pt-3 border-t border-zinc-100 flex justify-between items-center text-[10px]">
                            <span className="text-zinc-400">Expires: {card.expiryDate}</span>
                            {card.isDefault && (
                              <span className="text-[9px] font-mono font-bold text-indigo-600 uppercase bg-indigo-50 px-1.5 py-0.5 rounded">Default</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: WISHLIST VIEW */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight border-b border-zinc-100 pb-2">Your Personal Wishlist Favorites</h3>
              
              {wishlistedProducts.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-zinc-200 rounded-xl">
                  <Heart className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                  <p className="text-sm text-zinc-500">Your wishlist is empty.</p>
                  <p className="text-xs text-zinc-400 mt-1">Bookmark items you love while shopping to view them here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 border border-zinc-200/80 hover:border-zinc-300 rounded-2xl flex gap-4 bg-white hover:shadow-xs transition-all text-left relative overflow-hidden"
                    >
                      {/* Product Thumbnail */}
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        onClick={() => onSelectProduct(p)}
                        className="w-16 h-16 object-cover rounded-xl border border-zinc-100 cursor-pointer"
                        referrerPolicy="no-referrer"
                      />

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="cursor-pointer" onClick={() => onSelectProduct(p)}>
                          <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest">{p.category}</span>
                          <h4 className="text-xs font-semibold text-zinc-950 truncate">{p.name}</h4>
                          <p className="text-xs font-bold text-zinc-950 mt-1">{formatINR(p.price)}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-2.5">
                          <button
                            onClick={() => {
                              onAddToCart(p, 1, p.colors?.[0], p.sizes?.[0]);
                              handleRemoveWishlist(p.id);
                            }}
                            className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-[10px] rounded-lg transition-all cursor-pointer shadow-2xs"
                          >
                            Add to Cart
                          </button>
                          
                          <button
                            onClick={() => handleRemoveWishlist(p.id)}
                            className="text-zinc-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                            title="Remove from wishlist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
