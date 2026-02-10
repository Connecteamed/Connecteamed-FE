import { Outlet, useLocation } from 'react-router-dom';

import FooterBar from '@/components/FooterBar';
import Header from '@/components/Header';
import SideBar from '@/components/SideBar';

const SideBarLayout = () => {
  const { pathname } = useLocation();
  const isMyPage = pathname.startsWith('/mypage');

  return (
    <div className="flex h-screen w-full">
      <div className="hidden md:block">
        <SideBar />
      </div>

      <div className="flex flex-1 flex-col">
        <Header />
        <main
          className={`flex-1 overflow-auto pb-20 md:pb-0 ${isMyPage ? 'bg-white' : 'bg-[#F2F4F8]'}`}
        >
          <Outlet />
        </main>
      </div>

      <FooterBar />
    </div>
  );
};

export default SideBarLayout;
