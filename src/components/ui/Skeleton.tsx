import React from 'react';

export function ProductSkeleton() {
  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden p-0 animate-pulse">
      <div className="aspect-[3/4] bg-zinc-900" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-zinc-800 rounded" />
          <div className="h-3 w-10 bg-zinc-800 rounded" />
        </div>
        <div className="h-4 w-3/4 bg-zinc-800 rounded" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 w-20 bg-zinc-800 rounded" />
          <div className="h-8 w-8 bg-zinc-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
