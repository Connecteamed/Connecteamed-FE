import { useState } from 'react';

import Dropdown from '@/components/Dropdown';
import Calender from '@/components/calender';

import usePostTask from '@/hooks/TaskPage/Mutate/usePostTask';

import AssigneeDropdown from './AssigneeDropdown';

const formatInputDate = (date: Date | null) => (date ? date.toISOString().slice(0, 10) : '');
const toISOStringOrEmpty = (date: Date | null) => (date ? date.toISOString() : '');

const AddTaskModal = ({ projectId }: { projectId: number }) => {
  const [startdateCalendarOpen, setStartdateCalendarOpen] = useState(false);
  const [enddateCalendarOpen, setEnddateCalendarOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [title, setTitle] = useState('');
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<number[]>([]);
  const [selectedAssigneeNames, setSelectedAssigneeNames] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const today = new Date();

  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);

  const { mutate: postTask, isPending } = usePostTask(projectId);

  const submitAddTask = () => {
    if (!title.trim() || !content.trim() || !startDate || !endDate) return;

    postTask({
      name: title.trim(),
      content: content.trim(),
      startDate: toISOStringOrEmpty(startDate),
      dueDate: toISOStringOrEmpty(endDate),
      assigneeProjectMemberIds: selectedAssigneeIds,
    });
  };

  return (
    <div className="flex h-[700px] w-[600px] items-center justify-start gap-2.5 rounded-[20px] bg-white px-10 py-12">
      <div className="inline-flex w-[520px] flex-col items-start justify-start gap-12">
        <div className="flex w-full flex-col items-start justify-start gap-4">
          <div className="flex w-full flex-col items-start justify-start gap-3">
            <div className="h-7 w-full justify-center text-base leading-4 font-medium text-black">
              업무명
            </div>
            <input
              className="h-12 w-full rounded-[10px] border border-gray-300 bg-white px-3.5 py-1.5"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="relative flex w-full flex-col items-start justify-start gap-3">
            <div className="h-7 w-full justify-center text-base leading-4 font-medium text-black">
              담당자
            </div>
            <input
              className="h-12 w-full cursor-pointer rounded-[10px] border border-gray-300 bg-white px-3.5 py-1.5"
              type="text"
              value={selectedAssigneeNames.join(', ')}
              readOnly
              onClick={() => setIsAssigneeDropdownOpen((prev) => !prev)}
            />
            {isAssigneeDropdownOpen && (
              <Dropdown
                isOpen={isAssigneeDropdownOpen}
                onClose={() => setIsAssigneeDropdownOpen(false)}
                usePortal={false}
              >
                <div className="absolute top-full left-0 z-20 mt-2">
                  <AssigneeDropdown
                    projectId={projectId}
                    taskId=""
                    selectedAssigneeIds={selectedAssigneeIds}
                    disablePatch
                    onClose={() => setIsAssigneeDropdownOpen(false)}
                    onUpdate={(assigneeIds, assigneeNames) => {
                      setSelectedAssigneeIds(assigneeIds);
                      setSelectedAssigneeNames(assigneeNames);
                    }}
                  />
                </div>
              </Dropdown>
            )}
          </div>

          <div className="inline-flex w-full items-center justify-start gap-14">
            <div className="relative inline-flex w-56 flex-col items-start justify-start gap-3">
              <div className="h-7 w-full justify-center text-base leading-4 font-medium text-black">
                시작일
              </div>
              <div
                className="h-12 w-full rounded-[10px] border border-gray-300 bg-white px-3.5 py-1.5"
                onClick={() => setStartdateCalendarOpen(!startdateCalendarOpen)}
              >
                <input
                  className="w-full"
                  type="text"
                  value={formatInputDate(startDate)}
                  placeholder=""
                  readOnly
                  autoComplete="off"
                />
              </div>
              {startdateCalendarOpen && (
                <div className="absolute top-full left-0 z-20 mt-2">
                  <Calender
                    prev={startDate ?? today}
                    next={(date) => {
                      setStartDate(date);
                      setStartdateCalendarOpen(false);
                    }}
                    onClose={() => setStartdateCalendarOpen(false)}
                  />
                </div>
              )}
            </div>

            <div className="relative inline-flex w-56 flex-col items-start justify-start gap-3">
              <div className="h-7 w-full justify-center text-base leading-4 font-medium text-black">
                마감일
              </div>
              <div
                className="h-12 w-full rounded-[10px] border border-gray-300 bg-white px-3.5 py-1.5"
                onClick={() => setEnddateCalendarOpen(!enddateCalendarOpen)}
              >
                <input
                  className="w-full"
                  type="text"
                  value={formatInputDate(endDate)}
                  placeholder=""
                  readOnly
                  autoComplete="off"
                />
              </div>
              {enddateCalendarOpen && (
                <div className="absolute top-full left-0 z-20 mt-2">
                  <Calender
                    prev={endDate ?? today}
                    next={(date) => {
                      setEndDate(date);
                      setEnddateCalendarOpen(false);
                    }}
                    onClose={() => setEnddateCalendarOpen(false)}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex w-full flex-col items-start justify-start gap-3">
            <div className="h-7 w-full justify-center text-base leading-4 font-medium text-black">
              업무내용
            </div>
            <textarea
              className="h-32 w-full rounded-[10px] border border-gray-300 bg-white p-3.5"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={submitAddTask}
          disabled={isPending || !title.trim() || !content.trim() || !startDate || !endDate}
          className={`inline-flex h-14 w-full items-center justify-center rounded-[5px] px-24 py-4 text-lg font-medium text-white ${
            isPending || !title.trim() || !content.trim() || !startDate || !endDate
              ? 'cursor-not-allowed bg-gray-300'
              : 'bg-orange-500'
          }`}
        >
          {isPending ? '생성 중...' : '생성하기'}
        </button>
      </div>
    </div>
  );
};

export default AddTaskModal;
