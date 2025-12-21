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

  getUsersData: async (): Promise<UserDetailsResponse> => {
    const res = await httpClient.get<UserDetailsResponse>(
      "/api/manage_users/manage-users",
      {
        headers: { useAuth: true },
      }
    );
    return res.data;
  },

  deactivateUser: async (userId: string): Promise<string> => {
    const res = await httpClient.post<string>(
      `/api/manage_users/user/${userId}/deactivate`,
      {}, // empty body
      {
        headers: { useAuth: true },
      }
    );

    return res.data;
  },

  activateUser: async (userId: string): Promise<string> => {
    const res = await httpClient.post<string>(
      `/api/manage_users/user/${userId}/activate`,
      {}, // empty body
      {
        headers: { useAuth: true },
      }
    );

    return res.data;
  },

  toggleSupport: async (userId: string): Promise<string> => {
    const res = await httpClient.post<string>(
      `/api/manage_users/user/${userId}/toggle_support`,
      {}, // empty body
      {
        headers: { useAuth: true },
      }
    );

    return res.data;
  },

  deleteUser: async (userId: string): Promise<string> => {
    const res = await httpClient.post<string>(
      `/api/manage_users/user/${userId}/delete`,
      {}, // empty body
      {
        headers: { useAuth: true },
      }
    );

    return res.data;
  },

  toggleAdmin: async (userId: string): Promise<string> => {
    const res = await httpClient.post<string>(
      `/api/manage_users/user/${userId}/toggle_admin`,
      {}, // empty body
      {
        headers: { useAuth: true },
      }
    );

    return res.data;
  },
};
