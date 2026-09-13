import Link from 'next/link';
import { Github, Instagram, Twitter } from 'lucide-react';

const links = {
  product: [
    { label: 'Explore 2BHK Flat', href: '/venues/the-dwarka-party-flat' },
    { label: 'Doorstep Party Kits', href: '/boxes' },
    { label: 'How it Works',   href: '/how-it-works' },
    { label: 'My Bookings',    href: '/dashboard' },
  ],
  support: [
    { label: 'Dwarka Sec 19 Flat', href: '/venues/the-dwarka-party-flat' },
    { label: 'Instant Reserve',    href: '/venues/the-dwarka-party-flat#booking' },
    { label: 'Host Contact',       href: 'https://wa.me/919999999999' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#06070b] mt-16 sm:mt-24 text-slate-300 relative z-10">
      <div className="container-page py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="col-span-2 space-y-4">
            <div>
              <p className="font-extrabold text-xl sm:text-2xl text-gradient-purple mb-1 font-heading">
                Rent-A-Vibe
              </p>
              <p className="text-xs text-purple-400 font-bold tracking-widest uppercase">
                Premier Party Flat · Dwarka Sec 19
              </p>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xs leading-relaxed font-medium">
              Delhi NCR's premier pre-equipped party flat. Dual wireless karaoke stage, 100" HD Cinema & 160W Sound tower for up to 22 guests.
            </p>
            <div className="flex gap-3 pt-2">
              {[
                { Icon: Instagram, href: 'https://instagram.com', label: 'instagram' },
                { Icon: Twitter,   href: 'https://twitter.com', label: 'twitter' },
                { Icon: Github,    href: 'https://github.com/zshivam/Rent-A-Vibe', label: 'github' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-purple-300 hover:border-purple-500/40 hover:bg-purple-500/10 transition-all shadow-sm"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-heading">
                {title}
              </p>
              <ul className="space-y-3">
                {items.map((item) => (
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
          ))}
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-xs font-medium">
            © {new Date().getFullYear()} Rent-A-Vibe. All rights reserved.
          </p>
          <p className="text-slate-400 text-xs font-medium">
            Payments secured by Razorpay · Dwarka Sector 19, New Delhi
          </p>
        </div>
      </div>
    </footer>
  );
}
