import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { createPortal } from 'react-dom';

import Button from '@/components/Button';

type PickType = 'pdf' | 'docx' | 'image';

type Props = {
  onPickFile: (type: PickType) => void;
  onClickText: () => void;
  containerClassName?: string;
  triggerClassName?: string;
  labelClassName?: string;
};

type Pos = { top: number; left: number; width: number };

const GAP = 8;

const DocumentAddDropdown = ({
  onPickFile,
  onClickText,
  containerClassName,
  triggerClassName,
  labelClassName,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const rootClass = containerClassName ?? 'flex justify-end self-stretch';

  const baseTriggerClass =
    'w-24 h-8 inline-flex items-center justify-center gap-2.5 rounded-[10px] px-2 py-[5px]';
  const triggerBgClass = isOpen ? 'bg-gray-400' : 'bg-orange-500';
  const baseLabelClass = "text-center font-medium text-white font-['Roboto']";

  const calcPos = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const width = r.width;

    const top = r.bottom + GAP;
    const left = r.right - width;

    setPos({ top, left, width });
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;
    calcPos();
  }, [isOpen, calcPos]);

  useEffect(() => {
    if (!isOpen) return;

    const onRecalc = () => calcPos();

    window.addEventListener('resize', onRecalc);
    // 캡처 단계로 걸면 내부 스크롤 컨테이너의 scroll도 잡힘
    window.addEventListener('scroll', onRecalc, true);

    return () => {
      window.removeEventListener('resize', onRecalc);
      window.removeEventListener('scroll', onRecalc, true);
    };
  }, [isOpen, calcPos]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node | null;
      if (!t) return;

      const triggerEl = triggerRef.current;
      const panelEl = panelRef.current;

      // 버튼/패널 내부 클릭이면 유지
      if ((triggerEl && triggerEl.contains(t)) || (panelEl && panelEl.contains(t))) return;

      close();
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown, true);
    document.addEventListener('touchstart', onPointerDown, true);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown, true);
      document.removeEventListener('touchstart', onPointerDown, true);
    };
  }, [isOpen, close]);

  const panel = useMemo(() => {
    if (!isOpen || !pos) return null;

    return (
      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          top: pos.top,
          left: pos.left,
          width: pos.width,
          zIndex: 9999,
        }}
        className="overflow-visible"
      >
        <div className="flex w-full flex-col items-stretch gap-1.5 rounded-[10px] bg-white p-3 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.18)]">
          <button
            type="button"
            onClick={() => {
              close();
              onPickFile('pdf');
            }}
            className="inline-flex h-7 items-center justify-center gap-2.5 rounded-[5px] bg-zinc-200 px-3.5 py-1.5"
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
            className="inline-flex h-7 items-center justify-center gap-2.5 rounded-[5px] bg-zinc-200 px-3.5 py-1.5"
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
            className="inline-flex h-7 items-center justify-center gap-2.5 rounded-[5px] bg-zinc-200 px-3.5 py-1.5"
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
            className="inline-flex h-7 items-center justify-center gap-2.5 rounded-[5px] bg-zinc-200 px-3.5 py-1.5"
          >
            <span className="text-center font-['Roboto'] text-xs font-medium text-neutral-600">
              텍스트
            </span>
          </button>
        </div>
      </div>
    );
  }, [isOpen, pos, close, onPickFile, onClickText]);

  return (
    <div className={rootClass}>
      <div ref={triggerRef} className="inline-flex">
        <Button
          type="button"
          onClick={toggle}
          className={`${baseTriggerClass} ${triggerBgClass} ${triggerClassName ?? ''}`}
        >
          <span className={`${baseLabelClass} ${labelClassName ?? ''}`}>문서 추가</span>
        </Button>
      </div>

      {typeof document !== 'undefined' ? createPortal(panel, document.body) : null}
    </div>
  );
};

export default DocumentAddDropdown;
