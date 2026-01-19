import DocumentPageContent from './components/DocumentPageContent';
import { useDocumentPageController } from './hooks/useDocumentPageController';

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
    triggerFilePicker,

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
          onPickFile={triggerFilePicker}
          onClickText={openTextCreate}
          onEditText={openTextEdit}
          onDelete={onRequestDelete}
          onDownload={downloadLocal}
        />
      </div>
    </>
  );
};

export default DocumentPage;
