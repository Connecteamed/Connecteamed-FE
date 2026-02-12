import { useMemo, useState } from 'react';

import { NavLink } from 'react-router-dom';

import iconArrowDownBlack from '@assets/icon-arrow-down-black.svg';
import iconFoldersBlack from '@assets/icon-folders-black.svg';
import iconHomeBlack from '@assets/icon-home-black.svg';
import iconHomeOrange from '@assets/icon-home-orange.svg';
import iconMeBlack from '@assets/icon-me-black.svg';
import iconMeOrange from '@assets/icon-me-orange.svg';
import iconPeopleBlack from '@assets/icon-people-black.svg';
import iconPeopleOrange from '@assets/icon-people-orange.svg';
import iconSearchBlack from '@assets/icon-search-black.svg';
import iconSearchOrange from '@assets/icon-search-orange.svg';
import logoImg from '@assets/icon-sidebar-logo.png';

import useGetTeamList from '@/hooks/TaskPage/Query/useGetTeamList';
import useGetCompletedTeamList from '@/hooks/TaskPage/Query/useGetCompletedTeamList';

type TeamItem = {
  teamId?: number;
  id?: number;
  name: string;
};

type TeamGroup = {
  teams?: TeamItem[];
};

type ApiResponse = {
  data?: TeamGroup[] | TeamGroup;
};

type Team = {
  teamId: number;
  name: string;
};

// 기존 import 및 타입은 그대로 사용
const Sidebar = () => {
  const [isTeamOpen, setIsTeamOpen] = useState(true);
  const [isCompletedOpen, setIsCompletedOpen] = useState(false);

  const { data, isLoading, isError } = useGetTeamList() as {
    data?: ApiResponse;
    isLoading: boolean;
    isError: boolean;
  };

  const teams: Team[] = useMemo(() => {
    if (!data?.data) return [];
    const payload = data.data;
    const list = Array.isArray(payload) ? payload : [payload];
    return list.flatMap(
      (group) =>
        group.teams?.map((team, idx) => ({
          teamId: team.teamId ?? team.id ?? idx,
          name: team.name,
        })) ?? [],
    );
  }, [data]);

  // 완료한 프로젝트 API 연동
  const { data: completedData, isLoading: completedLoading, isError: completedError } = useGetCompletedTeamList();

  const completedTeams: Team[] = useMemo(() => {
    if (!completedData?.data?.projects) return [];
    return completedData.data.projects.map((project: any) => ({
      teamId: project.id,
      name: project.name,
    }));
  }, [completedData]);

  const renderTeamList = (
    list: Team[],
    isLoading: boolean,
    isError: boolean,
    emptyMessage: string
  ) => {
    if (isLoading)
      return <span className="text-neutral-80 px-11 py-1.5 text-sm">팀을 불러오는 중...</span>;
    if (isError)
      return (
        <span className="px-11 py-1.5 text-sm text-red-500">
          팀 정보를 불러오지 못했습니다.
        </span>
      );
    if (list.length === 0)
      return <span className="text-neutral-80 px-11 py-1.5 text-sm">{emptyMessage}</span>;

    return list.map((team, idx) => (
      <NavLink
        key={team.teamId ?? idx}
        to={`/team/${team.teamId}`}
        state={{ projectName: team.name }}
        className={({ isActive }) =>
          `flex h-10 items-center rounded-md px-11 py-1.5 transition-colors ${
            isActive ? 'text-primary-500 bg-slate-100' : 'text-black hover:bg-slate-50'
          }`
        }
      >
        <span className="line-clamp-1 text-base font-medium">{team.name}</span>
      </NavLink>
    ));
  };

  return (
    <aside className="flex h-screen w-75 flex-col justify-between border-r-2 border-zinc-200 bg-white px-5 py-4">
      <div className="flex flex-col gap-6">
        {/* 상단 로고 */}
        <NavLink to="/" className="flex items-center gap-1">
          <img src={logoImg} alt="logo" className="h-11 w-11" />
          <span className="text-primary-500 text-2xl font-medium">Connecteamed</span>
        </NavLink>

        <nav className="flex flex-col gap-1">
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
                <span className={`text-base font-medium ${isActive ? 'text-primary-500' : 'text-black'}`}>
                  대시보드
                </span>
              </>
            )}
          </NavLink>

          {/* 내 프로젝트 */}
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
          {isTeamOpen && renderTeamList(teams, isLoading, isError, '참여한 팀이 없어요')}

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
                <img
                  src={isActive ? iconPeopleOrange : iconPeopleBlack}
                  alt="create project"
                  className="h-6 w-6"
                />
                <span className={`text-base font-medium ${isActive ? 'text-primary-500' : 'text-black'}`}>
                  프로젝트 생성
                </span>
              </>
            )}
          </NavLink>

          {/* 프로젝트 검색 */}
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
                <span className={`text-base font-medium ${isActive ? 'text-primary-500' : 'text-black'}`}>
                  프로젝트 찾기
                </span>
              </>
            )}
          </NavLink>

          {/* 완료한 프로젝트 */}
          <button
            type="button"
            onClick={() => setIsCompletedOpen((prev) => !prev)}
            className="flex h-12 items-center justify-between rounded-md px-2 py-3 transition-colors hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <img src={iconFoldersBlack} alt="completed" className="h-6 w-6" />
              <span className="text-base font-medium text-black">완료한 프로젝트</span>
            </div>
            <img
              src={iconArrowDownBlack}
              alt="arrow"
              className={`h-6 w-6 transition-transform ${isCompletedOpen ? '' : '-rotate-180'}`}
            />
          </button>
          {isCompletedOpen && renderTeamList(completedTeams, completedLoading, completedError, '완료한 프로젝트가 없어요')}
        </nav>
      </div>

      {/* 마이페이지 항상 아래 */}
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
            <span className={`text-base font-medium ${isActive ? 'text-primary-500' : 'text-black'}`}>
              마이페이지
            </span>
          </>
        )}
      </NavLink>
    </aside>
  );
};
export default Sidebar;