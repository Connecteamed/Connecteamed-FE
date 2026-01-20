import React from 'react';
import type { DocumentItem, ViewMode } from '../types/document';

import DocumentList from './DocumentList/DocumentList';
import EmptyDocument from './EmptyDocument';
import TextEditor from './TextEditor';

type PickFileType = 'pdf' | 'docx' | 'image';

type Props = {
  view: ViewMode;
  isEmpty: boolean;
  documents: DocumentItem[];

  editingTextId: string | null;
  editingDoc: DocumentItem | null;

  onBackToList: () => void;
  onSaveText: (payload: { title: string; content: string }) => void;

  onPickAnyFile: () => void;
  onPickFileByType: (type: PickFileType) => void;
  onClickText: () => void;
  onEditText: (id: string) => void;

  onDelete: (id: string) => void;
  onDownload: (doc: DocumentItem) => void;
};

const DocumentPageContent: React.FC<Props> = ({
  view,
  isEmpty,
  documents,
  editingTextId,
  editingDoc,
  onBackToList,
  onSaveText,
  onPickAnyFile,
  onPickFileByType,
  onClickText,
  onEditText,
  onDelete,
  onDownload,
}) => {
  if (view === 'TEXT_EDITOR') {
    return (
      <TextEditor
        onBack={onBackToList}
        initialTitle={editingDoc?.name ?? ''}
        initialContent={editingDoc?.content ?? ''}
        submitLabel={editingTextId ? '수정하기' : '저장하기'}
        onSave={onSaveText}
      />
    );
  }

  if (isEmpty) {
    return (
      <div className="flex-1 min-h-0 flex">
        <EmptyDocument onAdd={onPickAnyFile} />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-auto">
      <DocumentList
        documents={documents}
        onDelete={onDelete}
        onDownload={onDownload}
        onPickFile={onPickFileByType}
        onClickText={onClickText}
        onEditText={onEditText}
      />
    </div>
  );
};

export default DocumentPageContent;
