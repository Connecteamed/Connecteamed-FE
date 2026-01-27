/**
 *
 * @author 곽도윤
 *
 * @description
 * 팀 페이지입니다.
 * 하단 selectedTask에 따라 각 컴포넌트로 변경되도록 설정해두었고
 * 컴포넌트 작업 이후 연결 부탁드립니다.
 */

import React, { useState } from 'react';
import bell from '@assets/icon-bell-black.svg';
import setting from '@assets/icon-setting-outline.svg';
import TaskManagement from './components/TaskManagement/TaskManagement';
import Modal from '@/components/Modal';
import selectedRoll from '@assets/icon-selectedRoll-orange.svg';
import unselectedRoll from '@assets/icon-unSelectedRoll-orange.svg';
import Dropdown from '@/components/Dropdown';
import { useLocation } from 'react-router-dom';
import Calender from '@/components/calender';
import MeetingNote from './components/MeetingNote/MeetingNote';
import InviteModal from './components/InviteModal';
import NotificationModal from './components/NotificationModal';

type Member = { name: string; roles: string[] };
type RawMember = { name: string; roles: Array<string | null> };

const initialTeam = {
  teamname: 'UMC 3팀',
  members: [
    { name: '팀원1', roles: [null] },
    { name: '팀원2', roles: ['기획', '디자인'] },
    { name: '팀원3', roles: ['PPT'] },
    { name: '팀원4', roles: ['기획'] },
  ] as RawMember[],
  memberRoles: ['기획', '디자인', 'PPT'],
};

const profile = {
  name: '홍길동',
  notification: 9,
};

const TaskPage = () => {
  const [selectedTask, setSelectedTask] = useState<string | null>('1');
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roleModalPos, setRoleModalPos] = useState<{ top: number; left: number } | null>(null);
  const [activeMemberIndex, setActiveMemberIndex] = useState<number | null>(null);
  const [members, setMembers] = useState<Member[]>(
    initialTeam.members.map((m) => ({ ...m, roles: m.roles.filter((r): r is string => !!r) })),
  );
  const [settingDropdownIsOpen, setSettingDropdownIsOpen] = useState(false);
  const location = useLocation();
  const [selectedDate, setSelectedDate] = React.useState<Date>(() => new Date());
  const [isCalendarOpen, setIsCalendarOpen] = React.useState<boolean>(false);
  const [inviteModalIsOpen, setInviteModalIsOpen] = useState<boolean>(false);
  const [notificationModalIsOpen, setNotificationModalIsOpen] = useState<boolean>(false);

  const tasks = [
    { id: '1', title: '업무 목록' },
    { id: '2', title: '문서' },
    { id: '3', title: '회의록' },
    { id: '4', title: '완료한 업무' },
    { id: '5', title: 'AI 회고' },
  ];

  const handleOpenRoleModal = (event: React.MouseEvent<HTMLButtonElement>, memberIndex: number) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const modalWidth = 128; // w-32
    const offsetY = 8;
    setRoleModalPos({
      top: rect.bottom + offsetY + window.scrollY,
      left: rect.left + rect.width / 2 - modalWidth / 2 + window.scrollX,
    });
    setActiveMemberIndex(memberIndex);
    setIsRoleModalOpen(true);
  };

  const handleToggleRole = (roleName: string) => {
    if (activeMemberIndex === null) return;
    setMembers((prev) =>
      prev.map((member, idx) => {
        if (idx !== activeMemberIndex) return member;
        const hasRole = member.roles.includes(roleName);
        const nextRoles = hasRole
          ? member.roles.filter((r) => r !== roleName)
          : [...member.roles, roleName];
        return { ...member, roles: nextRoles };
      }),
    );
  };

  return (
    <div>
      <div className="ml-[80px] mt-[50px] mr-[40px] flex justify-between">
        <div className="w-[453px] h-[61px] text-black text-5xl font-bold">
          {initialTeam.teamname}
        </div>
        <div className="flex">
          <div className="inline-flex justify-start items-center gap-6">
            <div className="w-24 h-8 px-2 py-[5px] bg-orange-500 rounded-[10px] flex justify-center items-center gap-2.5 cursor-pointer"
            onClick={() => setInviteModalIsOpen(!inviteModalIsOpen)}>
              <div className="text-center justify-center text-white text-xs">초대하기</div>
              {inviteModalIsOpen && (
                <Modal isOpen={inviteModalIsOpen} onClose={() => setInviteModalIsOpen(false)}>
                  <InviteModal />
                </Modal>
              )}
            </div>
            <div className="w-6 h-6 relative overflow-hidden" onClick={() => setNotificationModalIsOpen(!notificationModalIsOpen)}>
              <img src={bell} alt="notification" className="w-6 h-6" />
              <div className="bg-orange-500 w-2.5 h-2.5">
                <div className="w-1.5 h-1.5 left-[15px] top-[3px] absolute text-center justify-center bg-orange-500 text-white text-[8px] font-normal font-['Roboto']">
                  <p>{profile.notification}</p>
                </div>
              </div>
            </div>
            {notificationModalIsOpen && (
              <Modal isOpen={notificationModalIsOpen} onClose={() => setNotificationModalIsOpen(false)}>
                <NotificationModal />
              </Modal>
            )}
            <div
              className="w-6 h-6 relative overflow-hidden"
              onClick={() => setSettingDropdownIsOpen(!settingDropdownIsOpen)}
            >
              <img src={setting} alt="setting" className="w-6 h-6 cursor-pointer" />
              {settingDropdownIsOpen && (
                <Dropdown
                  isOpen={settingDropdownIsOpen}
                  onClose={() => setSettingDropdownIsOpen(false)}
                >
                  <div className="absolute top-[97px] right-0 w-[124px] h-[94px] px-3 py-3 gap-2.5 flex flex-col text-xs text-white bg-white rounded-[10px]">
                    <div className="w-full h-7.5 py-1.5 px-[15px] bg-orange-500 rounded-[20px] flex justify-center items-center cursor-pointer">
                      프로젝트 종료
                    </div>
                    <div className="w-full h-7.5 py-1.5 px-[15px] bg-zinc-200 text-neutral-600 rounded-[20px] flex justify-center items-center cursor-pointer">
                      프로젝트 수정
                    </div>
                  </div>
                </Dropdown>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-[full-40px] h-full bg-white rounded-2xl mt-[31px] mx-[40px] py-[43px] px-10">
        <div className="inline-flex flex-wrap justify-start items-start gap-7">
          {members.map((member, index) => (
            <div className="flex gap-[30px] items-center" key={member.name}>
              <div className="flex gap-2.5">
                <div className="text-lg">{member.name}</div>
                <div className="flex flex-col gap-2.5">
                  {member.roles.length > 0 ? (
                    member.roles.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={(e) => handleOpenRoleModal(e, index)}
                        className="w-20 h-8.5 bg-gray-400 rounded-[5px] text-sm text-white flex items-center justify-center"
                      >
                        {role}
                      </button>
                    ))
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleOpenRoleModal(e, index)}
                      className="w-20 h-8.5 bg-gray-400 rounded-[5px] text-sm text-white flex items-center justify-center"
                    >
                      역할 선택
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-[30px] gap-[42px] flex">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`h-[21px] mb-4 flex text-lg items-center px-4 rounded-lg cursor-pointer ${selectedTask === task.id ? 'text-secondary-900 line-clamp-2' : ''}`}
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
          {selectedTask === '2' && <div>문서 컴포넌트</div>}
          {selectedTask === '3' && (
            <div>
              <MeetingNote newMeeting={location.state?.newMeeting} />
            </div>
          )}
          {selectedTask === '4' && <div>완료한 업무 컴포넌트</div>}
          {selectedTask === '5' && <div>AI 회고 컴포넌트</div>}
        </div>

        <Modal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)}>
          <div
            className="absolute w-32 h-32 bg-white rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)]"
            style={{
              top: roleModalPos?.top ?? '50%',
              left: roleModalPos?.left ?? '50%',
              transform: roleModalPos ? 'none' : 'translate(-50%, -50%)',
            }}
          >
            <div className="w-28 left-[12px] top-[12px] absolute inline-flex flex-col justify-start items-start gap-2">
              {initialTeam.memberRoles.map((roleName) => {
                const isSelected =
                  activeMemberIndex !== null &&
                  members[activeMemberIndex]?.roles.includes(roleName);
                return (
                  <button
                    type="button"
                    key={roleName}
                    onClick={() => handleToggleRole(roleName)}
                    className="self-stretch inline-flex justify-start items-center gap-2"
                  >
                    <div className="w-20 h-7 px-1.5 py-1 bg-gray-400 rounded-[5px] flex justify-center items-center gap-2.5">
                      <div className="text-center justify-center text-white text-sm font-medium">
                        {roleName}
                      </div>
                    </div>
                    <img
                      src={isSelected ? selectedRoll : unselectedRoll}
                      alt={isSelected ? 'selected role' : 'unselected role'}
                      className="w-4 h-4"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TaskPage;
