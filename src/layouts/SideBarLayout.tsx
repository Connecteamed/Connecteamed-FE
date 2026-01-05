import { Outlet } from 'react-router-dom';
import SideBar from '@/components/SideBar';

const SideBarLayout = () => {
  return (
    <div className="flex h-screen w-full">
      <SideBar />
      <main className="flex-1 overflow-auto bg-[#F2F4F8]">
        <Outlet />
      </main>
    </div>
  );
};

export default SideBarLayout;
