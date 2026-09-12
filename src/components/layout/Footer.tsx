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
    <footer className="border-t border-slate-200 bg-white mt-16 sm:mt-24 text-slate-700">
      <div className="container-page py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="col-span-2">
            <p className="font-extrabold text-xl sm:text-2xl text-gradient-purple mb-3 font-heading">Rent-A-Vibe</p>
            <p className="text-slate-600 text-xs sm:text-sm max-w-xs leading-relaxed font-medium">
              Premier pre-equipped party flat in Dwarka Sector 19, New Delhi. Dual wireless karaoke, 100" HD Cinema & 160W Sound for up to 22 guests.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { Icon: Instagram, href: 'https://instagram.com', label: 'instagram' },
                { Icon: Twitter,   href: 'https://twitter.com', label: 'twitter' },
                { Icon: Github,    href: 'https://github.com/zshivam/Rent-A-Vibe', label: 'github' },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-purple-700 hover:border-purple-300 hover:bg-purple-50 transition-colors shadow-sm">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 font-heading">
                {title}
              </p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}
                      className="text-xs sm:text-sm text-slate-600 hover:text-purple-700 font-medium transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs font-medium">
            © {new Date().getFullYear()} Rent-A-Vibe. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs font-medium">
            Payments secured by Razorpay · Dwarka Sector 19, New Delhi
          </p>
        </div>
      </div>
    </footer>
  );
}

