// src/app/layout.tsx
'use client';

import type { Metadata } from 'next';
import './globals.css';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import UmamiAnalytics from '@/components/UmamiAnalytics';
import FloatingFeedbackButton from '@/components/FloatingFeedbackButton';
import MobileBottomNavigation from '@/components/mobile/MobileBottomNavigation';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <title>API Wiki - 개발자가 함께 만드는 API 지식</title>
        <meta
          name="description"
          content="개발자가 함께 만드는 API 지식, 실시간으로 업데이트됩니다"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0, user-scalable=yes"
        />
        <meta name="format-detection" content="telephone=no" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body className="font-sans" style={{ backgroundColor: 'var(--bg-light)' }}>
        <SessionProvider refetchInterval={30} refetchOnWindowFocus>
          <GoogleAnalytics />
          <UmamiAnalytics />
          <main className="min-h-screen">{children}</main>
          <MobileBottomNavigation />
          <FloatingFeedbackButton />
        </SessionProvider>
      </body>
    </html>
  );
}
