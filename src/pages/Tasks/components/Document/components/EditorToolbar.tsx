import iconAlignCenter from '@assets/icon-align-center.svg';
import iconAlignLeft from '@assets/icon-align-left.svg';
import iconAlignRight from '@assets/icon-align-right.svg';
import iconBold from '@assets/icon-bold.svg';
import iconItalic from '@assets/icon-italic.svg';
import iconLink from '@assets/icon-link.svg';
import iconListBulleted from '@assets/icon-list-bulleted.svg';
import iconListNumbered from '@assets/icon-list-numbered.svg';
import iconStrike from '@assets/icon-strikethrough.svg';
import iconUnderline from '@assets/icon-underline.svg';
import { Editor, useEditorState } from '@tiptap/react';

type ToolbarBtnProps = {
  icon: string;
  label: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
};

const ToolbarBtn = ({ icon, label, onClick, active, disabled }: ToolbarBtnProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
      className={[
        'flex h-6 w-6 items-center justify-center rounded',
        disabled ? 'cursor-not-allowed opacity-40' : 'hover:bg-gray-300/50 active:bg-gray-300',
        active ? 'bg-gray-300' : '',
      ].join(' ')}
    >
      <img src={icon} alt={label} className="h-6 w-6" draggable={false} />
    </button>
  );
};

const Divider = () => <div className="h-6 w-px bg-gray-400" />;

type Props = {
  editor: Editor | null;
};

const EditorToolbar = ({ editor }: Props) => {
  const isBold = !!useEditorState({
    editor,
    selector: ({ editor }) => !!editor && editor.isActive('bold'),
  });
  const isItalic = !!useEditorState({
    editor,
    selector: ({ editor }) => !!editor && editor.isActive('italic'),
  });
  const isUnderline = !!useEditorState({
    editor,
    selector: ({ editor }) => !!editor && editor.isActive('underline'),
  });
  const isStrike = !!useEditorState({
    editor,
    selector: ({ editor }) => !!editor && editor.isActive('strike'),
  });
  const isLink = !!useEditorState({
    editor,
    selector: ({ editor }) => !!editor && editor.isActive('link'),
  });
  const isOrderedList = !!useEditorState({
    editor,
    selector: ({ editor }) => !!editor && editor.isActive('orderedList'),
  });
  const isBulletList = !!useEditorState({
    editor,
    selector: ({ editor }) => !!editor && editor.isActive('bulletList'),
  });
  const isAlignLeft = !!useEditorState({
    editor,
    selector: ({ editor }) => !!editor && editor.isActive({ textAlign: 'left' }),
  });
  const isAlignCenter = !!useEditorState({
    editor,
    selector: ({ editor }) => !!editor && editor.isActive({ textAlign: 'center' }),
  });
  const isAlignRight = !!useEditorState({
    editor,
    selector: ({ editor }) => !!editor && editor.isActive({ textAlign: 'right' }),
  });

  if (!editor) {
    return (
      <div className="inline-flex items-center gap-[12px] rounded-[10px] bg-gray-200 px-[14px] py-[9px] opacity-60">
        <span className="text-sm text-gray-600">에디터 로딩중…</span>
      </div>
    );
  }

  const toggleLink = () => {
    const prevUrl = editor.getAttributes('link').href as string | undefined;

    // 이미 링크면 해제
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    // 선택이 없으면 링크 적용이 애매하니 UX상 막아도 되는데, 일단 입력 받게 처리
    const url = window.prompt('링크 URL을 입력하세요', prevUrl ?? 'https://');
    if (!url) return;

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="inline-flex items-center gap-[12px] rounded-[10px] bg-gray-200 px-[14px] py-[9px]">
      <div className="flex items-center gap-[12px]">
        <ToolbarBtn
          icon={iconBold}
          label="굵게"
          active={isBold}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarBtn
          icon={iconItalic}
          label="기울임"
          active={isItalic}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarBtn
          icon={iconUnderline}
          label="밑줄"
          active={isUnderline}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <ToolbarBtn
          icon={iconStrike}
          label="취소선"
          active={isStrike}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
      </div>

      <Divider />

      <div className="flex items-center gap-[12px]">
        <ToolbarBtn icon={iconLink} label="링크" active={isLink} onClick={toggleLink} />
        <ToolbarBtn
          icon={iconListNumbered}
          label="번호 목록"
          active={isOrderedList}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarBtn
          icon={iconListBulleted}
          label="글머리 기호"
          active={isBulletList}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
      </div>

      <Divider />

      <div className="flex items-center gap-[12px]">
        <ToolbarBtn
          icon={iconAlignLeft}
          label="왼쪽 정렬"
          active={isAlignLeft}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        />
        <ToolbarBtn
          icon={iconAlignCenter}
          label="가운데 정렬"
          active={isAlignCenter}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        />
        <ToolbarBtn
          icon={iconAlignRight}
          label="오른쪽 정렬"
          active={isAlignRight}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        />
      </div>
    </div>
  );
};

export default EditorToolbar;
