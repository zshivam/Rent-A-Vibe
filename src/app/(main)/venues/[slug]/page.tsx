import { supabaseAdmin } from '@/lib/supabase/admin';
import { getMockVenue } from '@/lib/mock-data';
import { Venue, formatRupees } from '@/types';
import { VenueBookingForm } from '@/components/booking/VenueBookingForm';
import { Star, MapPin, Users, Shield, CheckCircle2, AlertTriangle, Sparkles, Home } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  let venue: Partial<Venue> | null | undefined = null;
  try {
    const { data } = await (supabaseAdmin as any)
      .from('venues')
      .select('name, tagline, meta_description, cover_image_url')
      .eq('slug', slug)
      .maybeSingle();
    venue = data as Partial<Venue> | null;
  } catch {
    // fallback
  }

  if (!venue) {
    venue = getMockVenue(slug);
  }

  if (!venue) return { title: 'Venue Not Found' };

  return {
    title: `${venue.name} | Rent-A-Vibe`,
    description: venue.meta_description ?? venue.tagline,
    openGraph: venue.cover_image_url ? { images: [venue.cover_image_url] } : undefined,
  };
}

async function getVenue(slug: string): Promise<Venue | null> {
  try {
    const { data } = await (supabaseAdmin as any)
      .from('venues')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (data) return data as Venue;
  } catch {
    // fallback
  }
  return getMockVenue(slug) ?? null;
}

export default async function VenueDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const venue = await getVenue(slug);

  if (!venue) notFound();

  return (
    <div className="container-page py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Venue Showcase */}
        <div className="lg:col-span-2 space-y-10">
          {/* Cover & Gallery */}
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 shadow-xl relative border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={venue.cover_image_url}
                alt={venue.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="badge bg-purple-600 backdrop-blur-md text-white font-bold shadow-sm">
                  {venue.bhk_type}
                </span>
                <span className="badge bg-white/90 backdrop-blur-md text-slate-900 font-bold border border-slate-200 shadow-sm">
                  ✨ Pre-Equipped 2BHK Flat
                </span>
              </div>
            </div>

            {venue.gallery_urls && venue.gallery_urls.length > 1 && (
              <div className="grid grid-cols-2 gap-3">
                {venue.gallery_urls.slice(0, 2).map((imgUrl, i) => (
                  <div key={i} className="rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imgUrl} alt={`${venue.name} gallery ${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Title & Badges */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap text-sm">
              <span className="badge bg-purple-100 border border-purple-200 text-purple-800 font-bold">
                {venue.experience_type}
              </span>
              {venue.average_rating && (
                <span className="flex items-center gap-1 text-amber-600 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  {venue.average_rating.toFixed(2)}
                  <span className="text-slate-500 font-normal">({venue.total_bookings} parties hosted)</span>
                </span>
              )}
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <Users className="w-4 h-4 text-purple-600" /> Up to {venue.capacity_max} guests (Ideal: {venue.capacity_recommended})
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <MapPin className="w-4 h-4 text-purple-600" /> {venue.area}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">{venue.name}</h1>
            <p className="text-slate-600 text-lg leading-relaxed">{venue.tagline}</p>
          </div>

          {/* Pricing Highlight Banner */}
          <div className="glass-card p-6 flex items-center justify-between flex-wrap gap-4 border border-purple-200 bg-purple-50/60 shadow-sm">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Flat Slot Pricing</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-purple-700 font-black text-3xl font-heading">
                  {formatRupees(venue.weekday_price_paise)}
                </span>
                <span className="text-slate-500 text-xs">(Weekday) /</span>
                <span className="text-slate-900 font-bold text-xl font-heading">
                  {formatRupees(venue.weekend_price_paise)}
                </span>
                <span className="text-slate-500 text-xs">(Weekend)</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-700 text-sm bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm">
              <Shield className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="font-semibold text-slate-900">{formatRupees(venue.security_deposit_paise)} Refundable Deposit</p>
                <p className="text-[11px] text-slate-500">Refunded post morning inspection</p>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 font-heading">
              <Home className="w-5 h-5 text-purple-600" /> Venue & Setup Details
            </h2>
            <div className="text-slate-700 leading-relaxed space-y-4 text-base whitespace-pre-line glass-card p-6 border border-slate-200">
              {venue.description}
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 font-heading">Included Amenities & Equipment</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {venue.amenities.map((amenity, i) => (
                <div key={i} className="glass-card p-4 flex items-start gap-3 border border-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{amenity.name}</p>
                    <p className="text-slate-500 text-xs mt-0.5 capitalize">{amenity.category} setup</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Included Equipment Checklist */}
          {venue.included_equipment && venue.included_equipment.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 font-heading">Party Hardware in the Flat</h2>
              <div className="glass-card p-6 space-y-2.5 border border-slate-200">
                {venue.included_equipment.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* House Rules & Compliance */}
          {venue.house_rules && venue.house_rules.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 font-heading">
                <AlertTriangle className="w-5 h-5 text-amber-600" /> House Rules & RWA Guidelines
              </h2>
              <div className="glass-card p-6 space-y-3 border border-slate-200">
                {venue.house_rules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                    <span className="text-purple-600 font-bold shrink-0">{idx + 1}.</span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Booking Widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <VenueBookingForm
              venueId={venue.id}
              venueName={venue.name}
              weekdayPricePaise={venue.weekday_price_paise}
              weekendPricePaise={venue.weekend_price_paise}
              basePricePaise={venue.base_price_paise}
              depositPaise={venue.security_deposit_paise}
              capacityMax={venue.capacity_max}
              capacityRecommended={venue.capacity_recommended}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
