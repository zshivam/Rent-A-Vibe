export interface DemoUser {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  is_demo?: boolean;
}

const STORAGE_KEY = 'rentavibe_demo_user';

export function getStoredDemoUser(): DemoUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoUser;
  } catch {
    return null;
  }
}

export function saveDemoUser(user: Partial<DemoUser> & { email: string }): DemoUser {
  const demoUser: DemoUser = {
    id: user.id || `user-demo-${Date.now()}`,
    email: user.email,
    full_name: user.full_name || user.email.split('@')[0],
    phone: user.phone || '+91 98765 43210',
    is_demo: true,
  };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
    } catch {
      // ignore private mode error
    }
    try {
      document.cookie = `rentavibe_user_email=${encodeURIComponent(demoUser.email)}; path=/; max-age=604800; SameSite=Lax`;
    } catch {
      // ignore
    }
    try {
      window.dispatchEvent(new Event('rentavibe_auth_change'));
    } catch {
      // ignore
    }
  }
  return demoUser;
}

export function clearStoredDemoUser(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    try {
      document.cookie = 'rentavibe_user_email=; path=/; max-age=0; SameSite=Lax';
    } catch {
      // ignore
    }
    try {
      window.dispatchEvent(new Event('rentavibe_auth_change'));
    } catch {
      // ignore
    }
  }
}
