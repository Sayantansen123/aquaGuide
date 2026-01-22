import httpClient from "./axiosSetup";
import { supportChatResponse } from "./apiTypes";

export interface SupportChatMessage {
    id: string;
    support_chat_id: string;
    sender_id: string;
    message: string;
    created_at: string;
    updated_at: string;
}

export interface SupportChat {
    id: string;
    initiated_by: string;
    description: string;
    is_accepted: boolean;
    created_at: string;
    updated_at: string;
    initiator?: {
        id: string;
        name: string;
        userid: string;
    };
}

export interface GetSupportChatsResponse {
    success: boolean;
    chats: SupportChat[];
}

export interface GetSupportMessagesResponse {
    success: boolean;
    messages: SupportChatMessage[];
}

/**
 * Start a new support chat (user only)
 */
export const startSupportChat = async (description: string) => {
    const response = await httpClient.post<supportChatResponse>(
        "/api/support/chat/start",
        { description },
        {
            headers: {
                useAuth: true,
                "Content-Type": "application/json"
            }
        }
    );
    return response.data;
};

/**
 * Get all accepted support chats (admin/support only)
 */
export const getSupportChats = async () => {
    const response = await httpClient.get<GetSupportChatsResponse>(
        "/api/support/chat/get_all_chats",
        {
            headers: {
                useAuth: true
            }
        }
    );
    return response.data;
};

/**
 * Get unaccepted/pending chat requests (admin/support only)
 */
export const getUnacceptedChats = async () => {
    const response = await httpClient.get<GetSupportChatsResponse>(
        "/api/support/chat/get_new_requests",
        {
            headers: {
                useAuth: true
            }
        }
    );
    return response.data;
};

/**
 * Accept a support chat request (admin/support only)
 */
export const acceptSupportChat = async (chatId: string) => {
    const response = await httpClient.put<{ success: boolean; message: string }>(
        `/api/support/chat/accept_chat/${chatId}`,
        {},
        {
            headers: {
                useAuth: true
            }
        }
    );
    return response.data;
};

/**
 * Admin takeover of a chat
 */
export const takeoverChat = async (chatId: string) => {
    const response = await httpClient.post<{ success: boolean; message: string }>(
        `/api/support/chat/takeover/${chatId}`,
        {},
        {
            headers: {
                useAuth: true
            }
        }
    );
    return response.data;
};

/**
 * Get messages for a specific chat
 */
export const getSupportChatMessages = async (chatId: string) => {
    const response = await httpClient.get<GetSupportMessagesResponse>(
        `/api/support/chats/messages/${chatId}`,
        {
            headers: {
                useAuth: true
            }
        }
    );
    return response.data;
};
export const getMySupportChats = async () => {
    const response = await httpClient.get<GetSupportChatsResponse>(
        "/api/support/chats/my_chats",
        {
            headers: { useAuth: true }
        }
    );
    return response.data;
};
