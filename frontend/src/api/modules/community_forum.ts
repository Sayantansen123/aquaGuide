import {
  CommunityApproveRejectDeleteResponse,
  CommunityForumDetailResponse,
  CommunityForumPayload,
  getAllCommunityForum,
  LikeDislikeCommunity,
  LikeDislikePayload,
} from "../apiTypes";
import httpClient from "../axiosSetup";

const BACKEND_URL = import.meta.env.VITE_BASE_URL_DEV;

export const community_forum_api = {
  create: async (data: CommunityForumPayload) => {
    const res = await httpClient.post<CommunityForumDetailResponse>(
      `${BACKEND_URL}/api/community/add_community_forum`,
      data,
      {
        headers: { useAuth: true },
      }
    );
    return res.data;
  },

  getAllCommunityForums: async (page: number) => {
    const res = await httpClient.get<getAllCommunityForum>(
      `${BACKEND_URL}/api/community/get_all_community_forum?page=${page}`,
      {
        headers: { useAuth: true },
      }
    );
    return res.data;
  },

  getAllApprovedCommunityForums: async (
    page: number
  ): Promise<getAllCommunityForum> => {
    console.log(BACKEND_URL);
    const res = await httpClient.get<getAllCommunityForum>(
      `${BACKEND_URL}/api/community/get_all_approved_community_forum?page=${page}`
    );
    return res.data;
  },

  getCommunityforumByid: async (id: string) => {
    const res = await httpClient.get<CommunityForumDetailResponse>(
      `${BACKEND_URL}/api/community/get_community_forum_by_id/${id}`
    );
    return res.data;
  },

  approveCommunity: async (forum_id: string) => {
    const res = await httpClient.put<CommunityApproveRejectDeleteResponse>(
      `${BACKEND_URL}/api/community/approve_community?forum_id=${forum_id}`,
      {
        headers: { useAuth: true },
      }
    );
    return res.data;
  },

  rejectCommunity: async (forum_id: string) => {
    const res = await httpClient.put<CommunityApproveRejectDeleteResponse>(
      `${BACKEND_URL}/api/community/reject_community?forum_id=${forum_id}`,
      {
        headers: { useAuth: true },
      }
    );
    return res.data;
  },

  approveRejectionRequest: async (forum_id: string) => {
    const res = await httpClient.put<CommunityApproveRejectDeleteResponse>(
      `${BACKEND_URL}/api/community/approve_rejection_request?forum_id=${forum_id}`,
      {
        headers: { useAuth: true },
      }
    );
    return res.data;
  },

  deleteCommunityForum: async (forum_id: string) => {
    const res = await httpClient.delete<CommunityApproveRejectDeleteResponse>(
      `${BACKEND_URL}/api/community/delete_community_forum?forum_id=${forum_id}`,
      {
        headers: { useAuth: true },
      }
    );
    return res.data;
  },

  deleteComment: async (comment_id: string) => {
    const res = await httpClient.delete<CommunityApproveRejectDeleteResponse>(
      `${BACKEND_URL}/api/community/comment?comment_id=${comment_id}`,
      {
        headers: { useAuth: true },
      }
    );
    return res.data;
  },

  likeComment: async (data: LikeDislikePayload) => {
    const res = await httpClient.put<LikeDislikeCommunity>(
      `${BACKEND_URL}/api/community/like`,
      data,
      {
        headers: { useAuth: true },
      }
    );
    return res.data;
  },

  dislikeComment: async (data: LikeDislikePayload) => {
    const res = await httpClient.put<LikeDislikeCommunity>(
      `${BACKEND_URL}/api/community/dislike`,
      data,
      {
        headers: { useAuth: true },
      }
    );
    return res.data;
  },
};
