import documentAddIcon from '@assets/icon-document-add-orange.svg';

import DocumentAddDropdown from './DocumentList/DocumentAddDropdown';

type Props = {
  onPickFile: (type: 'pdf' | 'docx' | 'image') => void;
  onClickText: () => void;
};

const EmptyDocument = ({ onPickFile, onClickText }: Props) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-20">
      <div className="mb-6 flex h-48 w-48 items-center justify-center rounded-full bg-orange-100">
        <img src={documentAddIcon} alt="문서 추가 아이콘" className="h-32 w-32" />
      </div>

      <div className="mb-4 text-2xl font-medium">아직 등록된 문서가 없어요</div>

      <div className="mb-6 h-10 justify-center self-stretch text-center font-['Roboto'] text-sm font-normal text-gray-500">
        팀원들과 필요한 문서를 한 곳에서
        <br />
        관리할 수 있어요
      </div>

      {/* ✅ Empty 전용: 중앙정렬 + 버튼만 살짝 크게 */}
      <DocumentAddDropdown
        onPickFile={onPickFile}
        onClickText={onClickText}
        containerClassName="flex justify-center self-stretch"
        triggerClassName="h-12 w-auto rounded-xl px-10 py-4" // 버튼 크기 ↑ (원하면 px-10로)
        labelClassName="text-sm" // 글자 크기 ↑
      />
    </div>
  );
};

export default EmptyDocument;
