export interface RegisterPayload {
  name: string;
  email: string;
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
