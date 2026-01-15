// src/hooks/useUsers.ts
import { authApi } from "@/api/modules/auth";
import { useQuery } from "@tanstack/react-query";

export const useUsers = (page: number) => {
  return useQuery({
    queryKey: ["users", page],
    queryFn: () => authApi.getUsersData(page),
    staleTime: 5 * 60 * 1000, // 5 mins
    gcTime: 10 * 60 * 1000, //cache time 10 mins
  });
};
