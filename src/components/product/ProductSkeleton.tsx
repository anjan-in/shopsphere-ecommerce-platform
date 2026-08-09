// import React from 'react';

export default function ProductSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/60 bg-white p-3 shadow-soft-xs space-y-3 animate-pulse">
      <div className="aspect-square w-full rounded-xl bg-slate-200/70" />
      <div className="space-y-2 px-1">
        <div className="flex justify-between">
          <div className="h-3 w-16 rounded bg-slate-200/70" />
          <div className="h-3 w-10 rounded bg-slate-200/70" />
        </div>
        <div className="h-4 w-full rounded bg-slate-200/70" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 w-12 rounded bg-slate-200/70" />
          <div className="h-8 w-8 rounded-lg bg-slate-200/70" />
        </div>
      </div>
    </div>
  );
}