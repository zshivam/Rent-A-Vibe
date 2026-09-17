'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FLAGSHIP_VENUE, getMockDeliveryKits } from '@/lib/mock-data';
import { VenueBookingForm } from '@/components/booking/VenueBookingForm';
import { BookingModal } from '@/components/booking/BookingModal';
import { InquiryModal } from '@/components/booking/InquiryModal';
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
  Activity,
  Sliders,
  CheckCircle,
} from 'lucide-react';

// ── Section-by-Section Navigation Config ─────────────────────────
const SECTION_LINKS = [
  { id: 'overview', label: '01. Overview',        icon: Home },
  { id: 'specs',    label: '02. Specifications',  icon: Info },
  { id: 'included', label: '03. Experience Zones',icon: Sparkles },
  { id: 'booking',  label: '04. Instant Book',    icon: Calendar },
  { id: 'addons',   label: '05. Party Add-Ons',    icon: Utensils },
  { id: 'reviews',  label: '06. Guest Reviews',    icon: Star },
  { id: 'gallery',  label: '07. Photo Gallery',    icon: Camera },
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
    tag: 'Wi-Fi & Board Games',
    title: '300 Mbps Wi-Fi & Board Games Lounge',
    desc: 'High-speed 300 Mbps fiber internet, full power inverter backup, Uno, Jenga, Playing Cards & classic board games included.',
    badge: '100% INCLUDED',
    image: '/images/boxes/rooftop-chill.jpg',
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
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
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
      setNavSticky(window.scrollY > 280);
      for (const { id } of [...SECTION_LINKS].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 160) {
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
    <main className="relative overflow-x-hidden pb-24 sm:pb-0 bg-[#08090e] text-white">

      {/* ── AMBIENT CANVAS BACKGROUND ── */}
      <PartyVibeCanvas />

      {/* ── BOOKING & INQUIRY MODALS ── */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        venue={venue}
      />
      <InquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        venueName={venue.name}
      />

      {/* ── STICKY SECTION DOCK / QUICK-NAV ── */}
      <div
        className={`fixed top-16 sm:top-20 left-0 right-0 z-40 transition-all duration-300 ${
          navSticky ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-slate-950/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
          <div className="container-page flex items-center justify-between py-2.5 overflow-x-auto scrollbar-none gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {SECTION_LINKS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollTo(id)}
                  className={`text-[11px] font-bold px-3.5 py-1.5 rounded-full border whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeSection === id
                      ? 'bg-purple-600 border-purple-500 text-white shadow-md'
                      : 'bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:border-purple-500/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollTo('booking')}
              className="btn-primary text-xs py-1.5 px-4 rounded-xl shrink-0 hidden sm:inline-flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Reserve Venue</span>
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 01: VENUE OVERVIEW & HIGHLIGHTS
      ══════════════════════════════════════════ */}
      <section id="overview" className="relative z-10 pt-4 sm:pt-8 pb-12 sm:pb-20 border-b border-white/10">
        
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] sm:w-[850px] h-[320px] sm:h-[850px] rounded-full bg-purple-600/15 blur-[150px] pointer-events-none" />

        <div className="container-page relative z-10 space-y-6">

          {/* Live Venue Status Bar */}
          <div className="glass-card p-3 sm:p-3.5 border border-purple-500/30 bg-purple-950/40 backdrop-blur-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5 text-xs font-bold">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <span className="text-white tracking-wide font-mono uppercase">
                FLAT STATUS: <strong className="text-emerald-400">ONLINE & READY TODAY</strong>
              </span>
              <span className="hidden md:inline text-slate-400 font-normal">|</span>
              <span className="hidden md:inline text-slate-300 font-medium">
                Dual Karaoke, 100" Cinema & AC Master Beds Disinfected
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 text-[11px] font-bold text-purple-300">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Pre-Equipped Venue · Keyless Self Check-In</span>
            </div>
          </div>
          
          {/* Header Title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="badge bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] sm:text-xs font-bold">
                  01. VENUE OVERVIEW
                </span>
                <span className="badge bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] sm:text-xs font-bold">
                  DWARKA SECTOR 19 · NEW DELHI
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-heading leading-[1.1]">
                The Dwarka Party Flat | <span className="text-gradient-purple">Private 2BHK & Sound Zone.</span>
              </h1>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300 pt-1 font-medium flex-wrap">
                <span className="flex items-center gap-1 font-bold text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> 5.0 ★ Rating (180+ Celebrations Hosted)
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" /> 5 Mins from Metro · Dwarka Sec 19
                </span>
                <span>·</span>
                <span className="text-emerald-400 font-bold">Keyless Lockbox Check-in</span>
              </div>
            </div>

            {/* Share, Save & Direct Inquiry Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={() => setInquiryModalOpen(true)}
                className="py-2.5 px-4 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-xs font-bold text-purple-200 flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-purple-400" />
                <span>Ask Host / Inquire</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="btn-ghost text-xs py-2.5 px-4 flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-slate-300" />
                <span>{copied ? 'Link Copied!' : 'Share Page'}</span>
              </button>
              <button
                type="button"
                onClick={() => setSaved(!saved)}
                className={`btn-ghost text-xs py-2.5 px-4 flex items-center gap-1.5 cursor-pointer ${
                  saved ? 'text-pink-400 border-pink-500/40 bg-pink-500/10' : ''
                }`}
              >
                <Heart className={`w-4 h-4 ${saved ? 'fill-pink-500 text-pink-500' : ''}`} />
                <span>{saved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>

          {/* Key Venue Features Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { icon: Music, label: 'Wireless Karaoke', desc: 'Dual UHF Reverb Mics' },
              { icon: Tv,    label: '100" HD Cinema',   desc: 'Smart 1080p Projector' },
              { icon: Disc,  label: '160W Sound Box',   desc: 'High-Bass Bluetooth' },
              { icon: Zap,   label: 'Neon Lounge',      desc: 'Dimmable Ambient Lights' },
              { icon: BedDouble, label: '2 Master Beds', desc: 'AC + Attached Baths' },
            ].map(({ icon: Icon, label, desc }, idx) => (
              <div key={idx} className="glass-card p-3.5 border border-white/10 bg-slate-900/80 space-y-1">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium">{desc}</p>
              </div>
            ))}
          </div>

          {/* Venue Photo Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 aspect-auto sm:aspect-[16/8] rounded-2xl overflow-hidden border border-white/10 relative shadow-2xl bg-slate-950">
            
            {/* Main Cover Photo (Left 7 cols) */}
            <div className="md:col-span-7 relative group aspect-video md:aspect-auto h-full overflow-hidden bg-slate-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={venue.cover_image_url}
                alt={venue.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="badge bg-slate-950/80 backdrop-blur-md text-white border border-white/20 text-xs font-bold shadow-md">
                  Living Room & Karaoke Stage
                </span>
              </div>
            </div>

            {/* Right Thumbnails Grid (Right 5 cols) */}
            <div className="hidden md:grid md:col-span-5 grid-cols-2 gap-3 h-full">
              {venue.gallery_urls.slice(1, 5).map((imgUrl, idx) => (
                <div key={idx} className="relative group overflow-hidden bg-slate-950 h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt="Interior view"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>

            {/* "Show all photos" Button */}
            <button
              type="button"
              onClick={() => scrollTo('gallery')}
              className="absolute bottom-4 right-4 bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md text-white border border-white/20 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xl transition-all cursor-pointer"
            >
              <Grid className="w-4 h-4 text-purple-400" />
              <span>Show all 12 photos</span>
            </button>
          </div>

          {/* Main Stage Grid: Venue Specs LEFT + Sticky Reservation Widget RIGHT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">

            {/* ── LEFT COLUMN: Flat Overview & Specs Summary ── */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Flat Meta Summary */}
              <div id="specs" className="scroll-mt-24 space-y-4">
                <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                  <div>
                    <span className="badge bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold mb-1">
                      02. SPECIFICATIONS & RULES
                    </span>
                    <h2 className="text-xl font-bold text-white font-heading">
                      Property Blueprint & Guest Capacity
                    </h2>
                    <p className="text-xs text-slate-300 mt-1 font-medium">
                      15–22 guests · 2 AC Master Bedrooms · 3 Queen Beds · 2 Bathrooms · Private Terrace
                    </p>
                  </div>
                </div>

                {/* Venue Detail Tabs */}
                <VenueDetailTabs
                  capacity_max={venue.capacity_max}
                  capacity_recommended={venue.capacity_recommended}
                  area={venue.area}
                  full_address={venue.full_address}
                  house_rules={venue.house_rules}
                />
              </div>

            </div>

            {/* ── RIGHT COLUMN: Sticky Reservation Widget ── */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="cyber-glass p-6 rounded-2xl border border-purple-500/30 shadow-2xl space-y-5">
                
                {/* Pricing & Rating Header */}
                <div className="border-b border-white/10 pb-4 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-3xl font-extrabold text-white font-heading">
                        {formatRupees(venue.weekday_price_paise)}
                      </span>
                      <span className="text-xs text-slate-400 ml-1">/ afternoon slot</span>
                    </div>
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> 5.0 · 180+ Reviews
                    </span>
                  </div>

                  <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Reserve date with ₹1,000 token
                  </p>
                </div>

                {/* Date & Guest Box summary */}
                <div className="rounded-xl border border-white/10 bg-slate-950/80 overflow-hidden text-xs">
                  <div className="grid grid-cols-2 border-b border-white/10 divide-x divide-white/10">
                    <div className="p-3">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">CHECK-IN</span>
                      <span className="text-white font-semibold">Flexible / 1:00 PM</span>
                    </div>
                    <div className="p-3">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">CHECKOUT</span>
                      <span className="text-white font-semibold">6:00 PM / Next Morning</span>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">GUESTS</span>
                      <span className="text-white font-semibold">Up to 22 guests allowed</span>
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

                <p className="text-center text-[11px] text-slate-400">
                  You won't be charged full amount yet. ₹1,000 locks your date.
                </p>

                {/* Quick WhatsApp enquiry */}
                <a
                  href="https://wa.me/919999999999?text=Hi%20Rent-A-Vibe!%20I%20want%20to%20enquire%20about%20booking%20the%20Dwarka%20Party%20Flat."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost w-full border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 text-xs py-2.5 flex items-center justify-center gap-1.5 text-center font-semibold"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Enquire on WhatsApp</span>
                </a>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 03: EXPERIENCE ZONES SECTION
      ══════════════════════════════════════════ */}
      <section id="included" className="py-12 sm:py-20 relative z-10 border-b border-white/10 scroll-mt-20">
        <div className="container-page">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <span className="badge bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs px-3 py-1 font-bold">
                03. PRE-INSTALLED HARDWARE
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2 font-heading">
                6 Immersive <span className="text-gradient-purple">Experience Zones.</span>
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1.5">
                Every zone inside the flat is tested, tuned, and 100% included in your rental price.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollSection(zonesRef, 'left')}
                className="p-3 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:border-purple-500 hover:text-white transition-colors shadow-sm cursor-pointer"
                aria-label="Previous zone"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollSection(zonesRef, 'right')}
                className="p-3 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:border-purple-500 hover:text-white transition-colors shadow-sm cursor-pointer"
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
                  <div className="cyber-glass rounded-2xl overflow-hidden border border-white/10 h-full flex flex-col group hover:border-purple-500/50 transition-all duration-300 shadow-xl">
                    
                    {/* Image header */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={zone.image}
                        alt={zone.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                      
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="badge bg-purple-600 text-white font-bold text-[10px] shadow-md">
                          {zone.tag}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/20 flex items-center justify-center text-purple-300 shadow-md">
                          <IconComp className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm">
                          {zone.badge}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-bold text-lg text-white font-heading group-hover:text-purple-300 transition-colors">
                          {zone.title}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed mt-1.5">
                          {zone.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold text-purple-400">
                        <span>Included with stay</span>
                        <Check className="w-4 h-4 text-emerald-400" />
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
          SECTION 04: DEDICATED DIRECT BOOKING CONTROL PANEL
      ══════════════════════════════════════════ */}
      <section id="booking" className="py-12 sm:py-20 relative z-10 border-b border-white/10 scroll-mt-20">
        <div className="container-page max-w-4xl">
          <div className="cyber-glass p-6 sm:p-10 rounded-2xl border border-purple-500/30 shadow-2xl">
            <div className="text-center max-w-xl mx-auto mb-6">
              <span className="badge bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs px-3 py-1 font-bold">
                04. INSTANT RESERVATION
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-2 font-heading">
                Reserve The <span className="text-gradient-purple">Dwarka Party Flat.</span>
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1.5">
                Select your celebration date and time slot below to lock your reservation directly.
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
          SECTION 05: ADD-ONS & CATERING
      ══════════════════════════════════════════ */}
      <section id="addons" className="py-12 sm:py-20 relative z-10 border-b border-white/10 scroll-mt-20">
        <div className="container-page">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="badge bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs px-3 py-1 font-bold">
              05. OPTIONAL EVENT PACKS
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2 font-heading">
              Curated Event <span className="text-gradient-purple">Add-Ons.</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-2">
              Select optional dining and decor packs during checkout for your celebration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {VENUE_ADD_ONS.map((addon) => (
              <div key={addon.id} className="cyber-glass p-5 rounded-2xl border border-white/10 h-full flex flex-col justify-between space-y-4 hover:border-purple-500/50 transition-all shadow-xl">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="badge bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase">
                      {addon.badge || addon.category}
                    </span>
                    <span className="text-sm font-extrabold text-amber-400 font-heading">
                      {formatRupees(addon.price_paise)}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-white font-heading">
                    {addon.name}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {addon.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>Available on checkout</span>
                  <span className="text-emerald-400 font-semibold">Optional</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 06: GUEST REVIEWS
      ══════════════════════════════════════════ */}
      <section id="reviews" className="py-12 sm:py-20 relative z-10 border-b border-white/10 scroll-mt-20">
        <div className="container-page">
          <VenueReviewsSection />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 07: COMMUNITY PHOTO WALL
      ══════════════════════════════════════════ */}
      <section id="gallery" className="py-12 sm:py-20 relative z-10 scroll-mt-20">
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
