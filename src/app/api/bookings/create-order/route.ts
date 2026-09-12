import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { razorpay, SECURITY_DEPOSIT_PAISE, CURRENCY } from '@/lib/razorpay/client';
import { getMockVenue } from '@/lib/mock-data';
import { VENUE_SLOT_TIERS, VENUE_ADD_ONS } from '@/types';
import { parseISO, isBefore, startOfDay, addHours } from 'date-fns';

// ─────────────────────────────────────────────────────────────
// INPUT VALIDATION SCHEMA FOR VENUE EXPERIENCES & 2BHK STAYS
// ─────────────────────────────────────────────────────────────

const CreateVenueOrderSchema = z.object({
  venueId: z.string().min(1, 'Venue ID is required'),
  bookingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  slotTierId: z.string().default('evening_party_slot'),
  selectedAddOns: z.array(z.string()).default([]),
  startTime: z.string().optional(),
  guestCount: z.number().int().min(1).max(50).default(15),
  userId: z.string().optional(),
});

type CreateVenueOrderInput = z.infer<typeof CreateVenueOrderSchema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

function errorResponse(message: string, status: number, code?: string) {
  return NextResponse.json(
    { success: false, error: { message, code: code ?? 'UNKNOWN_ERROR' } },
    { status }
  );
}

// ─────────────────────────────────────────────────────────────
// HELPER: Check for overlapping bookings (Double-booking prevention)
// ─────────────────────────────────────────────────────────────

async function checkVenueAvailability(
  venueId: string,
  startIso: string,
  endIso: string
): Promise<{ available: boolean; conflictSlot?: string }> {
  try {
    const { data: conflicts, error } = await db
      .from('venue_bookings')
      .select('id, slot_start_time, slot_end_time, status')
      .eq('venue_id', venueId)
      .in('status', ['confirmed', 'checked_in'])
      .lt('slot_start_time', endIso)
      .gt('slot_end_time', startIso);

    if (error) {
      return { available: true };
    }

    if (!conflicts || conflicts.length === 0) {
      return { available: true };
    }

    const first = conflicts[0];
    return {
      available: false,
      conflictSlot: `${new Date(first.slot_start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(first.slot_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };
  } catch {
    return { available: true };
  }
}

// ─────────────────────────────────────────────────────────────
// POST /api/bookings/create-order
// ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON in request body', 400, 'INVALID_JSON');
  }

  // Support legacy boxId field as venueId alias
  if (body && typeof body === 'object' && 'boxId' in body && !('venueId' in body)) {
    (body as any).venueId = (body as any).boxId;
  }
  if (body && typeof body === 'object' && 'startDate' in body && !('bookingDate' in body)) {
    (body as any).bookingDate = (body as any).startDate;
  }

  const validation = CreateVenueOrderSchema.safeParse(body);
  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          fields: fieldErrors,
        },
      },
      { status: 422 }
    );
  }

  const { venueId, bookingDate, slotTierId, selectedAddOns, guestCount, userId }: CreateVenueOrderInput =
    validation.data;

  // ── 1. Date & Time Validation ──────────────────────────────
  const now = new Date();
  // Safe cutoff allows current date across any client timezone
  const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  if (bookingDate < cutoff) {
    return errorResponse('Booking date cannot be in the past', 400, 'INVALID_BOOKING_DATE');
  }

  // Parse YYYY-MM-DD components directly to avoid timezone day shifts
  const [year, month, day] = bookingDate.split('-').map(Number);
  const parsedDate = new Date(year, (month || 1) - 1, day || 1);

  const slotTier =
    VENUE_SLOT_TIERS.find((t) => t.id === slotTierId) ||
    VENUE_SLOT_TIERS[1]; // default to evening party slot

  const dayOfWeek = parsedDate.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6; // Sun, Fri, Sat

  // Approximate slot start times
  let startHour = 19; // 7:00 PM default for evening/overnight
  if (slotTierId === 'afternoon_slot') startHour = 13; // 1:00 PM
  if (slotTierId === 'full_day_24h') startHour = 13;

  const startDateTime = new Date(parsedDate);
  startDateTime.setHours(startHour, 0, 0, 0);
  const endDateTime = addHours(startDateTime, slotTier.duration_hours);

  const startIso = startDateTime.toISOString();
  const endIso = endDateTime.toISOString();

  // ── 2. Fetch Venue Details & Pricing ───────────────────────
  let venue: any = null;
  try {
    const { data, error } = await db
      .from('venues')
      .select('*')
      .eq('id', venueId)
      .maybeSingle();

    if (!error && data) {
      venue = data;
    }
  } catch {
    // fallback
  }

  // Fallback to rich mock venue if database table not yet populated
  if (!venue) {
    venue = getMockVenue(venueId);
  }

  if (!venue) {
    return errorResponse('Party flat / venue not found', 404, 'VENUE_NOT_FOUND');
  }

  if (guestCount > venue.capacity_max) {
    return errorResponse(
      `This venue accommodates a maximum of ${venue.capacity_max} guests.`,
      400,
      'CAPACITY_EXCEEDED'
    );
  }

  // ── 3. Check Slot Availability (Double-Booking Prevention) ──
  const availability = await checkVenueAvailability(venue.id, startIso, endIso);
  if (!availability.available) {
    return errorResponse(
      `This flat is already booked for this time window (${availability.conflictSlot}). Please select another date.`,
      409,
      'SLOT_UNAVAILABLE'
    );
  }

  // ── 4. Calculate Pricing (Weekday vs Weekend + Add-Ons) ────
  const baseRate = isWeekend
    ? (venue.weekend_price_paise || venue.base_price_paise * 1.5)
    : (venue.weekday_price_paise || venue.base_price_paise);

  const rentalFeePaise = Math.round(baseRate * slotTier.multiplier);

  // Calculate selected add-ons
  const addOnsFeePaise = (selectedAddOns || []).reduce((sum, addOnId) => {
    const item = VENUE_ADD_ONS.find((a) => a.id === addOnId);
    return sum + (item ? item.price_paise : 0);
  }, 0);

  const depositPaise = venue.security_deposit_paise || SECURITY_DEPOSIT_PAISE; // ₹3,000 - ₹4,000
  const totalAmountPaise = rentalFeePaise + addOnsFeePaise + depositPaise; // Single unified transaction

  const internalBookingId = `bk_flat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // ── 5. Create Razorpay Order ───────────────────────────────
  let razorpayOrderId = `order_${Date.now()}`;
  const isDummyRazorpay =
    !process.env.RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_KEY_ID.includes('placeholder') ||
    !process.env.RAZORPAY_KEY_SECRET ||
    process.env.RAZORPAY_KEY_SECRET.includes('placeholder');

  if (!isDummyRazorpay) {
    try {
      const order = await (razorpay.orders.create as any)({
        amount: totalAmountPaise,
        currency: CURRENCY,
        receipt: internalBookingId,
        notes: {
          booking_id: internalBookingId,
          venue_id: venue.id,
          venue_name: venue.name,
          slot_tier: slotTier.name,
          is_weekend: isWeekend.toString(),
          rental_fee_paise: rentalFeePaise.toString(),
          add_ons_fee_paise: addOnsFeePaise.toString(),
          security_deposit_paise: depositPaise.toString(),
          booking_date: bookingDate,
          user_id: userId || 'guest',
        },
      });
      razorpayOrderId = order.id;
    } catch (razorpayErr: any) {
      console.error('[create-order] Razorpay gateway error:', razorpayErr);
      return errorResponse('Payment gateway initialization failed. Please try again.', 502, 'GATEWAY_ERROR');
    }
  }

  // ── 6. Persist Pending Booking to Database ──────────────────
  try {
    await db.from('venue_bookings').insert({
      id: internalBookingId,
      user_id: userId || '00000000-0000-0000-0000-000000000000',
      venue_id: venue.id,
      booking_date: bookingDate,
      slot_start_time: startIso,
      slot_end_time: endIso,
      slot_tier_id: slotTier.id,
      duration_hours: slotTier.duration_hours,
      guest_count: guestCount,
      rental_fee_paise: rentalFeePaise,
      security_deposit_paise: depositPaise,
      total_amount_paise: totalAmountPaise,
      status: 'pending',
      razorpay_order_id: razorpayOrderId,
    });
  } catch {
    // If Supabase is in mock mode, proceed gracefully
  }

  // ── 7. Return Order Payload to Frontend ────────────────────
  return NextResponse.json(
    {
      success: true,
      data: {
        orderId: razorpayOrderId,
        amount: totalAmountPaise,
        currency: CURRENCY,
        bookingId: internalBookingId,
        venueName: venue.name,
        rentalFeePaise,
        addOnsFeePaise,
        depositPaise,
        durationHours: slotTier.duration_hours,
        slotTierName: slotTier.name,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      },
    },
    { status: 201 }
  );
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: { message: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' } },
    { status: 405 }
  );
}
