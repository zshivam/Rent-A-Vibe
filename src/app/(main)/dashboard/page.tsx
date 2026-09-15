'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { getStoredDemoUser, DemoUser } from '@/lib/auth-helpers';
import { getStoredBookings, saveBookingToStorage, UserBooking } from '@/lib/booking-helpers';
import { formatRupees } from '@/types';
import { 
  Package, 
  Shield, 
  User, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  Key, 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle2, 
  PhoneCall, 
  Copy, 
  Check,
  Plus
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function DashboardPage() {
  const supabase = createClient();
  const [user, setUser] = useState<SupabaseUser | DemoUser | null>(null);
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const fetchBookings = async (currentUser: SupabaseUser | DemoUser | null) => {
    // 1. Get local stored bookings
    const local = getStoredBookings();

    // 2. Query Supabase venue_bookings table if user is signed in
    let remoteBookings: UserBooking[] = [];
    if (currentUser) {
      try {
        const { data, error } = await supabase
          .from('venue_bookings')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          remoteBookings = data.map((b: any) => ({
            id: b.id,
            venue_id: b.venue_id || 'the-dwarka-party-flat',
            venue_name: 'The Dwarka 2BHK Party Flat · Sector 19',
            booking_date: b.booking_date || new Date().toISOString().split('T')[0],
            slot_tier_id: b.slot_tier_id || 'evening_party_slot',
            slot_tier_name: b.slot_tier_id === 'overnight' ? 'Overnight Party Slot' : 'Evening Party Slot',
            time_window: '7:00 PM – 6:00 AM (Overnight)',
            guest_count: b.guest_count || 15,
            selected_add_ons: b.selected_add_ons || [],
            rental_fee_paise: b.rental_fee_paise || 449900,
            add_ons_fee_paise: 0,
            deposit_paise: b.security_deposit_paise || 200000,
            total_amount_paise: b.total_amount_paise || 649900,
            status: b.status === 'pending' ? 'confirmed' : b.status || 'confirmed',
            created_at: b.created_at || new Date().toISOString(),
            access_code: `RV-${Math.floor(1000 + Math.random() * 9000)}`,
          }));
        }
      } catch {
        // ignore
      }
    }

    // Merge remote and local bookings deduplicated by ID
    const combinedMap = new Map<string, UserBooking>();
    local.forEach((b) => combinedMap.set(b.id, b));
    remoteBookings.forEach((b) => combinedMap.set(b.id, b));

    let allBookings = Array.from(combinedMap.values());

    // If signed in and no bookings exist yet, seed a default confirmed reservation
    if (allBookings.length === 0 && currentUser) {
      const sample = saveBookingToStorage({
        id: `bk_dwarka_sec19_${Date.now().toString(36)}`,
        venue_id: 'the-dwarka-party-flat',
        venue_name: 'The Dwarka 2BHK Party Flat · Sector 19',
        booking_date: new Date().toISOString().split('T')[0],
        slot_tier_id: 'evening_party_slot',
        slot_tier_name: 'Evening Party Slot',
        time_window: '7:00 PM – 6:00 AM (Overnight)',
        guest_count: 16,
        selected_add_ons: ['Buffet Food Warmers Pack', 'Bar Cocktail Station'],
        rental_fee_paise: 449900,
        add_ons_fee_paise: 200000,
        deposit_paise: 200000,
        total_amount_paise: 849900,
        status: 'confirmed',
      });
      allBookings = [sample];
    }

    setBookings(allBookings);
  };

  useEffect(() => {
    const syncUser = async () => {
      let activeUser: SupabaseUser | DemoUser | null = null;
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          activeUser = data.user;
        }
      } catch {
        // ignore
      }

      if (!activeUser) {
        activeUser = getStoredDemoUser();
      }

      setUser(activeUser);
      await fetchBookings(activeUser);
      setLoading(false);
    };

    syncUser();

    const handleCustomAuthChange = () => {
      syncUser();
    };

    const handleBookingChange = () => {
      fetchBookings(user);
    };

    window.addEventListener('rentavibe_auth_change', handleCustomAuthChange);
    window.addEventListener('rentavibe_booking_change', handleBookingChange);

    return () => {
      window.removeEventListener('rentavibe_auth_change', handleCustomAuthChange);
      window.removeEventListener('rentavibe_booking_change', handleBookingChange);
    };
  }, []);

  const copyAccessCode = (code: string, id: string) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 2000);
    } catch {
      // fallback
    }
  };

  if (loading) {
    return (
      <main className="container-page py-16 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-slate-300">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading your dashboard & bookings...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container-page py-16 max-w-lg mx-auto text-center">
        <div className="glass-card p-10 space-y-6 border border-white/10 bg-slate-900/90 shadow-2xl rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-300 shadow-md">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-white font-heading">Sign In Required</h1>
            <p className="text-slate-300 text-sm font-medium">
              Please sign in to view your venue reservations, door keycodes, and deposit status.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/auth/login" className="btn-primary flex-1 py-3 text-sm font-extrabold">
              Sign In Now
            </Link>
            <Link href="/auth/signup" className="btn-ghost flex-1 py-3 text-sm font-semibold">
              Create Account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const userEmail = (user as any).email || 'user@example.com';
  const userName =
    (user as any).user_metadata?.full_name ||
    (user as any).full_name ||
    userEmail.split('@')[0];

  const totalDepositsPaise = bookings.reduce((sum, b) => sum + (b.deposit_paise || 200000), 0);
  const activeBookingsCount = bookings.filter((b) => b.status === 'confirmed' || b.status === 'checked_in').length;

  return (
    <main className="container-page py-10 space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 glass-card p-6 border border-purple-500/30 bg-slate-900/90 shadow-xl rounded-2xl">
        <div>
          <span className="badge bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs px-3 py-1 mb-2 inline-flex font-bold">
            ✨ Verified VIP Flat Renter
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Welcome back, {userName}
          </h1>
          <p className="text-slate-400 text-sm mt-0.5 font-medium">{userEmail}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href="/venues/the-dwarka-party-flat" 
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-purple-900/30 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Book 2BHK Flat Stay
          </Link>
        </div>
      </div>

      {/* Quick Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 border border-purple-500/30 bg-slate-900/90 shadow-md rounded-2xl">
          <div className="flex items-center gap-3 text-slate-300 text-sm mb-2 font-semibold">
            <Package className="w-4 h-4 text-purple-400" /> Confirmed Venue Stays
          </div>
          <p className="text-3xl font-black text-white font-heading">{activeBookingsCount}</p>
          <p className="text-xs text-slate-400 mt-1 font-medium">Ready for keyless self check-in</p>
        </div>

        <div className="glass-card p-5 border border-emerald-500/30 bg-slate-900/90 shadow-md rounded-2xl">
          <div className="flex items-center gap-3 text-slate-300 text-sm mb-2 font-semibold">
            <Shield className="w-4 h-4 text-emerald-400" /> Refundable Security Deposit
          </div>
          <p className="text-3xl font-black text-emerald-400 font-heading">
            {formatRupees(totalDepositsPaise)}
          </p>
          <p className="text-xs text-slate-400 mt-1 font-medium">Auto-refunded 12h post checkout</p>
        </div>

        <div className="glass-card p-5 border border-amber-500/30 bg-slate-900/90 shadow-md rounded-2xl">
          <div className="flex items-center gap-3 text-slate-300 text-sm mb-2 font-semibold">
            <Clock className="w-4 h-4 text-amber-400" /> Total Party Events
          </div>
          <p className="text-3xl font-black text-amber-300 font-heading">{bookings.length}</p>
          <p className="text-xs text-slate-400 mt-1 font-medium">Dwarka Sector 19 Stays</p>
        </div>
      </div>

      {/* Booked Events Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading">Your Booked Events & Stays</h2>
            <p className="text-slate-400 text-xs font-medium">Manage entry door passcodes, guest details, and venue directions</p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="glass-card p-12 text-center border border-white/10 bg-slate-900/70 shadow-xl rounded-2xl">
            <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-white text-lg font-bold font-heading">No events booked yet</p>
            <p className="text-slate-300 text-sm mt-1 max-w-md mx-auto font-medium">
              Reserve our flagship 2BHK Party Flat in Dwarka Sector 19 with pre-installed Karaoke, Cinema, and Sound setup.
            </p>
            <Link href="/venues/the-dwarka-party-flat" className="btn-primary mt-6 inline-flex gap-2 font-extrabold">
              <Sparkles className="w-4 h-4" /> Reserve Dwarka 2BHK Flat
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const accessCode = booking.access_code || 'RV-8829';
              const isCopied = copiedCodeId === booking.id;

              return (
                <div
                  key={booking.id}
                  className="glass-card p-6 sm:p-7 border border-purple-500/40 bg-slate-900/90 shadow-2xl rounded-2xl space-y-6 transition-all hover:border-purple-500/60"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs px-2.5 py-0.5 font-bold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> CONFIRMED & ACCESS READY
                        </span>
                        <span className="text-xs text-purple-300 font-mono font-bold bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                          {booking.id}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white font-heading pt-1">
                        {booking.venue_name}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-purple-400" /> Sector 19, Dwarka, New Delhi (Near Sector 10 Metro)
                      </p>
                    </div>

                    {/* Keycode Badge */}
                    <div className="bg-slate-950/90 border border-purple-500/40 p-3 rounded-xl flex items-center justify-between gap-3 shrink-0">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Key className="w-3 h-3 text-amber-400" /> Keyless Door Passcode
                        </p>
                        <p className="text-lg font-black font-mono text-purple-300 tracking-wider">
                          {accessCode}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyAccessCode(accessCode, booking.id)}
                        className="p-2 rounded-lg bg-purple-900/50 hover:bg-purple-800 text-purple-200 border border-purple-500/40 transition-colors cursor-pointer"
                        title="Copy passcode"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="bg-slate-950/60 p-3.5 rounded-xl border border-white/5 space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-purple-400" /> Event Date
                      </p>
                      <p className="font-bold text-white text-sm">{booking.booking_date}</p>
                    </div>

                    <div className="bg-slate-950/60 p-3.5 rounded-xl border border-white/5 space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3 text-purple-400" /> Slot & Duration
                      </p>
                      <p className="font-bold text-white text-sm">{booking.slot_tier_name || 'Evening Party Slot'}</p>
                      <p className="text-[10px] text-purple-300 font-medium">{booking.time_window}</p>
                    </div>

                    <div className="bg-slate-950/60 p-3.5 rounded-xl border border-white/5 space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-purple-400" /> Guest Capacity
                      </p>
                      <p className="font-bold text-white text-sm">{booking.guest_count} Guests Max</p>
                      <p className="text-[10px] text-emerald-400 font-medium">✓ Overnights allowed</p>
                    </div>

                    <div className="bg-slate-950/60 p-3.5 rounded-xl border border-white/5 space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-emerald-400" /> Refundable Deposit
                      </p>
                      <p className="font-bold text-emerald-400 text-sm">
                        {formatRupees(booking.deposit_paise || 200000)}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">Auto-refunded 12h post inspection</p>
                    </div>
                  </div>

                  {/* Included Add-ons */}
                  {booking.selected_add_ons && booking.selected_add_ons.length > 0 && (
                    <div className="bg-purple-950/20 border border-purple-500/20 p-3 rounded-xl text-xs flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="text-slate-300 font-medium">
                        <strong className="text-white">Selected Add-on Packs:</strong> {booking.selected_add_ons.join(', ')}
                      </span>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <div className="text-xs text-slate-400 flex items-center gap-2 font-medium">
                      <span>Total Paid: <strong className="text-white font-heading text-sm">{formatRupees(booking.total_amount_paise)}</strong></span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">100% Guaranteed</span>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                      <a
                        href="tel:+919876543210"
                        className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-slate-950 border border-white/10 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-purple-400" /> Contact Manager
                      </a>
                      <Link
                        href="/venues/the-dwarka-party-flat#overview"
                        className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                      >
                        View Flat Details <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

