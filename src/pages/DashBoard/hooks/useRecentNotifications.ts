import { useQuery } from "@tanstack/react-query";
import { getRecentNotifications } from "../apis/dashboardApi";

export function useRecentNotifications() {
  return useQuery({
    queryKey: ["dashboard", "recentNotifications"],
    queryFn: getRecentNotifications,
    staleTime: 30_000,
  });
}
