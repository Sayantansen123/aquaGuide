export const COMMUNITY_URLS = {
  ADD_FORUM: "/community/add_community_forum",
  GET_ALL: "/community/get_all_community_forum",
  GET_ALL_APPROVED: "/community/get_all_approved_community_forum",
  GET_BY_ID: (id: string) => `/api/community/get_community_forum_by_id/${id}`,

  APPROVE: "/community/approve_community",
  REJECT: "/community/reject_community",
  APPROVE_REJECTION: (forum_id: string) =>
    `/api/community/approve_rejection_request?forum_id=${forum_id}`,

  DELETE_FORUM: "/community/delete_community_forum",

  DELETE_COMMENT: (comment_id: string) =>
    `/api/community/comment?comment_id=${comment_id}`,

  LIKE: "/community/like",
  DISLIKE: "/community/dislike",

  ADD_COMMENT: (forum_id: string) => `/api/community/add_comment/${forum_id}`,
};
