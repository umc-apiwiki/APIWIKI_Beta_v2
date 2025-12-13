# API_WIKI_mockup 실행 가이드

정적 사이트라서 바로 브라우저로 열거나, 간단한 로컬 서버로 띄우면 됩니다.

## 1) 그냥 브라우저로 열기 (가장 쉬움)
- 파일 탐색기에서 `index.html` 더블클릭
- 또는 VS Code에서 `index.html` 열고 우클릭 → "Open in Default Browser" (확장 필요할 수 있음)

## 2) VS Code Live Server로 실행
1. VS Code 확장 마켓플레이스에서 "Live Server" 설치
2. `index.html` 우클릭 → "Open with Live Server"
3. 브라우저에서 자동으로 열림 (보통 http://127.0.0.1:5500)

## 3) Python 내장 서버로 실행
- Python 3가 설치되어 있다면, 작업 폴더에서 실행:

```bash
# Git Bash 기준
cd /d/workspace/API_WIKI_mockup
python -m http.server 5500
```

- 열기: http://localhost:5500/index.html

## 4) Node http-server로 실행
- Node.js가 설치되어 있다면:

```bash
npm i -g http-server
cd /d/workspace/API_WIKI_mockup
http-server -p 5500
```

- 열기: http://localhost:5500/index.html

---

참고
- 이 프로젝트는 `index.html`, `search.html`, `style.css`로 구성된 정적 페이지입니다.
- 외부 리소스(Google Fonts)를 로드하므로, 네트워크 차단 환경에서는 폰트가 기본값으로 보일 수 있습니다.
- 특별한 백엔드나 빌드 과정은 필요 없습니다.
