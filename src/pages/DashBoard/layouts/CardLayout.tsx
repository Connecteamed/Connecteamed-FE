import RetrospectCard from '@/pages/DashBoard/components/Card/RetrospectCard';
import ComingtaskCard from '@/pages/DashBoard/components/Card/ComingtaskCard';
import AlarmCard from '@/pages/DashBoard/components/Card/AlarmCard';
import DatetaskCard from '@/pages/DashBoard/components/Card/DatetaskCard';
import useGoToTeam from '../hooks/useGoToTeam';

export default function CardLayout() {
  const goToTeam = useGoToTeam();
  return (
    <div className="h-full grid gap-[24px] [grid-template-columns:600px_1fr] [grid-template-rows:250px_1fr]">
      <RetrospectCard onGoToTeam={goToTeam} />
      <ComingtaskCard onGoToTeam={goToTeam} />
      <AlarmCard onGoToTeam={goToTeam} />
      <DatetaskCard onGoToTeam={goToTeam} />
    </div>
  );
}
