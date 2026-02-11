import { type DocumentItem } from '../types/document';
import DocumentAddDropdown from './DocumentAddDropdown';
import DocumentRow from './DocumentRow';

type Props = {
  documents: DocumentItem[];
  onDelete: (id: number) => void;
  onDownload: (doc: DocumentItem) => void;
  onPickFile: (type: 'pdf' | 'docx' | 'image') => void;
  onClickText: () => void;
  onEditText: (id: number) => void;
};

const DocumentList = ({
  documents,
  onDelete,
  onDownload,
  onPickFile,
  onClickText,
  onEditText,
}: Props) => {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-7">
      <div className="flex flex-col items-start justify-start self-stretch">
        {/* Header */}
        <div className="flex h-12 items-center self-stretch border-t border-r border-l border-gray-200 bg-slate-100 p-3.5">
          <div className="inline-flex w-full items-center justify-between">
            <div className="w-44 font-['Inter'] text-sm font-medium text-black">문서명</div>

            <div className="flex items-center justify-start gap-7">
              <div className="flex items-center justify-start gap-14">
                <div className="w-12 font-['Inter'] text-sm font-medium whitespace-nowrap text-black">
                  파일형식
                </div>

                <div className="w-12 font-['Inter'] text-sm font-medium whitespace-nowrap text-black">
                  올린 사람
                </div>

                <div className="w-16 font-['Inter'] text-sm font-medium whitespace-nowrap text-black">
                  올린 날짜
                </div>
              </div>

              <div className="flex items-center justify-start gap-6">
                <div className="h-6 w-6" />
                <div className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {documents.map((doc) => (
          <DocumentRow
            key={doc.id}
            doc={doc}
            onDelete={onDelete}
            onDownload={onDownload}
            onEditText={onEditText}
          />
        ))}
      </div>

      <DocumentAddDropdown
        onPickFile={onPickFile}
        onClickText={onClickText}
        triggerClassName="w-24 h-8"
        labelClassName="text-xs"
      />
    </div>
  );
};

export default DocumentList;
