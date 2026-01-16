import { getAllCommunityForum } from "@/api/apiTypes";
import { community_forum_api } from "@/api/modules/community_forum";
import { useQuery } from "@tanstack/react-query";

export const useCommunityForumAdmin = (page: number) => {
  return useQuery<getAllCommunityForum>({
    queryKey: ["communityForumAdmin", page],
    queryFn: () => community_forum_api.getAllCommunityForums(page),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
