'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Users, QrCode, ArrowUpRight, Sparkles } from 'lucide-react';
import { getSiteSettings } from '@/lib/site-settings';
import { SiteSettings } from '@/lib/types';

export default function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'group' | 'qr'>('chat');
  const [settings, setSettings] = useState<SiteSettings>(getSiteSettings());

  useEffect(() => {
    const handleUpdate = () => setSettings(getSiteSettings());
    window.addEventListener('site-settings-changed', handleUpdate);
    return () => window.removeEventListener('site-settings-changed', handleUpdate);
  }, []);

  const brandName = settings.brandName || 'FLEXO LIFESTYLE';
  const whatsappNumber = settings.whatsappNumber || '919876543210';
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

  const quickMessages = [
    { label: '📦 Track my order', text: 'Hi, I would like to track my order.' },
    { label: '🏷️ Today’s best offers', text: `Hi! What are the active promo codes for ${brandName}?` },
    { label: '🛍️ Help placing an order', text: 'Hi, I need help selecting the right size and ordering.' },
    { label: '💳 Pay via UPI / COD info', text: 'Hi, can you explain how UPI verification or Cash on Delivery works?' },
  ];

  const handleSend = (text: string) => {
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-40">
      {/* Popover Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="mb-4 w-80 sm:w-88 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                  FL
                </div>
                <div>
                  <h4 className="font-semibold text-sm leading-none">{brandName} WhatsApp</h4>
                  <p className="text-[11px] text-emerald-100 flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    WhatsApp Help • Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg"
                aria-label="Close WhatsApp chat card"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-tabs: Chat / Group / QR Code */}
            <div className="grid grid-cols-3 bg-zinc-950 p-1 border-b border-zinc-800 text-[11px] font-semibold text-zinc-400">
              <button
                onClick={() => setActiveTab('chat')}
                className={`py-2 rounded-xl transition-colors flex items-center justify-center gap-1 ${
                  activeTab === 'chat' ? 'bg-zinc-800 text-white font-bold' : 'hover:text-zinc-200'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>
              <button
                onClick={() => setActiveTab('group')}
                className={`py-2 rounded-xl transition-colors flex items-center justify-center gap-1 ${
                  activeTab === 'group' ? 'bg-zinc-800 text-emerald-400 font-bold' : 'hover:text-zinc-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Community</span>
              </button>
              <button
                onClick={() => setActiveTab('qr')}
                className={`py-2 rounded-xl transition-colors flex items-center justify-center gap-1 ${
                  activeTab === 'qr' ? 'bg-zinc-800 text-gold-400 font-bold' : 'hover:text-zinc-200'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Scan QR</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-4 bg-zinc-950/90 text-xs">
              {activeTab === 'chat' && (
                <div className="space-y-3">
                  <p className="text-zinc-300 leading-relaxed bg-zinc-900 p-3 rounded-2xl border border-zinc-800/80 text-xs">
                    👋 Welcome! How can our WhatsApp Help team assist you today?
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <p className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                      Quick Questions
                    </p>
                    {quickMessages.map((msg, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(msg.text)}
                        className="w-full text-left text-xs text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-emerald-500/40 px-3 py-2 rounded-xl transition-colors flex items-center justify-between"
                      >
                        <span>{msg.label}</span>
                        <span className="text-[10px] text-emerald-400">Send &rarr;</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => handleSend(`Hi ${brandName}, I need WhatsApp help with an order.`)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-lg"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Help Chat</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'group' && (
                <div className="space-y-3 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-sm text-white">
                      Join WhatsApp Community
                    </h5>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Stay connected for new drops, product updates, restock alerts, and exclusive announcements.
                    </p>
                  </div>

                  <div className="pt-2">
                    {settings.whatsappGroupLink ? (
                      <a
                        href={settings.whatsappGroupLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
                      >
                        <span>Join WhatsApp Community Now</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    ) : (
                      <button
                        onClick={() => handleSend('Hi, please send me the invite link to join your WhatsApp community.')}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <span>Request Community Invite Link</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'qr' && (
                <div className="space-y-3 text-center">
                  <div>
                    <h5 className="font-display font-bold text-sm text-white">
                      Scan WhatsApp QR Code
                    </h5>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Open your phone camera or WhatsApp &rarr; Linked Devices &rarr; Scan
                    </p>
                  </div>

                  <div className="w-48 h-48 rounded-2xl bg-white p-3 mx-auto flex items-center justify-center shadow-xl border border-zinc-700">
                    {settings.whatsappQrCodeUrl ? (
                      <img
                        src={settings.whatsappQrCodeUrl}
                        alt={`${brandName} WhatsApp QR Code`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-zinc-500 text-xs">
                        QR Code not configured
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-zinc-500 font-mono">
                    Instant connect with {brandName}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 text-white shadow-2xl hover:bg-emerald-500 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
        aria-label="Open WhatsApp Customer Care & Community"
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
