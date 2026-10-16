'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

import { flushAnalyticsQueue, trackPageview } from '@/lib/analytics';

/**
 * Cookieless usage analytics (Plausible).
 *
 * Rendered only when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set. The manual script
 * variant sends nothing on its own — every pageview goes through the route
 * tracker below with a normalized path, so provider addresses and voucher
 * ids never leave the browser. Funnel events are sent separately with names
 * only (see src/lib/analytics.ts).
 */
export function Analytics({ domain }: { domain: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) trackPageview(pathname);
  }, [pathname]);

  return (
    <Script
      src="https://plausible.io/js/script.manual.js"
      data-domain={domain}
      strategy="afterInteractive"
      onLoad={() => flushAnalyticsQueue()}
    />
  );
}
