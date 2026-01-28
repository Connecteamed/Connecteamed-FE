import plus from '@assets/icon-plus-orange.svg';
import useLimitedInput from '@/hooks/MakeProject/useLimitedInput';
import ProjectGoalInput from './components/ProjectGoalInput';
import ProjectNameInput from './components/ProjectNameInput';
import projectMakingImage from '@assets/image-project-making.png'

const MakeProject = () => {
  const projectNameInput = useLimitedInput(30);
  const projectGoalInput = useLimitedInput(30);
  const isReady = projectNameInput.value.trim().length > 0 && projectGoalInput.value.trim().length > 0;

  return (
    <div className='w-full h-full bg-white'>
      <div className="inline-flex flex-col items-start justify-start gap-8 pl-20.5 pt-18.75">
        <div className="w-113.25 h-16 justify-center self-stretch text-3xl font-bold text-black">
          새로운 프로젝트를 만들어 볼까요?
        </div>
        <div className="flex w-96 flex-col items-start justify-start gap-6">
          <img
            className="h-72 w-96"
            src={projectMakingImage}
            alt="프로젝트 플레이스홀더"
          />
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
                <div className="h-7 justify-center self-stretch text-lg text-black">
                  프로젝트 역할
                </div>
                <div className="relative flex flex-col items-start justify-start self-stretch">
                  <div className="h-12 self-stretch rounded-tl-[10px] rounded-tr-[10px] border-t border-r border-l border-gray-300 bg-white" />
                  <div className="h-12 self-stretch rounded-br-[10px] rounded-bl-[10px] border border-gray-300 bg-white" />
                  <div className="absolute top-3.25 left-3.5 h-5 w-52">
                    <div className="absolute top-0 left-0 justify-center text-lg text-gray-300">
                      역할을 추가해주세요
                    </div>
                  </div>
                  <div className="absolute top-15 left-3.5 inline-flex items-center justify-start">
                    <div className="relative h-5 w-5 overflow-hidden">
                      <img src={plus} alt="역할 추가" />
                    </div>
                    <div className="h-6 w-16 justify-center text-sm text-black">
                      역할 추가{' '}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`inline-flex h-12 items-center justify-center self-stretch rounded-[10px] px-3 py-4 ${isReady ? 'bg-orange-500 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'}`}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center justify-center gap-2.5 px-4">
                <div className="justify-start text-base leading-4 tracking-wide text-white">
                  프로젝트 생성하기
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeProject;
