'use client';

import React, { useEffect } from 'react';
import { Product, Category, SiteSettings } from '@/lib/types';

export default function StoreSyncProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let isMounted = true;

    async function syncData() {
      try {
        // Fetch latest server store data with cache-buster
        const res = await fetch(`/api/sync?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        });

        if (!res.ok) return;
        const serverData = await res.json();

        if (!isMounted || !serverData) return;

        const localProductsRaw = localStorage.getItem('flexo_products_v2');
        const localCatsRaw = localStorage.getItem('flexo_categories_v2');
        const localSettingsRaw = localStorage.getItem('flexo_site_settings_v1');

        let shouldPushLocalToServer = false;
        let localProducts: Product[] | null = null;
        let localCats: Category[] | null = null;

        if (localProductsRaw) {
          try {
            localProducts = JSON.parse(localProductsRaw);
            // If local device (e.g. laptop) has custom products not yet saved on server
            if (
              Array.isArray(localProducts) &&
              localProducts.length > (serverData.products?.length || 0)
            ) {
              shouldPushLocalToServer = true;
            }
          } catch (_) {}
        }

        if (localCatsRaw) {
          try {
            localCats = JSON.parse(localCatsRaw);
            if (
              Array.isArray(localCats) &&
              localCats.length > (serverData.categories?.length || 0)
            ) {
              shouldPushLocalToServer = true;
            }
          } catch (_) {}
        }

        // If laptop has newer products that server doesn't have yet, push them to server
        if (shouldPushLocalToServer) {
          await fetch('/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              products: localProducts || serverData.products,
              categories: localCats || serverData.categories,
            }),
          });
        } else {
          // Otherwise, sync server data into this device's storage (e.g. Phone, Tablet, Visitors)
          let changed = false;

          if (serverData.products && Array.isArray(serverData.products)) {
            const serverProductsStr = JSON.stringify(serverData.products);
            if (localProductsRaw !== serverProductsStr) {
              localStorage.setItem('flexo_products_v2', serverProductsStr);
              window.dispatchEvent(new Event('products-updated'));
              changed = true;
            }
          }

          if (serverData.categories && Array.isArray(serverData.categories)) {
            const serverCatsStr = JSON.stringify(serverData.categories);
            if (localCatsRaw !== serverCatsStr) {
              localStorage.setItem('flexo_categories_v2', serverCatsStr);
              window.dispatchEvent(new Event('categories-updated'));
              changed = true;
            }
          }

          if (serverData.settings && typeof serverData.settings === 'object') {
            const serverSettingsStr = JSON.stringify(serverData.settings);
            if (localSettingsRaw !== serverSettingsStr) {
              localStorage.setItem('flexo_site_settings_v1', serverSettingsStr);
              window.dispatchEvent(new Event('site-settings-changed'));
              changed = true;
            }
          }
        }
      } catch (err) {
        // Silently continue if offline
      }
    }

    // Run on initial load
    syncData();

    // Re-sync when user returns to window/tab (e.g., switches apps on phone)
    const handleFocus = () => syncData();
    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') syncData();
    });

    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return <>{children}</>;
}
