import React, { useState } from 'react';
import GanttChart from './GanttChart';
import searchPaper from '@assets/icon-search-paper.svg';
import Modal from '@/components';
import Dropdown from '@/components/Dropdown';

type TaskRow = {
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
    title: '와이어프레임 제작',
    description: 'UI 디자인을 위한 와이어프레임 제작 후 디자이너에게 연락',
    status: '시작 전',
    startDate: '2025.11.13',
    endDate: '2025.11.24',
    assignees: '팀원1',
  },
  {
    title: 'API  명세서 작성',
    description:
      '와이어프레임 보고 서비스에 기능별 API 제작 : 스웨거로 관리할 거고 REST API 형식...',
    status: '진행 중',
    startDate: '2025.11.13',
    endDate: '2025.11.30',
    assignees: '팀원1, 팀원2, 팀원3, 팀원4',
  },
  {
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
  const [statusToggleIsOpen, setStatusToggleIsOpen] = useState(false);

  const handleSelectStatus = (status: '시작 전' | '진행 중' | '완료') => {
    setSelectedStatus(status);
  };

  const handleIsStatusToggleOpen = () => {
    setStatusToggleIsOpen(!statusToggleIsOpen);
  };

  if (!hasTasks) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-[133px] pb-gap-4">
        <div className="w-48 inline-flex flex-col justify-start items-center gap-4">
          <div className="self-stretch h-48 p-8 bg-orange-100 rounded-[100px] inline-flex justify-center items-center gap-2.5">
            <div className="w-32 h-32 relative overflow-hidden">
              <img src={searchPaper} alt="search paper" />
            </div>
          </div>
          <div className="w-80 flex flex-col justify-start items-center gap-3">
            <div className="self-stretch h-7 text-center justify-center text-black text-2xl font-medium">
              아직 등록된 업무가 없어요
            </div>
            <div className="self-stretch h-10 text-center justify-center text-black text-sm font-normal">
              업무를 추가해 팀원들과 작업을 시작해 보세요
            </div>
          </div>
          <button
            type="button"
            className="w-36 h-12 px-2 py-[5px] bg-orange-500 rounded-[10px] inline-flex justify-center items-center gap-2.5 text-white text-sm font-medium"
          >
            업무 추가
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full inline-flex flex-col justify-start items-start">
      <div className="self-stretch h-12 p-3.5 bg-slate-100 outline-gray-200 flex flex-col justify-center">
        <div className="inline-flex justify-start items-center gap-60">
          <div className="w-56 flex justify-start items-center gap-16">
            <div className="w-20 h-5 text-black text-sm">업무명</div>
            <div className="w-20 h-5 text-black text-sm">업무내용</div>
          </div>
          <div className="flex justify-start items-start gap-16">
            <div className="w-7 h-5 text-center text-black text-sm">상태</div>
            <div className="h-5 flex justify-start items-center gap-10">
              <div className="w-20 h-5 text-black text-sm">시작일</div>
              <div className="w-20 h-5 text-black text-sm">마감일</div>
              <div className="w-16 h-5 text-black text-sm">담당자</div>
              <div className="w-7 h-5" />
            </div>
          </div>
        </div>
      </div>

      {tasks.map((task) => (
        <div
          key={task.title}
          className="self-stretch p-3.5 bg-white border-l border-r border-b border-gray-200 flex flex-col gap-2.5"
        >
          <div className="inline-flex justify-start items-center gap-4 body-xl">
            <div className="flex justify-start items-start gap-3.5">
              <div className="w-32 text-neutral-600 text-xs">{task.title}</div>
              <div className="w-72 text-neutral-600 text-xs leading-5">{task.description}</div>
            </div>
            <div className="flex justify-start items-center gap-11">
              <div
                className={`w-20 px-3.5 py-1.5 rounded-[20px] flex justify-center items-center ${statusStyle[task.status]}`}
              >
                <div className="text-xs" onClick={() => setStatusToggleIsOpen(true)}>
                  {task.status}
                </div>
                {statusToggleIsOpen && (
                  <div>
                    <Dropdown
                      isOpen={statusToggleIsOpen}
                      onClose={() => setStatusToggleIsOpen(false)}
                    >
                      <div className="bg-white relative w-24 h-32 rounded-[10px] flex flex-col px-3 py-3 gap-2.5 text-xs">
                        <div
                          className="self-stretch h-7 w-[78px] flex justify-center items-center bg-zinc-200 rounded-[20px]"
                          onClick={() => handleSelectStatus('시작 전')}
                        >
                          시작 전
                        </div>
                        <div
                          className="self-stretch h-7 w-[78px] flex justify-center items-center bg-orange-100 rounded-[20px]"
                          onClick={() => handleSelectStatus('진행 중')}
                        >
                          진행 중
                        </div>
                        <div
                          className="self-stretch h-7 w-[78px] flex justify-center items-center bg-orange-300 rounded-[20px]"
                          onClick={() => handleSelectStatus('완료')}
                        >
                          완료
                        </div>
                      </div>
                    </Dropdown>
                  </div>
                )}
              </div>
              <div className="flex justify-start items-center gap-3.5">
                <div className="flex justify-start items-center gap-5">
                  <div className="w-24 text-neutral-600 text-xs">{task.startDate}</div>
                  <div className="w-24 text-neutral-600 text-xs">{task.endDate}</div>
                  <div className="w-24 text-neutral-600 text-xs whitespace-pre-line">
                    {task.assignees.replace(', ', '\n')}
                  </div>
                </div>
                <button type="button" className="w-7 h-7 text-center text-neutral-400 text-xs">
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="right-0 mt-[30px] w-[90px] h-[32px] flex bg-orange-500 rounded-[10px] items-center justify-center text-white text-xs cursor-pointer">
        업무 추가
      </div>

      <div className="mt-7.5">
        <GanttChart />
      </div>
    </div>
  );
};

export default TaskManagement;
