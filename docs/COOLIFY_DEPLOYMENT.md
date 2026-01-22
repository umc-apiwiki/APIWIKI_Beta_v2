# Coolify 배포 가이드

## 환경 변수 설정

Coolify 대시보드에서 다음 환경 변수를 설정해야 합니다:

### 필수 환경 변수

```bash
# Supabase 설정 (필수)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# NextAuth 설정 (필수)
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key-here

# 환경 설정
NODE_ENV=production
```

### 선택 환경 변수

```bash
# Sentry/GlitchTip (선택사항 - 없어도 빌드 가능)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
SENTRY_DSN=your-sentry-dsn
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=your-auth-token
GLITCHTIP_SERVER_URL=your-glitchtip-url

# Google Analytics (선택사항)
NEXT_PUBLIC_GA_ID=your-ga-id
```

## 빌드 설정

- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm run start`
- **Port**: `3000`
- **Node Version**: `22` (package.json 참조)

## 트러블슈팅

### 1. Sentry 관련 빌드 오류

Sentry 환경 변수가 없어도 빌드가 가능하도록 설정되어 있습니다.
만약 Sentry를 사용하지 않는다면, 해당 환경 변수를 설정하지 않아도 됩니다.

### 2. Supabase 연결 오류

Coolify 환경 변수에서 다음을 확인하세요:

- `NEXT_PUBLIC_SUPABASE_URL`이 올바른지 확인
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`가 올바른지 확인
- Supabase 프로젝트에서 해당 URL이 허용되는지 확인

### 3. 빌드 메모리 부족

Coolify 설정에서 메모리 제한을 늘려주세요:

- Settings > Resource Limits > Memory: 2GB 이상 권장

### 4. 환경 변수 적용 안됨

빌드 시점과 런타임 시점의 환경 변수가 다릅니다:

- `NEXT_PUBLIC_*`: 빌드 시점에 코드에 포함됨
- 나머지: 런타임에 서버에서만 사용됨

환경 변수 변경 후 반드시 재배포해야 적용됩니다.

## 배포 체크리스트

- [ ] Coolify에 환경 변수 설정 완료
- [ ] Supabase URL이 프로덕션 URL로 설정됨
- [ ] NEXTAUTH_URL이 배포 도메인으로 설정됨
- [ ] NEXTAUTH_SECRET이 안전한 랜덤 문자열로 설정됨
- [ ] Supabase에서 배포 도메인이 허용됨
- [ ] 빌드 및 시작 명령어 확인
- [ ] 포트 3000 설정 확인
