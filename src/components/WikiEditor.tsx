'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

interface WikiEditorProps {
  apiId: string;
}

export default function WikiEditor({ apiId }: WikiEditorProps) {
  const storageKey = `wiki_${apiId}`;
  const [text, setText] = useState('');
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setText(saved);
  }, [storageKey]);

  const save = () => {
    localStorage.setItem(storageKey, text);
    setEditing(false);
  };

  const insertMarkdown = (syntax: string, placeholder: string = '') => {
    if (!editing) return; // 편집 모드가 아니면 실행하지 않음
    
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
        <h4 className="text-[24px] font-bold" style={{ color: 'var(--text-dark)' }}>
          📝 위키 문서
        </h4>
        <div className="flex gap-2">
          {editing ? (
            <>
              <motion.button 
                onClick={() => setEditing(false)} 
                className="px-4 py-2 text-[14px] font-semibold rounded-[12px] border-2 transition-colors"
                style={{ 
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                  color: 'var(--text-gray)'
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                취소
              </motion.button>
              <motion.button 
                onClick={save} 
                className="px-4 py-2 text-[14px] font-semibold text-white rounded-[12px]"
                style={{ 
                  backgroundColor: 'var(--primary-blue)',
                  boxShadow: 'var(--shadow-blue)'
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                💾 저장
              </motion.button>
            </>
          ) : (
            <motion.button 
              onClick={() => setEditing(true)} 
              className="px-4 py-2 text-[14px] font-semibold text-white rounded-[12px]"
              style={{ 
                backgroundColor: '#22c55e',
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              ✏️ 편집하기
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
                className="flex-1 px-6 py-3 text-[14px] font-semibold transition-all"
                style={{
                  color: activeTab === 'edit' ? 'var(--primary-blue)' : 'var(--text-gray)',
                  borderBottom: activeTab === 'edit' ? '2px solid var(--primary-blue)' : '2px solid transparent',
                  backgroundColor: activeTab === 'edit' ? 'rgba(var(--primary-blue-rgb), 0.05)' : 'transparent'
                }}
              >
                ✍️ 편집
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className="flex-1 px-6 py-3 text-[14px] font-semibold transition-all"
                style={{
                  color: activeTab === 'preview' ? 'var(--primary-blue)' : 'var(--text-gray)',
                  borderBottom: activeTab === 'preview' ? '2px solid var(--primary-blue)' : '2px solid transparent',
                  backgroundColor: activeTab === 'preview' ? 'rgba(var(--primary-blue-rgb), 0.05)' : 'transparent'
                }}
              >
                👁️ 미리보기
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
                <ToolbarButton onClick={() => insertMarkdown('link')} title="링크">🔗</ToolbarButton>
                <ToolbarButton onClick={() => insertMarkdown('ul')} title="목록">• List</ToolbarButton>
                <ToolbarButton onClick={() => insertMarkdown('ol')} title="번호 목록">1. List</ToolbarButton>
                <ToolbarButton onClick={() => insertMarkdown('quote')} title="인용">💬</ToolbarButton>
                <ToolbarButton onClick={() => insertMarkdown('codeblock')} title="코드 블록">{`{}`}</ToolbarButton>
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
                <div className="text-[64px] mb-4 opacity-30">📄</div>
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
          <strong style={{ color: 'var(--primary-blue)' }}>💡 Markdown 팁:</strong> 
          {' '}굵게: **텍스트** | 기울임: *텍스트* | 링크: [텍스트](url) | 코드: `code` | 제목: # H1, ## H2, ### H3
        </motion.div>
      )}
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
