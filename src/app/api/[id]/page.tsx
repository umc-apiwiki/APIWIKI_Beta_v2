// src/app/api/[id]/page.tsx
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Header from '@/components/Header';
import APICard from '@/components/APICard';
import WikiEditor from '@/components/WikiEditor';
import PointNotificationModal from '@/components/PointNotificationModal';
import { API } from '@/types';
import styles from './page.module.css';

export default function APIDetailPage({ params }: { params: { id: string } }) {
  const [api, setApi] = useState<API | null>(null);
  const [relatedAPIs, setRelatedAPIs] = useState<API[]>([]);
  const [activeTab, setActiveTab] = useState('개요');
  const [loading, setLoading] = useState(true);
  const [csvInput, setCsvInput] = useState('');
  const [savingCsv, setSavingCsv] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [editingCsv, setEditingCsv] = useState(false);
  const [pointRules, setPointRules] = useState({ upload: 5, update: 2 });
  const [showPointModal, setShowPointModal] = useState(false);
  const [awardedPoints, setAwardedPoints] = useState<number | null>(null);

  const csvString = useMemo(() => {
    if (!api?.pricing) return '';
    if (typeof api.pricing === 'string') return api.pricing;
    return api.pricing.csv ?? '';
  }, [api?.pricing]);

  const pricingTable = useMemo(() => {
    const csv = csvString;
    if (!csv) return null;

    const parseCsv = (input: string): string[][] => {
      const rows: string[][] = [];
      let current: string[] = [];
      let field = '';
      let inQuotes = false;

      const pushField = () => {
        current.push(field);
        field = '';
      };

      const pushRow = () => {
        rows.push(current);
        current = [];
      };

      for (let i = 0; i < input.length; i++) {
        const char = input[i];
        const next = input[i + 1];

        if (char === '"') {
          if (inQuotes && next === '"') {
            field += '"';
            i++; // skip escaped quote
          } else {
            inQuotes = !inQuotes;
          }
          continue;
        }

        if (char === ',' && !inQuotes) {
          pushField();
          continue;
        }

        if ((char === '\n' || char === '\r') && !inQuotes) {
          // treat CRLF / LF uniformly
          if (char === '\r' && next === '\n') i++;
          pushField();
          pushRow();
          continue;
        }

        field += char;
      }

      // flush last field/row
      pushField();
      if (current.length > 0) {
        pushRow();
      }

      // drop empty trailing rows
      return rows.filter((r) => r.some((c) => c.trim().length > 0));
    };

    const rows = parseCsv(csv);
    if (rows.length === 0) return null;

    const maxCols = Math.max(...rows.map((r) => r.length));

    const isNumeric = (value: string) => /^[-+]?\d+(\.\d+)?$/.test(value.trim());

    const looksLikeHeader =
      rows.length > 1 &&
      rows[0].some((cell) => !isNumeric(cell)) &&
      rows[0].every((cell) => cell.trim().length > 0);

    const headers = looksLikeHeader
      ? rows[0]
      : Array.from({ length: maxCols }, (_, idx) => `열 ${idx + 1}`);

    const dataRows = looksLikeHeader ? rows.slice(1) : rows;
    if (dataRows.length === 0) return null;

    const normalizedRows = dataRows.map((r) => {
      const padded = [...r];
      while (padded.length < maxCols) padded.push('');
      return padded;
    });

    return { headers, rows: normalizedRows };
  }, [csvString]);

  const fetchData = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent === true;
    try {
      if (!silent) {
        setLoading(true);
      }

      const response = await fetch(`/api/apis/${params.id}`, { cache: 'no-store' });
      if (!response.ok) {
        setApi(null);
        return;
      }
      const data = await response.json();
      setApi(data);
      setCsvInput(typeof data.pricing === 'string' ? data.pricing : data.pricing?.csv || '');

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
      if (!silent) {
        setLoading(false);
      }
    }
  }, [params.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const fetchPointRules = async () => {
      try {
        const response = await fetch('/api/point-rules?actionTypes=csv_upload,csv_update', { cache: 'no-store' });
        if (!response.ok) return;
        const data = await response.json();
        setPointRules({
          upload: typeof data?.csv_upload === 'number' ? data.csv_upload : 5,
          update: typeof data?.csv_update === 'number' ? data.csv_update : 2,
        });
      } catch (error) {
        console.error('Error fetching point rules:', error);
      }
    };

    fetchPointRules();
  }, []);

  const handleSaveCsv = async () => {
    if (!api) return;
    setSavingCsv(true);
    setSaveMessage('');
    try {
      const response = await fetch(`/api/apis/${api.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv: csvInput }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.error || '저장에 실패했습니다.');
      }

      const awarded = typeof payload?.pointsAwarded === 'number' ? payload.pointsAwarded : null;
      setAwardedPoints(awarded);
      setShowPointModal(true);
      setSaveMessage(awarded ? `저장 완료! 포인트 +${awarded} 적립되었습니다.` : '저장 완료!');
      setEditingCsv(false);
      await fetchData({ silent: true });
    } catch (error: any) {
      setSaveMessage(error.message || '저장에 실패했습니다.');
    } finally {
      setSavingCsv(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-light)' }}>
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#2196F3', borderTopColor: 'transparent' }}></div>
          <p className="mt-4 text-sm text-gray-600">API 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }
  if (!api) return <div>API not found</div>;

  const tabs = [
    { id: '개요', label: '개요' },
    { id: '비용 정보', label: '비용정보' },
    { id: '후기', label: '후기' },
    { id: '코드 예제', label: '코드예제' },
  ];

  return (
    <div className={`min-h-screen ${styles.apiDetailPage}`} style={{ backgroundColor: 'var(--bg-light)' }}>
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 py-8 pt-28 relative">
          <PointNotificationModal
            isOpen={showPointModal}
            onClose={() => setShowPointModal(false)}
            points={awardedPoints ?? 0}
            message={awardedPoints ? `포인트 ${awardedPoints}점이 적립되었습니다.` : '포인트가 적립되었습니다.'}
          />
       
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
                   <WikiEditor
                     apiId={api.id}
                     initialContent={api.wiki_content || ''}
                     onSave={() => fetchData({ silent: true })}
                   />
                   </div>
                 </div>
              </div>
            </>
          )}

          {activeTab === '비용 정보' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#0f172a]">상세 요금표</h3>
                  <button
                    onClick={() => {
                      setEditingCsv((prev) => !prev);
                      setSaveMessage('');
                      setCsvInput(csvString);
                    }}
                    className="text-sm px-3 py-1.5 rounded-md border border-gray-200 text-[#0c4a6e] hover:border-sky-400"
                  >
                    {editingCsv ? '닫기' : '비용정보 업데이트하기'}
                  </button>
                </div>

                {editingCsv && (
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-[#0f172a]">CSV 업로드 / 수정</h4>
                        <p className="text-xs text-gray-500 mt-1">첫 줄에 헤더가 없어도 자동으로 열을 만듭니다.</p>
                      </div>
                      <span className="text-xs text-[#0c4a6e]">신규 업로드 {pointRules.upload}점 · 수정 {pointRules.update}점</span>
                    </div>
                    <textarea
                      className="w-full min-h-[180px] rounded-lg border border-gray-200 p-3 text-sm font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      value={csvInput}
                      onChange={(e) => setCsvInput(e.target.value)}
                      placeholder="Plan,Price,Notes\nFree,0,기본 제공\nPro,49,월 구독"
                    />
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleSaveCsv}
                        disabled={savingCsv}
                        className="px-4 py-2 rounded-md bg-[#0c4a6e] text-white text-sm font-medium hover:bg-[#0a3b56] disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {savingCsv ? '저장 중...' : 'CSV 저장'}
                      </button>
                      <button
                        onClick={() => { setEditingCsv(false); setCsvInput(csvString); setSaveMessage(''); }}
                        className="px-4 py-2 rounded-md border border-gray-200 text-sm font-medium text-gray-700 hover:border-sky-300"
                      >
                        취소
                      </button>
                      {saveMessage && (
                        <span className="text-sm text-gray-600">{saveMessage}</span>
                      )}
                    </div>
                  </div>
                )}

                {pricingTable ? (
                  <div className="overflow-auto">
                    <table className="min-w-full text-sm text-left text-gray-700 border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          {pricingTable.headers.map((header, idx) => (
                            <th key={idx} className="py-2 pr-4 font-semibold text-[#0c4a6e]">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {pricingTable.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="border-b border-gray-100 last:border-0">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="py-2 pr-4 align-top">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">등록된 요금표가 없습니다. 업데이트 버튼을 눌러 CSV를 추가하세요.</div>
                )}
              </div>

              {(api?.pricing && ((api.pricing as any).free || (api.pricing as any).basic || (api.pricing as any).pro)) ? (
                <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-[#0f172a] mb-4">요금제 요약</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['free', 'basic', 'pro'].map((tier) => {
                      const labelMap: Record<string, string> = {
                        free: 'Free',
                        basic: 'Basic',
                        pro: 'Pro',
                      };
                      const value = (api?.pricing as any)?.[tier];
                      if (!value) return null;
                      return (
                        <div key={tier} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                          <div className="text-sm font-semibold text-[#0c4a6e] mb-2">{labelMap[tier]}</div>
                          <p className="text-sm text-gray-700 whitespace-pre-line">{value}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {!pricingTable && csvString && (
                <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm text-sm text-gray-500">
                  요금표 데이터를 읽지 못했습니다. CSV 형식을 확인해주세요.
                </div>
              )}
            </div>
          )}

          {activeTab !== '개요' && activeTab !== '비용 정보' && (
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
