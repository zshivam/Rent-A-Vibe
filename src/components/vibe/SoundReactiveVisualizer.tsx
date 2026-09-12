'use client';

import React from 'react';

interface SoundReactiveVisualizerProps {
  barCount?: number;
  className?: string;
}

export function SoundReactiveVisualizer({ barCount = 14, className = '' }: SoundReactiveVisualizerProps) {
  const bars = Array.from({ length: barCount }, (_, i) => ({
    id: i,
    animClass: `animate-equalizer-${(i % 4) + 1}`,
    hue: 260 + (i * 12) % 100,
  }));

  return (
    <div className={`flex items-end justify-center gap-1.5 h-12 px-3 py-1 bg-black/40 backdrop-blur-md rounded-xl border border-purple-500/30 ${className}`}>
      {bars.map((bar) => (
        <div
          key={bar.id}
          className={`w-1.5 sm:w-2 rounded-t-full transition-all duration-150 ${bar.animClass}`}
          style={{
            height: `${Math.floor(Math.random() * 60) + 35}%`,
            background: `linear-gradient(to top, hsl(${bar.hue}, 90%, 50%), hsl(${bar.hue + 40}, 100%, 70%))`,
            boxShadow: `0 0 10px hsl(${bar.hue}, 90%, 60%)`,
          }}
        />
      ))}
    </div>
  );
}
