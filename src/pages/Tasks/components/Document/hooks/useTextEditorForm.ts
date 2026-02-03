import { useCallback, useMemo, useState } from 'react';

type SavePayload = { title: string; content: string };

type Options = {
  initialTitle?: string;
  initialContent?: string;
  onSave: (payload: SavePayload) => void;
};

export const useTextEditorForm = ({ initialTitle = '', initialContent = '', onSave }: Options) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const trimmedTitle = useMemo(() => title.trim(), [title]);
  const trimmedContent = useMemo(() => content.trim(), [content]);

  const canSubmit = useMemo(
    () => trimmedTitle.length > 0 && trimmedContent.length > 0,
    [trimmedTitle, trimmedContent],
  );

  const submit = useCallback(() => {
    if (!canSubmit) return;
    onSave({ title: trimmedTitle, content: trimmedContent });
  }, [canSubmit, onSave, trimmedTitle, trimmedContent]);

  return {
    title,
    setTitle,
    content,
    setContent,
    canSubmit,
    submit,
  };
};
