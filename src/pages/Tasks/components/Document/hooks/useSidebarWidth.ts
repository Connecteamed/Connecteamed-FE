import { useEffect, useState } from 'react';

type Options = {
  sidebarSelector?: string;
  fallbackSidebarWidth?: number;
};

export const useSidebarWidth = ({
  sidebarSelector = 'aside',
  fallbackSidebarWidth = 260,
}: Options = {}) => {
  const [sidebarWidth, setSidebarWidth] = useState<number>(fallbackSidebarWidth);

  useEffect(() => {
    const getSidebarEl = () => document.querySelector(sidebarSelector) as HTMLElement | null;

    const update = () => {
      const el = getSidebarEl();
      if (!el) {
        setSidebarWidth(fallbackSidebarWidth);
        return;
      }
      setSidebarWidth(el.offsetWidth);
    };

    update();
    window.addEventListener('resize', update);

    const el = getSidebarEl();
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

  return sidebarWidth;
};
