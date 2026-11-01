'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Truck, 
  Search, 
  CheckCircle2, 
  Clock, 
  Package, 
  MapPin, 
  MessageCircle, 
  AlertCircle 
} from 'lucide-react';
import { getOrderByIdAndPhone } from '@/lib/supabase';
import { Order } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';

  const [orderId, setOrderId] = useState(initialOrderId);
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';

  useEffect(() => {
    if (initialOrderId) {
      setOrderId(initialOrderId);
      handleTrack(initialOrderId, '');
    }
  }, [initialOrderId]);

  const handleTrack = async (searchId: string, searchPhone: string) => {
    if (!searchId.trim()) return;
    setIsSearching(true);
    setHasSearched(true);

    try {
      const result = await getOrderByIdAndPhone(searchId, searchPhone);
      setOrder(result);
    } catch (e) {
      console.error(e);
      setOrder(null);
    } finally {
      setIsSearching(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrack(orderId, phone);
  };

  // Milestone Stages
  const stages = [
    { key: 'placed', label: 'Order Placed', desc: 'Received & Logged' },
    { key: 'confirmed', label: 'Order Confirmed', desc: 'Payment verified / COD verified' },
    { key: 'shipped', label: 'Shipped & In Transit', desc: 'Handed to express logistics' },
    { key: 'delivered', label: 'Delivered', desc: 'Completed successfully' },
  ];

  const getStageIndex = (status?: string) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const currentStageIndex = getStageIndex(order?.status);

  return (
    <div className="min-h-screen bg-zinc-950 py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-gold-400 mx-auto mb-4">
            <Truck className="w-7 h-7" />
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            TRACK YOUR SHIPMENT
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Enter your Order Reference ID and phone number to view live courier milestones and delivery estimates.
          </p>
        </div>

        {/* Input Form */}
        <form
          onSubmit={onSubmit}
          className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 shadow-2xl mb-12"
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6">
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                Order ID *
              </label>
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                placeholder="e.g. FLX-X821-4921"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 font-mono uppercase focus:outline-none focus:border-gold-400"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="10-digit mobile"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-gold-400"
              />
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button
                type="submit"
                disabled={isSearching}
                className="w-full py-3 bg-gold-400 hover:bg-gold-300 text-black font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-gold-500/10 disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                <span>{isSearching ? 'Tracking...' : 'Track'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Tracking Results */}
        {hasSearched && (
          <div>
            {order ? (
              <div className="rounded-3xl bg-zinc-900/70 border border-zinc-800 p-6 sm:p-8 space-y-8 shadow-2xl">
                {/* Status Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-800 gap-4">
                  <div>
                    <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">
                      Live Shipment Status
                    </span>
                    <span className="font-display font-black text-2xl text-white mt-1 capitalize flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      Status: {order.status}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-zinc-400 block font-mono">
                      Order ID: #{order.id}
                    </span>
                    <span className="text-xs text-zinc-500">
                      Placed: {formatDate(order.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Visual Flipkart-Style Milestone Timeline */}
                <div className="relative py-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stages.map((st, i) => {
                      const isComplete = i <= currentStageIndex;
                      const isCurrent = i === currentStageIndex;

                      return (
                        <div key={st.key} className="relative flex flex-col items-center text-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-3 transition-all z-10 ${
                              isComplete
                                ? 'bg-gold-400 text-black shadow-lg ring-4 ring-gold-400/20'
                                : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                            }`}
                          >
                            {isComplete ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                          </div>
                          <h4
                            className={`text-xs font-bold ${
                              isCurrent ? 'text-gold-400' : isComplete ? 'text-white' : 'text-zinc-500'
                            }`}
                          >
                            {st.label}
                          </h4>
                          <p className="text-[11px] text-zinc-500 mt-1 max-w-[140px]">
                            {st.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items & Shipping Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-800">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Consignment Items
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs">
                          <img
                            src={it.image}
                            alt={it.name}
                            className="w-10 h-12 object-cover rounded-lg border border-zinc-800"
                          />
                          <div className="truncate flex-1">
                            <p className="font-semibold text-white truncate">{it.name}</p>
                            <p className="text-zinc-500">Qty: {it.quantity} • {it.size}</p>
                          </div>
                          <span className="font-mono text-zinc-300">
                            {formatPrice(it.price * it.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Destination Address
                    </h4>
                    <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 text-xs space-y-1">
                      <p className="font-bold text-white">{order.customerName}</p>
                      <p className="text-zinc-400">{order.address}, {order.city}, {order.state} - {order.pincode}</p>
                      <p className="text-zinc-500 font-mono">Mobile: {order.customerPhone}</p>
                      <div className="pt-2 flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 uppercase font-mono text-gold-400">
                          {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Direct Help */}
                <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-zinc-400 text-center sm:text-left">
                    Need instant courier tracking number or delivery schedule change?
                  </p>
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=Hi%20Flexo%2C%20inquiring%20about%20my%20order%20%23${order.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600/15 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-semibold transition-colors shrink-0"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-10 rounded-3xl bg-zinc-900/40 border border-zinc-800 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
                <h3 className="font-display font-bold text-base text-white">
                  No Shipment Found for &quot;{orderId}&quot;
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Please check the spelling of your Order ID or message our WhatsApp concierge for instant manual lookup.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Loading Order Tracking...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
