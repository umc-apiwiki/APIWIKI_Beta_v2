'use client';

import { useEffect, useState } from 'react';

interface WikiEditorProps {
  apiId: string;
}

export default function WikiEditor({ apiId }: WikiEditorProps) {
  const storageKey = `wiki_${apiId}`;
  const [text, setText] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setText(saved);
  }, [storageKey]);

  const save = () => {
    localStorage.setItem(storageKey, text);
    setEditing(false);
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-semibold">위키 문서</h4>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} className="px-3 py-1 text-sm border rounded">취소</button>
              <button onClick={save} className="px-3 py-1 text-sm bg-blue-500 text-white rounded">저장</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="px-3 py-1 text-sm bg-green-500 text-white rounded">편집하기</button>
          )}
        </div>
      </div>

      {editing ? (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full min-h-[200px] border rounded p-3 font-mono text-sm"
        />
      ) : (
        <div className="prose max-w-none bg-white p-4 rounded border border-gray-100 min-h-[120px]">
          {text ? <div dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br/>') }} /> : <p className="text-gray-500">아직 작성된 문서가 없습니다. 수정 버튼을 눌러 문서를 추가해보세요.</p>}
        </div>
      )}
    </div>
  );
}
