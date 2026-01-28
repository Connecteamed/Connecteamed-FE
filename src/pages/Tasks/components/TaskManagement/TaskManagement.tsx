import React, { useState } from 'react';

import Modal from '@/components';
import searchPaper from '@assets/icon-search-paper.svg';

import Dropdown from '@/components/Dropdown';

import AddTaskModal from './AddTaskModal';
import AssigneeDropdown from './AssigneeDropdown';
import GanttChart from './GanttChart';

type TaskRow = {
  id: string;
  title: string;
  description: string;
  status: '시작 전' | '진행 중';
  startDate: string;
  endDate: string;
  assignees: string;
};

// 실제 데이터 연결 시 null 가능성을 대비해 널 허용
const tasks: TaskRow[] | null = [
  {
    id: 'task-1',
    title: '와이어프레임 제작',
    description: 'UI 디자인을 위한 와이어프레임 제작 후 디자이너에게 연락',
    status: '시작 전',
    startDate: '2025.11.13',
    endDate: '2025.11.24',
    assignees: '팀원1',
  },
  {
    id: 'task-2',
    title: 'API  명세서 작성',
    description:
      '와이어프레임 보고 서비스에 기능별 API 제작 : 스웨거로 관리할 거고 REST API 형식...',
    status: '진행 중',
    startDate: '2025.11.13',
    endDate: '2025.11.30',
    assignees: '팀원1, 팀원2, 팀원3, 팀원4',
  },
  {
    id: 'task-3',
    title: 'ERD 작성',
    description: '데이터베이스 ERD 작성',
    status: '진행 중',
    startDate: '2025.11.13',
    endDate: '2025.11.30',
    assignees: '팀원1, 팀원2',
  },
];

const statusStyle: Record<TaskRow['status'], string> = {
  '시작 전': 'bg-zinc-200 text-neutral-600',
  '진행 중': 'bg-orange-100 text-neutral-600',
};

const TaskManagement = () => {
  const hasTasks = Array.isArray(tasks) && tasks.length > 0;
  const [selectedStatus, setSelectedStatus] = useState<'시작 전' | '진행 중' | '완료'>('시작 전');
  const [statusDropdownOpenId, setStatusDropdownOpenId] = useState<string | null>(null);
  const [assigneeDropdownOpenId, setAssigneeDropdownOpenId] = useState<string | null>(null);
  const [addTaskModalIsOpen, setAddTaskModalIsOpen] = useState(false);

  const handleSelectStatus = (status: '시작 전' | '진행 중' | '완료') => {
    setSelectedStatus(status);
  };

  const handleIsStatusToggleOpen = () => {
    setStatusToggleIsOpen(!statusToggleIsOpen);
  };

  if (!hasTasks) {
    return (
      <div className="pb-gap-4 mt-[133px] flex w-full flex-col items-center justify-center">
        <div className="inline-flex w-48 flex-col items-center justify-start gap-4">
          <div className="inline-flex h-48 items-center justify-center gap-2.5 self-stretch rounded-[100px] bg-orange-100 p-8">
            <div className="relative h-32 w-32 overflow-hidden">
              <img src={searchPaper} alt="search paper" />
            </div>
          </div>
          <div className="flex w-80 flex-col items-center justify-start gap-3">
            <div className="h-7 justify-center self-stretch text-center text-2xl font-medium text-black">
              아직 등록된 업무가 없어요
            </div>
            <div className="h-10 justify-center self-stretch text-center text-sm font-normal text-black">
              업무를 추가해 팀원들과 작업을 시작해 보세요
            </div>
          </div>
          <button
            type="button"
            className="inline-flex h-12 w-36 items-center justify-center gap-2.5 rounded-[10px] bg-orange-500 px-2 py-[5px] text-sm font-medium text-white"
            onClick={() => setAddTaskModalIsOpen(true)}
          >
            업무 추가
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex w-full flex-col items-start justify-start">
      <div className="flex h-12 flex-col justify-center self-stretch bg-slate-100 p-3.5 outline-gray-200">
        <div className="inline-flex items-center justify-start gap-60">
          <div className="flex w-56 items-center justify-start gap-16">
            <div className="h-5 w-20 text-sm text-black">업무명</div>
            <div className="h-5 w-20 text-sm text-black">업무내용</div>
          </div>
          <div className="flex items-start justify-start gap-16">
            <div className="h-5 w-7 text-center text-sm text-black">상태</div>
            <div className="flex h-5 items-center justify-start gap-10">
              <div className="h-5 w-20 text-sm text-black">시작일</div>
              <div className="h-5 w-20 text-sm text-black">마감일</div>
              <div className="h-5 w-16 text-sm text-black">담당자</div>
              <div className="h-5 w-7" />
            </div>
          </div>
        </div>
      </div>

      {tasks.map((task, index) => (
        <div
          key={task.id ?? index}
          className="flex flex-col gap-2.5 self-stretch border-r border-b border-l border-gray-200 bg-white p-3.5"
        >
          <div className="body-xl inline-flex items-center justify-start gap-4">
            <div className="flex items-start justify-start gap-3.5">
              <div className="w-32 text-xs text-neutral-600">{task.title}</div>
              <div className="w-72 text-xs leading-5 text-neutral-600">{task.description}</div>
            </div>
            <div className="relative flex items-center justify-start gap-11">
              <div
                className={`flex w-20 items-center justify-center rounded-[20px] px-3.5 py-1.5 ${statusStyle[task.status]}`}
              >
                <div
                  className="text-xs"
                  onClick={() => setStatusDropdownOpenId((prev) => (prev === task.id ? null : task.id))}
                >
                  {task.status}
                </div>
                {statusDropdownOpenId === task.id && (
                  <div>
                    <Dropdown
                      isOpen={statusDropdownOpenId === task.id}
                      onClose={() => setStatusDropdownOpenId(null)}
                    >
                      <div className="absolute top-0 left-0 flex h-32 w-24 flex-col gap-2.5 rounded-[10px] bg-white px-3 py-3 text-xs">
                        <div
                          className="flex h-7 w-[78px] items-center justify-center self-stretch rounded-[20px] bg-zinc-200"
                          onClick={() => handleSelectStatus('시작 전')}
                        >
                          시작 전
                        </div>
                        <div
                          className="flex h-7 w-[78px] items-center justify-center self-stretch rounded-[20px] bg-orange-100"
                          onClick={() => handleSelectStatus('진행 중')}
                        >
                          진행 중
                        </div>
                        <div
                          className="flex h-7 w-[78px] items-center justify-center self-stretch rounded-[20px] bg-orange-300"
                          onClick={() => handleSelectStatus('완료')}
                        >
                          완료
                        </div>
                      </div>
                    </Dropdown>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-start gap-3.5">
                <div className="flex items-center justify-start gap-5">
                  <div className="w-24 text-xs text-neutral-600">{task.startDate}</div>
                  <div className="w-24 text-xs text-neutral-600">{task.endDate}</div>
                  <div
                    className="w-24 cursor-pointer text-xs whitespace-pre-line text-neutral-600"
                    onClick={() =>
                      setAssigneeDropdownOpenId((prev) => (prev === task.id ? null : task.id))
                    }
                  >
                    {task.assignees.replaceAll(', ', '\n')}
                    {assigneeDropdownOpenId === task.id && (
                      <Dropdown
                        isOpen={assigneeDropdownOpenId === task.id}
                        onClose={() => setAssigneeDropdownOpenId(null)}
                      >
                        <AssigneeDropdown />
                      </Dropdown>
                    )}
                  </div>
                </div>
                <button type="button" className="h-7 w-7 text-center text-xs text-neutral-400">
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="right-0 mt-[30px] flex h-[32px] w-[90px] cursor-pointer items-center justify-center rounded-[10px] bg-orange-500 text-xs text-white"
        onClick={() => setAddTaskModalIsOpen(true)}
      >
        업무 추가
      </button>
      {addTaskModalIsOpen && (
        <Modal isOpen={addTaskModalIsOpen} onClose={() => setAddTaskModalIsOpen(false)}>
          <AddTaskModal />
        </Modal>
      )}

      <div className="mt-7.5">
        <GanttChart />
      </div>
    </div>
  );
};

export default TaskManagement;
