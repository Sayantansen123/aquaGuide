import { useState } from "react";
import { MessageCircle, X, Send, Minus } from "lucide-react";
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

interface Message {
    id: number;
    text: string;
    sender: "user" | "support";
    timestamp: Date;
}

const SupportChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Hello! How can we help you today?",
            sender: "support",
            timestamp: new Date(),
        },
    ]);
    const [inputVal, setInputVal] = useState("");
    const [isHovered, setIsHovered] = useState(false);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSend = () => {
        if (!inputVal.trim()) return;

        const newMessage: Message = {
            id: Date.now(),
            text: inputVal,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages([...messages, newMessage]);
        setInputVal("");

        // Simulate auto-reply for now
        setTimeout(() => {
            const reply: Message = {
                id: Date.now() + 1,
                text: "Thanks for your message. An agent will be with you shortly.",
                sender: "support",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, reply]);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-end flex-col gap-4">
            {/* Chat Window */}
            {isOpen && (
                <Card className="w-[90vw] sm:w-[350px] shadow-2xl border-primary/20 animate-in slide-in-from-bottom-10 fade-in duration-300">
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
                                    <span className="text-[10px] opacity-90 font-medium">
                                        Online
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-primary-foreground hover:bg-white/20"
                                onClick={() => setIsOpen(false)}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <ScrollArea className="h-[350px] p-4 bg-muted/30">
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
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <CardFooter className="p-3 bg-background border-t pt-3">
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
                    </CardFooter>
                </Card>
            )}

            {/* Floating Action Button */}
            <Button
                onClick={toggleChat}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={cn(
                    "h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95",
                    isOpen ? "bg-destructive hover:bg-destructive/90 rotate-90" : "bg-primary"
                )}
            >
                {isOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <MessageCircle className={cn("h-6 w-6", isHovered && "animate-pulse")} />
                )}
            </Button>
        </div>
    );
};

export default SupportChat;
