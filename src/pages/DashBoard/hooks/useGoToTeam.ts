import { useNavigate } from 'react-router-dom';

export default function useGoToTeam() {
  const navigate = useNavigate();

  return (teamId: string | number) => {
    navigate(`/team/${teamId}`);
  };
}
