import React from 'react';

import { type DocumentItem } from '../../types/document';
import DocumentListHeader from '../DocumentList/DocumentListHeader';
import DocumentRow from '../DocumentRow/DocumentRow';
import DocumentAddDropdown from './DocumentAddDropdown';

type Props = {
  documents: DocumentItem[];
  onDelete: (id: number) => void;
  onDownload: (doc: DocumentItem) => void;
  onPickFile: (type: 'pdf' | 'docx' | 'image') => void;
  onClickText: () => void;
  onEditText: (id: number) => void;
  onPickFiles: (
    e: React.ChangeEvent<HTMLInputElement>,
    forcedType?: 'pdf' | 'docx' | 'image',
  ) => void;
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
    <div className="flex w-full flex-col items-start justify-start gap-7">
      <div className="flex flex-col items-start justify-start self-stretch">
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

      <DocumentAddDropdown onPickFile={(type) => onPickFile(type)} onClickText={onClickText} />
    </div>
  );
};

export default DocumentList;
