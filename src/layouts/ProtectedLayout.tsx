import { Navigate, Outlet } from 'react-router-dom';

import FooterBar from '@/components/FooterBar';
import Header from '@/components/Header';
import SideBar from '@/components/SideBar';

const ProtectedLayout = () => {
  // TODO: 인증 로직 구현 후 수정
  const isAuthenticated = false;

  if (!isAuthenticated) {
    return <Navigate to={'/'} replace />;
  }

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden md:block">
        <SideBar />
      </div>

      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-auto bg-[#F2F4F8] pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>

      <FooterBar />
    </div>
  );
};

export default ProtectedLayout;
