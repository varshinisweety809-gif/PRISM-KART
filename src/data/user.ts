/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, Address, PaymentCard } from '../types';

export const INITIAL_ADDRESSES: Address[] = [
  {
    id: "addr_1",
    name: "Alex Rivera (Home)",
    street: "542 Horizon Way, Apt 3B",
    city: "San Francisco",
    state: "CA",
    zip: "94107",
    phone: "+1 (555) 382-9012",
    isDefault: true
  },
  {
    id: "addr_2",
    name: "Alex Rivera (Office)",
    street: "1600 Amphitheatre Pkwy",
    city: "Mountain View",
    state: "CA",
    zip: "94043",
    phone: "+1 (555) 906-1243",
    isDefault: false
  }
];

export const INITIAL_CARDS: PaymentCard[] = [
  {
    id: "card_1",
    cardholderName: "ALEX RIVERA",
    cardNumber: "**** **** **** 4242",
    expiryDate: "12/29",
    brand: "visa",
    isDefault: true
  },
  {
    id: "card_2",
    cardholderName: "ALEX RIVERA",
    cardNumber: "**** **** **** 8899",
    expiryDate: "06/28",
    brand: "mastercard",
    isDefault: false
  }
];

export const INITIAL_PROFILE: UserProfile = {
  name: "Alex Rivera",
  email: "alex.rivera@prism.design",
  phone: "+1 (555) 382-9012",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  addresses: INITIAL_ADDRESSES,
  savedCards: INITIAL_CARDS,
  wishlist: [1, 4] // preloaded with Aether Headphones and Amber Candles in wishlist!
};
