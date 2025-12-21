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
