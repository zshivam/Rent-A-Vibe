-- ============================================================
-- Rent-A-Vibe — Venue-Based Experiential Platform Migration
-- PostgreSQL 15+ Schema for Supabase
-- ============================================================

-- 1. Enable btree_gist for range exclusion constraints (overbooking prevention)
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 2. Venues Table
CREATE TABLE IF NOT EXISTS public.venues (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                    TEXT UNIQUE NOT NULL,
  name                    TEXT NOT NULL,
  tagline                 TEXT NOT NULL,
  description             TEXT NOT NULL,
  category                TEXT NOT NULL CHECK (category IN ('cinema', 'gaming', 'party', 'wellness', 'music', 'outdoor', 'workshop')),
  experience_type         TEXT NOT NULL,
  base_price_paise        BIGINT NOT NULL,           -- e.g. 149900 (₹1,499 for 3 hours)
  hourly_rate_paise       BIGINT NOT NULL,           -- e.g. 50000 (₹500/hour)
  security_deposit_paise  BIGINT NOT NULL DEFAULT 200000, -- ₹2,000 refundable
  capacity_max            INT NOT NULL DEFAULT 10,
  capacity_recommended    INT NOT NULL DEFAULT 6,
  city                    TEXT NOT NULL DEFAULT 'Mumbai',
  area                    TEXT NOT NULL,
  full_address            TEXT,
  cover_image_url         TEXT NOT NULL,
  gallery_urls            JSONB NOT NULL DEFAULT '[]'::JSONB,
  amenities               JSONB NOT NULL DEFAULT '[]'::JSONB,
  included_equipment      JSONB NOT NULL DEFAULT '[]'::JSONB,
  house_rules             JSONB NOT NULL DEFAULT '[]'::JSONB,
  tags                    TEXT[] NOT NULL DEFAULT '{}',
  meta_description        TEXT,
  is_active               BOOLEAN NOT NULL DEFAULT true,
  total_bookings          INT NOT NULL DEFAULT 0,
  average_rating          NUMERIC(3, 2) DEFAULT 5.0,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for category and city filtering
CREATE INDEX IF NOT EXISTS idx_venues_category_city ON public.venues (category, city) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_venues_slug ON public.venues (slug);

-- 3. Venue Bookings Table
CREATE TABLE IF NOT EXISTS public.venue_bookings (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  venue_id                UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
  booking_date            DATE NOT NULL,
  slot_start_time         TIMESTAMPTZ NOT NULL,
  slot_end_time           TIMESTAMPTZ NOT NULL,
  slot_tier_id            TEXT NOT NULL DEFAULT '3_hour',
  duration_hours          INT NOT NULL DEFAULT 3,
  guest_count             INT NOT NULL DEFAULT 2,
  rental_fee_paise        BIGINT NOT NULL,
  security_deposit_paise  BIGINT NOT NULL DEFAULT 200000,
  total_amount_paise      BIGINT NOT NULL,           -- rental_fee + deposit
  status                  TEXT NOT NULL DEFAULT 'pending' 
                          CHECK (status IN ('pending', 'confirmed', 'checked_in', 'completed', 'cancelled', 'disputed')),
  kyc_status              TEXT NOT NULL DEFAULT 'not_submitted'
                          CHECK (kyc_status IN ('not_submitted', 'submitted', 'verified', 'rejected')),
  kyc_document_url        TEXT,
  razorpay_order_id       TEXT UNIQUE,
  razorpay_payment_id     TEXT UNIQUE,
  razorpay_signature      TEXT,
  payment_captured_at     TIMESTAMPTZ,
  deposit_status          TEXT NOT NULL DEFAULT 'held'
                          CHECK (deposit_status IN ('held', 'released', 'forfeited')),
  deposit_released_at     TIMESTAMPTZ,
  deposit_release_note    TEXT,
  check_in_at             TIMESTAMPTZ,
  check_out_at            TIMESTAMPTZ,
  space_inspection_note   TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Time consistency constraint
  CONSTRAINT chk_slot_time_order CHECK (slot_end_time > slot_start_time),

  -- PostgreSql GiST Range Exclusion to mathematically prevent double-booking of confirmed sessions
  CONSTRAINT no_overlapping_confirmed_venue_bookings
    EXCLUDE USING gist (
      venue_id WITH =,
      tstzrange(slot_start_time, slot_end_time) WITH &&
    ) WHERE (status IN ('confirmed', 'checked_in'))
);

-- Index for fast user dashboard lookups & date range availability queries
CREATE INDEX IF NOT EXISTS idx_venue_bookings_user ON public.venue_bookings (user_id, status);
CREATE INDEX IF NOT EXISTS idx_venue_bookings_lookup ON public.venue_bookings (venue_id, booking_date, status);

-- 4. Availability Check Helper Function
CREATE OR REPLACE FUNCTION public.check_venue_availability(
  p_venue_id UUID,
  p_start_time TIMESTAMPTZ,
  p_end_time TIMESTAMPTZ
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 
    FROM public.venue_bookings
    WHERE venue_id = p_venue_id
      AND status IN ('confirmed', 'checked_in')
      AND tstzrange(slot_start_time, slot_end_time) && tstzrange(p_start_time, p_end_time)
  );
END;
$$;

-- 5. Row Level Security (RLS)
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_bookings ENABLE ROW LEVEL SECURITY;

-- Venues: Public read for active venues
CREATE POLICY "Public read active venues"
  ON public.venues FOR SELECT
  USING (is_active = true);

-- Bookings: Users can select their own bookings
CREATE POLICY "Users view own bookings"
  ON public.venue_bookings FOR SELECT
  USING (auth.uid() = user_id);

-- Bookings: Users can create bookings
CREATE POLICY "Users insert own bookings"
  ON public.venue_bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);
