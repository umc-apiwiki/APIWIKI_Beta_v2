// scripts/seed-database.js
// Supabase 데이터베이스에 테스트 데이터 추가

require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 샘플 API 데이터 50개
const sampleAPIs = [
  { name: 'Youtube API', company: 'Google', logo: '🎥', rating: 4.8, users: '1.2B', price: 'free', description: '강력한 동영상 플랫폼 API로 업로드, 검색, 재생 등 다양한 기능 제공', baseUrl: 'https://www.googleapis.com/youtube/v3', category: 'Media', categories: ['미디어', 'SNS'], slug: 'youtube-api' },
  { name: 'OpenStreetMap', company: 'OpenStreetMap Foundation', logo: '🗺️', rating: 4.1, users: '760M', price: 'mixed', description: '오픈소스 기반 전 세계 지도 데이터 제공', baseUrl: 'https://www.openstreetmap.org/api', category: 'Maps', categories: ['지도', '위치'], slug: 'openstreetmap' },
  { name: 'Google Login', company: 'Google', logo: '🔐', rating: 4.7, users: '2.1B', price: 'free', description: '구글 계정으로 간편하게 로그인하는 OAuth 2.0 인증', baseUrl: 'https://accounts.google.com/o/oauth2', category: 'Auth', categories: ['소셜로그인', '인증'], slug: 'google-login' },
  { name: 'OpenAI GPT-4', company: 'OpenAI', logo: '🤖', rating: 4.9, users: '970M', price: 'paid', description: '최신 AI 언어 모델로 대화, 텍스트 생성, 분석 등 지원', baseUrl: 'https://api.openai.com/v1', category: 'AI', categories: ['AI', '번역'], slug: 'openai-gpt4' },
  { name: 'Kakao Maps', company: 'Kakao', logo: '🗺️', rating: 4.3, users: '45M', price: 'free', description: '카카오맵 기반 한국 지역 지도 및 위치 서비스', baseUrl: 'https://dapi.kakao.com/v2/maps', category: 'Maps', categories: ['지도', '위치'], slug: 'kakao-maps' },
  { name: 'Naver Papago', company: 'Naver', logo: '🌐', rating: 4.6, users: '25M', price: 'free', description: '네이버 파파고 번역 API로 다양한 언어 번역', baseUrl: 'https://openapi.naver.com/v1/papago', category: 'Translation', categories: ['번역', 'AI'], slug: 'naver-papago' },
  { name: 'Spotify API', company: 'Spotify', logo: '🎵', rating: 4.5, users: '500M', price: 'free', description: '음악 스트리밍 및 플레이리스트 관리 API', baseUrl: 'https://api.spotify.com/v1', category: 'Music', categories: ['음악', '미디어'], slug: 'spotify-api' },
  { name: 'Twitter API', company: 'Twitter', logo: '🐦', rating: 4.2, users: '400M', price: 'mixed', description: '트위터 트윗 및 소셜 데이터 API', baseUrl: 'https://api.twitter.com/2', category: 'Social', categories: ['SNS', '소셜'], slug: 'twitter-api' },
  { name: 'GitHub API', company: 'GitHub', logo: '🐙', rating: 4.7, users: '100M', price: 'free', description: 'GitHub 저장소 및 프로젝트 관리 API', baseUrl: 'https://api.github.com', category: 'Developer Tools', categories: ['개발', '협업'], slug: 'github-api' },
  { name: 'Slack API', company: 'Slack', logo: '💬', rating: 4.6, users: '18M', price: 'free', description: '슬랙 메시징 및 워크스페이스 통합 API', baseUrl: 'https://slack.com/api', category: 'Communication', categories: ['협업', '커뮤니케이션'], slug: 'slack-api' },
  { name: 'Stripe API', company: 'Stripe', logo: '💳', rating: 4.8, users: '2M', price: 'paid', description: '온라인 결제 처리 API', baseUrl: 'https://api.stripe.com/v1', category: 'Payment', categories: ['결제', '금융'], slug: 'stripe-api' },
  { name: 'PayPal API', company: 'PayPal', logo: '💰', rating: 4.4, users: '400M', price: 'paid', description: '글로벌 결제 및 송금 API', baseUrl: 'https://api.paypal.com/v1', category: 'Payment', categories: ['결제', '금융'], slug: 'paypal-api' },
  { name: 'AWS S3', company: 'Amazon', logo: '☁️', rating: 4.7, users: '1M', price: 'paid', description: '클라우드 스토리지 및 파일 관리', baseUrl: 'https://s3.amazonaws.com', category: 'Cloud', categories: ['클라우드', '스토리지'], slug: 'aws-s3' },
  { name: 'Firebase', company: 'Google', logo: '🔥', rating: 4.6, users: '3M', price: 'free', description: '백엔드 서비스 및 실시간 데이터베이스', baseUrl: 'https://firebase.googleapis.com', category: 'Backend', categories: ['백엔드', 'DB'], slug: 'firebase' },
  { name: 'Twilio SMS', company: 'Twilio', logo: '📱', rating: 4.5, users: '10M', price: 'paid', description: 'SMS 및 음성 통신 API', baseUrl: 'https://api.twilio.com', category: 'Communication', categories: ['SMS', '통신'], slug: 'twilio-sms' },
  { name: 'SendGrid', company: 'SendGrid', logo: '📧', rating: 4.4, users: '80K', price: 'free', description: '이메일 전송 및 마케팅 API', baseUrl: 'https://api.sendgrid.com/v3', category: 'Email', categories: ['이메일', '마케팅'], slug: 'sendgrid' },
  { name: 'Mailchimp', company: 'Mailchimp', logo: '🐵', rating: 4.3, users: '12M', price: 'free', description: '이메일 마케팅 자동화 API', baseUrl: 'https://api.mailchimp.com/3.0', category: 'Marketing', categories: ['마케팅', '이메일'], slug: 'mailchimp' },
  { name: 'Instagram API', company: 'Meta', logo: '📷', rating: 4.1, users: '2B', price: 'free', description: '인스타그램 포스트 및 미디어 관리', baseUrl: 'https://graph.instagram.com', category: 'Social', categories: ['SNS', '소셜'], slug: 'instagram-api' },
  { name: 'Facebook Graph', company: 'Meta', logo: '👥', rating: 4.2, users: '3B', price: 'free', description: '페이스북 그래프 API로 소셜 데이터 접근', baseUrl: 'https://graph.facebook.com', category: 'Social', categories: ['SNS', '소셜'], slug: 'facebook-graph' },
  { name: 'Discord API', company: 'Discord', logo: '🎮', rating: 4.6, users: '150M', price: 'free', description: '디스코드 봇 및 서버 관리 API', baseUrl: 'https://discord.com/api', category: 'Communication', categories: ['커뮤니케이션', '게임'], slug: 'discord-api' },
  { name: 'Telegram Bot', company: 'Telegram', logo: '✈️', rating: 4.5, users: '700M', price: 'free', description: '텔레그램 봇 생성 및 메시징 API', baseUrl: 'https://api.telegram.org', category: 'Communication', categories: ['메시징', '봇'], slug: 'telegram-bot' },
  { name: 'Weather API', company: 'OpenWeather', logo: '🌤️', rating: 4.4, users: '5M', price: 'free', description: '실시간 날씨 및 기후 데이터', baseUrl: 'https://api.openweathermap.org', category: 'Weather', categories: ['날씨', '데이터'], slug: 'weather-api' },
  { name: 'News API', company: 'NewsAPI', logo: '📰', rating: 4.3, users: '50K', price: 'free', description: '전 세계 뉴스 헤드라인 및 기사', baseUrl: 'https://newsapi.org/v2', category: 'News', categories: ['뉴스', '미디어'], slug: 'news-api' },
  { name: 'Unsplash API', company: 'Unsplash', logo: '📸', rating: 4.7, users: '300K', price: 'free', description: '고품질 무료 이미지 라이브러리', baseUrl: 'https://api.unsplash.com', category: 'Images', categories: ['이미지', '미디어'], slug: 'unsplash-api' },
  { name: 'Pexels API', company: 'Pexels', logo: '🖼️', rating: 4.6, users: '200K', price: 'free', description: '무료 스톡 이미지 및 비디오', baseUrl: 'https://api.pexels.com/v1', category: 'Images', categories: ['이미지', '비디오'], slug: 'pexels-api' },
  { name: 'Giphy API', company: 'Giphy', logo: '🎬', rating: 4.5, users: '800M', price: 'free', description: 'GIF 검색 및 임베드 API', baseUrl: 'https://api.giphy.com/v1', category: 'Media', categories: ['GIF', '미디어'], slug: 'giphy-api' },
  { name: 'Reddit API', company: 'Reddit', logo: '🔴', rating: 4.2, users: '430M', price: 'free', description: '레딧 포스트 및 커뮤니티 데이터', baseUrl: 'https://www.reddit.com/api', category: 'Social', categories: ['SNS', '커뮤니티'], slug: 'reddit-api' },
  { name: 'LinkedIn API', company: 'LinkedIn', logo: '💼', rating: 4.3, users: '900M', price: 'free', description: '링크드인 프로필 및 네트워킹', baseUrl: 'https://api.linkedin.com/v2', category: 'Social', categories: ['비즈니스', 'SNS'], slug: 'linkedin-api' },
  { name: 'Zoom API', company: 'Zoom', logo: '🎥', rating: 4.4, users: '300M', price: 'free', description: '비디오 회의 및 웨비나 관리', baseUrl: 'https://api.zoom.us/v2', category: 'Communication', categories: ['화상회의', '협업'], slug: 'zoom-api' },
  { name: 'Google Drive', company: 'Google', logo: '📁', rating: 4.6, users: '1B', price: 'free', description: '클라우드 파일 저장 및 공유', baseUrl: 'https://www.googleapis.com/drive/v3', category: 'Storage', categories: ['스토리지', '클라우드'], slug: 'google-drive' },
  { name: 'Dropbox API', company: 'Dropbox', logo: '📦', rating: 4.5, users: '700M', price: 'free', description: '파일 동기화 및 공유 API', baseUrl: 'https://api.dropboxapi.com/2', category: 'Storage', categories: ['스토리지', '클라우드'], slug: 'dropbox-api' },
  { name: 'Notion API', company: 'Notion', logo: '📝', rating: 4.7, users: '30M', price: 'free', description: '노션 문서 및 데이터베이스 관리', baseUrl: 'https://api.notion.com/v1', category: 'Productivity', categories: ['생산성', '협업'], slug: 'notion-api' },
  { name: 'Trello API', company: 'Atlassian', logo: '📋', rating: 4.4, users: '50M', price: 'free', description: '프로젝트 관리 보드 API', baseUrl: 'https://api.trello.com/1', category: 'Productivity', categories: ['프로젝트관리', '협업'], slug: 'trello-api' },
  { name: 'Asana API', company: 'Asana', logo: '✅', rating: 4.5, users: '100K', price: 'free', description: '팀 작업 및 프로젝트 추적', baseUrl: 'https://app.asana.com/api/1.0', category: 'Productivity', categories: ['프로젝트관리', '협업'], slug: 'asana-api' },
  { name: 'Jira API', company: 'Atlassian', logo: '🐛', rating: 4.3, users: '200K', price: 'free', description: '이슈 추적 및 애자일 관리', baseUrl: 'https://api.atlassian.com', category: 'Developer Tools', categories: ['개발', '프로젝트관리'], slug: 'jira-api' },
  { name: 'HubSpot API', company: 'HubSpot', logo: '🎯', rating: 4.4, users: '150K', price: 'free', description: 'CRM 및 마케팅 자동화', baseUrl: 'https://api.hubapi.com', category: 'Marketing', categories: ['마케팅', 'CRM'], slug: 'hubspot-api' },
  { name: 'Salesforce API', company: 'Salesforce', logo: '☁️', rating: 4.5, users: '150K', price: 'paid', description: '클라우드 기반 CRM 플랫폼', baseUrl: 'https://api.salesforce.com', category: 'CRM', categories: ['CRM', '비즈니스'], slug: 'salesforce-api' },
  { name: 'Shopify API', company: 'Shopify', logo: '🛒', rating: 4.6, users: '2M', price: 'free', description: '전자상거래 스토어 관리', baseUrl: 'https://api.shopify.com', category: 'E-commerce', categories: ['전자상거래', '쇼핑'], slug: 'shopify-api' },
  { name: 'WooCommerce', company: 'Automattic', logo: '🛍️', rating: 4.4, users: '5M', price: 'free', description: '워드프레스 기반 쇼핑몰 API', baseUrl: 'https://woocommerce.github.io/woocommerce-rest-api-docs', category: 'E-commerce', categories: ['전자상거래', '쇼핑'], slug: 'woocommerce' },
  { name: 'Square API', company: 'Square', logo: '⬛', rating: 4.5, users: '2M', price: 'paid', description: '결제 및 POS 시스템 API', baseUrl: 'https://connect.squareup.com', category: 'Payment', categories: ['결제', 'POS'], slug: 'square-api' },
  { name: 'Google Analytics', company: 'Google', logo: '📊', rating: 4.7, users: '30M', price: 'free', description: '웹사이트 분석 및 추적', baseUrl: 'https://www.googleapis.com/analytics/v3', category: 'Analytics', categories: ['분석', '마케팅'], slug: 'google-analytics' },
  { name: 'Mixpanel API', company: 'Mixpanel', logo: '📈', rating: 4.5, users: '26K', price: 'free', description: '사용자 행동 분석 플랫폼', baseUrl: 'https://api.mixpanel.com', category: 'Analytics', categories: ['분석', '데이터'], slug: 'mixpanel-api' },
  { name: 'Amplitude API', company: 'Amplitude', logo: '📉', rating: 4.6, users: '12K', price: 'free', description: '제품 분석 및 인사이트', baseUrl: 'https://api.amplitude.com', category: 'Analytics', categories: ['분석', '데이터'], slug: 'amplitude-api' },
  { name: 'Google Cloud Vision', company: 'Google', logo: '👁️', rating: 4.7, users: '100K', price: 'paid', description: '이미지 인식 및 OCR API', baseUrl: 'https://vision.googleapis.com/v1', category: 'AI', categories: ['AI', '이미지'], slug: 'google-cloud-vision' },
  { name: 'AWS Rekognition', company: 'Amazon', logo: '🔍', rating: 4.6, users: '50K', price: 'paid', description: '이미지 및 비디오 분석', baseUrl: 'https://rekognition.amazonaws.com', category: 'AI', categories: ['AI', '이미지'], slug: 'aws-rekognition' },
  { name: 'Azure Cognitive', company: 'Microsoft', logo: '🧠', rating: 4.5, users: '80K', price: 'paid', description: '인지 서비스 및 AI API', baseUrl: 'https://api.cognitive.microsoft.com', category: 'AI', categories: ['AI', '인지'], slug: 'azure-cognitive' },
  { name: 'Google Translate', company: 'Google', logo: '🌍', rating: 4.8, users: '500M', price: 'paid', description: '다국어 번역 서비스', baseUrl: 'https://translation.googleapis.com/language/translate/v2', category: 'Translation', categories: ['번역', 'AI'], slug: 'google-translate' },
  { name: 'DeepL API', company: 'DeepL', logo: '🗣️', rating: 4.9, users: '1M', price: 'free', description: '고품질 AI 기반 번역', baseUrl: 'https://api.deepl.com/v2', category: 'Translation', categories: ['번역', 'AI'], slug: 'deepl-api' },
  { name: 'IBM Watson', company: 'IBM', logo: '🤖', rating: 4.4, users: '50K', price: 'paid', description: 'AI 및 머신러닝 플랫폼', baseUrl: 'https://api.ibm.com/watson', category: 'AI', categories: ['AI', '머신러닝'], slug: 'ibm-watson' },
  { name: 'Wolfram Alpha', company: 'Wolfram', logo: '🔢', rating: 4.5, users: '10M', price: 'paid', description: '계산 지식 엔진 API', baseUrl: 'https://api.wolframalpha.com/v2', category: 'Knowledge', categories: ['지식', '계산'], slug: 'wolfram-alpha' }
];

async function seedDatabase() {
  console.log('🌱 데이터베이스 시딩 시작...\n');

  try {
    // 1. 기존 데이터 확인
    console.log('1️⃣ 기존 데이터 확인...');
    const { count, error: countError } = await supabase
      .from('Api')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ 데이터 확인 실패:', countError.message);
      return;
    }

    console.log(`   현재 API 개수: ${count || 0}개`);
    console.log('');

    // 2. 데이터 삽입
    console.log(`2️⃣ ${sampleAPIs.length}개의 API 데이터 추가 중...`);
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < sampleAPIs.length; i++) {
      const api = sampleAPIs[i];
      
      const { error } = await supabase
        .from('Api')
        .insert([{
          name: api.name,
          slug: api.slug,
          description: api.description,
          category: api.category,
          company: api.company,
          categories: api.categories,
          price: api.price,
          status: 'approved' // 바로 승인된 상태로 추가
        }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          console.log(`   ⏭️  ${i + 1}/${sampleAPIs.length} - ${api.name} (이미 존재)`);
        } else {
          console.error(`   ❌ ${i + 1}/${sampleAPIs.length} - ${api.name}: ${error.message}`);
          errorCount++;
        }
      } else {
        console.log(`   ✅ ${i + 1}/${sampleAPIs.length} - ${api.name}`);
        successCount++;
      }
    }

    console.log('');
    console.log('3️⃣ 최종 확인...');
    const { count: finalCount } = await supabase
      .from('Api')
      .select('*', { count: 'exact', head: true });

    console.log(`   최종 API 개수: ${finalCount || 0}개`);
    console.log('');
    console.log('📊 시딩 완료!');
    console.log(`   ✅ 추가 성공: ${successCount}개`);
    console.log(`   ⏭️  중복 건너뜀: ${sampleAPIs.length - successCount - errorCount}개`);
    console.log(`   ❌ 실패: ${errorCount}개`);

  } catch (error) {
    console.error('❌ 시딩 중 오류 발생:', error.message);
  }
}

seedDatabase();
