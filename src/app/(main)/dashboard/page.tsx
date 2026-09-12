'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { getStoredDemoUser, DemoUser } from '@/lib/auth-helpers';
import { Package, Shield, User, ArrowRight, Clock, Sparkles } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function DashboardPage() {
  const supabase = createClient();
  const [user, setUser] = useState<SupabaseUser | DemoUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          setUser(data.user);
          setLoading(false);
          return;
        }
      } catch {
        // ignore
      }

      const demo = getStoredDemoUser();
      setUser(demo);
      setLoading(false);
    };

    syncUser();

    const handleCustomAuthChange = () => {
      syncUser();
    };

    window.addEventListener('rentavibe_auth_change', handleCustomAuthChange);

    return () => {
      window.removeEventListener('rentavibe_auth_change', handleCustomAuthChange);
    };
  }, []);

  if (loading) {
    return (
      <main className="container-page py-16 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-slate-600">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading your dashboard...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container-page py-16 max-w-lg mx-auto text-center">
        <div className="glass-card p-10 space-y-6 border border-slate-200 bg-white shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center mx-auto text-purple-700 shadow-sm">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-900 font-heading">Sign In Required</h1>
            <p className="text-slate-600 text-sm font-medium">
              Please sign in to view your bookings, rentals, and deposit status.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/auth/login" className="btn-primary flex-1 py-3 text-sm font-extrabold">
              1-Click Sign In
            </Link>
            <Link href="/auth/signup" className="btn-ghost flex-1 py-3 text-sm font-semibold">
              Create Account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const userEmail = (user as any).email || 'user@example.com';
  const userName =
    (user as any).user_metadata?.full_name ||
    (user as any).full_name ||
    userEmail.split('@')[0];

  return (
    <main className="container-page py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 glass-card p-6 border border-slate-200 bg-white shadow-sm">
        <div>
          <span className="badge bg-purple-100 text-purple-800 border border-purple-200 text-xs px-3 py-1 mb-2 inline-flex font-bold">
            ✨ Verified Renter
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Welcome, {userName}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5 font-medium">{userEmail}</p>
        </div>

        <Link href="/venues/the-dwarka-party-flat" className="btn-primary self-start sm:self-center gap-2 text-sm font-extrabold">
          Book Venue Stay <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 text-slate-600 text-sm mb-2 font-semibold">
            <Package className="w-4 h-4 text-purple-600" /> Active Rentals
          </div>
          <p className="text-2xl font-black text-slate-900 font-heading">0</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Delivered to your location</p>
        </div>

        <div className="glass-card p-5 border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 text-slate-600 text-sm mb-2 font-semibold">
            <Shield className="w-4 h-4 text-emerald-600" /> Refundable Deposits
          </div>
          <p className="text-2xl font-black text-emerald-700 font-heading">₹0</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Returned post-inspection</p>
        </div>

        <div className="glass-card p-5 border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 text-slate-600 text-sm mb-2 font-semibold">
            <Clock className="w-4 h-4 text-amber-500" /> Total Experiences
          </div>
          <p className="text-2xl font-black text-slate-900 font-heading">0</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">Lifetime bookings</p>
        </div>
      </div>

      {/* Booking List */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4 font-heading">Your Bookings</h2>
        <div className="glass-card p-12 text-center border border-slate-200 bg-white shadow-sm">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-900 text-lg font-bold font-heading">No bookings yet</p>
          <p className="text-slate-600 text-sm mt-1 max-w-md mx-auto font-medium">
            Explore our flagship Dwarka 2BHK Party Flat or browse doorstep rental kits.
          </p>
          <Link href="/venues/the-dwarka-party-flat" className="btn-primary mt-6 inline-flex gap-2 font-extrabold">
            <Sparkles className="w-4 h-4" /> Reserve Party Flat
          </Link>
        </div>
      </div>
    </main>
  );
}
