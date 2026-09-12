import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabaseAdmin as any;

/**
 * GET /api/boxes/[slug]
 *
 * Returns a single VibeBox by slug, including published reviews.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const { data: box, error } = await db
    .from('vibe_boxes')
    .select(`
      *,
      reviews (
        id,
        rating,
        comment,
        created_at,
        profiles (full_name, avatar_url)
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !box) {
    return NextResponse.json({ error: 'Box not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: box });
}
