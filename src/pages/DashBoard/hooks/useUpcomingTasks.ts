import { useQuery } from "@tanstack/react-query";
import { getUpcomingTasks } from "../apis/dashboardApi";

export function useUpcomingTasks() {
  return useQuery({
    queryKey: ["dashboard", "upcomingTasks"],
    queryFn: getUpcomingTasks,
    staleTime: 30_000,
  });
}
