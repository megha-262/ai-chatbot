'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CurrentUser {
  id: string;
  name: string;
  email: string;
}

interface NavItem {
  href: string;
  label: string;
  requiresAuth?: boolean;
  emergency?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/chat', label: 'Chat' },
  { href: '/health-tools', label: 'Health Tools', requiresAuth: true },
  { href: '/reels', label: 'Reels' },
  { href: '/emergency', label: 'Emergency', emergency: true },
  { href: '/dashboard', label: 'Dashboard', requiresAuth: true },
  { href: '/profile', label: 'Profile', requiresAuth: true },
  { href: '/about', label: 'About' },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setUser(data.user ?? null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setAuthChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
    router.refresh();
  };

  const isActive = (path: string) => pathname === path;
  const visibleItems = NAV_ITEMS.filter((item) => !item.requiresAuth || user);

  const linkClass = (item: NavItem) =>
    `px-3 py-2 text-sm font-medium transition-colors ${
      isActive(item.href)
        ? item.emergency
          ? 'text-red-600 dark:text-red-400'
          : 'text-blue-600 dark:text-blue-400'
        : item.emergency
          ? 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
          : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">HealthBot AI</span>
            </Link>
          </div>

          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {visibleItems.map((item) => (
                <Link key={item.href} href={item.href} className={linkClass(item)}>
                  {item.label}
                </Link>
              ))}
              {authChecked && (
                user ? (
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link href="/login" className={linkClass({ href: '/login', label: 'Login' })}>
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Sign Up
                    </Link>
                  </>
                )
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-label="Toggle navigation menu"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileOpen && (
          <div className="lg:hidden pb-4">
            <div className="flex flex-col space-y-1">
              {visibleItems.map((item) => (
                <Link key={item.href} href={item.href} className={linkClass(item)}>
                  {item.label}
                </Link>
              ))}
              {authChecked && (
                user ? (
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-sm font-medium text-left text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link href="/login" className={linkClass({ href: '/login', label: 'Login' })}>
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors inline-block w-fit"
                    >
                      Sign Up
                    </Link>
                  </>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
