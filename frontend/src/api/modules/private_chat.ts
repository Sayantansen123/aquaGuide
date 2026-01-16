import httpClient from "../axiosSetup";

export const privateChatApi = {
  create: (id: string) =>
    httpClient.post<any>(
      "/api/conversation/private",
      { targetUserId: id },
      {
        headers: { useAuth: true },
      }
    ),
};
