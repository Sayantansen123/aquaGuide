import { CommunityApproveRejectDeleteResponse, CommunityForumDetailResponse, CommunityForumPayload, getAllCommunityForum, LikeDislikeCommunity, LikeDislikePayload } from "../apiTypes";
import httpClient from "../axiosSetup";


export const Community_forum_api = {
    create: (data: CommunityForumPayload) =>
    httpClient.post<CommunityForumDetailResponse>("/api/community/add_community_forum", data, {
      headers: { useAuth: true },
    }),
}

export const get_all_community_forums = {
    getAllCommunityForums: () =>
        httpClient.get<getAllCommunityForum>("/api/community/get_all_community_forum",{
            headers: {useAuth: true},
        }),
}

export const get_all_approved_community_forums = {
    getAllApprovedCommunityForums: ()=>
        httpClient.get<getAllCommunityForum>("/api/community/get_all_approved_community_forum")
}

export const get_community_forum_by_id = {
    getCommunityforumByid: (id: string)=>
        httpClient.get<CommunityForumDetailResponse>(`/api/community/get_community_forum_by_id/${id}`)
}

export const approve_community = {
    approveCommunity: (forum_id: string)=>
        httpClient.put<CommunityApproveRejectDeleteResponse>(`/api/community/approve_community?forum_id=${forum_id}`,{
            headers: {useAuth: true},
        })
}

export const reject_community = {
    rejectCommunity: (forum_id: string)=>
         httpClient.put<CommunityApproveRejectDeleteResponse>(`/api/community/reject_community?forum_id=${forum_id}`,{
            headers: {useAuth: true},
        })
}

export const approve_rejection_request = {
    approveRejectionRequest: (forum_id: string)=>
        httpClient.put<CommunityApproveRejectDeleteResponse>(`/api/community/approve_rejection_request?forum_id=${forum_id}`,{
            headers: {useAuth: true},
        })
}

export const delete_community_forum = {
    deleteCommunityForum: (forum_id: string)=>
        httpClient.delete<CommunityApproveRejectDeleteResponse>(`/api/community/delete_community_forum?forum_id=${forum_id}`,{
            headers: {useAuth: true},
        })
}

export const delete_comment = {
    deleteComment: (comment_id: string)=>
        httpClient.delete<CommunityApproveRejectDeleteResponse>(`/api/community/comment?comment_id=${comment_id}`,{
            headers: {useAuth: true},
        })
}

export const like_comment = {
    likeComment: (data: LikeDislikePayload)=>
        httpClient.put<LikeDislikeCommunity>(`/api/community/like`,data, {
            headers: {useAuth: true},
        })
}

export const dislike_comment = {
    likeComment: (data: LikeDislikePayload)=>
        httpClient.put<LikeDislikeCommunity>(`/api/community/dislike`,data, {
            headers: {useAuth: true},
        })
}