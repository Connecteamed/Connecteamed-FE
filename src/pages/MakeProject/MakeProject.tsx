import plus from '@assets/icon-plus-orange.svg';
import projectMakingImage from '@assets/image-project-making.png';

import useLimitedInput from '@/hooks/MakeProject/useLimitedInput';
import usePostMakeProject from '@/hooks/TaskPage/Mutate/usePostMakeProject';
import { useState } from 'react';

import ProjectGoalInput from './components/ProjectGoalInput';
import ProjectNameInput from './components/ProjectNameInput';

const MakeProject = () => {
  const { mutate: makeProject } = usePostMakeProject();

  const projectNameInput = useLimitedInput(30);
  const projectGoalInput = useLimitedInput(30);
  const [roleInput, setRoleInput] = useState('');
  const [roles, setRoles] = useState<string[]>([]);
  const isReady =
    projectNameInput.value.trim().length > 0 &&
    projectGoalInput.value.trim().length > 0 &&
    roles.length > 0;

  const addRole = () => {
    const trimmed = roleInput.trim();
    if (!trimmed) return;
    // 중복 방지
    if (roles.some((r) => r.toLowerCase() === trimmed.toLowerCase())) {
      setRoleInput('');
      return;
    }
    setRoles((prev) => [...prev, trimmed]);
    setRoleInput('');
  };

  const removeRole = (target: string) => {
    setRoles((prev) => prev.filter((r) => r !== target));
  };

  return (
    <div className="h-full w-full bg-white">
      <div className="inline-flex flex-col items-start justify-start gap-8 pt-18.75 pl-20.5">
        <div className="h-16 w-113.25 justify-center self-stretch text-3xl font-bold text-black">
          새로운 프로젝트를 만들어 볼까요?
        </div>
        <div className="flex w-96 flex-col items-start justify-start gap-6">
          <img className="h-72 w-96" src={projectMakingImage} alt="프로젝트 플레이스홀더" />
          <div className="flex flex-col items-start justify-start gap-10 self-stretch">
            <div className="flex flex-col items-start justify-start gap-2.5 self-stretch">
              <ProjectNameInput
                value={projectNameInput.value}
                currentLength={projectNameInput.length}
                maxLength={projectNameInput.maxLength}
                onChange={projectNameInput.handleChange}
              />
              <ProjectGoalInput
                value={projectGoalInput.value}
                currentLength={projectGoalInput.length}
                maxLength={projectGoalInput.maxLength}
                onChange={projectGoalInput.handleChange}
              />
              <div className="flex flex-col items-start justify-start gap-2.5 self-stretch">
                <div className="self-stretch h-7 justify-center text-black text-lg font-medium">프로젝트 역할</div>
                <div className="self-stretch relative flex flex-col justify-start items-start">
                  <div className="self-stretch h-12 bg-white rounded-tl-[10px] rounded-tr-[10px] border-l border-r border-t border-gray-300" />
                  <div className="self-stretch h-12 bg-white rounded-bl-[10px] rounded-br-[10px] border border-gray-300 flex items-center">
                    <div className="ml-3 flex w-full items-center gap-3">
                      <div className="relative h-5 w-5 overflow-hidden">
                        <img src={plus} alt="역할 추가" />
                      </div>
                      <input
                        className="flex-1 text-sm text-black outline-none"
                        placeholder="역할 추가"
                        value={roleInput}
                        onChange={(e) => setRoleInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addRole();
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="left-[14px] top-[9px] absolute inline-flex flex-wrap items-center gap-3">
                    {roles.length === 0 && (
                      <span className="text-gray-300 text-sm">역할을 추가해주세요</span>
                    )}
                    {roles.map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center gap-1.5 rounded-[30px] bg-gray-100 px-3 py-1 text-sm text-black"
                      >
                        {role}
                        <button
                          type="button"
                          className="text-black"
                          onClick={() => removeRole(role)}
                          aria-label={`${role} 삭제`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <button
              className={`inline-flex h-12 items-center justify-center self-stretch rounded-[10px] px-3 py-4 ${isReady ? 'cursor-pointer bg-orange-500' : 'cursor-not-allowed bg-gray-300'}`}
              type="button"
              disabled={!isReady}
              onClick={() =>
                makeProject({
                  name: projectNameInput.value,
                  goal: projectGoalInput.value,
                  requiredRoleNames: roles,
                  image: null,
                })
              }
            >
              <div className="flex items-center justify-center gap-2.5 px-4">
                <div className="justify-start text-base leading-4 tracking-wide text-white">
                  프로젝트 생성하기
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeProject;
