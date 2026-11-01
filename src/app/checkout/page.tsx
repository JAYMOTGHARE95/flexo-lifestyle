'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Banknote, 
  MessageCircle, 
  CheckCircle2, 
  ArrowRight, 
  Lock,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { 
  formatPrice, 
  generateOrderId, 
  generateUpiUri, 
  getWhatsAppOrderUrl 
} from '@/lib/utils';
import { saveOrder } from '@/lib/supabase';
import { Order, PaymentMethod } from '@/lib/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemCount, subtotal, discount, shipping, total, clearCart } = useCart();

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiUtr, setUpiUtr] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'FLEXO LIFESTYLE';
  const upiId = process.env.NEXT_PUBLIC_UPI_ID || 'flexo@upi';
  const upiName = process.env.NEXT_PUBLIC_UPI_NAME || 'Flexo Lifestyle';
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';

  // Generated or preview order ID for UPI note
  const [previewOrderId] = useState(() => generateOrderId());
  const upiUri = generateUpiUri(upiId, upiName, total, previewOrderId);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    upiUri
  )}`;

  const handleCopyUpi = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate phone & pincode
    const cleanPhone = formData.phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      setErrorMsg('Please enter a valid 6-digit postal pincode.');
      return;
    }

    if (paymentMethod === 'upi' && !upiUtr.trim()) {
      setErrorMsg('Please enter your 12-digit UPI Transaction / UTR reference number after completing payment.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload: Order = {
        id: previewOrderId,
        customerName: formData.name.trim(),
        customerEmail: formData.email.trim(),
        customerPhone: cleanPhone,
        address: formData.address.trim(),
        pincode: formData.pincode.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        items: items.map((it) => ({
          productId: it.product.id,
          name: it.product.name,
          price: it.product.discountPrice || it.product.price,
          quantity: it.quantity,
          size: it.selectedSize,
          color: it.selectedColor,
          image: it.product.images[0],
        })),
        subtotal,
        discount,
        shipping,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === 'upi' ? 'pending_verification' : 'cod',
        upiUtr: paymentMethod === 'upi' ? upiUtr.trim() : undefined,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      await saveOrder(orderPayload);
      clearCart();
      router.push(`/order-success?orderId=${encodeURIComponent(orderPayload.id)}`);
    } catch (err) {
      console.error(err);
      setErrorMsg('Could not process your order. Please try again or order via WhatsApp.');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-zinc-950 flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md">
          <p className="text-sm text-zinc-400 mb-6">Your shopping bag is empty.</p>
          <Link
            href="/shop"
            className="px-6 py-3 rounded-full bg-gold-400 text-black font-semibold text-xs tracking-wider uppercase"
          >
            Explore Catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6 font-mono uppercase tracking-wider">
          <Link href="/cart" className="hover:text-gold-400">Cart</Link>
          <span>/</span>
          <span className="text-gold-400">Secure Checkout</span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight mb-8">
          CHECKOUT & DISPATCH
        </h1>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Delivery Address & Payment Selector (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Customer Information */}
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h2 className="font-display font-bold text-base text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gold-400 text-black text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <span>Delivery Address</span>
                </h2>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>256-bit Encrypted</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })
                    }
                    placeholder="10-digit mobile number"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="aarav@example.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                    Street Address, Flat / Building / Floor *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. Flat 402, Highline Sky Towers, 14th Main, Indiranagar"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                    6-Digit Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) =>
                      setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })
                    }
                    placeholder="e.g. 560038"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Bengaluru"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
                    State / Province *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g. Karnataka"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method Selector */}
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-5">
              <div className="pb-3 border-b border-zinc-800">
                <h2 className="font-display font-bold text-base text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gold-400 text-black text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <span>Select Payment Method (Free-Tier Stack)</span>
                </h2>
              </div>

              {/* Payment Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* UPI Option */}
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-gold-400 bg-gold-400/5 ring-1 ring-gold-400/30'
                      : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-gold-400" />
                      <span className="font-bold text-sm text-white">Instant UPI</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                      FASTEST
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Scan dynamic QR code or pay with GPay, PhonePe, Paytm, BHIM & enter 12-digit UTR.
                  </p>
                </div>

                {/* Cash on Delivery Option */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-gold-400 bg-gold-400/5 ring-1 ring-gold-400/30'
                      : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-5 h-5 text-gold-400" />
                      <span className="font-bold text-sm text-white">Cash on Delivery</span>
                    </div>
                    <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
                      COD
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Pay upon doorstep delivery via Cash or courier QR code.
                  </p>
                </div>
              </div>

              {/* UPI Detailed QR & Deep Link Section */}
              <AnimatePresence>
                {paymentMethod === 'upi' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {/* Dynamic QR Code */}
                      <div className="bg-white p-3 rounded-2xl shadow-xl shrink-0">
                        <img
                          src={qrCodeUrl}
                          alt="UPI QR Code"
                          className="w-40 h-40 object-contain"
                        />
                      </div>

                      {/* Instructions & Mobile Deep Link */}
                      <div className="space-y-3 flex-1 text-center sm:text-left">
                        <div>
                          <span className="text-[11px] font-mono text-gold-400 uppercase tracking-widest font-bold">
                            Amount to Pay: {formatPrice(total)}
                          </span>
                          <h4 className="font-display font-bold text-sm text-white mt-0.5">
                            Pay via Any UPI App
                          </h4>
                          <p className="text-xs text-zinc-400 mt-1">
                            Scan with Google Pay, PhonePe, Paytm, CRED or tap button below if on phone.
                          </p>
                        </div>

                        {/* UPI ID Copy bar */}
                        <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono">
                          <span className="text-zinc-300 truncate">{upiId}</span>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="flex items-center gap-1 text-[11px] text-gold-400 hover:text-gold-300 px-2 py-1 rounded"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>

                        {/* Mobile Deep Link */}
                        <a
                          href={upiUri}
                          className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs tracking-wider uppercase transition-colors"
                        >
                          <span>Open UPI App on Phone</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* UTR Number Input */}
                    <div className="pt-3 border-t border-zinc-800/80 space-y-2">
                      <label className="text-xs font-semibold text-zinc-200 block">
                        Enter 12-Digit UPI Transaction ID / UTR *
                      </label>
                      <input
                        type="text"
                        required
                        value={upiUtr}
                        onChange={(e) => setUpiUtr(e.target.value.replace(/\D/g, ''))}
                        maxLength={16}
                        placeholder="e.g. 429182740192"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-gold-400"
                      />
                      <p className="text-[11px] text-zinc-500">
                        Order status will be set to &quot;Payment pending verification&quot; until verified by merchant in admin panel.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Order Summary & Submit (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-5 sticky top-24">
              <h3 className="font-display font-bold text-base text-white">Order Summary</h3>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-zinc-800/80 pr-2">
                {items.map((it) => (
                  <div
                    key={`${it.product.id}-${it.selectedSize}-${it.selectedColor}`}
                    className="py-3 flex items-center gap-3 text-xs"
                  >
                    <img
                      src={it.product.images[0]}
                      alt={it.product.name}
                      className="w-12 h-14 object-cover rounded-lg border border-zinc-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{it.product.name}</p>
                      <p className="text-zinc-500">
                        Qty: {it.quantity} • {it.selectedSize}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-zinc-200 shrink-0">
                      {formatPrice((it.product.discountPrice || it.product.price) * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="space-y-2.5 pt-4 border-t border-zinc-800 text-xs text-zinc-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span className="font-mono">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-mono">
                    {shipping === 0 ? <strong className="text-emerald-400">FREE</strong> : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-zinc-800">
                  <span>Final Payable</span>
                  <span className="font-mono text-gold-400 text-xl">{formatPrice(total)}</span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gold-400 hover:bg-gold-300 text-black font-display font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-gold-500/10 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Direct Alternative: Place Order on WhatsApp */}
              <a
                href={getWhatsAppOrderUrl({
                  id: previewOrderId,
                  customerName: formData.name || 'Valued Customer',
                  customerEmail: formData.email,
                  customerPhone: formData.phone,
                  address: formData.address,
                  pincode: formData.pincode,
                  city: formData.city,
                  state: formData.state,
                  items: items.map((it) => ({
                    productId: it.product.id,
                    name: it.product.name,
                    price: it.product.discountPrice || it.product.price,
                    quantity: it.quantity,
                    size: it.selectedSize,
                    color: it.selectedColor,
                    image: it.product.images[0],
                  })),
                  subtotal,
                  discount,
                  shipping,
                  total,
                  paymentMethod,
                  paymentStatus: paymentMethod === 'upi' ? 'pending_verification' : 'cod',
                  status: 'pending',
                  createdAt: new Date().toISOString(),
                }, whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600/15 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Place Order Directly on WhatsApp</span>
              </a>

              <div className="text-center text-[11px] text-zinc-500 pt-1">
                🔒 Free tier stack • No third-party gateway commissions charged
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
