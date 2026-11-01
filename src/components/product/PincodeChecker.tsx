'use client';

import React, { useState } from 'react';
import { MapPin, CheckCircle2, Truck, ShieldCheck, AlertCircle } from 'lucide-react';

export default function PincodeChecker() {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState<{
    valid: boolean;
    deliveryDate?: string;
    city?: string;
    message?: string;
  } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pincode.trim();

    if (!/^\d{6}$/.test(clean)) {
      setResult({
        valid: false,
        message: 'Please enter a valid 6-digit Indian pincode.',
      });
      return;
    }

    setIsChecking(true);
    // Simulate real-time logistics lookup
    setTimeout(() => {
      setIsChecking(false);
      // Calculate realistic delivery date: 3 to 4 days from today
      const today = new Date();
      const delivery = new Date(today);
      delivery.setDate(today.getDate() + 3);

      const formattedDate = delivery.toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      setResult({
        valid: true,
        deliveryDate: formattedDate,
        message: 'Delivery Available',
      });
    }, 400);
  };

  return (
    <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
        <MapPin className="w-4 h-4 text-gold-400" />
        <span>Delivery & Service Availability (Flipkart Check)</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter 6-digit Pincode (e.g. 110001)"
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400 font-mono"
        />
        <button
          type="submit"
          disabled={isChecking || pincode.length < 6}
          className="px-4 py-2 bg-zinc-800 hover:bg-gold-400 hover:text-black text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          {isChecking ? 'Checking...' : 'Check'}
        </button>
      </form>

      {/* Results Box */}
      {result && (
        <div className="pt-2 text-xs border-t border-zinc-800/80">
          {result.valid ? (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Express Delivery to {pincode} by <strong>{result.deliveryDate}</strong></span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-zinc-400 text-[11px] pt-1">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Free Shipping on ₹999+</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Cash on Delivery Available</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-rose-400 font-medium">
              <AlertCircle className="w-4 h-4" />
              <span>{result.message}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
