import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

function toAppPath(target: string) {
  // 절대 URL이면 path+search+hash만 추출
  if (/^https?:\/\//i.test(target)) {
    const u = new URL(target);
    return `${u.pathname}${u.search}${u.hash}`;
  }

  // 상대경로면 / 보정
  if (target.startsWith('/')) return target;
  return `/${target}`;
}

export function useNavigateByTargetUrl() {
  const navigate = useNavigate();

  return useCallback(
    (targetUrl?: string | null, targetUri?: string | null) => {
      const target = targetUrl ?? targetUri;
      if (!target) return;

      navigate(toAppPath(target));
    },
    [navigate],
  );
}
