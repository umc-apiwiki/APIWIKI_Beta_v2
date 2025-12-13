'use client';

import Link from 'next/link';

export default function Footer(){
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row md:justify-between gap-6">
        <div>
          <h5 className="font-bold text-lg">API WIKI</h5>
          <p className="text-sm text-gray-600 mt-2">API 선택 가이드를 함께 만드는 커뮤니티</p>
        </div>

        <div className="flex gap-8">
          <div>
            <h6 className="font-semibold">회사</h6>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              <li>회사명: Example Corp</li>
              <li>주소: Seoul, Korea</li>
              <li>연락: <a href="mailto:contact@example.com" className="underline">contact@example.com</a></li>
            </ul>
          </div>

          <div>
            <h6 className="font-semibold">서비스</h6>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              <li><Link href="/terms" className="hover:underline">이용약관</Link></li>
              <li><Link href="/privacy" className="hover:underline">개인정보처리방침</Link></li>
              <li><Link href="/contact" className="hover:underline">문의하기</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 text-center text-sm text-gray-500 py-4">© {new Date().getFullYear()} API WIKI</div>
    </footer>
  );
}
