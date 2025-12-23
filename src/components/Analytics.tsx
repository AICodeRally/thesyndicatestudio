'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initAnalytics, trackEvent } from '@/lib/analytics';

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    if (pathname) {
      trackEvent('$pageview', {
        path: pathname,
        search: searchParams?.toString(),
      });
    }
  }, [pathname, searchParams]);

  return null;
}
