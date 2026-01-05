/**
 * Modal 컴포넌트
 * @Auth 곽도윤
 *
 * 모달의 껍데기 컴포넌트입니다. 안의 내용은 자유롭게 구성하세요.
 *
 * @example
 * // 기본 사용법
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *   <div className="px-7 py-5 bg-white rounded-[20px]">
 *     <h2>모달 제목</h2>
 *     <p>모달 내용...</p>
 *     <button onClick={() => setIsOpen(false)}>닫기</button>
 *   </div>
 * </Modal>
 *
 * @example
 * // 바깥 클릭해도 안 닫히게 하려면
 * <Modal isOpen={isOpen} onClose={handleClose} closeOnBackdrop={false}>
 *   ...
 * </Modal>
 *
 * @example
 * // ESC 키로 안 닫히게 하려면
 * <Modal isOpen={isOpen} onClose={handleClose} closeOnEsc={false}>
 *   ...
 * </Modal>
 */

import { useEffect, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  /** 모달 열림 상태 */
  isOpen: boolean;
  /** 모달 닫기 함수 */
  onClose: () => void;
  /** 모달 안에 들어갈 내용 (자유롭게 구성) */
  children: ReactNode;
  /** 백드롭(바깥) 클릭 시 닫기 여부 (기본값: true) */
  closeOnBackdrop?: boolean;
  /** ESC 키 누르면 닫기 여부 (기본값: true) */
  closeOnEsc?: boolean;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  closeOnBackdrop = true,
  closeOnEsc = true,
}: ModalProps) => {
  // ESC 키로 닫기
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEsc, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // 모달 열리면 배경 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  // 모달 닫혀있으면 렌더링 안 함
  if (!isOpen) return null;

  // 백드롭(바깥) 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      {/* 
        children 안에서 모달 내용을 자유롭게 구성하세요.
        예: <div className="bg-white rounded-[20px] px-7 py-5">...</div>
      */}
      {children}
    </div>,
    document.body
  );
};

export default Modal;
