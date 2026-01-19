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

  const canSubmit = useMemo(
    () => title.trim().length > 0 && content.trim().length > 0,
    [title, content],
  );

  const submit = useCallback(() => {
    if (!canSubmit) return;
    onSave({ title: title.trim(), content });
  }, [canSubmit, onSave, title, content]);

  return {
    title,
    setTitle,
    content,
    setContent,
    canSubmit,
    submit,
  };
};
