import type { DocumentItem, ViewMode } from '../types/document';
import DocumentList from './DocumentList';
import EmptyDocument from './EmptyDocument';
import TextEditor from './TextEditor';

type PickFileType = 'pdf' | 'docx' | 'image';

type Props = {
  view: ViewMode;
  isEmpty: boolean;
  documents: DocumentItem[];

  editingTextId: number | null;
  editingTitle: string;
  editingContent: string;

  onBackToList: () => void;
  onSaveText: (payload: { title: string; content: string }) => void;

  onPickFileByType: (type: PickFileType) => void;
  onClickText: () => void;
  onEditText: (id: number) => void;

  onDelete: (id: number) => void;
  onDownload: (doc: DocumentItem) => void;
};

const DocumentPageContent = ({
  view,
  isEmpty,
  documents,
  editingTextId,
  editingTitle,
  editingContent,
  onBackToList,
  onSaveText,
  onPickFileByType,
  onClickText,
  onEditText,
  onDelete,
  onDownload,
}: Props) => {
  if (view === 'TEXT_EDITOR') {
    return (
      <TextEditor
        onBack={onBackToList}
        initialTitle={editingTitle}
        initialContent={editingContent}
        submitLabel={editingTextId ? '수정하기' : '저장하기'}
        onSave={onSaveText}
      />
    );
  }

  if (isEmpty) {
    return (
      <div className="flex min-h-0 flex-1">
        <EmptyDocument onPickFile={onPickFileByType} onClickText={onClickText} />
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-auto">
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
