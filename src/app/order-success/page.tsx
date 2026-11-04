'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  MessageCircle, 
  Truck, 
  Printer, 
  ArrowRight, 
  Clock, 
  ShoppingBag,
  ExternalLink 
} from 'lucide-react';
import { getOrderByIdAndPhone } from '@/lib/supabase';
import { Order } from '@/lib/types';
import { formatPrice, formatDate, getWhatsAppOrderUrl } from '@/lib/utils';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'FLEXO LIFESTYLE';
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';

  useEffect(() => {
    // Fire celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#10b981', '#ffffff', '#eab308'],
      });
    } catch (e) {}

    // Fetch order details
    if (orderId) {
      getOrderByIdAndPhone(orderId, '').then((res) => {
        setOrder(res);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const whatsappUrl = order
    ? getWhatsAppOrderUrl(order, whatsappNumber)
    : `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=Hi%20Flexo%20Lifestyle%2C%20I%20just%20placed%20order%20%23${orderId}`;

  return (
    <div className="min-h-screen bg-zinc-950 py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-4 mb-10">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>
          <span className="text-xs font-mono font-bold tracking-widest text-gold-400 uppercase">
            Order Confirmed & Logged
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            THANK YOU FOR YOUR PATRONAGE
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Your order has been recorded in the {brandName} database. A confirmation dispatch update will be sent shortly.
          </p>
        </div>

        {/* Order Card Container */}
        <div className="rounded-3xl bg-zinc-900/70 border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-800 gap-4">
            <div>
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block">
                Order Reference
              </span>
              <span className="font-mono font-black text-xl sm:text-2xl text-white">
                #{orderId || 'FLX-CONFIRMED'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {order?.paymentMethod === 'upi' ? 'UPI Pending Verification' : 'COD Confirmed'}
              </span>
            </div>
          </div>

          {/* Primary Action: Send Order on WhatsApp */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-sm text-white">
                  Send Order Confirmation on WhatsApp
                </h3>
                <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                  Click the button below to share your order slip directly with our WhatsApp concierge. This accelerates verification and gives you direct phone updates!
                </p>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send Order on WhatsApp Now</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Order Items & Breakdown */}
          {order && (
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Order Items ({order.items.length})
              </h4>
              <div className="divide-y divide-zinc-800/80">
                {order.items.map((it, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={it.image}
                        alt={it.name}
                        className="w-12 h-14 object-cover rounded-lg border border-zinc-800 shrink-0"
                      />
                      <div className="truncate">
                        <p className="font-semibold text-white truncate">{it.name}</p>
                        <p className="text-zinc-500">
                          Qty: {it.quantity} • Size: {it.size} • {it.color}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-zinc-200 shrink-0">
                      {formatPrice(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Row */}
              <div className="pt-4 border-t border-zinc-800 flex justify-between items-center text-sm">
                <span className="text-zinc-400">Total Paid / Payable</span>
                <span className="font-mono font-bold text-gold-400 text-lg">
                  {formatPrice(order.total)}
                </span>
              </div>

              {/* Delivery Address Details */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs space-y-1">
                <span className="font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Delivering to:
                </span>
                <p className="text-white font-semibold">{order.customerName}</p>
                <p className="text-zinc-400">{order.address}, {order.city}, {order.state} - {order.pincode}</p>
                <p className="text-zinc-500 font-mono">Mobile: {order.customerPhone}</p>
              </div>
            </div>
          )}

          {/* Navigation Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-zinc-800">
            <Link
              href={`/track-order?orderId=${encodeURIComponent(orderId)}`}
              className="py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4 text-gold-400" />
              <span>Track Order Live</span>
            </Link>

            <button
              onClick={handlePrint}
              className="py-3 rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Order Receipt</span>
            </button>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="text-xs text-zinc-500 hover:text-gold-400 transition-colors inline-flex items-center gap-1.5"
          >
            <span>&larr; Back to Shopping Catalogue</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Loading Order Status...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
