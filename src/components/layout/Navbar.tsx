'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { getStoredDemoUser, clearStoredDemoUser, DemoUser } from '@/lib/auth-helpers';
import { 
  Zap, 
  Home, 
  Package, 
  HelpCircle, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  Calendar
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SupabaseUser | DemoUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let subscription: any = null;

    const syncUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setUser(data.user);
          return;
        }
      } catch {
        // ignore
      }

      const demo = getStoredDemoUser();
      if (demo) {
        setUser(demo);
      } else {
        setUser(null);
      }
    };

    syncUser();

    try {
      const authRes = supabase.auth.onAuthStateChange((_event: any, session: any) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          const demo = getStoredDemoUser();
          setUser(demo);
        }
      });
      subscription = authRes?.data?.subscription;
    } catch {
      // ignore
    }

    const handleCustomAuthChange = () => {
      syncUser();
    };

    window.addEventListener('rentavibe_auth_change', handleCustomAuthChange);

    return () => {
      subscription?.unsubscribe?.();
      window.removeEventListener('rentavibe_auth_change', handleCustomAuthChange);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    clearStoredDemoUser();
    setUser(null);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  const userEmail = (user as any)?.email || '';
  const userInitial = userEmail ? userEmail[0].toUpperCase() : 'U';

  const navLinks = [
    { href: '/', label: 'Overview', icon: Home },
    { href: '/boxes', label: 'Party Kits', icon: Package },
    { href: '/how-it-works', label: 'How It Works', icon: HelpCircle },
    { href: '/dashboard', label: 'My Bookings', icon: LayoutDashboard },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl shadow-xl transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-400 p-0.5 shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-400 fill-purple-400/20 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-purple-300 transition-colors">
                  Rent-A-Vibe
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 border border-purple-500/30 text-purple-300 tracking-wide uppercase">
                  Dwarka Sec 19
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium tracking-wide hidden sm:block -mt-0.5">
                Luxury 2BHK Party Flat · New Delhi
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-slate-900/60 border border-white/5 p-1 rounded-2xl shadow-inner">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActiveLink(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-purple-600/20 border border-purple-500/40 text-purple-200 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Action Area */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 bg-slate-900/90 hover:bg-slate-800 border border-white/10 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                    {userInitial}
                  </div>
                  <span className="max-w-[130px] lg:max-w-[160px] truncate">{userEmail}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setUserMenuOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in backdrop-blur-xl">
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Signed in as</p>
                        <p className="text-xs font-bold text-white truncate">{userEmail}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-purple-400" />
                        My Dashboard & Bookings
                      </Link>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  href="/auth/login" 
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  Sign In
                </Link>
                <Link 
                  href="/#overview" 
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book 2BHK Flat</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Controls */}
          <div className="flex md:hidden items-center gap-2">
            {user ? (
              <Link
                href="/dashboard"
                className="w-9 h-9 rounded-xl bg-purple-900/40 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold text-sm shadow-sm"
              >
                {userInitial}
              </Link>
            ) : (
              <Link
                href="/#overview"
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 text-white shadow-sm"
              >
                Book
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-200 hover:text-white transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-2xl px-4 py-5 space-y-4 animate-fade-in shadow-2xl">
          <div className="space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActiveLink(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-purple-600/20 border border-purple-500/40 text-purple-200 font-bold'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-purple-400' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </div>
                  {active && <span className="w-2 h-2 rounded-full bg-purple-400" />}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-white/10 pt-4 space-y-2.5">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-slate-900/60 rounded-xl border border-white/5 text-xs text-slate-400">
                  Logged in as <span className="text-white font-semibold">{userEmail}</span>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-xl text-center text-xs font-semibold text-slate-300 bg-slate-900 border border-white/10 hover:bg-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-xl text-center text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md"
                >
                  Reserve Flat
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
