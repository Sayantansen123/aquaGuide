import { useEffect, useState, useRef } from "react";
import { X, Send, Minus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
    connectSupportSocket,
    joinSupportChat,
    sendSupportMessage,
    onSupportMessage,
    disconnectSupportSocket,
    onChatResolved
} from "@/socket/supportSocket";
import { getSupportChatMessages, SupportChatMessage } from "@/api/support";

interface SupportChatWindowProps {
    chatId: string;
    onClose: () => void;
}

interface DisplayMessage {
    id: string;
    text: string;
    sender: "user" | "support";
    timestamp: Date;
}

const SupportChatWindow: React.FC<SupportChatWindowProps> = ({
    chatId,
    onClose,
}) => {
    const userId = localStorage.getItem("id") || "";
    const accessToken = localStorage.getItem("accessToken") || "";

    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const [inputVal, setInputVal] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [isResolved, setIsResolved] = useState(false);

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Connect socket and join chat
    useEffect(() => {
        if (!accessToken || !chatId) return;

        let isMounted = true;

        const init = async () => {
            try {
                setIsLoading(true);

                // 🔴 FETCH CHAT MESSAGES FIRST
                const response = await getSupportChatMessages(chatId);

                if (!isMounted) return;

                // ✅ NO MESSAGES IS VALID — STOP LOADING
                if (response.success && response.messages) {
                    const formatted = response.messages.map((msg) => ({
                        id: msg.id,
                        text: msg.message,
                        sender: msg.sender_id === userId ? "user" : "support",
                        timestamp: new Date(msg.created_at),
                    }));

                    setMessages(formatted);
                }

                setIsLoading(false);

                // 🔴 NOW connect socket AFTER loading
                const socket =  connectSupportSocket(accessToken);
                joinSupportChat(chatId, userId);

                onSupportMessage((msg: SupportChatMessage) => {
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: msg.id,
                            text: msg.message,
                            sender: msg.sender_id === userId ? "user" : "support",
                            timestamp: new Date(msg.created_at),
                        },
                    ]);
                });
                onChatResolved(({ chatId: resolvedId }) => {
                if (resolvedId !== chatId) return;

                console.log("[SupportChatWindow] Chat resolved");

                setIsResolved(true);
                setIsLoading(false);

                // optional system message
                setMessages((prev) => [
                    ...prev,
                    {
                    id: "resolved",
                    text: "Support has resolved this chat.",
                    sender: "support",
                    timestamp: new Date(),
                    },
                ]);

                disconnectSupportSocket();
                });


            } catch (err) {
                console.error("Failed to init chat:", err);
                setError("Failed to load messages");
                setIsLoading(false);
            }
        };

        init();

        return () => {
            isMounted = false;
            disconnectSupportSocket();
        };
    }, [chatId, accessToken, userId]);


    const handleSend = () => {
        if (isResolved) return;
        if (!inputVal.trim() || !chatId) return;

        sendSupportMessage(chatId, userId, inputVal);
        setInputVal("");
    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    return (
        <Card className="w-[90vw] sm:w-[380px] shadow-2xl border-primary/20 animate-in slide-in-from-bottom-10 fade-in duration-300">
            <CardHeader className="bg-primary text-primary-foreground p-4 rounded-t-xl flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border-2 border-white/20">
                        <AvatarImage src="/support-avatar.png" />
                        <AvatarFallback className="bg-white/20 text-white text-xs">
                            SP
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-sm font-bold">
                            AquaGuide Support
                        </CardTitle>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                            </span>
                            <span className="text-[10px] opacity-90 font-medium">Online</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-primary-foreground hover:bg-white/20"
                        onClick={onClose}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-primary-foreground hover:bg-white/20"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <ScrollArea className="h-[350px] p-4 bg-muted/30">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full text-sm text-destructive">
                            {error}
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                            No messages yet. Start the conversation!
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex max-w-[80%] flex-col gap-1",
                                        msg.sender === "user" ? "self-end items-end" : "items-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                                            msg.sender === "user"
                                                ? "bg-primary text-primary-foreground rounded-br-none"
                                                : "bg-white dark:bg-card border border-border rounded-bl-none"
                                        )}
                                    >
                                        {msg.text}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground px-1">
                                        {msg.timestamp.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </ScrollArea>
            </CardContent>

            <CardFooter className="p-3 bg-background border-t pt-3">
                {isResolved ? (
                    <div className="w-full text-center text-sm text-muted-foreground">
                        This chat has been resolved by support.
                    </div>
                ) : (
                    <form
                        className="flex w-full items-center gap-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSend();
                        }}
                    >
                        <Input
                            placeholder="Type a message..."
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 focus-visible:ring-1 bg-muted/50 border-0 focus-visible:ring-primary/20"
                            autoFocus
                        />
                        <Button
                            size="icon"
                            type="submit"
                            className="h-10 w-10 shrink-0 rounded-full shadow-sm"
                            disabled={!inputVal.trim()}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                )}
            </CardFooter>

        </Card>
    );
};

export default SupportChatWindow;
