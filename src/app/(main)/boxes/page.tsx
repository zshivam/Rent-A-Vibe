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
        <div className="flex items-center gap-2 text-purple-700 text-xs font-bold uppercase tracking-wider">
          <Package className="w-4 h-4 text-purple-600" /> Secondary Service · Doorstep Rental Kits
        </div>
        <h1 className="section-heading text-4xl sm:text-5xl font-extrabold text-slate-900 font-heading">
          Affordable Party Kits Delivered
        </h1>
        <p className="text-slate-600 max-w-2xl text-base font-medium">
          Hosting at your own home? Rent plug-and-play party equipment starting at just ₹499/day.
          Delivered, tested, and collected right from your doorstep.
        </p>
      </div>

      {/* Benefits banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 flex items-center gap-3 border border-slate-200 bg-white shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs text-slate-700 font-medium">
            <strong className="text-slate-900 font-bold">Affordable Rates:</strong> From ₹499/day, no expensive complex gear
          </p>
        </div>
        <div className="glass-card p-4 flex items-center gap-3 border border-slate-200 bg-white shadow-sm">
          <Shield className="w-5 h-5 text-purple-600 shrink-0" />
          <p className="text-xs text-slate-700 font-medium">
            <strong className="text-slate-900 font-bold">Low Deposit:</strong> ₹1,000 refundable security deposit
          </p>
        </div>
        <div className="glass-card p-4 flex items-center gap-3 border border-slate-200 bg-white shadow-sm">
          <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-xs text-slate-700 font-medium">
            <strong className="text-slate-900 font-bold">Clean & Tested:</strong> Disinfected, sanitized, and ready to plug in
          </p>
        </div>
      </div>

      {/* Kits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {kits.map((kit) => (
          <div
            key={kit.id}
            className="group glass-card overflow-hidden hover:border-purple-400 transition-all duration-300 flex flex-col justify-between border border-slate-200 bg-white shadow-sm"
          >
            <div>
              <div className="relative h-56 bg-slate-100 overflow-hidden border-b border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={kit.cover_image_url}
                  alt={kit.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="badge absolute top-3 left-3 bg-purple-600 text-white capitalize text-xs font-bold shadow-sm">
                  {kit.category}
                </span>
                <span className="badge absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold border border-slate-200 shadow-sm">
                  ₹{kit.security_deposit_paise / 100} Deposit
                </span>
              </div>

              <div className="p-6 space-y-3">
                <h2 className="font-bold text-xl text-slate-900 group-hover:text-purple-700 transition-colors font-heading">
                  {kit.name}
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">{kit.tagline}</p>

                <div className="space-y-1.5 pt-2">
                  <p className="text-xs font-bold text-slate-700">What&apos;s Included:</p>
                  <ul className="space-y-1">
                    {kit.contents.map((item, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-center gap-2 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                        <span>{item.name} (×{item.quantity})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 pt-3 border-t border-slate-200 mt-4 flex items-center justify-between">
              <div>
                <p className="text-purple-700 font-black text-2xl font-heading">
                  {formatRupees(kit.price_per_day_paise)}
                </p>
                <p className="text-slate-500 text-[11px] font-medium">per 24-hr rental</p>
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
