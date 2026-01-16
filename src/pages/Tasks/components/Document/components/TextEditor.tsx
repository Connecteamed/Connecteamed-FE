import React, { useEffect, useMemo, useState } from 'react';

import iconBold from '@assets/icon-bold.svg';
import iconItalic from '@assets/icon-italic.svg';
import iconUnderline from '@assets/icon-underline.svg';
import iconStrike from '@assets/icon-strikethrough.svg';
import iconLink from '@assets/icon-link.svg';
import iconListNumbered from '@assets/icon-list-numbered.svg';
import iconListBulleted from '@assets/icon-list-bulleted.svg';
import iconAlignLeft from '@assets/icon-align-left.svg';
import iconAlignCenter from '@assets/icon-align-center.svg';
import iconAlignRight from '@assets/icon-align-right.svg';
import iconArrowLeftBlack from '@assets/icon-arrow-left-black.svg';

type TextEditorProps = {
  onBack: () => void;

  initialTitle?: string;
  initialContent?: string;
  submitLabel?: string;
  onSave: (payload: { title: string; content: string }) => void;

  sidebarSelector?: string;

  fallbackSidebarWidth?: number;
};

const ToolbarBtn = ({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick?: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-300/50 active:bg-gray-300"
    >
      <img src={icon} alt={label} className="w-5 h-5" draggable={false} />
    </button>
  );
};

const Divider = () => (
  <div className="w-5 h-0 origin-top-left rotate-90 outline outline-1 outline-offset-[-0.5px] outline-gray-400" />
);

const TextEditor: React.FC<TextEditorProps> = ({
  onBack,
  initialTitle = '',
  initialContent = '',
  submitLabel = '저장하기',
  onSave,
  sidebarSelector = 'aside',
  fallbackSidebarWidth = 260,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const canSubmit = useMemo(
    () => title.trim().length > 0 && content.trim().length > 0,
    [title, content],
  );

  const [sidebarWidth, setSidebarWidth] = useState<number>(fallbackSidebarWidth);

  useEffect(() => {
    const update = () => {
      const el = document.querySelector(sidebarSelector) as HTMLElement | null;
      if (!el) {
        setSidebarWidth(fallbackSidebarWidth);
        return;
      }
      setSidebarWidth(el.offsetWidth);
    };

    update();

    window.addEventListener('resize', update);

    const el = document.querySelector(sidebarSelector) as HTMLElement | null;
    let ro: ResizeObserver | null = null;
    if (el && 'ResizeObserver' in window) {
      ro = new ResizeObserver(() => update());
      ro.observe(el);
    }

    return () => {
      window.removeEventListener('resize', update);
      if (ro && el) ro.unobserve(el);
    };
  }, [sidebarSelector, fallbackSidebarWidth]);

  return (
    <div
      className="fixed inset-y-0 right-0 z-[999] bg-white overflow-y-auto overflow-x-hidden"
      style={{ left: `${sidebarWidth}px` }}
    >
      <div className="w-full flex justify-center">
        <div className="w-[1140px] px-11 py-20 inline-flex flex-col justify-start items-start gap-2.5">
          <div className="self-stretch flex flex-col justify-start items-start gap-12">
            <button
              type="button"
              onClick={onBack}
              className="w-8 h-8 flex items-center justify-center"
              aria-label="뒤로가기"
              title="뒤로가기"
            >
              <img src={iconArrowLeftBlack} alt="뒤로가기" className="w-6 h-6" draggable={false} />
            </button>

            <div className="self-stretch flex flex-col justify-start items-center gap-20">
              <div className="self-stretch flex flex-col justify-start items-start gap-8">
                <div className="self-stretch h-12 px-3.5 py-2.5 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-300 inline-flex justify-start items-center gap-2.5">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent outline-none text-base font-medium font-['Roboto'] leading-4 placeholder:text-gray-400"
                    placeholder="제목을 입력하세요"
                  />
                </div>

                <div className="w-96 h-10 px-3.5 py-2 bg-gray-200 rounded-[10px] flex items-center">
                  <div className="inline-flex justify-start items-center gap-3">
                    <div className="flex justify-start items-center gap-3">
                      <ToolbarBtn icon={iconBold} label="굵게" />
                      <ToolbarBtn icon={iconItalic} label="기울임" />
                      <ToolbarBtn icon={iconUnderline} label="밑줄" />
                      <ToolbarBtn icon={iconStrike} label="취소선" />
                    </div>

                    <Divider />

                    <div className="flex justify-start items-center gap-3">
                      <ToolbarBtn icon={iconLink} label="링크" />
                      <ToolbarBtn icon={iconListNumbered} label="번호 목록" />
                      <ToolbarBtn icon={iconListBulleted} label="글머리 기호" />
                    </div>

                    <Divider />

                    <div className="flex justify-start items-center gap-3">
                      <ToolbarBtn icon={iconAlignLeft} label="왼쪽 정렬" />
                      <ToolbarBtn icon={iconAlignCenter} label="가운데 정렬" />
                      <ToolbarBtn icon={iconAlignRight} label="오른쪽 정렬" />
                    </div>
                  </div>
                </div>

                <div className="self-stretch h-[500px] p-3.5 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-gray-300 inline-flex justify-start items-start gap-2.5">
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
                onClick={() => {
                  if (!canSubmit) return;
                  onSave({ title: title.trim(), content });
                }}
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
