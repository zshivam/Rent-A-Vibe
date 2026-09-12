import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

/**
 * GET /api/boxes/[slug]/availability?start=YYYY-MM-DD&end=YYYY-MM-DD
 *
 * Returns booked date ranges for a box so the frontend calendar
 * can block out unavailable days.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const searchParams = request.nextUrl.searchParams;
  const startParam = searchParams.get('start');
  const endParam   = searchParams.get('end');

  // Resolve the box ID from slug
  const { data: box } = await db
    .from('vibe_boxes')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (!box) {
    return NextResponse.json({ error: 'Box not found' }, { status: 404 });
  }

  // Default to next 3 months if no range given
  const fromDate = startParam ?? new Date().toISOString().split('T')[0];
  const toDate   = endParam   ?? new Date(Date.now() + 90 * 86400 * 1000).toISOString().split('T')[0];

  const { data: bookings, error } = await db
    .from('bookings')
    .select('rental_start, rental_end')
    .eq('vibe_box_id', box.id)
    .not('status', 'in', '("cancelled")')
    .lte('rental_start', toDate)
    .gte('rental_end', fromDate)
    .order('rental_start');

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    data: {
      boxId:        box.id,
      fromDate,
      toDate,
      bookedRanges: (bookings ?? []).map((b: { rental_start: string; rental_end: string }) => ({
        start: b.rental_start,
        end:   b.rental_end,
      })),
    },
  });
}
