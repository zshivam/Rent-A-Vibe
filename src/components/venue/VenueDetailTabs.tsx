'use client';

import { useState } from 'react';
import {
  Mic2, Tv, Music, Lightbulb, BedDouble, Wifi,
  MapPin, Users, Clock, Shield, CheckCircle2,
  AlertTriangle, ChevronDown, ChevronUp, Key,
  Sparkles, MessageSquare, Sofa, Utensils, ShieldCheck,
  Star, Heart, Flame, Home, HelpCircle, FastForward, Check
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
    desc: 'Check yourself in smoothly with our keyless digital door lock.',
  },
  {
    icon: MapPin,
    title: 'Prime Dwarka Sector 19 Location',
    desc: '100% of recent guests gave this location a 5-star rating for privacy and connectivity.',
  },
  {
    icon: MessageSquare,
    title: 'Superhost Communication',
    desc: 'Host responds within 15 minutes to assist with all your party arrangements.',
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
    desc: '7-Seater Sofa · 100" Projector · Floor Cushions',
  },
];

const RATINGS_BREAKDOWN = [
  { label: 'Cleanliness', score: '5.0' },
  { label: 'Accuracy', score: '5.0' },
  { label: 'Check-in', score: '5.0' },
  { label: 'Communication', score: '5.0' },
  { label: 'Location', score: '5.0' },
  { label: 'Value', score: '5.0' },
];

type Tab = 'overview' | 'amenities' | 'sleeping' | 'rules';

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-slate-200">
        {HIGHLIGHTS.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="p-2 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 shrink-0 shadow-sm">
              <item.icon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 leading-tight font-heading">{item.title}</h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── TABS SELECTOR ── */}
      <div className="glass-card border border-slate-200 overflow-hidden shadow-sm">
        {/* Tab Strip */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          {(['overview', 'amenities', 'sleeping', 'rules'] as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? 'text-purple-700 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'overview' ? 'Overview' : tab === 'amenities' ? 'Amenities' : tab === 'sleeping' ? 'Sleeping Setup' : 'House Rules'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-5">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Location</p>
                  <p className="text-xs text-slate-900 font-bold">{area}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <Users className="w-4 h-4 text-purple-600" />
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Capacity</p>
                  <p className="text-xs text-slate-900 font-bold">{capacity_recommended} ideal (Max {capacity_max})</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Check-in</p>
                  <p className="text-xs text-slate-900 font-bold">Keyless Lockbox</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Deposit</p>
                  <p className="text-xs text-slate-900 font-bold">₹2,000 Refundable</p>
                </div>
              </div>

              {/* 6-Category Rating Grid */}
              <div className="pt-3 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                  Guest Rating Breakdown (5.0 ★ Average)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {RATINGS_BREAKDOWN.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-xs text-slate-700 font-medium">{r.label}</span>
                      <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" /> {r.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AMENITIES TAB */}
          {activeTab === 'amenities' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-fade-in">
              {AMENITIES.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div className="w-9 h-9 rounded-lg border border-purple-200 bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 leading-tight truncate">{item.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{item.desc}</p>
                  </div>
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-auto" />
                </div>
              ))}
            </div>
          )}

          {/* SLEEPING ARRANGEMENTS TAB */}
          {activeTab === 'sleeping' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
              {SLEEPING_ARRANGEMENTS.map((s, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center">
                    <s.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 font-heading">{s.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* RULES TAB */}
          {activeTab === 'rules' && (
            <div className="space-y-2.5 animate-fade-in">
              <p className="text-xs text-slate-700 font-bold uppercase tracking-wider mb-2">
                House Rules & Important Policies
              </p>
              {(rulesExpanded ? house_rules : house_rules.slice(0, 4)).map((rule, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-5 h-5 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{rule}</p>
                </div>
              ))}
              {house_rules.length > 4 && (
                <button
                  type="button"
                  onClick={() => setRulesExpanded(!rulesExpanded)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-purple-700 hover:text-purple-900"
                >
                  {rulesExpanded ? (
                    <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
                  ) : (
                    <><ChevronDown className="w-3.5 h-3.5" /> +{house_rules.length - 4} more rules</>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
