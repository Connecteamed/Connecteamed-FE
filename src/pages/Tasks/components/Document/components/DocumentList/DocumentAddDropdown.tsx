import React from 'react';

import useOutsideClose from '../../hooks/useOutsideClose';

type Props = {
  onPickFile: (type: 'pdf' | 'docx' | 'image') => void;
  onClickText: () => void;

  /** ✅ EmptyDocument에서만 중앙정렬/크기 변경용 */
  containerClassName?: string;
  triggerClassName?: string;
  labelClassName?: string;
};

const DocumentAddDropdown = ({
  onPickFile,
  onClickText,
  containerClassName,
  triggerClassName,
  labelClassName,
}: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen((prev) => !prev), []);

  useOutsideClose({ enabled: isOpen, onClose: close, ref: wrapRef });

  // ✅ 열리면 패널이 화면에 보이도록 "페이지(스크롤 컨테이너)"를 자동 스크롤
  React.useEffect(() => {
    if (!isOpen) return;

    const raf = requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({
        block: 'nearest',
        behavior: 'auto',
      });
    });

    return () => cancelAnimationFrame(raf);
  }, [isOpen]);

  const rootClass = containerClassName ?? 'flex justify-end self-stretch';

  const baseTriggerClass =
    'inline-flex h-8 w-24 items-center justify-center gap-2.5 rounded-[10px] px-2 py-[5px]';
  const triggerBgClass = isOpen ? 'bg-gray-400' : 'bg-orange-500';

  const baseLabelClass = "text-center font-['Roboto'] text-xs font-medium text-white";

  return (
    <div className={rootClass}>
      <div ref={wrapRef} className="flex flex-col items-end">
        <button
          type="button"
          onClick={toggle}
          className={`${baseTriggerClass} ${triggerBgClass} ${triggerClassName ?? ''}`}
        >
          <span className={`${baseLabelClass} ${labelClassName ?? ''}`}>문서 추가</span>
        </button>

        {isOpen && (
          <div ref={panelRef} className="mt-2">
            <div className="inline-flex h-40 items-center justify-start gap-2.5 rounded-[10px] bg-white p-3 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)]">
              <div className="inline-flex w-20 flex-col items-start justify-start gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    close();
                    onPickFile('pdf');
                  }}
                  className="inline-flex h-7 items-center justify-center gap-2.5 self-stretch rounded-[5px] bg-zinc-200 px-3.5 py-1.5"
                >
                  <span className="text-center font-['Roboto'] text-xs font-medium text-neutral-600">
                    PDF
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    close();
                    onPickFile('docx');
                  }}
                  className="inline-flex h-7 items-center justify-center gap-2.5 self-stretch rounded-[5px] bg-zinc-200 px-3.5 py-1.5"
                >
                  <span className="text-center font-['Roboto'] text-xs font-medium text-neutral-600">
                    docx
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    close();
                    onPickFile('image');
                  }}
                  className="inline-flex h-7 items-center justify-center gap-2.5 self-stretch rounded-[5px] bg-zinc-200 px-3.5 py-1.5"
                >
                  <span className="text-center font-['Roboto'] text-xs font-medium text-neutral-600">
                    이미지
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    close();
                    onClickText();
                  }}
                  className="inline-flex h-7 items-center justify-center gap-2.5 self-stretch rounded-[5px] bg-zinc-200 px-3.5 py-1.5"
                >
                  <span className="text-center font-['Roboto'] text-xs font-medium text-neutral-600">
                    텍스트
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentAddDropdown;
