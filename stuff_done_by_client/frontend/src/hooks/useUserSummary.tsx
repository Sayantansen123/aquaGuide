import { authApi } from "@/api/modules/auth";
import { useQuery } from "@tanstack/react-query";

export const useUserSummary = () => {
  return useQuery({
    queryKey: ["userSummary"],
    queryFn: authApi.getUserSummary,
    staleTime: 5 * 60 * 1000, // 5 mins
    gcTime: 10 * 60 * 1000, //cache time 10 mins
  });
};
