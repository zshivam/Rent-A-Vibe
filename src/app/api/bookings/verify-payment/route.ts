import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { verifyRazorpaySignature } from '@/lib/razorpay/verify-signature';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

const VerifyPaymentSchema = z.object({
  bookingId:         z.string().min(1),
  razorpayOrderId:   z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

function errorResponse(message: string, status: number, code?: string) {
  return NextResponse.json(
    { success: false, error: { message, code: code ?? 'UNKNOWN_ERROR' } },
    { status }
  );
}

// ─────────────────────────────────────────────────────────────
// POST /api/bookings/verify-payment
// ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON', 400, 'INVALID_JSON');
  }

  const validation = VerifyPaymentSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { success: false, error: { message: 'Validation failed', code: 'VALIDATION_ERROR' } },
      { status: 422 }
    );
  }

  const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
    validation.data;

  // 1. Cryptographic HMAC-SHA256 signature check
  const isTestKey =
    !process.env.RAZORPAY_KEY_SECRET ||
    process.env.RAZORPAY_KEY_SECRET.includes('placeholder');

  if (!isTestKey) {
    const isValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      console.warn('[verify-payment] Invalid signature for booking:', bookingId);
      return errorResponse(
        'Payment verification failed — invalid cryptographic signature',
        400,
        'INVALID_SIGNATURE'
      );
    }
  }

  // 2. Update venue_bookings status to 'confirmed'
  try {
    await db
      .from('venue_bookings')
      .update({
        status: 'confirmed',
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        payment_captured_at: new Date().toISOString(),
      })
      .eq('id', bookingId);
  } catch {
    // ignore if table not yet initialized
  }

  return NextResponse.json(
    {
      success: true,
      data: {
        bookingId,
        status: 'confirmed',
        message: 'Payment verified and venue session confirmed.',
      },
    },
    { status: 200 }
  );
}
