'use client';

import { useEffect, useRef } from 'react';

export function VideoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 h-full">
      {/* This is a placeholder - we'll implement actual video streams later */}
      <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
        <span className="text-2xl font-bold">You</span>
      </div>
    </div>
  );
} 