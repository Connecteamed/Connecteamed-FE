import React from 'react';
import bell from '@assets/icon-bell-black.svg';
import setting from '@assets/icon-setting-outline.svg';
import Calender from '@/components/calender';
import DocumentPage from '@/pages/Tasks/components/Document/DocumentPage';

const team = {
  teamname: 'UMC 3팀',
  members: [
    { name: '팀원1', roles: ['역할 선택'] },
    { name: '팀원2', roles: ['기획', '디자인'] },
    { name: '팀원3', roles: ['PPT'] },
    { name: '팀원4', roles: ['기획'] },
  ],
};

const profile = {
  name: '홍길동',
  notification: 9,
};

const TaskPage = () => {
  const [selectedTask, setSelectedTask] = React.useState<string | null>('1');
  const [selectedDate, setSelectedDate] = React.useState<Date>(() => new Date());
  const [isCalendarOpen, setIsCalendarOpen] = React.useState<boolean>(false);

  const tasks = [
    { id: '1', title: '업무 목록' },
    { id: '2', title: '문서' },
    { id: '3', title: '회의록' },
    { id: '4', title: '완료한 업무' },
    { id: '5', title: 'AI 회고' },
  ];

  return (
    <div className="w-full overflow-x-hidden min-h-screen flex flex-col">
      <div className="ml-[40px] mt-[50px] mr-[40px] flex justify-between">
        <div className="w-[453px] h-[61px] text-black text-5xl font-bold">{team.teamname}</div>
        <div className="flex">
          <div className="inline-flex justify-start items-center gap-6">
            <div className="w-24 h-8 px-2 py-[5px] bg-orange-500 rounded-[10px] flex justify-center items-center gap-2.5">
              <div className="text-center justify-center text-white text-xs">초대하기</div>
            </div>
            <div className="w-6 h-6 relative overflow-hidden">
              <img src={bell} alt="notification" className="w-6 h-6" />
              <div className="bg-orange-500 w-2.5 h-2.5">
                <div className="w-1.5 h-1.5 left-[15px] top-[3px] absolute text-center justify-center bg-orange-500 text-white text-[8px] font-normal font-['Roboto']">
                  <p>{profile.notification}</p>
                </div>
              </div>
            </div>
            <div className="w-6 h-6 relative overflow-hidden">
              <img src={setting} alt="setting" className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[31px] ml-[40px] mr-[40px] bg-white rounded-t-2xl rounded-b-none px-10 pt-[43px] pb-[43px] flex-1 flex flex-col">
        <div className="inline-flex flex-wrap justify-start items-start gap-7">
          {team.members.map((member, index) => (
            <div className="flex gap-[30px] items-center" key={index}>
              <div className="flex gap-2.5">
                <div className="text-lg">{member.name}</div>
                <div className="flex flex-col gap-2.5">
                  {member.roles.map((role, roleIndex) => (
                    <div
                      key={roleIndex}
                      className="w-20 h-8.5 bg-gray-400 rounded-[5px] text-sm text-white flex items-center justify-center"
                    >
                      {role}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[30px] gap-[42px] flex">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`h-[21px] mb-4 flex text-lg items-center px-4 rounded-lg cursor-pointer ${selectedTask === task.id ? 'text-secondary-900 line-clamp-2' : ''}`} //선택된 항목은 밑줄이 생기도록 변경
              onClick={() => setSelectedTask(task.id)}
            >
              {task.title}
            </div>
          ))}
        </div>

        <div className="flex-1 min-h-0 flex flex-col">
          {/* 선택된 task에 따른 컴포넌트가 들어가는 부분 */}
          {/* 각 컴포넌트 퍼블리싱 하실 때 여기에 연결 해주세요!*/}
          {selectedTask === '1' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen(true)}
                  className="px-3 py-2 bg-orange-500 text-white rounded-md text-sm"
                >
                  날짜 선택
                </button>
                <span className="text-sm text-gray-600">
                  선택된 날짜: {selectedDate.toLocaleDateString()}
                </span>
              </div>
              {isCalendarOpen && (
                <div className="relative">
                  <Calender
                    prev={selectedDate}
                    next={(date) => {
                      setSelectedDate(date);
                      setIsCalendarOpen(false);
                    }}
                    onClose={() => setIsCalendarOpen(false)}
                  />
                </div>
              )}
            </div>
          )}
          {selectedTask === '2' && (
            <div className="flex-1 min-h-0 flex flex-col">
              <DocumentPage />
            </div>
          )}
          {selectedTask === '3' && <div>회의록 컴포넌트</div>}
          {selectedTask === '4' && <div>완료한 업무 컴포넌트</div>}
          {selectedTask === '5' && <div>AI 회고 컴포넌트</div>}
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
