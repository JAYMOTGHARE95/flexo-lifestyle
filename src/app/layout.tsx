import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import WhatsAppFloat from '@/components/layout/WhatsAppFloat';
import StoreSyncProvider from '@/components/providers/StoreSyncProvider';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#09090b',
};

const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'FLEXO LIFESTYLE';
const brandTagline = process.env.NEXT_PUBLIC_BRAND_TAGLINE || 'Wear it. Flaunt it. Flex it.';

export const metadata: Metadata = {
  title: {
    default: `${brandName} | Luxury Fashion, Watches & Lifestyle`,
    template: `%s | ${brandName}`,
  },
  description: brandTagline,
  keywords: [
    'luxury streetwear',
    'automatic watches',
    'minimalist fashion',
    'leather shoes',
    'lifestyle goods',
    'online fashion india',
    'cash on delivery',
    'upi payment fashion',
  ],
  authors: [{ name: brandName }],
  creator: brandName,
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://flexolifestyle.vercel.app',
    title: `${brandName} | Premium Fashion & Lifestyle`,
    description: brandTagline,
    siteName: brandName,
  },
  twitter: {
    card: 'summary_large_image',
    title: brandName,
    description: brandTagline,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-gold-400 selection:text-black">
        <StoreSyncProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <WhatsAppFloat />
          </CartProvider>
        </StoreSyncProvider>
      </body>
    </html>
  );
}
