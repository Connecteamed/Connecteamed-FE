import iconBold from '@assets/icon-bold.svg';
import iconItalic from '@assets/icon-italic.svg';
import iconUnderline from '@assets/icon-underline.svg';
import iconStrike from '@assets/icon-strikethrough.svg';
import iconLink from '@assets/icon-link.svg';
import iconListNumbered from '@assets/icon-list-numbered.svg';
import iconListBulleted from '@assets/icon-list-bulleted.svg';
import iconAlignLeft from '@assets/icon-align-left.svg';
import iconAlignCenter from '@assets/icon-align-center.svg';
import iconAlignRight from '@assets/icon-align-right.svg';

type ToolbarBtnProps = {
  icon: string;
  label: string;
  onClick?: () => void;
};

const ToolbarBtn = ({ icon, label, onClick }: ToolbarBtnProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-300/50 active:bg-gray-300"
    >
      <img src={icon} alt={label} className="w-6 h-6" draggable={false} />
    </button>
  );
};

const Divider = () => <div className="w-px h-6 bg-gray-400" />;

type Props = {
  // 나중에 Quill 붙일 때 각 버튼 핸들러 연결하려고 props로 열어둠
  onBold?: () => void;
  onItalic?: () => void;
  onUnderline?: () => void;
  onStrike?: () => void;

  onLink?: () => void;
  onListNumbered?: () => void;
  onListBulleted?: () => void;

  onAlignLeft?: () => void;
  onAlignCenter?: () => void;
  onAlignRight?: () => void;
};

const EditorToolbar = ({
  onBold,
  onItalic,
  onUnderline,
  onStrike,
  onLink,
  onListNumbered,
  onListBulleted,
  onAlignLeft,
  onAlignCenter,
  onAlignRight,
}: Props) => {
  return (
    <div className="px-[14px] py-[9px] bg-gray-200 rounded-[10px] inline-flex items-center gap-[12px]">
      <div className="flex items-center gap-[12px]">
        <ToolbarBtn icon={iconBold} label="굵게" onClick={onBold} />
        <ToolbarBtn icon={iconItalic} label="기울임" onClick={onItalic} />
        <ToolbarBtn icon={iconUnderline} label="밑줄" onClick={onUnderline} />
        <ToolbarBtn icon={iconStrike} label="취소선" onClick={onStrike} />
      </div>

      <Divider />

      <div className="flex items-center gap-[12px]">
        <ToolbarBtn icon={iconLink} label="링크" onClick={onLink} />
        <ToolbarBtn icon={iconListNumbered} label="번호 목록" onClick={onListNumbered} />
        <ToolbarBtn icon={iconListBulleted} label="글머리 기호" onClick={onListBulleted} />
      </div>

      <Divider />

      <div className="flex items-center gap-[12px]">
        <ToolbarBtn icon={iconAlignLeft} label="왼쪽 정렬" onClick={onAlignLeft} />
        <ToolbarBtn icon={iconAlignCenter} label="가운데 정렬" onClick={onAlignCenter} />
        <ToolbarBtn icon={iconAlignRight} label="오른쪽 정렬" onClick={onAlignRight} />
      </div>
    </div>
  );
};

export default EditorToolbar;
