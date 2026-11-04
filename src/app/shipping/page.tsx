import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Clock, MessageCircle } from 'lucide-react';

export default function ShippingPage() {
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'FLEXO LIFESTYLE';
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';

  return (
    <div className="bg-zinc-950 min-h-screen py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400 font-bold">
            Customer Assurance
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            SHIPPING & DELIVERY INFORMATION
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Clear, transparent logistics and express courier dispatch across India.
          </p>
        </div>

        {/* 4 Feature Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center">
            <Truck className="w-6 h-6 text-gold-400 mx-auto mb-2" />
            <span className="font-bold text-xs text-white block">Free Shipping</span>
            <span className="text-[11px] text-zinc-500">Orders above ₹999</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center">
            <Clock className="w-6 h-6 text-gold-400 mx-auto mb-2" />
            <span className="font-bold text-xs text-white block">2-4 Days</span>
            <span className="text-[11px] text-zinc-500">Express air courier</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center">
            <MessageCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <span className="font-bold text-xs text-white block">WhatsApp Help</span>
            <span className="text-[11px] text-zinc-500">Instant assistance</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center">
            <ShieldCheck className="w-6 h-6 text-gold-400 mx-auto mb-2" />
            <span className="font-bold text-xs text-white block">Cash on Delivery</span>
            <span className="text-[11px] text-zinc-500">Available pan-India</span>
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed divide-y divide-zinc-800/80">
          <div className="space-y-3 pt-6">
            <h2 className="font-display font-bold text-lg text-white">1. Dispatch & Delivery Timelines</h2>
            <p>
              All orders placed before 2:00 PM IST on business days are dispatched within 24 hours from our fulfillment hubs in Bengaluru and Mumbai.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>Metro Cities (Delhi NCR, Mumbai, Bengaluru, Chennai, Kolkata, Hyderabad): 2 to 3 Business Days</li>
              <li>Tier 2 & Tier 3 Cities: 3 to 5 Business Days</li>
              <li>Northeast & Remote Regions: 5 to 7 Business Days</li>
            </ul>
          </div>

          <div className="space-y-3 pt-6">
            <h2 className="font-display font-bold text-lg text-white">2. WhatsApp Help & Order Verification</h2>
            <p>
              Have a question about your shipment or want real-time dispatch updates? Our team provides dedicated WhatsApp Help for every order.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>Message us anytime on WhatsApp for live parcel updates.</li>
              <li>Receive instant dispatch tracking links via SMS and WhatsApp.</li>
              <li>Priority support for address changes before dispatch.</li>
            </ul>
            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hi%20${encodeURIComponent(brandName)}%2C%20I%20have%20a%20question%20about%20shipping`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-600 hover:text-white transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Contact WhatsApp Help</span>
              </a>
            </div>
          </div>

          <div className="space-y-3 pt-6">
            <h2 className="font-display font-bold text-lg text-white">3. Payment Methods & Verification</h2>
            <p>
              We offer two zero-fee payment methods on our direct-to-consumer store:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li><strong>Instant UPI:</strong> Scan our dynamic QR code or pay via Google Pay, PhonePe, Paytm, BHIM, or CRED. After entering your 12-digit UTR, our team verifies and prioritizes your order for same-day dispatch.</li>
              <li><strong>Cash on Delivery (COD):</strong> Pay in cash or through the courier delivery agent&apos;s scanner when the parcel arrives at your address.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
