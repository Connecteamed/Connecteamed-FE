import downloadIcon from '@assets/icon-download.svg';
import { type DocumentItem } from '../types/document';

type Props = {
  doc: DocumentItem;
  onDelete: (id: string) => void;
  onDownload: (doc: DocumentItem) => void;
  onEditText: (id: string) => void;
};

const DocumentRow = ({ doc, onDelete, onDownload, onEditText }: Props) => {
  const isText = doc.ext === '텍스트';

  return (
    <div className="self-stretch h-14 p-3.5 bg-white border-l border-r border-b border-gray-200 flex items-center">
      <div className="w-full inline-flex justify-between items-center">
        <div className="w-44 text-neutral-600 text-xs font-medium font-['Roboto']">{doc.name}</div>

        <div className="flex justify-start items-center gap-7">
          <div className="flex justify-start items-center gap-14">
            <div className="w-12 text-neutral-600 text-xs font-medium font-['Roboto']">
              {doc.ext}
            </div>
            <div className="w-12 text-neutral-600 text-xs font-medium font-['Roboto']">
              {doc.uploader}
            </div>
            <div className="w-16 text-neutral-600 text-xs font-medium font-['Roboto']">
              {doc.uploadedAt}
            </div>
          </div>

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
                <img src={downloadIcon} alt="다운로드" className="w-24 h-24" draggable={false} />
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
        </div>
      </div>
    </div>
  );
};

export default DocumentRow;
