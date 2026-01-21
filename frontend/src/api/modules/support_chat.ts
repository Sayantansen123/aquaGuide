import { get } from "http";
import { supportChatResponse } from "../apiTypes";
import httpClient from "../axiosSetup";


export const supportChatApi = {
    createSupportChat: () => httpClient.post<supportChatResponse>(
        "/api/support/chat/start",
        {headers: {useAuth: true}})
    }

    getSupportChats: async () =>