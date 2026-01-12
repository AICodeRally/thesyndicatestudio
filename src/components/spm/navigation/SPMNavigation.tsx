'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  children?: {
    label: string;
    href: string;
    featured?: boolean;
  }[];
}

const primaryNav: NavItem[] = [
  {
    label: 'Studio',
    href: '/studio',
  },
  {
    label: 'Library',
    href: '/studio/library',
  },
  {
    label: 'Content',
    href: '/studio/content',
    children: [
      { label: 'Glossary', href: '/studio/content/glossary' },
      { label: 'Components', href: '/studio/content/components' },
      { label: 'Vendors', href: '/studio/content/vendors' },
      { label: 'Benchmarks', href: '/studio/content/benchmarks' },
    ],
  },
];

export function SPMNavigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [theme, setTheme] = useState<'luxury-noir' | 'industrial-ops'>('luxury-noir');
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useUser();

  // Check admin status from user metadata
  useEffect(() => {
    if (user?.publicMetadata?.tier === 'ENTERPRISE') {
      setIsAdmin(true);
    }
  }, [user]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('studio-theme');
    const initial = stored === 'industrial-ops' ? 'industrial-ops' : 'luxury-noir';
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  const toggleTheme = () => {
    const next = theme === 'luxury-noir' ? 'industrial-ops' : 'luxury-noir';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('studio-theme', next);
    }
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 studio-nav">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 group transition-all"
          >
            <div className="flex flex-col">
              <div className="text-2xl font-bold tracking-tight group-hover:opacity-80 transition-all">
                <span className="text-[color:var(--studio-accent)]">
                  The Syndicate Studio
                </span>
              </div>
              <div className="text-xs text-[color:var(--studio-text-muted)] group-hover:text-[color:var(--studio-accent)] transition-colors italic -mt-0.5">
                Toddfather production room
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {primaryNav.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors relative py-2 studio-nav-link',
                    isActive(item.href)
                      ? 'text-[color:var(--studio-accent)]'
                      : 'text-[color:var(--studio-text-muted)] hover:text-[color:var(--studio-text)]'
                  )}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[color:var(--studio-accent)]" />
                  )}
                </Link>

                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-[color:var(--studio-surface-2)] border border-[color:var(--studio-border)] rounded-lg shadow-cosmic-lg py-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'block px-4 py-2 text-sm transition-colors',
                          child.featured && 'bg-[color:var(--studio-accent-soft)] border-l-2 border-[color:var(--studio-accent)]',
                          isActive(child.href)
                            ? 'text-[color:var(--studio-accent)] bg-[color:var(--studio-accent-soft)]'
                            : 'text-[color:var(--studio-text-muted)] hover:text-[color:var(--studio-text)] hover:bg-[color:var(--studio-surface)]'
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Utility Nav */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              type="button"
              onClick={toggleTheme}
              className="px-3 py-2 text-xs uppercase tracking-[0.2em] text-[color:var(--studio-text-muted)] border border-[color:var(--studio-border)] rounded-lg hover:text-[color:var(--studio-text)] transition-colors"
            >
              Theme: {theme === 'luxury-noir' ? 'Noir' : 'Ops'}
            </button>

            {isAdmin && (
              <Link
                href="/studio/admin"
                className="px-4 py-2 text-sm font-medium text-[color:var(--studio-accent)] hover:text-[color:var(--studio-text)] transition-colors"
              >
                Admin
              </Link>
            )}

            <Link
              href="/studio/library"
              className="px-4 py-2 text-sm font-medium text-[color:var(--studio-text-muted)] hover:text-[color:var(--studio-text)] transition-colors"
            >
              Library
            </Link>

            <Link
              href="/studio/episodes/new"
              className="px-6 py-2 rounded-lg font-semibold transition-all studio-cta"
            >
              Start an Episode
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-[color:var(--studio-text-muted)] hover:text-[color:var(--studio-text)] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[color:var(--studio-surface-2)] border-t border-[color:var(--studio-border)]">
          <div className="px-6 py-4 space-y-4">
            {primaryNav.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'block text-base font-medium py-2',
                    isActive(item.href)
                      ? 'text-[color:var(--studio-accent)]'
                      : 'text-[color:var(--studio-text)]'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-4 mt-2 space-y-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'block text-sm py-1',
                          isActive(child.href)
                            ? 'text-[color:var(--studio-accent)]'
                            : 'text-[color:var(--studio-text-muted)]'
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-4 border-t border-[color:var(--studio-border)] space-y-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="block w-full text-left text-sm uppercase tracking-[0.2em] text-[color:var(--studio-text-muted)] py-2"
              >
                Theme: {theme === 'luxury-noir' ? 'Noir' : 'Ops'}
              </button>
              {isAdmin && (
                <Link
                  href="/studio/admin"
                  className="block text-base text-[color:var(--studio-accent)] py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <Link
                href="/studio/library"
                className="block text-base text-[color:var(--studio-text)] py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Library
              </Link>
              <Link
                href="/studio/content"
                className="block text-base text-[color:var(--studio-text)] py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Content
              </Link>
              <Link
                href="/studio/episodes/new"
                className="block text-base text-[color:var(--studio-text)] py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Start an Episode
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function MenuIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
