import httpClient from "@/api/axiosSetup";
import {
  approvalIds,
  getVideoResponse,
  VideoPayload,
  VideoResponse,
} from "../apiTypes";

export const videoApi = {
  create: (data: VideoPayload) =>
    httpClient.post<VideoResponse>("/videos", data, {
      headers: { useAuth: true },
    }),

  getAllVideo: () =>
    httpClient.get<getVideoResponse>("/videos", {
      headers: { useAuth: true },
    }),

  setApprove: (data: approvalIds) =>
    httpClient.put<any>("/videos/approve", data, {
      headers: { useAuth: true },
    }),

  setReject: (data: approvalIds) =>
    httpClient.put<any>("/videos/reject", data, {
      headers: { useAuth: true },
    }),

  setDelete: (data: approvalIds) =>
    httpClient.post<any>("/videos/delete", data, {
      headers: { useAuth: true },
    }),

  getVideoGuides: async (page: number): Promise<getVideoResponse> => {
    const res = await httpClient.get<getVideoResponse>(
      `/videos/public?page=${page}`,
      {
        headers: { useAuth: true },
      }
    );
    return res.data;
  },
};
