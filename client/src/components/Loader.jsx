import React from 'react';

export default function Loader() {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <div className="text-slate-600">Loading…</div>
    </div>
  );
}
