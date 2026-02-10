import downloadIcon from '@assets/icon-download.svg';

import { type DocumentItem } from '../../types/document';

type Props = {
  doc: DocumentItem;
  onDelete: (id: number) => void;
  onDownload: (doc: DocumentItem) => void;
  onEditText: (id: number) => void;
};

const DocumentRowActions = ({ doc, onDelete, onDownload, onEditText }: Props) => {
  const isText = doc.ext === '텍스트';
  const disabled = !doc.canEdit;

  return (
    <div className="flex items-center justify-start gap-6">
      {isText ? (
        <button
          type="button"
          onClick={() => onEditText(doc.id)}
          disabled={disabled}
          className="text-center font-['Roboto'] text-xs font-medium text-neutral-400 disabled:opacity-40"
        >
          수정
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onDownload(doc)}
          className="flex h-6 w-6 items-center justify-center"
          aria-label="다운로드"
          title="다운로드"
        >
          <img src={downloadIcon} alt="다운로드" className="h-6 w-6" draggable={false} />
        </button>
      )}

      <button
        type="button"
        onClick={() => onDelete(doc.id)}
        className="text-center font-['Roboto'] text-xs font-medium text-neutral-400 disabled:opacity-40"
      >
        삭제
      </button>
    </div>
  );
};

export default DocumentRowActions;
