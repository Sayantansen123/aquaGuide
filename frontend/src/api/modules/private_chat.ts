import httpClient from "../axiosSetup";
import {
  CreatePrivateConversationResponse,
  PrivateMessagesResponse,
  PrivateConversation,
} from "../apiTypes";

export const privateChatApi = {
  create: (id: string) =>
    httpClient.post<CreatePrivateConversationResponse>(
      "/api/conversation/private",
      { targetUserId: id },
      {
        headers: { useAuth: true },
      }
    ),

  getMessages: (conversationId: string, page: number = 1) =>
    httpClient.get<PrivateMessagesResponse>(
      `/api/conversation/private/${conversationId}/messages`,
      {
        params: { page, limit: 20 },
        headers: { useAuth: true },
      }
    ),

  getConversations: () =>
    httpClient.get<{
      success: boolean;
      data: PrivateConversation[];
    }>("/api/conversation/private/list", {
      headers: { useAuth: true },
    }),
};
