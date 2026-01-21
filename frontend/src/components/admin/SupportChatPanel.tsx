import { useEffect, useState, useRef } from "react";
import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  CheckCheck,
  ArrowLeft,
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
import { cn } from "@/lib/utils";

import {
  connectSupportSocket,
  joinSupportChat,
  sendSupportMessage,
  onSupportMessage,
  disconnectSupportSocket,
} from "@/socket/supportSocket";

type ChatStatus = "active" | "pending" | "resolved";

interface ChatSession {
  id: string;
  user: string;
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

  const [chats, setChats] = useState<ChatSession[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const selectedChat = chats.find((c) => c.id === selectedChatId);

  useEffect(() => {
    if (!accessToken) return;

    connectSupportSocket(accessToken);

    onSupportMessage((msg) => {
      setMessages((prev) => [
        ...prev,
        {
          id: msg.id,
          sender: msg.sender_id === userId ? "admin" : "user",
          text: msg.message,
          time: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    });

    return () => {
      disconnectSupportSocket();
    };
  }, []);

  useEffect(() => {
    if (!selectedChatId || !userId) return;

    setMessages([]);
    joinSupportChat(selectedChatId, userId);
  }, [selectedChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  const handleSend = () => {
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
          <div className="h-full flex flex-col border-r bg-muted/10">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search chats..." className="pl-9 bg-background" />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="flex flex-col p-2 gap-1">
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setSelectedChatId(chat.id);
                      setShowMobileChat(true);
                    }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                      selectedChatId === chat.id
                        ? "bg-primary/10"
                        : "hover:bg-muted"
                    )}
                  >
                    <Avatar>
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback>{chat.user[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <span className="font-medium text-sm">{chat.user}</span>
                      {chat.status === "pending" && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>

        <ResizableHandle className="hidden md:flex" />

        <ResizablePanel
          defaultSize={70}
          className={cn(showMobileChat ? "flex" : "hidden md:flex")}
        >
          <div className="h-full flex flex-col w-full">
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
                    <DropdownMenuItem>End Chat</DropdownMenuItem>
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
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default SupportChatPanel;
