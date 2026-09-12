'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { getStoredDemoUser, clearStoredDemoUser, DemoUser } from '@/lib/auth-helpers';
import { Zap, Home, Package, HelpCircle, LayoutDashboard, LogOut, Menu, X, Sparkles } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | DemoUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    router.push('/');
    router.refresh();
  };

  const userEmail = (user as any)?.email;
  const userInitial = userEmail ? userEmail[0].toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl shadow-xl">
      <nav className="container-page flex items-center justify-between h-16 sm:h-20">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-black text-xl sm:text-2xl tracking-tight group shrink-0">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-[0_0_15px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-transform duration-300">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-gradient-purple font-heading tracking-wider font-extrabold">
              Rent-A-Vibe
            </span>
            <span className="text-[10px] text-slate-400 font-bold tracking-widest -mt-1 hidden sm:block">
              PREMIER PARTY FLAT · DWARKA SEC 19
            </span>
          </div>
        </Link>

        {/* Desktop & Tablet Nav links */}
        <div className="hidden md:flex items-center gap-4 lg:gap-7 text-xs lg:text-sm font-semibold text-slate-300">
          <Link href="/venues/the-dwarka-party-flat" className="hover:text-purple-300 transition-all flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-950/50 border border-purple-500/30 text-purple-300 hover:bg-purple-900/60 shadow-sm">
            <Home className="w-4 h-4 text-purple-400" />
            <span>Book 2BHK Party Flat</span>
          </Link>
          <Link href="/boxes" className="hover:text-purple-400 transition-colors flex items-center gap-1.5">
            <Package className="w-4 h-4 text-slate-400" />
            Doorstep Party Kits
          </Link>
          <Link href="/how-it-works" className="hover:text-purple-400 transition-colors flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            How It Works
          </Link>
          <Link href="/dashboard" className="hover:text-purple-400 transition-colors flex items-center gap-1.5">
            <LayoutDashboard className="w-4 h-4 text-slate-400" />
            My Bookings
          </Link>
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-200 hover:text-white bg-slate-900 border border-white/10 px-3.5 py-2 rounded-xl transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {userInitial}
                </div>
                <span className="max-w-[120px] lg:max-w-[160px] truncate">{userEmail}</span>
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                title="Sign out"
                className="btn-ghost text-xs sm:text-sm px-3 py-2 text-slate-300 hover:text-red-400 hover:bg-red-500/10 flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link href="/auth/login" className="btn-ghost text-xs sm:text-sm px-4 py-2">
                Sign in
              </Link>
              <Link href="/auth/signup" className="btn-primary text-xs sm:text-sm px-5 py-2.5">
                Get started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile & Small Tablet Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {user && (
            <Link
              href="/dashboard"
              className="w-8 h-8 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold text-xs"
            >
              {userInitial}
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-200 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-2xl px-5 py-6 space-y-4 animate-fade-in shadow-2xl">
          <div className="space-y-2.5">
            <Link
              href="/venues/the-dwarka-party-flat"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-3.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-200 font-bold text-sm shadow-sm"
            >
              <Home className="w-4 h-4 text-purple-400" />
              Book 2BHK Party Flat (Dwarka)
            </Link>
            <Link
              href="/boxes"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-slate-900 text-slate-200 font-semibold text-sm"
            >
              <Package className="w-4 h-4 text-slate-400" />
              Doorstep Party Kits (Home Delivery)
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-slate-900 text-slate-200 font-semibold text-sm"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              How It Works
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-3 rounded-xl hover:bg-slate-900 text-slate-200 font-semibold text-sm"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-400" />
              My Bookings & KYC Dashboard
            </Link>
          </div>

          <div className="border-t border-white/10 pt-4 flex flex-col gap-2.5">
            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-sm flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out ({userEmail})
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-ghost text-center text-xs py-3"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary text-center text-xs py-3"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
