// src/app/api/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Users, ChevronLeft } from 'lucide-react';
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/apis/${params.id}`);
        if (!response.ok) {
          setApi(null);
          return;
        }
        const data = await response.json();
        setApi(data);

        // Fetch related APIs
        const relatedResponse = await fetch(`/api/apis?category=${data.categories[0]}`);
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          setRelatedAPIs(relatedData.filter((a: API) => a.id !== params.id).slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching API:', error);
        setApi(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-light)' }}>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p style={{ color: 'var(--text-gray)' }}>로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!api) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-light)' }}>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-dark)' }}>
              API를 찾을 수 없습니다
            </h1>
            <button
              onClick={() => router.push('/explore')}
              className="px-6 py-3 rounded-lg transition-colors"
              style={{
                backgroundColor: 'var(--primary-blue)',
                color: 'white'
              }}
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = ['개요', '비용 정보', '후기', '코드 예제'];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-light)' }}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Back Button */}
        <button
          onClick={() => router.push('/explore')}
          className="flex items-center gap-2 mb-6 transition-colors"
          style={{ color: 'var(--text-gray)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-blue)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-gray)'}
        >
          <ChevronLeft size={20} />
          <span>목록으로 돌아가기</span>
        </button>

        {/* Layout: main content + right summary sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* API Header (main) */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6 card-shadow">
              <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-6">
                  <div className="text-6xl">{api.logo}</div>
                  <div>
                    <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-dark)' }}>
                      {api.name}
                    </h1>
                    <p className="mb-3" style={{ color: 'var(--text-gray)' }}>{api.company}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star size={20} className="fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{api.rating}</span>
                      </div>
                      <div className="flex items-center gap-1" style={{ color: 'var(--text-gray)' }}>
                        <Users size={20} />
                        <span>{api.users} users</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="leading-relaxed" style={{ color: 'var(--text-gray)' }}>
                {api.description}
              </p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden card-shadow">
              <div className="border-b" style={{ borderColor: 'rgba(33, 150, 243, 0.2)' }}>
                <div className="flex overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab ? 'border-b-2' : ''
                      }`}
                      style={{
                        color: activeTab === tab ? 'var(--primary-blue)' : 'var(--text-gray)',
                        borderColor: activeTab === tab ? 'var(--primary-blue)' : 'transparent',
                        backgroundColor: activeTab === tab ? 'rgba(33, 150, 243, 0.05)' : 'transparent'
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-8">
                {activeTab === '개요' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-dark)' }}>
                      주요 기능
                    </h3>
                    <ul className="space-y-2 mb-6">
                      {api.features?.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: 'var(--primary-blue)' }}
                          ></div>
                          <span style={{ color: 'var(--text-gray)' }}>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-dark)' }}>
                      카테고리
                    </h3>
                    <div className="flex gap-2 mb-6 flex-wrap">
                      {api.categories.map((category, idx) => (
                        <span 
                          key={idx} 
                          className="px-4 py-2 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                            color: 'var(--primary-blue)'
                          }}
                        >
                          {category}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-dark)' }}>
                      공식 문서
                    </h3>
                    <a 
                      href="#" 
                      className="inline-flex items-center gap-1 hover:underline"
                      style={{ color: 'var(--primary-blue)' }}
                    >
                      공식 문서 바로가기 →
                    </a>
                  </div>
                )}

                {activeTab === '비용 정보' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-dark)' }}>
                      요금제
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      {api.pricing?.free && (
                        <div className="border-2 rounded-xl p-6 hover:border-blue-500 transition-colors card-shadow">
                          <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-gray)' }}>
                            FREE
                          </div>
                          <div className="text-3xl font-bold mb-4">무료</div>
                          <div className="text-sm" style={{ color: 'var(--text-gray)' }}>
                            {api.pricing.free}
                          </div>
                        </div>
                      )}
                      {api.pricing?.basic && (
                        <div 
                          className="border-2 rounded-xl p-6"
                          style={{
                            borderColor: 'var(--primary-blue)',
                            backgroundColor: 'rgba(33, 150, 243, 0.05)'
                          }}
                        >
                          <div className="text-sm font-semibold mb-2" style={{ color: 'var(--primary-blue)' }}>
                            BASIC
                          </div>
                          <div className="text-3xl font-bold mb-4">
                            {api.pricing.basic.split('-')[0].trim()}
                          </div>
                          <div className="text-sm" style={{ color: 'var(--text-gray)' }}>
                            {api.pricing.basic.includes('-') ? api.pricing.basic.split('-')[1].trim() : ''}
                          </div>
                        </div>
                      )}
                      {api.pricing?.pro && (
                        <div className="border-2 rounded-xl p-6 hover:border-blue-500 transition-colors card-shadow">
                          <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-gray)' }}>
                            PRO
                          </div>
                          <div className="text-3xl font-bold mb-4">
                            {api.pricing.pro.split('-')[0].trim()}
                          </div>
                          <div className="text-sm" style={{ color: 'var(--text-gray)' }}>
                            {api.pricing.pro.includes('-') ? api.pricing.pro.split('-')[1].trim() : ''}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === '후기' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold" style={{ color: 'var(--text-dark)' }}>
                        실사용자 후기
                      </h3>
                      <button 
                        className="px-6 py-2 rounded-lg transition-colors text-white"
                        style={{ backgroundColor: 'var(--primary-blue)' }}
                      >
                        후기 작성하기
                      </button>
                    </div>

                    <div className="space-y-6">
                      {[1, 2, 3].map((idx) => (
                        <div key={idx} className="border rounded-xl p-6 card-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold">개발자 {idx}</span>
                                <span className="text-sm" style={{ color: 'var(--text-gray)' }}>
                                  2주 전
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    size={16} 
                                    className={i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <p className="mb-4" style={{ color: 'var(--text-gray)' }}>
                            프로젝트에 적용하기 쉬웠고, 문서화가 잘 되어있어 도움이 많이 되었습니다.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === '코드 예제' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-dark)' }}>
                      빠른 시작 가이드
                    </h3>
                    
                    <div className="mb-6">
                      <div className="flex gap-2 mb-4">
                        <button 
                          className="px-4 py-2 rounded-lg font-medium text-white"
                          style={{ backgroundColor: 'var(--primary-blue)' }}
                        >
                          Python
                        </button>
                      </div>

                      <div className="bg-gray-900 text-gray-100 rounded-xl p-6 font-mono text-sm overflow-x-auto">
                        <pre>{`# ${api.name} API 사용 예제

import requests

API_KEY = "your_api_key_here"
BASE_URL = "https://api.example.com/v1"

def get_data():
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(
        f"{BASE_URL}/endpoint",
        headers=headers
    )
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        return None

# 사용 예시
data = get_data()
print(data)`}</pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right summary sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 card-shadow">
              <div className="mb-4">
                <div className="text-sm mb-2" style={{ color: 'var(--text-gray)' }}>요금</div>
                <div className="flex gap-2 flex-wrap">
                  {api.price === 'free' && (
                    <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">무료</span>
                  )}
                  {api.price === 'paid' && (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">유료</span>
                  )}
                  {api.price === 'mixed' && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">혼합</span>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  className="flex-1 px-4 py-2 border-2 rounded-lg transition-colors font-medium"
                  style={{
                    borderColor: 'var(--primary-blue)',
                    color: 'var(--primary-blue)',
                    backgroundColor: 'white'
                  }}
                >
                  비교하기
                </button>
                <button 
                  className="px-4 py-2 rounded-lg transition-colors font-medium text-white"
                  style={{ backgroundColor: 'var(--primary-blue)' }}
                >
                  북마크
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Wiki editor + related APIs */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 card-shadow">
          <WikiEditor apiId={api.id} />

          {relatedAPIs.length > 0 && (
            <div className="mt-6">
              <h3 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-dark)' }}>
                비슷한 API
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedAPIs.map((relatedAPI) => (
                  <APICard key={relatedAPI.id} api={relatedAPI} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
