import { dashboardApi } from "@/api/modules/dashbaordStats";
import { useQuery } from "@tanstack/react-query";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardstats"],
    queryFn: dashboardApi.getDashStats,
    staleTime: 2 * 60 * 1000, // 2 mins
    gcTime: 5 * 60 * 1000, //cache time 5 mins
  });
};
