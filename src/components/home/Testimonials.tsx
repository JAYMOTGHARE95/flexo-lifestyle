'use client';

import React, { useState } from 'react';
import { Star, ShieldCheck, CheckCircle2, Send, MessageCircle } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Kabir Singhania',
    city: 'Mumbai',
    rating: 5,
    title: 'Hoodie quality blew my mind',
    text: 'Honestly rivaling luxury streetwear brands priced 5x higher. The 500 GSM terry has substantial drape and the double layer hood holds shape flawlessly.',
    product: 'Obsidian Heavyweight Hoodie',
  },
  {
    name: 'Vikramaditya Roy',
    city: 'Bengaluru',
    rating: 5,
    title: 'Watch gets compliments everywhere',
    text: 'The open-heart skeleton mechanism is hypnotic. Fast delivery within 3 days to Bangalore, and the UPI verification was confirmed in under 10 minutes.',
    product: 'Eclipse Skeleton Watch',
  },
  {
    name: 'Ananya Mehra',
    city: 'New Delhi',
    rating: 5,
    title: 'Top tier packaging and fit',
    text: 'Ordered the leather chunky sneakers and sunglasses. The unboxing experience felt like a boutique in Milan. Customer service on WhatsApp was super responsive.',
    product: 'Monolith Leather Sneaker',
  },
];

export default function Testimonials() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <section className="py-24 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-widest text-gold-400 font-semibold mb-2">
            Verified Community
          </p>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            PRAISE FROM DISCERNING PATRONS
          </h2>
          <div className="flex items-center justify-center gap-1.5 mt-3 text-gold-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
            <span className="text-xs font-semibold text-zinc-300 ml-2">
              4.9/5 Average Rating across 1,800+ Orders
            </span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {REVIEWS.map((rev, index) => (
            <div
              key={index}
              className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col justify-between hover:border-zinc-700 transition-all duration-300 shadow-xl"
            >
              <div>
                <div className="flex items-center gap-1 text-gold-400 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <h3 className="font-display font-bold text-base text-white mb-2">
                  &ldquo;{rev.title}&rdquo;
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {rev.text}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">{rev.name}</h4>
                  <p className="text-[11px] text-zinc-500">{rev.city}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Buyer</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter & WhatsApp VIP Drop Signup */}
        <div className="relative rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-850 border border-gold-500/30 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-gold-400/10 text-gold-400 border border-gold-400/20 text-[10px] font-mono uppercase tracking-widest font-bold">
              VIP ACCESS
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              NEVER MISS A LIMITED RUN RELEASE
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Join the private circle. Receive private drop notifications, secret coupon codes, and priority concierge access directly on your phone or inbox.
            </p>

            <form onSubmit={handleSubscribe} className="max-w-md mx-auto pt-4 flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-full px-5 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400 transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-gold-400 hover:bg-gold-300 text-black font-display font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                {subscribed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <span>Join VIP</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Direct WhatsApp VIP option */}
            <div className="pt-3">
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hi%20Flexo%2C%20please%20add%20me%20to%20the%20VIP%20drop%20broadcast`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Or join our WhatsApp VIP broadcast club &rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
