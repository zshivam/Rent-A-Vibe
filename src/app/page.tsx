'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FLAGSHIP_VENUE, getMockDeliveryKits } from '@/lib/mock-data';
import { VenueBookingForm } from '@/components/booking/VenueBookingForm';
import { BookingModal } from '@/components/booking/BookingModal';
import { GuestPhotoWall } from '@/components/community/GuestPhotoWall';
import { VenueReviewsSection } from '@/components/reviews/VenueReviewsSection';
import { VenueDetailTabs } from '@/components/venue/VenueDetailTabs';
import { MobileBookingBar } from '@/components/booking/MobileBookingBar';
import { formatRupees, VENUE_ADD_ONS } from '@/types';

// Ambient Background Component
import { PartyVibeCanvas } from '@/components/vibe/PartyVibeCanvas';

import {
  Star,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Disc,
  Zap,
  Music,
  Tv,
  Wifi,
  ShieldCheck,
  MessageCircle,
  Utensils,
  Camera,
  Award,
  Lock,
  Clock,
  Building,
  Share2,
  Heart,
  Grid,
  MapPin,
  Key,
  Home,
  Sofa,
  BedDouble,
  ShieldAlert,
  Info,
} from 'lucide-react';

// ── Section Nav Config ─────────────────────────────────────────
const SECTION_LINKS = [
  { id: 'overview', label: 'Overview',     icon: Home },
  { id: 'included', label: 'Amenities',    icon: Sparkles },
  { id: 'addons',   label: 'Add-Ons',      icon: Utensils },
  { id: 'booking',  label: 'Instant Book', icon: Calendar },
  { id: 'gallery',  label: 'Photos',       icon: Camera },
  { id: 'reviews',  label: 'Reviews',      icon: Star },
];

// ── Experience Zones Data ──────────────────────────────────────
const EXPERIENCE_ZONES = [
  {
    tag: 'Wireless Karaoke',
    title: 'Dual Chrome Karaoke Stage',
    desc: 'Dual wireless mics with digital reverb & echo control, plugged into 160W party sound tower.',
    badge: '100% INCLUDED',
    image: '/images/venue/karaoke-stage.jpg',
    icon: Music,
  },
  {
    tag: '100" Cinema',
    title: '100" Smart HD Cinema Zone',
    desc: '1080p Smart Projector loaded with Netflix, Hotstar & YouTube with floor cushions & ambient lights.',
    badge: '100% INCLUDED',
    image: '/images/venue/cinema-projector.jpg',
    icon: Tv,
  },
  {
    tag: 'Party Sound',
    title: '160W Party Sound Zone',
    desc: 'High-Bass Bluetooth tower synced with ambient RGB lighting & crisp sound output.',
    badge: '100% INCLUDED',
    image: '/images/boxes/dj-party.jpg',
    icon: Disc,
  },
  {
    tag: 'Aesthetic Neon',
    title: 'Aesthetic Neon Lounge',
    desc: '"Good Vibes" neon LED sign, warm fairy light canopy, and dimmable RGB corner ambiance.',
    badge: '100% INCLUDED',
    image: '/images/venue/living-room.jpg',
    icon: Zap,
  },
  {
    tag: '2 Master Beds',
    title: '2 Private AC Master Bedrooms',
    desc: '2 air-conditioned master bedrooms with hotel-grade queen beds, fresh linen & attached geysers.',
    badge: 'OVERNIGHT READY',
    image: '/images/venue/master-bedroom.jpg',
    icon: Users,
  },
  {
    tag: 'High-Speed Wi-Fi',
    title: '300 Mbps Wi-Fi & Game Arena',
    desc: 'High-speed fiber internet, full power backup, Uno, Jenga, Cards & board games included.',
    badge: '100% INCLUDED',
    image: '/images/boxes/gaming-arena.jpg',
    icon: Wifi,
  },
];

// ── Scroll utilities ───────────────────────────────────────────
function scrollSection(ref: React.RefObject<HTMLDivElement | null>, dir: 'left' | 'right') {
  if (!ref.current) return;
  const amount = ref.current.clientWidth * 0.82;
  ref.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
}

export default function HomePage() {
  const venue = FLAGSHIP_VENUE;
  const deliveryKits = getMockDeliveryKits().slice(0, 3);

  // States
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Quick-nav active section
  const [activeSection, setActiveSection] = useState('overview');
  const [navSticky, setNavSticky] = useState(false);

  // Carousel scroll refs
  const zonesRef = useRef<HTMLDivElement>(null);
  const addonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setNavSticky(window.scrollY > 360);
      for (const { id } of [...SECTION_LINKS].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="relative overflow-x-hidden pb-24 sm:pb-0 bg-[#f8fafc]">

      {/* ── AMBIENT CANVAS BACKGROUND ── */}
      <PartyVibeCanvas />

      {/* ── BOOKING MODAL POPUP ── */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        venue={venue}
      />

      {/* ── STICKY SECTION QUICK-NAV (mobile only) ── */}
      <div
        className={`fixed top-16 left-0 right-0 z-40 sm:hidden transition-all duration-300 ${
          navSticky ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-md">
          <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto scrollbar-none">
            {SECTION_LINKS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className={`text-[11px] font-semibold px-3.5 py-1.5 rounded-full border whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
                  activeSection === id
                    ? 'bg-purple-600 border-purple-500 text-white shadow-sm'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          AIRBNB LUXE STYLE HERO SECTION
      ══════════════════════════════════════════ */}
      <section id="overview" className="relative z-10 pt-4 sm:pt-8 pb-8 sm:pb-16 border-b border-slate-200/80">
        
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[750px] h-[300px] sm:h-[750px] rounded-full bg-purple-500/10 blur-[130px] pointer-events-none" />

        <div className="container-page relative z-10 space-y-4 sm:space-y-6">
          
          {/* Listing Title & Share/Save Action Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="badge bg-purple-100 border border-purple-200 text-purple-800 text-[10px] sm:text-xs font-bold">
                  ENTIRE PARTY FLAT IN NEW DELHI
                </span>
                <span className="badge bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] sm:text-xs font-bold">
                  SUPERHOST
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 font-heading">
                The Dwarka Party Flat | Private 2BHK + Karaoke & 100" Cinema
              </h1>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 mt-2 font-medium">
                <span className="flex items-center gap-1 font-bold text-amber-600">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" /> 5.0 · 180+ Stays
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-purple-600" /> Dwarka Sector 19, New Delhi, India
                </span>
              </div>
            </div>

            {/* Share & Save Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleShare}
                className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Link Copied!' : 'Share'}</span>
              </button>
              <button
                type="button"
                onClick={() => setSaved(!saved)}
                className={`btn-ghost text-xs py-2 px-3 flex items-center gap-1.5 ${
                  saved ? 'text-pink-600 border-pink-300 bg-pink-50' : ''
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-pink-500 text-pink-500' : ''}`} />
                <span>{saved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>

          {/* Airbnb Style Photo Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 aspect-auto sm:aspect-[16/8] rounded-2xl overflow-hidden border border-slate-200/80 relative shadow-xl">
            
            {/* Main Cover Photo (Left 7 cols) */}
            <div className="md:col-span-7 relative group aspect-video md:aspect-auto h-full overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={venue.cover_image_url}
                alt={venue.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="badge bg-white/90 backdrop-blur-md text-slate-900 border border-slate-200 text-xs font-bold shadow-sm">
                  Living Room & Karaoke Stage
                </span>
              </div>
            </div>

            {/* Right Thumbnails Grid (Right 5 cols) */}
            <div className="hidden md:grid md:col-span-5 grid-cols-2 gap-3 h-full">
              {venue.gallery_urls.slice(1, 5).map((imgUrl, idx) => (
                <div key={idx} className="relative group overflow-hidden bg-slate-100 h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt="Interior view"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>

            {/* "Show all photos" Button */}
            <button
              type="button"
              onClick={() => scrollTo('gallery')}
              className="absolute bottom-4 right-4 bg-white/90 hover:bg-white backdrop-blur-md text-slate-900 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
            >
              <Grid className="w-4 h-4 text-purple-600" />
              <span>Show all 12 photos</span>
            </button>
          </div>

          {/* Main Stage Grid: Host Summary LEFT + Sticky Reservation Card RIGHT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">

            {/* ── LEFT COLUMN: Property Overview & Highlights ── */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Property Meta Details */}
              <div className="border-b border-slate-200 pb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-heading">
                    Entire rental unit hosted by Rent-A-Vibe Team
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    15–22 guests · 2 master bedrooms · 3 beds · 2 bathrooms · Private terrace
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 border border-purple-300 text-purple-700 flex items-center justify-center font-extrabold text-sm shrink-0 shadow-sm">
                  RAV
                </div>
              </div>

              {/* Venue Tabs: Highlights, Sleeping Setup & Ratings Breakdown */}
              <VenueDetailTabs
                capacity_max={venue.capacity_max}
                capacity_recommended={venue.capacity_recommended}
                area={venue.area}
                full_address={venue.full_address}
                house_rules={venue.house_rules}
              />

            </div>

            {/* ── RIGHT COLUMN: Sticky Reservation Card ── */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="cyber-glass p-6 rounded-2xl border border-slate-200 shadow-xl space-y-5">
                
                {/* Pricing & Rating Header */}
                <div className="border-b border-slate-200 pb-4 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-3xl font-extrabold text-slate-900 font-heading">
                        {formatRupees(venue.weekday_price_paise)}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">/ afternoon slot</span>
                    </div>
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-500" /> 5.0 · 180+ Reviews
                    </span>
                  </div>

                  <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Reserve date with ₹1,000 token
                  </p>
                </div>

                {/* Date & Guest Box summary */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden text-xs">
                  <div className="grid grid-cols-2 border-b border-slate-200 divide-x divide-slate-200">
                    <div className="p-3">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">CHECK-IN</span>
                      <span className="text-slate-900 font-semibold">Flexible / 1:00 PM</span>
                    </div>
                    <div className="p-3">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">CHECKOUT</span>
                      <span className="text-slate-900 font-semibold">6:00 PM / Next Morning</span>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">GUESTS</span>
                      <span className="text-slate-900 font-semibold">Up to 22 guests allowed</span>
                    </div>
                  </div>
                </div>

                {/* Primary Reserve Button */}
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(true)}
                  className="btn-primary w-full py-4 text-base font-extrabold"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Reserve Venue</span>
                </button>

                <p className="text-center text-[11px] text-slate-500">
                  You won't be charged full amount yet. ₹1,000 locks your date.
                </p>

                {/* Quick WhatsApp enquiry */}
                <a
                  href="https://wa.me/919999999999?text=Hi%20Rent-A-Vibe!%20I%20want%20to%20enquire%20about%20booking%20the%20Dwarka%20Party%20Flat."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs py-2.5 flex items-center justify-center gap-1.5 text-center font-semibold"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Enquire on WhatsApp</span>
                </a>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          EXPERIENCE ZONES SECTION (Clean Cards Grid)
      ══════════════════════════════════════════ */}
      <section id="included" className="py-12 sm:py-20 relative z-10 border-b border-slate-200">
        <div className="container-page">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <span className="badge bg-purple-100 text-purple-800 border border-purple-200 text-xs px-3 py-1 font-bold">
                WHAT'S INCLUDED IN FLAT
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-2 font-heading">
                6 Immersive <span className="text-gradient-purple">Experience Zones.</span>
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollSection(zonesRef, 'left')}
                className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-purple-500 hover:text-purple-600 transition-colors shadow-sm"
                aria-label="Previous zone"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollSection(zonesRef, 'right')}
                className="p-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-purple-500 hover:text-purple-600 transition-colors shadow-sm"
                aria-label="Next zone"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Zones Carousel / Grid */}
          <div
            ref={zonesRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory"
          >
            {EXPERIENCE_ZONES.map((zone, idx) => {
              const IconComp = zone.icon;
              return (
                <div key={idx} className="w-[280px] sm:w-[360px] shrink-0 snap-start">
                  <div className="cyber-glass rounded-2xl overflow-hidden border border-slate-200 h-full flex flex-col group hover:border-purple-400 transition-all duration-300 shadow-md">
                    
                    {/* Image header */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={zone.image}
                        alt={zone.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                      
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="badge bg-purple-600 text-white font-bold text-[10px] shadow-sm">
                          {zone.tag}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 flex items-center justify-center text-purple-700 shadow-sm">
                          <IconComp className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
                          {zone.badge}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 font-heading group-hover:text-purple-700 transition-colors">
                          {zone.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                          {zone.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-semibold text-purple-700">
                        <span>Included with stay</span>
                        <Check className="w-4 h-4 text-emerald-600" />
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          ADD-ONS & CATERING SECTION
      ══════════════════════════════════════════ */}
      <section id="addons" className="py-12 sm:py-20 relative z-10 border-b border-slate-200">
        <div className="container-page">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="badge bg-purple-100 text-purple-800 border border-purple-200 text-xs px-3 py-1 font-bold">
              PARTY ADD-ONS & CATERING
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-2 font-heading">
              Curated Event <span className="text-gradient-purple">Add-Ons.</span>
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2">
              Select optional dining and decor packs during checkout for your celebration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {VENUE_ADD_ONS.map((addon) => (
              <div key={addon.id} className="cyber-glass p-5 rounded-2xl border border-slate-200 h-full flex flex-col justify-between space-y-4 hover:border-purple-400 transition-all shadow-md">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="badge bg-purple-100 text-purple-800 text-[10px] font-bold uppercase">
                      {addon.badge || addon.category}
                    </span>
                    <span className="text-sm font-extrabold text-amber-700 font-heading">
                      {formatRupees(addon.price_paise)}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 font-heading">
                    {addon.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {addon.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>Available on checkout</span>
                  <span className="text-emerald-700 font-semibold">Optional</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          DEDICATED FULL-WIDTH BOOKING SECTION
      ══════════════════════════════════════════ */}
      <section id="booking" className="py-12 sm:py-20 relative z-10 border-b border-slate-200 scroll-mt-20">
        <div className="container-page max-w-4xl">
          <div className="cyber-glass p-6 sm:p-10 rounded-2xl border border-purple-200 shadow-xl">
            <div className="text-center max-w-xl mx-auto mb-6">
              <span className="badge bg-purple-100 text-purple-800 border border-purple-200 text-xs px-3 py-1 font-bold">
                ONLINE RESERVATION
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2 font-heading">
                Reserve The <span className="text-gradient-purple">Dwarka Party Flat.</span>
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1.5">
                Select your celebration date and time slot below to reserve instantly.
              </p>
            </div>

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
      </section>

      {/* ══════════════════════════════════════════
          GUEST REVIEWS SECTION
      ══════════════════════════════════════════ */}
      <section id="reviews" className="py-12 sm:py-20 relative z-10 border-b border-slate-200">
        <div className="container-page">
          <VenueReviewsSection />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3D GALLERY & COMMUNITY PHOTO WALL
      ══════════════════════════════════════════ */}
      <section id="gallery" className="py-12 sm:py-20 relative z-10">
        <div className="container-page">
          <GuestPhotoWall />
        </div>
      </section>

      {/* Mobile Sticky Booking Bar */}
      <MobileBookingBar
        weekdayPricePaise={venue.weekday_price_paise}
        weekendPricePaise={venue.weekend_price_paise}
        bookingFormId="booking"
      />

    </main>
  );
}
