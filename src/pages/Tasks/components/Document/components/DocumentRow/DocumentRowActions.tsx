import downloadIcon from '@assets/icon-download.svg';
import { type DocumentItem } from '../../types/document';

type Props = {
  doc: DocumentItem;
  onDelete: (id: string) => void;
  onDownload: (doc: DocumentItem) => void;
  onEditText: (id: string) => void;
};

const DocumentRowActions = ({ doc, onDelete, onDownload, onEditText }: Props) => {
  const isText = doc.ext === '텍스트';

  return (
    <div className="flex justify-start items-center gap-6">
      {isText ? (
        <button
          type="button"
          onClick={() => onEditText(doc.id)}
          className="text-center text-neutral-400 text-xs font-medium font-['Roboto']"
        >
          수정
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onDownload(doc)}
          className="w-6 h-6 flex items-center justify-center"
          aria-label="다운로드"
          title="다운로드"
        >
          <img src={downloadIcon} alt="다운로드" className="w-6 h-6" draggable={false} />
        </button>
      )}

      <button
        type="button"
        onClick={() => onDelete(doc.id)}
        className="text-center text-neutral-400 text-xs font-medium font-['Roboto']"
      >
        삭제
      </button>
    </div>
  );
};

export default DocumentRowActions;
