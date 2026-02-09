type ProjectNameInputProps = {
  value: string;
  currentLength: number;
  maxLength: number;
  onChange: (value: string) => void;
};

const ProjectNameInput = ({ value, currentLength, maxLength, onChange }: ProjectNameInputProps) => {
  return (
    <div className="flex flex-col items-end justify-start gap-1.5 self-stretch">
      <div className="flex flex-col items-start justify-start gap-2.5 self-stretch">
        <div className="h-7 justify-center self-stretch text-lg text-black">프로젝트명</div>
        <div className="inline-flex h-12 items-center justify-start gap-2.5 self-stretch rounded-[10px] bg-white px-3.5 py-1.5 outline-1 -outline-offset-1 outline-gray-300">
          <input
            className="w-full justify-center text-lg text-black outline-none"
            placeholder="프로젝트명을 입력해주세요"
            value={value}
            maxLength={maxLength}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>
      <div className="justify-center self-stretch text-right text-[8px] leading-3 text-neutral-900">
        {currentLength}/{maxLength}
      </div>
    </div>
  );
};

export default ProjectNameInput;
