import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Order } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateDiscountPercentage(original: number, discounted?: number): number {
  if (!discounted || discounted >= original) return 0;
  return Math.round(((original - discounted) / original) * 100);
}

export function generateOrderId(): string {
  const prefix = 'FLX';
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${timestamp}-${random}`;
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function getWhatsAppOrderUrl(order: Order, whatsappNumber: string = '919876543210'): string {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const itemsList = order.items
    .map(
      (item, i) =>
        `${i + 1}. *${item.name}* (Qty: ${item.quantity}, Size: ${item.size || 'N/A'}, Color: ${item.color || 'N/A'}) - ${formatPrice(item.price * item.quantity)}`
    )
    .join('\n');

  const text = `🛍️ *NEW ORDER ON ${process.env.NEXT_PUBLIC_BRAND_NAME || 'FLEXO LIFESTYLE'}*

*Order ID:* #${order.id}
*Customer:* ${order.customerName}
*Phone:* ${order.customerPhone}
*Delivery Address:*
${order.address}, ${order.city}, ${order.state} - ${order.pincode}

*Items Ordered:*
${itemsList}

*Subtotal:* ${formatPrice(order.subtotal)}
*Shipping:* ${order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}
*Total Amount:* *${formatPrice(order.total)}*

*Payment Method:* ${order.paymentMethod.toUpperCase()}
*Payment Status:* ${order.paymentStatus.replace('_', ' ').toUpperCase()}
${order.upiUtr ? `*UPI UTR / Ref:* ${order.upiUtr}\n` : ''}
Please confirm my order and share tracking updates. Thank you!`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

export function getWhatsAppProductUrl(productName: string, productUrl: string, whatsappNumber: string = '919876543210'): string {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const text = `Hello! I am interested in *${productName}* on ${process.env.NEXT_PUBLIC_BRAND_NAME || 'Flexo Lifestyle'}.
Product Link: ${productUrl}

Can you help me with availability, delivery time, or offers?`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
}

export function generateUpiUri(upiId: string, payeeName: string, amount: number, orderId: string): string {
  const cleanAmount = amount.toFixed(2);
  const note = `Order ${orderId}`;
  return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${encodeURIComponent(cleanAmount)}&cu=INR&tn=${encodeURIComponent(note)}`;
}
