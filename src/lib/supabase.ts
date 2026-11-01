import { createClient } from '@supabase/supabase-js';
import { SAMPLE_PRODUCTS, CATEGORIES } from './products-data';
import { Order, Product, Category } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project') &&
    supabaseUrl.startsWith('https://')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// In-memory / local storage cache for mock fallback when Supabase is not configured
let localOrdersCache: Order[] = [];
let localProductsCache: Product[] = [...SAMPLE_PRODUCTS];

// PRODUCT DATA ACCESSORS
export async function getProducts(options?: {
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
}): Promise<Product[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from('products').select('*').eq('is_active', true);

      if (options?.category && options.category !== 'all') {
        query = query.eq('category', options.category);
      }
      if (options?.featured) {
        query = query.eq('is_featured', true);
      }
      if (options?.minPrice !== undefined) {
        query = query.gte('price', options.minPrice);
      }
      if (options?.maxPrice !== undefined) {
        query = query.lte('price', options.maxPrice);
      }
      if (options?.sort) {
        if (options.sort === 'price-low') {
          query = query.order('discount_price', { ascending: true, nullsFirst: false });
        } else if (options.sort === 'price-high') {
          query = query.order('discount_price', { ascending: false });
        } else if (options.sort === 'rating') {
          query = query.order('rating', { ascending: false });
        } else {
          query = query.order('created_at', { ascending: false });
        }
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        // Map database snake_case to camelCase
        return data.map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          description: item.description,
          category: item.category,
          price: Number(item.price),
          discountPrice: item.discount_price ? Number(item.discount_price) : undefined,
          images: item.images || [],
          sizes: item.sizes || [],
          colors: item.colors || [],
          stock: item.stock,
          isFeatured: item.is_featured,
          isActive: item.is_active,
          rating: Number(item.rating) || 4.8,
          reviewCount: Number(item.review_count) || 20,
          highlights: item.highlights || [],
          specs: item.specs || {},
          createdAt: item.created_at,
        }));
      }
    } catch (err) {
      console.warn('Falling back to local product data:', err);
    }
  }

  // Fallback to local mock data
  let result = [...localProductsCache].filter((p) => p.isActive);

  if (options?.category && options.category !== 'all') {
    result = result.filter((p) => p.category === options.category);
  }
  if (options?.featured) {
    result = result.filter((p) => p.isFeatured);
  }
  if (options?.search) {
    const term = options.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );
  }
  if (options?.minPrice !== undefined) {
    result = result.filter((p) => (p.discountPrice || p.price) >= options.minPrice!);
  }
  if (options?.maxPrice !== undefined) {
    result = result.filter((p) => (p.discountPrice || p.price) <= options.maxPrice!);
  }

  if (options?.sort) {
    if (options.sort === 'price-low') {
      result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (options.sort === 'price-high') {
      result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (options.sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // default: new/featured
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  }

  return result;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          slug: data.slug,
          description: data.description,
          category: data.category,
          price: Number(data.price),
          discountPrice: data.discount_price ? Number(data.discount_price) : undefined,
          images: data.images || [],
          sizes: data.sizes || [],
          colors: data.colors || [],
          stock: data.stock,
          isFeatured: data.is_featured,
          isActive: data.is_active,
          rating: Number(data.rating) || 4.8,
          reviewCount: Number(data.review_count) || 24,
          highlights: data.highlights || [],
          specs: data.specs || {},
        };
      }
    } catch (err) {
      console.warn('Fallback getProductBySlug:', err);
    }
  }

  const found = localProductsCache.find((p) => p.slug === slug);
  return found || null;
}

export async function getCategories(): Promise<Category[]> {
  return CATEGORIES;
}

// ORDER DATA ACCESSORS
export async function saveOrder(order: Order): Promise<Order> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('orders').insert({
        id: order.id,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        customer_phone: order.customerPhone,
        address: order.address,
        pincode: order.pincode,
        city: order.city,
        state: order.state,
        items: order.items,
        subtotal: order.subtotal,
        discount: order.discount,
        shipping: order.shipping,
        total: order.total,
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus,
        upi_utr: order.upiUtr || null,
        status: order.status,
      }).select().single();

      if (!error && data) {
        return order;
      }
    } catch (err) {
      console.warn('Supabase saveOrder fallback:', err);
    }
  }

  // Fallback: store in local storage / memory
  localOrdersCache.unshift(order);
  if (typeof window !== 'undefined') {
    try {
      const existing = JSON.parse(localStorage.getItem('flexo_local_orders') || '[]');
      existing.unshift(order);
      localStorage.setItem('flexo_local_orders', JSON.stringify(existing));
    } catch (e) {
      console.error(e);
    }
  }
  return order;
}

export async function getOrderByIdAndPhone(orderId: string, phone: string): Promise<Order | null> {
  const cleanId = orderId.trim().toUpperCase();
  const cleanPhone = phone.trim().replace(/[^0-9]/g, '');

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', cleanId)
        .ilike('customer_phone', `%${cleanPhone.slice(-10)}%`)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          customerName: data.customer_name,
          customerEmail: data.customer_email,
          customerPhone: data.customer_phone,
          address: data.address,
          pincode: data.pincode,
          city: data.city,
          state: data.state,
          items: data.items,
          subtotal: Number(data.subtotal),
          discount: Number(data.discount),
          shipping: Number(data.shipping),
          total: Number(data.total),
          paymentMethod: data.payment_method,
          paymentStatus: data.payment_status,
          upiUtr: data.upi_utr,
          status: data.status,
          createdAt: data.created_at,
          trackingNumber: data.tracking_number,
        };
      }
    } catch (err) {
      console.warn('Supabase getOrder fallback:', err);
    }
  }

  // Search local orders
  let list = [...localOrdersCache];
  if (typeof window !== 'undefined') {
    try {
      const stored = JSON.parse(localStorage.getItem('flexo_local_orders') || '[]');
      list = [...stored, ...list];
    } catch (e) {
      // ignore
    }
  }

  const match = list.find(
    (o) =>
      o.id.toUpperCase() === cleanId &&
      (o.customerPhone.replace(/[^0-9]/g, '').endsWith(cleanPhone.slice(-10)) ||
        cleanPhone === '')
  );

  return match || null;
}

// ADMIN ACCESSORS
export async function getAllOrders(): Promise<Order[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((d) => ({
          id: d.id,
          customerName: d.customer_name,
          customerEmail: d.customer_email,
          customerPhone: d.customer_phone,
          address: d.address,
          pincode: d.pincode,
          city: d.city,
          state: d.state,
          items: d.items,
          subtotal: Number(d.subtotal),
          discount: Number(d.discount),
          shipping: Number(d.shipping),
          total: Number(d.total),
          paymentMethod: d.payment_method,
          paymentStatus: d.payment_status,
          upiUtr: d.upi_utr,
          status: d.status,
          createdAt: d.created_at,
          trackingNumber: d.tracking_number,
        }));
      }
    } catch (e) {
      console.warn('Supabase getAllOrders fallback:', e);
    }
  }

  let list = [...localOrdersCache];
  if (typeof window !== 'undefined') {
    try {
      const stored = JSON.parse(localStorage.getItem('flexo_local_orders') || '[]');
      list = [...stored, ...list];
    } catch (e) {}
  }
  // If empty, supply a couple realistic demo orders for the admin preview
  if (list.length === 0) {
    list = [
      {
        id: 'FLX-X821-4921',
        customerName: 'Aarav Sharma',
        customerEmail: 'aarav@example.com',
        customerPhone: '9876543210',
        address: 'B-402, Highline Sky Towers, Indiranagar',
        pincode: '560038',
        city: 'Bengaluru',
        state: 'Karnataka',
        items: [
          {
            productId: 'prod-1',
            name: 'Obsidian Heavyweight Oversized Hoodie',
            price: 3499,
            quantity: 1,
            size: 'L',
            color: 'Pitch Black',
            image: SAMPLE_PRODUCTS[0].images[0],
          },
        ],
        subtotal: 3499,
        discount: 0,
        shipping: 0,
        total: 3499,
        paymentMethod: 'upi',
        paymentStatus: 'pending_verification',
        upiUtr: '429182740192',
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'FLX-K930-1049',
        customerName: 'Rohan Verma',
        customerEmail: 'rohan.v@example.com',
        customerPhone: '9811223344',
        address: '14, Palm Grove Enclave, Bandra West',
        pincode: '400050',
        city: 'Mumbai',
        state: 'Maharashtra',
        items: [
          {
            productId: 'prod-2',
            name: 'Chronograph Eclipse Skeleton Watch',
            price: 12499,
            quantity: 1,
            size: '41mm Case',
            color: 'Matte Black / Rose Gold',
            image: SAMPLE_PRODUCTS[1].images[0],
          },
        ],
        subtotal: 12499,
        discount: 500,
        shipping: 0,
        total: 11999,
        paymentMethod: 'cod',
        paymentStatus: 'cod',
        status: 'confirmed',
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      },
    ];
  }
  return list;
}

export async function updateOrderStatus(
  orderId: string,
  status: Order['status'],
  paymentStatus?: Order['paymentStatus'],
  trackingNumber?: string
): Promise<boolean> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const payload: any = { status };
      if (paymentStatus) payload.payment_status = paymentStatus;
      if (trackingNumber) payload.tracking_number = trackingNumber;

      const { error } = await supabase
        .from('orders')
        .update(payload)
        .eq('id', orderId);

      return !error;
    } catch (e) {
      console.warn('updateOrderStatus fallback:', e);
    }
  }

  // Fallback update in local storage
  if (typeof window !== 'undefined') {
    try {
      const stored: Order[] = JSON.parse(localStorage.getItem('flexo_local_orders') || '[]');
      const updated = stored.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status,
            ...(paymentStatus ? { paymentStatus } : {}),
            ...(trackingNumber ? { trackingNumber } : {}),
          };
        }
        return o;
      });
      localStorage.setItem('flexo_local_orders', JSON.stringify(updated));
    } catch (e) {}
  }
  return true;
}
