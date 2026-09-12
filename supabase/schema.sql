-- ============================================================
-- Rent-A-Vibe — Supabase / PostgreSQL Schema
-- Run this in the Supabase SQL Editor (Settings → SQL Editor)
-- ============================================================

-- Enable UUID extension (already enabled by default on Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────────────────────────
-- ENUM TYPES
-- ──────────────────────────────────────────────────────────────

CREATE TYPE booking_status AS ENUM (
  'pending',        -- order created, payment not yet confirmed
  'confirmed',      -- payment captured, rental active
  'active',         -- box currently with renter
  'returned',       -- box returned, pending deposit review
  'completed',      -- deposit released, booking closed
  'cancelled',      -- booking cancelled before activation
  'disputed'        -- post-return dispute raised
);

CREATE TYPE kyc_status AS ENUM (
  'not_submitted',
  'submitted',
  'verified',
  'rejected'
);

CREATE TYPE deposit_status AS ENUM (
  'held',           -- deposit collected, held in escrow
  'released',       -- deposit returned to user
  'forfeited'       -- deposit withheld (damage/loss)
);

CREATE TYPE box_condition AS ENUM (
  'excellent',
  'good',
  'fair',
  'under_maintenance'
);

-- ──────────────────────────────────────────────────────────────
-- PROFILES
-- Extends Supabase Auth users with app-specific data
-- ──────────────────────────────────────────────────────────────

CREATE TABLE profiles (
  id                UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name         TEXT        NOT NULL,
  phone             TEXT        UNIQUE,
  avatar_url        TEXT,                             -- Cloudinary URL
  kyc_status        kyc_status  NOT NULL DEFAULT 'not_submitted',
  kyc_document_url  TEXT,                             -- Cloudinary secure URL
  kyc_verified_at   TIMESTAMPTZ,
  kyc_rejected_reason TEXT,
  total_rentals     INTEGER     NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on profile changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ──────────────────────────────────────────────────────────────
-- VIBE BOXES
-- The core inventory — curated experience rental kits
-- ──────────────────────────────────────────────────────────────

CREATE TABLE vibe_boxes (
  id                  UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                TEXT          UNIQUE NOT NULL,             -- URL-friendly identifier e.g. 'movie-night-pro'
  name                TEXT          NOT NULL,                    -- "Movie Night Pro Box"
  tagline             TEXT          NOT NULL,                    -- Short punchy description
  description         TEXT          NOT NULL,                    -- Full markdown description
  category            TEXT          NOT NULL,                    -- 'movies', 'gaming', 'camping', 'fitness', etc.

  -- Pricing (all values in paise — Indian subunit of Rupee)
  price_per_day_paise INTEGER       NOT NULL CHECK (price_per_day_paise > 0),
  security_deposit_paise INTEGER    NOT NULL DEFAULT 200000,     -- ₹2,000 default

  -- Media (Cloudinary URLs)
  cover_image_url     TEXT          NOT NULL,                    -- Primary listing image
  gallery_urls        TEXT[]        NOT NULL DEFAULT '{}',       -- Additional images
  thumbnail_url       TEXT,                                      -- Small thumbnail for cards

  -- Contents
  contents            JSONB         NOT NULL DEFAULT '[]',       -- Array of {name, quantity, description}

  -- Availability
  is_active           BOOLEAN       NOT NULL DEFAULT TRUE,       -- Publicly listed
  condition           box_condition NOT NULL DEFAULT 'excellent',
  total_quantity      INTEGER       NOT NULL DEFAULT 1 CHECK (total_quantity >= 1),

  -- SEO / Discovery
  tags                TEXT[]        NOT NULL DEFAULT '{}',
  meta_description    TEXT,

  -- Location
  city                TEXT          NOT NULL DEFAULT 'Mumbai',
  area                TEXT,

  -- Stats
  total_bookings      INTEGER       NOT NULL DEFAULT 0,
  average_rating      NUMERIC(3,2)  DEFAULT NULL CHECK (average_rating BETWEEN 1 AND 5),

  created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TRIGGER vibe_boxes_updated_at
  BEFORE UPDATE ON vibe_boxes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index for fast category + city searches on the listing page
CREATE INDEX idx_vibe_boxes_category    ON vibe_boxes(category);
CREATE INDEX idx_vibe_boxes_city        ON vibe_boxes(city);
CREATE INDEX idx_vibe_boxes_is_active   ON vibe_boxes(is_active);
CREATE INDEX idx_vibe_boxes_slug        ON vibe_boxes(slug);

-- ──────────────────────────────────────────────────────────────
-- AVAILABILITY OVERRIDES
-- Allows admin to block dates for maintenance, events, etc.
-- ──────────────────────────────────────────────────────────────

CREATE TABLE availability_overrides (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  vibe_box_id   UUID        NOT NULL REFERENCES vibe_boxes(id) ON DELETE CASCADE,
  blocked_from  DATE        NOT NULL,
  blocked_until DATE        NOT NULL,
  reason        TEXT,                                             -- e.g., 'maintenance', 'reserved for event'
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_override_range CHECK (blocked_until >= blocked_from)
);

CREATE INDEX idx_overrides_box_dates ON availability_overrides(vibe_box_id, blocked_from, blocked_until);

-- ──────────────────────────────────────────────────────────────
-- BOOKINGS
-- Core transactional record for every rental
-- ──────────────────────────────────────────────────────────────

CREATE TABLE bookings (
  id                    UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Relations
  user_id               UUID            NOT NULL REFERENCES profiles(id),
  vibe_box_id           UUID            NOT NULL REFERENCES vibe_boxes(id),

  -- Rental Period (dates are inclusive)
  rental_start          DATE            NOT NULL,
  rental_end            DATE            NOT NULL,
  rental_days           INTEGER         NOT NULL GENERATED ALWAYS AS (rental_end - rental_start + 1) STORED,

  -- Pricing snapshot (captured at booking time to survive price changes)
  price_per_day_paise   INTEGER         NOT NULL,
  rental_fee_paise      INTEGER         NOT NULL,                 -- price_per_day * rental_days
  security_deposit_paise INTEGER        NOT NULL DEFAULT 200000,
  total_amount_paise    INTEGER         NOT NULL,                 -- rental_fee + deposit

  -- Status
  status                booking_status  NOT NULL DEFAULT 'pending',

  -- KYC
  kyc_status            kyc_status      NOT NULL DEFAULT 'not_submitted',
  kyc_document_url      TEXT,                                     -- Cloudinary URL of uploaded ID

  -- Razorpay
  razorpay_order_id     TEXT            UNIQUE,
  razorpay_payment_id   TEXT            UNIQUE,
  razorpay_signature    TEXT,
  payment_captured_at   TIMESTAMPTZ,

  -- Security Deposit
  deposit_status        deposit_status  NOT NULL DEFAULT 'held',
  deposit_released_at   TIMESTAMPTZ,
  deposit_release_note  TEXT,

  -- Delivery / Return
  delivery_address      TEXT,
  delivery_scheduled_at TIMESTAMPTZ,
  return_scheduled_at   TIMESTAMPTZ,
  returned_at           TIMESTAMPTZ,
  return_condition_note TEXT,
  return_photos_urls    TEXT[]          DEFAULT '{}',

  -- Admin notes
  admin_notes           TEXT,

  -- Timestamps
  created_at            TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_rental_range         CHECK (rental_end >= rental_start),
  CONSTRAINT positive_rental_fee        CHECK (rental_fee_paise > 0),
  CONSTRAINT positive_total             CHECK (total_amount_paise > 0)
);

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ──────────────────────────────────────────────────────────────
-- CRITICAL: Overlap prevention index
-- Uses PostgreSQL's EXCLUDE constraint to prevent double-bookings
-- at the database level — the last line of defence
-- ──────────────────────────────────────────────────────────────

-- We need btree_gist extension for this
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE bookings
  ADD CONSTRAINT no_overlapping_bookings
  EXCLUDE USING GIST (
    vibe_box_id WITH =,
    daterange(rental_start, rental_end, '[]') WITH &&
  )
  WHERE (status NOT IN ('cancelled'));

-- Standard indexes for query performance
CREATE INDEX idx_bookings_user_id     ON bookings(user_id);
CREATE INDEX idx_bookings_box_id      ON bookings(vibe_box_id);
CREATE INDEX idx_bookings_status      ON bookings(status);
CREATE INDEX idx_bookings_dates       ON bookings(rental_start, rental_end);
CREATE INDEX idx_bookings_razorpay    ON bookings(razorpay_order_id);

-- Compound index for the availability check query
CREATE INDEX idx_bookings_box_dates_status
  ON bookings(vibe_box_id, rental_start, rental_end, status);

-- ──────────────────────────────────────────────────────────────
-- REVIEWS
-- Post-rental feedback
-- ──────────────────────────────────────────────────────────────

CREATE TABLE reviews (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id    UUID        NOT NULL UNIQUE REFERENCES bookings(id), -- one review per booking
  user_id       UUID        NOT NULL REFERENCES profiles(id),
  vibe_box_id   UUID        NOT NULL REFERENCES vibe_boxes(id),
  rating        INTEGER     NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT,
  is_published  BOOLEAN     NOT NULL DEFAULT FALSE,               -- admin approval before publish
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_box_id ON reviews(vibe_box_id);

-- Auto-update the vibe_box average_rating when a review is published
CREATE OR REPLACE FUNCTION refresh_box_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE vibe_boxes
  SET average_rating = (
    SELECT ROUND(AVG(rating)::NUMERIC, 2)
    FROM reviews
    WHERE vibe_box_id = NEW.vibe_box_id AND is_published = TRUE
  )
  WHERE id = NEW.vibe_box_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reviews_refresh_rating
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION refresh_box_rating();

-- ──────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ──────────────────────────────────────────────────────────────

ALTER TABLE profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE vibe_boxes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings              ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews               ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_overrides ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update only their own profile
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Vibe Boxes: anyone can read active boxes; only service role can write
CREATE POLICY "boxes_select_active" ON vibe_boxes FOR SELECT USING (is_active = TRUE);

-- Bookings: users can read their own bookings; insert with auth; server-side handles writes
CREATE POLICY "bookings_select_own" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "bookings_insert_own" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reviews: anyone can read published reviews; users can insert their own
CREATE POLICY "reviews_select_published" ON reviews FOR SELECT USING (is_published = TRUE);
CREATE POLICY "reviews_insert_own"       ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ──────────────────────────────────────────────────────────────
-- HELPER VIEW: Available boxes for a date range
-- Usage: SELECT * FROM v_box_availability WHERE ... 
-- ──────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW v_box_availability AS
SELECT
  vb.id,
  vb.slug,
  vb.name,
  vb.category,
  vb.city,
  vb.price_per_day_paise,
  vb.security_deposit_paise,
  vb.cover_image_url,
  vb.average_rating,
  vb.total_quantity,
  -- Count of active/confirmed bookings (not cancelled)
  COUNT(b.id) FILTER (WHERE b.status NOT IN ('cancelled')) AS active_bookings
FROM vibe_boxes vb
LEFT JOIN bookings b ON b.vibe_box_id = vb.id
WHERE vb.is_active = TRUE
GROUP BY vb.id;

-- ──────────────────────────────────────────────────────────────
-- SEED: Sample Vibe Boxes (replace Cloudinary URLs with real ones)
-- ──────────────────────────────────────────────────────────────

INSERT INTO vibe_boxes (
  slug, name, tagline, description, category,
  price_per_day_paise, cover_image_url, contents, tags, city
) VALUES
(
  'movie-night-pro',
  'Movie Night Pro Box',
  'Cinema in your living room — minus the overpriced popcorn.',
  '## Movie Night Pro\n\nTransform any space into a premium cinema experience. Includes a 4K projector, 100-inch inflatable screen, Bluetooth soundbar, and cozy accessories for up to 6 people.',
  'movies',
  149900, -- ₹1,499/day
  'https://res.cloudinary.com/demo/image/upload/movie-night-pro.jpg',
  '[{"name":"BenQ 4K Projector","quantity":1,"description":"4000 lumens, HDR support"},{"name":"100\" Inflatable Screen","quantity":1,"description":"Portable, sets up in 5 mins"},{"name":"JBL Soundbar","quantity":1,"description":"2.1 channel, 120W"},{"name":"HDMI Cable 5m","quantity":2,"description":"4K certified"},{"name":"Extension Cord","quantity":1,"description":"5-socket, 5m"},{"name":"Cozy Blankets","quantity":4,"description":"Fleece, washed and packed"}]',
  ARRAY['movies', 'projector', 'date-night', 'friends', 'indoor'],
  'Mumbai'
),
(
  'gaming-arena-box',
  'Gaming Arena Box',
  'Bring the LAN party home.',
  '## Gaming Arena Box\n\nFull competitive gaming setup for a squad of 4. Includes high-refresh monitors, gaming peripherals, and a router for low-latency local play.',
  'gaming',
  199900, -- ₹1,999/day
  'https://res.cloudinary.com/demo/image/upload/gaming-arena-box.jpg',
  '[{"name":"27\" 144Hz Monitors","quantity":4,"description":"1080p, 1ms response time"},{"name":"Mechanical Keyboards","quantity":4,"description":"Cherry MX Red switches"},{"name":"Gaming Mouse","quantity":4,"description":"16,000 DPI optical"},{"name":"USB Hub","quantity":1,"description":"7-port powered hub"},{"name":"TP-Link Router","quantity":1,"description":"Wi-Fi 6, low latency mode"}]',
  ARRAY['gaming', 'esports', 'lan-party', 'squad', 'indoor'],
  'Mumbai'
),
(
  'rooftop-chill-box',
  'Rooftop Chill Box',
  'Ambient vibes, fairy lights, and the whole sky.',
  '## Rooftop Chill Box\n\nEverything you need for an aesthetic rooftop hangout. Fairy lights, Bluetooth speaker, portable bar cart, cushions, and a folding table.',
  'outdoor',
  99900, -- ₹999/day
  'https://res.cloudinary.com/demo/image/upload/rooftop-chill-box.jpg',
  '[{"name":"LED Fairy Light String 20m","quantity":2,"description":"Warm white, USB powered"},{"name":"JBL Flip Bluetooth Speaker","quantity":1,"description":"Waterproof, 12hr battery"},{"name":"Folding Chairs","quantity":6,"description":"Padded, lightweight"},{"name":"Folding Table","quantity":1,"description":"60cm diameter, portable"},{"name":"Lanterns","quantity":4,"description":"Battery operated, dimmable"}]',
  ARRAY['outdoor', 'rooftop', 'aesthetic', 'chill', 'friends'],
  'Mumbai'
);
