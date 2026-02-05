import { useMemo, useState } from 'react';

import { NavLink } from 'react-router-dom';

import iconArrowDownBlack from '@assets/icon-arrow-down-black.svg';
import iconFoldersBlack from '@assets/icon-folders-black.svg';
import iconHomeBlack from '@assets/icon-home-black.svg';
import iconHomeOrange from '@assets/icon-home-orange.svg';
import iconMeBlack from '@assets/icon-me-black.svg';
import iconMeOrange from '@assets/icon-me-orange.svg';
import iconPeopleBlack from '@assets/icon-people-black.svg';
import iconSearchBlack from '@assets/icon-search-black.svg';
import iconSearchOrange from '@assets/icon-search-orange.svg';
import logoImg from '@assets/icon-sidebar-logo.png';

import useGetTeamList from '@/hooks/TaskPage/Query/useGetTeamList';

type Team = {
  teamId: number;
  name: string;
};

const Sidebar = () => {
  const [isTeamOpen, setIsTeamOpen] = useState(true);
  const { data, isLoading, isError } = useGetTeamList();

  const teams: Team[] = useMemo(() => {
    if (!data?.data) return [];
    const payload = data.data;

    // 서버 응답이 TeamList[] 또는 TeamList 단일 객체 둘 다 대응
    const list = Array.isArray(payload) ? payload : [payload];

    return list.flatMap((group) =>
      group?.teams?.map((team) => ({ teamId: team.id, name: team.name })) ?? [],
    );
  }, [data]);

  return (
    <aside className="flex h-screen w-[300px] flex-col justify-between border-r-2 border-zinc-200 bg-white px-5 py-4">
      {/* 상단 영역 */}
      <div className="flex flex-col gap-6">
        {/* 로고 */}
        <div className="flex items-center gap-1">
          <img src={logoImg} alt="logo" className="h-11 w-11" />
          <span className="text-primary-500 text-2xl font-medium">Connecteamed</span>
        </div>

        {/* 메뉴 */}
        <nav className="flex flex-col">
          {/* 대시보드 */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex h-12 items-center gap-3 rounded-md px-2 py-3 transition-colors ${
                isActive ? 'bg-slate-100' : 'hover:bg-slate-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? iconHomeOrange : iconHomeBlack}
                  alt="dashboard"
                  className="h-6 w-6"
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
            className="flex h-12 items-center justify-between rounded-md px-2 py-3 transition-colors hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <img src={iconFoldersBlack} alt="team" className="h-6 w-6" />
              <span className="text-base font-medium text-black">내 프로젝트</span>
            </div>
            <img
              src={iconArrowDownBlack}
              alt="arrow"
              className={`h-6 w-6 transition-transform ${isTeamOpen ? '' : '-rotate-180'}`}
            />
          </button>

          {/* 팀 리스트 */}
          {isTeamOpen && (
            <div className="flex flex-col">
              {isLoading && (
                <span className="text-neutral-80 px-11 py-1.5 text-sm">팀을 불러오는 중...</span>
              )}
              {!isLoading && isError && (
                <span className="px-11 py-1.5 text-sm text-red-500">팀 정보를 불러오지 못했습니다.</span>
              )}
              {!isLoading && !isError && teams.length === 0 && (
                <span className="text-neutral-80 px-11 py-1.5 text-sm">참여한 팀이 없어요</span>
              )}
              {!isLoading &&
                !isError &&
                teams.map((team) => (
                  <NavLink
                    key={team.teamId}
                    to={`/team/${team.teamId}`}
                    className={({ isActive }) =>
                      `flex h-10 items-center rounded-md px-11 py-1.5 transition-colors ${
                        isActive ? 'text-primary-500 bg-slate-100' : 'text-black hover:bg-slate-50'
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
              `flex h-12 items-center gap-3 rounded-md px-2 py-3 transition-colors ${
                isActive ? 'bg-slate-100' : 'hover:bg-slate-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <img src={iconPeopleBlack} alt="create project" className="h-6 w-6" />
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
              `flex h-12 items-center gap-3 rounded-md px-2 py-3 transition-colors ${
                isActive ? 'bg-slate-100' : 'hover:bg-slate-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? iconSearchOrange : iconSearchBlack}
                  alt="search project"
                  className="h-6 w-6"
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
          `flex h-12 items-center gap-3 rounded-md px-2 py-3 transition-colors ${
            isActive ? 'bg-slate-100' : 'hover:bg-slate-50'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <img src={isActive ? iconMeOrange : iconMeBlack} alt="mypage" className="h-6 w-6" />
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
