import { useGetProjectMemberContributions } from '@/hooks/TaskPage/Query/useGetProjectMemberContributions';

import GrassColorGuide from './GrassColorGuide';
import IndividualContribution from './IndividualContribution';

interface Props {
  projectId: number;
}

export const TeamContributionList = ({ projectId }: Props) => {
  const { data: members } = useGetProjectMemberContributions(projectId);
  return (
    <div className="w-full max-w-[980px]">
      <div className="mb-[12px] flex justify-end">
        <GrassColorGuide />
      </div>

      <section className="grid grid-cols-1 gap-[24px] min-[540px]:grid-cols-2">
        {members?.map((member) => (
          <div className="min-h-[250px]" key={member.id}>
            <IndividualContribution name={member.name} contributions={member.contributions} />
          </div>
        ))}
      </section>
    </div>
  );
};

export default TeamContributionList;
