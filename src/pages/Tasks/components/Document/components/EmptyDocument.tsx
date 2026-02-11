import documentAddIcon from '@assets/icon-document-add-orange.svg';

import DocumentAddDropdown from './DocumentAddDropdown';

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

      <DocumentAddDropdown
        onPickFile={onPickFile}
        onClickText={onClickText}
        containerClassName="flex justify-center self-stretch"
        triggerClassName="w-36 h-12 px-2 py-[5px] rounded-[10px]"
        labelClassName="text-sm font-['Inter']"
      />
    </div>
  );
};

export default EmptyDocument;
