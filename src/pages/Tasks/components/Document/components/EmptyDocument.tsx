import documentAddIcon from '@assets/icon-document-add-orange.svg';

type Props = {
  onAdd: () => void;
};

const EmptyDocument = ({ onAdd }: Props) => {
  return (
    <section className="w-full flex-1 min-h-0 flex flex-col items-center justify-center translate-y-[-8px]">
      <div className="w-48 h-48 bg-orange-100 rounded-full flex items-center justify-center">
        <img src={documentAddIcon} className="w-30 h-30" />
      </div>

      <p className="mt-6 text-2xl font-medium">아직 등록된 문서가 없어요</p>

      <p className="mt-2 text-black text-sm text-center leading-5 font-normal font-['Roboto']">
        팀원들과 필요한 문서를 한곳에서 <br /> 관리할 수 있어요
      </p>

      <button onClick={onAdd} className="mt-6 w-36 h-12 bg-orange-500 text-white rounded-lg">
        문서 추가
      </button>
    </section>
  );
};

export default EmptyDocument;
