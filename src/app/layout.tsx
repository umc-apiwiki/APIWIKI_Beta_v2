// src/app/layout.tsx
'use client';

import type { Metadata } from 'next';
import './globals.css';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import FloatingFeedbackButton from '@/components/FloatingFeedbackButton';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css" />
      </head>
      <body className="font-sans" style={{ backgroundColor: 'var(--bg-light)' }}>
        <SessionProvider>
          <GoogleAnalytics />
          <main className="min-h-screen">
            {children}
          </main>
          <FloatingFeedbackButton />
        </SessionProvider>
      </body>
    </html>
  );
}