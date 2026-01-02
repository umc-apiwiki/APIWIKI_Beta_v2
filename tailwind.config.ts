import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "120px", // 좌우 여백 120px 고정
    },
    extend: {
      colors: {
        // 브랜드 메인 컬러 (파란색 계열)
        brand: {
          50: "#F1F8FE", // 가장 밝은 파란색 (배경용)
          100: "#E3F2FD", // 매우 밝은 파란색
          200: "#C7E5FC", // 밝은 파란색
          300: "#90CBF9", // 연한 파란색
          400: "#59B0F6", // 중간 파란색
          500: "#2196F3", // 메인 브랜드 컬러 (primary)
          600: "#1e87db", // 진한 파란색
          700: "#1a78c2", // 더 진한 파란색
          800: "#1769aa", // 매우 진한 파란색
          900: "#145a92", // 가장 진한 파란색
          darker: "#030F18", // 거의 검은색에 가까운 다크 네이비
        },

        // 성공 상태 컬러 (초록색 계열)
        success: {
          DEFAULT: "#4CAF50", // 기본 성공 컬러
          foreground: "#FFFFFF", // 성공 컬러 위의 텍스트 색상 (흰색)
          dark: "#43A047", // 진한 성공 컬러
          darker: "#1B5E20", // 가장 진한 성공 컬러
        },

        // 경고 상태 컬러 (노란색 계열)
        warning: {
          DEFAULT: "#FFD400", // 기본 경고 컬러
          dark: "#E6BF00", // 진한 경고 컬러
          darker: "#8A6F00", // 가장 진한 경고 컬러
        },

        // 에러 상태 컬러 (빨간색 계열)
        error: {
          DEFAULT: "#F44336", // 기본 에러 컬러
          dark: "#E53935", // 진한 에러 컬러
          darker: "#B71C1C", // 가장 진한 에러 컬러
        },

        // 정보 상태 컬러 (파란색 계열 - brand와 동일)
        info: {
          DEFAULT: "#2196F3", // 기본 정보 컬러 (brand-500과 동일)
          dark: "#1E88E5", // 진한 정보 컬러
          darker: "#0D47A1", // 가장 진한 정보 컬러
        },
      },

      // 모서리 둥글기
      borderRadius: {
        sm: "5px", // 작은 컨테이너 테두리
        md: "10px", // 이미지, 일반 요소
        lg: "16px", // 카드 (rounded-2xl과 동일)
        xl: "20px", // 버튼
        "2xl": "16px", // 카드용 (Tailwind 기본값 재정의)
        "3xl": "24px", // 태그/칩용 완전히 둥근 모양
      },

      // 그림자 효과
      boxShadow: {
        card: "1px 5px 10px 0px rgba(33, 150, 243, 0.25)", // 카드에 적용되는 그림자
        image: "1px 4px 6px 0px rgba(33, 150, 243, 0.25)", // 이미지에 적용되는 그림자
        button: "0px 2px 4px 0px rgba(33, 150, 243, 0.25)", // 버튼에 적용되는 그림자
        tag: "1px 1px 5px 1px rgba(33, 150, 243, 0.10)", // 태그/칩에 적용되는 그림자 (더 연함)
      },

      // 테두리 두께
      borderWidth: {
        thin: "0.25px", // 매우 얇은 테두리 (카드, 이미지용)
        "0.25": "0.25px", // 0.25px 테두리 (직접 사용 가능)
        "0.5": "0.50px", // 0.5px 테두리 (일부 이미지용)
      },

      // 폰트 패밀리
      fontFamily: {
        sans: ["Pretendard Variable", "sans-serif"], // 기본 폰트를 Pretendard Variable로 설정
      },

      // 폰트 크기
      fontSize: {
        xs: "12px", // 매우 작은 텍스트 (Paid, Free 라벨)
        sm: "14px", // 작은 텍스트 (Star, Used by, 설명)
        base: "16px", // 기본 텍스트 (중간 버튼)
        lg: "18px", // 큰 텍스트 (큰 버튼)
        xl: "20px", // 제목, compare 버튼 텍스트
      },

      // 줄 간격
      lineHeight: {
        "5": "20px", // 버튼 텍스트용 줄 간격 (leading-5)
      },

      // 그라디언트 배경
      backgroundImage: {
        // 카드 hover/선택 상태에 사용되는 그라디언트
        // 위에서 아래로: 연한 파란색(10% 투명도) → 흰색(20% 투명도)
        "brand-gradient":
          "linear-gradient(to bottom, rgba(33, 150, 243, 0.1), rgba(255, 255, 255, 0.2))",
      },
    },
  },
  plugins: [],
};

export default config;
