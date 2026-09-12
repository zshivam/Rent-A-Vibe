// ============================================================
// Rent-A-Vibe — Flagship 2BHK Party Flat & Experiential Stay
// ============================================================

// ── Enums ────────────────────────────────────────────────────

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export type KycStatus =
  | 'not_submitted'
  | 'submitted'
  | 'verified'
  | 'rejected';

export type DepositStatus = 'held' | 'released' | 'forfeited';

export type VenueCategory =
  | 'party_flat'
  | 'rooftop_stay'
  | 'birthday_lounge'
  | 'cinema_den'
  | 'acoustic_jam';

// ── Affordable Celebration Add-On Packs ──────────────────────

export interface AddOn {
  id: string;
  name: string;
  price_paise: number;
  description: string;
  category: 'food' | 'entertainment' | 'decor' | 'beverages' | 'time';
  image_url?: string;
  badge?: string;
  details?: string[];
}

export const VENUE_ADD_ONS: AddOn[] = [
  {
    id: 'buffet-food-warmers',
    name: 'BYOF Buffet & Chafing Food Warmer Setup',
    price_paise: 79900, // ₹799
    description: 'Stainless steel chafing food warmers with burner gel cans, complete dinnerware for 20 guests + post-party dishwashing service.',
    category: 'food',
    badge: 'Popular',
    image_url: '/images/addons/buffet-warmers.jpg',
    details: [
      '3x Commercial Stainless Chafing Dishes (Roll-top & deep pans)',
      '6x Eco burner fuel gel cans (Keeps food piping hot for 4+ hours)',
      'Full ceramic dinner plates & cutlery set for 20 guests',
      'Stainless serving tongs, curry ladles & rice spoons',
      'Complete post-event dish cleaning & sanitization included',
    ],
  },
  {
    id: 'cocktail-bar-station',
    name: 'Cocktail Bar, Glassware & Mixer Station',
    price_paise: 69900, // ₹699
    description: 'Cocktail glassware, ice bucket & tongs, cocktail shaker, 6 chilled soda/tonic mixers, fresh lemons & 5kg ice pack pre-stocked in fridge.',
    category: 'beverages',
    badge: 'Trending',
    image_url: '/images/addons/cocktail-bar.jpg',
    details: [
      '12x Crystal highball & cocktail glasses',
      'Stainless steel Boston cocktail shaker, strainer & jigger',
      'Stainless ice bucket with insulated tongs + 5kg ice pack',
      '6x Chilled premium soda mixers & tonic water cans in fridge',
      'Fresh mint sprigs, lime slices & bar stirrer spoons',
    ],
  },
  {
    id: 'grand-buffet-bar-combo',
    name: 'Grand Buffet + Bar Station Combo (Save ₹200)',
    price_paise: 129900, // ₹1,299
    description: 'All-inclusive dining & drinks pack: Full buffet chafing warmers, dinnerware, cocktail bar glasses, mixers, ice & complete post-event cleaning.',
    category: 'food',
    badge: 'Best Value',
    image_url: '/images/addons/buffet-warmers.jpg',
    details: [
      'Everything in BYOF Buffet Warmer setup + dinnerware for 20',
      'Everything in Cocktail Bar & Mixer Station with glassware & ice',
      'Pre-arranged and inspected before your group check-in',
      'Complete post-celebration cleanup & dishwashing by venue team',
    ],
  },
  {
    id: 'theme-decor',
    name: 'Birthday / Anniversary Neon Decor Setup',
    price_paise: 149900, // ₹1,499
    description: 'Custom "Happy Birthday" or "Good Vibes" neon backdrop, 100 metallic balloons, arch garland, and fairy light drapes pre-assembled before arrival.',
    category: 'decor',
    badge: 'Special Occasion',
    image_url: '/images/addons/party-decor.jpg',
    details: [
      'Illuminated LED Neon wall backdrop ("Happy Birthday" / "Good Vibes")',
      '100+ Metallic rose gold, champagne & black balloon garland arch',
      'Warm golden shimmer fairy light curtains & photo props',
      'Cake display table setup with dessert stands & ambient spotlight',
    ],
  },
  {
    id: 'extra-hours',
    name: 'Late Morning Checkout / Extra Hour',
    price_paise: 39900, // ₹399/hr
    description: 'Extend your celebration or enjoy a relaxed late morning sleep-in (+₹399 per additional hour).',
    category: 'time',
    image_url: '/images/venue/master-bedroom.jpg',
    details: [
      'Extend checkout window beyond standard slot time',
      'Enjoy relaxed morning coffee and extended bedroom sleep-in',
      'Applies per extra hour with zero rush',
    ],
  },
];

// ── Stay & Slot Tiers (Hourly + Overnight Stays) ─────────────

export interface SlotTier {
  id: string;
  name: string;
  time_window: string;
  duration_hours: number;
  multiplier: number;
  description: string;
  popular?: boolean;
}

export const VENUE_SLOT_TIERS: SlotTier[] = [
  {
    id: 'afternoon_slot',
    name: 'Afternoon Vibe Slot',
    time_window: '1:00 PM – 6:00 PM (5 Hours)',
    duration_hours: 5,
    multiplier: 0.78, // ₹3,499 Weekday
    description: 'Budget-friendly daytime slot for lunch parties, board games, or squad hangouts.',
  },
  {
    id: 'evening_party_slot',
    name: 'Evening Party Slot',
    time_window: '7:00 PM – 1:00 AM (6 Hours)',
    duration_hours: 6,
    multiplier: 1.0, // ₹4,499 Weekday / ₹6,999 Weekend
    description: 'Prime party slot with karaoke mics, party lights, and full sound system.',
    popular: true,
  },
  {
    id: 'overnight_stay',
    name: 'Overnight Party & Stay',
    time_window: '7:00 PM – 10:00 AM (15 Hours)',
    duration_hours: 15,
    multiplier: 1.35, // ₹5,999 Weekday / ₹8,999 Weekend
    description: 'Night party + 2 AC master bedrooms for comfortable overnight sleep.',
  },
  {
    id: 'full_day_24h',
    name: '24-Hour Full Day Pass',
    time_window: '1:00 PM – 11:00 AM Next Day (22 Hours)',
    duration_hours: 22,
    multiplier: 1.75, // ₹7,899 Weekday / ₹11,999 Weekend
    description: 'Full 24-hr private access. Setup early, celebrate, and stay overnight.',
  },
];

export const DEFAULT_SLOT_TIERS = VENUE_SLOT_TIERS;

// ── Venue Model ──────────────────────────────────────────────

export interface VenueAmenity {
  name: string;
  category: 'equipment' | 'comfort' | 'sound' | 'refreshments' | 'connectivity';
  description?: string;
  icon?: string;
}

export interface Venue {
  id:                     string;
  slug:                   string;
  name:                   string;
  tagline:                string;
  description:            string;
  category:               VenueCategory;
  bhk_type:               string;
  experience_type:        string;
  weekday_price_paise:    number; // ₹4,499 (449900 paise)
  weekend_price_paise:    number; // ₹6,999 (699900 paise)
  base_price_paise:       number;
  hourly_rate_paise:      number;
  security_deposit_paise: number; // ₹2,000 (200000 paise) refundable
  capacity_max:           number; // 15-22 guests
  capacity_recommended:   number;
  city:                   string;
  area:                   string;
  full_address?:          string;
  cover_image_url:        string;
  gallery_urls:           string[];
  amenities:              VenueAmenity[];
  included_equipment:     string[];
  house_rules:            string[];
  is_active:              boolean;
  tags:                   string[];
  meta_description:       string | null;
  total_bookings:         number;
  average_rating:         number | null;
  created_at:             string;
  updated_at:             string;
}

// ── Vibe Delivery Kits (Secondary Budget-Friendly Option) ────

export interface VibeDeliveryKit {
  id:                    string;
  slug:                  string;
  name:                  string;
  tagline:               string;
  description:           string;
  category:              'karaoke' | 'lighting' | 'birthday' | 'music' | 'cinema';
  price_per_day_paise:   number; // ₹499 - ₹1,199/day
  security_deposit_paise: number; // ₹1,000
  cover_image_url:       string;
  contents:              Array<{ name: string; quantity: number; description: string }>;
  tags:                  string[];
  is_active:             boolean;
}

export type VibeBox = Venue | VibeDeliveryKit;

// ── Profile ──────────────────────────────────────────────────

export interface Profile {
  id:                  string;
  full_name:           string;
  phone:               string | null;
  avatar_url:          string | null;
  kyc_status:          KycStatus;
  kyc_document_url:    string | null;
  kyc_verified_at:     string | null;
  kyc_rejected_reason: string | null;
  total_bookings:      number;
  created_at:          string;
  updated_at:          string;
}

// ── Venue Booking ────────────────────────────────────────────

export interface Booking {
  id:                     string;
  user_id:                string;
  venue_id:               string;
  booking_date:           string; // YYYY-MM-DD
  slot_tier_id:           string;
  slot_start_time:        string;
  slot_end_time:          string;
  duration_hours:         number;
  guest_count:            number;
  selected_add_ons:       string[];
  rental_fee_paise:       number;
  add_ons_fee_paise:      number;
  security_deposit_paise: number;
  total_amount_paise:     number;
  status:                 BookingStatus;
  kyc_status:             KycStatus;
  kyc_document_url:       string | null;
  razorpay_order_id:      string | null;
  razorpay_payment_id:    string | null;
  razorpay_signature:     string | null;
  payment_captured_at:    string | null;
  deposit_status:         DepositStatus;
  deposit_released_at:    string | null;
  deposit_release_note:   string | null;
  check_in_at:            string | null;
  check_out_at:           string | null;
  space_inspection_note:  string | null;
  created_at:             string;
  updated_at:             string;
  venue?:                 Venue;
  profile?:               Profile;
}

// ── API Request/Response Types ───────────────────────────────

export interface CreateVenueOrderRequest {
  venueId:         string;
  bookingDate:     string;
  slotTierId:      string;
  selectedAddOns?: string[];
  guestCount:      number;
  userId?:         string;
}

export interface CreateVenueOrderResponse {
  orderId:           string;
  amount:            number;
  currency:          string;
  bookingId:         string;
  rentalFeePaise:    number;
  addOnsFeePaise:    number;
  depositPaise:      number;
  durationHours:     number;
  slotTierName:      string;
  keyId:             string;
}

export type CreateOrderRequest = CreateVenueOrderRequest;
export type CreateOrderResponse = CreateVenueOrderResponse;

export interface VerifyPaymentRequest {
  bookingId:         string;
  razorpayOrderId:   string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResponse {
  success:   boolean;
  bookingId: string;
  status:    BookingStatus;
}

// ── Currency Formatting Utilities ────────────────────────────

export function formatRupees(paise: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

export function paiseToRupees(paise: number): number {
  return paise / 100;
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}
