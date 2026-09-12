'use client';

import { useEffect, useState, useRef } from 'react';
import { Sparkles, ChevronUp } from 'lucide-react';
import { formatRupees } from '@/types';

interface MobileBookingBarProps {
  weekdayPricePaise: number;
  weekendPricePaise: number;
  bookingFormId: string;
}

export function MobileBookingBar({
  weekdayPricePaise,
  weekendPricePaise,
  bookingFormId,
}: MobileBookingBarProps) {
  const [visible, setVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [isWeekend, setIsWeekend] = useState(false);

  useEffect(() => {
    // Determine if today is weekend
    const day = new Date().getDay();
    setIsWeekend(day === 0 || day === 5 || day === 6);

    // Show bar after scrolling past ~200px
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener('scroll', onScroll, { passive: true });

    // Hide bar when booking form is on screen
    const formEl = document.getElementById(bookingFormId);
    let observer: IntersectionObserver | null = null;
    if (formEl) {
      observer = new IntersectionObserver(
        ([entry]) => setFormVisible(entry.isIntersecting),
        { threshold: 0.15 }
      );
      observer.observe(formEl);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer?.disconnect();
    };
  }, [bookingFormId]);

  const scrollToForm = () => {
    const el = document.getElementById(bookingFormId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const price = isWeekend ? weekendPricePaise : weekdayPricePaise;

  // Hide on desktop (sm+) or when form is visible or bar not triggered yet
  if (!visible || formVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden animate-slide-up">
      {/* Safe area for devices with home indicator */}
      <div className="bg-slate-950/95 backdrop-blur-xl border-t border-white/10 px-4 pt-3 pb-safe shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between gap-3">
          {/* Price display */}
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold leading-tight uppercase tracking-wide">
              {isWeekend ? 'Weekend price' : 'Weekday price'} · Eve Slot
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-white font-heading">{formatRupees(price)}</span>
              <span className="text-[10px] text-slate-400 font-semibold">+ ₹2k deposit</span>
            </div>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={scrollToForm}
            className="flex-1 max-w-[180px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md active:scale-[0.97] touch-manipulation"
          >
            <Sparkles className="w-4 h-4 text-white" />
            Book Now
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
        {/* pb-safe fallback for older browsers */}
        <div className="h-[env(safe-area-inset-bottom,0px)]" />
      </div>
    </div>
  );
}
