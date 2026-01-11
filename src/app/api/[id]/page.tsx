// src/app/api/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Users, ChevronLeft, Heart, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import APICard from '@/components/APICard';
import WikiEditor from '@/components/WikiEditor';
import { API } from '@/types';

export default function APIDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [api, setApi] = useState<API | null>(null);
  const [relatedAPIs, setRelatedAPIs] = useState<API[]>([]);
  const [activeTab, setActiveTab] = useState('개요');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/apis/${params.id}`, { cache: 'no-store' });
      if (!response.ok) {
        setApi(null);
        return;
      }
      const data = await response.json();
      setApi(data);

      // Fetch related APIs
      if (data.categories && data.categories.length > 0) {
        const relatedResponse = await fetch(`/api/apis?category=${data.categories[0]}&limit=6`);
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          setRelatedAPIs(relatedData.filter((a: API) => a.id !== params.id).slice(0, 5));
        }
      }
    } catch (error) {
      console.error('Error fetching API:', error);
      setApi(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  if (loading) return null;
  if (!api) return <div>API not found</div>;

  const tabs = [
    { id: '개요', label: '개요' },
    { id: '비용 정보', label: '비용정보' },
    { id: '후기', label: '후기' },
    { id: '코드 예제', label: '코드예제' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-light)' }}>
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 py-8 pt-28 relative">
       
        {/* Header Section */}
        <div className="flex justify-between items-start mb-12 relative">
          <div className="flex-1 max-w-3xl">
            <h1 className="text-4xl font-semibold text-[#0f172a] mb-4 leading-tight">{api.name}</h1>
            
            <div className="space-y-2 mb-6">
              <div className="text-[#0c4a6e] text-lg font-medium">Star {api.rating || 4.2}</div>
              <div className="text-[#0c4a6e] text-lg font-medium">Used by {api.users || '970M'} people</div>
              <div className="text-[#a1a1aa] text-base font-normal mt-2">{api.price === 'free' ? 'Free' : api.price === 'paid' ? 'Paid' : 'Mixed'}</div>
            </div>
          </div>

          {/* Large Logo Box (Right) */}
          <div className="w-52 h-52 bg-white rounded-[40px] shadow-[1px_3px_8px_0px_rgba(33,150,243,0.2)] border-[0.25px] border-sky-500 flex items-center justify-center p-10 relative z-10 shrink-0">
             {api.logo ? (
                api.logo.length > 4 || api.logo.startsWith('http') || api.logo.startsWith('/') || api.logo.startsWith('data:') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={api.logo} alt={api.name} className="w-full h-full object-contain p-6" />
                ) : (
                  <span className="text-6xl">{api.logo}</span>
                )
              ) : (
                <span className="text-5xl">📦</span>
              )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 relative">
          <div className="flex gap-8 border-b border-gray-200 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-lg font-medium transition-colors relative pb-2 ${
                  activeTab === tab.id 
                    ? 'text-[#0c4a6e]' 
                    : 'text-[#a1a1aa] hover:text-[#0c4a6e]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0c4a6e] opacity-80" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-12 min-h-[400px]">
          {activeTab === '개요' && (
            <>
              {/* Description */}
              <div>
                <h3 className="text-lg font-medium text-[#0f172a] mb-4">설명</h3>
                <p className="text-base leading-7 font-medium text-[#0c4a6e] max-w-4xl whitespace-pre-line">
                  {api.description || `노션 API는 노션의 데이터베이스와 페이지를 외부 프로그램이나 서비스와 연결해 주는 개발 도구입니다. 이를 활용하면 코드를 통해 데이터를 자동으로 읽거나 쓸 수 있어, 설문지 응답을 노션에 바로 기록하거나 일정 관리 앱과 연동하는 등의 업무 자동화가 가능해집니다. 현대적인 REST API 방식과 JSON 데이터 형식을 따르고 있어 개발자가 다루기 편리하며, 특정 페이지에만 접근 권한을 부여하는 보안 설정으로 데이터를 안전하게 관리할 수 있습니다. 결과적으로 노션 API는 노션을 단순한 메모장을 넘어 하나의 거대한 데이터베이스 서버처럼 활용할 수 있게 해줍니다.`}
                </p>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-lg font-medium text-[#0f172a] mb-4">카테고리</h3>
                <div className="flex gap-3 flex-wrap items-center">
                  {(api.categories && api.categories.length > 0 ? api.categories : ['데이터베이스', '페이지 및 블록', '사용자', '코멘트', '검색']).map((cat, idx) => (
                    <div 
                      key={idx} 
                      className="px-4 py-1.5 bg-white/50 rounded-[16px] shadow-[0px_1px_3px_0px_rgba(33,150,243,0.25)] border-[0.5px] border-sky-500 flex items-center justify-center"
                    >
                      <span className="text-sm font-medium text-[#0c4a6e]"># {cat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wiki Editor Section */}
              <div>
                 <div className="mt-8">
                   <h3 className="text-xl font-medium text-[#0c4a6e] mb-4">API 위키</h3>
                   <div className="w-full">
                   <WikiEditor apiId={api.id} initialContent={api.wiki_content || ''} onSave={fetchData} />
                   </div>
                 </div>
              </div>
            </>
          )}

          {/* Placeholder for other tabs */}
          {activeTab !== '개요' && (
            <div className="h-48 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl text-lg">
              {activeTab} 내용 준비중
            </div>
          )}
        </div>

        {/* Similar APIs */}
        {relatedAPIs.length > 0 && (
          <div className="mt-24 pb-16">
            <h3 className="text-xl font-medium text-[#0c4a6e] mb-6">비슷한 API</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedAPIs.map(item => (
                <APICard key={item.id} api={item} hideCompare={true} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
