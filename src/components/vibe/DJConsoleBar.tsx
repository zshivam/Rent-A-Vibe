'use client';

import React from 'react';
import { VibeMode } from './PartyVibeCanvas';
import { Sparkles, Sliders, Moon, Flame, Zap, Sun } from 'lucide-react';

interface DJConsoleBarProps {
  currentMode: VibeMode;
  onModeChange: (mode: VibeMode) => void;
  strobeActive: boolean;
  onToggleStrobe: () => void;
}

export function DJConsoleBar({
  currentMode,
  onModeChange,
  strobeActive,
  onToggleStrobe,
}: DJConsoleBarProps) {

  const MODES: { id: VibeMode; label: string; icon: any; color: string; desc: string }[] = [
    {
      id: 'cyber',
      label: 'Midnight Cyber',
      icon: Moon,
      color: 'from-purple-500 to-cyan-500 border-cyan-400/50',
      desc: 'Deep purple & neon cyan ambient glow',
    },
    {
      id: 'laser',
      label: 'Velvet Rave',
      icon: Sparkles,
      color: 'from-pink-500 to-amber-400 border-pink-400/50',
      desc: 'Luxe rose gold & violet laser canopy',
    },
    {
      id: 'strobe',
      label: 'Neon Strobe',
      icon: Flame,
      color: 'from-amber-400 to-purple-600 border-amber-400/50',
      desc: 'High-energy sound reactive strobe highlights',
    },
    {
      id: 'fog',
      label: 'Lounge Haze',
      icon: Sun,
      color: 'from-indigo-600 to-pink-600 border-indigo-400/50',
      desc: 'Warm dimmable lounge violet atmosphere',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-4 sm:my-6 px-2 sm:px-4 relative z-20">
      <div className="cyber-glass rounded-2xl p-3.5 sm:p-4 border border-purple-500/25 shadow-[0_0_40px_rgba(124,58,237,0.2)] relative overflow-hidden">
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Header */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs sm:text-sm text-white tracking-wider font-heading uppercase flex items-center gap-2">
                Venue Lighting Ambiance
              </h3>
              <p className="text-slate-400 text-[11px] hidden sm:block">
                Preview venue lighting moods
              </p>
            </div>
          </div>

          {/* Vibe Lighting Mode Selectors */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto scrollbar-none py-1 justify-center">
            {MODES.map((m) => {
              const Icon = m.icon;
              const active = currentMode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onModeChange(m.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all duration-300 border ${
                    active
                      ? `bg-gradient-to-r ${m.color} text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-105`
                      : 'bg-surface-elevated/70 border-white/10 text-slate-300 hover:text-white hover:border-purple-500/40'
                  }`}
                  title={m.desc}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-purple-400'}`} />
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* Ambient Lighting Strobe Toggle */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={onToggleStrobe}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                strobeActive
                  ? 'bg-amber-500 border-yellow-300 text-black shadow-[0_0_20px_rgba(251,191,36,0.8)] animate-pulse'
                  : 'bg-surface-elevated border-white/10 text-slate-300 hover:border-purple-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              {strobeActive ? 'Strobes Active' : 'Party Strobes'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
