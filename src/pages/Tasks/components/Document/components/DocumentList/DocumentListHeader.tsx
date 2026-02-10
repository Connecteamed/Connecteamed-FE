const DocumentListHeader = () => {
  return (
    <div className="self-stretch h-12 p-3.5 bg-slate-100 border-l border-r border-t border-gray-200 flex items-center">
      <div className="w-full inline-flex justify-between items-center">
        <div className="w-44 text-black text-sm font-medium font-['Inter']">문서명</div>

        <div className="flex justify-start items-center gap-7">
          <div className="flex justify-start items-center gap-14">
            <div className="w-12 text-black text-sm font-medium font-['Inter'] whitespace-nowrap">
              파일형식
            </div>

            <div className="w-12 text-black text-sm font-medium font-['Inter'] whitespace-nowrap">
              올린 사람
            </div>

            <div className="w-16 text-black text-sm font-medium font-['Inter'] whitespace-nowrap">
              올린 날짜
            </div>
          </div>

          {/* Row 오른쪽 액션 영역(다운로드/삭제) 자리 맞추기용 스페이서 */}
          <div className="flex justify-start items-center gap-6">
            <div className="w-6 h-6" />
            <div className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentListHeader;
