import { performanceApi } from "@/api/modules/performance";
import { useQuery } from "@tanstack/react-query";

export const useMetrices = () => {
  return useQuery({
    queryKey: ["metrice"],
    queryFn: performanceApi.metrices,
    staleTime: 1 * 60 * 1000,
    gcTime: 1 * 60 * 1000,
  });
};

export const useHistory = () => {
  return useQuery({
    queryKey: ["history"],
    queryFn: performanceApi.history,
    staleTime: 1 * 60 * 1000,
    gcTime: 1 * 60 * 1000,
  });
};

export const useSummary = () => {
  return useQuery({
    queryKey: ["summary"],
    queryFn: performanceApi.summary,
    staleTime: 1 * 60 * 1000,
    gcTime: 1 * 60 * 1000,
  });
};
