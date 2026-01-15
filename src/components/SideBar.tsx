import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import logoImg from '@assets/icon-sidebar-logo.png';
import iconArrowDownBlack from '@assets/icon-arrow-down-black.svg';
import iconFoldersBlack from '@assets/icon-folders-black.svg';
import iconHomeBlack from '@assets/icon-home-black.svg';
import iconHomeOrange from '@assets/icon-home-orange.svg';
import iconMeBlack from '@assets/icon-me-black.svg';
import iconMeOrange from '@assets/icon-me-orange.svg';
import iconPeopleBlack from '@assets/icon-people-black.svg';
import iconSearchBlack from '@assets/icon-search-black.svg';
import iconSearchOrange from '@assets/icon-search-orange.svg';

// TODO: 실제 팀 데이터로 교체
const teamList = [
  { id: '1', name: '00공모전' },
  { id: '2', name: '마케팅 원론 2조' },
];

const Sidebar = () => {
  const [isTeamOpen, setIsTeamOpen] = useState(true);

  return (
    <aside className="w-[300px] h-screen px-5 py-4 bg-white border-r-2 border-zinc-200 flex flex-col justify-between">
      {/* 상단 영역 */}
      <div className="flex flex-col gap-6">
        {/* 로고 */}
        <div className="flex items-center gap-1">
          <img src={logoImg} alt="logo" className="w-11 h-11" />
          <span className="text-primary-500 text-2xl font-medium">Connecteamd</span>
        </div>

        {/* 메뉴 */}
        <nav className="flex flex-col">
          {/* 대시보드 */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `h-12 px-2 py-3 flex items-center gap-3 rounded-md transition-colors ${
                isActive ? 'bg-slate-100' : 'hover:bg-slate-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? iconHomeOrange : iconHomeBlack}
                  alt="dashboard"
                  className="w-6 h-6"
                />
                <span
                  className={`text-base font-medium ${
                    isActive ? 'text-primary-500' : 'text-black'
                  }`}
                >
                  대시보드
                </span>
              </>
            )}
          </NavLink>

          {/* 팀 */}
          <button
            type="button"
            onClick={() => setIsTeamOpen((prev) => !prev)}
            className="h-12 px-2 py-3 flex items-center justify-between hover:bg-slate-50 rounded-md transition-colors"
          >
            <div className="flex items-center gap-3">
              <img src={iconFoldersBlack} alt="team" className="w-6 h-6" />
              <span className="text-black text-base font-medium">팀</span>
            </div>
            <img
              src={iconArrowDownBlack}
              alt="arrow"
              className={`w-6 h-6 transition-transform ${isTeamOpen ? '' : '-rotate-180'}`}
            />
          </button>

          {/* 팀 리스트 */}
          {isTeamOpen && (
            <div className="flex flex-col">
              {teamList.map((team) => (
                <NavLink
                  key={team.id}
                  to={`/team/${team.id}`}
                  className={({ isActive }) =>
                    `h-10 px-11 py-1.5 flex items-center rounded-md transition-colors ${
                      isActive ? 'bg-slate-100 text-primary-500' : 'text-black hover:bg-slate-50'
                    }`
                  }
                >
                  <span className="text-base font-medium">{team.name}</span>
                </NavLink>
              ))}
            </div>
          )}

          {/* 프로젝트 생성 */}
          <NavLink
            to="/project/create"
            className={({ isActive }) =>
              `h-12 px-2 py-3 flex items-center gap-3 rounded-md transition-colors ${
                isActive ? 'bg-slate-100' : 'hover:bg-slate-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <img src={iconPeopleBlack} alt="create project" className="w-6 h-6" />
                <span
                  className={`text-base font-medium ${
                    isActive ? 'text-primary-500' : 'text-black'
                  }`}
                >
                  프로젝트 생성
                </span>
              </>
            )}
          </NavLink>

          {/* 프로젝트 찾기 */}
          <NavLink
            to="/project/search"
            className={({ isActive }) =>
              `h-12 px-2 py-3 flex items-center gap-3 rounded-md transition-colors ${
                isActive ? 'bg-slate-100' : 'hover:bg-slate-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? iconSearchOrange : iconSearchBlack}
                  alt="search project"
                  className="w-6 h-6"
                />
                <span
                  className={`text-base font-medium ${
                    isActive ? 'text-primary-500' : 'text-black'
                  }`}
                >
                  프로젝트 찾기
                </span>
              </>
            )}
          </NavLink>
        </nav>
      </div>

      {/* 하단 마이페이지 */}
      <NavLink
        to="/mypage"
        className={({ isActive }) =>
          `h-12 px-2 py-3 flex items-center gap-3 rounded-md transition-colors ${
            isActive ? 'bg-slate-100' : 'hover:bg-slate-50'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <img src={isActive ? iconMeOrange : iconMeBlack} alt="mypage" className="w-6 h-6" />
            <span
              className={`text-base font-medium ${isActive ? 'text-primary-500' : 'text-black'}`}
            >
              마이페이지
            </span>
          </>
        )}
      </NavLink>
    </aside>
  );
};

export default Sidebar;
