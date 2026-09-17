'use client';

import { useState } from 'react';
import {
  Mic2, Tv, Music, Lightbulb, BedDouble, Wifi,
  MapPin, Users, Clock, Shield, CheckCircle2,
  AlertTriangle, ChevronDown, ChevronUp, Key,
  Sparkles, MessageSquare, Sofa, Utensils, ShieldCheck,
  Star, Heart, Flame, Home, HelpCircle, Check, LogIn, LogOut, FileText, Lock
} from 'lucide-react';

interface VenueDetailTabsProps {
  capacity_max: number;
  capacity_recommended: number;
  area: string;
  full_address?: string;
  house_rules: string[];
}

const AMENITIES = [
  { icon: Mic2,      label: 'Dual Wireless Karaoke Mics',    desc: 'UHF with digital reverb & echo filters', color: 'purple' },
  { icon: Tv,        label: '100" HD Cinema Projector',       desc: 'Netflix, Hotstar & YouTube included',   color: 'blue'   },
  { icon: Music,     label: '160W Party Sound Tower',         desc: 'High-bass bluetooth sound zone',        color: 'pink'   },
  { icon: Lightbulb, label: 'Neon Sign & Fairy Lights',       desc: '"Good Vibes" neon + warm canopy',       color: 'amber'  },
  { icon: BedDouble, label: '2 AC Master Bedrooms',           desc: 'Queen beds + attached geyser baths',    color: 'teal'   },
  { icon: Wifi,      label: '300 Mbps Fiber Wi-Fi',           desc: 'Power inverter backup + board games',   color: 'green'  },
  { icon: Utensils,  label: 'BYOF Buffet Warmer Station',    desc: 'Chafing dishes & dinnerware available',  color: 'purple' },
  { icon: Key,       label: 'Keyless Self Check-In',         desc: 'Digital lock access code upon arrival',  color: 'amber'  },
];

const HIGHLIGHTS = [
  {
    icon: Key,
    title: 'Keyless Self Check-In',
    desc: 'Check yourself in smoothly with our keyless digital keypad door lock.',
  },
  {
    icon: MapPin,
    title: 'Prime Dwarka Sector 19 Location',
    desc: '100% of recent guests gave this location a 5-star rating for privacy and metro connectivity.',
  },
  {
    icon: MessageSquare,
    title: 'Instant Host Communication',
    desc: 'Dedicated venue manager responds within 15 minutes to assist with party setup & entry.',
  },
];

const CHECKIN_OUT_POLICIES = [
  {
    icon: LogIn,
    title: 'Check-In Window',
    primary: '7:00 PM (Evening Slot) / 1:00 PM (Day Slot)',
    detail: 'Keyless keypad code generated automatically after guest KYC verification.',
  },
  {
    icon: LogOut,
    title: 'Check-Out Window',
    primary: '6:00 AM (Overnight) / 11:00 AM (Next Day)',
    detail: 'Self check-out: Simply lock the digital door on departure.',
  },
  {
    icon: Shield,
    title: 'Refundable Security Deposit',
    primary: '₹2,000 Refundable Deposit',
    detail: 'Held during stay & refunded via UPI/Bank within 12 hours post-inspection.',
  },
  {
    icon: FileText,
    title: 'Cancellation & Refund Policy',
    primary: '100% Refund up to 48 Hours Prior',
    detail: '50% refund if cancelled 24–48 hours prior to check-in. Instant online processing.',
  },
];

const SLEEPING_ARRANGEMENTS = [
  {
    icon: BedDouble,
    title: 'Master Bedroom 1',
    desc: '1 Hotel-grade Queen Bed · AC · Attached Geyser Bath',
  },
  {
    icon: BedDouble,
    title: 'Master Bedroom 2',
    desc: '1 Hotel-grade Queen Bed · AC · Fresh Linen & Wardrobe',
  },
  {
    icon: Sofa,
    title: 'Cinema Living Arena',
    desc: '7-Seater Sofa · 100" Projector · Floor Cushions & Poufs',
  },
];

const RATINGS_BREAKDOWN = [
  { label: 'Cleanliness & Hygiene', score: '5.0' },
  { label: 'Listing Accuracy', score: '5.0' },
  { label: 'Keyless Check-In', score: '5.0' },
  { label: 'Host Communication', score: '5.0' },
  { label: 'Location & Parking', score: '5.0' },
  { label: 'Value for Money', score: '5.0' },
];

type Tab = 'overview' | 'amenities' | 'policies' | 'rules' | 'sleeping';

export function VenueDetailTabs({
  capacity_max,
  capacity_recommended,
  area,
  full_address,
  house_rules,
}: VenueDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [rulesExpanded, setRulesExpanded] = useState(false);

  return (
    <div className="space-y-6">

      {/* ── HIGHLIGHTS BANNER (Airbnb Luxe Style) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-white/10">
        {HIGHLIGHTS.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-white/10">
            <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 shrink-0 shadow-md">
              <item.icon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white leading-tight font-heading">{item.title}</h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── TABS SELECTOR ── */}
      <div className="glass-card border border-white/10 overflow-hidden shadow-xl bg-slate-950/80 rounded-2xl">
        {/* Tab Strip */}
        <div className="flex border-b border-white/10 bg-slate-950 overflow-x-auto scrollbar-none">
          {(
            [
              { id: 'overview', label: 'Overview' },
              { id: 'policies', label: 'Check-In & Policies' },
              { id: 'rules', label: 'House Rules' },
              { id: 'amenities', label: 'Amenities' },
              { id: 'sleeping', label: 'Sleeping Setup' },
            ] as { id: Tab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-3 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'text-purple-300 border-b-2 border-purple-500 bg-purple-950/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-5">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-1">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Location</p>
                  <p className="text-xs text-white font-bold">{area}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-1">
                  <Users className="w-4 h-4 text-purple-400" />
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Capacity</p>
                  <p className="text-xs text-white font-bold">{capacity_recommended} ideal (Max {capacity_max})</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-1">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Check-in</p>
                  <p className="text-xs text-white font-bold">Keyless Lockbox</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 space-y-1">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Deposit</p>
                  <p className="text-xs text-white font-bold">₹2,000 Refundable</p>
                </div>
              </div>

              {/* Business Model Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1.5">
                  <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5 font-heading">
                    <ShieldCheck className="w-4 h-4 text-purple-400" /> Official Direct Venue Booking
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                    Book directly on our official site to skip third-party service commissions. Guaranteed instant reservation confirmation and direct venue manager assistance.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
                  <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5 font-heading">
                    <Lock className="w-4 h-4 text-emerald-400" /> Deposit Protection & Instant Refund
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                    Your ₹2,000 security deposit is safely held during your stay and automatically refunded post-inspection via UPI or net banking.
                  </p>
                </div>
              </div>

              {/* 6-Category Rating Grid */}
              <div className="pt-3 border-t border-white/10">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Guest Rating Breakdown (5.0 ★ Average)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {RATINGS_BREAKDOWN.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-white/10">
                      <span className="text-xs text-slate-300 font-medium">{r.label}</span>
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {r.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CHECK-IN & POLICIES TAB */}
          {activeTab === 'policies' && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                Check-In, Check-Out & Refund Business Policies
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CHECKIN_OUT_POLICIES.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-950/80 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <h5 className="text-xs font-bold text-white font-heading">{item.title}</h5>
                      </div>
                      <p className="text-xs font-bold text-purple-300 pl-9">{item.primary}</p>
                      <p className="text-[11px] text-slate-400 pl-9 leading-relaxed font-medium">{item.detail}</p>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-2 text-xs text-slate-300">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-400" /> Government ID & Safety Guidelines
                </p>
                <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-400 font-medium">
                  <li>Primary booking guest must upload a valid Govt ID (Aadhaar / Driving License / Passport) prior to check-in.</li>
                  <li>Digital door passcode is activated 1 hour prior to your scheduled check-in window.</li>
                  <li>Complimentary high-speed fiber Wi-Fi and inverter power backup included.</li>
                </ul>
              </div>
            </div>
          )}

          {/* HOUSE RULES TAB */}
          {activeTab === 'rules' && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-xs text-slate-300 font-bold uppercase tracking-wider mb-2">
                Venue House Rules & Community Guidelines
              </p>
              {(rulesExpanded ? house_rules : house_rules.slice(0, 5)).map((rule, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-900/80 border border-white/10">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{rule}</p>
                </div>
              ))}
              {house_rules.length > 5 && (
                <button
                  type="button"
                  onClick={() => setRulesExpanded(!rulesExpanded)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-purple-300 hover:text-white cursor-pointer"
                >
                  {rulesExpanded ? (
                    <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
                  ) : (
                    <><ChevronDown className="w-3.5 h-3.5" /> +{house_rules.length - 5} more rules</>
                  )}
                </button>
              )}
            </div>
          )}

          {/* AMENITIES TAB */}
          {activeTab === 'amenities' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-fade-in">
              {AMENITIES.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-white/10"
                >
                  <div className="w-9 h-9 rounded-lg border border-purple-500/30 bg-purple-950/80 flex items-center justify-center text-purple-300 shrink-0">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white leading-tight truncate">{item.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{item.desc}</p>
                  </div>
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-auto" />
                </div>
              ))}
            </div>
          )}

          {/* SLEEPING ARRANGEMENTS TAB */}
          {activeTab === 'sleeping' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
              {SLEEPING_ARRANGEMENTS.map((s, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 flex items-center justify-center">
                    <s.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-white font-heading">{s.title}</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-medium">{s.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

