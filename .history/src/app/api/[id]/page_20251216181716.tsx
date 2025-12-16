```typescript
// placeholder: api detail page
// src/app/api/[id]/page.tsx
import { notFound } from 'next/navigation';
import Header from '@/components/Header'; // Assuming Header is needed based on the diff, though not in original
import APICard from '@/components/APICard';
import { getAPIById, getRelatedAPIs } from '@/lib/apiService';

export default async function APIDetailPage({ params }: { params: { id: string } }) {
  const api = await getAPIById(params.id);

  if (!api) {
          <h1 className="text-2xl font-bold text-gray-900 mb-4">API를 찾을 수 없습니다</h1>
          <button
            onClick={() => router.push('/explore')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const tabs = ['개요', '비용 정보', '후기', '코드 예제'];
  const relatedAPIs = getRelatedAPIs(api);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/explore')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          <span>목록으로 돌아가기</span>
        </button>

        {/* Layout: main content + right summary sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* API Header (main) */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
              <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-6">
                  <div className="text-6xl">{api.logo}</div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{api.name}</h1>
                    <p className="text-gray-600 mb-3">{api.company}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star size={20} className="fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{api.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users size={20} />
                        <span>{api.users} users</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">{api.description}</p>
            </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex - 1 px - 6 py - 4 font - medium transition - colors whitespace - nowrap ${
  activeTab === tab
    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
} `}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {activeTab === '개요' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">주요 기능</h3>
                <ul className="space-y-2 mb-6">
                  {api.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-xl font-semibold mb-4">카테고리</h3>
                <div className="flex gap-2 mb-6 flex-wrap">
                  {api.categories.map((category, idx) => (
                    <span key={idx} className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                      {category}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-semibold mb-4">공식 문서</h3>
                <a href="#" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                  공식 문서 바로가기 →
                </a>
              </div>
            )}

            {activeTab === '비용 정보' && (
              <div>
                <h3 className="text-xl font-semibold mb-6">요금제</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {api.pricing?.free && (
                    <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-colors">
                      <div className="text-sm font-semibold text-gray-500 mb-2">FREE</div>
                      <div className="text-3xl font-bold mb-4">무료</div>
                      <div className="text-sm text-gray-600">{api.pricing.free}</div>
                    </div>
                  )}
                  {api.pricing?.basic && (
                    <div className="border-2 border-blue-500 rounded-xl p-6 bg-blue-50">
                      <div className="text-sm font-semibold text-blue-600 mb-2">BASIC</div>
                      <div className="text-3xl font-bold mb-4">
                        {api.pricing.basic.split('-')[0].trim()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {api.pricing.basic.includes('-') ? api.pricing.basic.split('-')[1].trim() : ''}
                      </div>
                    </div>
                  )}
                  {api.pricing?.pro && (
                    <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-colors">
                      <div className="text-sm font-semibold text-gray-500 mb-2">PRO</div>
                      <div className="text-3xl font-bold mb-4">
                        {api.pricing.pro.split('-')[0].trim()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {api.pricing.pro.includes('-') ? api.pricing.pro.split('-')[1].trim() : ''}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <h4 className="font-semibold text-yellow-900 mb-2">💡 비용 계산기</h4>
                  <p className="text-sm text-yellow-800 mb-4">예상 사용량을 입력하여 월 비용을 계산해보세요</p>
                  <div className="flex gap-4">
                    <input 
                      type="number" 
                      placeholder="월 예상 호출 수" 
                      className="flex-1 px-4 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                    <button className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                      계산하기
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === '후기' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">실사용자 후기</h3>
                  <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    후기 작성하기
                  </button>
                </div>

                <div className="space-y-6">
                  {[1, 2, 3].map((idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">개발자 {idx}</span>
                            <span className="text-sm text-gray-500">2주 전</span>
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
                      
                      <p className="text-gray-700 mb-4">
                        프로젝트에 적용하기 쉬웠고, 문서화가 잘 되어있어 도움이 많이 되었습니다. 
                        다만 응답 속도가 조금 느린 편이라 개선이 필요할 것 같습니다.
                      </p>

                      <div className="flex gap-2 flex-wrap">
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">문서화 우수</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">사용 쉬움</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === '코드 예제' && (
              <div>
                <h3 className="text-xl font-semibold mb-6">빠른 시작 가이드</h3>
                
                <div className="mb-6">
                  <div className="flex gap-2 mb-4">
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium">Python</button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">JavaScript</button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Java</button>
                  </div>

                  <div className="bg-gray-900 text-gray-100 rounded-xl p-6 font-mono text-sm overflow-x-auto">
                    <pre>{`# ${ api.name } API 사용 예제

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
  headers = headers
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

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-900 mb-2">📚 더 많은 예제</h4>
                  <p className="text-sm text-blue-800">공식 GitHub 저장소에서 더 많은 코드 예제를 확인하세요</p>
                </div>
              </div>
            )}
          </div>
        </div>

          </div>

          {/* Right summary sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="mb-4">
                <div className="text-sm text-gray-500">요금</div>
                <div className="flex gap-2 mt-2">
                  {api.pricing?.free && (<span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">무료</span>)}
                  {api.pricing?.basic && (<span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">베이직</span>)}
                  {api.pricing?.pro && (<span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">프로</span>)}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-500">인증 방식</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {/* @ts-ignore */}
                  {(api.authMethods || ['APIKey']).map((m: string) => (
                    <span key={m} className="px-3 py-1 bg-gray-100 rounded-full text-sm">{m}</span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-500">문서 언어</div>
                <div className="flex gap-2 mt-2">
                  {/* @ts-ignore */}
                  {(api.docsLanguages || ['영어']).map((l: string) => (
                    <span key={l} className="px-3 py-1 bg-gray-100 rounded-full text-sm">{l}</span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-500">빠른 엔드포인트</div>
                <pre className="bg-gray-900 text-gray-100 rounded-md p-3 text-sm font-mono overflow-x-auto mt-2">{`GET / v1 / example`}</pre>
              </div>

              <div className="flex gap-3 mt-4">
                <button className="flex-1 px-4 py-2 bg-white border-2 border-teal-500 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium">
                  비교하기
                </button>
                <button className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium">
                  북마크
                </button>
              </div>
            </div>
          </aside>

        </div>

        {/* Wiki editor + related APIs */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <WikiEditor apiId={api.id} />

          {relatedAPIs.length > 0 && (
            <div className="mt-6">
              <h3 className="text-2xl font-semibold mb-6">비슷한 API</h3>
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