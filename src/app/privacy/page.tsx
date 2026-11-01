import React from 'react';

export default function PrivacyPolicyPage() {
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'FLEXO LIFESTYLE';

  return (
    <div className="bg-zinc-950 min-h-screen py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400 font-bold">
            Legal Transparency
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            PRIVACY POLICY
          </h1>
          <p className="text-xs text-zinc-500">Last updated: November 2026</p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-6">
          <section className="space-y-2">
            <h2 className="font-display font-bold text-base text-white">1. Information We Collect</h2>
            <p>
              When you purchase an item or create an order on {brandName}, we collect the personal information you provide: your name, phone number, email address, and physical shipping address. This data is strictly utilized for processing delivery and providing real-time shipment updates.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-base text-white">2. Payment Security</h2>
            <p>
              We operate exclusively on secure peer-to-peer UPI and Cash on Delivery protocols. We never store credit/debit card numbers, CVVs, or bank account credentials on our servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-base text-white">3. Zero Data Resale</h2>
            <p>
              We do not sell, rent, or trade your personal data to any external advertising aggregators. Your information is shared only with verified logistics and delivery partners (e.g. BlueDart, Delhivery, Xpressbees) to ensure successful delivery.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display font-bold text-base text-white">4. Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal records at any time by contacting our privacy compliance team at support@flexolifestyle.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
