'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false);
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'FLEXO LIFESTYLE';
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

  const quickMessages = [
    { label: '📦 Track my order', text: 'Hi, I would like to track my order.' },
    { label: '🏷️ Today’s best offers', text: 'Hi! What are the best offers and coupons running today?' },
    { label: '🛍️ Help placing an order', text: 'Hi, I need help ordering a product on your store.' },
    { label: '💳 Pay via UPI / COD info', text: 'Hi, can you explain how UPI verification or COD works?' },
  ];

  const handleSend = (text: string) => {
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Popover Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="mb-4 w-72 sm:w-80 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                  FL
                </div>
                <div>
                  <h4 className="font-semibold text-sm leading-none">{brandName} Support</h4>
                  <p className="text-[11px] text-emerald-100 flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    Online • Typically replies in 5 min
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded"
                aria-label="Close WhatsApp chat card"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3 bg-zinc-950/80">
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                👋 Hello! Welcome to {brandName}. How can our styling & concierge team assist you today?
              </p>

              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                  Quick Actions
                </p>
                {quickMessages.map((msg, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(msg.text)}
                    className="w-full text-left text-xs text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 hover:border-emerald-500/40 px-3 py-2 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>{msg.label}</span>
                    <span className="text-[10px] text-emerald-400">Send &rarr;</span>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleSend('Hi Flexo Lifestyle, I have an inquiry.')}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Start Live WhatsApp Chat</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button with Ping Effect */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 text-white shadow-xl hover:bg-emerald-500 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
        aria-label="Open WhatsApp Customer Care"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-zinc-950" />
        </span>
        <MessageCircle className="w-7 h-7" />
      </motion.button>
    </div>
  );
}
