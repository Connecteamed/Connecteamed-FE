import { useLocation } from 'react-router-dom';

import TeamContributionList from './components/TeamContributionList';
import TeamGraph from './components/TeamGraph';

export const TaskStatistic = () => {
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const lastPart = pathParts[pathParts.length - 1];
  const projectId = Number(lastPart);

  return (
    <div className="flex w-[960px] flex-col items-center justify-center rounded-lg bg-white">
      <div className="mt-[24px] mb-[36px] w-full">
        <TeamGraph projectId={projectId} />
      </div>
      <TeamContributionList projectId={projectId} />
    </div>
  );
};

export default TaskStatistic;
