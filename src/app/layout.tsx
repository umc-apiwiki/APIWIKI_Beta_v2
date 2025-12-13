// src/app/layout.tsx

import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'API WIKI - 개발자들이 함께 만드는 API 선택 가이드',
  description: '실제 사용 경험을 공유하며 함께 만드는 API 선택 가이드',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Noto+Sans+KR:wght@400;500;700&family=Orbitron:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans">
        {/* Kakao Maps SDK: set NEXT_PUBLIC_KAKAO_KEY in .env.local */}
        <Script
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_KEY}&libraries=services`}
          strategy="beforeInteractive"
        />
        
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        
      </body>
    </html>
  );
}