import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import plus from '@assets/icon-plus-orange.svg';
import projectMakingImage from '@assets/image-project-making.png';

import useLimitedInput from '@/hooks/MakeProject/useLimitedInput';
import usePostMakeProject from '@/hooks/TaskPage/Mutate/usePostMakeProject';

import ProjectGoalInput from './components/ProjectGoalInput';
import ProjectNameInput from './components/ProjectNameInput';

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

    makeProject(
      {
        name: projectNameInput.value,
        goal: projectGoalInput.value,
        requiredRoleNames: roles,
        image: null,
      },
      {
        onSuccess: (data) => {
          if (!data.data.projectId) {
            return alert(data.message || '프로젝트 생성에 실패했습니다.');
          }
          navigate(`/team/${data.data.projectId}`);
        },
      },
    );
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="flex w-full max-w-[720px] flex-col gap-8 px-6 py-10 md:ml-10 md:px-12 md:pt-18.75">
        {/* 타이틀 */}
        <div className="pb-2 text-2xl font-bold text-neutral-900 md:text-3xl">
          새로운 프로젝트를 만들어 볼까요?
        </div>

        {/* 이미지 */}
        <img
          className="w-full object-contain"
          src={projectMakingImage}
          alt="프로젝트 플레이스홀더"
        />

        <div className="flex w-full flex-col gap-8">
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
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium md:text-lg">프로젝트 역할</div>

            <div className="focus-within:border-primary-500 rounded-[12px] border border-gray-300">
              <div className="flex min-h-[52px] flex-wrap items-center gap-2 px-3 py-2">
                {roles.length === 0 && (
                  <span className="text-xs text-gray-400 placeholder-gray-400 md:text-lg">
                    역할을 추가해주세요
                  </span>
                )}
                {roles.map((role) => (
                  <span
                    key={role}
                    className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-neutral-900"
                  >
                    {role}
                    <button
                      type="button"
                      onClick={() => removeRole(role)}
                      className="text-neutral-500"
                      aria-label={`${role} 삭제`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex h-12 items-center gap-2 border-t border-gray-300 px-3 py-2">
                <button
                  type="button"
                  onClick={() => {
                    addRole();
                  }}
                  className="text-primary-500 flex items-center gap-1"
                >
                  <img src={plus} alt="역할 추가" className="h-4 w-4 md:h-5 md:w-5" />
                </button>
                <input
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addRole();
                    }
                  }}
                  placeholder="추가하고 싶은 역할을 입력해주세요"
                  className="flex-1 text-sm text-neutral-900 placeholder-gray-400 outline-none focus:placeholder-transparent"
                />
              </div>
            </div>
          </div>

          <button
            disabled={!isReady}
            onClick={handleSubmit}
            className={`h-12 rounded-[10px] text-base font-medium text-white ${
              isReady ? 'bg-primary-500' : 'cursor-not-allowed bg-[#c6ccd7]'
            } mt-6`}
          >
            프로젝트 생성하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MakeProject;
