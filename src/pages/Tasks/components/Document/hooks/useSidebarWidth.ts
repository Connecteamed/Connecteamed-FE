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

    const observedEl = getSidebarEl();

    let resizeObserver: ResizeObserver | null = null;
    if (observedEl && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => update());
      resizeObserver.observe(observedEl);
    }

    return () => {
      window.removeEventListener('resize', update);
      resizeObserver?.disconnect();
    };
  }, [sidebarSelector, fallbackSidebarWidth]);

  return sidebarWidth;
};
