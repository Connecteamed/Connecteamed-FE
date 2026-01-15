export type OnGoToTeam = (teamId: string) => void;

export type DashboardCardNavProps = {
  onGoToTeam: OnGoToTeam;
};
