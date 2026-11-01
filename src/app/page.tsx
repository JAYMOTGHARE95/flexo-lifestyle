import React from 'react';
import Hero from '@/components/home/Hero';
import Marquee from '@/components/home/Marquee';
import CategoryTiles from '@/components/home/CategoryTiles';
import DealsSection from '@/components/home/DealsSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BrandStory from '@/components/home/BrandStory';
import Testimonials from '@/components/home/Testimonials';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Marquee />
      <CategoryTiles />
      <DealsSection />
      <FeaturedProducts />
      <BrandStory />
      <Testimonials />
    </div>
  );
}
