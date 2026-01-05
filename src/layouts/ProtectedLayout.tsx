import { Navigate, Outlet } from 'react-router-dom';
import SideBar from '@/components/SideBar';

const ProtectedLayout = () => {
  // TODO: 인증 로직 구현 후 수정
  const isAuthenticated = false;

  if (!isAuthenticated) {
    return <Navigate to={'/'} replace />;
  }

  return (
    <div className="flex h-screen w-full">
      <SideBar />
      <main className="flex-1 overflow-auto bg-[#F2F4F8]">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;
