export interface UserBooking {
  id: string;
  venue_id: string;
  venue_name: string;
  booking_date: string;
  slot_tier_id: string;
  slot_tier_name: string;
  time_window: string;
  guest_count: number;
  selected_add_ons: string[];
  rental_fee_paise: number;
  add_ons_fee_paise: number;
  deposit_paise: number;
  total_amount_paise: number;
  status: 'confirmed' | 'pending' | 'checked_in' | 'completed' | 'cancelled';
  created_at: string;
  access_code?: string;
}

const STORAGE_KEY = 'rentavibe_user_bookings';

export function getStoredBookings(): UserBooking[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as UserBooking[];
  } catch {
    return [];
  }
}

export function saveBookingToStorage(booking: Partial<UserBooking> & { id: string; venue_name: string }): UserBooking {
  const newBooking: UserBooking = {
    id: booking.id,
    venue_id: booking.venue_id || 'the-dwarka-party-flat',
    venue_name: booking.venue_name || 'The Dwarka 2BHK Party Flat',
    booking_date: booking.booking_date || new Date().toISOString().split('T')[0],
    slot_tier_id: booking.slot_tier_id || 'evening_party_slot',
    slot_tier_name: booking.slot_tier_name || 'Evening Party Slot',
    time_window: booking.time_window || '7:00 PM – 6:00 AM (Overnight)',
    guest_count: booking.guest_count || 15,
    selected_add_ons: booking.selected_add_ons || [],
    rental_fee_paise: booking.rental_fee_paise || 449900,
    add_ons_fee_paise: booking.add_ons_fee_paise || 0,
    deposit_paise: booking.deposit_paise || 200000,
    total_amount_paise: booking.total_amount_paise || 649900,
    status: booking.status || 'confirmed',
    created_at: booking.created_at || new Date().toISOString(),
    access_code: booking.access_code || `RV-${Math.floor(1000 + Math.random() * 9000)}`,
  };

  if (typeof window !== 'undefined') {
    try {
      const existing = getStoredBookings();
      const filtered = existing.filter((b) => b.id !== newBooking.id);
      const updated = [newBooking, ...filtered];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    try {
      window.dispatchEvent(new Event('rentavibe_booking_change'));
    } catch {
      // ignore
    }
  }

  return newBooking;
}
