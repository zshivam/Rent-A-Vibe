import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Calendar, Key, ShieldCheck, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works | Venue-Based Experiences',
  description: 'Learn how Rent-A-Vibe works — browse pre-equipped spaces, book a private session, walk in, and enjoy.',
};

const steps = [
  {
    icon: Sparkles,
    step: '01',
    title: 'Choose Your Experience Space',
    desc: 'Browse private venues equipped with 4K laser cinemas, 240Hz LAN setups, soundproof karaoke pods, or stargazing decks.',
  },
  {
    icon: Calendar,
    step: '02',
    title: 'Reserve Slot & Unified Checkout',
    desc: 'Pick a 3-hour vibe slot, 6-hour prime session, or 12-hour day pass. Pay the rental fee and ₹2,000 refundable deposit in a single Razorpay payment.',
  },
  {
    icon: Key,
    step: '03',
    title: 'Walk In & Enjoy Pre-Setup Gear',
    desc: 'Arrive at the venue with your group. The space concierge has the climate control on, projectors calibrated, and refreshments ready.',
  },
  {
    icon: ShieldCheck,
    step: '04',
    title: 'Effortless Checkout & Deposit Refund',
    desc: 'When your session ends, simply hand over the space. Your ₹2,000 security deposit is automatically refunded within 12 hours post-inspection.',
  },
];

export default function HowItWorksPage() {
  return (
    <main className="container-page py-16 sm:py-20 space-y-16">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="badge bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs px-3 py-1 font-bold">
          Frictionless Experience
        </span>
        <h1 className="section-heading text-4xl sm:text-6xl font-extrabold text-white font-heading">
          How Rent-A-Vibe Works
        </h1>
        <p className="text-slate-300 text-base sm:text-lg font-medium">
          No gear to carry, no cables to untangle, no cleanup headaches. Step into a private, pre-equipped space built for your vibe.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {steps.map(({ icon: Icon, step, title, desc }) => (
          <div key={step} className="glass-card p-8 group hover:border-purple-500/50 transition-all border border-white/10 bg-slate-900/70 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-2xl bg-purple-950/80 border border-purple-500/30 text-purple-300 shrink-0 shadow-md">
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-purple-400 font-extrabold block">{step}</span>
                <h2 className="text-lg font-bold text-white font-heading">{title}</h2>
                <p className="text-slate-300 text-sm leading-relaxed font-medium">{desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-6">
        <Link href="/venues/the-dwarka-party-flat" className="btn-primary text-base px-10 py-4 shadow-xl inline-flex items-center gap-2 font-extrabold">
          Explore Available Spaces <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </main>
  );
}
