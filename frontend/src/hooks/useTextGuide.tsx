import { textApi } from "@/api/modules/text";
import { useQuery } from "@tanstack/react-query";

export const useTextGuide = (page: number) => {
  return useQuery({
    queryKey: ["texts", page],
    queryFn: () => textApi.getAllGuides(page),
    staleTime: 5 * 60 * 1000, // 5 mins
    gcTime: 10 * 60 * 1000, //cache time 10 mins
  });
};
