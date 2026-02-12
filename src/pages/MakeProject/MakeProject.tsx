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
    <div className="h-full w-full bg-white">
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

          <div className="flex w-full flex-col items-start justify-start">
            {/* 1. 상단: 역할 보여주는 영역 (Top Box) */}
            {/* min-h-[48px] (h-12)로 설정하여 내용이 없어도 피그마와 같은 높이 유지 */}
            <div className="flex min-h-[48px] w-full flex-wrap items-center gap-2 rounded-t-[10px] border border-b-0 border-gray-300 bg-white px-4 py-3">
              {roles.length === 0 ? (
                // 역할이 없을 때: 피그마 스타일의 Placeholder 텍스트
                <span className="font-['Roboto'] text-lg font-medium text-gray-300">
                  역할을 추가해주세요
                </span>
              ) : (
                // 역할이 있을 때: 태그 리스트
                roles.map((role) => (
                  <div
                    key={role}
                    className="flex items-center justify-center gap-1 rounded-[5px] bg-gray-100 px-2 py-1"
                  >
                    <span className="text-sm text-black">{role}</span>
                    <button
                      type="button"
                      onClick={() => removeRole(role)}
                      className="flex h-4 w-4 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* 2. 하단: 입력 영역 (Bottom Box) */}
            {/* 상단 박스와 이어지도록 border-t는 제외하거나 겹치게 처리 (여기서는 border 전체 적용하되 위쪽은 Top Box와 연결감) */}
            <div className="flex h-[48px] w-full items-center rounded-b-[10px] border border-gray-300 bg-white px-4">
              {/* 플러스 아이콘 (피그마 디자인에 맞춤) */}
              <div className="mr-2 flex items-center justify-center">
                {/* 이미지가 있다면 img 태그 사용, 없다면 아래의 오렌지 사각형 아이콘 사용 */}
                <img src={plus} alt="추가" className="h-5 w-5" />
              </div>

              {/* 입력창 */}
              <input
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                onKeyDown={(e) => {
                  // 한글 입력 중 엔터 두 번 방지 (isComposing)
                  if (e.nativeEvent.isComposing) return;
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addRole();
                  }
                }}
                placeholder="역할 추가"
                className="h-full flex-1 bg-transparent font-['Roboto'] text-sm text-black outline-none placeholder:text-gray-400"
              />

              {/* (선택사항) '추가' 텍스트 버튼이 필요하다면 여기에 배치 */}
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
