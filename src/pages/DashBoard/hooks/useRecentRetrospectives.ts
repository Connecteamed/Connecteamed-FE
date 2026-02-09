import { useQuery } from "@tanstack/react-query";
import { getRecentRetrospectives } from "../apis/dashboardApi";

export function useRecentRetrospectives() {
  return useQuery({
    queryKey: ["dashboard", "recentRetrospectives"],
    queryFn: getRecentRetrospectives,
    staleTime: 30_000,
  });
}
