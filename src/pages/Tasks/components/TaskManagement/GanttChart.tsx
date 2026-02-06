// 간단한 정적 간트 차트 컴포넌트 (피그마 시안 기반)
const GanttChart = () => {
  return (
    <div className="w-full self-stretch inline-flex flex-col justify-start items-start">
      <div className="self-stretch inline-flex justify-start items-center">
        <div className="w-44 h-12 p-3.5 bg-slate-100 outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-center items-center gap-2.5">
          <div className="flex-1 justify-center text-black text-sm font-medium">업무명</div>
        </div>
        <div className="w-[810px] h-12 px-3.5 py-2 bg-white border-r border-t border-b border-gray-200 inline-flex flex-col justify-start items-start gap-2.5">
          <div className="w-[780px] flex flex-col justify-start items-start">
            <div className="inline-flex justify-start items-center gap-20">
              <div className="w-32 h-4 justify-center text-black text-[10px] font-normal">2025년 11월</div>
              <div className="w-32 h-4 justify-center text-black text-[10px] font-normal">12월</div>
            </div>
            <div className="w-[780px] inline-flex justify-start items-center gap-3">
              {[...Array(33)].map((_, idx) => {
                const days = [
                  "22",
                  "23",
                  "24",
                  "25",
                  "26",
                  "27",
                  "28",
                  "29",
                  "30",
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "10",
                  "11",
                  "12",
                  "13",
                  "14",
                  "15",
                  "16",
                  "17",
                  "18",
                  "19",
                  "20",
                  "21",
                  "22",
                  "23",
                  "24",
                ];
                const day = days[idx];
                return (
                  <div
                    key={day + idx}
                    className="w-3 h-4 text-center justify-center text-neutral-500 text-[10px] font-normal"
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="self-stretch inline-flex justify-start items-center">
        <div className="w-44 h-12 px-3.5 py-2 bg-white border-l border-r border-b border-gray-200 flex justify-center items-center gap-2.5">
          <div className="flex-1 justify-center text-neutral-600 text-xs font-medium">와이어프레임 제작</div>
        </div>
        <div className="w-[810px] h-12 py-3.5 bg-white border-r border-b border-gray-200 inline-flex flex-col justify-start items-start gap-2.5">
          <div className="w-20 h-4 bg-orange-100 rounded-tr-[5px] rounded-br-[5px]" />
        </div>
      </div>

      <div className="self-stretch inline-flex justify-start items-center">
        <div className="w-44 h-12 px-3.5 py-2 bg-white border-l border-r border-b border-gray-200 flex justify-center items-center gap-2.5">
          <div className="flex-1 justify-center text-neutral-600 text-xs font-medium">API 명세서 작성</div>
        </div>
        <div className="w-[810px] h-12 py-3.5 bg-white border-r border-b border-gray-200 inline-flex flex-col justify-start items-start gap-2.5">
          <div className="w-56 h-4 py-0.5 bg-orange-100 rounded-tr-[5px] rounded-br-[5px] flex flex-col justify-start items-start gap-2.5">
            <div className="w-32 h-3.5 bg-orange-500 rounded-tr-[5px] rounded-br-[5px]" />
          </div>
        </div>
      </div>

      <div className="self-stretch inline-flex justify-start items-center">
        <div className="w-44 h-12 px-3.5 py-2 bg-white border-l border-r border-b border-gray-200 flex justify-center items-center gap-2.5">
          <div className="flex-1 justify-center text-neutral-600 text-xs font-medium">ERD 작성</div>
        </div>
        <div className="w-[810px] h-12 py-3.5 bg-white border-r border-b border-gray-200 inline-flex flex-col justify-start items-start gap-2.5">
          <div className="w-56 h-4 py-0.5 bg-orange-100 rounded-tr-[5px] rounded-br-[5px] flex flex-col justify-start items-start gap-2.5">
            <div className="w-32 h-3.5 bg-orange-500 rounded-tr-[5px] rounded-br-[5px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
