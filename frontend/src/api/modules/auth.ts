import httpClient from "@/api/axiosSetup";

import {
  LoginPayload,
  RegisterPayload,
  LoginResponse,
  RegisterResponse,
  UpdatePasswordResponse,
  UpdatePasswordPayload,
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
};
