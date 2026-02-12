import React from 'react';

export const lazyRoutes = {
  Home: React.lazy(() => import('../pages/Home/settingsCheck')),
  Dashboard: React.lazy(() => import('../pages/DashBoard/Dashboard')),
  MakeProject: React.lazy(() => import('../pages/MakeProject/MakeProject')),
  SearchProject: React.lazy(() => import('../pages/SearchProject/SearchProject')),
  TaskPage: React.lazy(() => import('../pages/Tasks/TaskPage')),
  MobileAddTask: React.lazy(() => import('../pages/Tasks/MobileAddTask')),
  TaskDetail: React.lazy(() => import('../pages/Tasks/components/TaskManagement/TaskDetail')),
  MyPage: React.lazy(() => import('../pages/MyPage/MyPage')),
  Minutes: React.lazy(() => import('../pages/Minutes/MinutesPage')),
  LoginPage: React.lazy(() => import('../pages/Auth/LoginPage')),
  LoginCallbackPage: React.lazy(() => import('../pages/Auth/LoginCallbackPage')),
  SignupPage: React.lazy(() => import('../pages/Auth/SignupPage')),
  LandingPage: React.lazy(() => import('../pages/Landing/LandingPage')),
  SplashLayout: React.lazy(() => import('../layouts/SplashLayout')),
  NotFoundPage: React.lazy(() => import('../pages/NotFound/NotFoundPage')),
};
