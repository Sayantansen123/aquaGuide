import {
  CommunityApproveRejectDeleteResponse,
  CommunityForumDetailResponse,
  CommunityForumPayload,
  getAllCommunityForum,
  LikeDislikeCommunity,
  LikeDislikePayload,
} from "../apiTypes";
import httpClient from "../axiosSetup";


export const community_forum_api = {
    create: async(data: CommunityForumPayload) =>{
        const res = await httpClient.post<CommunityForumDetailResponse>(`/api/community/add_community_forum`, data, {
            headers: { useAuth: true },
        });
        return res.data;
    },

    getAllCommunityForums: async (page: number) => {
        const res = await httpClient.get<getAllCommunityForum>(`/api/community/get_all_community_forum?page=${page}`, {
            headers: {useAuth: true},
        });
        return res.data;
    },

    getAllApprovedCommunityForums: async (page: number): Promise<getAllCommunityForum> => {
        const res = await httpClient.get<getAllCommunityForum>(`/api/community/get_all_approved_community_forum?page=${page}`);
        return res.data;
    },

    getCommunityforumByid: async (id: string)=>{
        const res = await httpClient.get<CommunityForumDetailResponse>(`/api/community/get_community_forum_by_id/${id}`);
        return res.data;
    },

    approveCommunity: async (forum_id: string)=>{
        const res = await httpClient.put<CommunityApproveRejectDeleteResponse>(`/api/community/approve_community?forum_id=${forum_id}`,{
            headers: {useAuth: true},
        });
        return res.data;
    },

    rejectCommunity: async (forum_id: string)=>{
        const res = await httpClient.put<CommunityApproveRejectDeleteResponse>(`/api/community/reject_community?forum_id=${forum_id}`,{
            headers: {useAuth: true},
        });
        return res.data;
    },

    approveRejectionRequest: async (forum_id: string)=>{
        const res = await httpClient.put<CommunityApproveRejectDeleteResponse>(`/api/community/approve_rejection_request?forum_id=${forum_id}`,{
            headers: {useAuth: true},
        });
        return res.data;
    },

    deleteCommunityForum: async (forum_id: string)=>{
        const res = await httpClient.delete<CommunityApproveRejectDeleteResponse>(`/api/community/delete_community_forum?forum_id=${forum_id}`,{
            headers: {useAuth: true},
        });
        return res.data;
    },

    deleteComment: async (comment_id: string)=>{
        const res = await httpClient.delete<CommunityApproveRejectDeleteResponse>(`/api/community/comment?comment_id=${comment_id}`, {
            headers: {useAuth: true},
        });
        return res.data;
    },

  likeComment: async (data: LikeDislikePayload) => {
    const res = await httpClient.put<LikeDislikeCommunity>(
      "/api/community/like",
      data,
      {
        headers: { useAuth: true },
      }
    );
    return res.data;
  },

  dislikeComment: async (data: LikeDislikePayload) => {
    const res = await httpClient.put<LikeDislikeCommunity>(
      "/api/community/dislike",
      data,
      {
        headers: { useAuth: true },
      }
    );
    return res.data;
  },
};
