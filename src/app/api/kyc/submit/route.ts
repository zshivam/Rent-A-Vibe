import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

const schema = z.object({
  userId:        z.string().uuid(),
  bookingId:     z.string().uuid(),
  documentUrl:   z.string().url(),
});

/**
 * POST /api/kyc/submit
 *
 * Called after the user successfully uploads their ID to Cloudinary.
 * Updates both the booking and the user profile with the KYC document.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 422 });
  }

  const { userId, bookingId, documentUrl } = parsed.data;

  const { error: bookingErr } = await db
    .from('bookings')
    .update({ kyc_status: 'submitted', kyc_document_url: documentUrl })
    .eq('id', bookingId)
    .eq('user_id', userId);

  if (bookingErr) {
    return NextResponse.json({ error: 'Failed to update booking KYC' }, { status: 500 });
  }

  await db
    .from('profiles')
    .update({ kyc_status: 'submitted', kyc_document_url: documentUrl })
    .eq('id', userId);

  return NextResponse.json({ success: true, data: { kyc_status: 'submitted' } });
}
