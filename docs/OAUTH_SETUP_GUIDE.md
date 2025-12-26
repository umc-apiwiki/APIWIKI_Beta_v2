# Google & GitHub OAuth 설정 가이드

## 1. Google OAuth 설정

### Google Cloud Console에서 OAuth 설정

1. **Google Cloud Console 접속**
   - https://console.cloud.google.com 접속
   - 프로젝트 생성 또는 기존 프로젝트 선택

2. **OAuth 동의 화면 구성**
   - 좌측 메뉴에서 "API 및 서비스" > "OAuth 동의 화면" 선택
   - 사용자 유형: "외부" 선택
   - 앱 이름: "API Wiki"
   - 사용자 지원 이메일: 본인 이메일
   - 개발자 연락처 정보: 본인 이메일
   - 저장 후 계속

3. **OAuth 클라이언트 ID 생성**
   - "사용자 인증 정보" > "+ 사용자 인증 정보 만들기" > "OAuth 클라이언트 ID"
   - 애플리케이션 유형: "웹 애플리케이션"
   - 이름: "API Wiki Web"
   - 승인된 자바스크립트 원본:
     ```
     http://localhost:3000
     https://yourdomain.com
     ```
   - 승인된 리디렉션 URI:
     ```
     http://localhost:3000/api/auth/callback/google
     https://yourdomain.com/api/auth/callback/google
     ```
   - "만들기" 클릭

4. **클라이언트 ID와 보안 비밀번호 복사**
   - 생성된 클라이언트 ID와 클라이언트 보안 비밀번호를 복사

---

## 2. GitHub OAuth 설정

### GitHub에서 OAuth App 등록

1. **GitHub Settings 접속**
   - https://github.com/settings/developers 접속
   - 또는 GitHub 프로필 > Settings > Developer settings

2. **OAuth App 생성**
   - "OAuth Apps" > "New OAuth App" 클릭
   - Application name: "API Wiki"
   - Homepage URL: 
     ```
     http://localhost:3000
     ```
   - Application description: "API 정보 공유 위키 플랫폼"
   - Authorization callback URL:
     ```
     http://localhost:3000/api/auth/callback/github
     ```
   - "Register application" 클릭

3. **프로덕션용 추가 설정**
   - 프로덕션 배포 후 새로운 OAuth App 생성 (또는 기존 앱 수정)
   - Authorization callback URL:
     ```
     https://yourdomain.com/api/auth/callback/github
     ```

4. **Client ID와 Secret 복사**
   - Client ID 복사
   - "Generate a new client secret" 클릭하여 Client Secret 생성 및 복사

---

## 3. 환경 변수 설정

### `.env` 또는 `.env.local` 파일에 추가

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key-here-minimum-32-characters

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### NEXTAUTH_SECRET 생성 방법

터미널에서 실행:
```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 4. 프로덕션 배포 시 추가 설정

### Coolify 환경 변수 설정

1. Coolify 대시보드에서 프로젝트 선택
2. "Environment Variables" 탭
3. 위의 환경 변수들을 모두 추가:
   ```
   NEXTAUTH_URL=https://yourdomain.com
   NEXTAUTH_SECRET=프로덕션용-시크릿-키
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GITHUB_CLIENT_ID=...
   GITHUB_CLIENT_SECRET=...
   ```

### Google OAuth 리디렉션 URI 업데이트
- Google Cloud Console에서 승인된 리디렉션 URI에 프로덕션 URL 추가:
  ```
  https://yourdomain.com/api/auth/callback/google
  ```

### GitHub OAuth 콜백 URL 업데이트
- GitHub OAuth App 설정에서 Authorization callback URL 업데이트:
  ```
  https://yourdomain.com/api/auth/callback/github
  ```

---

## 5. 테스트

### 로컬 개발 환경 테스트

1. 개발 서버 시작:
   ```bash
   npm run dev
   ```

2. http://localhost:3000 접속

3. 로그인 모달 열기

4. "Sign up with Google" 또는 "Sign up with Github" 버튼 클릭

5. 해당 서비스의 OAuth 동의 화면에서 권한 승인

6. 로그인 성공 후 홈페이지로 리디렉션 확인

---

## 6. 트러블슈팅

### Google OAuth 오류

**"redirect_uri_mismatch" 오류**
- Google Cloud Console에서 승인된 리디렉션 URI 확인
- 정확히 `http://localhost:3000/api/auth/callback/google` 또는 프로덕션 URL인지 확인

**"access_denied" 오류**
- OAuth 동의 화면이 제대로 구성되었는지 확인
- 테스트 사용자 추가 (개발 중일 경우)

### GitHub OAuth 오류

**"The redirect_uri MUST match the registered callback URL" 오류**
- GitHub OAuth App 설정에서 callback URL 확인
- 정확히 `http://localhost:3000/api/auth/callback/github`인지 확인

### NextAuth 오류

**"[next-auth][error][NO_SECRET]" 경고**
- `.env` 파일에 `NEXTAUTH_SECRET` 추가 확인
- 32자 이상의 랜덤 문자열 사용

**"[next-auth][error][SIGNIN_OAUTH_ERROR]" 오류**
- Client ID와 Client Secret이 정확한지 확인
- 환경 변수가 제대로 로드되었는지 확인 (`console.log`로 디버깅)

---

## 7. Supabase 데이터베이스 확인

OAuth 로그인 후 `User` 테이블에 사용자가 자동 생성되는지 확인:

```sql
SELECT id, email, name, grade, activity_score, createdat
FROM "User"
ORDER BY createdat DESC
LIMIT 10;
```

---

## 참고 문서

- [NextAuth.js 공식 문서](https://next-auth.js.org/)
- [Google OAuth 설정](https://next-auth.js.org/providers/google)
- [GitHub OAuth 설정](https://next-auth.js.org/providers/github)
- [Supabase + NextAuth](https://supabase.com/docs/guides/auth/social-login/auth-google)
