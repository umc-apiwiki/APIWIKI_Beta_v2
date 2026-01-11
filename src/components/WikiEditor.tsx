'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import PointNotificationModal from './PointNotificationModal';

interface WikiEditorProps {
  apiId: string;
  initialContent?: string;
  onSave?: () => void;
}

import { useAuth } from '@/hooks/useAuth';

export default function WikiEditor({ apiId, initialContent = '', onSave }: WikiEditorProps) {
  const { isAuthenticated, user } = useAuth();
  // const storageKey = `wiki_${apiId}`; // No longer needed
  const [text, setText] = useState(initialContent);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  
  // New state for saving
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summary, setSummary] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);

  // Update text if initialContent changes (e.g. fresh fetch)
  useEffect(() => {
    if (initialContent) setText(initialContent);
  }, [initialContent]);

  const handleSaveClick = () => {
    if (!text.trim()) {
        alert('내용을 입력해주세요.');
        return;
    }
    setShowSummaryModal(true);
  };

  const submitSave = async () => {
    if (summary.length < 5) {
        alert('편집 요약을 5자 이상 입력해주세요 (예: API 설명 추가)');
        return;
    }

    setIsSaving(true);
    try {
        const response = await fetch('/api/wiki/edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                apiId,
                content: text,
                summary,
                userId: user?.id
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || '저장 실패');
        }

        // alert(result.message || '저장되었습니다!'); // 모달로 대체
        setEditing(false);
        setShowSummaryModal(false);
        setSummary('');
        setShowPointsModal(true); // 포인트 모달 표시

        // 모달 표시 후 이동/리로드
        setTimeout(() => {
            if (onSave) {
                onSave();
            } else {
                window.location.reload(); 
            }
        }, 2500);
    } catch (error: any) {
        alert(error.message);
    } finally {
        setIsSaving(false);
    }
  };

  const insertMarkdown = (syntax: string, placeholder: string = '') => {
    if (!editing) return;
    
    // ... (rest of function remains same)
    const textarea = document.querySelector('textarea[data-wiki-editor="true"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end) || placeholder;
    
    let newText = '';
    let cursorOffset = 0;

    switch (syntax) {
      case 'bold':
        newText = text.substring(0, start) + `**${selectedText}**` + text.substring(end);
        cursorOffset = start + 2;
        break;
      case 'italic':
        newText = text.substring(0, start) + `*${selectedText}*` + text.substring(end);
        cursorOffset = start + 1;
        break;
      case 'code':
        newText = text.substring(0, start) + `\`${selectedText}\`` + text.substring(end);
        cursorOffset = start + 1;
        break;
      case 'link':
        newText = text.substring(0, start) + `[${selectedText || '링크 텍스트'}](url)` + text.substring(end);
        cursorOffset = start + 1;
        break;
      case 'h1':
        newText = text.substring(0, start) + `# ${selectedText || '제목'}` + text.substring(end);
        cursorOffset = start + 2;
        break;
      case 'h2':
        newText = text.substring(0, start) + `## ${selectedText || '제목'}` + text.substring(end);
        cursorOffset = start + 3;
        break;
      case 'h3':
        newText = text.substring(0, start) + `### ${selectedText || '제목'}` + text.substring(end);
        cursorOffset = start + 4;
        break;
      case 'ul':
        newText = text.substring(0, start) + `- ${selectedText || '항목'}` + text.substring(end);
        cursorOffset = start + 2;
        break;
      case 'ol':
        newText = text.substring(0, start) + `1. ${selectedText || '항목'}` + text.substring(end);
        cursorOffset = start + 3;
        break;
      case 'quote':
        newText = text.substring(0, start) + `> ${selectedText || '인용문'}` + text.substring(end);
        cursorOffset = start + 2;
        break;
      case 'codeblock':
        newText = text.substring(0, start) + `\`\`\`\n${selectedText || '코드'}\n\`\`\`` + text.substring(end);
        cursorOffset = start + 4;
        break;
      default:
        return;
    }

    setText(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorOffset, cursorOffset);
    }, 0);
  };

  return (
    <motion.div 
      className="mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-[24px] font-bold flex items-center gap-2" style={{ color: 'var(--text-dark)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          위키 문서
        </h4>
        <div className="flex gap-2">
          {editing ? (
            <>
              <motion.button 
                onClick={() => setEditing(false)}
                className="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-200 text-[#0c4a6e] bg-white hover:border-sky-400 transition-colors"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.99 }}
              >
                취소
              </motion.button>
              <motion.button
                onClick={handleSaveClick}
                className="px-4 py-2 text-sm font-semibold text-white rounded-md flex items-center gap-2 bg-[#0c4a6e] hover:bg-[#0a3b56] shadow-sm transition-colors"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.99 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                저장
              </motion.button>
            </>
          ) : (
            <motion.button 
              onClick={() => {
                  if (isAuthenticated) {
                      setEditing(true);
                  } else {
                      alert('로그인이 필요한 기능입니다.');
                  }
              }}
              className={`px-3 py-1.5 text-sm font-medium rounded-md border border-gray-200 text-[#0c4a6e] bg-white hover:border-sky-400 transition-colors ${!isAuthenticated ? 'opacity-60 cursor-not-allowed' : ''}`}
              whileHover={isAuthenticated ? { scale: 1.03, y: -1 } : {}}
              whileTap={isAuthenticated ? { scale: 0.99 } : {}}
              title={isAuthenticated ? '문서 편집하기' : '로그인이 필요합니다'}
            >
              {isAuthenticated ? '문서 편집하기' : '로그인 필요'}
            </motion.button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-[20px] overflow-hidden"
            style={{ boxShadow: 'var(--shadow-blue)' }}
          >
            {/* Tab Navigation */}
            <div className="flex border-b" style={{ borderColor: 'rgba(0, 0, 0, 0.05)' }}>
              <button
                onClick={() => setActiveTab('edit')}
                className="flex-1 px-6 py-3 text-[14px] font-semibold transition-all flex items-center justify-center gap-2"
                style={{
                  color: activeTab === 'edit' ? 'var(--primary-blue)' : 'var(--text-gray)',
                  borderBottom: activeTab === 'edit' ? '2px solid var(--primary-blue)' : '2px solid transparent',
                  backgroundColor: activeTab === 'edit' ? 'rgba(var(--primary-blue-rgb), 0.05)' : 'transparent'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                </svg>
                편집
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className="flex-1 px-6 py-3 text-[14px] font-semibold transition-all flex items-center justify-center gap-2"
                style={{
                  color: activeTab === 'preview' ? 'var(--primary-blue)' : 'var(--text-gray)',
                  borderBottom: activeTab === 'preview' ? '2px solid var(--primary-blue)' : '2px solid transparent',
                  backgroundColor: activeTab === 'preview' ? 'rgba(var(--primary-blue-rgb), 0.05)' : 'transparent'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                미리보기
              </button>
            </div>

            {/* Markdown Toolbar */}
            {activeTab === 'edit' && (
              <div className="flex flex-wrap gap-1 p-3 border-b bg-gray-50" style={{ borderColor: 'rgba(0, 0, 0, 0.05)' }}>
                <ToolbarButton onClick={() => insertMarkdown('h1')} title="제목 1">H1</ToolbarButton>
                <ToolbarButton onClick={() => insertMarkdown('h2')} title="제목 2">H2</ToolbarButton>
                <ToolbarButton onClick={() => insertMarkdown('h3')} title="제목 3">H3</ToolbarButton>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <ToolbarButton onClick={() => insertMarkdown('bold')} title="굵게"><strong>B</strong></ToolbarButton>
                <ToolbarButton onClick={() => insertMarkdown('italic')} title="기울임"><em>I</em></ToolbarButton>
                <ToolbarButton onClick={() => insertMarkdown('code')} title="인라인 코드">{`</>`}</ToolbarButton>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <ToolbarButton onClick={() => insertMarkdown('link')} title="링크">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                </ToolbarButton>
                <ToolbarButton onClick={() => insertMarkdown('ul')} title="목록">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"/>
                    <line x1="8" y1="12" x2="21" y2="12"/>
                    <line x1="8" y1="18" x2="21" y2="18"/>
                    <line x1="3" y1="6" x2="3.01" y2="6"/>
                    <line x1="3" y1="12" x2="3.01" y2="12"/>
                    <line x1="3" y1="18" x2="3.01" y2="18"/>
                  </svg>
                </ToolbarButton>
                <ToolbarButton onClick={() => insertMarkdown('ol')} title="번호 목록">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="10" y1="6" x2="21" y2="6"/>
                    <line x1="10" y1="12" x2="21" y2="12"/>
                    <line x1="10" y1="18" x2="21" y2="18"/>
                    <path d="M4 6h1v4"/>
                    <path d="M4 10h2"/>
                    <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
                  </svg>
                </ToolbarButton>
                <ToolbarButton onClick={() => insertMarkdown('quote')} title="인용">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
                  </svg>
                </ToolbarButton>
                <ToolbarButton onClick={() => insertMarkdown('codeblock')} title="코드 블록">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"/>
                    <polyline points="8 6 2 12 8 18"/>
                  </svg>
                </ToolbarButton>
              </div>
            )}

            {/* Content Area */}
            <div className="p-6">
              {activeTab === 'edit' ? (
                <textarea
                  data-wiki-editor="true"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full min-h-[400px] border-2 rounded-[15px] p-4 font-mono text-[14px] focus:outline-none transition-all resize-y"
                  style={{
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    color: 'var(--text-dark)',
                    lineHeight: '1.6'
                  }}
                  placeholder="Markdown 형식으로 작성하세요...&#10;&#10;예시:&#10;# 제목&#10;## 부제목&#10;**굵은 글씨**&#10;*기울임 글씨*&#10;- 목록 항목&#10;[링크](https://example.com)&#10;`코드`"
                />
              ) : (
                <div 
                  className="prose prose-slate max-w-none min-h-[400px]"
                  style={{
                    color: 'var(--text-dark)',
                    lineHeight: '1.8'
                  }}
                >
                  {text ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw, rehypeSanitize]}
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-[32px] font-bold mb-4 mt-6" style={{ color: 'var(--text-dark)' }} {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-[28px] font-bold mb-3 mt-5" style={{ color: 'var(--text-dark)' }} {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-[24px] font-bold mb-2 mt-4" style={{ color: 'var(--text-dark)' }} {...props} />,
                        p: ({node, ...props}) => <p className="mb-4 text-[16px]" style={{ color: 'var(--text-dark)' }} {...props} />,
                        a: ({node, ...props}) => <a className="font-medium hover:underline" style={{ color: 'var(--primary-blue)' }} {...props} />,
                        code: ({node, inline, ...props}: any) => 
                          inline ? (
                            <code className="px-2 py-1 rounded text-[14px] font-mono" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', color: '#e11d48' }} {...props} />
                          ) : (
                            <code className="block p-4 rounded-[12px] text-[14px] font-mono overflow-x-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} {...props} />
                          ),
                        ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                        blockquote: ({node, ...props}) => <blockquote className="border-l-4 pl-4 py-2 my-4 italic" style={{ borderColor: 'var(--primary-blue)', backgroundColor: 'rgba(var(--primary-blue-rgb), 0.05)' }} {...props} />,
                      }}
                    >
                      {text}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-center py-20" style={{ color: 'var(--text-gray)' }}>
                      미리보기할 내용이 없습니다
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="viewer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-[20px] p-6 min-h-[200px]"
            style={{ boxShadow: 'var(--shadow-blue)' }}
          >
            {text ? (
              <div 
                className="prose prose-slate max-w-none"
                style={{
                  color: 'var(--text-dark)',
                  lineHeight: '1.8'
                }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-[32px] font-bold mb-4 mt-6" style={{ color: 'var(--text-dark)' }} {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-[28px] font-bold mb-3 mt-5" style={{ color: 'var(--text-dark)' }} {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-[24px] font-bold mb-2 mt-4" style={{ color: 'var(--text-dark)' }} {...props} />,
                    p: ({node, ...props}) => <p className="mb-4 text-[16px]" style={{ color: 'var(--text-dark)' }} {...props} />,
                    a: ({node, ...props}) => <a className="font-medium hover:underline" style={{ color: 'var(--primary-blue)' }} {...props} />,
                    code: ({node, inline, ...props}: any) => 
                      inline ? (
                        <code className="px-2 py-1 rounded text-[14px] font-mono" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', color: '#e11d48' }} {...props} />
                      ) : (
                        <code className="block p-4 rounded-[12px] text-[14px] font-mono overflow-x-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }} {...props} />
                      ),
                    ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 pl-4 py-2 my-4 italic" style={{ borderColor: 'var(--primary-blue)', backgroundColor: 'rgba(var(--primary-blue-rgb), 0.05)' }} {...props} />,
                  }}
                >
                  {text}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="mb-4 opacity-30 flex justify-center">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <p className="text-[18px] font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
                  아직 작성된 문서가 없습니다
                </p>
                <p className="text-[14px]" style={{ color: 'var(--text-gray)' }}>
                  편집 버튼을 눌러 Markdown으로 문서를 작성해보세요
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Markdown Help */}
      {editing && activeTab === 'edit' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 rounded-[15px] text-[12px]"
          style={{ 
            backgroundColor: 'rgba(var(--primary-blue-rgb), 0.05)',
            color: 'var(--text-gray)'
          }}
        >
          <div className="flex items-start gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
            <div>
              <strong style={{ color: 'var(--primary-blue)' }}>Markdown 팁:</strong>
              {' '}굵게: **텍스트** | 기울임: *텍스트* | 링크: [텍스트](url) | 코드: `code` | 제목: # H1, ## H2, ### H3
            </div>
          </div>
        </motion.div>
      )}
      {/* Summary Modal */}
      <AnimatePresence>
        {showSummaryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 text-slate-800">편집 요약</h3>
              <p className="text-sm text-slate-500 mb-4">
                다른 사용자가 변경 내역을 이해할 수 있도록<br/>
                수정하신 내용을 간략하게 적어주세요.
              </p>
              
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="예: 오타 수정, API 사용법 예제 추가 등 (5자 이상)"
                className="w-full p-3 border rounded-lg mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[80px]"
                autoFocus
              />

              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setShowSummaryModal(false)}
                  className="px-4 py-2 text-slate-500 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={submitSave}
                  disabled={isSaving || summary.length < 5}
                  className={`px-4 py-2 text-white font-bold rounded-lg transition-all flex items-center gap-2 ${
                    isSaving || summary.length < 5 ? 'bg-slate-300 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-600 shadow-md hover:shadow-lg'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      저장 중...
                    </>
                  ) : (
                    '편집 완료'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <PointNotificationModal
        isOpen={showPointsModal}
        onClose={() => setShowPointsModal(false)}
        points={4}
        message="위키 문서 편집 완료!"
      />
    </motion.div>
  );
}

function ToolbarButton({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      title={title}
      className="px-3 py-1.5 text-[13px] rounded-lg border transition-colors"
      style={{
        borderColor: 'rgba(0, 0, 0, 0.1)',
        color: 'var(--text-dark)',
        backgroundColor: 'white'
      }}
      whileHover={{ 
        backgroundColor: 'var(--primary-blue)',
        color: 'white',
        scale: 1.05
      }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}
