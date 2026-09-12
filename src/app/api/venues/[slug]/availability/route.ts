import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getMockVenue } from '@/lib/mock-data';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

/**
 * GET /api/venues/[slug]/availability?date=YYYY-MM-DD
 * Returns booked time slots for a venue on a specific day.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const searchParams = request.nextUrl.searchParams;
  const dateParam = searchParams.get('date') ?? new Date().toISOString().split('T')[0];

  let venue = getMockVenue(slug);
  try {
    const { data } = await db
      .from('venues')
      .select('id, name')
      .eq('slug', slug)
      .maybeSingle();

    if (data) venue = data;
  } catch {
    // fallback
  }

  if (!venue) {
    return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
  }

  let bookedSlots: Array<{ start: string; end: string; duration: number }> = [];

  try {
    const { data: bookings } = await db
      .from('venue_bookings')
      .select('slot_start_time, slot_end_time, duration_hours')
      .eq('venue_id', venue.id)
      .eq('booking_date', dateParam)
      .in('status', ['confirmed', 'checked_in'])
      .order('slot_start_time');

    if (bookings) {
      bookedSlots = bookings.map((b: any) => ({
        start: new Date(b.slot_start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        end: new Date(b.slot_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: b.duration_hours,
      }));
    }
  } catch {
    // fallback
  }

  return NextResponse.json({
    success: true,
    data: {
      venueId: venue.id,
      date: dateParam,
      bookedSlots,
    },
  });
}
