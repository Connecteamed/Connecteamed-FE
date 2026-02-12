type ProjectGoalInputProps = {
  value: string;
  currentLength: number;
  maxLength: number;
  onChange: (value: string) => void;
};

const ProjectGoalInput = ({
  value,
  currentLength,
  maxLength,
  onChange,
}: ProjectGoalInputProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-sm font-medium md:text-lg">
        프로젝트 목표
      </div>

      <div className="h-10 rounded-[10px] border border-gray-300 px-3 md:h-12 md:px-3.5">
        <input
          className="h-full w-full text-sm outline-none md:text-lg"
          placeholder="프로젝트 목표를 입력해주세요"
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      <div className="text-right text-[10px] md:text-[8px]">
        {currentLength}/{maxLength}
      </div>
    </div>
  );
};

export default ProjectGoalInput;
