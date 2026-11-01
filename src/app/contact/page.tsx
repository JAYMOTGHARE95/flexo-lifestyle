'use client';

import React, { useState } from 'react';
import { MessageCircle, Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'FLEXO LIFESTYLE';
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
  const cleanNumber = whatsappNumber.replace(/\D/g, '');

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="bg-zinc-950 min-h-screen py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400 font-bold">
            Concierge & Support
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            CONNECT WITH US
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Have a question regarding custom orders, sizing guidance, UPI verification, or courier tracking? Our team is at your disposal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Contact Details & Direct WhatsApp (5 Cols) */}
          <div className="md:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-6">
              <h3 className="font-display font-bold text-lg text-white">Direct Channels</h3>

              <div className="space-y-4 text-xs">
                <a
                  href={`https://wa.me/${cleanNumber}?text=Hi%20${encodeURIComponent(brandName)}%2C%20I%20need%20assistance`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-emerald-600/15 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all group"
                >
                  <MessageCircle className="w-6 h-6 shrink-0" />
                  <div>
                    <span className="font-bold block text-sm">Instant WhatsApp Chat</span>
                    <span className="text-[11px] opacity-80">Replies typically in &lt; 5 mins</span>
                  </div>
                </a>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gold-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Email Support</span>
                    <span className="text-zinc-400">support@flexolifestyle.com</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gold-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Customer Helpline</span>
                    <span className="text-zinc-400">+91 {whatsappNumber.slice(-10)} (Mon-Sat 10AM-8PM)</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gold-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Atelier Logistics</span>
                    <span className="text-zinc-400">Bengaluru & Mumbai Hubs, India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Message Form (7 Cols) */}
          <div className="md:col-span-7">
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <h3 className="font-display font-bold text-lg text-white mb-2">Send an Inquiry</h3>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Aarav Sharma"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="aarav@example.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Subject *</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Order Inquiry / Custom Sizing"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your message here..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-black font-display font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                {submitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                    <span>Inquiry Received! We will reply soon.</span>
                  </>
                ) : (
                  <>
                    <span>Submit Message</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
