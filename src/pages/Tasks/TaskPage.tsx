import { useEffect, useMemo, useState } from 'react';
import type { MouseEvent } from 'react';

import { useLocation, useNavigate, useParams } from 'react-router-dom';

import DocumentPage from '@/pages/Tasks/components/Document/DocumentPage';
import bell from '@assets/icon-bell-black.svg';
import selectedRoll from '@assets/icon-selectedRoll-orange.svg';
import setting from '@assets/icon-setting-outline.svg';
import unselectedRoll from '@assets/icon-unSelectedRoll-orange.svg';

import Dropdown from '@/components/Dropdown';
import Modal from '@/components/Modal';

import useGetProjectRoleList from '@/hooks/MakeProject/Query/useGetProjectRoleList';
import { useCloseProject } from '@/hooks/MakeProject/useCloseProject';
import { useNotification } from '@/hooks/Notification/useNotification';
import usePatchMemberRoles from '@/hooks/TaskPage/Mutate/usePatchMemberRole';
import useGetProjectMemberList from '@/hooks/TaskPage/Query/useGetProjectMemberList';

import AIReview from './components/AIReview/AIReview';
import CompleteTaskPage from './components/CompleteTask/CompleteTaskPage';
import InviteModal from './components/InviteModal';
import MeetingNote from './components/MeetingNote/MeetingNote';
import MobileRoleBottomSheet from './components/MobileRoleBottomSheet';
import NotificationModal from './components/NotificationModal';
import TaskManagement from './components/TaskManagement/TaskManagement';
import TaskStatistic from './components/TaskStatistic/TaskStatistic';
import { closeProject } from '@/apis/MakeProject/closeProject';

type Member = { id?: number; name: string; roles: string[] };

const TaskPage = () => {
  const { teamId: projectId } = useParams();
  const parsedProjectId = Number(projectId);

  // console.log(Number.isFinite(parsedProjectId));

  const navigate = useNavigate();
  const location = useLocation();

  const initialSelectedTask = (() => {
    const state = location.state as { selectedTask?: string } | null;
    return state?.selectedTask ?? '1';
  })();

  const [selectedTask, setSelectedTask] = useState<string | null>(initialSelectedTask);

  useEffect(() => {
    if (location.state && Object.keys(location.state as Record<string, unknown>).length > 0) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roleModalPos, setRoleModalPos] = useState<{ top: number; left: number } | null>(null);
  const [activeMemberIndex, setActiveMemberIndex] = useState<number | null>(null);
  const [isMobileRoleSheetOpen, setIsMobileRoleSheetOpen] = useState(false);
  const [mobileRoleDraft, setMobileRoleDraft] = useState<string[]>([]);
  const { data: projectRoles } = useGetProjectRoleList(parsedProjectId);
  const { data: memberList = [] } = useGetProjectMemberList(parsedProjectId);

  const { mutate: patchMemberRole } = usePatchMemberRoles(parsedProjectId);

  const [members, setMembers] = useState<Member[]>([]);
  const projectNameFromNav = (location.state as { projectName?: string } | null)?.projectName;

  const [teamName, setTeamName] = useState<string>('');

  useEffect(() => {
    const name =
      projectNameFromNav ||
      (memberList[0] as { projectName?: string } | undefined)?.projectName ||
      '팀 이름';
    setTeamName(name);
  }, [projectNameFromNav, memberList]); // projectNameFromNav나 memberList가 바뀔 때 갱신

  useEffect(() => {
    if (!memberList) return;
    const normalized = memberList.map((m) => {
      const roleNames = Array.isArray(m.roles)
        ? m.roles
            .map((r) => {
              if (typeof r === 'string') return r;
              if (r && typeof r === 'object')
                return (
                  (r as { roleName?: string; name?: string }).roleName ??
                  (r as { roleName?: string; name?: string }).name ??
                  ''
                );
              return '';
            })
            .filter(Boolean)
        : [];

      return {
        id: m.projectMemberId ?? m.memberId,
        name: m.memberName ?? (m as { name?: string }).name ?? '이름없음',
        roles: roleNames,
      };
    });
    setMembers(normalized);
  }, [memberList]);

  const [settingDropdownIsOpen, setSettingDropdownIsOpen] = useState(false);
  const [inviteModalIsOpen, setInviteModalIsOpen] = useState<boolean>(false);
  const [notificationModalIsOpen, setNotificationModalIsOpen] = useState<boolean>(false);
  const { data: notificationData } = useNotification();

  const [loading, setLoading] = useState(false);

  const handleCloseProject = async (projectId: number) => {
    setLoading(true);
    try {
      const result = await closeProject(projectId);
      console.log('프로젝트 종료 성공:', result);
      // 성공 처리: 페이지 이동, 알림 등
    } catch (error) {
      console.error('프로젝트 종료 에러:', error);
      alert('프로젝트 종료 실패');
    } finally {
      setLoading(false);
    }
  };

  const [isProjectEndModalOpen, setIsProjectEndModalOpen] = useState<boolean>(false);

  const tasks = [
    { id: '1', title: '업무 목록' },
    { id: '2', title: '문서' },
    { id: '3', title: '회의록' },
    { id: '4', title: '완료한 업무' },
    { id: '5', title: '업무 통계' },
    { id: '6', title: 'AI 회고' },
  ];

  const roleIdMap: Record<string, number> = {};

  const applyMemberRoles = (memberIndex: number, nextRoles: string[]) => {
    const member = members[memberIndex];
    if (!member?.id) return;

    setMembers((prev) =>
      prev.map((m, idx) => (idx === memberIndex ? { ...m, roles: nextRoles } : m)),
    );

    const roleIds = nextRoles
      .map((r) => roleIdMap[r])
      .filter((id): id is number => typeof id === 'number' && Number.isFinite(id));

    patchMemberRole({ memberId: member.id, roleIds });
  };

  const handleOpenRoleModal = (event: MouseEvent<HTMLButtonElement>, memberIndex: number) => {
    const member = members[memberIndex];
    if (!member) return;

    const isMobile =
      typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;

    if (isMobile) {
      setActiveMemberIndex(memberIndex);
      setMobileRoleDraft(member.roles ?? []);
      setIsMobileRoleSheetOpen(true);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const modalWidth = 128; // w-32
    const offsetY = 8;
    setRoleModalPos({
      top: rect.bottom + offsetY,
      left: rect.left + rect.width / 2 - modalWidth / 2,
    });
    setActiveMemberIndex(memberIndex);
    setIsRoleModalOpen(true);
  };

  const handleToggleRole = (roleName: string) => {
    if (activeMemberIndex === null) return;
    const member = members[activeMemberIndex];
    if (!member?.id) return;

    const hasRole = member.roles.includes(roleName);
    const nextRoles = hasRole
      ? member.roles.filter((r) => r !== roleName)
      : [...member.roles, roleName];

    applyMemberRoles(activeMemberIndex, nextRoles);
  };

  const handleToggleMobileRoleDraft = (roleName: string) => {
    setMobileRoleDraft((prev) => {
      const hasRole = prev.includes(roleName);
      return hasRole ? prev.filter((r) => r !== roleName) : [...prev, roleName];
    });
  };

  const handleSaveMobileRole = () => {
    if (activeMemberIndex === null) return;
    applyMemberRoles(activeMemberIndex, mobileRoleDraft);
    setIsMobileRoleSheetOpen(false);
  };

  const closeMobileRoleSheet = () => setIsMobileRoleSheetOpen(false);

  const projectName = teamName;

  return (
    <div className="max-[767px]:bg-slate-50">
      <div className="mt-[50px] mr-[40px] ml-[80px] flex justify-between max-[767px]:mx-4 max-[767px]:mt-6 max-[767px]:flex-col max-[767px]:items-start max-[767px]:gap-4">
        <div className="h-[61px] w-[453px] text-5xl font-bold text-black max-[767px]:h-auto max-[767px]:w-full max-[767px]:text-3xl">
          {teamName}
        </div>
        <div className="flex max-[767px]:w-full max-[767px]:justify-start">
          <div className="inline-flex items-center justify-start gap-6 max-[767px]:flex-wrap max-[767px]:gap-4">
            <div
              className="flex h-8 w-24 cursor-pointer items-center justify-center gap-2.5 rounded-[10px] bg-orange-500 px-2 py-[5px]"
              onClick={() => setInviteModalIsOpen(!inviteModalIsOpen)}
            >
              <div className="justify-center text-center text-xs text-white">초대하기</div>
              {inviteModalIsOpen && (
                <Modal isOpen={inviteModalIsOpen} onClose={() => setInviteModalIsOpen(false)}>
                  <InviteModal
                    projectId={parsedProjectId}
                    projectName={projectName}
                    onClose={() => setInviteModalIsOpen(false)}
                  />
                </Modal>
              )}
            </div>
            <div
              className="relative h-6 w-6 overflow-hidden"
              onClick={() => setNotificationModalIsOpen(!notificationModalIsOpen)}
            >
              <img src={bell} alt="notification" className="h-6 w-6" />
              <div className="h-2.5 w-2.5 bg-orange-500">
                <div className="absolute top-[3px] left-[15px] h-1.5 w-1.5 justify-center bg-orange-500 text-center font-['Roboto'] text-[8px] font-normal text-white">
                  <p>{notificationData?.unreadCount ?? 0}</p>
                </div>
              </div>
            </div>
            {notificationModalIsOpen && (
              <Modal
                isOpen={notificationModalIsOpen}
                onClose={() => setNotificationModalIsOpen(false)}
              >
                <NotificationModal
                  unreadCount={notificationData?.unreadCount ?? 0}
                  notifications={notificationData?.notifications ?? []}
                />
              </Modal>
            )}
            <div
              className="relative h-6 w-6 overflow-hidden"
              onClick={() => setSettingDropdownIsOpen(!settingDropdownIsOpen)}
            >
              <img src={setting} alt="setting" className="h-6 w-6 cursor-pointer" />
              {settingDropdownIsOpen && (
                <Dropdown
                  isOpen={settingDropdownIsOpen}
                  onClose={() => setSettingDropdownIsOpen(false)}
                >
                  <div className="absolute top-[97px] right-0 flex h-[94px] w-[124px] flex-col gap-2.5 rounded-[10px] bg-white px-3 py-3 text-xs text-white">
                    <div
                      className="flex h-7.5 w-full cursor-pointer items-center justify-center rounded-[20px] bg-orange-500 px-[15px] py-1.5"
                      onClick={() => {
                        setSettingDropdownIsOpen(false);
                        setIsProjectEndModalOpen(true);
                      }}
                    >
                      프로젝트 종료
                    </div>
                    <div className="flex h-7.5 w-full cursor-pointer items-center justify-center rounded-[20px] bg-zinc-200 px-[15px] py-1.5 text-neutral-600">
                      프로젝트 수정
                    </div>
                  </div>
                </Dropdown>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mx-[40px] mt-[31px] h-full w-[full-40px] rounded-2xl bg-white px-10 py-[43px]">
        <div className="inline-flex flex-wrap items-start justify-start gap-7 max-[767px]:hidden">
          {members.map((member, index) => (
            <div className="flex items-center gap-[30px]" key={member.id ?? member.name}>
              <div className="flex gap-2.5">
                <div className="text-lg">{member.name}</div>
                <div className="flex flex-col gap-2.5">
                  {member.roles.length > 0 ? (
                    member.roles.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={(e) => handleOpenRoleModal(e, index)}
                        className="flex h-8.5 w-20 items-center justify-center rounded-[5px] bg-gray-400 text-sm text-white"
                      >
                        {role}
                      </button>
                    ))
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleOpenRoleModal(e, index)}
                      className="flex h-8.5 w-20 items-center justify-center rounded-[5px] bg-gray-400 text-sm text-white"
                    >
                      역할 선택
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile view */}
        <div className="inline-flex w-full items-start gap-3 overflow-x-auto px-1 min-[768px]:hidden">
          {members.map((member, index) => {
            const rolesToRender = member.roles.length ? member.roles : ['역할 선택'];

            return (
              <div
                key={member.id ?? member.name}
                className="inline-flex items-start gap-1.5 max-[767px]:font-['Roboto'] max-[767px]:text-[8px] max-[767px]:font-medium"
              >
                <div className="flex items-start gap-1.5">
                  <div className="text-[8px] font-medium text-black">{member.name}</div>
                  <div className="flex flex-col items-start gap-1.5">
                    {rolesToRender.map((role, roleIdx) => (
                      <button
                        key={`${member.name}-m-${role}-${roleIdx}`}
                        type="button"
                        onClick={(e) => handleOpenRoleModal(e, index)}
                        className="flex h-3.5 w-10 items-center justify-center rounded bg-gray-400 px-1.5 py-1"
                      >
                        <div className="text-center text-[6px] font-medium text-white">{role}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-[30px] flex gap-[42px] max-[767px]:hidden">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`mb-4 flex h-[21px] cursor-pointer items-center rounded-lg px-4 text-lg ${selectedTask === task.id ? 'text-secondary-900 line-clamp-2' : ''}`}
              onClick={() => setSelectedTask(task.id)}
            >
              {task.title}
            </div>
          ))}
        </div>

        <div className="hidden max-[767px]:mt-6 max-[767px]:flex max-[767px]:w-full max-[767px]:justify-start">
          <div className="inline-flex w-full max-w-[18rem] flex-col items-start justify-center gap-1">
            <div className="inline-flex items-center gap-4">
              {tasks.map((task) => {
                const isActive = selectedTask === task.id;
                return (
                  <button
                    key={task.id}
                    type="button"
                    className="flex flex-col items-center gap-1"
                    onClick={() => setSelectedTask(task.id)}
                  >
                    <span
                      className={`text-center font-['Roboto'] text-xs font-medium ${
                        isActive ? 'text-blue-900' : 'text-black'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span
                      className={`${
                        isActive
                          ? 'w-11 border-b-2 border-blue-900'
                          : 'w-0 border-b-2 border-transparent'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div>
          {selectedTask === '1' && (
            <div>
              <TaskManagement projectId={parsedProjectId} />
            </div>
          )}
          {selectedTask === '2' && (
            <div className="flex min-h-0 flex-1 flex-col">
              <DocumentPage />
            </div>
          )}
          {selectedTask === '3' && (
            <div>
              <MeetingNote newMeeting={location.state?.newMeeting} />
            </div>
          )}
          {selectedTask === '4' && (
            <div>
              <CompleteTaskPage projectId={parsedProjectId} />
            </div>
          )}
          {selectedTask === '5' && (
            <div>
              <TaskStatistic />
            </div>
          )}
          {selectedTask === '6' && (
            <div>
              <AIReview projectId={parsedProjectId} />
            </div>
          )}
        </div>

        {isRoleModalOpen && roleModalPos && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsRoleModalOpen(false)}
            role="presentation"
          >
            <div
              className="fixed w-32 rounded-[10px] bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)]"
              style={{ top: roleModalPos.top, left: roleModalPos.left }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <div className="absolute top-[12px] left-[12px] inline-flex w-28 flex-col items-start justify-start gap-2 bg-white">
                {projectRoles?.map((role) => {
                  const isSelected =
                    activeMemberIndex !== null &&
                    members[activeMemberIndex]?.roles.includes(role.name);
                  return (
                    <button
                      type="button"
                      key={role.roleId}
                      onClick={() => handleToggleRole(role.name)}
                      className="inline-flex items-center justify-start gap-2 self-stretch"
                    >
                      <div className="flex h-7 w-20 items-center justify-center gap-2.5 rounded-[5px] bg-gray-400 px-1.5 py-1">
                        <div className="justify-center text-center text-sm font-medium text-white">
                          {role.name}
                        </div>
                      </div>
                      <img
                        src={isSelected ? selectedRoll : unselectedRoll}
                        alt={isSelected ? 'selected role' : 'unselected role'}
                        className="h-4 w-4"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <MobileRoleBottomSheet
          isOpen={isMobileRoleSheetOpen}
          roles={projectRoles}
          selectedRoles={mobileRoleDraft}
          onToggle={handleToggleMobileRoleDraft}
          onSave={handleSaveMobileRole}
          onClose={closeMobileRoleSheet}
        />

        {isProjectEndModalOpen && (
          <Modal isOpen={isProjectEndModalOpen} onClose={() => setIsProjectEndModalOpen(false)}>
            <div className="inline-flex h-[250px] w-[450px] flex-col items-start justify-start gap-2.5 rounded-[10px] bg-white px-8 py-9">
              <div className="flex w-96 flex-col items-center justify-start gap-4">
                <div className="h-12 justify-center self-stretch text-center font-['Roboto'] text-3xl font-bold text-black">
                  프로젝트 종료
                </div>
                <div className="h-12 justify-center self-stretch text-center font-['Roboto'] text-base font-normal text-black">
                  프로젝트를 종료할까요?
                </div>
                <div className="inline-flex items-center justify-start gap-6 self-stretch">
                  <div className="flex h-12 w-44 items-center justify-center gap-2.5 rounded-[5px] bg-zinc-300 px-4 py-2 outline outline-1 outline-offset-[-1px] outline-gray-200">
                    <div className="justify-center text-center font-['Roboto'] text-base leading-4 font-medium text-black">
                      아니요
                    </div>
                  </div>
                  <button
                    type="button"
                    className="flex h-12 w-44 items-center justify-center gap-2.5 rounded-[5px] bg-blue-600 px-4 py-2"
                    onClick={() => {handleCloseProject(parsedProjectId);}}
                  >
                    예
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default TaskPage;
