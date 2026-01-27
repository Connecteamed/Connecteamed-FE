import { useState } from 'react';
import plus from '@assets/icon-plus-orange.svg';

const MakeProject = () => {
  const MAX_LENGTH = 30;
  const [projectName, setProjectName] = useState('');
  const [projectGoal, setProjectGoal] = useState('');

  return (
    <div className='w-full h-full bg-white'>
      <div className="inline-flex flex-col items-start justify-start gap-8 pl-20.5 pt-18.75">
        <div className="w-[453px] h-16 justify-center self-stretch text-3xl font-bold text-black">
          새로운 프로젝트를 만들어 볼까요?
        </div>
        <div className="flex w-96 flex-col items-start justify-start gap-6">
          <img
            className="h-72 w-96"
            src="https://placehold.co/이미지"
            alt="프로젝트 플레이스홀더"
          />
          <div className="flex flex-col items-start justify-start gap-10 self-stretch">
            <div className="flex flex-col items-start justify-start gap-2.5 self-stretch">
              <div className="flex flex-col items-end justify-start gap-1.5 self-stretch">
                <div className="flex flex-col items-start justify-start gap-2.5 self-stretch">
                  <div className="h-7 justify-center self-stretch text-lg text-black">
                    프로젝트명
                  </div>
                  <div className="inline-flex h-12 items-center justify-start gap-2.5 self-stretch rounded-[10px] bg-white px-3.5 py-1.5 outline-1 -outline-offset-1 outline-gray-300">
                    <input
                      className="justify-center text-lg text-gray-300"
                      placeholder='프로젝트명을 입력해주세요'
                      maxLength={MAX_LENGTH}
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value.slice(0, MAX_LENGTH))}
                    />
                  </div>
                </div>
                <div className="justify-center self-stretch text-right text-[8px] leading-3 text-neutral-900">
                  {projectName.length}/{MAX_LENGTH}
                </div>
              </div>
              <div className="flex flex-col items-end justify-start gap-1.5 self-stretch">
                <div className="flex flex-col items-start justify-start gap-2.5 self-stretch">
                  <div className="h-7 justify-center self-stretch text-lg text-black">
                    프로젝트 목표
                  </div>
                  <div className="inline-flex h-12 items-center justify-start gap-2.5 self-stretch rounded-[10px] bg-white px-3.5 py-1.5 outline-1 -outline-offset-1 outline-gray-300">
                    <input
                      className="justify-center text-lg text-gray-300"
                      placeholder='프로젝트 목표를 입력해주세요'
                      maxLength={MAX_LENGTH}
                      value={projectGoal}
                      onChange={(e) => setProjectGoal(e.target.value.slice(0, MAX_LENGTH))}
                    />
                  </div>
                </div>
                <div className="justify-center self-stretch text-right text-[8px] leading-3 text-neutral-900">
                  {projectGoal.length}/{MAX_LENGTH}
                </div>
              </div>
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
                      <img src={plus}/>
                    </div>
                    <div className="h-6 w-16 justify-center text-sm text-black">
                      역할 추가{' '}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              data-brand="-"
              data-icon-left="false"
              data-icon-right="false"
              data-notification="false"
              data-sep-left="false"
              data-sep-right="false"
              data-size="M"
              data-style="Disabled"
              data-text="true"
              className="inline-flex h-12 items-center justify-center self-stretch rounded-[10px] bg-gray-300 px-3 py-4"
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
