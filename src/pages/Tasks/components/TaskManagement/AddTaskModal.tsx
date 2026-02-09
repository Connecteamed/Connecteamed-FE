import { useState } from 'react';

import Calender from '@/components/calender';

const formatInputDate = (date: Date | null) => (date ? date.toISOString().slice(0, 10) : '');

const AddTaskModal = () => {
  const [startdateCalendarOpen, setStartdateCalendarOpen] = useState(false);
  const [enddateCalendarOpen, setEnddateCalendarOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const today = new Date();

  return (
    <div className="flex h-175 w-150 flex-col items-center justify-center rounded-[20px] bg-white px-10 py-12.5">
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="flex flex-col gap-3">
          <div className="h-7.5 w-full leading-4 text-base font-medium">업무명</div>
          <input className="h-12 w-130 bg-slate-100 px-4 py-2.5" />
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-7.5 w-full leading-4 font-medium">담당자</div>
          <input className="h-12 w-130 bg-slate-100 px-4 py-2.5" type="text" />
        </div>
        <div className="flex gap-15">
          <div className="flex w-[230px] flex-col">
            <div className="h-7.5 w-full leading-4">시작일</div>
            <div
              className="h-12 bg-slate-100 px-4 py-2.5"
              onClick={() => setStartdateCalendarOpen(!startdateCalendarOpen)}
            >
              <input type="date" value={formatInputDate(startDate)} readOnly />
            </div>
            {startdateCalendarOpen && (
              <Calender
                prev={startDate ?? today}
                next={(date) => {
                  setStartDate(date);
                  setStartdateCalendarOpen(false);
                }}
                onClose={() => setStartdateCalendarOpen(false)}
              />
            )}
          </div>
          <div className="flex w-[230px] flex-col">
            <div className="h-7.5 w-[230px] leading-4">마감일</div>
            <div
              className="h-12 bg-slate-100 px-4 py-2.5"
              onClick={() => setEnddateCalendarOpen(!enddateCalendarOpen)}
            >
              <input type="date" value={formatInputDate(endDate)} readOnly />
            </div>
            {enddateCalendarOpen && (
              <Calender
                prev={endDate ?? today}
                next={(date) => {
                  setEndDate(date);
                  setEnddateCalendarOpen(false);
                }}
                onClose={() => setEnddateCalendarOpen(false)}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="h-7.5 w-full leading-4">업무내용</div>
          <textarea className="h-32 w-130 bg-slate-100 px-4 py-2.5" />
        </div>
      </div>
      <div className="mt-13 flex h-14 w-130 flex-col items-center justify-center rounded-[5px] bg-gray-300 px-[101px] py-4 text-white">
        생성하기
      </div>
    </div>
  );
};

export default AddTaskModal;
