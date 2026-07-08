/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Truck, Package, RotateCcw, ChevronDown, ChevronUp, MapPin, ClipboardList, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatINR } from '../utils/currency';

interface OrdersProps {
  orders: Order[];
  onReorder: (order: Order) => void;
  onAdvanceStatus: (orderId: string) => void; // Live simulation!
  onBackToShopping: () => void;
}

export default function Orders({
  orders,
  onReorder,
  onAdvanceStatus,
  onBackToShopping
}: OrdersProps) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    orders[0]?.id || null
  );

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'ordered':
        return <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider">Ordered</span>;
      case 'processed':
        return <span className="px-2.5 py-0.5 bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider">Processing</span>;
      case 'shipped':
        return <span className="px-2.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider">In Transit</span>;
      case 'delivered':
        return <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider">Delivered</span>;
    }
  };

  const getMockLiveLog = (status: OrderStatus) => {
    switch (status) {
      case 'ordered':
        return "Invoice generated. Payment cleared successfully. Warehouse preparing items.";
      case 'processed':
        return "Custom packaging complete. Quality check validated. Handed over to regional shipping hub.";
      case 'shipped':
        return "Driver departed regional center. Sorting finished at outbound sorting facility. In transit.";
      case 'delivered':
        return "Signature received at door threshold. Front porch drop-off confirmed by driver Alex R.";
    }
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-950 tracking-tight">You haven't placed any orders yet</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
          Start exploring our catalog of premium smartwatches, noise-cancelling headphones, pure soy candles, and apparel!
        </p>
        <button
          onClick={onBackToShopping}
          className="mt-8 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
        >
          Explore Catalog Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-950 tracking-tight">Your Orders & Shipping Trackers</h2>
        <p className="text-sm text-slate-500 mt-1">Review transaction histories, download premium receipts, or track shipments live.</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const isExpanded = expandedOrderId === order.id;
          return (
            <div
              key={order.id}
              className={`border rounded-2xl bg-white overflow-hidden shadow-xs transition-all ${isExpanded ? 'border-indigo-600 shadow-md shadow-indigo-600/5' : 'border-slate-200 hover:border-slate-300'}`}
            >
              {/* Card Header clickable summary */}
              <div
                onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                className="p-5 sm:p-6 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer select-none"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-left">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 font-mono tracking-widest uppercase">Order Registered</p>
                    <p className="text-xs font-semibold text-slate-900 mt-1">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 font-mono tracking-widest uppercase">Invoice Total</p>
                    <p className="text-xs font-extrabold text-slate-900 mt-1">{formatINR(order.total)}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-[9px] font-bold text-slate-400 font-mono tracking-widest uppercase">Reference ID</p>
                    <p className="text-xs font-mono font-medium text-indigo-600 mt-1">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 font-mono tracking-widest uppercase">Status</p>
                    <div className="mt-1">{getStatusBadge(order.status)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReorder(order);
                    }}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3 text-slate-500" />
                    <span>Reorder</span>
                  </button>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </div>
              </div>

              {/* Collapsible Details Body */}
              {isExpanded && (
                <div className="border-t border-slate-100 p-6 space-y-8">
                  
                  {/* Interactive Status Timeline Progress Stepper */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <h3 className="text-xs font-bold text-slate-400 font-mono tracking-widest uppercase">Interactive Shipment Timeline</h3>
                      
                      {/* SIMULATION TRIGER */}
                      {order.status !== 'delivered' && (
                        <button
                          onClick={() => onAdvanceStatus(order.id)}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-mono font-bold tracking-wider uppercase rounded-md flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-emerald-300" />
                          <span>Simulate Delivery Progress &arr;</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 relative">
                      {/* Connecting Line (Desktop) */}
                      <div className="hidden md:block absolute top-[28px] left-[12.5%] right-[12.5%] h-1 bg-slate-200 z-0">
                        {/* Shifting background indicator */}
                        <div 
                          className="h-full bg-indigo-600 transition-all duration-700"
                          style={{
                            width: order.status === 'ordered' ? '0%' :
                                   order.status === 'processed' ? '33.33%' :
                                   order.status === 'shipped' ? '66.66%' : '100%'
                          }}
                        />
                      </div>

                      {order.trackingSteps.map((step, idx) => {
                        return (
                          <div key={step.status} className="relative z-10 flex md:flex-col items-center md:text-center gap-3 md:gap-2">
                            {/* Circle Stage */}
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-500 ${step.isCompleted ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20' : step.isCurrent ? 'bg-white border-indigo-600 text-indigo-600 ring-4 ring-indigo-50 scale-110' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                              {step.isCompleted ? (
                                <Check className="w-4 h-4 stroke-[3.5px]" />
                              ) : step.status === 'shipped' ? (
                                <Truck className="w-4 h-4" />
                              ) : (
                                <Package className="w-4 h-4" />
                              )}
                            </div>

                            <div className="text-left md:text-center">
                              <p className={`text-xs font-bold leading-tight ${step.isCurrent ? 'text-slate-950 font-extrabold' : step.isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>{step.title}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{step.description}</p>
                              {step.isCompleted && <p className="text-[9px] font-mono text-emerald-600 mt-0.5 font-medium">{step.date}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Live delivery logs block */}
                    <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-xl mt-4 text-xs">
                      <p className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                        <ClipboardList className="w-3.5 h-3.5 text-slate-400" />
                        <span>Live Dispatch Log Feed</span>
                      </p>
                      <p className="text-slate-700 italic font-medium leading-relaxed">
                        "{getMockLiveLog(order.status)}"
                      </p>
                    </div>
                  </div>

                  {/* Split delivery addresses and order content info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs text-slate-600">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-2">Delivery Location</h4>
                      <p className="font-semibold text-slate-900">{order.address.name}</p>
                      <p className="mt-1">{order.address.street}</p>
                      <p>{order.address.city}, {order.address.state} {order.address.zip}</p>
                      <p className="font-mono text-slate-400 mt-1">{order.address.phone}</p>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 font-mono tracking-widest uppercase mb-2">Billing Method & Totals</h4>
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span className="font-semibold text-slate-900">{formatINR(order.subtotal)}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-emerald-600 font-medium">
                            <span>Promotional Discount:</span>
                            <span>-{formatINR(order.discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Sales Tax (8%):</span>
                          <span>{formatINR(order.tax)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Shipping:</span>
                          <span>{order.shipping === 0 ? "FREE" : formatINR(order.shipping)}</span>
                        </div>
                        <div className="flex justify-between border-t border-dashed border-slate-200 pt-2 font-bold text-sm text-slate-950">
                          <span>Grand Total Paid:</span>
                          <span className="text-indigo-600 font-extrabold">{formatINR(order.total)}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-4 font-mono font-semibold uppercase">PAYMENT: {order.paymentMethod}</p>
                    </div>
                  </div>

                  {/* List of items within order */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                    <div className="p-3 bg-slate-50 font-mono text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
                      Purchased Items Checklist
                    </div>
                    {order.items.map((item) => (
                      <div key={item.id} className="p-4 flex gap-4 text-left items-center justify-between">
                        <div className="flex gap-3 items-center">
                          <img src={item.product.images[0]} alt={item.product.name} className="w-10 h-10 object-cover border border-slate-100 rounded-lg" referrerPolicy="no-referrer" />
                          <div>
                            <p className="text-xs font-semibold text-slate-950">{item.product.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Qty: <strong>{item.quantity}</strong> 
                              {item.selectedColor && ` \u2022 Color: ${item.selectedColor}`}
                              {item.selectedSize && ` \u2022 Size: ${item.selectedSize}`}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-slate-950">{formatINR(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
