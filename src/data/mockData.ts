// placeholder: mock data
// src/data/mockData.ts

import { API, NewsItem } from '@/types';

// Mock 데이터용 타입 (새로 추가된 필드는 선택사항)
// 실제 사용 시에는 타입 단언을 통해 API[]로 변환
type MockAPI = Omit<API, 'slug' | 'status' | 'created_at' | 'updated_at'> & {
  slug?: string;
  status?: API['status'];
  created_at?: Date | string;
  updated_at?: Date | string;
};

const _mockAPIs: MockAPI[] = [
  {
    id: '1',
    name: 'Youtube API',
    company: 'Google',
    logo: '🎥',
    rating: 4.8,
    users: '1.2B',
    price: 'free',
    description: '강력한 동영상 플랫폼 API로 업로드, 검색, 재생 등 다양한 기능 제공',
    categories: ['미디어', 'SNS'],
    features: ['동영상 업로드', '검색', '재생목록 관리', '라이브 스트리밍'],
    pricing: {
      free: '일일 10,000 할당량',
      basic: '월 $100 - 100,000 할당량',
      pro: '월 $1,000 - 1,000,000 할당량'
    }
    ,
    countries: ['전세계'],
    authMethods: ['OAuth2', 'APIKey'],
    docsLanguages: ['영어'],
    relatedIds: ['19', '2', '6'],
    viewsLast7Days: 120000,
    recommendedForStacks: ['React', 'Node.js']
  },
  {
    id: '2',
    name: 'OpenStreetMap',
    company: 'OpenStreetMap Foundation',
    logo: '🗺️',
    rating: 4.1,
    users: '760M',
    price: 'mixed',
    description: '오픈소스 기반 전 세계 지도 데이터 제공',
    categories: ['지도', '위치'],
    features: ['지도 표시', '경로 탐색', '장소 검색', '지오코딩'],
    pricing: {
      free: '무료 (제한적)',
      basic: '월 $50 - 상업적 이용',
      pro: '커스텀 플랜'
    }
    ,
    countries: ['전세계'],
    authMethods: ['APIKey'],
    docsLanguages: ['영어'],
    relatedIds: ['5', '6', '8'],
    viewsLast7Days: 76000,
    recommendedForStacks: ['Leaflet', 'OpenLayers']
  },
  {
    id: '3',
    name: 'Google Login',
    company: 'Google',
    logo: '🔐',
    rating: 4.7,
    users: '2.1B',
    price: 'free',
    description: '구글 계정으로 간편하게 로그인하는 OAuth 2.0 인증',
    categories: ['소셜로그인', '인증'],
    features: ['OAuth 2.0', '원클릭 로그인', '프로필 정보', '보안'],
    pricing: {
      free: '완전 무료'
    }
    ,
    countries: ['전세계'],
    authMethods: ['OAuth2'],
    docsLanguages: ['영어', '한국어'],
    relatedIds: ['12', '30'],
    viewsLast7Days: 98000,
    recommendedForStacks: ['Web', 'Android', 'iOS']
  },
  {
    id: '4',
    name: 'OpenAI GPT-5',
    company: 'OpenAI',
    logo: '🤖',
    rating: 4.1,
    users: '970M',
    price: 'paid',
    description: '최신 AI 언어 모델로 대화, 텍스트 생성, 분석 등 지원',
    categories: ['AI', '번역'],
    features: ['텍스트 생성', '대화형 AI', '번역', '요약'],
    pricing: {
      basic: '토큰당 $0.002',
      pro: '토큰당 $0.06 (GPT-5)'
    }
    ,
    countries: ['전세계'],
    authMethods: ['APIKey', 'OAuth2'],
    docsLanguages: ['영어'],
    relatedIds: ['8', '17', '30'],
    viewsLast7Days: 220000,
    recommendedForStacks: ['Python', 'Node.js']
  },
  {
    id: '5',
    name: '네이버 지도 API',
    company: 'Naver',
    logo: '🗺️',
    rating: 4.7,
    users: '520M',
    price: 'free',
    description: '국내 환경에 최적화된 지도 API',
    categories: ['지도', '위치'],
    features: ['지도 표시', '길찾기', 'POI 검색', '로드뷰'],
    pricing: {
      free: '일일 30만건 무료',
      basic: '초과분 건당 0.05원'
    }
    ,
    countries: ['한국'],
    authMethods: ['APIKey'],
    docsLanguages: ['한국어', '영어'],
    relatedIds: ['6', '2'],
    viewsLast7Days: 45000,
    recommendedForStacks: ['React', 'Vue']
  },
  {
    id: '6',
    name: '카카오맵 API',
    company: 'Kakao',
    logo: '🗺️',
    rating: 4.8,
    users: '480M',
    price: 'free',
    description: '다음 지도 기반 강력한 로컬 검색',
    categories: ['지도', '위치'],
    features: ['지도 표시', '로컬 검색', '로드뷰', '길찾기'],
    pricing: {
      free: '일일 30만건 무료'
    }
    ,
    countries: ['한국'],
    authMethods: ['APIKey', 'OAuth2'],
    docsLanguages: ['한국어'],
    relatedIds: ['5', '2'],
    viewsLast7Days: 52000,
    recommendedForStacks: ['Web', 'Android']
  },
  {
    id: '7',
    name: 'Toss Payments',
    company: 'Toss',
    logo: '💳',
    rating: 4.6,
    users: '480M',
    price: 'mixed',
    description: '간편한 결제 시스템 API',
    categories: ['결제', '금융'],
    features: ['간편결제', '정기결제', '환불', '거래내역'],
    pricing: {
      free: '월 100건 무료',
      basic: '건당 0.9%',
      pro: '건당 0.7%'
    }
    ,
    countries: ['한국'],
    authMethods: ['APIKey'],
    docsLanguages: ['한국어'],
    relatedIds: ['10', '22'],
    viewsLast7Days: 31000,
    recommendedForStacks: ['Backend', 'Node.js']
  },
  {
    id: '8',
    name: 'AWS S3',
    company: 'Amazon',
    logo: '☁️',
    rating: 4.5,
    users: '1.5B',
    price: 'paid',
    description: '클라우드 기반 객체 스토리지',
    categories: ['스토리지', '클라우드'],
    features: ['파일 저장', 'CDN', '백업', '버전관리'],
    pricing: {
      free: '첫 12개월 5GB 무료',
      basic: 'GB당 $0.023',
      pro: 'GB당 $0.021 (대용량)'
    }
    ,
    countries: ['전세계'],
    authMethods: ['APIKey', 'IAM'],
    docsLanguages: ['영어'],
    relatedIds: ['17', '26'],
    viewsLast7Days: 150000,
    recommendedForStacks: ['Node.js', 'Python']
  },
  {
    id: '9',
    name: 'SendGrid',
    company: 'Twilio',
    logo: '📧',
    rating: 4.4,
    users: '380M',
    price: 'mixed',
    description: '이메일 발송 및 관리 API',
    categories: ['이메일', '알림'],
    features: ['대량 메일 발송', '템플릿 관리', '분석', '스팸 방지'],
    pricing: {
      free: '월 100건 무료',
      basic: '월 $19.95 - 50,000건',
      pro: '월 $89.95 - 100,000건'
    }
    ,
    countries: ['전세계'],
    authMethods: ['APIKey'],
    docsLanguages: ['영어'],
    relatedIds: ['15', '13'],
    viewsLast7Days: 22000,
    recommendedForStacks: ['Backend', 'Python']
  },
  {
    id: '10',
    name: 'Stripe',
    company: 'Stripe',
    logo: '💰',
    rating: 4.9,
    users: '890M',
    price: 'mixed',
    description: '글로벌 온라인 결제 처리 API',
    categories: ['결제', '금융'],
    features: ['카드 결제', '구독 관리', '송금', '사기 방지'],
    pricing: {
      free: '기본 무료',
      basic: '건당 2.9% + $0.30',
      pro: '커스텀 요금제'
    }
    ,
    countries: ['전세계'],
    authMethods: ['APIKey'],
    docsLanguages: ['영어'],
    relatedIds: ['7', '22'],
    viewsLast7Days: 98000,
    recommendedForStacks: ['Backend', 'Ruby', 'Node.js']
  },
  {
    id: '11',
    name: 'OpenWeatherMap',
    company: 'OpenWeather',
    logo: '🌤️',
    rating: 4.3,
    users: '620M',
    price: 'mixed',
    description: '실시간 날씨 및 기상 예보 API',
    categories: ['날씨', '데이터'],
    features: ['현재 날씨', '주간 예보', '기상 경보', '과거 데이터'],
    pricing: {
      free: '일일 1,000건 무료',
      basic: '월 $40 - 100,000건',
      pro: '월 $180 - 500,000건'
    }
  },
  {
    id: '12',
    name: 'Firebase Auth',
    company: 'Google',
    logo: '🔥',
    rating: 4.6,
    users: '1.8B',
    price: 'free',
    description: '간편한 사용자 인증 및 관리',
    categories: ['소셜로그인', '인증', '보안'],
    features: ['이메일 인증', '소셜 로그인', '전화번호 인증', '익명 로그인'],
    pricing: {
      free: '무제한 무료',
      basic: '부가 기능 유료'
    }
  },
  {
    id: '13',
    name: 'Twilio SMS',
    company: 'Twilio',
    logo: '💬',
    rating: 4.5,
    users: '720M',
    price: 'paid',
    description: 'SMS 및 음성 통신 API',
    categories: ['알림', '통신'],
    features: ['SMS 발송', '음성 통화', 'MMS', '국제 발송'],
    pricing: {
      basic: '건당 $0.0075',
      pro: '대량 할인 가능'
    }
  },
  {
    id: '14',
    name: 'GitHub API',
    company: 'GitHub',
    logo: '🐙',
    rating: 4.7,
    users: '1.1B',
    price: 'free',
    description: '코드 저장소 및 협업 도구 API',
    categories: ['데이터', '개발도구'],
    features: ['저장소 관리', 'Issue 추적', 'PR 관리', '통계'],
    pricing: {
      free: '시간당 5,000건'
    }
  },
  {
    id: '15',
    name: 'Slack API',
    company: 'Slack',
    logo: '💼',
    rating: 4.6,
    users: '560M',
    price: 'free',
    description: '팀 커뮤니케이션 및 봇 통합 API',
    categories: ['알림', '통신'],
    features: ['메시지 전송', '봇 생성', '채널 관리', '파일 공유'],
    pricing: {
      free: '무료'
    }
  },
  {
    id: '16',
    name: 'Discord API',
    company: 'Discord',
    logo: '🎮',
    rating: 4.4,
    users: '450M',
    price: 'free',
    description: '커뮤니티 및 봇 개발 API',
    categories: ['알림', '통신', 'SNS'],
    features: ['봇 생성', '메시지 전송', '음성 채널', '웹훅'],
    pricing: {
      free: '완전 무료'
    }
  },
  {
    id: '17',
    name: 'Cloudflare',
    company: 'Cloudflare',
    logo: '🛡️',
    rating: 4.8,
    users: '920M',
    price: 'mixed',
    description: 'CDN 및 보안 서비스 API',
    categories: ['보안', '네트워크', 'CDN'],
    features: ['DDoS 방어', 'CDN', 'DNS 관리', 'SSL'],
    pricing: {
      free: '기본 무료',
      basic: '월 $20',
      pro: '월 $200'
    }
  },
  {
    id: '18',
    name: 'Notion API',
    company: 'Notion',
    logo: '📝',
    rating: 4.5,
    users: '340M',
    price: 'free',
    description: '노션 데이터베이스 및 페이지 관리 API',
    categories: ['데이터', '생산성'],
    features: ['데이터베이스 CRUD', '페이지 생성', '블록 관리', '검색'],
    pricing: {
      free: '무료'
    }
  },
  {
    id: '19',
    name: 'Spotify API',
    company: 'Spotify',
    logo: '🎵',
    rating: 4.6,
    users: '680M',
    price: 'free',
    description: '음악 스트리밍 및 플레이리스트 API',
    categories: ['미디어', 'SNS'],
    features: ['음악 검색', '플레이리스트', '재생 제어', '추천'],
    pricing: {
      free: '완전 무료'
    }
  },
  {
    id: '20',
    name: 'Twitter API',
    company: 'X Corp',
    logo: '🐦',
    rating: 4.2,
    users: '850M',
    price: 'mixed',
    description: '소셜 미디어 데이터 및 트윗 관리 API',
    categories: ['SNS', '데이터'],
    features: ['트윗 게시', '타임라인', '검색', '분석'],
    pricing: {
      free: '월 1,500건',
      basic: '월 $100 - 10,000건',
      pro: '월 $5,000 - 1,000,000건'
    }
  },
  {
    id: '21',
    name: 'Instagram API',
    company: 'Meta',
    logo: '📷',
    rating: 4.3,
    users: '1.3B',
    price: 'free',
    description: '인스타그램 콘텐츠 관리 API',
    categories: ['SNS', '미디어'],
    features: ['게시물 업로드', '댓글 관리', '분석', '스토리'],
    pricing: {
      free: '무료 (비즈니스 계정)'
    }
  },
  {
    id: '22',
    name: '아임포트',
    company: '아임포트',
    logo: '💳',
    rating: 4.7,
    users: '280M',
    price: 'mixed',
    description: '국내 PG사 통합 결제 API',
    categories: ['결제', '금융'],
    features: ['다중 PG 연동', '간편결제', '정기결제', '결제 분석'],
    pricing: {
      free: '월 50건 무료',
      basic: '건당 1.2%',
      pro: '건당 0.9%'
    }
  },
  {
    id: '23',
    name: 'PASS 인증',
    company: 'SK텔레콤',
    logo: '📱',
    rating: 4.5,
    users: '420M',
    price: 'paid',
    description: '본인인증 및 전자서명 API',
    categories: ['인증', '보안'],
    features: ['휴대폰 본인인증', '전자서명', '신분증 진위확인', 'AML'],
    pricing: {
      basic: '건당 300원',
      pro: '대량 할인'
    }
  },
  {
    id: '24',
    name: 'KakaoTalk 알림톡',
    company: 'Kakao',
    logo: '💛',
    rating: 4.8,
    users: '650M',
    price: 'paid',
    description: '카카오톡 비즈니스 메시지 API',
    categories: ['알림', '통신'],
    features: ['알림톡', '친구톡', '템플릿 관리', '예약 발송'],
    pricing: {
      basic: '건당 8원',
      pro: '건당 6원 (대량)'
    }
  },
  {
    id: '25',
    name: 'Redis Cloud',
    company: 'Redis',
    logo: '🔴',
    rating: 4.7,
    users: '530M',
    price: 'mixed',
    description: '인메모리 데이터베이스 API',
    categories: ['데이터', '캐시'],
    features: ['키-값 저장', '캐싱', 'Pub/Sub', '실시간 처리'],
    pricing: {
      free: '30MB 무료',
      basic: '월 $5 - 250MB',
      pro: '월 $56 - 5GB'
    }
  },
  {
    id: '26',
    name: 'MongoDB Atlas',
    company: 'MongoDB',
    logo: '🍃',
    rating: 4.6,
    users: '710M',
    price: 'mixed',
    description: '클라우드 NoSQL 데이터베이스 API',
    categories: ['데이터', '클라우드'],
    features: ['문서 DB', '자동 스케일링', '백업', '분석'],
    pricing: {
      free: '512MB 무료',
      basic: '월 $57 - 10GB',
      pro: '월 $177 - 40GB'
    }
  },
  {
    id: '27',
    name: 'AWS Lambda',
    company: 'Amazon',
    logo: 'λ',
    rating: 4.5,
    users: '1.2B',
    price: 'mixed',
    description: '서버리스 함수 실행 API',
    categories: ['클라우드', '서버리스'],
    features: ['이벤트 기반 실행', '자동 스케일링', '다중 언어', '통합'],
    pricing: {
      free: '월 100만건 무료',
      basic: '100만건당 $0.20',
      pro: '커스텀'
    }
  },
  {
    id: '28',
    name: 'Google Analytics',
    company: 'Google',
    logo: '📊',
    rating: 4.4,
    users: '980M',
    price: 'free',
    description: '웹 및 앱 분석 API',
    categories: ['데이터', '분석'],
    features: ['방문자 추적', '이벤트 분석', '전환 추적', '보고서'],
    pricing: {
      free: '완전 무료',
      pro: '월 $150,000 (GA4 360)'
    }
  },
  {
    id: '29',
    name: 'Algolia',
    company: 'Algolia',
    logo: '🔍',
    rating: 4.7,
    users: '430M',
    price: 'mixed',
    description: '실시간 검색 API',
    categories: ['검색', '데이터'],
    features: ['빠른 검색', '자동완성', '필터링', 'AI 추천'],
    pricing: {
      free: '월 10,000건 무료',
      basic: '월 $1 - 100,000건',
      pro: '월 $299 - 1,000,000건'
    }
  },
  {
    id: '30',
    name: 'Auth0',
    company: 'Okta',
    logo: '🔐',
    rating: 4.6,
    users: '590M',
    price: 'mixed',
    description: '통합 인증 및 권한 관리 API',
    categories: ['소셜로그인', '인증', '보안'],
    tags: ['인증', 'OAuth', 'SSO', 'MFA', '보안', '로그인'],
    features: ['소셜 로그인', 'SSO', 'MFA', '사용자 관리'],
    pricing: {
      free: '월 7,000명 무료',
      basic: '월 $35 - 1,000명',
      pro: '월 $240 - 1,000명'
    }
  },
  {
    id: '31',
    name: 'Mailchimp API',
    company: 'Mailchimp',
    logo: '📮',
    rating: 4.3,
    users: '420M',
    price: 'mixed',
    description: '이메일 마케팅 및 자동화 플랫폼 API',
    categories: ['이메일', '마케팅'],
    tags: ['이메일', '마케팅', '뉴스레터', '자동화', 'CRM'],
    features: ['이메일 캠페인', '자동화', '분석', '구독자 관리'],
    pricing: {
      free: '월 500건 무료',
      basic: '월 $13 - 5,000건',
      pro: '월 $299 - 무제한'
    }
  },
  {
    id: '32',
    name: 'Google Maps API',
    company: 'Google',
    logo: '🗺️',
    rating: 4.8,
    users: '2.5B',
    price: 'mixed',
    description: '구글 지도 및 위치 기반 서비스 API',
    categories: ['지도', '위치'],
    tags: ['지도', '위치', 'GPS', '길찾기', '지오코딩', '장소검색'],
    features: ['지도 표시', '길찾기', '장소 검색', 'Street View'],
    pricing: {
      free: '월 $200 크레딧',
      basic: '1,000건당 $5',
      pro: '커스텀'
    }
  },
  {
    id: '33',
    name: 'Shopify API',
    company: 'Shopify',
    logo: '🛒',
    rating: 4.5,
    users: '310M',
    price: 'free',
    description: '이커머스 스토어 관리 API',
    categories: ['이커머스', '결제'],
    tags: ['쇼핑몰', '이커머스', '결제', '상품관리', '주문관리'],
    features: ['상품 관리', '주문 처리', '재고 관리', '결제'],
    pricing: {
      free: '무료 (Shopify 가입 필요)'
    }
  },
  {
    id: '34',
    name: 'Elasticsearch',
    company: 'Elastic',
    logo: '🔍',
    rating: 4.6,
    users: '540M',
    price: 'mixed',
    description: '분산 검색 및 분석 엔진 API',
    categories: ['검색', '데이터', '분석'],
    tags: ['검색', '분석', '로그', '데이터베이스', 'ELK'],
    features: ['전문 검색', '실시간 분석', '로그 분석', '데이터 시각화'],
    pricing: {
      free: '오픈소스 무료',
      basic: '월 $95',
      pro: '월 $175'
    }
  },
  {
    id: '35',
    name: 'PayPal API',
    company: 'PayPal',
    logo: '💵',
    rating: 4.4,
    users: '1.1B',
    price: 'mixed',
    description: '글로벌 온라인 결제 서비스 API',
    categories: ['결제', '금융'],
    tags: ['결제', '페이팔', '송금', '환불', '구독'],
    features: ['결제 처리', '송금', '환불', '구독 결제'],
    pricing: {
      free: '기본 무료',
      basic: '건당 3.4% + $0.30',
      pro: '커스텀'
    }
  },
  {
    id: '36',
    name: 'Zoom API',
    company: 'Zoom',
    logo: '📹',
    rating: 4.3,
    users: '780M',
    price: 'free',
    description: '화상 회의 및 웨비나 API',
    categories: ['통신', '화상회의'],
    tags: ['화상회의', 'Zoom', '웨비나', '미팅', '영상통화'],
    features: ['미팅 생성', '웨비나', '녹화', '참가자 관리'],
    pricing: {
      free: '무료 (Zoom 계정 필요)'
    }
  },
  {
    id: '37',
    name: 'Dropbox API',
    company: 'Dropbox',
    logo: '📦',
    rating: 4.2,
    users: '680M',
    price: 'free',
    description: '클라우드 파일 저장 및 공유 API',
    categories: ['스토리지', '클라우드'],
    tags: ['파일저장', '클라우드', '동기화', '공유', '백업'],
    features: ['파일 업로드', '공유', '동기화', '버전 관리'],
    pricing: {
      free: '무료 (Dropbox 계정 필요)'
    }
  },
  {
    id: '38',
    name: 'HubSpot API',
    company: 'HubSpot',
    logo: '🎯',
    rating: 4.5,
    users: '420M',
    price: 'mixed',
    description: 'CRM 및 마케팅 자동화 API',
    categories: ['마케팅', 'CRM'],
    tags: ['CRM', '마케팅', '세일즈', '자동화', '리드관리'],
    features: ['리드 관리', '이메일 마케팅', '분석', '자동화'],
    pricing: {
      free: '무료 (제한적)',
      basic: '월 $50',
      pro: '월 $800'
    }
  },
  {
    id: '39',
    name: 'Zendesk API',
    company: 'Zendesk',
    logo: '🎧',
    rating: 4.4,
    users: '390M',
    price: 'mixed',
    description: '고객 지원 및 티켓 관리 API',
    categories: ['고객지원', 'CRM'],
    tags: ['고객지원', '티켓', '헬프데스크', 'CS', '채팅'],
    features: ['티켓 관리', '라이브 챗', '지식베이스', '분석'],
    pricing: {
      free: '무료 (제한적)',
      basic: '월 $19/사용자',
      pro: '월 $49/사용자'
    }
  },
  {
    id: '40',
    name: 'Salesforce API',
    company: 'Salesforce',
    logo: '☁️',
    rating: 4.6,
    users: '890M',
    price: 'paid',
    description: '엔터프라이즈 CRM 플랫폼 API',
    categories: ['CRM', '비즈니스'],
    tags: ['CRM', '세일즈', '영업관리', '엔터프라이즈', '고객관리'],
    features: ['고객 관리', '영업 자동화', '분석', '통합'],
    pricing: {
      basic: '월 $25/사용자',
      pro: '월 $150/사용자'
    }
  },
  {
    id: '41',
    name: 'Trello API',
    company: 'Atlassian',
    logo: '📋',
    rating: 4.5,
    users: '520M',
    price: 'free',
    description: '프로젝트 관리 및 협업 보드 API',
    categories: ['생산성', '협업'],
    tags: ['프로젝트관리', '칸반', '태스크', '협업', '보드'],
    features: ['보드 관리', '카드 생성', '리스트', '라벨'],
    pricing: {
      free: '무료'
    }
  },
  {
    id: '42',
    name: 'Jira API',
    company: 'Atlassian',
    logo: '🔧',
    rating: 4.4,
    users: '610M',
    price: 'mixed',
    description: '이슈 추적 및 프로젝트 관리 API',
    categories: ['생산성', '개발도구'],
    tags: ['이슈추적', '버그관리', '프로젝트', '애자일', '스크럼'],
    features: ['이슈 관리', '스프린트', '보드', '워크플로우'],
    pricing: {
      free: '10명까지 무료',
      basic: '월 $7.75/사용자',
      pro: '월 $15.25/사용자'
    }
  },
  {
    id: '43',
    name: 'Asana API',
    company: 'Asana',
    logo: '✅',
    rating: 4.3,
    users: '380M',
    price: 'mixed',
    description: '팀 협업 및 태스크 관리 API',
    categories: ['생산성', '협업'],
    tags: ['태스크관리', '프로젝트', '협업', '일정관리', '팀워크'],
    features: ['태스크 관리', '프로젝트', '타임라인', '포트폴리오'],
    pricing: {
      free: '무료 (제한적)',
      basic: '월 $10.99/사용자',
      pro: '월 $24.99/사용자'
    }
  },
  {
    id: '44',
    name: 'GitLab API',
    company: 'GitLab',
    logo: '🦊',
    rating: 4.5,
    users: '480M',
    price: 'mixed',
    description: 'DevOps 플랫폼 및 CI/CD API',
    categories: ['개발도구', 'CI/CD'],
    tags: ['Git', 'CI/CD', 'DevOps', '코드저장소', '파이프라인'],
    features: ['저장소 관리', 'CI/CD', '이슈 추적', '코드 리뷰'],
    pricing: {
      free: '무료',
      basic: '월 $4/사용자',
      pro: '월 $19/사용자'
    }
  },
  {
    id: '45',
    name: 'Bitbucket API',
    company: 'Atlassian',
    logo: '🪣',
    rating: 4.3,
    users: '320M',
    price: 'mixed',
    description: 'Git 저장소 호스팅 및 협업 API',
    categories: ['개발도구', 'CI/CD'],
    tags: ['Git', '코드저장소', '브랜치', 'PR', '협업'],
    features: ['저장소 관리', 'PR 관리', '브랜치', 'Pipelines'],
    pricing: {
      free: '5명까지 무료',
      basic: '월 $3/사용자',
      pro: '월 $6/사용자'
    }
  },
  {
    id: '46',
    name: 'CircleCI API',
    company: 'CircleCI',
    logo: '⭕',
    rating: 4.4,
    users: '290M',
    price: 'mixed',
    description: 'CI/CD 파이프라인 자동화 API',
    categories: ['CI/CD', '개발도구'],
    tags: ['CI/CD', '파이프라인', '빌드', '테스트', '배포'],
    features: ['빌드 자동화', '테스트', '배포', '파이프라인'],
    pricing: {
      free: '월 6,000분 무료',
      basic: '월 $30',
      pro: '커스텀'
    }
  },
  {
    id: '47',
    name: 'Jenkins API',
    company: 'Jenkins',
    logo: '👨‍🔧',
    rating: 4.2,
    users: '410M',
    price: 'free',
    description: '오픈소스 CI/CD 자동화 서버 API',
    categories: ['CI/CD', '개발도구'],
    tags: ['CI/CD', 'Jenkins', '빌드', '자동화', '오픈소스'],
    features: ['빌드 자동화', '플러그인', '파이프라인', '배포'],
    pricing: {
      free: '오픈소스 무료'
    }
  },
  {
    id: '48',
    name: 'Docker Hub API',
    company: 'Docker',
    logo: '🐳',
    rating: 4.6,
    users: '720M',
    price: 'mixed',
    description: '컨테이너 이미지 저장소 API',
    categories: ['개발도구', '클라우드'],
    tags: ['Docker', '컨테이너', '이미지', '레지스트리', 'DevOps'],
    features: ['이미지 관리', '저장소', '태그', '웹훅'],
    pricing: {
      free: '무료 (제한적)',
      basic: '월 $5',
      pro: '월 $7/사용자'
    }
  },
  {
    id: '49',
    name: 'Kubernetes API',
    company: 'CNCF',
    logo: '☸️',
    rating: 4.7,
    users: '650M',
    price: 'free',
    description: '컨테이너 오케스트레이션 API',
    categories: ['개발도구', '클라우드'],
    tags: ['Kubernetes', '오케스트레이션', '컨테이너', 'K8s', 'DevOps'],
    features: ['파드 관리', '서비스', '배포', '스케일링'],
    pricing: {
      free: '오픈소스 무료'
    }
  },
  {
    id: '50',
    name: 'Heroku API',
    company: 'Salesforce',
    logo: '💜',
    rating: 4.3,
    users: '380M',
    price: 'mixed',
    description: '클라우드 애플리케이션 플랫폼 API',
    categories: ['클라우드', 'PaaS'],
    tags: ['PaaS', '배포', '클라우드', '앱호스팅', 'Heroku'],
    features: ['앱 배포', '스케일링', '애드온', '로그'],
    pricing: {
      free: '무료 dyno',
      basic: '월 $7/dyno',
      pro: '월 $50/dyno'
    }
  },
  {
    id: '51',
    name: 'Vercel API',
    company: 'Vercel',
    logo: '▲',
    rating: 4.7,
    users: '420M',
    price: 'mixed',
    description: 'Next.js 및 프론트엔드 배포 플랫폼 API',
    categories: ['클라우드', 'PaaS'],
    tags: ['Vercel', 'Next.js', '배포', '프론트엔드', 'SSR'],
    features: ['자동 배포', '프리뷰', '도메인', 'Edge Functions'],
    pricing: {
      free: '무료 (제한적)',
      basic: '월 $20',
      pro: '월 $50/사용자'
    }
  },
  {
    id: '52',
    name: 'Netlify API',
    company: 'Netlify',
    logo: '🌐',
    rating: 4.6,
    users: '390M',
    price: 'mixed',
    description: 'JAMstack 배포 및 호스팅 플랫폼 API',
    categories: ['클라우드', 'PaaS'],
    tags: ['Netlify', 'JAMstack', '배포', '정적사이트', 'CI/CD'],
    features: ['자동 배포', 'Functions', '폼', 'A/B 테스트'],
    pricing: {
      free: '무료 (제한적)',
      basic: '월 $19',
      pro: '월 $99'
    }
  },
  {
    id: '53',
    name: 'Cloudinary API',
    company: 'Cloudinary',
    logo: '🖼️',
    rating: 4.5,
    users: '340M',
    price: 'mixed',
    description: '미디어 관리 및 최적화 API',
    categories: ['미디어', '이미지처리'],
    tags: ['이미지', '동영상', 'CDN', '최적화', '변환'],
    features: ['이미지 업로드', '변환', '최적화', 'CDN'],
    pricing: {
      free: '월 25 크레딧',
      basic: '월 $89',
      pro: '월 $224'
    }
  },
  {
    id: '54',
    name: 'Imgur API',
    company: 'Imgur',
    logo: '🎨',
    rating: 4.2,
    users: '520M',
    price: 'free',
    description: '이미지 호스팅 및 공유 API',
    categories: ['미디어', '이미지'],
    tags: ['이미지', '호스팅', '공유', 'CDN', '갤러리'],
    features: ['이미지 업로드', '공유', '앨범', '댓글'],
    pricing: {
      free: '무료 (제한적)'
    }
  },
  {
    id: '55',
    name: 'Unsplash API',
    company: 'Unsplash',
    logo: '📸',
    rating: 4.6,
    users: '280M',
    price: 'free',
    description: '무료 고화질 이미지 라이브러리 API',
    categories: ['미디어', '이미지'],
    tags: ['이미지', '사진', '무료', '고화질', '스톡'],
    features: ['이미지 검색', '다운로드', '컬렉션', '사용자'],
    pricing: {
      free: '무료'
    }
  },
  {
    id: '56',
    name: 'Giphy API',
    company: 'Giphy',
    logo: '🎞️',
    rating: 4.4,
    users: '610M',
    price: 'free',
    description: 'GIF 검색 및 공유 API',
    categories: ['미디어', 'GIF'],
    tags: ['GIF', '애니메이션', '검색', '스티커', '밈'],
    features: ['GIF 검색', '트렌딩', '스티커', '업로드'],
    pricing: {
      free: '무료'
    }
  },
  {
    id: '57',
    name: 'Vimeo API',
    company: 'Vimeo',
    logo: '🎬',
    rating: 4.3,
    users: '370M',
    price: 'mixed',
    description: '동영상 호스팅 및 스트리밍 API',
    categories: ['미디어', '동영상'],
    tags: ['동영상', '스트리밍', '호스팅', 'VOD', '플레이어'],
    features: ['동영상 업로드', '스트리밍', '플레이어', '분석'],
    pricing: {
      free: '무료 (제한적)',
      basic: '월 $7',
      pro: '월 $20'
    }
  },
  {
    id: '58',
    name: 'SoundCloud API',
    company: 'SoundCloud',
    logo: '🎧',
    rating: 4.2,
    users: '450M',
    price: 'free',
    description: '음악 및 오디오 스트리밍 API',
    categories: ['미디어', '오디오'],
    tags: ['음악', '오디오', '스트리밍', '플레이어', '팟캐스트'],
    features: ['트랙 검색', '재생', '플레이리스트', '사용자'],
    pricing: {
      free: '무료'
    }
  },
  {
    id: '59',
    name: 'Mixpanel API',
    company: 'Mixpanel',
    logo: '📈',
    rating: 4.5,
    users: '310M',
    price: 'mixed',
    description: '사용자 행동 분석 API',
    categories: ['분석', '데이터'],
    tags: ['분석', '사용자추적', '이벤트', '퍼널', 'A/B테스트'],
    features: ['이벤트 추적', '퍼널', '코호트', 'A/B 테스트'],
    pricing: {
      free: '무료 (제한적)',
      basic: '월 $25',
      pro: '월 $833'
    }
  },
  {
    id: '60',
    name: 'Amplitude API',
    company: 'Amplitude',
    logo: '📊',
    rating: 4.6,
    users: '290M',
    price: 'mixed',
    description: '제품 분석 및 사용자 인사이트 API',
    categories: ['분석', '데이터'],
    tags: ['분석', '제품분석', '사용자행동', '리텐션', '퍼널'],
    features: ['이벤트 분석', '리텐션', '퍼널', '코호트'],
    pricing: {
      free: '무료 (제한적)',
      basic: '월 $49',
      pro: '커스텀'
    }
  },
  {
    id: '61',
    name: 'Segment API',
    company: 'Twilio',
    logo: '🔄',
    rating: 4.5,
    users: '380M',
    price: 'mixed',
    description: '고객 데이터 플랫폼 API',
    categories: ['데이터', '분석'],
    tags: ['CDP', '데이터통합', '고객데이터', '세그먼트', 'ETL'],
    features: ['데이터 수집', '통합', '라우팅', '변환'],
    pricing: {
      free: '무료 (제한적)',
      basic: '월 $120',
      pro: '커스텀'
    }
  },
  {
    id: '62',
    name: 'Intercom API',
    company: 'Intercom',
    logo: '💬',
    rating: 4.4,
    users: '320M',
    price: 'paid',
    description: '고객 메시징 및 지원 플랫폼 API',
    categories: ['고객지원', '채팅'],
    tags: ['채팅', '고객지원', '메시징', '봇', '인터콤'],
    features: ['라이브 챗', '메시징', '봇', '헬프센터'],
    pricing: {
      basic: '월 $39',
      pro: '월 $99'
    }
  },
  {
    id: '63',
    name: 'PagerDuty API',
    company: 'PagerDuty',
    logo: '🚨',
    rating: 4.3,
    users: '270M',
    price: 'paid',
    description: '인시던트 관리 및 알림 플랫폼 API',
    categories: ['모니터링', '알림'],
    tags: ['인시던트', '알림', '모니터링', '온콜', 'DevOps'],
    features: ['인시던트 관리', '온콜', '에스컬레이션', '알림'],
    pricing: {
      basic: '월 $21/사용자',
      pro: '월 $41/사용자'
    }
  },
  {
    id: '64',
    name: 'Datadog API',
    company: 'Datadog',
    logo: '🐶',
    rating: 4.6,
    users: '430M',
    price: 'paid',
    description: '모니터링 및 보안 플랫폼 API',
    categories: ['모니터링', '보안'],
    tags: ['모니터링', 'APM', '로그', '메트릭', 'DevOps'],
    features: ['인프라 모니터링', 'APM', '로그 관리', '보안'],
    pricing: {
      basic: '월 $15/호스트',
      pro: '월 $23/호스트'
    }
  },
  {
    id: '65',
    name: 'New Relic API',
    company: 'New Relic',
    logo: '🔭',
    rating: 4.4,
    users: '380M',
    price: 'mixed',
    description: '애플리케이션 성능 모니터링 API',
    categories: ['모니터링', 'APM'],
    tags: ['APM', '모니터링', '성능', '트레이싱', 'DevOps'],
    features: ['APM', '인프라 모니터링', '로그', '알림'],
    pricing: {
      free: '월 100GB 무료',
      basic: '월 $49',
      pro: '월 $349'
    }
  },
  {
    id: '66',
    name: 'Sentry API',
    company: 'Sentry',
    logo: '🐛',
    rating: 4.5,
    users: '490M',
    price: 'mixed',
    description: '에러 추적 및 모니터링 API',
    categories: ['모니터링', '에러추적'],
    tags: ['에러추적', '버그', '모니터링', '크래시', 'DevOps'],
    features: ['에러 추적', '성능 모니터링', '알림', '통합'],
    pricing: {
      free: '월 5,000 에러',
      basic: '월 $26',
      pro: '월 $80'
    }
  },
  {
    id: '67',
    name: 'LogRocket API',
    company: 'LogRocket',
    logo: '📹',
    rating: 4.3,
    users: '210M',
    price: 'paid',
    description: '프론트엔드 세션 리플레이 및 분석 API',
    categories: ['모니터링', '분석'],
    tags: ['세션리플레이', '프론트엔드', '에러추적', 'UX', '모니터링'],
    features: ['세션 리플레이', '에러 추적', '성능', '분석'],
    pricing: {
      basic: '월 $99',
      pro: '월 $249'
    }
  },
  {
    id: '68',
    name: 'Contentful API',
    company: 'Contentful',
    logo: '📄',
    rating: 4.5,
    users: '280M',
    price: 'mixed',
    description: '헤드리스 CMS API',
    categories: ['CMS', '콘텐츠'],
    tags: ['CMS', '헤드리스', '콘텐츠관리', 'API-first', 'JAMstack'],
    features: ['콘텐츠 관리', 'API-first', '다국어', '버전 관리'],
    pricing: {
      free: '무료 (제한적)',
      basic: '월 $300',
      pro: '커스텀'
    }
  },
  {
    id: '69',
    name: 'Strapi API',
    company: 'Strapi',
    logo: '🚀',
    rating: 4.4,
    users: '240M',
    price: 'free',
    description: '오픈소스 헤드리스 CMS API',
    categories: ['CMS', '콘텐츠'],
    tags: ['CMS', '헤드리스', '오픈소스', 'Node.js', 'API'],
    features: ['콘텐츠 관리', 'REST/GraphQL', '플러그인', '커스터마이징'],
    pricing: {
      free: '오픈소스 무료'
    }
  },
  {
    id: '70',
    name: 'Sanity API',
    company: 'Sanity',
    logo: '📚',
    rating: 4.6,
    users: '190M',
    price: 'mixed',
    description: '실시간 헤드리스 CMS API',
    categories: ['CMS', '콘텐츠'],
    tags: ['CMS', '헤드리스', '실시간', 'GROQ', '콘텐츠'],
    features: ['실시간 협업', 'GROQ 쿼리', '이미지 처리', 'GraphQL'],
    pricing: {
      free: '무료 (제한적)',
      basic: '월 $99',
      pro: '월 $949'
    }
  },
  {
    id: '71',
    name: 'WordPress API',
    company: 'Automattic',
    logo: 'ℹ️',
    rating: 4.2,
    users: '1.4B',
    price: 'free',
    description: 'WordPress REST API',
    categories: ['CMS', '블로그'],
    tags: ['WordPress', 'CMS', '블로그', 'REST', 'WP'],
    features: ['게시물 관리', '미디어', '사용자', '테마'],
    pricing: {
      free: '오픈소스 무료'
    }
  },
  {
    id: '72',
    name: 'Airtable API',
    company: 'Airtable',
    logo: '🔷',
    rating: 4.5,
    users: '350M',
    price: 'mixed',
    description: '스프레드시트 데이터베이스 API',
    categories: ['데이터', '생산성'],
    tags: ['데이터베이스', '스프레드시트', 'NoCode', '협업', 'Airtable'],
    features: ['레코드 관리', '테이블', '뷰', '첨부파일'],
    pricing: {
      free: '무료 (제한적)',
      basic: '월 $10/사용자',
      pro: '월 $20/사용자'
    }
  },
  {
    id: '73',
    name: 'Supabase API',
    company: 'Supabase',
    logo: '⚡',
    rating: 4.7,
    users: '320M',
    price: 'mixed',
    description: '오픈소스 Firebase 대안 API',
    categories: ['데이터', 'BaaS'],
    tags: ['데이터베이스', 'PostgreSQL', 'BaaS', '오픈소스', '실시간'],
    features: ['PostgreSQL', '실시간', '인증', '스토리지'],
    pricing: {
      free: '무료 (제한적)',
      basic: '월 $25',
      pro: '월 $599'
    }
  },
  {
    id: '74',
    name: 'Hasura API',
    company: 'Hasura',
    logo: '⚙️',
    rating: 4.6,
    users: '260M',
    price: 'mixed',
    description: 'GraphQL 엔진 및 데이터 API',
    categories: ['데이터', 'GraphQL'],
    tags: ['GraphQL', 'API', 'PostgreSQL', '실시간', '데이터베이스'],
    features: ['GraphQL API', '실시간 구독', '권한 관리', 'PostgreSQL'],
    pricing: {
      free: '오픈소스 무료',
      basic: '월 $99',
      pro: '월 $299'
    }
  },
  {
    id: '75',
    name: 'Apollo GraphQL API',
    company: 'Apollo',
    logo: '🌙',
    rating: 4.5,
    users: '390M',
    price: 'mixed',
    description: 'GraphQL 플랫폼 API',
    categories: ['GraphQL', '개발도구'],
    tags: ['GraphQL', 'API', 'Federation', '개발도구', 'Apollo'],
    features: ['GraphQL 서버', 'Federation', '캐싱', '모니터링'],
    pricing: {
      free: '무료 (제한적)',
      basic: '월 $29',
      pro: '커스텀'
    }
  },
  {
    id: '76',
    name: 'Postman API',
    company: 'Postman',
    logo: '📮',
    rating: 4.6,
    users: '580M',
    price: 'mixed',
    description: 'API 개발 및 테스트 플랫폼 API',
    categories: ['개발도구', 'API테스트'],
    tags: ['API테스트', '개발도구', 'Postman', '문서화', '협업'],
    features: ['API 테스트', '문서화', '모니터링', '협업'],
    pricing: {
      free: '무료 (제한적)',
      basic: '월 $12/사용자',
      pro: '월 $29/사용자'
    }
  },
  {
    id: '77',
    name: 'Swagger API',
    company: 'SmartBear',
    logo: '📋',
    rating: 4.4,
    users: '470M',
    price: 'mixed',
    description: 'OpenAPI 명세 및 문서화 도구 API',
    categories: ['개발도구', 'API문서'],
    tags: ['OpenAPI', 'Swagger', 'API문서', '명세', 'REST'],
    features: ['API 문서화', '명세', '테스트', '코드 생성'],
    pricing: {
      free: '오픈소스 무료',
      basic: '월 $75',
      pro: '월 $300'
    }
  },
  {
    id: '78',
    name: 'RapidAPI',
    company: 'RapidAPI',
    logo: '⚡',
    rating: 4.3,
    users: '410M',
    price: 'mixed',
    description: 'API 마켓플레이스 및 관리 플랫폼 API',
    categories: ['API마켓', '개발도구'],
    tags: ['API마켓플레이스', 'API관리', '통합', '개발도구', 'Hub'],
    features: ['API 검색', '통합', '분석', '관리'],
    pricing: {
      free: '무료 (제한적)',
      basic: '월 $50',
      pro: '커스텀'
    }
  },
  {
    id: '79',
    name: 'Twitch API',
    company: 'Twitch',
    logo: '🎮',
    rating: 4.4,
    users: '820M',
    price: 'free',
    description: '라이브 스트리밍 플랫폼 API',
    categories: ['스트리밍', 'SNS'],
    tags: ['스트리밍', '게임', 'Twitch', '라이브', '방송'],
    features: ['스트림 정보', '채팅', '클립', '사용자'],
    pricing: {
      free: '무료'
    }
  },
  {
    id: '80',
    name: 'LinkedIn API',
    company: 'Microsoft',
    logo: '💼',
    rating: 4.3,
    users: '930M',
    price: 'mixed',
    description: '비즈니스 네트워킹 플랫폼 API',
    categories: ['SNS', '비즈니스'],
    tags: ['LinkedIn', 'SNS', '비즈니스', '채용', '네트워킹'],
    features: ['프로필', '공유', '메시징', '채용'],
    pricing: {
      free: '제한적 무료',
      basic: '파트너쉽 필요',
      pro: '커스텀'
    }
  },
  {
    id: '81',
    name: 'Pinterest API',
    company: 'Pinterest',
    logo: '📌',
    rating: 4.2,
    users: '720M',
    price: 'free',
    description: '비주얼 검색 및 공유 플랫폼 API',
    categories: ['SNS', '이미지'],
    tags: ['Pinterest', '이미지', '비주얼검색', '핀', '보드'],
    features: ['핀 생성', '보드', '검색', '분석'],
    pricing: {
      free: '무료'
    }
  },
  {
    id: '82',
    name: 'Reddit API',
    company: 'Reddit',
    logo: '🤖',
    rating: 4.3,
    users: '680M',
    price: 'free',
    description: '커뮤니티 포럼 플랫폼 API',
    categories: ['SNS', '커뮤니티'],
    tags: ['Reddit', '커뮤니티', '포럼', '서브레딧', '게시글'],
    features: ['게시글', '댓글', '투표', '서브레딧'],
    pricing: {
      free: '무료'
    }
  },
  {
    id: '83',
    name: 'Telegram Bot API',
    company: 'Telegram',
    logo: '✈️',
    rating: 4.6,
    users: '890M',
    price: 'free',
    description: '텔레그램 봇 개발 API',
    categories: ['메신저', '봇'],
    tags: ['Telegram', '봇', '메신저', '채팅', '자동화'],
    features: ['봇 생성', '메시지', '명령어', '인라인 키보드'],
    pricing: {
      free: '완전 무료'
    }
  },
  {
    id: '84',
    name: 'WhatsApp Business API',
    company: 'Meta',
    logo: '💬',
    rating: 4.5,
    users: '2.2B',
    price: 'paid',
    description: 'WhatsApp 비즈니스 메시징 API',
    categories: ['메신저', '고객지원'],
    tags: ['WhatsApp', '메신저', '비즈니스', '메시징', '알림'],
    features: ['메시지 전송', '템플릿', '미디어', '상태'],
    pricing: {
      basic: '메시지당 요금',
      pro: '볼륨 할인'
    }
  },
  {
    id: '85',
    name: 'LINE Messaging API',
    company: 'LINE',
    logo: '💚',
    rating: 4.4,
    users: '780M',
    price: 'mixed',
    description: 'LINE 메신저 봇 API',
    categories: ['메신저', '봇'],
    tags: ['LINE', '메신저', '봇', '채팅', '알림'],
    features: ['메시지', '리치메뉴', 'Flex Message', '봇'],
    pricing: {
      free: '월 1,000건 무료',
      basic: '추가 건당 요금'
    }
  },
  {
    id: '86',
    name: 'Google Cloud Vision API',
    company: 'Google',
    logo: '👁️',
    rating: 4.7,
    users: '540M',
    price: 'mixed',
    description: '이미지 인식 및 분석 AI API',
    categories: ['AI', '이미지인식'],
    tags: ['AI', '이미지인식', 'OCR', '비전', '머신러닝'],
    features: ['객체 감지', 'OCR', '얼굴 인식', '라벨링'],
    pricing: {
      free: '월 1,000건 무료',
      basic: '1,000건당 $1.50',
      pro: '볼륨 할인'
    }
  },
  {
    id: '87',
    name: 'AWS Rekognition API',
    company: 'Amazon',
    logo: '👤',
    rating: 4.6,
    users: '480M',
    price: 'paid',
    description: '이미지 및 비디오 분석 AI API',
    categories: ['AI', '이미지인식'],
    tags: ['AI', '이미지분석', '얼굴인식', '객체탐지', 'AWS'],
    features: ['얼굴 분석', '객체 탐지', 'Celebrity 인식', '텍스트 감지'],
    pricing: {
      basic: '이미지당 $0.001',
      pro: '볼륨 할인'
    }
  },
  {
    id: '88',
    name: 'IBM Watson API',
    company: 'IBM',
    logo: '🧠',
    rating: 4.5,
    users: '420M',
    price: 'mixed',
    description: 'AI 및 머신러닝 플랫폼 API',
    categories: ['AI', '머신러닝'],
    tags: ['AI', 'Watson', '자연어처리', '머신러닝', 'IBM'],
    features: ['자연어 이해', '음성 인식', '번역', '챗봇'],
    pricing: {
      free: 'Lite 플랜',
      basic: '종량제',
      pro: '커스텀'
    }
  },
  {
    id: '89',
    name: 'Google Translate API',
    company: 'Google',
    logo: '🌍',
    rating: 4.6,
    users: '1.1B',
    price: 'paid',
    description: '자동 번역 API',
    categories: ['AI', '번역'],
    tags: ['번역', '다국어', 'AI', '언어', 'Google'],
    features: ['텍스트 번역', '언어 감지', '100+ 언어', 'NMT'],
    pricing: {
      basic: '100만 글자당 $20',
      pro: '볼륨 할인'
    }
  },
  {
    id: '90',
    name: 'DeepL API',
    company: 'DeepL',
    logo: '🔤',
    rating: 4.8,
    users: '310M',
    price: 'mixed',
    description: '고품질 AI 번역 API',
    categories: ['AI', '번역'],
    tags: ['번역', 'DeepL', 'AI', '고품질', '다국어'],
    features: ['고품질 번역', '30+ 언어', '문서 번역', 'Formality'],
    pricing: {
      free: '월 500,000자 무료',
      basic: '월 $5.49',
      pro: '월 $27.49'
    }
  }
];

export const newsItems: NewsItem[] = [
  {
    id: '1',
    title: '카카오맵 API 중단으로 혹시 겪은 사람 있나요',
    content: 'javascript appkey를 사용하고 도메인도 제대로 등록되어있고 잘쓰고 있었는데요! Uncaught ReferenceError: kakao is not defined...',
    author: 'anon40729937',
    date: '2시간 전'
  },
  {
    id: '2',
    title: 'OpenAI의 ChatGPT API 업데이트 소식',
    content: 'OpenAI에서 기본 ChatGPT API에 대해서 흥미로운 업데이트를 진행했습니다. 함수 호출(Function calling) 기능이 추가되었습니다...',
    author: 'tilnote',
    date: '5시간 전'
  },
  {
    id: '3',
    title: '새로운 결제 API, 코리아페이 출시',
    content: '국내 환경에 최적화된 새로운 결제 API 코리아페이가 출시되었습니다. 간편한 연동과 강력한 보안을 특징으로...',
    author: 'API WIKI News',
    date: '1일 전'
  },
  {
    id: '4',
    title: 'Stripe API 정기결제 구현 후기',
    content: 'SaaS 서비스를 런칭하면서 Stripe API로 정기결제를 구현했습니다. 웹훅 처리와 구독 관리가 정말 편하더라구요...',
    author: 'devkim',
    date: '1일 전'
  },
  {
    id: '5',
    title: 'Google Maps vs 카카오맵 API 비교',
    content: '두 API를 모두 써본 입장에서 비교해봤습니다. 국내 서비스는 확실히 카카오맵이 장소 정보가 정확하고, 글로벌은 Google Maps가...',
    author: 'mapdev',
    date: '2일 전'
  },
  {
    id: '6',
    title: 'Firebase Authentication 보안 이슈 주의',
    content: '최근 Firebase Auth를 사용하면서 보안 규칙 설정 실수로 인한 데이터 노출 사례가 늘고 있습니다. 꼭 보안 규칙을 제대로 설정하세요...',
    author: 'security_warn',
    date: '3일 전'
  },
  {
    id: '7',
    title: 'Supabase가 Firebase보다 나은 이유',
    content: 'PostgreSQL 기반이라 복잡한 쿼리도 가능하고, 오픈소스라 커스터마이징도 자유롭습니다. 실시간 기능도 훌륭하고...',
    author: 'backend_master',
    date: '4일 전'
  },
  {
    id: '8',
    title: 'Vercel vs Netlify 배포 속도 비교',
    content: 'Next.js 프로젝트를 두 플랫폼에 배포해봤는데, Vercel이 Next.js 최적화가 더 잘 되어있고 Edge Functions도 빠릅니다...',
    author: 'frontend_pro',
    date: '5일 전'
  },
  {
    id: '9',
    title: 'Slack API 봇 만들기 튜토리얼',
    content: '회사 업무 자동화를 위해 Slack 봇을 만들어봤습니다. Slash Commands와 Interactive Messages 구현 방법 공유합니다...',
    author: 'automate_dev',
    date: '6일 전'
  },
  {
    id: '10',
    title: 'AWS Lambda vs Vercel Functions 비용 비교',
    content: '서버리스 함수를 운영하면서 실제 비용을 비교해봤습니다. 소규모는 Vercel이, 대규모는 Lambda가 유리한 것 같습니다...',
    author: 'cost_optimizer',
    date: '1주일 전'
  }
];

export const categories = [
  '결제', '소셜로그인', '지도', '날씨', 'AI', '이메일', '금융', '데이터', '보안',
  '통신', '미디어', '개발도구', '클라우드', 'CMS', '분석', '모니터링', 'SNS', '협업'
];

// Ensure all mockAPIs have realistic metadata fields. Use simple heuristics where missing.
const companyCountryMap: Record<string, string[]> = {
  'Google': ['전세계'],
  'OpenStreetMap Foundation': ['전세계'],
  'Naver': ['한국'],
  'Kakao': ['한국'],
  'Toss': ['한국'],
  'Amazon': ['전세계'],
  'Twilio': ['전세계'],
  'Stripe': ['전세계'],
  'OpenWeather': ['전세계'],
  'MongoDB': ['전세계'],
  'Okta': ['전세계'],
  'GitHub': ['전세계'],
  'Meta': ['전세계'],
  'Redis': ['전세계']
};

for (const api of _mockAPIs) {
  // countries
  // @ts-ignore
  if (!api.countries) api.countries = companyCountryMap[api.company] || ['전세계'];

  // authMethods heuristic
  // @ts-ignore
  if (!api.authMethods) {
    if (api.categories.includes('인증') || api.name.toLowerCase().includes('auth') || api.name.toLowerCase().includes('login')) {
      // Authentication-related APIs
      // @ts-ignore
      api.authMethods = ['OAuth2', 'APIKey'];
    } else if (api.categories.includes('결제')) {
      // Payment APIs often use API keys or OAuth
      // @ts-ignore
      api.authMethods = ['APIKey'];
    } else {
      // default
      // @ts-ignore
      api.authMethods = ['APIKey'];
    }
  }

  // docsLanguages default
  // @ts-ignore
  if (!api.docsLanguages) {
    // Korean-first for Korean companies
    if (api.company === 'Naver' || api.company === 'Kakao' || api.company === 'Toss' || api.company === '아임포트' || api.company === 'Kakao') {
      // @ts-ignore
      api.docsLanguages = ['한국어', '영어'];
    } else {
      // @ts-ignore
      api.docsLanguages = ['영어'];
    }
  }

  // relatedIds: prefer existing, otherwise compute from categories
  // @ts-ignore
  if (!api.relatedIds || api.relatedIds.length === 0) {
    // Use category overlap to find related APIs
    // @ts-ignore
    const related = _mockAPIs.filter(a => a.id !== api.id && a.categories.some((c: string) => api.categories.includes(c))).slice(0, 4).map(a => a.id);
    // @ts-ignore
    api.relatedIds = related;
  }

  // viewsLast7Days default (mock realistic values)
  // @ts-ignore
  if (!api.viewsLast7Days) {
    // Simple heuristic: rating * users factor (users stored as string like '1.2B')
    const userStr = (api.users || '0').toString();
    let usersCount = 0;
    try {
      if (userStr.endsWith('B')) usersCount = parseFloat(userStr) * 1_000_000_000;
      else if (userStr.endsWith('M')) usersCount = parseFloat(userStr) * 1_000_000;
      else usersCount = parseFloat(userStr.replace(/[^0-9.]/g, '')) || 100000;
    } catch (e) {
      usersCount = 100000;
    }
    // Normalize to a small recent-views number
    // @ts-ignore
    api.viewsLast7Days = Math.max(1000, Math.floor((api.rating / 5) * Math.min(500000, usersCount / 1000)));
  }

  // recommendedForStacks default
  // @ts-ignore
  if (!api.recommendedForStacks) {
    // derive from categories
    const stacks: string[] = [];
    if (api.categories.includes('AI')) stacks.push('Python');
    if (api.categories.includes('지도') || api.categories.includes('위치')) stacks.push('React');
    if (api.categories.includes('결제')) stacks.push('Backend');
    if (stacks.length === 0) stacks.push('Node.js');
    // @ts-ignore
    api.recommendedForStacks = stacks;
  }

  // tags - generate from name, categories, features, company
  // @ts-ignore
  if (!api.tags) {
    const tags: string[] = [];
    // Add categories
    tags.push(...api.categories);
    // Add key words from name
    const nameParts = api.name.toLowerCase().split(' ');
    nameParts.forEach(part => {
      if (part.length > 2 && !tags.includes(part)) tags.push(part);
    });
    // Add company name
    if (api.company && !tags.includes(api.company)) tags.push(api.company);
    // Add some features if available
    if (api.features) {
      api.features.slice(0, 3).forEach(f => {
        if (!tags.includes(f)) tags.push(f);
      });
    }
    // @ts-ignore
    api.tags = tags.slice(0, 10); // Limit to 10 tags
  }
}

export function getAPIById(id: string): API | undefined {
  return _mockAPIs.find((api) => api.id === id) as API | undefined;
}

export function getRelatedAPIs(api: API, limit: number = 3): API[] {
  // If API defines relatedIds explicitly, use them (preserve order)
  if (api.relatedIds && api.relatedIds.length > 0) {
    return api.relatedIds
      .map(id => getAPIById(id))
      .filter((api): api is API => api !== undefined)
      .slice(0, limit);
  }

  // Otherwise, fallback: find APIs sharing at least one category
  return _mockAPIs
    .filter(a => a.id !== api.id && a.categories?.some(c => api.categories?.includes(c)))
    .slice(0, limit) as API[];
}

// Mock 데이터를 API[] 타입으로 export (타입 단언 사용)
export const mockAPIs = _mockAPIs as API[];
