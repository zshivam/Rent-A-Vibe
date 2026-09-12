'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { saveDemoUser } from '@/lib/auth-helpers';
import { Mail, Lock, User, Phone, Loader2, Zap, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1-Click Instant Demo Login
  const handleDemoLogin = () => {
    setDemoLoading(true);
    saveDemoUser({
      id: 'usr-demo-777',
      email: 'demo@rentavibe.com',
      full_name: 'Aryan Sharma',
      phone: '+91 98765 43210',
    });
    setTimeout(() => {
      router.push('/dashboard');
      router.refresh();
    }, 300);
  };

  // Google OAuth Sign In
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        window.location.href = data.url;
        return;
      }
    } catch {
      // Fallback
      saveDemoUser({
        id: 'usr-google-888',
        email: 'alex.google@rentavibe.com',
        full_name: 'Alex Verma (Google Account)',
        phone: '+91 98765 43210',
      });
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 400);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Try real Supabase signup
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password || 'password123',
        options: {
          data: {
            full_name: name.trim(),
            phone: phone.trim(),
          },
        },
      });

      if (!error && data?.session) {
        saveDemoUser({
          id: data.session.user.id,
          email: data.session.user.email ?? email.trim(),
          full_name: name.trim(),
          phone: phone.trim(),
        });
        router.push('/dashboard');
        router.refresh();
        return;
      }
    } catch {
      // Fallback
    }

    // 2. Instant dummy signup & login
    saveDemoUser({
      id: `usr-${Date.now().toString(36)}`,
      email: email.trim(),
      full_name: name.trim(),
      phone: phone.trim() || '+91 98765 43210',
    });

    setTimeout(() => {
      router.push('/dashboard');
      router.refresh();
    }, 400);
  };

  return (
    <main className="min-h-[85vh] flex items-center justify-center container-page py-12 sm:py-16">
      <div className="glass-card w-full max-w-md p-6 sm:p-10 space-y-6 animate-fade-in border border-slate-200 shadow-xl bg-white rounded-2xl">
        <div className="text-center space-y-2">
          <span className="badge bg-purple-100 text-purple-800 border border-purple-200 text-xs px-3 py-1 font-bold">
            ⚡ Private 2BHK Venue & Experience Stays
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">Join Rent-A-Vibe</h1>
          <p className="text-slate-600 text-xs sm:text-sm font-medium">Create an account to book your party flat and packs</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-fade-in font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading || demoLoading}
          className="w-full py-3 px-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-3 hover:bg-slate-100 hover:border-slate-300 transition-all shadow-sm active:scale-[0.99] cursor-pointer"
        >
          {googleLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
              Connecting to Google...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Sign up with Google
            </>
          )}
        </button>

        {/* 1-Click Instant Demo Login */}
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={demoLoading || loading || googleLoading}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md active:scale-[0.99] cursor-pointer"
        >
          {demoLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              Creating Demo Profile...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-white text-white" />
              1-Click Instant Demo Sign Up
              <ArrowRight className="w-4 h-4 opacity-70" />
            </>
          )}
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-slate-500 uppercase font-bold tracking-wider absolute">
            Or register with email
          </span>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-700 mb-1.5 font-bold">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Rohan Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field pl-10 text-xs sm:text-sm border-slate-200 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-700 mb-1.5 font-bold">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="rohan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10 text-xs sm:text-sm border-slate-200 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-700 mb-1.5 font-bold">Phone (Optional)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field pl-10 text-xs sm:text-sm border-slate-200 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-700 mb-1.5 font-bold">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10 text-xs sm:text-sm border-slate-200 text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-sm font-extrabold shadow-md cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 font-medium">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-purple-700 hover:text-purple-900 font-bold">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
