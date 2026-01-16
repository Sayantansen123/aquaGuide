
import { getAllCommunityForum } from "@/api/apiTypes";
import { community_forum_api } from "@/api/modules/community_forum";
import { useQuery } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";

//approved community forums displayed here
//also to be used in user display page 
export const useCommunityForumPublic = (page: number) => {
  return useQuery<getAllCommunityForum>({
    queryKey: ["communityForumPublic", page],
    queryFn: () => community_forum_api.getAllApprovedCommunityForums(page),
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000,
  });
};

export const useCommunityForumbyId = (id: string) =>{
    return useQuery({
        queryKey: ["communityForumbyId", id],
        queryFn: ()=> community_forum_api.getCommunityforumByid(id),
        staleTime: 5*60*1000,
        gcTime: 10 * 60 * 1000
    })
}



export const useCommunityForumPublicInfinite = () => {
  return useInfiniteQuery({
    queryKey: ["communityForumPublic"],
    queryFn: ({ pageParam = 1 }) =>
      community_forum_api.getAllApprovedCommunityForums(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.pagination.total_pages ? nextPage : undefined;
    },
    initialPageParam: 1, // <--- this fixes the TypeScript error
    staleTime: 5 * 60 * 1000,
  });
};
