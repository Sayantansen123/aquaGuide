import { DashboardStats } from "../apiTypes";
import httpClient from "../axiosSetup";

export const dashboardApi = {
  getDashStats: async () => {
    const res = await httpClient.get<DashboardStats>(
      `/api/manage_users/stats/content`,
      {
        headers: { useAuth: true },
      }
    );
    return res.data;
  },
};
