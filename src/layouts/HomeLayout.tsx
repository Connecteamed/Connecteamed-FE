import { Outlet } from 'react-router-dom';

const HomeLayout = () => {
  return (
    <div className="max-w-[1920px] w-full m-auto">
      {/* TODO: Navbar 컴포넌트 추가 */}

      <main style={{ minHeight: 'calc(100vh - 140px)' }}>
        <Outlet />
      </main>

      {/* TODO: Footer 컴포넌트 추가 */}
    </div>
  );
};

export default HomeLayout;
