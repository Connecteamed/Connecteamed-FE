import { useLocation } from 'react-router-dom';

import TeamContributionList from './components/TeamContributionList';
import TeamGraph from './components/TeamGraph';

export const TaskStatistic = () => {
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const lastPart = pathParts[pathParts.length - 1];
  const projectId = Number(lastPart);

  return (
    <div className="flex w-full flex-col items-center gap-10 rounded-lg bg-white px-4 pb-6 pt-2 md:px-4 md:pb-0">
      <div className="mt-4 w-full md:mt-6">
        <TeamGraph projectId={projectId} />
      </div>
      <TeamContributionList projectId={projectId} />
    </div>
  );
};

export default TaskStatistic;
