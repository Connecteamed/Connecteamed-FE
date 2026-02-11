import { useEffect, useState } from 'react';

import { Outlet } from 'react-router-dom';

import LandingPage from '@/pages/Landing/LandingPage';
import FooterBar from '@/components/FooterBar';
import Header from '@/components/Header';
import SideBar from '@/components/SideBar';

const SplashLayout = () => {
  const [showSplash, setShowSplash] = useState(() => {
    return sessionStorage.getItem('seenSplash') !== '1';
  });

  useEffect(() => {
    if (!showSplash) return;

    const timer = setTimeout(() => {
      sessionStorage.setItem('seenSplash', '1');
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [showSplash]);

  if (showSplash) return <LandingPage />;

  return (
    <div className="flex h-screen w-full">
      <div className="hidden md:block">
        <SideBar />
      </div>

      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-auto pb-20 md:pb-0 bg-[#F2F4F8]">
          <Outlet />
        </main>
      </div>

      <FooterBar />
    </div>
  );
};

export default SplashLayout;
