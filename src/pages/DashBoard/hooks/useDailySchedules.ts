import { useQuery } from "@tanstack/react-query";
import { getDailySchedules, toUTCDateStartISO } from "../apis/dashboardApi";

export function useDailySchedules(date: Date) {
  const dateKey = toUTCDateStartISO(date);

  return useQuery({
    queryKey: ["dashboard", "dailySchedules", dateKey],
    queryFn: () => getDailySchedules(date),
    staleTime: 30_000,
  });
}
