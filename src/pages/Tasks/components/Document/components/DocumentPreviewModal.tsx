import Modal from '@/components/Modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const DocumentPreviewModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative w-[650px] h-[750px] px-14 py-14 bg-white rounded-[20px] inline-flex justify-start items-center gap-2.5">
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          title="닫기"
          className="absolute right-6 top-6 w-8 h-8 flex items-center justify-center"
        >
          <span className="text-2xl leading-none text-neutral-700">×</span>
        </button>

        <div className="w-[530px] h-[632px] px-20 py-52 bg-slate-100 inline-flex flex-col justify-center items-center gap-2.5">
          <div className="text-center justify-center text-black text-xl font-bold font-['Roboto']">
            모달 내에
            <br />
            문서 내용 표시
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DocumentPreviewModal;
