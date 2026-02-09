import React from 'react';
import iconArrowLeftBlack from '@assets/icon-arrow-left-black.svg';

import EditorToolbar from '../components/EditorToolbar';
import { useSidebarWidth } from '../hooks/useSidebarWidth';
import { useTextEditorForm } from '../hooks/useTextEditorForm';

type TextEditorProps = {
  onBack: () => void;

  initialTitle?: string;
  initialContent?: string;
  submitLabel?: string;
  onSave: (payload: { title: string; content: string }) => void;

  sidebarSelector?: string;
  fallbackSidebarWidth?: number;
};

const TextEditor: React.FC<TextEditorProps> = ({
  onBack,
  initialTitle = '',
  initialContent = '',
  submitLabel = '저장하기',
  onSave,
  sidebarSelector = 'aside',
  fallbackSidebarWidth = 260,
}) => {
  const sidebarWidth = useSidebarWidth({ sidebarSelector, fallbackSidebarWidth });

  const { title, setTitle, content, setContent, canSubmit, submit } = useTextEditorForm({
    initialTitle,
    initialContent,
    onSave,
  });

  return (
    <div
      className="fixed inset-y-0 right-0 z-[999] bg-white overflow-y-auto overflow-x-hidden"
      style={{ left: `${sidebarWidth}px` }}
    >
      <div className="w-full flex justify-center">
        <div className="w-[1140px] px-[45px] py-[74px] flex flex-col justify-start items-start gap-2.5">
          <div className="self-stretch flex flex-col justify-start items-start gap-8">
            <button
              type="button"
              onClick={onBack}
              className="w-8 h-8 flex items-center justify-center"
              aria-label="뒤로가기"
              title="뒤로가기"
            >
              <img
                src={iconArrowLeftBlack}
                alt="뒤로가기"
                className="w-6 h-6 brightness-0"
                draggable={false}
              />
            </button>

            <div className="self-stretch flex flex-col justify-start items-center gap-12">
              <div className="self-stretch flex flex-col justify-start items-start gap-8">
                <div className="self-stretch h-12 px-3.5 py-2.5 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-300 inline-flex justify-start items-center gap-2.5">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent outline-none text-base font-medium font-['Roboto'] leading-4 placeholder:text-gray-400"
                    placeholder="제목을 입력하세요"
                  />
                </div>

                <EditorToolbar />

                <div className="self-stretch min-h-[420px] h-[420px] p-3.5 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-300 inline-flex justify-start items-start gap-2.5">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-full resize-none bg-transparent outline-none text-base font-medium font-['Roboto'] leading-4 placeholder:text-gray-400"
                    placeholder="내용을 입력하세요"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={!canSubmit}
                onClick={submit}
                className={`w-96 h-14 px-10 py-3 rounded-[5px] outline outline-1 outline-offset-[-1px] inline-flex justify-center items-center gap-2.5 ${
                  canSubmit
                    ? 'bg-orange-500 outline-orange-500 hover:brightness-95 active:brightness-90'
                    : 'bg-gray-300 outline-gray-200 cursor-not-allowed'
                }`}
              >
                <span className="text-center text-white text-lg font-medium font-['Roboto']">
                  {submitLabel}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
