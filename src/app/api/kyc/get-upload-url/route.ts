import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { generateKycUploadSignature } from '@/lib/cloudinary/client';
import { z } from 'zod';

const schema = z.object({
  userId:    z.string().uuid(),
  bookingId: z.string().uuid(),
});

/**
 * POST /api/kyc/get-upload-url
 *
 * Returns a signed Cloudinary upload URL for KYC documents.
 * The api_secret never leaves the server.
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

  const { userId, bookingId } = parsed.data;

  // Verify booking belongs to this user
  const { data: booking } = await supabaseAdmin
    .from('bookings')
    .select('id, user_id, kyc_status')
    .eq('id', bookingId)
    .eq('user_id', userId)
    .single();

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  const uploadParams = await generateKycUploadSignature(userId, bookingId);

  return NextResponse.json({ success: true, data: uploadParams });
}
