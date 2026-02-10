import useDocumentPreview from '../../hooks/useDocumentPreview';
import { type DocumentItem } from '../../types/document';
import DocumentPreviewModal from '../DocumentPreviewModal';
import DocumentRowActions from './DocumentRowActions';

type Props = {
  doc: DocumentItem;
  onDelete: (id: number) => void;
  onDownload: (doc: DocumentItem) => void;
  onEditText: (id: number) => void;
};

const DocumentRow = ({ doc, onDelete, onDownload, onEditText }: Props) => {
  const { isPreviewOpen, openPreview, closePreview } = useDocumentPreview();

  return (
    <>
      <div className="flex h-14 items-center self-stretch border-r border-b border-l border-gray-200 bg-white p-3.5">
        <div className="inline-flex w-full items-center justify-between">
          <button
            type="button"
            onClick={openPreview}
            className="w-44 overflow-hidden text-left font-['Roboto'] text-xs font-medium text-ellipsis whitespace-nowrap text-neutral-600 hover:underline"
            title={doc.name}
          >
            {doc.name}
          </button>

          <div className="flex items-center justify-start gap-7">
            <div className="flex items-center justify-start gap-14">
              <div className="w-12 font-['Roboto'] text-xs font-medium text-neutral-600">
                {doc.ext}
              </div>
              <div className="w-12 font-['Roboto'] text-xs font-medium text-neutral-600">
                {doc.uploader}
              </div>
              <div className="w-16 font-['Roboto'] text-xs font-medium text-neutral-600">
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
      <DocumentPreviewModal
        isOpen={isPreviewOpen}
        onClose={closePreview}
        documentId={doc.id}
        title={doc.name}
      />{' '}
    </>
  );
};

export default DocumentRow;
