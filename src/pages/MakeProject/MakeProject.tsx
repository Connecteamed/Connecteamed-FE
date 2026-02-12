import { useState } from 'react';

import plus from '@assets/icon-plus-orange.svg';
import projectMakingImage from '@assets/image-project-making.png';

import useLimitedInput from '@/hooks/MakeProject/useLimitedInput';
import usePostMakeProject from '@/hooks/TaskPage/Mutate/usePostMakeProject';

import ProjectGoalInput from './components/ProjectGoalInput';
import ProjectNameInput from './components/ProjectNameInput';
import { useNavigate } from 'react-router-dom';

const MakeProject = () => {
  const { mutate: makeProject } = usePostMakeProject();
  const navigate = useNavigate();
  
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

  const handleSubmit = () => {
    if (!isReady) return;

    makeProject({
      name: projectNameInput.value,
      goal: projectGoalInput.value,
      requiredRoleNames: roles,
      image: null,
    }, {
      onSuccess: (data) => {
        if (!data.data.projectId){
          return alert(data.message || '프로젝트 생성에 실패했습니다.');
        }
        navigate(`/team/${data.data.projectId}`);
      },
    });
  };

  return (
    <div className="w-full h-full bg-white">
      <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-6 md:max-w-none md:px-0 md:py-0 md:pt-18.75 md:pl-20.5">
        {/* 타이틀 */}
        <div className="text-center text-xl font-bold md:text-left md:text-3xl">
          새로운 프로젝트를 만들어 볼까요?
        </div>

        {/* 이미지 */}
        <img
          className="mx-auto w-full max-w-xs md:mx-0 md:h-72 md:w-96"
          src={projectMakingImage}
          alt="프로젝트 플레이스홀더"
        />

        <div className="flex flex-col gap-10 md:w-96">
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

          {/* 역할 */}
          <div className="flex flex-col gap-1.5">
            <div className="text-sm font-medium md:text-lg">프로젝트 역할</div>

            <div className="relative flex flex-col">
              <div className="flex flex-wrap gap-2 rounded-t-[10px] border border-b-0 border-gray-300 p-3 md:absolute md:top-2 md:left-3 md:border-none md:p-0">
                {roles.length === 0 && (
                  <span className="text-xs text-gray-300 md:text-sm">역할을 추가해주세요</span>
                )}

                {roles.map((role) => (
                  <span
                    key={role}
                    className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-[10px] md:text-sm"
                  >
                    {role}
                    <button onClick={() => removeRole(role)}>×</button>
                  </span>
                ))}
              </div>

              <div className="flex h-10 items-center rounded-b-[10px] border border-gray-300 px-3 py-2 md:h-12 md:rounded-[10px]">
                <img src={plus} alt="역할 추가" className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                <input
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addRole();
                    }
                  }}
                  placeholder="역할 추가"
                  className="flex-1 text-xs outline-none md:text-sm"
                />
              </div>
            </div>
          </div>

          <button
            disabled={!isReady}
            onClick={handleSubmit}
            className={`h-12 rounded-[10px] text-white ${
              isReady ? 'bg-orange-500' : 'cursor-not-allowed bg-gray-300'
            }`}
          >
            프로젝트 생성하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MakeProject;
