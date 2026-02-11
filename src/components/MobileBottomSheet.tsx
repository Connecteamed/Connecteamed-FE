import { useCallback, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface MobileBottomSheetProps {
  /** 열림 상태 */
  isOpen: boolean;
  /** 닫기 핸들러 */
  onClose: () => void;
  /** 내용 (자유롭게 구성) */
  children: ReactNode;
  /** 바깥 클릭 시 닫기 여부 (기본값 true) */
  closeOnBackdrop?: boolean;
  /** ESC 키로 닫기 여부 (기본값 true) */
  closeOnEsc?: boolean;
  /** 상단 핸들 표시 여부 (기본값 true) */
  showHandle?: boolean;
  /** 시트 컨테이너 추가 클래스 */
  className?: string;
}

const MobileBottomSheet = ({
  isOpen,
  onClose,
  children,
  closeOnBackdrop = true,
  closeOnEsc = true,
  showHandle = true,
  className = '',
}: MobileBottomSheetProps) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEsc, onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div
        className={`w-96 max-w-[calc(100%-32px)] max-h-[90vh] overflow-hidden rounded-tl-[20px] rounded-tr-[20px] bg-white p-5 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] inline-flex flex-col justify-start items-start gap-2.5 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {showHandle && (
          <div className="w-full flex items-center justify-center">
            <div className="w-24 h-0 outline outline-[3px] outline-offset-[-1.5px] outline-zinc-200" />
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default MobileBottomSheet;
