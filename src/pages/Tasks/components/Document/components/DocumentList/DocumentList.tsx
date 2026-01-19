import React from 'react';
import { type DocumentItem } from '../../types/document';
import DocumentRow from '../DocumentRow/DocumentRow';
import DocumentListHeader from '../DocumentList/DocumentListHeader';
import DocumentAddDropdown from '../DocumentList/DocumentAppDropdown';

type Props = {
  documents: DocumentItem[];
  onDelete: (id: string) => void;
  onDownload: (doc: DocumentItem) => void;
  onPickFile: () => void;
  onClickText: () => void;
  onEditText: (id: string) => void;
};

const DocumentList: React.FC<Props> = ({
  documents,
  onDelete,
  onDownload,
  onPickFile,
  onClickText,
  onEditText,
}) => {
  return (
    <div className="w-full flex flex-col justify-start items-start gap-7">
      <div className="self-stretch flex flex-col justify-start items-start">
        <DocumentListHeader />

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

      <DocumentAddDropdown onPickFile={onPickFile} onClickText={onClickText} />
    </div>
  );
};

export default DocumentList;
