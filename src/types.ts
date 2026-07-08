/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: number;
  name: string;
  description: string;
  fullDescription: string;
  price: number;
  rating: number;
  reviewCount: number;
  category: string;
  images: string[];
  specs: Record<string, string>;
  colors?: string[];
  sizes?: string[];
  stock: number;
  isFeatured?: boolean;
  tags?: string[];
}

export interface CartItem {
  id: string; // unique cart item id (e.g. productId-color-size)
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Review {
  id: string;
  productId: number;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
}

export type OrderStatus = 'ordered' | 'processed' | 'shipped' | 'delivered';

export interface TrackingStep {
  status: OrderStatus;
  title: string;
  description: string;
  date: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  isDefault: boolean;
}

export interface PaymentCard {
  id: string;
  cardholderName: string;
  cardNumber: string; // masked, e.g. **** **** **** 4242
  expiryDate: string;
  brand: 'visa' | 'mastercard' | 'amex';
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  status: OrderStatus;
  address: Address;
  paymentMethod: string;
  estimatedDelivery: string;
  trackingSteps: TrackingStep[];
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  addresses: Address[];
  savedCards: PaymentCard[];
  wishlist: number[]; // product IDs
}
