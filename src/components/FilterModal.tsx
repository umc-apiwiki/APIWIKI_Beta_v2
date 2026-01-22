'use client';

import { useState, useEffect } from 'react';
import ModalBase from './ModalBase';
import { motion, AnimatePresence } from 'motion/react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  // Filter Props (applied values)
  priceFilter: string[];
  ratingFilter: number;
  countryFilter: string[];
  authMethodFilter: string[];
  docLanguageFilter: string[];
  companyFilter: string[];
  // Apply function
  onApplyFilters: (filters: {
    priceFilter: string[];
    ratingFilter: number;
    countryFilter: string[];
    authMethodFilter: string[];
    docLanguageFilter: string[];
    companyFilter: string[];
  }) => void;
  // Count for button
  resultCount: number;
};

const TABS = [
  { id: 'price', label: '가격' },
  { id: 'rating', label: '랭킹' },
  { id: 'auth', label: 'API 인증 방식' },
  { id: 'company', label: '기업' },
];

export default function FilterModal({
  isOpen,
  onClose,
  priceFilter,
  ratingFilter,
  countryFilter,
  authMethodFilter,
  docLanguageFilter,
  companyFilter,
  onApplyFilters,
  resultCount,
}: Props) {
  const [activeTab, setActiveTab] = useState('price');

  // 임시 필터 상태 (모달 내에서만 사용)
  const [tempPriceFilter, setTempPriceFilter] = useState<string[]>(priceFilter);
  const [tempRatingFilter, setTempRatingFilter] = useState<number>(ratingFilter);
  const [tempCountryFilter, setTempCountryFilter] = useState<string[]>(countryFilter);
  const [tempAuthMethodFilter, setTempAuthMethodFilter] = useState<string[]>(authMethodFilter);
  const [tempDocLanguageFilter, setTempDocLanguageFilter] = useState<string[]>(docLanguageFilter);
  const [tempCompanyFilter, setTempCompanyFilter] = useState<string[]>(companyFilter);

  // 모달이 열릴 때 현재 적용된 필터로 임시 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setTempPriceFilter(priceFilter);
      setTempRatingFilter(ratingFilter);
      setTempCountryFilter(countryFilter);
      setTempAuthMethodFilter(authMethodFilter);
      setTempDocLanguageFilter(docLanguageFilter);
      setTempCompanyFilter(companyFilter);
    }
  }, [
    isOpen,
    priceFilter,
    ratingFilter,
    countryFilter,
    authMethodFilter,
    docLanguageFilter,
    companyFilter,
  ]);

  // 임시 필터 토글 함수들
  const toggleTempPriceFilter = (value: string) => {
    setTempPriceFilter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleTempAuthMethodFilter = (value: string) => {
    setTempAuthMethodFilter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleTempCompanyFilter = (value: string) => {
    setTempCompanyFilter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // 적용 버튼 클릭 시
  const handleApply = () => {
    onApplyFilters({
      priceFilter: tempPriceFilter,
      ratingFilter: tempRatingFilter,
      countryFilter: tempCountryFilter,
      authMethodFilter: tempAuthMethodFilter,
      docLanguageFilter: tempDocLanguageFilter,
      companyFilter: tempCompanyFilter,
    });
    onClose();
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Filters">
      <div className="flex flex-col h-[60vh] md:h-auto">
        {/* Tabs */}
        <div className="flex border-b overflow-x-auto no-scrollbar mb-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${
                activeTab === tab.id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeFilterTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-[300px] p-2">
          {activeTab === 'price' && (
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempPriceFilter.includes('free')}
                  onChange={() => toggleTempPriceFilter('free')}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">무료</span>
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempPriceFilter.includes('mixed')}
                  onChange={() => toggleTempPriceFilter('mixed')}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">혼합 (무료 & 유료)</span>
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempPriceFilter.includes('paid')}
                  onChange={() => toggleTempPriceFilter('paid')}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">유료</span>
              </label>
            </div>
          )}

          {activeTab === 'rating' && (
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="radio"
                  name="rating_modal"
                  checked={tempRatingFilter === 0}
                  onChange={() => setTempRatingFilter(0)}
                  className="w-5 h-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">전체</span>
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="radio"
                  name="rating_modal"
                  checked={tempRatingFilter === 2}
                  onChange={() => setTempRatingFilter(2)}
                  className="w-5 h-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">⭐ 2점 이상</span>
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="radio"
                  name="rating_modal"
                  checked={tempRatingFilter === 3}
                  onChange={() => setTempRatingFilter(3)}
                  className="w-5 h-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">⭐ 3점 이상</span>
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="radio"
                  name="rating_modal"
                  checked={tempRatingFilter === 4}
                  onChange={() => setTempRatingFilter(4)}
                  className="w-5 h-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">⭐ 4점 이상</span>
              </label>
            </div>
          )}

          {activeTab === 'auth' && (
            <div className="space-y-3">
              {['OAuth2', 'APIKey', 'JWT', 'Basic'].map((method) => (
                <label
                  key={method}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={tempAuthMethodFilter.includes(method)}
                    onChange={() => toggleTempAuthMethodFilter(method)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{method}</span>
                </label>
              ))}
            </div>
          )}

          {activeTab === 'company' && (
            <div className="space-y-3">
              {['Google', 'Kakao', 'Naver', 'Samsung'].map((company) => (
                <label
                  key={company}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={tempCompanyFilter.includes(company)}
                    onChange={() => toggleTempCompanyFilter(company)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{company}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="mt-6 pt-4 border-t">
          <button
            onClick={handleApply}
            className="w-full py-3 bg-[#1769AA] text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            적용
          </button>
        </div>
      </div>
    </ModalBase>
  );
}
