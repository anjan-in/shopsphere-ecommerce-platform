import React from 'react';

export default function ProductSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border bg-white p-4 shadow-sm">
      <div className="aspect-square w-full rounded-md bg-slate-200" />
      <div className="mt-4 h-4 w-1/3 rounded bg-slate-200" />
      <div className="mt-2 h-5 w-3/4 rounded bg-slate-200" />
      <div className="mt-2 h-4 w-1/4 rounded bg-slate-200" />
      <div className="mt-4 h-6 w-1/2 rounded bg-slate-200" />
    </div>
  );
}