import { videoApi } from "@/api/modules/video";
import { useQuery } from "@tanstack/react-query";

export const useVideoUsers = (page: number) => {
  return useQuery({
    queryKey: ["videoUsers", page],
    queryFn: () => videoApi.getVideoGuides(page),
    staleTime: 5 * 60 * 1000, // 5 mins
    gcTime: 10 * 60 * 1000, //cache time 10 mins
  });
};
