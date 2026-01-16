import httpClient from "../axiosSetup";

export const performanceApi = {
  metrices: () =>
    httpClient.get<any>("/api/performance/metrics", {
      headers: { useAuth: true },
    }),

  history: () =>
    httpClient.get<any>("/api/performance/history", {
      headers: { useAuth: true },
    }),

  summary: () =>
    httpClient.get<any>("/api/performance/summary", {
      headers: { useAuth: true },
    }),
};
