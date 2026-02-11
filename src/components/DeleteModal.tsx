import Modal from '@/components/Modal';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = '### 삭제',
  description = '해당 ###을 삭제할까요?',
}: DeleteModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex h-[152px] w-[250px] flex-col justify-between overflow-hidden rounded-xl bg-white p-6 md:h-64 md:w-96">
        <h2 className="text-center text-[18px] font-medium md:pt-4 md:text-3xl md:font-bold">
          {title}
        </h2>
        <div className="text-center text-[12px] font-normal md:text-base">{description}</div>

        <div className="my-2 flex gap-3">
          <button
            onClick={onClose}
            className="bg-neutral-30 h-6 flex-1 rounded-[5px] text-center text-[10px] md:h-12 md:rounded-md md:text-base md:font-medium"
          >
            아니요
          </button>
          <button
            onClick={onConfirm}
            className="bg-secondary-500 h-6 flex-1 rounded-[5px] text-center text-[10px] text-white md:h-12 md:rounded-md md:text-base md:font-medium"
          >
            예
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
