import httpClient from "@/api/axiosSetup";
import {
  approvalIds,
  GetAllTextGuidesResponse,
  rejectorapproveIds,
  TextGuide,
  TextGuidePayload,
} from "../apiTypes";

export const textApi = {
  create: async (data: TextGuidePayload): Promise<any> => {
    const res = await httpClient.post("/api/textguides/text_guide", data, {
      headers: { useAuth: true },
    });
    return res.data;
  },

  getAllGuides: async (page: number): Promise<GetAllTextGuidesResponse> => {
    const res = await httpClient.get<GetAllTextGuidesResponse>(
      `/api/textguides/all_text_guides?page=${page}`,
      {
        headers: { useAuth: true },
      }
    );
    return res.data;
  },

  getAllGuidesForUser: async (
    page: number
  ): Promise<GetAllTextGuidesResponse> => {
    const res = await httpClient.get<GetAllTextGuidesResponse>(
      `/api/textguides/get_all_guides?page=${page}`,
      {
        headers: { useAuth: true },
      }
    );
    return res.data;
  },

  getTextGuideByid: async (id: string) =>
    httpClient.get<TextGuide>(`/api/textguides/get_text_guide/${id}`, {
      headers: { useAuth: true },
    }),

  setDelete: (data: approvalIds) =>
    httpClient.post<any>("/api/textguides/text_guide_delete", data, {
      headers: { useAuth: true },
    }),

  setApproveOrReject: (data: rejectorapproveIds) =>
    httpClient.put<any>("/api/textguides/approve_or_reject", data, {
      headers: { useAuth: true },
    }),
};
