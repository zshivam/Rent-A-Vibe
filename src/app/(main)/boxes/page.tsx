import { getMockDeliveryKits } from '@/lib/mock-data';
import { formatRupees } from '@/types';
import Link from 'next/link';
import { Package, Sparkles, ArrowRight, Shield, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Doorstep Party Kits | Rent-A-Vibe',
  description: 'Affordable party equipment kits delivered to your doorstep. Karaoke, aesthetic neon lighting, birthday backdrops, and sound blasters.',
};

export default function DeliveryKitsPage() {
  const kits = getMockDeliveryKits();

  return (
    <div className="container-page py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
          <Package className="w-4 h-4 text-purple-400" /> Secondary Service · Doorstep Rental Kits
        </div>
        <h1 className="section-heading text-4xl sm:text-5xl font-extrabold text-white font-heading">
          Affordable Party Kits Delivered
        </h1>
        <p className="text-slate-300 max-w-2xl text-base font-medium">
          Hosting at your own home? Rent plug-and-play party equipment starting at just ₹499/day.
          Delivered, tested, and collected right from your doorstep.
        </p>
      </div>

      {/* Benefits banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 flex items-center gap-3 border border-white/10 bg-slate-900/80 shadow-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs text-slate-300 font-medium">
            <strong className="text-white font-bold">Affordable Rates:</strong> From ₹499/day, no expensive complex gear
          </p>
        </div>
        <div className="glass-card p-4 flex items-center gap-3 border border-white/10 bg-slate-900/80 shadow-md">
          <Shield className="w-5 h-5 text-purple-400 shrink-0" />
          <p className="text-xs text-slate-300 font-medium">
            <strong className="text-white font-bold">Low Deposit:</strong> ₹1,000 refundable security deposit
          </p>
        </div>
        <div className="glass-card p-4 flex items-center gap-3 border border-white/10 bg-slate-900/80 shadow-md">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-xs text-slate-300 font-medium">
            <strong className="text-white font-bold">Clean & Tested:</strong> Disinfected, sanitized, and ready to plug in
          </p>
        </div>
      </div>

      {/* Kits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {kits.map((kit) => (
          <div
            key={kit.id}
            className="group glass-card overflow-hidden hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between border border-white/10 bg-slate-900/70 shadow-xl"
          >
            <div>
              <div className="relative h-56 bg-slate-950 overflow-hidden border-b border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={kit.cover_image_url}
                  alt={kit.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  loading="lazy"
                />
                <span className="badge absolute top-3 left-3 bg-purple-600 text-white capitalize text-xs font-bold shadow-md">
                  {kit.category}
                </span>
                <span className="badge absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold border border-white/20 shadow-md">
                  ₹{kit.security_deposit_paise / 100} Deposit
                </span>
              </div>

              <div className="p-6 space-y-3">
                <h2 className="font-bold text-xl text-white group-hover:text-purple-300 transition-colors font-heading">
                  {kit.name}
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed font-medium">{kit.tagline}</p>

                <div className="space-y-1.5 pt-2">
                  <p className="text-xs font-bold text-slate-200">What&apos;s Included:</p>
                  <ul className="space-y-1">
                    {kit.contents.map((item, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-center gap-2 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <span>{item.name} (×{item.quantity})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 pt-3 border-t border-white/10 mt-4 flex items-center justify-between">
              <div>
                <p className="text-purple-300 font-black text-2xl font-heading">
                  {formatRupees(kit.price_per_day_paise)}
                </p>
                <p className="text-slate-400 text-[11px] font-medium">per 24-hr rental</p>
              </div>
              <a
                href={`https://wa.me/919876543210?text=Hi%20Rent-A-Vibe!%20I%20want%20to%20rent%20the%20${encodeURIComponent(kit.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs px-4 py-2.5 inline-flex items-center gap-1.5 font-bold"
              >
                Order on WhatsApp <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
