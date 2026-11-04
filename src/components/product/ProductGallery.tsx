'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const currentImage = images[selectedIndex] || images[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Mobile Touch Swipe Handler
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      handlePrev();
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail Bar */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto scrollbar-none pb-2 md:pb-0 shrink-0">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-14 h-18 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                selectedIndex === idx
                  ? 'border-gold-400 ring-2 ring-gold-400/20 opacity-100'
                  : 'border-zinc-800 opacity-60 hover:opacity-100 hover:border-zinc-700'
              }`}
              aria-label={`View photo ${idx + 1}`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Stage */}
      <div className="relative flex-1 aspect-[4/5] rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl group touch-pan-y">
        <motion.div
          className="relative w-full h-full cursor-zoom-in overflow-hidden select-none"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={selectedIndex}
              src={currentImage}
              alt={productName}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className={`w-full h-full object-cover pointer-events-none transition-transform duration-200 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    }
                  : undefined
              }
            />
          </AnimatePresence>
        </motion.div>

        {/* Desktop Hover Hint */}
        <div className="absolute bottom-4 right-4 bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-800 text-[11px] text-zinc-300 hidden md:flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <ZoomIn className="w-3.5 h-3.5 text-gold-400" />
          <span>Hover to Zoom</span>
        </div>

        {/* Mobile Photo Count Pill & Indicator Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 pointer-events-none md:hidden">
            <div className="bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-zinc-200 border border-zinc-800">
              {selectedIndex + 1} / {images.length}
            </div>
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1.5 rounded-full">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`block rounded-full transition-all ${
                    selectedIndex === i
                      ? 'w-3 h-1.5 bg-gold-400'
                      : 'w-1.5 h-1.5 bg-zinc-600'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mobile Next/Prev Arrows */}
        {images.length > 1 && (
          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none md:hidden">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white pointer-events-auto active:scale-90 transition-transform"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white pointer-events-auto active:scale-90 transition-transform"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
