import { useEffect } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

const LoginCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const memberId = searchParams.get('memberId');
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const grantType = searchParams.get('grantType');
    const expiresIn = searchParams.get('expiresIn');

    if (!accessToken || !refreshToken) {
      navigate('/login', { replace: true });
      return;
    }

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    if (memberId) {
      localStorage.setItem('memberId', memberId);
    }
    if (grantType) {
      localStorage.setItem('grantType', grantType);
    }
    if (expiresIn) {
      localStorage.setItem('expiresIn', expiresIn);
    }

    navigate('/', { replace: true });
  }, [navigate, searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white text-sm text-neutral-70">
      로그인 처리 중입니다...
    </main>
  );
};

export default LoginCallbackPage;
