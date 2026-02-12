import { Suspense } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { lazyRoutes } from './routes';
// import HomeLayout from '@/layouts/HomeLayout';

import SideBarLayout from '@/layouts/SideBarLayout';
import SplashLayout from '@/layouts/SplashLayout';

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
  {
    path: '/login/callback',
    element: (
      <Suspense fallback={null}>
        <lazyRoutes.LoginCallbackPage />
      </Suspense>
    ),
  },
];

// 사이드바가 있는 공개 페이지
export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <SplashLayout />,
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
      {
        path: 'team/:teamId/task/new',
        element: (
          <Suspense fallback={null}>
            <lazyRoutes.MobileAddTask />
          </Suspense>
        ),
      },
      {
        path: 'team/:teamId/task/:taskId',
        element: (
          <Suspense fallback={null}>
            <lazyRoutes.TaskDetail />
          </Suspense>
        ),
      },
      {
        path: 'team/:teamId/minutes',
        element: (
          <Suspense fallback={null}>
            <lazyRoutes.Minutes />
          </Suspense>
        ),
      },
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
