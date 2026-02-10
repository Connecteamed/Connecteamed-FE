/**
 *
 * @author 곽도윤
 *
 * @description
 * 팀 페이지입니다.
 * 하단 selectedTask에 따라 각 컴포넌트로 변경되도록 설정해두었고
 * 컴포넌트 작업 이후 연결 부탁드립니다.
 */
import { useEffect, useMemo, useState } from 'react';
import type { MouseEvent } from 'react';

import { useLocation, useParams } from 'react-router-dom';

import DocumentPage from '@/pages/Tasks/components/Document/DocumentPage';
import bell from '@assets/icon-bell-black.svg';
import selectedRoll from '@assets/icon-selectedRoll-orange.svg';
import setting from '@assets/icon-setting-outline.svg';
import unselectedRoll from '@assets/icon-unSelectedRoll-orange.svg';

import Dropdown from '@/components/Dropdown';
import Modal from '@/components/Modal';

import useGetProjectRoleList from '@/hooks/MakeProject/Query/useGetProjectRoleList';
import usePatchMemberRoles from '@/hooks/TaskPage/Mutate/usePatchMemberRole';
import useGetProjectMemberList from '@/hooks/TaskPage/Query/useGetProjectMemberList';

import AIReview from './components/AIReview/AIReview';
import InviteModal from './components/InviteModal';
import MeetingNote from './components/MeetingNote/MeetingNote';
import NotificationModal from './components/NotificationModal';
import TaskManagement from './components/TaskManagement/TaskManagement';

type Member = { id?: number; name: string; roles: string[] };

const profile = {
  name: '홍길동',
  notification: 9,
};

const TaskPage = () => {
  const { teamId: projectId } = useParams();
  const parsedProjectId = Number(projectId);

  console.log(Number.isFinite(parsedProjectId));

  const [selectedTask, setSelectedTask] = useState<string | null>('1');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roleModalPos, setRoleModalPos] = useState<{ top: number; left: number } | null>(null);
  const [activeMemberIndex, setActiveMemberIndex] = useState<number | null>(null);
  const { data: projectRoles } = useGetProjectRoleList(parsedProjectId);
  const { data: memberList } = useGetProjectMemberList(parsedProjectId);

  const { mutate: patchMemberRole } = usePatchMemberRoles(parsedProjectId);

  console.log('projectRoles', projectRoles);
  console.log('memberList', memberList);

  const [members, setMembers] = useState<Member[]>([]);
  const teamName = useMemo(() => '팀원 목록', []);

  useEffect(() => {
    if (!memberList) return;
    const normalized = memberList.map((m) => {
      const roleNames = Array.isArray(m.roles)
        ? m.roles
            .map((r) => {
              if (typeof r === 'string') return r;
              if (r && typeof r === 'object') return (r as any).roleName ?? (r as any).name ?? '';
              return '';
            })
            .filter(Boolean)
        : [];

      return {
        id: m.projectMemberId ?? m.memberId,
        name: m.memberName ?? m.name ?? '이름없음',
        roles: roleNames,
      };
    });
    setMembers(normalized);
  }, [memberList]);
  const [settingDropdownIsOpen, setSettingDropdownIsOpen] = useState(false);
  const location = useLocation();
  const [inviteModalIsOpen, setInviteModalIsOpen] = useState<boolean>(false);
  const [notificationModalIsOpen, setNotificationModalIsOpen] = useState<boolean>(false);

  const tasks = [
    { id: '1', title: '업무 목록' },
    { id: '2', title: '문서' },
    { id: '3', title: '회의록' },
    { id: '4', title: '완료한 업무' },
    { id: '5', title: 'AI 회고' },
  ];

  const handleOpenRoleModal = (event: MouseEvent<HTMLButtonElement>, memberIndex: number) => {
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

    // 현재 역할 배열
    const hasRole = member.roles.includes(roleName);
    // 새 역할 배열 (string[] → 서버는 roleId 필요)
    const nextRoles = hasRole
      ? member.roles.filter((r) => r !== roleName)
      : [...member.roles, roleName];

    // optimistic update를 위해 UI 즉시 반영
    setMembers((prev) =>
      prev.map((m, idx) => (idx === activeMemberIndex ? { ...m, roles: nextRoles } : m)),
    );

    // 서버 호출: roles → roleIds 변환 필요
    // 여기서 roleName → roleId 매핑 필요
    const roleIdMap = projectRoles?.reduce<Record<string, number>>(
      (acc, role) => ({ ...acc, [role.name]: role.roleId }),
      {},
    );

    const roleIds = nextRoles.map((r) => roleIdMap?.[r]).filter(Boolean) as number[];

    patchMemberRole({ memberId: member.id, roleIds });
  };

  return (
    <div>
      <div className="mt-[50px] mr-[40px] ml-[80px] flex justify-between">
        <div className="h-[61px] w-[453px] text-5xl font-bold text-black">{teamName}</div>
        <div className="flex">
          <div className="inline-flex items-center justify-start gap-6">
            <div
              className="flex h-8 w-24 cursor-pointer items-center justify-center gap-2.5 rounded-[10px] bg-orange-500 px-2 py-[5px]"
              onClick={() => setInviteModalIsOpen(!inviteModalIsOpen)}
            >
              <div className="justify-center text-center text-xs text-white">초대하기</div>
              {inviteModalIsOpen && (
                <Modal isOpen={inviteModalIsOpen} onClose={() => setInviteModalIsOpen(false)}>
                  <InviteModal
                    projectId={parsedProjectId}
                    projectName={teamName}
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
                  <p>{profile.notification}</p>
                </div>
              </div>
            </div>
            {notificationModalIsOpen && (
              <Modal
                isOpen={notificationModalIsOpen}
                onClose={() => setNotificationModalIsOpen(false)}
              >
                <NotificationModal />
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
                    <div className="flex h-7.5 w-full cursor-pointer items-center justify-center rounded-[20px] bg-orange-500 px-[15px] py-1.5">
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
        <div className="inline-flex flex-wrap items-start justify-start gap-7">
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

        <div className="mt-[30px] flex gap-[42px]">
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
        <div>
          {selectedTask === '1' && (
            <div>
              <TaskManagement />
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
          {selectedTask === '4' && <div>완료한 업무 컴포넌트</div>}
          {selectedTask === '5' && (
            <div>
              <AIReview />
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
      </div>
    </div>
  );
};

export default TaskPage;
