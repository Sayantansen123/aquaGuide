import { useEffect, useState, useRef } from "react";
import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
  Check,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import {
  connectSupportSocket,
  joinSupportChat,
  sendSupportMessage,
  onSupportMessage,
  disconnectSupportSocket,
  onChatTakenOver,
} from "@/socket/supportSocket";

import {
  getSupportChats,
  getUnacceptedChats,
  acceptSupportChat,
  getSupportChatMessages,
  SupportChat,
  SupportChatMessage,
  resolveSupportChat,
  takeoverSupportChat,
} from "@/api/support";

type ChatStatus = "active" | "pending" | "resolved";

interface ChatSession {
  id: string;
  user: string;
  description: string;
  avatar?: string;
  online: boolean;
  status: ChatStatus;
}

interface Message {
  id: string;
  sender: "admin" | "user";
  text: string;
  time: string;
}

const SupportChatPanel = () => {
  const userId = localStorage.getItem("id") || "";
  const accessToken = localStorage.getItem("accessToken") || "";

  const [activeChats, setActiveChats] = useState<ChatSession[]>([]);
  const [pendingChats, setPendingChats] = useState<ChatSession[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("active");
  const [isResolving, setIsResolving] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lockMessage, setLockMessage] = useState<string | null>(null);
  const [isTakingOver, setIsTakingOver] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const allChats = activeTab === "active" ? activeChats : pendingChats;
  const selectedChat = [...activeChats, ...pendingChats].find(
    (c) => c.id === selectedChatId
  );

  // Convert API response to ChatSession format
  const mapToChatSession = (
    chat: SupportChat,
    status: ChatStatus
  ): ChatSession => ({
    id: chat.id,
    user: chat.initiator?.name?.trim() ||
      chat.initiator?.userid?.trim() ||
      "Unknown User",
    description: chat.description || "",
    online: true,
    status,
  });

  // Fetch chats from API
  const fetchChats = async () => {
    try {
      setIsLoading(true);
      const [activeRes, pendingRes] = await Promise.all([
        getSupportChats(),
        getUnacceptedChats(),
      ]);

      if (activeRes.success) {
        setActiveChats(
          activeRes.chats.map((c) => mapToChatSession(c, "active"))
        );
      }
      if (pendingRes.success) {
        setPendingChats(
          pendingRes.chats.map((c) => mapToChatSession(c, "pending"))
        );
      }
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Accept a pending chat
  const handleAccept = async (chatId: string) => {
    try {
      setIsAccepting(chatId);
      const res = await acceptSupportChat(chatId);
      if (res.success) {
        // Move chat from pending to active
        const chat = pendingChats.find((c) => c.id === chatId);
        if (chat) {
          setPendingChats((prev) => prev.filter((c) => c.id !== chatId));
          setActiveChats((prev) => [...prev, { ...chat, status: "active" }]);
        }
        setActiveTab("active");
        setSelectedChatId(chatId);
      }
    } catch (err) {
      console.error("Failed to accept chat:", err);
    } finally {
      setIsAccepting(null);
    }
  };

  // Fetch messages for selected chat
  const fetchMessages = async (chatId: string) => {
    try {
      const res = await getSupportChatMessages(chatId);
      if (res.success && res.messages) {
        const formattedMessages = res.messages.map((msg) => ({
          id: msg.id,
          sender: msg.sender_id === userId ? "admin" : "user",
          text: msg.message,
          time: new Date(msg.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        })) as Message[];
        setMessages(formattedMessages);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };
  const handleResolveChat = async () => {
    if (!selectedChatId) return;

    try {
      setIsResolving(selectedChatId);

      const res = await resolveSupportChat(selectedChatId);
      if (res.success) {
        // remove chat from active list
        setActiveChats((prev) =>
          prev.filter((c) => c.id !== selectedChatId)
        );

        // reset UI
        setSelectedChatId(null);
        setMessages([]);
        setShowMobileChat(false);
      }
    } catch (err) {
      console.error("Failed to resolve chat:", err);
    } finally {
      setIsResolving(null);
    }
  };
  const handleTakeoverChat = async () => {
    if (!selectedChatId) return;

    try {
      setIsTakingOver(true);
      await takeoverSupportChat(selectedChatId);
      // socket event will handle locking others
    } catch (err) {
      console.error("Failed to takeover chat:", err);
    } finally {
      setIsTakingOver(false);
    }
  };

  // Initial setup
  useEffect(() => {
    if (!accessToken) return;

    const socket = connectSupportSocket(accessToken);
    fetchChats();

    onSupportMessage((msg: SupportChatMessage) => {
      setMessages((prev) => [
        ...prev,
        {
          id: msg.id,
          sender: msg.sender_id === userId ? "admin" : "user",
          text: msg.message,
          time: new Date(msg.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    });

    // ✅ HANDLE TAKEOVER
    onChatTakenOver(({ chatId, by }) => {
      if (chatId !== selectedChatId) return;

      if (by !== userId) {
        setIsLocked(true);
        setLockMessage("This chat has been taken over by an admin.");
      } else {
        // admin who took over
        setIsLocked(false);
        setLockMessage(null);
      }
    });


    return () => {
      disconnectSupportSocket();
    };
  }, [accessToken]);

  // Join chat room when selected
  useEffect(() => {
    if (!selectedChatId || !userId) return;

    setMessages([]);
    setIsLocked(false);        // ✅ RESET
    setLockMessage(null);      // ✅ RESET

    joinSupportChat(selectedChatId, userId);
    fetchMessages(selectedChatId);
  }, [selectedChatId, userId]);


  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  const handleSend = () => {
    if (isLocked) return;      // ✅ ADD
    if (!inputVal.trim() || !selectedChatId) return;

    sendSupportMessage(selectedChatId, userId, inputVal);
    setInputVal("");
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="h-[calc(100vh-120px)] border rounded-xl overflow-hidden bg-background shadow-sm">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel
          defaultSize={30}
          minSize={25}
          maxSize={40}
          className={cn(showMobileChat ? "hidden md:flex" : "flex")}
        >
          <div className="h-full flex flex-col border-r bg-muted/10 w-full">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search chats..." className="pl-9 bg-background" />
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col"
            >
              <TabsList className="mx-4 mt-2">
                <TabsTrigger value="active" className="flex-1">
                  Active ({activeChats.length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex-1">
                  Pending ({pendingChats.length})
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 mt-2">
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="flex flex-col p-2 gap-1">
                    {allChats.length === 0 ? (
                      <div className="text-center text-muted-foreground text-sm p-4">
                        {activeTab === "active"
                          ? "No active chats"
                          : "No pending requests"}
                      </div>
                    ) : (
                      allChats.map((chat) => (
                        <div
                          key={chat.id}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg text-left transition-colors cursor-pointer",
                            selectedChatId === chat.id
                              ? "bg-primary/10"
                              : "hover:bg-muted"
                          )}
                          onClick={() => {
                            if (chat.status === "active") {
                              setSelectedChatId(chat.id);
                              setShowMobileChat(true);
                            }
                          }}
                        >
                          <Avatar>
                            <AvatarImage src={chat.avatar} />
                            <AvatarFallback>{chat.user[0]}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-sm block truncate">
                              {chat.user}
                            </span>
                            <span className="text-xs text-muted-foreground truncate block">
                              {chat.description}
                            </span>
                          </div>

                          {chat.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAccept(chat.id);
                              }}
                              disabled={isAccepting === chat.id}
                            >
                              {isAccepting === chat.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Check className="h-4 w-4 mr-1" />
                                  Accept
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </ScrollArea>
            </Tabs>
          </div>
        </ResizablePanel>

        <ResizableHandle className="hidden md:flex" />

        <ResizablePanel
          defaultSize={70}
          className={cn(showMobileChat ? "flex" : "hidden md:flex")}
        >
          <div className="h-full flex flex-col w-full">
            {selectedChatId ? (
              <>
                <div className="h-16 border-b flex items-center px-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden mr-2"
                    onClick={() => setShowMobileChat(false)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>

                  <Avatar>
                    <AvatarFallback>{selectedChat?.user?.[0]}</AvatarFallback>
                  </Avatar>

                  <div className="ml-3">
                    <h3 className="font-semibold text-sm">{selectedChat?.user}</h3>
                    <span className="text-xs text-muted-foreground">
                      {selectedChat?.status}
                    </span>
                  </div>

                  <div className="ml-auto flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">

                        {/* ✅ TAKEOVER BUTTON (ADMIN ONLY) */}
                        <DropdownMenuItem
                          onClick={handleTakeoverChat}
                          disabled={isTakingOver}
                        >
                          {isTakingOver ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Taking over…
                            </span>
                          ) : (
                            "Take over chat"
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={handleResolveChat}
                          disabled={isResolving === selectedChatId}
                        >
                          {isResolving === selectedChatId ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Resolving…
                            </span>
                          ) : (
                            "Resolve Chat"
                          )}
                        </DropdownMenuItem>

                      </DropdownMenuContent>

                    </DropdownMenu>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-6">
                  <div className="flex flex-col gap-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex gap-2 max-w-[75%]",
                          msg.sender === "admin" ? "self-end flex-row-reverse" : ""
                        )}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {msg.sender === "admin" ? "YOU" : "U"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col">
                          <div
                            className={cn(
                              "rounded-xl px-4 py-2 text-sm",
                              msg.sender === "admin"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            )}
                          >
                            {msg.text}
                          </div>
                          <span className="text-[10px] text-muted-foreground mt-1">
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="p-4 border-t">
                  {isLocked ? (
                    <div className="w-full text-center text-sm text-muted-foreground">
                      {lockMessage}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your reply..."
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                      <Button onClick={handleSend} size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a chat to start messaging
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default SupportChatPanel;
