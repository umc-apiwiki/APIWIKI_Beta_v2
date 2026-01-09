'use client';

import { useState } from 'react';
import ModalBase from './ModalBase';
import { motion, AnimatePresence } from 'motion/react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  // Filter Props
  priceFilter: string[];
  togglePriceFilter: (v: string) => void;
  ratingFilter: number;
  setRatingFilter: (v: number) => void;
  countryFilter: string[];
  toggleCountryFilter: (v: string) => void;
  authMethodFilter: string[];
  toggleAuthMethodFilter: (v: string) => void;
  docLanguageFilter: string[];
  toggleDocLanguageFilter: (v: string) => void;
  companyFilter: string[];
  toggleCompanyFilter: (v: string) => void;
  // Count for button
  resultCount: number;
};

const TABS = [
  { id: 'price', label: '가격' },
  { id: 'rating', label: '랭킹' }, // '평점' in code, '랭킹' in screenshot? 'Ranking' usually implies order, but 'Rating' filter is 'stars'. Used '랭킹/평점' logic.
  { id: 'auth', label: 'API 인증 방식' },
  { id: 'docs', label: '제공 문서' }, // Screenshot: '제료 문서'? -> '제공 문서' likely.
  // 'company' and 'country' are extra, maybe put them in another tab or 'Other'? 
  // For now I'll add them to 'Other' or just list them. Screenshot shows limited tabs. 
  // Let's add 'Company' & 'Country' as separate tabs or combined.
  { id: 'country', label: '국가' },
  { id: 'company', label: '기업' },
];

export default function FilterModal({
  isOpen,
  onClose,
  priceFilter,
  togglePriceFilter,
  ratingFilter,
  setRatingFilter,
  countryFilter,
  toggleCountryFilter,
  authMethodFilter,
  toggleAuthMethodFilter,
  docLanguageFilter,
  toggleDocLanguageFilter,
  companyFilter,
  toggleCompanyFilter,
  resultCount
}: Props) {
  const [activeTab, setActiveTab] = useState('price');

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Filters">
      <div className="flex flex-col h-[60vh] md:h-auto">
        {/* Tabs */}
        <div className="flex border-b overflow-x-auto no-scrollbar mb-4">
          {TABS.map(tab => (
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
                <input type="checkbox" checked={priceFilter.includes('free')} onChange={() => togglePriceFilter('free')} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm">무료</span>
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="checkbox" checked={priceFilter.includes('mixed')} onChange={() => togglePriceFilter('mixed')} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm">혼합 (무료 & 유료)</span>
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="checkbox" checked={priceFilter.includes('paid')} onChange={() => togglePriceFilter('paid')} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm">유료</span>
              </label>
            </div>
          )}

          {activeTab === 'rating' && (
            <div className="space-y-3">
               <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="radio" name="rating_modal" checked={ratingFilter === 0} onChange={() => setRatingFilter(0)} className="w-5 h-5 border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm">전체</span>
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="radio" name="rating_modal" checked={ratingFilter === 2} onChange={() => setRatingFilter(2)} className="w-5 h-5 border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm">⭐ 2점 이상</span>
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="radio" name="rating_modal" checked={ratingFilter === 3} onChange={() => setRatingFilter(3)} className="w-5 h-5 border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm">⭐ 3점 이상</span>
              </label>
              <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="radio" name="rating_modal" checked={ratingFilter === 4} onChange={() => setRatingFilter(4)} className="w-5 h-5 border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm">⭐ 4점 이상</span>
              </label>
            </div>
          )}

          {activeTab === 'auth' && (
            <div className="space-y-3">
              {['OAuth2', 'APIKey', 'JWT', 'Basic'].map(method => (
                <label key={method} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={authMethodFilter.includes(method)} 
                    onChange={() => toggleAuthMethodFilter(method)} 
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                  />
                  <span className="text-sm">{method}</span>
                </label>
              ))}
            </div>
          )}

          {activeTab === 'docs' && (
             <div className="space-y-3">
              {['한국어', '영어', '일본어', '중국어'].map(lang => (
                <label key={lang} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={docLanguageFilter.includes(lang)} 
                    onChange={() => toggleDocLanguageFilter(lang)} 
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                  />
                  <span className="text-sm">{lang}</span>
                </label>
              ))}
            </div>
          )}

          {activeTab === 'country' && (
             <div className="space-y-3">
              {['한국', '미국', '일본', '중국'].map(country => (
                <label key={country} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={countryFilter.includes(country)} 
                    onChange={() => toggleCountryFilter(country)} 
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                  />
                  <span className="text-sm">{country}</span>
                </label>
              ))}
            </div>
          )}

           {activeTab === 'company' && (
             <div className="space-y-3">
              {['Google', 'Kakao', 'Naver', 'Samsung'].map(company => (
                <label key={company} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={companyFilter.includes(company)} 
                    onChange={() => toggleCompanyFilter(company)} 
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
            onClick={onClose}
            className="w-full py-3 bg-[#1769AA] text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            {resultCount}개 적용
          </button>
        </div>
      </div>
    </ModalBase>
  );
}
