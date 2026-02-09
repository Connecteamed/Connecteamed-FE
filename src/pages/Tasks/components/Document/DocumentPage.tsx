import { useParams } from 'react-router-dom';

import DeleteModal from '@components/DeleteModal';

import DocumentPageContent from './components/DocumentPageContent';
import { useDocumentPageController } from './hooks/useDocumentPageController';

const DocumentPage = () => {
  const { teamId } = useParams();
  const projectId = teamId ? Number(teamId) : undefined;

  const controller = useDocumentPageController(projectId);
  const {
    fileInputRef,
    documents,
    isEmpty,
    view,
    editingTextId,
    editingDocTitle,
    editingDocContent,
    isDeleteOpen,
    onPickFiles,
    triggerPickAnyFile,
    triggerPickFileByType,
    openTextCreate,
    openTextEdit,
    onRequestDelete,
    download,
    handleSaveText,
    goList,
    closeDeleteModal,
    confirmDelete,
  } = controller;

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        hidden
        multiple
        onChange={(e) => onPickFiles(e)} // AnyFile 선택 시
      />

      <div className="flex min-h-0 flex-1 flex-col">
        <DocumentPageContent
          view={view}
          isEmpty={isEmpty}
          documents={documents}
          editingTextId={editingTextId}
          editingTitle={editingDocTitle}
          editingContent={editingDocContent}
          onBackToList={goList}
          onSaveText={handleSaveText}
          onPickAnyFile={triggerPickAnyFile}
          onPickFileByType={triggerPickFileByType}
          onClickText={openTextCreate}
          onEditText={openTextEdit}
          onDelete={onRequestDelete}
          onDownload={download}
          onPickFiles={onPickFiles}
        />
      </div>

      <DeleteModal
        isOpen={isDeleteOpen}
        title="문서 삭제"
        description="해당 문서를 삭제할까요?"
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default DocumentPage;
