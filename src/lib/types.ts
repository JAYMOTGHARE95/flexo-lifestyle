export type CategorySlug = 'clothing' | 'watches' | 'shoes' | 'accessories' | 'lifestyle';

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug;
  description: string;
  image: string;
  itemCount?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: CategorySlug;
  price: number;
  discountPrice?: number;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  highlights?: string[];
  specs?: Record<string, string>;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'upi';
export type PaymentStatus = 'pending_verification' | 'verified' | 'failed' | 'cod';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  upiUtr?: string;
  status: OrderStatus;
  createdAt: string;
  trackingNumber?: string;
  notes?: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}
