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
