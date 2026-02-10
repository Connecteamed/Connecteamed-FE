import React from 'react';

const useDocumentPreview = () => {
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

  const openPreview = () => setIsPreviewOpen(true);
  const closePreview = () => setIsPreviewOpen(false);

  return { isPreviewOpen, openPreview, closePreview };
};

export default useDocumentPreview;
