'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    label: 'Learn',
    href: '/learn',
    children: [
      { label: 'SPM 101', href: '/learn/spm-101' },
      { label: 'Glossary', href: '/learn/glossary' },
      { label: 'Component Cards', href: '/learn/component-cards' },
      { label: 'Library', href: '/learn/library' },
    ],
  },
  {
    label: 'Analyze',
    href: '/analyze',
    children: [
      { label: 'Plan Check', href: '/analyze/plan-check', featured: true },
      { label: 'Simulation', href: '/analyze/simulation' },
      { label: 'Deal Payout', href: '/analyze/deal-payout' },
      { label: 'Split Manager', href: '/analyze/splits' },
    ],
  },
  {
    label: 'Benchmarks',
    href: '/benchmarks',
    children: [
      { label: 'Payout Curves', href: '/benchmarks/payout-curves' },
      { label: 'Quota Patterns', href: '/benchmarks/quota-patterns' },
      { label: 'Governance Maturity', href: '/benchmarks/governance-maturity' },
    ],
  },
  {
    label: 'Vendors',
    href: '/vendors',
    children: [
      { label: 'Scorecards', href: '/vendors/scorecards' },
      { label: 'Implementation Reality', href: '/vendors/implementation-reality' },
    ],
  },
  {
    label: 'Community',
    href: '/syndicate',
  },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'Assessment', href: '/services/assessment' },
      { label: 'Redesign', href: '/services/redesign' },
      { label: 'Governance', href: '/services/governance' },
      { label: 'Ongoing Ops', href: '/services/ongoing-ops' },
    ],
  },
];

/**
 * SPMNavigation - Primary navigation for Intelligent SPM
 *
 * Features:
 * - Fixed top bar with noir aesthetic
 * - Purple underline on active pages
 * - Dropdown menus on desktop
 * - Mobile hamburger menu
 * - Search, Subscribe, Sign in utilities
 */
export function SPMNavigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-spm-black border-b border-spm-purple-dark/30 shadow-noir">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 group transition-all"
          >
            <div className="flex flex-col">
              <div className="text-2xl font-headline text-white group-hover:text-spm-purple transition-colors tracking-wider">
                INTELLIGENT SPM
              </div>
              <div className="text-xs text-gray-400 group-hover:text-spm-purple-light transition-colors font-body italic -mt-1">
                Home of The Toddfather
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
                    'text-sm font-medium transition-colors relative py-2',
                    isActive(item.href)
                      ? 'text-spm-purple'
                      : 'text-gray-300 hover:text-white'
                  )}
                >
                  {item.label}
                  {/* Active underline */}
                  {isActive(item.href) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-spm-purple" />
                  )}
                </Link>

                {/* Dropdown menu */}
                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-spm-black-soft border border-spm-purple-dark/30 rounded-lg shadow-noir-lg py-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'block px-4 py-2 text-sm transition-colors',
                          child.featured && 'bg-spm-purple/10 border-l-2 border-spm-purple',
                          isActive(child.href)
                            ? 'text-spm-purple bg-spm-purple/10'
                            : 'text-gray-300 hover:text-white hover:bg-spm-black'
                        )}
                      >
                        {child.label}
                        {child.featured && (
                          <span className="ml-2 text-xs text-spm-purple-light">
                            ★
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Utility Nav */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Search */}
            <Link
              href="/search"
              className="p-2 text-gray-300 hover:text-white transition-colors"
              aria-label="Search"
            >
              <SearchIcon />
            </Link>

            {/* Subscribe */}
            <Link
              href="/subscribe"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Subscribe
            </Link>

            {/* Sign In */}
            <Link
              href="/auth/signin"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Sign in
            </Link>

            {/* Primary CTA */}
            <Link
              href="/analyze/plan-check"
              className="px-6 py-2 bg-spm-purple hover:bg-spm-purple-light text-white rounded-lg font-semibold transition-all hover:shadow-purple-glow"
            >
              Run a Plan Check
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-spm-black-soft border-t border-spm-purple-dark/30">
          <div className="px-6 py-4 space-y-4">
            {primaryNav.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'block text-base font-medium py-2',
                    isActive(item.href)
                      ? 'text-spm-purple'
                      : 'text-gray-300'
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
                            ? 'text-spm-purple'
                            : 'text-gray-400'
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

            {/* Mobile Utility Links */}
            <div className="pt-4 border-t border-spm-purple-dark/30 space-y-2">
              <Link
                href="/subscribe"
                className="block text-base text-gray-300 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Subscribe
              </Link>
              <Link
                href="/auth/signin"
                className="block text-base text-gray-300 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/analyze/plan-check"
                className="block px-6 py-3 bg-spm-purple text-white text-center rounded-lg font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Run a Plan Check
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// Simple SVG icons
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

function SearchIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}
