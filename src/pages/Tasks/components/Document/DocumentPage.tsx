import DocumentPageContent from './components/DocumentPageContent';
import { useDocumentPageController } from './hooks/useDocumentPageController';
import DeleteModal from '@components/DeleteModal';

const DocumentPage = () => {
  const {
    fileInputRef,

    documents,
    isEmpty,
    view,
    editingTextId,
    editingDoc,

    isDeleteOpen,

    onPickFiles,
    triggerPickAnyFile,
    triggerPickFileByType,

    openTextCreate,
    openTextEdit,
    onRequestDelete,
    downloadLocal,

    handleSaveText,
    goList,

    closeDeleteModal,
    confirmDelete,
  } = useDocumentPageController();

  return (
    <>
      <input ref={fileInputRef} type="file" hidden multiple onChange={onPickFiles} />

      <div className="flex-1 min-h-0 flex flex-col">
        <DocumentPageContent
          view={view}
          isEmpty={isEmpty}
          documents={documents}
          editingTextId={editingTextId}
          editingDoc={editingDoc}
          onBackToList={goList}
          onSaveText={handleSaveText}
          onPickAnyFile={triggerPickAnyFile}
          onPickFileByType={triggerPickFileByType}
          onClickText={openTextCreate}
          onEditText={openTextEdit}
          onDelete={onRequestDelete}
          onDownload={downloadLocal}
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
