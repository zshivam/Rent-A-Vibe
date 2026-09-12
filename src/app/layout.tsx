import type { Metadata, Viewport } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0b0b12',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://rentavibe.in'),
  title: {
    default: 'Rent-A-Vibe — Party Flat & Venue Booking in Delhi',
    template: '%s | Rent-A-Vibe',
  },
  description:
    'Book the 2BHK party flat in Dwarka Sector 19, Delhi. Pre-equipped with Karaoke, 100" Cinema, DJ Sound, Neon Lounge & AC Bedrooms for 15–22 guests.',
  keywords: ['party flat', 'venue booking', 'Delhi party venue', '2BHK venue', 'karaoke flat', 'event venue Dwarka', 'birthday party venue Delhi'],
  openGraph: {
    type:        'website',
    siteName:    'Rent-A-Vibe',
    title:       'Rent-A-Vibe — Party Flat & Venue in Dwarka, Delhi',
    description: 'Book our 2BHK party flat with karaoke, cinema projector, DJ sound & overnight stay.',
  },
  robots: { index: true, follow: true },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${jakarta.variable} dark`} data-scroll-behavior="smooth">
      <body className="bg-surface text-slate-100 antialiased font-sans selection:bg-brand-500/30 selection:text-white flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
