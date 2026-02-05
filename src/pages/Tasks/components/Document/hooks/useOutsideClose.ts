import React from 'react';

type Options = {
  enabled: boolean;
  onClose: () => void;
  ref: React.RefObject<HTMLElement | null>;
};

const useOutsideClose = ({ enabled, onClose, ref }: Options) => {
  React.useEffect(() => {
    if (!enabled) return;

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (ref.current && !ref.current.contains(target)) onClose();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [enabled, onClose, ref]);
};

export default useOutsideClose;
