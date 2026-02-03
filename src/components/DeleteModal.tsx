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
      <div className="flex h-64 w-96 flex-col justify-between overflow-hidden rounded-xl bg-white p-6">
        <h2 className="pt-4 text-center text-3xl font-bold">{title}</h2>
        <div className="text-center text-base font-normal">{description}</div>

        <div className="my-2 flex gap-3">
          <button
            onClick={onClose}
            className="bg-neutral-30 flex-1 rounded-md py-3 text-center text-base font-medium"
          >
            아니요
          </button>
          <button
            onClick={onConfirm}
            className="bg-secondary-500 flex-1 rounded-md py-3 text-center text-base font-medium text-white"
          >
            예
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
