import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getMockVenue } from '@/lib/mock-data';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

/**
 * GET /api/venues/[slug]
 * Returns experiential venue details by slug.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let venue = getMockVenue(slug);
  try {
    const { data: dbVenue } = await db
      .from('venues')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (dbVenue) {
      venue = dbVenue;
    }
  } catch {
    // fallback
  }

  if (!venue) {
    return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: venue });
}
