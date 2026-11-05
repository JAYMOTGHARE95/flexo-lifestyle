import { SiteSettings } from './types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandName: process.env.NEXT_PUBLIC_BRAND_NAME || 'FLEXO LIFESTYLE',
  tagline: process.env.NEXT_PUBLIC_BRAND_TAGLINE || 'Wear it. Flaunt it. Flex it.',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210',
  whatsappGroupLink: 'https://chat.whatsapp.com/invite/flexolifestyle',
  whatsappQrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https%3A%2F%2Fwa.me%2F919876543210',
  upiId: process.env.NEXT_PUBLIC_UPI_ID || 'flexo@upi',
  upiName: process.env.NEXT_PUBLIC_UPI_NAME || 'Flexo Lifestyle',
  announcementText: '⚡ Launch Special: Flat 10% OFF with code',
  announcementCoupon: 'FLEXO10',
  freeShippingThreshold: 999,
};

const SETTINGS_STORAGE_KEY = 'flexo_site_settings_v1';

export function getSiteSettings(): SiteSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SITE_SETTINGS;
  }
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to parse site settings from storage', e);
  }
  return DEFAULT_SITE_SETTINGS;
}

export function updateSiteSettings(updated: Partial<SiteSettings>): SiteSettings {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_SITE_SETTINGS, ...updated };
  }
  try {
    const current = getSiteSettings();
    const merged = { ...current, ...updated };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new Event('site-settings-changed'));

    // Persist to server so updates are visible across all phones, tablets, and computers
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: merged }),
    }).catch((err) => console.warn('Server sync error for settings:', err));

    return merged;
  } catch (e) {
    console.error('Failed to update site settings', e);
    return DEFAULT_SITE_SETTINGS;
  }
}
