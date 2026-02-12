import { Navigate, Outlet } from 'react-router-dom';

const getIsLoggedIn = () => Boolean(localStorage.getItem('accessToken'));

// 로그인한 회원만 접근 가능 (비로그인 시 로그인 페이지로)
export const PrivateRoute = () => {
  const isLoggedIn = getIsLoggedIn();
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

// 로그인 안 한 사람만 접근 가능 (로그인 상태면 메인으로)
export const PublicRoute = () => {
  const isLoggedIn = getIsLoggedIn();
  return isLoggedIn ? <Navigate to="/" replace /> : <Outlet />;
};