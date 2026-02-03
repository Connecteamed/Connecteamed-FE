import { NavLink } from 'react-router-dom';

import iconFoldersBlack from '@assets/icon-folders-black.svg';
import iconHomeBlack from '@assets/icon-home-black.svg';
import iconHomeOrange from '@assets/icon-home-orange.svg';
import iconMeBlack from '@assets/icon-me-black.svg';
import iconMeOrange from '@assets/icon-me-orange.svg';
import iconPeopleBlack from '@assets/icon-people-black.svg';
import iconPeopleOrange from '@assets/icon-people-orange.svg';
import iconSearchBlack from '@assets/icon-search-black.svg';
import iconSearchOrange from '@assets/icon-search-orange.svg';

const FooterBar = () => {
  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 border-t border-zinc-200 bg-white md:hidden">
      <div className="mx-auto flex h-16 max-w-[480px] items-center justify-between px-6">
        {/* 대시보드 */}
        <NavLink to="/" end className="flex h-12 w-12 items-center justify-center">
          {({ isActive }) => (
            <img
              src={isActive ? iconHomeOrange : iconHomeBlack}
              alt="dashboard"
              className="h-7 w-7"
            />
          )}
        </NavLink>

        {/* 팀 */}
        <NavLink to="/team" className="flex h-12 w-12 items-center justify-center">
          {() => <img src={iconFoldersBlack} alt="team" className="h-7 w-7" />}
        </NavLink>

        {/* 프로젝트 생성 */}
        <NavLink to="/project/create" className="flex h-12 w-12 items-center justify-center">
          {({ isActive }) => (
            <img
              src={isActive ? iconPeopleOrange : iconPeopleBlack}
              alt="create project"
              className="h-7 w-7"
            />
          )}
        </NavLink>

        {/* 프로젝트 찾기 */}
        <NavLink to="/project/search" className="flex h-12 w-12 items-center justify-center">
          {({ isActive }) => (
            <img
              src={isActive ? iconSearchOrange : iconSearchBlack}
              alt="search project"
              className="h-7 w-7"
            />
          )}
        </NavLink>

        {/* 마이페이지 */}
        <NavLink to="/mypage" className="flex h-12 w-12 items-center justify-center">
          {({ isActive }) => (
            <img src={isActive ? iconMeOrange : iconMeBlack} alt="mypage" className="h-7 w-7" />
          )}
        </NavLink>
      </div>
    </nav>
  );
};

export default FooterBar;
