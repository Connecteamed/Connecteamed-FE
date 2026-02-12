import { Suspense, useEffect, useState } from 'react';

import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';

// 사용자의 lazy import 경로

// --- [레이아웃 컴포넌트들] ---
import SideBarLayout from '@/layouts/SideBarLayout';

import { lazyRoutes } from './routes';

// 1. 스플래시 (초기 로딩) 레이아웃
const SplashLayout = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 토큰 체크 혹은 초기 데이터 로딩 시뮬레이션
    const checkAuth = async () => {
      // 필요하다면 여기서 유효성 검사 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) {
    // 실제 랜딩(로딩) 페이지를 보여줌
    const LandingPage = lazyRoutes.LandingPage;
    return (
      <Suspense fallback={<div />}> 
        <LandingPage />
      </Suspense>
    );
  }
  return <Outlet />;
};

// 2. 가드 (Guard) 컴포넌트
const getIsLoggedIn = () => Boolean(localStorage.getItem('accessToken'));

// 로그인한 사람은 못 들어오게 (로그인/회원가입 페이지용) -> 메인으로 튕김
const PublicOnlyRoute = () => {
  return getIsLoggedIn() ? <Navigate to="/" replace /> : <Outlet />;
};

// 로그인 안 한 사람은 못 들어오게 (메인 서비스용) -> 로그인으로 튕김
const PrivateRoute = () => {
  return getIsLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />;
};

// --- [라우터 설정] ---
export const router = createBrowserRouter([
  {
    element: <SplashLayout />, // 최상위: 로딩 처리
    children: [
      // -------------------------------------------------------
      // [그룹 1] 비로그인 전용 (사이드바 X)
      // -------------------------------------------------------
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            path: 'login',
            element: (
              <Suspense fallback={null}>
                <lazyRoutes.LoginPage />
              </Suspense>
            ),
          },
          {
            path: 'signup',
            element: (
              <Suspense fallback={null}>
                <lazyRoutes.SignupPage />
              </Suspense>
            ),
          },
          {
            path: 'login/callback',
            element: (
              <Suspense fallback={null}>
                <lazyRoutes.LoginCallbackPage />
              </Suspense>
            ),
          },
        ],
      },

      // -------------------------------------------------------
      // [그룹 2] 로그인 회원 전용
      // -------------------------------------------------------
      {
        element: <PrivateRoute />,
        children: [
          // A. 사이드바가 필요한 페이지들 (SideBarLayout으로 감쌈)
          {
            element: <SideBarLayout />,
            children: [
              {
                path: '/', // 메인 대시보드
                element: (
                  <Suspense fallback={null}>
                    <lazyRoutes.Dashboard />
                  </Suspense>
                ),
              },
              {
                path: 'project/create',
                element: (
                  <Suspense fallback={null}>
                    <lazyRoutes.MakeProject />
                  </Suspense>
                ),
              },
              {
                path: 'team/:teamId',
                element: (
                  <Suspense fallback={null}>
                    <lazyRoutes.TaskPage />
                  </Suspense>
                ),
              },
              {
                path: 'mypage',
                element: (
                  <Suspense fallback={null}>
                    <lazyRoutes.MyPage />
                  </Suspense>
                ),
              },
              // ... 기타 사이드바가 필요한 업무 페이지들
            ],
          },

          // B. 로그인은 했지만 사이드바가 없어야 하는 페이지가 있다면 여기에 추가
          // (예: 전체화면 지도, 모바일 전용 작성 뷰 등)
          {
            path: 'team/:teamId/task/new',
            element: (
              <Suspense fallback={null}>
                <lazyRoutes.MobileAddTask />
              </Suspense>
            ),
          },
        ],
      },

      // 404 페이지 (모두 접근 가능하거나 Private 내부에 둘 수도 있음)
      {
        path: '*',
        element: (
          <Suspense fallback={null}>
            <lazyRoutes.NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);
