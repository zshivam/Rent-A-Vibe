import Link from 'next/link';
import { Instagram, Youtube, MapPin, MessageCircle, Phone, ShieldCheck, Lock, FileText, CheckCircle } from 'lucide-react';

const LINKS = {
  navigation: [
    { label: 'Explore 2BHK Flat', href: '/venues/the-dwarka-party-flat' },
    { label: 'Check-In & Rules', href: '/how-it-works' },
    { label: 'My Bookings & KYC', href: '/dashboard' },
    { label: 'Instant Reserve',    href: '/#booking' },
  ],
  policies: [
    { label: 'Refundable Deposit Policy', href: '/how-it-works#deposit' },
    { label: 'Keyless Self Check-In',     href: '/how-it-works#checkin' },
    { label: 'House Rules & Noise Policy', href: '/venues/the-dwarka-party-flat#overview' },
    { label: 'Cancellation & Refunds',     href: '/how-it-works#cancellation' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#06070b] mt-16 sm:mt-24 text-slate-300 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand & Official Venue Info Column */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl text-gradient-purple font-heading">
                  Rent-A-Vibe
                </span>
                <span className="bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">
                  Official Venue Site
                </span>
              </div>
              <p className="text-xs text-purple-400 font-bold tracking-wider uppercase mt-1">
                Luxury 2BHK Party Flat & Penthouse · Dwarka Sec 19, New Delhi
              </p>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed font-medium">
              Delhi NCR's official pre-equipped celebration flat. Dual wireless karaoke stage, 100" HD Cinema Projector & 160W Sound tower pre-installed for 15–22 guests.
            </p>

            {/* Official Social Media & Location Hub */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-bold text-slate-300 hover:text-pink-400 hover:border-pink-500/40 transition-all shadow-sm"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>Instagram</span>
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-bold text-slate-300 hover:text-red-400 hover:border-red-500/40 transition-all shadow-sm"
              >
                <Youtube className="w-4 h-4 text-red-500" />
                <span>YouTube Tour</span>
              </a>

              <a
                href="https://maps.google.com/?q=Dwarka+Sector+19+Delhi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-bold text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-all shadow-sm"
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Google Maps Location</span>
              </a>

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-bold text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Host</span>
              </a>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div>
            <p className="text-xs font-extrabold text-white uppercase tracking-wider mb-4 font-heading">
              Venue Portal
            </p>
            <ul className="space-y-3">
              {LINKS.navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-xs sm:text-sm text-slate-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Model Policies Column */}
          <div>
            <p className="text-xs font-extrabold text-white uppercase tracking-wider mb-4 font-heading">
              Check-In & Policies
            </p>
            <ul className="space-y-3">
              {LINKS.policies.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-xs sm:text-sm text-slate-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Business Badges & Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-purple-400" /> Verified 2BHK Property
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Lock className="w-4 h-4 text-emerald-400" /> Razorpay Secured Booking
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle className="w-4 h-4 text-amber-400" /> 100% Deposit Refund Guarantee
            </span>
          </div>

          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} Rent-A-Vibe Stays. Sector 19, Dwarka, New Delhi 110075.
          </p>
        </div>
      </div>
    </footer>
  );
}

