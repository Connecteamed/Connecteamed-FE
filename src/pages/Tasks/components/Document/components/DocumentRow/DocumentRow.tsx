import { type DocumentItem } from '../../types/document';
import DocumentPreviewModal from '../DocumentPreviewModal';
import DocumentRowActions from './DocumentRowActions';
import useDocumentPreview from '../../hooks/useDocumentPreview';

type Props = {
  doc: DocumentItem;
  onDelete: (id: string) => void;
  onDownload: (doc: DocumentItem) => void;
  onEditText: (id: string) => void;
};

const DocumentRow = ({ doc, onDelete, onDownload, onEditText }: Props) => {
  const { isPreviewOpen, openPreview, closePreview } = useDocumentPreview();

  return (
    <>
      <div className="self-stretch h-14 p-3.5 bg-white border-l border-r border-b border-gray-200 flex items-center">
        <div className="w-full inline-flex justify-between items-center">
          <button
            type="button"
            onClick={openPreview}
            className="w-44 overflow-hidden whitespace-nowrap text-ellipsis text-neutral-600 text-xs font-medium font-['Roboto'] text-left hover:underline"
            title={doc.name}
          >
            {doc.name}
          </button>

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

            <DocumentRowActions
              doc={doc}
              onDelete={onDelete}
              onDownload={onDownload}
              onEditText={onEditText}
            />
          </div>
        </div>
      </div>

      <DocumentPreviewModal isOpen={isPreviewOpen} onClose={closePreview} />
    </>
  );
};

export default DocumentRow;
