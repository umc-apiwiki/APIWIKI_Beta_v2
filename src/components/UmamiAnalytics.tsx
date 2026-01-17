'use client';

import Script from 'next/script';
import { UMAMI_SCRIPT_URL, UMAMI_WEBSITE_ID } from '@/lib/umami';

export default function UmamiAnalytics() {
  if (!UMAMI_SCRIPT_URL || !UMAMI_WEBSITE_ID) return null;

  return (
    <Script
      id="umami-analytics"
      src={UMAMI_SCRIPT_URL}
      data-website-id={UMAMI_WEBSITE_ID}
      strategy="afterInteractive"
    />
  );
}
