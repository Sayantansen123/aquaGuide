export interface RegisterPayload {
  name: string;
  email: string;
  userid: string;
  password: string;
  dob: string;
  gender: string;
  role: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: 1;
  name: string;
  userid: string;
  email: string;
  role: string;
  dob: string;
  gender: string;
}

export interface LoginResponse {
  message: string;
  user: RegisterResponse;
}

export interface SpeciesDictionaryResponse {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  filters: Filters;
  species: Species[];
}

export interface Species {
  id: number;
  common_name: string;
  scientific_name: string;
  family: string;
  water_type: string;
  care_level: string;
  origin: string;
}

export interface Filters {
  search: string;
  water_type: string;
  care_level: string;
  category: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePasswordResponse {
  message: string;
}

export interface UserDetailsResponse {
  id: string;
  userid: string;
  name: string;
  email: string;
  dob: string; // ISO date string, e.g. "1990-01-01"
  gender: "male" | "female" | "rather_not_say";
  role: "user" | "admin" | "support";
  status: "active" | "inactive" | "locked";
  community_rating: number;
  createdAt: string; // ISO date string
  videos_posted: number;
  articles_posted: number;
}

export interface RoleResponse {
  role: string;
}

export interface VideoPayload {
  title: string;
  youtubeLink: string;
  category?: string;
  description?: string;
}

export interface VideoResponse {
  message: string;
  video: VideoArray;
}

export interface VideoArray {
  id: string;
  title: string;
  youtubeLink: string;
  channelAvatarUrl: string;
  description: string;
  videoId: string;
  duration: number | null;
  viewCount: number;
  category: string;
  isActive: boolean;
  status: "approved" | "pending" | "rejected"; // union for safety
  submittedBy: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface approvalIds {
  ids: string[];
}

export interface getVideoResponse {
  message: string;
  video: VideoArray[];
}

export interface Guest {
  id: string;
  guest_name: string;
  ip_address: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string; // UUID
  userid: string; // username
  name: string;
  dob: string; // ISO date string (YYYY-MM-DD)
  gender: "male" | "female" | "other";
  email: string;
  password: string; // hashed password
  role: "user" | "admin" | "support";
  status: "active" | "inactive" | "locked";
  failed_login_attempts: number;
  last_seen: string; // ISO datetime string
  community_rating: number;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export interface UserDetailsResponse {
  title: string;
  users: User[];
}

export interface TextGuidePayload {
  title: string;
  content: string;
}

export interface TextGuide {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  status: "approved" | "pending" | "rejected"; // you can adjust based on your possible statuses
  authorUser: author;
  rejection_justification?: string | null;
  rejection_requested_by?: string | null;
  rejection_status?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface author {
  id: string;
  userid: string;
  email: string;
  role: "admin" | "user" | "support";
}

export interface Pagination {
  total_items: number;
  current_page: number;
  totalPages: number;
  pageSize: number;
}

export interface GetAllTextGuidesResponse {
  data: TextGuide[]; // array of guides
  pagination: Pagination; // pagination info
}

export interface SpeciesFormData {
  common_name: string;
  scientific_name: string;
  family?: string;
  origin?: string;
  water_type: string;
  min_temp?: number;
  max_temp?: number;
  min_ph?: number;
  max_ph?: number;
  min_hardness?: number;
  max_hardness?: number;
  diet_type?: string;
  care_level?: string;
  temperament?: string;
  max_size_cm?: number;
  min_tank_size_liters?: number;
  diet_info?: string;
  description?: string;
  primary_image?: string;
  breeding_difficulty?: string;
  breeding_notes?: string;
  status: string;
}

export interface AddSpeciesResponse {
  message: string;
  fish_id: string;
  common_name: string;
  scientific_name: string;
}

export interface GetSpeciesManagementResponse {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  species: SpeciesItem[];
}

export interface SpeciesItem {
  fish_id: string;
  common_name: string;
  scientific_name: string;
  family?: string;
  origin?: string;
  water_type: string;
  min_temp?: number;
  max_temp?: number;
  min_ph?: number;
  max_ph?: number;
  min_hardness?: number;
  max_hardness?: number;
  diet_type?: string;
  care_level?: string;
  temperament?: string;
  max_size_cm?: number;
  min_tank_size_liters?: number;
  diet_info?: string;
  description: string;
  primary_image?: string;
  gallery_images?: string[];
  breeding_difficulty?: string;
  breeding_notes?: string;
  views_count: number;
  created_by?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SearchSpeciesParams {
  query?: string;
  waterType?: string;
  careLevel?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface GetSearchResponse {
  query: string;
  count: number;
  results: SpeciesItem[];
}
export interface UserSummaryStatsResponse {
  success: true;
  data: {
    total_registered_users: number;
    inactive_users: number;
    active_users: number;
    locked_users: number;
    support_users: number;
    admin_users: number;
    guest_users: number;
  };
}

export interface TextGuidePayload {
  title: string;
  content: string;
}

export interface TextGuide {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  status: "approved" | "pending" | "rejected"; // you can adjust based on your possible statuses
  author: author;
  rejection_justification?: string | null;
  rejection_requested_by?: string | null;
  rejection_status?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface author {
  id: string;
  userid: string;
  email: string;
  role: "admin" | "user" | "support";
}

export interface Pagination {
  total_items: number;
  current_page: number;
  totalPages: number;
  pageSize: number;
}

export interface GetAllTextGuidesResponse {
  data: TextGuide[]; // array of guides
  pagination: Pagination; // pagination info
}


export interface CommunityForum {
  id: string;
  title: string;
  content: string;
  creator_id: string;
  likes: string[];
  dislike: string[];
  is_private: boolean;
  status: "approved" | "rejected" | "pending";
  rejection_justification: string | null;
  rejection_requested_by: string | null;
  rejection_status: "pending" | "approved" | "rejected";
  image_url: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationItem {
  id: string;
  count: number;
}

export interface PaginationMeta {
  total_items: PaginationItem[];
  total_pages: number | null;
  page_size: number;
}
export interface getAllCommunityForum{
  data: CommunityForum[];
  pagination: PaginationMeta;
}

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  forum_id: string;
  UserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityForumDetailResponse {
  message: string;
  data: CommunityForum;
  comments: Comment[];
  total_comments: number;
}

export interface CommunityApproveRejectDeleteResponse{
  message: string
}

export interface LikeDislikeCommunity{
  data: CommunityForum,
  message: string
}

export interface CommunityForumPayload{
  title: string,
  content: string
}

export interface LikeDislikePayload{
  forum_id: string
}