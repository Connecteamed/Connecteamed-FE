import RetrospectCard from '../components/Card/RetrospectCard';
import ComingtaskCard from '../components/Card/ComingtaskCard';
import AlarmCard from '../components/Card/AlarmCard';
import WorkLogCard from '../components/Card/WorkLogCard';
import useGoToTeam from '../hooks/useGoToTeam';

export default function CardLayout() {
  const goToTeam = useGoToTeam();
  return (
    <div className="h-full grid gap-[24px] [grid-template-columns:600px_1fr] [grid-template-rows:250px_1fr]">
      <RetrospectCard onGoToTeam={goToTeam} />
      <ComingtaskCard onGoToTeam={goToTeam} />
      <AlarmCard />
      <WorkLogCard />
    </div>
  );
}
