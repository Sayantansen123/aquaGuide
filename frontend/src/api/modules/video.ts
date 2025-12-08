import httpClient from "@/api/axiosSetup";
import {
  approvalIds,
  getVideoResponse,
  VideoPayload,
  VideoResponse,
} from "../apiTypes";

export const videoApi = {
  create: (data: VideoPayload) =>
    httpClient.post<VideoResponse>("/api/videos", data, {
      headers: { useAuth: true },
    }),

  getAllVideo: () =>
    httpClient.get<getVideoResponse>("/api/videos", {
      headers: { useAuth: true },
    }),

  setApprove: (data: approvalIds) =>
    httpClient.put<any>("/api/videos/approve", data, {
      headers: { useAuth: true },
    }),

  setReject: (data: approvalIds) =>
    httpClient.put<any>("/api/videos/reject", data, {
      headers: { useAuth: true },
    }),

  setDelete: (data: approvalIds) =>
    httpClient.post<any>("/api/videos/delete", data, {
      headers: { useAuth: true },
    }),
};
