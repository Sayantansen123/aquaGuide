import {
  CommentPayload,
  CommentResponse,
  approvalIds,
  CommunityApproveRejectDeleteResponse,
  CommunityForumDetailResponse,
  CommunityForumPayload,
  getAllCommunityForum,
  LikeDislikeCommunity,
  LikeDislikePayload,
} from "../apiTypes";
import httpClient from "../axiosSetup";
import { COMMUNITY_URLS } from "../urls";


export const community_forum_api = {
    create: async(data: CommunityForumPayload) =>{
        const res = await httpClient.post<CommunityForumDetailResponse>(COMMUNITY_URLS.ADD_FORUM, data, {
            headers: { useAuth: true },
        });
        return res.data;
    },

    getAllCommunityForums: async (page: number) => {
        const res = await httpClient.get<getAllCommunityForum>(`${COMMUNITY_URLS.GET_ALL}?page=${page}`, {
            headers: {useAuth: true},
        });
        return res.data;
    },

    getAllApprovedCommunityForums: async (page: number): Promise<getAllCommunityForum> => {
        const res = await httpClient.get<getAllCommunityForum>(`${COMMUNITY_URLS.GET_ALL_APPROVED}?page=${page}`);
        return res.data;
    },

    getCommunityforumByid: async (id: string)=>{
        const res = await httpClient.get<CommunityForumDetailResponse>(`${COMMUNITY_URLS.GET_BY_ID(id)}`);
        return res.data;
    },

    approveCommunity: async (data: approvalIds)=>{
        const res = await httpClient.put<CommunityApproveRejectDeleteResponse>(`${COMMUNITY_URLS.APPROVE}`,data,{
            headers: {useAuth: true},
        });
        return res.data;
    },

  rejectCommunity: async (data: approvalIds) => {
    const res = await httpClient.put<CommunityApproveRejectDeleteResponse>(
      `${COMMUNITY_URLS.REJECT}`,
      data,
      {
        headers: { useAuth: true },
      }
    );
    return res.data;
  },

    approveRejectionRequest: async (forum_id: string)=>{
        const res = await httpClient.put<CommunityApproveRejectDeleteResponse>(`${COMMUNITY_URLS.APPROVE_REJECTION(forum_id)}`,{
            headers: {useAuth: true},
        });
        return res.data;
    },

  deleteCommunityForum: async (data: approvalIds) => {
    const res = await httpClient.post<CommunityApproveRejectDeleteResponse>(
      `${COMMUNITY_URLS.DELETE_FORUM}`,
      data,
      {
        headers: { useAuth: true },
      }
    );
    return res.data;
  },

    deleteComment: async (comment_id: string)=>{
        const res = await httpClient.delete<CommunityApproveRejectDeleteResponse>(`${COMMUNITY_URLS.DELETE_COMMENT(comment_id)}`, {
            headers: {useAuth: true},
        });
        return res.data;
    },

  likeCommunity: async (data: LikeDislikePayload) => {
    const res = await httpClient.put<LikeDislikeCommunity>(
      `${COMMUNITY_URLS.LIKE}`,
      data,
      {
        headers: { useAuth: true },
      }
    );
    return res.data;
  },

  dislikeCommunity: async (data: LikeDislikePayload) => {
    const res = await httpClient.put<LikeDislikeCommunity>(
      `${COMMUNITY_URLS.DISLIKE}`,
      data,
      {
        headers: { useAuth: true },
      }
    );
    return res.data;
  },
  addComment: async (data: CommentPayload, forum_id: string) => {
    const res = await httpClient.post<CommentResponse>(
      `${COMMUNITY_URLS.ADD_COMMENT(forum_id)}`,
      data,
      { headers: { useAuth: true } }
    );
    return res.data;
  },
};