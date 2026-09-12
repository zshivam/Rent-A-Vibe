# Rent-A-Vibe 🎉

> Hyper-local experiential rental platform — rent curated experience boxes delivered to your door.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React, Tailwind CSS |
| Backend | Next.js API Routes, Node.js |
| Database | Supabase (PostgreSQL) |
| Payments | Razorpay (rental fee + ₹2,000 refundable deposit) |
| Media / KYC | Cloudinary |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/zshivam/Rent-A-Vibe.git
cd Rent-A-Vibe
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
# Fill in your Supabase, Razorpay, and Cloudinary credentials
```

### 3. Set up the database

1. Go to your [Supabase project](https://supabase.com) → SQL Editor
2. Run the schema: `supabase/schema.sql`

### 4. Run locally

```bash
npm run dev
# → http://localhost:3000
```

---

## Project Structure

```
src/
├── app/
│   ├── (main)/              # Pages with Navbar + Footer
│   │   ├── boxes/           # Listing & detail pages
│   │   └── layout.tsx
│   ├── api/
│   │   ├── bookings/
│   │   │   ├── create-order/    # POST — Razorpay order + availability check
│   │   │   └── verify-payment/  # POST — HMAC signature verification
│   │   ├── boxes/[slug]/
│   │   │   ├── route.ts         # GET box details
│   │   │   └── availability/    # GET booked date ranges
│   │   └── kyc/
│   │       ├── get-upload-url/  # POST — signed Cloudinary URL
│   │       └── submit/          # POST — save document URL
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── booking/BookingForm.tsx  # Full Razorpay checkout flow
│   └── layout/
│       ├── Navbar.tsx
│       └── Footer.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts    # Browser client (anon key)
│   │   └── admin.ts     # Server client (service role)
│   ├── razorpay/
│   │   ├── client.ts         # SDK instance
│   │   └── verify-signature.ts
│   ├── cloudinary/client.ts
│   └── utils.ts
└── types/
    ├── index.ts      # Domain types + formatRupees utility
    └── supabase.ts   # DB types (regenerate with CLI)
supabase/
└── schema.sql        # Complete DB schema with RLS policies
```

---

## Key API Endpoints

### `POST /api/bookings/create-order`

Creates a Razorpay order after validating date availability.

**Request:**
```json
{
  "boxId": "uuid",
  "userId": "uuid",
  "startDate": "2024-12-25",
  "endDate": "2024-12-26",
  "deliveryAddress": "Flat 4B, ..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order_xxx",
    "amount": 349900,
    "currency": "INR",
    "bookingId": "uuid",
    "rentalFeePaise": 149900,
    "depositPaise": 200000,
    "rentalDays": 1,
    "keyId": "rzp_test_xxx"
  }
}
```

### `POST /api/bookings/verify-payment`

Verifies Razorpay HMAC signature and confirms booking.

### `GET /api/boxes/[slug]/availability?start=YYYY-MM-DD&end=YYYY-MM-DD`

Returns booked date ranges for calendar rendering.

---

## Anti-Double-Booking Architecture

Three layers prevent concurrent double bookings:

1. **Application check** — `checkAvailability()` queries existing confirmed/active bookings for date overlap before creating the Razorpay order.
2. **Pessimistic DB lock** — A `pending` booking is inserted BEFORE the Razorpay call, soft-locking the dates.
3. **PostgreSQL EXCLUDE constraint** — `btree_gist` exclusion constraint at the DB level rejects overlapping date ranges for the same box with a `23P01` error, which the API catches and returns as a 409.

---

## Security

- All secrets in environment variables (never in code)
- Razorpay signature verified server-side with `crypto.timingSafeEqual`
- Supabase Row Level Security enabled on all tables
- KYC documents uploaded via server-signed Cloudinary URLs (API secret never reaches the browser)
- `SUPABASE_SERVICE_ROLE_KEY` only used in server-side files (`lib/supabase/admin.ts`)

---

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo in Vercel
3. Add all environment variables from `.env.example`
4. Deploy 🚀

---

## Regenerate Supabase types

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
```
