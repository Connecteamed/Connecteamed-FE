import { Suspense } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { lazyRoutes } from './routes';
// import HomeLayout from '@/layouts/HomeLayout';

import SideBarLayout from '@/layouts/SideBarLayout';

// 로그인, 회원가입 등 사이드바 없는 페이지
export const authRoutes: RouteObject[] = [
  {
    path: '/login',
    element: (
      <Suspense fallback={null}>
        <lazyRoutes.LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/signup',
    element: (
      <Suspense fallback={null}>
        <lazyRoutes.SignupPage />
      </Suspense>
    ),
  },
];

// 사이드바가 있는 공개 페이지
export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <SideBarLayout />,
    children: [
      {
        index: true,
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
        path: 'project/search',
        element: (
          <Suspense fallback={null}>
            <lazyRoutes.SearchProject />
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
    ],
  },
];

// 사이드바가 있는 인증 필요 페이지
export const protectedRoutes: RouteObject[] = [
  {
    path: '/mypage',
    element: <SideBarLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={null}>
            <lazyRoutes.MyPage />
          </Suspense>
        ),
      },
    ],
  },
];

export const router = createBrowserRouter([...authRoutes, ...publicRoutes, ...protectedRoutes]);
