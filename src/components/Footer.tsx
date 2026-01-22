'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      className="border-t mt-12"
      style={{
        backgroundColor: 'var(--bg-light)',
        borderColor: 'rgba(33, 150, 243, 0.2)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row md:justify-between gap-6">
        <div>
          <h5 className="font-bold text-[28px]" style={{ color: 'var(--primary-blue)' }}>
            API Wiki
          </h5>
          <p className="text-[14px] mt-2" style={{ color: 'var(--text-gray)' }}>
            개발자가 함께 만드는 API 지식
          </p>
        </div>

        <div className="flex gap-12">
          <div>
            <h6 className="font-semibold text-[16px] mb-2" style={{ color: 'var(--text-dark)' }}>
              회사
            </h6>
            <ul className="text-[14px] space-y-1" style={{ color: 'var(--text-gray)' }}>
              <li>회사명: API Wiki Corp</li>
              <li>주소: Seoul, Korea</li>
              <li>
                <a
                  href="mailto:contact@apiwiki.com"
                  className="hover:underline transition-colors"
                  style={{ color: 'var(--primary-blue)' }}
                >
                  contact@apiwiki.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="font-semibold text-[16px] mb-2" style={{ color: 'var(--text-dark)' }}>
              서비스
            </h6>
            <ul className="text-[14px] space-y-1" style={{ color: 'var(--text-gray)' }}>
              <li>
                <Link
                  href="/terms"
                  className="hover:underline transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-blue)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-gray)')}
                >
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:underline transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-blue)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-gray)')}
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:underline transition-colors"
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-blue)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-gray)')}
                >
                  문의하기
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        className="border-t text-center text-[12px] py-4"
        style={{
          borderColor: 'rgba(33, 150, 243, 0.1)',
          color: 'var(--text-gray)',
        }}
      >
        © {new Date().getFullYear()} API Wiki. All rights reserved.
      </div>
    </footer>
  );
}
