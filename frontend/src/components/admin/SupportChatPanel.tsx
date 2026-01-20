import { useState } from "react";
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

// Mock Data
type ChatStatus = "active" | "pending" | "resolved";

interface ChatSession {
    id: number;
    user: string;
    lastMessage: string;
    time: string;
    unread: number;
    online: boolean;
    avatar: string;
    status: ChatStatus;
}

const MOCK_CHATS: ChatSession[] = [
    {
        id: 1,
        user: "Alice Johnson",
        lastMessage: "I need help with my tank info.",
        time: "10:30 AM",
        unread: 2,
        online: true,
        avatar: "/avatars/alice.jpg",
        status: "active",
    },
    {
        id: 2,
        user: "Bob Smith",
        lastMessage: "Thanks for the help!",
        time: "Yesterday",
        unread: 0,
        online: false,
        avatar: "/avatars/bob.jpg",
        status: "resolved",
    },
    {
        id: 3,
        user: "Charlie Brown",
        lastMessage: "Is this fish compatiable?",
        time: "Monday",
        unread: 0,
        online: true,
        avatar: "/avatars/charlie.jpg",
        status: "pending",
    },
];

const MOCK_MESSAGES = [
    {
        id: 1,
        sender: "user",
        text: "Hi, I'm having trouble updating my tank parameters.",
        time: "10:28 AM",
    },
    {
        id: 2,
        sender: "admin",
        text: "Hello Alice! I can certainly help with that. What specific error are you seeing?",
        time: "10:29 AM",
    },
    {
        id: 3,
        sender: "user",
        text: "It just says 'Update Failed' when I click save.",
        time: "10:30 AM",
    },
];

const SupportChatPanel = () => {
    const [chats, setChats] = useState<ChatSession[]>(MOCK_CHATS);
    const [selectedChatId, setSelectedChatId] = useState(MOCK_CHATS[0].id);
    const [inputVal, setInputVal] = useState("");
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [showMobileChat, setShowMobileChat] = useState(false);

    const selectedChat = chats.find((c) => c.id === selectedChatId);

    const handleSend = () => {
        if (!inputVal.trim() || selectedChat?.status !== "active") return;
        setMessages([
            ...messages,
            {
                id: Date.now(),
                sender: "admin",
                text: inputVal,
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            },
        ]);
        setInputVal("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    const handleAcceptTicket = () => {
        setChats((prev) =>
            prev.map((chat) =>
                chat.id === selectedChatId ? { ...chat, status: "active" as ChatStatus } : chat
            )
        );
    };

    return (
        <div className="h-[calc(100vh-120px)] border rounded-xl overflow-hidden bg-background shadow-sm">
            <ResizablePanelGroup direction="horizontal" className="h-full">
                {/* Sidebar - Chat List */}
                <ResizablePanel
                    defaultSize={30}
                    minSize={25}
                    maxSize={40}
                    className={cn(
                        "transition-all duration-300 ease-in-out",
                        showMobileChat ? "hidden md:flex" : "flex"
                    )}
                >
                    <div className="h-full flex flex-col border-r bg-muted/10">
                        <div className="p-4 border-b">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search chats..."
                                    className="pl-9 bg-background"
                                />
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
                                                ? "bg-primary/10 hover:bg-primary/15"
                                                : "hover:bg-muted"
                                        )}
                                    >
                                        <div className="relative">
                                            <Avatar>
                                                <AvatarImage src={chat.avatar} />
                                                <AvatarFallback>
                                                    {chat.user.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            {chat.online && (
                                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                                            )}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-sm truncate">
                                                    {chat.user}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    {chat.status === "pending" && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="h-5 px-1.5 text-[10px] font-normal"
                                                        >
                                                            New
                                                        </Badge>
                                                    )}
                                                    <span className="text-xs text-muted-foreground">
                                                        {chat.time}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-0.5">
                                                <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                                                    {chat.lastMessage}
                                                </span>
                                                {chat.unread > 0 && (
                                                    <Badge
                                                        variant="default"
                                                        className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
                                                    >
                                                        {chat.unread}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </ResizablePanel>

                <ResizableHandle className="hidden md:flex" />

                {/* Main Chat Area */}
                <ResizablePanel
                    defaultSize={70}
                    className={cn(
                        "transition-all duration-300 ease-in-out",
                        showMobileChat ? "flex" : "hidden md:flex"
                    )}
                >
                    <div className="h-full flex flex-col w-full">
                        {/* Header */}
                        <div className="h-16 border-b flex items-center justify-between px-4 sm:px-6 bg-card/50">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden mr-1"
                                    onClick={() => setShowMobileChat(false)}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <Avatar>
                                    <AvatarImage src={selectedChat?.avatar} />
                                    <AvatarFallback>
                                        {selectedChat?.user.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold text-sm">
                                        {selectedChat?.user}
                                    </h3>
                                    <div className="flex items-center gap-1.5">
                                        <span
                                            className={cn(
                                                "h-1.5 w-1.5 rounded-full",
                                                selectedChat?.online ? "bg-green-500" : "bg-gray-300"
                                            )}
                                        ></span>
                                        <span className="text-xs text-muted-foreground">
                                            {selectedChat?.online ? "Online" : "Offline"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
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
                                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                                        <DropdownMenuItem>Block User</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">
                                            End Chat
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-6 bg-muted/5">
                            <div className="flex flex-col gap-6">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            "flex gap-3 max-w-[80%]",
                                            msg.sender === "admin" ? "self-end flex-row-reverse" : ""
                                        )}
                                    >
                                        <Avatar className="h-8 w-8 mt-1">
                                            <AvatarFallback
                                                className={
                                                    msg.sender === "admin"
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted"
                                                }
                                            >
                                                {msg.sender === "admin" ? "YOU" : "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div
                                            className={cn(
                                                "flex flex-col gap-1",
                                                msg.sender === "admin" ? "items-end" : "items-start"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                                                    msg.sender === "admin"
                                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                                        : "bg-white dark:bg-card border border-border rounded-tl-none"
                                                )}
                                            >
                                                {msg.text}
                                            </div>
                                            <div className="flex items-center gap-1 px-1">
                                                <span className="text-[10px] text-muted-foreground">
                                                    {msg.time}
                                                </span>
                                                {msg.sender === "admin" && (
                                                    <CheckCheck className="h-3 w-3 text-primary/60" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        {/* Input Area or Accept Button */}
                        <div className="p-4 border-t bg-background">
                            {selectedChat?.status === "pending" ? (
                                <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border border-primary/20">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-primary">
                                            Ticket Pending Acceptance
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            You must accept this ticket to start chatting.
                                        </span>
                                    </div>
                                    <Button onClick={handleAcceptTicket} size="sm">
                                        Accept Ticket
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Input
                                        placeholder={
                                            selectedChat?.status === "active"
                                                ? "Type your reply..."
                                                : "This chat is closed."
                                        }
                                        value={inputVal}
                                        onChange={(e) => setInputVal(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        disabled={selectedChat?.status !== "active"}
                                        className="flex-1 bg-muted/50 border-muted-foreground/20 focus-visible:ring-primary/20"
                                    />
                                    <Button
                                        onClick={handleSend}
                                        size="icon"
                                        disabled={!inputVal.trim() || selectedChat?.status !== "active"}
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default SupportChatPanel;
