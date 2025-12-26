// src/components/TagsSection.tsx
'use client';

interface TagsSectionProps {
  tags?: string[];
}

export default function TagsSection({ 
  tags = ['결제', '소셜로그인', '지도', '날씨', 'AI', '이메일', '금융'] 
}: TagsSectionProps) {
  return (
    <div className="flex gap-[15px] flex-wrap justify-center max-w-[800px] mb-[80px]">
      {tags.map((tag) => (
        <div
          key={tag}
          className="px-[22px] py-[8px] bg-white rounded-[20px] cursor-pointer transition-all text-[18px] font-medium"
          style={{
            border: '0.5px solid var(--primary-blue)',
            boxShadow: 'var(--shadow-blue)',
            color: 'var(--primary-blue)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--primary-blue)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = 'var(--primary-blue)';
          }}
        >
          {tag}
        </div>
      ))}
    </div>
  );
}
