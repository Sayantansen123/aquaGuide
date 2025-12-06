import httpClient from "@/api/axiosSetup";

import {
  LoginPayload,
  RegisterPayload,
  LoginResponse,
  RegisterResponse,
  UpdatePasswordResponse,
  UpdatePasswordPayload,
  UserDetailsResponse,
  RoleResponse,
} from "@/api/apiTypes";

export const authApi = {
  register: (data: RegisterPayload) =>
    httpClient.post<RegisterResponse>("/api/auth/signup", data, {
      headers: { useAuth: true },
    }),

  login: (data: LoginPayload) =>
    httpClient.post<LoginResponse>("/api/auth/login", data, {
      headers: { useAuth: true },
    }),

  logout: () =>
    httpClient.post<string>("/api/auth/logout", {
      headers: { useAuth: true },
    }),

  updatePassword: (data: UpdatePasswordPayload) =>
    httpClient.put<UpdatePasswordResponse>("/api/auth/update-password", data, {
      headers: { useAuth: true },
    }),

  getUser: () =>
    httpClient.get<UserDetailsResponse>("/api/auth/user-details", {
      headers: { useAuth: true },
    }),

  getRole: (userid: string) =>
    httpClient.get<RoleResponse>(`/api/auth/getrole?userid=${userid}`, {
      headers: { useAuth: true },
    }),
};
