'use client';

import { useState, useEffect } from 'react';
import { VENUE_SLOT_TIERS, VENUE_ADD_ONS, SlotTier, AddOn, formatRupees } from '@/types';
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  Shield,
  Clock,
  Users,
  Calendar,
  Sparkles,
  Plus,
  Check,
  Mic2,
  Tv,
  Music,
  Lightbulb,
  BedDouble,
  Wifi,
  HelpCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { getStoredDemoUser } from '@/lib/auth-helpers';

interface VenueBookingFormProps {
  venueId: string;
  venueName: string;
  weekdayPricePaise?: number;
  weekendPricePaise?: number;
  basePricePaise: number;
  depositPaise: number;
  capacityMax: number;
  capacityRecommended: number;
  userId?: string | null;
}

declare global {
  interface Window {
    Razorpay: new (options: any) => { open(): void };
  }
}

const INCLUDED_BOOKING_FEATURES = [
  {
    icon: Mic2,
    name: 'Wireless Karaoke Stage',
    summary: 'Dual chrome UHF wireless microphones with voice echo & reverb filters',
    tag: 'Karaoke',
  },
  {
    icon: Tv,
    name: '100" Smart HD Cinema',
    summary: '1080p projector + 100" screen with Netflix, Hotstar & YouTube',
    tag: 'Cinema',
  },
  {
    icon: Music,
    name: 'Party DJ Sound Box',
    summary: '160W High-Bass Bluetooth tower with sound-reactive RGB dance strobes',
    tag: 'DJ Sound',
  },
  {
    icon: Lightbulb,
    name: 'Aesthetic Neon Lounge',
    summary: '"Good Vibes" neon sign, warm fairy light canopy & RGB ambient lights',
    tag: 'Neon Glow',
  },
  {
    icon: BedDouble,
    name: '2 AC Master Bedrooms',
    summary: 'Queen beds with clean hotel-grade linen + 2 attached geyser washrooms',
    tag: 'Overnight Beds',
  },
  {
    icon: Wifi,
    name: 'High-Speed Wi-Fi & Backup',
    summary: '300 Mbps fiber internet, inverter power backup & party board games',
    tag: 'Wi-Fi & Games',
  },
];

export function VenueBookingForm({
  venueId,
  venueName,
  weekdayPricePaise = 449900,
  weekendPricePaise = 699900,
  basePricePaise,
  depositPaise = 200000,
  capacityMax = 22,
  capacityRecommended = 16,
  userId: initialUserId,
}: VenueBookingFormProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-09-07');
  const [selectedSlotTierId, setSelectedSlotTierId] = useState<string>('evening_party_slot');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [guestCount, setGuestCount] = useState(capacityRecommended || 15);
  const [showIncludedDetails, setShowIncludedDetails] = useState(true);
  const [expandedAddOns, setExpandedAddOns] = useState<string[]>(['buffet-food-warmers']);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const d = new Date();
    setSelectedDate(d.toISOString().split('T')[0]);
  }, []);

  const today = mounted ? new Date().toISOString().split('T')[0] : '2026-09-07';

  const selectedSlotTier =
    VENUE_SLOT_TIERS.find((t) => t.id === selectedSlotTierId) || VENUE_SLOT_TIERS[1];

  // Determine if selected date is weekend (Fri, Sat, Sun) without timezone shift
  const isWeekend = (() => {
    if (!selectedDate) return false;
    const parts = selectedDate.split('-').map(Number);
    if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) return false;
    const day = new Date(parts[0], parts[1] - 1, parts[2]).getDay();
    return day === 0 || day === 5 || day === 6; // Sun, Fri, Sat
  })();

  const activeBasePrice = isWeekend
    ? (weekendPricePaise || basePricePaise * 1.5)
    : (weekdayPricePaise || basePricePaise);

  const rentalFee = Math.round(activeBasePrice * selectedSlotTier.multiplier);

  // Add-ons fee calculation
  const addOnsFee = selectedAddOns.reduce((sum, addOnId) => {
    const item = VENUE_ADD_ONS.find((a) => a.id === addOnId);
    return sum + (item ? item.price_paise : 0);
  }, 0);

  const totalAmount = rentalFee + addOnsFee + depositPaise;

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnId) ? prev.filter((id) => id !== addOnId) : [...prev, addOnId]
    );
  };

  const toggleDetails = (id: string) => {
    setExpandedAddOns((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const loadRazorpayScript = (): Promise<boolean> =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleBooking = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const activeUser = initialUserId || getStoredDemoUser()?.id || 'usr-demo-777';

    setLoading(true);

    try {
      // 1. Create Order via Next.js API route
      const res = await fetch('/api/bookings/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueId,
          bookingDate: selectedDate,
          slotTierId: selectedSlotTier.id,
          selectedAddOns,
          guestCount,
          userId: activeUser,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error?.message ?? 'Failed to reserve time slot. Please choose another date or slot.');
        setLoading(false);
        return;
      }

      const order = json.data;

      // 2. If test placeholder keys, simulate instant confirmation
      if (order.keyId.includes('placeholder') || order.keyId.startsWith('rzp_test_placeholder')) {
        setTimeout(() => {
          setSuccess(true);
          setBookingId(order.bookingId);
          setLoading(false);
        }, 500);
        return;
      }

      // 3. Load Razorpay SDK and launch modal
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError('Payment gateway could not be loaded. Please check your network.');
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Rent-A-Vibe Stays & Venues',
        description: `${venueName} (${selectedSlotTier.name}) + Add-ons & Deposit`,
        order_id: order.orderId,
        theme: { color: '#7c3aed' },
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/bookings/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId: order.bookingId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          const verifyJson = await verifyRes.json();
          if (verifyJson.success) {
            setSuccess(true);
            setBookingId(order.bookingId);
          } else {
            setError('Payment succeeded but verification was delayed. Reference: ' + order.bookingId);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError('Payment was cancelled. Your dates are held briefly.');
          },
        },
      });

      rzp.open();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass-card p-6 sm:p-8 text-center animate-fade-in border border-emerald-300 bg-white">
        <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto mb-4 text-emerald-600">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900 mb-2 font-heading">Venue Stay Reserved! 🎉</h3>
        <p className="text-slate-600 text-sm mb-4 leading-relaxed">
          Your reservation at <strong className="text-slate-900">{venueName}</strong> is confirmed.
          The flat manager will coordinate keyless access, lighting setup, and guest verification.
        </p>
        <div className="bg-slate-50 rounded-xl p-4 text-left text-xs space-y-1.5 font-mono text-slate-700 mb-6 border border-slate-200">
          <p><span className="text-slate-500 font-bold">Booking ID:</span> {bookingId}</p>
          <p><span className="text-slate-500 font-bold">Date:</span> {selectedDate} ({isWeekend ? 'Weekend' : 'Weekday'})</p>
          <p><span className="text-slate-500 font-bold">Slot:</span> {selectedSlotTier.name}</p>
          <p><span className="text-slate-500 font-bold">Window:</span> {selectedSlotTier.time_window}</p>
          <p><span className="text-slate-500 font-bold">Guests:</span> {guestCount} People</p>
          <p><span className="text-slate-500 font-bold">Add-ons:</span> {selectedAddOns.length > 0 ? selectedAddOns.join(', ') : 'None'}</p>
          <p><span className="text-slate-500 font-bold">Security Deposit:</span> {formatRupees(depositPaise)} (Refundable after checkout inspection)</p>
        </div>
        <a href="/dashboard" className="btn-primary w-full inline-flex justify-center py-3.5 text-sm font-extrabold">
          View in Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="glass-card p-4 sm:p-7 space-y-5 sm:space-y-6 border border-slate-200 shadow-xl bg-white">
      {/* Header Banner */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="badge bg-purple-100 text-purple-800 border border-purple-200 text-[10px] sm:text-xs px-2.5 py-0.5 inline-flex items-center gap-1 font-bold">
            <Sparkles className="w-3 h-3 text-purple-600" /> Event Planner & Venue Booking
          </span>
          <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md ${isWeekend ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}`}>
            {isWeekend ? 'Weekend Rate' : 'Weekday Special'}
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 pt-1 font-heading">Reserve Your 2BHK Party Stay</h3>
        <p className="text-slate-600 text-xs font-medium">
          Everything pre-installed & ready for 15–22 guests in Dwarka Sector 19.
        </p>
      </div>

      {/* 1. Date Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-600" /> 1. Select Celebration Date
          </label>
          <span className="text-[11px] text-purple-700 font-bold">
            {selectedDate} ({isWeekend ? 'Weekend' : 'Weekday'})
          </span>
        </div>

        {/* Quick Date Shortcuts for Mobile */}
        <div className="grid grid-cols-3 gap-2">
          {(() => {
            const d0 = new Date();
            const d1 = new Date(d0.getTime() + 24 * 60 * 60 * 1000);
            const daysUntilSat = (6 - d0.getDay() + 7) % 7 || 7;
            const dSat = new Date(d0.getTime() + daysUntilSat * 24 * 60 * 60 * 1000);

            const formatYMD = (d: Date) =>
              `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

            const dateToday = formatYMD(d0);
            const dateTomorrow = formatYMD(d1);
            const dateSat = formatYMD(dSat);

            return (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedDate(dateToday)}
                  className={`py-2 px-2 text-xs rounded-xl font-bold border transition-all cursor-pointer touch-manipulation active:scale-95 text-center ${
                    selectedDate === dateToday
                      ? 'bg-purple-600 border-purple-600 text-white shadow-md'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDate(dateTomorrow)}
                  className={`py-2 px-2 text-xs rounded-xl font-bold border transition-all cursor-pointer touch-manipulation active:scale-95 text-center ${
                    selectedDate === dateTomorrow
                      ? 'bg-purple-600 border-purple-600 text-white shadow-md'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDate(dateSat)}
                  className={`py-2 px-2 text-xs rounded-xl font-bold border transition-all cursor-pointer touch-manipulation active:scale-95 text-center ${
                    selectedDate === dateSat
                      ? 'bg-purple-600 border-purple-600 text-white shadow-md'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  This Sat
                </button>
              </>
            );
          })()}
        </div>

        <input
          type="date"
          min={today}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="input-field text-base sm:text-sm py-3 cursor-pointer border-slate-200 text-slate-900 bg-white"
        />
      </div>

      {/* 2. Slot & Stay Duration Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-purple-600" /> 2. Choose Time Slot / Stay Duration
          </label>
          <span className="text-[10px] text-purple-800 bg-purple-100 px-2 py-0.5 rounded border border-purple-200 font-bold">
            {selectedSlotTier.name}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {VENUE_SLOT_TIERS.map((tier) => {
            const isSelected = selectedSlotTierId === tier.id;
            const tierPrice = Math.round(activeBasePrice * tier.multiplier);
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setSelectedSlotTierId(tier.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer active:scale-[0.98] touch-manipulation ${
                  isSelected
                    ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-500/50 shadow-md'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Visual Radio Indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'border-purple-600 bg-purple-600 text-white'
                        : 'border-slate-400 bg-white'
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white animate-scale-in" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-bold ${isSelected ? 'text-purple-900' : 'text-slate-900'}`}>
                        {tier.name}
                      </p>
                      {tier.popular && (
                        <span className="badge bg-purple-600 text-white text-[9px] px-2 py-0.5 font-bold">
                          Most Popular
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{tier.time_window}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <p className={`text-sm font-extrabold font-heading ${isSelected ? 'text-purple-700' : 'text-slate-900'}`}>
                    {formatRupees(tierPrice)}
                  </p>
                  {isSelected && (
                    <span className="text-[9px] text-emerald-700 font-bold block">
                      ✓ Selected
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Guests Cap */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-purple-600" /> 3. Expected Guest Count
          </label>
          <span className="text-xs text-slate-500 font-semibold">Max {capacityMax} guests</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={guestCount <= 5}
            onClick={() => setGuestCount((c) => Math.max(5, c - 1))}
            className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 font-black text-xl hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center active:scale-95 touch-manipulation shadow-sm"
            aria-label="Decrease guests"
          >
            -
          </button>
          <span className="flex-1 text-center font-bold text-slate-900 text-base">
            {guestCount} Guests
          </span>
          <button
            type="button"
            disabled={guestCount >= capacityMax}
            onClick={() => setGuestCount((c) => Math.min(capacityMax, c + 1))}
            className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 font-black text-xl hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center active:scale-95 touch-manipulation shadow-sm"
            aria-label="Increase guests"
          >
            +
          </button>
        </div>
      </div>

      {/* 4. INCLUDED WITH BOOKING FEATURE SHOWCASE */}
      <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-3.5 sm:p-4 space-y-3">
        <button
          type="button"
          onClick={() => setShowIncludedDetails(!showIncludedDetails)}
          className="w-full flex items-center justify-between cursor-pointer select-none text-left touch-manipulation"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                Features Included in Booking <span className="text-purple-700 font-bold text-[11px]">(All-Inclusive)</span>
              </p>
              <p className="text-[10px] text-slate-600 font-medium">Pre-installed and fully tested inside the flat</p>
            </div>
          </div>
          <div className="text-slate-500 p-1">
            {showIncludedDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showIncludedDetails && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 animate-fade-in">
            {INCLUDED_BOOKING_FEATURES.map((item) => (
              <div
                key={item.name}
                className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-start gap-2.5 shadow-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                    <span className="text-[9px] font-bold text-purple-800 bg-purple-100 px-1.5 py-0.2 rounded border border-purple-200 shrink-0">
                      Included
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-tight line-clamp-2">
                    {item.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-[10px] text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 shadow-sm">
          <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>
            <strong>Note:</strong> Buffet food warmers and Bar station are available below as optional add-on packs.
          </span>
        </div>
      </div>

      {/* 5. EXTRA ADD-ONS (With Image, Plus/Check buttons, and More Info dropdowns) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" /> 4. Custom Add-On Packs (Optional)
          </label>
          <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
            Tap + to Add
          </span>
        </div>

        <div className="space-y-2.5">
          {VENUE_ADD_ONS.map((addon) => {
            const isAdded = selectedAddOns.includes(addon.id);
            const isExpanded = expandedAddOns.includes(addon.id);

            return (
              <div
                key={addon.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isAdded
                    ? 'bg-purple-50 border-purple-400 ring-1 ring-purple-500/50 shadow-md'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="p-3.5 flex items-start gap-3">
                  {/* Real Photo Thumbnail */}
                  {addon.image_url && (
                    <button
                      type="button"
                      onClick={() => toggleAddOn(addon.id)}
                      className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative cursor-pointer active:scale-95 transition-transform text-left p-0 touch-manipulation shadow-sm"
                      aria-label={`Toggle ${addon.name}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={addon.image_url}
                        alt={addon.name}
                        className="w-full h-full object-cover pointer-events-none"
                      />
                    </button>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleAddOn(addon.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleAddOn(addon.id);
                        }
                      }}
                      className="cursor-pointer select-none touch-manipulation"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-xs font-bold ${isAdded ? 'text-purple-900' : 'text-slate-900'}`}>
                          {addon.name}
                        </p>
                        {addon.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                            {addon.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight line-clamp-2 mt-0.5">
                        {addon.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDetails(addon.id);
                        }}
                        className="text-[10px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 py-1 px-1 -ml-1 cursor-pointer touch-manipulation active:opacity-70"
                      >
                        <Info className="w-3 h-3 text-purple-600" />
                        {isExpanded ? 'Hide items' : 'View more items'}
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      <span className="text-xs font-black text-purple-700 font-heading">
                        +{formatRupees(addon.price_paise)}
                      </span>
                    </div>
                  </div>

                  {/* Plus / Check Action Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAddOn(addon.id);
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all shrink-0 cursor-pointer active:scale-95 touch-manipulation ${
                      isAdded
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-purple-600 hover:text-white hover:border-purple-600'
                    }`}
                    title={isAdded ? 'Remove add-on' : 'Add to booking'}
                    aria-label={isAdded ? `Remove ${addon.name}` : `Add ${addon.name}`}
                  >
                    {isAdded ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
                  </button>
                </div>

                {/* Expanded Details List */}
                {isExpanded && addon.details && (
                  <div className="px-4 pb-3.5 pt-1 border-t border-slate-200 bg-white text-xs text-slate-700 space-y-1.5 animate-fade-in">
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Included in this pack:
                    </p>
                    <ul className="space-y-1 text-[11px]">
                      {addon.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-slate-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Complete Single-Checkout Price Breakdown */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2 text-sm shadow-sm">
        <div className="flex justify-between text-slate-700 font-medium">
          <span>{selectedSlotTier.name} ({isWeekend ? 'Weekend' : 'Weekday'})</span>
          <span className="font-bold text-slate-900 font-heading">{formatRupees(rentalFee)}</span>
        </div>

        <div className="flex justify-between text-slate-600 text-xs">
          <span className="flex items-center gap-1 text-purple-700 font-semibold">
            <Check className="w-3 h-3 text-purple-600" /> Karaoke, Cinema, DJ Sound & AC Bedrooms
          </span>
          <span className="font-bold text-purple-700">Included</span>
        </div>

        {addOnsFee > 0 && (
          <div className="flex justify-between text-slate-700 font-medium">
            <span>Selected Add-Ons ({selectedAddOns.length})</span>
            <span className="font-bold text-purple-700 font-heading">+{formatRupees(addOnsFee)}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-slate-700 font-medium">
          <span className="flex items-center gap-1.5 text-xs text-slate-600">
            <Shield className="w-3.5 h-3.5 text-emerald-600" /> Security Deposit (Refundable)
          </span>
          <span className="font-bold text-emerald-700 font-heading">{formatRupees(depositPaise)}</span>
        </div>

        <div className="border-t border-slate-200 pt-2.5 flex justify-between font-black text-base text-slate-900">
          <span className="font-heading">Total Single Checkout</span>
          <span className="text-purple-700 text-lg font-heading">{formatRupees(totalAmount)}</span>
        </div>

        <p className="text-[11px] text-slate-500 leading-tight pt-1">
          {formatRupees(depositPaise)} deposit is refunded within 12 hours post-event after morning space inspection.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-fade-in font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* CTA */}
      <button
        type="button"
        onClick={handleBooking}
        disabled={loading}
        className="btn-primary w-full py-4 text-base font-extrabold shadow-lg cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98] select-none touch-manipulation"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Locking Slot & Securing Flat...
          </>
        ) : (
          `Book Now · Pay ${formatRupees(totalAmount)}`
        )}
      </button>

      <div className="text-[11px] text-slate-500 text-center space-y-1 font-medium">
        <p>🔒 100% Private Venue · Direct host booking</p>
        <p>No unexpected platform fees · Full equipment included</p>
      </div>
    </div>
  );
}
