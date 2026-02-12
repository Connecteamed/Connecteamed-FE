import AlarmCard from '../components/Card/AlarmCard';
import RetrospectCard from '../components/Card/RetrospectCard';
import ComingtaskCard from '../components/Card/UpcomingtaskCard';
import WorkLogCard from '../components/Card/WorkLogCard';

export default function CardLayout() {
  return (
    <div className="grid min-h-0 grid-cols-1 gap-6 xl:[grid-template-columns:388px_622px] xl:[grid-template-rows:310px_439px] xl:items-stretch">
      <RetrospectCard />
      <ComingtaskCard />
      <AlarmCard />
      <WorkLogCard />
    </div>
  );
}
