import React from 'react';

export const lazyRoutes = {
  Home: React.lazy(() => import('../pages/Home/settingsCheck')),
  Dashboard: React.lazy(() => import('../pages/DashBoard/Dashboard')),
  MakeProject: React.lazy(() => import('../pages/MakeProject/MakeProject')),
  SearchProject: React.lazy(() => import('../pages/SearchProject/SearchProject')),
  TaskPage: React.lazy(() => import('../pages/Tasks/TaskPage')),
  MyPage: React.lazy(() => import('../pages/MyPage/MyPage')),
  Minutes: React.lazy(() => import('../pages/Minutes/MinutesPage')),
  LoginPage: React.lazy(() => import('../pages/Auth/LoginPage')),
  LoginCallbackPage: React.lazy(() => import('../pages/Auth/LoginCallbackPage')),
  SignupPage: React.lazy(() => import('../pages/Auth/SignupPage')),
};
