'use client';

import React, { useEffect } from 'react';
import { X, Zap, Shield, CheckCircle2, Lock } from 'lucide-react';
import { VenueBookingForm } from './VenueBookingForm';
import { Venue } from '@/types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  venue: Venue;
}

export function BookingModal({ isOpen, onClose, venue }: BookingModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-fade-in">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-white border border-purple-200 rounded-2xl shadow-2xl z-10 overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-indigo-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600 text-white shadow-sm">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-heading">
                Reserve Dwarka Party Flat
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Lock your reservation date with ₹1,000 token
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Booking Form */}
        <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto scrollbar-none">
          <VenueBookingForm
            venueId={venue.id}
            venueName={venue.name}
            weekdayPricePaise={venue.weekday_price_paise}
            weekendPricePaise={venue.weekend_price_paise}
            basePricePaise={venue.base_price_paise}
            depositPaise={venue.security_deposit_paise}
            capacityMax={venue.capacity_max}
            capacityRecommended={venue.capacity_recommended}
          />
        </div>

        {/* Modal Footer Guarantee */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600 font-medium">
          <span className="flex items-center gap-1.5 font-bold text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Refundable Deposit Policy
          </span>
          <span className="text-slate-600 font-semibold flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-purple-600" /> Secure Checkout
          </span>
        </div>

      </div>
    </div>
  );
}
