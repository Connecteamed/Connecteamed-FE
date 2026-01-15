import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Input from '@/components/Input';
import Calender from '@/components/calender';

import AttendeeSelector from './components/AttendeeSelector';
import backIcon from '/src/assets/icon-back-black.svg';

interface Agenda {
  title: string;
  content: string;
}

const MinutesPage = () => {
  const navigate = useNavigate();

  // 상태 관리
  const [title, setTitle] = useState('');

  // 참석자 관련 상태
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);

  // 날짜 & 달력 상태
  const [dateStr, setDateStr] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // 안건 상태
  const [agendas, setAgendas] = useState<Agenda[]>([{ title: '', content: '' }]);

  const handleAddAgenda = () => {
    setAgendas([...agendas, { title: '', content: '' }]);
  };

  const handleSave = () => {
    // NOTE: 회의록 저장 API 호출 로직 필요
    const newMeeting = {
      id: Date.now(), // 임시 ID
      title: title,
      members: selectedAttendees.join(', '),
      date: dateStr,
    };

    // 저장이 성공했다고 가정하고, teamId '1'의 태스크 페이지로 이동하며 새 회의록 데이터 전달
    navigate(`/team/1`, { state: { selectedTask: '3', newMeeting: newMeeting } });
  };

  const handleAgendaChange = (index: number, field: keyof Agenda, value: string) => {
    const newAgendas = [...agendas];
    newAgendas[index][field] = value;
    setAgendas(newAgendas);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    setDateStr(formattedDate);
    setIsCalendarOpen(false);
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-white px-11 py-14">
      <div className="mb-8 flex w-full justify-start">
        <button onClick={() => navigate(-1)} className="py-2 pr-4">
          <img className="w-4" src={backIcon} alt="뒤로가기" />
        </button>
      </div>

      {/* 폼 입력 영역 */}
      <div className="w-full space-y-6">
        <div className="space-y-3">
          <label className="block text-lg font-medium">회의명</label>
          <Input
            placeholder="회의명을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <AttendeeSelector
          selectedAttendees={selectedAttendees}
          onSelectionChange={setSelectedAttendees}
        />

        <div className="relative space-y-3">
          <label className="block text-lg font-medium">회의 날짜</label>

          <div onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="cursor-pointer">
            <Input
              type="text"
              placeholder="회의 날짜를 선택하세요"
              value={dateStr}
              readOnly
              className="cursor-pointer bg-white caret-transparent"
            />
          </div>

          {isCalendarOpen && (
            <div className="absolute top-21.25 left-0 z-20">
              <Calender
                prev={selectedDate}
                next={handleDateSelect}
                onClose={() => setIsCalendarOpen(false)}
              />
            </div>
          )}
        </div>

        {agendas.map((agenda, index) => (
          <div key={index} className="space-y-3 pt-2">
            <label className="block text-lg font-medium">안건{index + 1}</label>

            <Input
              placeholder="안건을 입력하세요"
              value={agenda.title}
              onChange={(e) => handleAgendaChange(index, 'title', e.target.value)}
            />

            <textarea
              className="placeholder:text-neutral-60 h-40 w-full resize-none rounded-xl bg-white px-3.5 py-3 text-lg font-medium outline-1 -outline-offset-1 outline-neutral-50"
              placeholder="내용을 입력하세요"
              value={agenda.content}
              onChange={(e) => handleAgendaChange(index, 'content', e.target.value)}
            />
          </div>
        ))}

        <div className="mt-8 flex flex-col items-center gap-12">
          <button
            onClick={handleAddAgenda}
            className="h-14 w-96 rounded-md bg-neutral-50 text-base font-bold text-white"
          >
            안건 추가하기
          </button>

          <button
            onClick={handleSave}
            className="bg-primary-500 h-14 w-96 rounded-md text-base font-bold text-white"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MinutesPage;
