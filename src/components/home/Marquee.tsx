import React from 'react';

const MARQUEE_ITEMS = [
  'WEAR IT • FLAUNT IT • FLEX IT',
  'NEW SEASON DROPS',
  'FREE EXPRESS SHIPPING OVER ₹999',
  'CASH ON DELIVERY AVAILABLE',
  'INSTANT UPI SCAN & PAY',
  '100% GENUINE LUXURY QUALITY',
  'JOIN WHATSAPP COMMUNITY',
  'WHATSAPP HELP AVAILABLE',
];

export default function Marquee() {
  return (
    <div className="relative w-full overflow-hidden bg-gold-400 py-3 text-black font-display font-black text-xs sm:text-sm tracking-widest uppercase border-y border-gold-300 select-none">
      <div className="flex w-max animate-marquee">
        {/* Loop twice for smooth infinite marquee */}
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, index) => (
          <div key={index} className="flex items-center mx-4 sm:mx-6 shrink-0">
            <span>{item}</span>
            <span className="inline-block w-2 h-2 rounded-full bg-black ml-4 sm:ml-6" />
          </div>
        ))}
      </div>
    </div>
  );
}
