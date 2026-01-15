import type { ReactNode } from 'react';
import loginBackground from '@/assets/background.png';

interface AuthLayoutProps {
  children: ReactNode;
  mode: 'login' | 'signup';
}

const AuthLayout = ({ children, mode }: AuthLayoutProps) => {
  const isLogin = mode === 'login';

  return (
    <div
      className="relative flex w-full min-h-screen items-start justify-end bg-cover bg-center bg-no-repeat pr-[47px]"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      {/*
         - 로그인일 때는 위에서 144px 띄우고 나머지를 채움
         - 회원가입일 때는 전체 높이 차지
      */}
      <div
        className={`relative z-10 flex w-156 flex-col bg-white shadow-sm 
          ${isLogin ? 'mt-36 h-[calc(100vh-144px)] rounded-tr-[20px]' : 'h-screen'}
        `}
      >
        <div className="flex flex-col items-center justify-center w-full h-full px-16">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
