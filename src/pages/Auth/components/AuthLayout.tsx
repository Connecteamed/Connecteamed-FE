import type { ReactNode } from 'react';

import mobileBackground from '@/assets/image-background-mobile.png';
import loginBackground from '@/assets/image-background.png';

interface AuthLayoutProps {
  children: ReactNode;
  mode: 'login' | 'signup';
}

const AuthLayout = ({ children, mode }: AuthLayoutProps) => {
  const isLogin = mode === 'login';

  return (
    <div className="relative flex min-h-screen w-full items-start justify-center md:justify-end md:pr-11.75">
      <div
        className="absolute inset-0 z-0 block bg-cover bg-center md:hidden"
        style={{ backgroundImage: `url(${mobileBackground})` }}
      />
      <div
        className="absolute inset-0 z-0 hidden bg-cover bg-center md:block"
        style={{ backgroundImage: `url(${loginBackground})` }}
      />

      <div
        className={`relative z-10 flex w-full flex-col items-center bg-transparent px-8 pt-[303px] md:w-156 md:bg-white md:px-16 md:shadow-sm ${
          isLogin
            ? 'md:mt-36 md:min-h-[calc(100vh-144px)] md:rounded-tr-[20px] md:pt-[155px]'
            : 'md:min-h-screen md:pt-[155px]'
        } `}
      >
        <div className="flex w-full flex-col items-center">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
