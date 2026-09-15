import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    '';

  if (code && supabaseUrl && supabaseKey) {
    const cookieStore = await cookies();
    const response = NextResponse.redirect(`${origin}${next}`);

    try {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              try {
                cookieStore.set(name, value, options);
              } catch {
                // ignore
              }
              try {
                response.cookies.set(name, value, options);
              } catch {
                // ignore
              }
            });
          },
        },
      });

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        const { data } = await supabase.auth.getUser();
        if (data?.user?.email) {
          response.cookies.set('rentavibe_user_email', data.user.email, {
            path: '/',
            maxAge: 604800,
            sameSite: 'lax',
          });
        }
        return response;
      }
    } catch {
      // Fallthrough to redirect below
    }
  }

  // Return the user to login with helpful status query
  return NextResponse.redirect(`${origin}/auth/login?error=auth-callback-failed`);
}

