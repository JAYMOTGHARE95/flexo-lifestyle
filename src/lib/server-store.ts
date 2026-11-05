import fs from 'fs';
import path from 'path';
import { Product, Category, SiteSettings } from './types';
import { SAMPLE_PRODUCTS, INITIAL_CATEGORIES } from './products-data';
import { DEFAULT_SITE_SETTINGS } from './site-settings';

export interface StoreData {
  products: Product[];
  categories: Category[];
  settings: SiteSettings;
  updatedAt: number;
}

const DEFAULT_DATA: StoreData = {
  products: SAMPLE_PRODUCTS,
  categories: INITIAL_CATEGORIES,
  settings: DEFAULT_SITE_SETTINGS,
  updatedAt: Date.now(),
};

// Memory cache in case filesystem is temporarily restricted
let memoryStoreCache: StoreData = { ...DEFAULT_DATA };

function getStoreFilePath(): string {
  const primaryDir = path.join(process.cwd(), 'data');
  try {
    if (!fs.existsSync(primaryDir)) {
      fs.mkdirSync(primaryDir, { recursive: true });
    }
    return path.join(primaryDir, 'store.json');
  } catch (_) {
    // Fallback to /tmp on serverless environments
    return path.join('/tmp', 'flexo-store.json');
  }
}

export function getServerStoreData(): StoreData {
  try {
    const filePath = getStoreFilePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.products) && Array.isArray(parsed.categories)) {
        memoryStoreCache = parsed;
        return parsed;
      }
    } else {
      // Create initial store.json if not present
      saveServerStoreData(DEFAULT_DATA);
      return DEFAULT_DATA;
    }
  } catch (err) {
    console.warn('Could not read store.json from disk, using memory cache:', err);
  }
  return memoryStoreCache;
}

export function saveServerStoreData(data: Partial<StoreData>): StoreData {
  const current = getServerStoreData();
  const merged: StoreData = {
    products: data.products || current.products || SAMPLE_PRODUCTS,
    categories: data.categories || current.categories || INITIAL_CATEGORIES,
    settings: data.settings || current.settings || DEFAULT_SITE_SETTINGS,
    updatedAt: Date.now(),
  };

  memoryStoreCache = merged;

  try {
    const filePath = getStoreFilePath();
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write store.json to disk, memory cache retained:', err);
    try {
      // Attempt fallback to /tmp
      fs.writeFileSync(path.join('/tmp', 'flexo-store.json'), JSON.stringify(merged, null, 2), 'utf-8');
    } catch (_) {}
  }

  return merged;
}
