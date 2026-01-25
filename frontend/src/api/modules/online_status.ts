import httpClient from "../axiosSetup";
import { OnlineStatusResponse, BulkOnlineStatusResponse } from "../apiTypes";

export const onlineStatusApi = {
  getUserStatus: (userId: string) =>
    httpClient.get<OnlineStatusResponse>(`/api/auth/user/online-status/${userId}`),

  getBulkStatus: (userIds: string[]) =>
    httpClient.post<BulkOnlineStatusResponse>(
      "/api/auth/user/online-status/bulk",
      { userIds },
      { headers: { useAuth: true } }
    ),
};
