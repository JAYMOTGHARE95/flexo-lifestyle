'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  QrCode, 
  Users, 
  Check, 
  Upload, 
  Sparkles, 
  ExternalLink,
  CreditCard,
  Save,
  Tag,
  Truck
} from 'lucide-react';
import { getSiteSettings, updateSiteSettings } from '@/lib/site-settings';
import { SiteSettings } from '@/lib/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(getSiteSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [qrUploadPreview, setQrUploadPreview] = useState<string>('');

  useEffect(() => {
    setSettings(getSiteSettings());
  }, []);

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setQrUploadPreview(base64);
        setSettings((prev) => ({ ...prev, whatsappQrCodeUrl: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateQrFromNumber = () => {
    const cleanNum = (settings.whatsappNumber || '').replace(/[^0-9]/g, '');
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=https%3A%2F%2Fwa.me%2F${cleanNum}`;
    setSettings((prev) => ({ ...prev, whatsappQrCodeUrl: qrUrl }));
    setQrUploadPreview(qrUrl);
  };

  const handleGenerateQrFromGroup = () => {
    if (!settings.whatsappGroupLink) {
      alert('Please enter your WhatsApp Group Invite Link first.');
      return;
    }
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(settings.whatsappGroupLink)}`;
    setSettings((prev) => ({ ...prev, whatsappQrCodeUrl: qrUrl }));
    setQrUploadPreview(qrUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-800 gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-gold-400 font-bold">
            Owner Controls & Integration
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            WHATSAPP, QR & STORE SETTINGS
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage your custom WhatsApp QR code, community group invite link, UPI details, and live storefront banners.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold animate-fade-in">
            <Check className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* WhatsApp & Community Section */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">WhatsApp Integration & Community</h2>
              <p className="text-xs text-zinc-400">Configure your personal number, community group invite link, and custom QR code for customer scanning.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* WhatsApp Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Owner WhatsApp Number (with country code, no + or spaces) *
              </label>
              <input
                type="text"
                required
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="e.g. 919876543210"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-gold-400 focus:outline-none"
              />
              <p className="text-[11px] text-zinc-500">
                Used for instant checkout notifications, direct concierge chats, and order verification.
              </p>
            </div>

            {/* WhatsApp Group Invite Link */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Group / Community Link</span>
              </label>
              <input
                type="url"
                value={settings.whatsappGroupLink}
                onChange={(e) => setSettings({ ...settings, whatsappGroupLink: e.target.value })}
                placeholder="https://chat.whatsapp.com/invite/..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-gold-400 focus:outline-none"
              />
              <p className="text-[11px] text-zinc-500">
                Customers can click &quot;Join WhatsApp Community&quot; to join your WhatsApp drops group directly.
              </p>
            </div>
          </div>

          {/* WhatsApp QR Code Manager */}
          <div className="pt-4 border-t border-zinc-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-white flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-gold-400" />
                  <span>WhatsApp QR Code (Scan to Chat or Join Group)</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Provide an image URL, upload your own QR image, or auto-generate one.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-2 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    QR Code Image URL or CDN link
                  </label>
                  <input
                    type="text"
                    value={settings.whatsappQrCodeUrl}
                    onChange={(e) => {
                      setSettings({ ...settings, whatsappQrCodeUrl: e.target.value });
                      setQrUploadPreview(e.target.value);
                    }}
                    placeholder="https://... or data:image/..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-gold-400 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white border border-zinc-700 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-gold-400" />
                    <span>Upload QR Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleGenerateQrFromNumber}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Generate from Phone Number</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateQrFromGroup}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gold-400/10 hover:bg-gold-400/20 text-gold-400 border border-gold-400/30 text-xs font-semibold transition-colors"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Auto-Generate from Group Link</span>
                  </button>
                </div>
              </div>

              {/* QR Code Live Preview Card */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col items-center text-center space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                  Customer View Preview
                </span>
                <div className="w-44 h-44 rounded-xl bg-white p-2.5 flex items-center justify-center shadow-lg border border-zinc-700">
                  {settings.whatsappQrCodeUrl ? (
                    <img
                      src={settings.whatsappQrCodeUrl}
                      alt="WhatsApp QR Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-zinc-400 text-xs flex flex-col items-center">
                      <QrCode className="w-8 h-8 text-zinc-400 mb-1" />
                      <span>No QR code set</span>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-zinc-500">
                  Customers scan this in the floating widget or checkout.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* UPI Payments & Billing Section */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
            <div className="w-10 h-10 rounded-2xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">UPI & Payment Settings</h2>
              <p className="text-xs text-zinc-400">Configure your personal or business UPI ID for instant customer payments.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                UPI ID (Virtual Payment Address) *
              </label>
              <input
                type="text"
                required
                value={settings.upiId}
                onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                placeholder="yourname@okhdfcbank or merchant@upi"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-gold-400 focus:outline-none"
              />
              <p className="text-[11px] text-zinc-500">
                Used to construct `upi://pay` deep-links for Google Pay, PhonePe, Paytm and instant QR codes.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Payee / Beneficiary Name *
              </label>
              <input
                type="text"
                required
                value={settings.upiName}
                onChange={(e) => setSettings({ ...settings, upiName: e.target.value })}
                placeholder="Flexo Lifestyle"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-gold-400 focus:outline-none"
              />
              <p className="text-[11px] text-zinc-500">
                Shown to customers as the recipient name on their UPI app screen.
              </p>
            </div>
          </div>
        </div>

        {/* Storefront Branding & Announcement Bar */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">Storefront Banners & Promotions</h2>
              <p className="text-xs text-zinc-400">Customise announcement messages, discount vouchers, and brand taglines.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Brand Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                placeholder="Wear it. Flaunt it. Flex it."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-gold-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-gold-400" />
                <span>Free Express Shipping Threshold (₹)</span>
              </label>
              <input
                type="number"
                min={0}
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) || 0 })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-gold-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Top Announcement Banner Text</label>
              <input
                type="text"
                value={settings.announcementText}
                onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                placeholder="⚡ Launch Special: Flat 10% OFF with code"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-gold-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Coupon Code Highlight</label>
              <input
                type="text"
                value={settings.announcementCoupon}
                onChange={(e) => setSettings({ ...settings, announcementCoupon: e.target.value.toUpperCase() })}
                placeholder="FLEXO10"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-gold-400 font-mono font-bold focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-800">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-gold-400 hover:bg-gold-300 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
