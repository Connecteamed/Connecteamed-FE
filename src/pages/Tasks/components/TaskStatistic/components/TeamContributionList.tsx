import GrassColorGuide from './GrassColorGuide';
import IndividualContribution from './IndividualContribution';

interface Contribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface MemberData {
  id: number;
  name: string;
  role?: string;
  contributions: Contribution[]; // 잔디 데이터
}

interface Props {
  members: MemberData[];
}

export const TeamContributionList = ({ members }: Props) => {
  return (
    <div className="w-full max-w-[980px]">
      <div className="mb-[12px] flex justify-end">
        <GrassColorGuide />
      </div>

      <section className="grid grid-cols-1 gap-[24px] min-[540px]:grid-cols-2">
        {members.map((member) => (
          <div className="min-h-[250px]" key={member.id}>
            <IndividualContribution name={member.name} contributions={member.contributions} />
          </div>
        ))}
      </section>
    </div>
  );
};

export default TeamContributionList;
