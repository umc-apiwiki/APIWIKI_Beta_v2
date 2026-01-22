// src/components/mobile/MobileHeader.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function MobileHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 md:hidden">
      <div className="flex items-center justify-between px-4 h-14">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image src="/logo.svg" alt="API Wiki Logo" fill className="object-contain" priority />
          </div>
          <span className="text-lg font-bold text-blue-600">API Wiki</span>
        </Link>
      </div>
    </header>
  );
}
