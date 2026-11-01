import React from 'react';

export default function TermsPage() {
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'FLEXO LIFESTYLE';

  return (
    <div className="bg-zinc-950 min-h-screen py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400 font-bold">
            Legal Terms
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            TERMS OF SERVICE
          </h1>
          <p className="text-xs text-zinc-500">Effective as of November 2026</p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-6">
          <section className="space-y-2">
            <h2 className="font-display font-bold text-base text-white">1. Agreement to Terms</h2>
            <p>
              By accessing {brandName} or placing an order, you agree to comply with and be bound by these Terms of Service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-base text-white">2. Product Descriptions & Stock</h2>
            <p>
              We endeavor to accurately display garment specifications, horology calibers, and product colors. Hand-finished leather and acid-washed cotton garments may exhibit subtle, natural variations inherent to bespoke artisanal manufacturing.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-base text-white">3. Pricing & Order Confirmation</h2>
            <p>
              All listed prices are denominated in Indian Rupees (INR) and are inclusive of applicable goods and services taxes. For UPI payments, orders remain &quot;Payment pending verification&quot; until payment receipt is validated by the merchant against the 12-digit UTR reference number.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-base text-white">4. Governing Law</h2>
            <p>
              These Terms and any non-contractual obligations arising out of or in connection with them shall be governed by and construed in accordance with the laws of India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
