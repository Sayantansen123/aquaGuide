import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  Users,
  Send,
  Menu,
  MessageCircle,
  SearchCheckIcon,
  UserPlus,
  Link,
  LogIn,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { socket } from "../socket/index";

import { Label } from "recharts";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { communityChatApi } from "@/api/modules/community_chat";
import { Checkbox } from "@/components/ui/checkbox";
import { Description } from "@radix-ui/react-toast";
import { CommunityMember, CommunitySection, User } from "@/api/apiTypes";
import CircularLoader from "@/components/ui/CircularLoader";
import { useUsers } from "@/hooks/useUsers";

const recentChats = [
  {
    id: "1",
    name: "John Aquarist",
    lastMessage: "Thanks for the help!",
    time: "5 min",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Sarah Fish Lover",
    lastMessage: "Check out my new setup!",
    time: "1 hr",
    unread: 0,
    online: true,
  },
  {
    id: "3",
    name: "Mike Tank Master",
    lastMessage: "Let's discuss water params",
    time: "2 hr",
    unread: 1,
    online: false,
  },
  {
    id: "4",
    name: "Emma Aquascaper",
    lastMessage: "Beautiful tank!",
    time: "1 day",
    unread: 0,
    online: false,
  },
  {
    id: "5",
    name: "Alex Reef Keeper",
    lastMessage: "Coral looks great!",
    time: "2 days",
    unread: 0,
    online: true,
  },
  {
    id: "6",
    name: "Chris Betta Fan",
    lastMessage: "Nice betta!",
    time: "3 days",
    unread: 0,
    online: false,
  },
];

const SidebarContent = ({
  selectedChat,
  setSelectedChat,
  communitySearch,
  setCommunitySearch,
  userSearch,
  setUserSearch,

  onSelectChat,

  onCreateCommunity,
  allCommunity,
  joinedCom,
  userArray,
}: {
  selectedChat: { id: string; name: string; type: "user" | "community" } | null;
  setSelectedChat: (
    chat: { id: string; name: string; type: "user" | "community" } | null
  ) => void;
  communitySearch: string;
  setCommunitySearch: (value: string) => void;
  userSearch: string;
  setUserSearch: (value: string) => void;

  onSelectChat?: () => void;
  onCreateCommunity: () => void;

  joinedCom: CommunityMember[];
  allCommunity: CommunitySection[];
  userArray: User[];
}) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Tabs
        defaultValue="community"
        className="flex flex-col flex-1 h-full overflow-hidden"
      >
        <div className="p-3 border-b flex-shrink-0">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="community"
              className="flex items-center gap-1.5"
            >
              <Users className="h-4 w-4" />
              Community
            </TabsTrigger>
            <TabsTrigger
              value="joincommunity"
              className="flex items-center gap-1.5"
            >
              <MessageCircle className="h-4 w-4" />
              All Community
            </TabsTrigger>
            <TabsTrigger value="user" className="flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4" />
              User
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Community Tab */}
        <TabsContent
          value="community"
          className=" flex flex-col m-0 min-h-0 overflow-hidden "
        >
          <div className="p-4 border-b flex flex-col gap-2">
            <Button
              variant="ocean"
              className="w-full"
              onClick={onCreateCommunity}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Community
            </Button>
          </div>

          <div className="p-4  flex flex-col min-h-0 ">
            <div className="relative flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search community..."
                value={communitySearch}
                onChange={(e) => setCommunitySearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <ScrollArea className="h-[100%] mt-3 ">
              <div className="space-y-1 pr-2 ">
                {joinedCom.map((community) => (
                  <div
                    key={community.community_id}
                    onClick={() => {
                      setSelectedChat({
                        id: community.community_id,
                        name: community.community.name,
                        type: "community",
                      });
                      onSelectChat?.();
                    }}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedChat?.id === community.community_id &&
                      selectedChat?.type === "community"
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-accent"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm truncate">
                        {community?.community?.name || "N/A"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate ml-6">
                      {community?.community?.description ||
                        `Welcome to ${community?.community?.name} `}
                    </p>
                    <p className="text-xs text-primary/70 ml-6">
                      {/* {community.online} online */}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        {/* joined Community Tab */}
        <TabsContent
          value="joincommunity"
          className=" flex flex-col m-0 min-h-0 overflow-hidden "
        >
          <div className="p-4 border-b flex flex-col gap-2">
            <Button
              variant="ocean"
              className="w-full"
              onClick={onCreateCommunity}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Community
            </Button>
          </div>

          <div className="p-4  flex flex-col min-h-0 ">
            <div className="relative flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search community..."
                value={communitySearch}
                onChange={(e) => setCommunitySearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <ScrollArea className="h-[100%] mt-3 ">
              <div className="space-y-1 pr-2 ">
                {allCommunity.map((community) => (
                  <div
                    key={community.id}
                    onClick={() => {
                      setSelectedChat({
                        id: community.id,
                        name: community.name,
                        type: "community",
                      });
                      onSelectChat?.();
                    }}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedChat?.id === community.id &&
                      selectedChat?.type === "community"
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-accent"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm truncate">
                        {community?.name || "N/A"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate ml-6">
                      {community?.description ||
                        `Welcome to ${community?.name} `}
                    </p>
                    <p className="text-xs text-primary/70 ml-6">
                      {/* {community.online} online */}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        {/* User Tab */}
        <TabsContent
          value="user"
          className="flex-1 flex flex-col m-0 min-h-0 overflow-hidden data-[state=active]:flex-1"
        >
          <div className="p-4 flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="relative flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search user..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <ScrollArea className="flex-1 mt-3">
              <div className="space-y-1 pr-2">
                {userArray.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => {
                      setSelectedChat({
                        id: chat.id,
                        name: chat.name,
                        type: "user",
                      });
                      onSelectChat?.();
                    }}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedChat?.id === chat.id &&
                      selectedChat?.type === "user"
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-accent"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-xs font-medium">
                              {chat.name.charAt(0)}
                            </span>
                          </div>
                          {/* {chat.online && (
                          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                        )} */}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-sm block truncate">
                            {chat.name}
                          </span>
                          <p className="text-xs text-muted-foreground truncate">
                            @{chat.userid}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {/* {chat.time} */}
                        </span>
                        {/* {chat.unread > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                          {chat.unread}
                        </span>
                      )} */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const CommunityChat = () => {
  const [selectedChat, setSelectedChat] = useState<{
    id: string;
    name: string;
    type: "user" | "community";
  } | null>({
    id: "Select",
    name: "Select Who You Want to chat",
    type: "user",
  });
  const [communitySearch, setCommunitySearch] = useState("");

  const userid = localStorage.getItem("userid");
  const id = localStorage.getItem("id");
  const [userSearch, setUserSearch] = useState("");
  const [message, setMessage] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState("");
  const [newCommunityDescription, setNewCommunityDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [joinedCom, setJoinedCom] = useState<CommunityMember[]>([]);
  const [allCommunity, setAllCommunity] = useState<CommunitySection[]>([]);
  const [communityCreated, setCommunityCreated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isMember, setIsMember] = useState<boolean>(false);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const prevScrollHeightRef = useRef(0);
  const [mesSend, setMesSend] = useState<boolean>(false);
  const topRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [userPage, setUserPage] = useState(1);
  const [memberLoading, setMemeberLoading] = useState<boolean>(false);
  const { data, isLoading, error } = useUsers(userPage, userSearch);
  const filteredUsers: User[] = data?.users || [];
  const userArray = filteredUsers.filter((user) => user.id !== id);

  const mapMessage = (msg: any) => ({
    id: msg.id,
    isMe: msg.sender?.id === id,
    sender: msg.sender?.name || "Unknown",
    content: msg.message,
    time: new Date(msg.created_at).toLocaleTimeString(),
  });

  useEffect(() => {
    if (!selectedChat?.id || selectedChat.id === "Select") return;
    const loadMessages = async () => {
      setMessages([]); // clear previous chat
      setPage(1);
      setHasMore(true);

      const res = await communityChatApi.getCommunityMessages(
        selectedChat.id,
        1
      );

      setMessages(res.data.data.map(mapMessage) || []); // oldest → newest
      setHasMore(res?.data?.pagination?.hasNextPage || false);
    };

    loadMessages();
  }, [selectedChat]);

  useEffect(() => {
    socket.emit("join-community", selectedChat.id);
  }, [selectedChat.id]);

  /**
   * Realtime listener (ONLY ONCE)
   */
  useEffect(() => {
    const handler = (msg: any) => {
      setMessages((prev) => [...prev, mapMessage(msg)]);
      console.log("send message", mapMessage(msg));
    };

    socket.on("message-received", handler);

    return () => {
      socket.off("message-received", handler);
    };
  }, []);

  const sendMessage = () => {
    socket.emit(
      "send-message",
      {
        communityId: selectedChat.id,
        message: message,
      },
      (response) => {
        console.log(response);
        setMessage("");
      }
    );
    setMesSend((prev) => !prev);
  };

  // Load more messages (pagination)
  const loadMoreMessages = async () => {
    if (!hasMore || loading) return;

    const viewport = document.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement;
    if (!viewport) return;

    setLoading(true);
    prevScrollHeightRef.current = viewport.scrollHeight;

    const nextPage = page + 1;

    try {
      const res = await communityChatApi.getCommunityMessages(
        selectedChat.id,
        nextPage
      );

      const newMessages = res.data.data.map(mapMessage);

      setMessages((prev) => [...newMessages, ...prev]);
      setPage(nextPage);
      setHasMore(res.data.pagination.hasNextPage);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Alternative: IntersectionObserver approach (more reliable)
  useEffect(() => {
    if (!topRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        console.log(
          "IntersectionObserver triggered:",
          entries[0].isIntersecting
        );
        if (entries[0].isIntersecting && hasMore && !loading) {
          console.log("🚀 LOADING MORE via IntersectionObserver");
          loadMoreMessages();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    observer.observe(topRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loading, page, selectedChat?.id]);

  // Restore scroll position after loading more messages
  useEffect(() => {
    const viewport = document.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement;
    if (!viewport || page === 1) return;

    const newScrollHeight = viewport.scrollHeight;
    viewport.scrollTop = newScrollHeight - prevScrollHeightRef.current;
  }, [messages, page]);

  useEffect(() => {
    const getJoinCommunity = async () => {
      try {
        if (!userid) {
          return;
        }
        const res = await communityChatApi.getJoinedCommunity();
        setJoinedCom(res?.data?.data || []);
        console.log(res?.data?.data);
      } catch (error) {}
    };
    getJoinCommunity();
  }, [communityCreated]);

  useEffect(() => {
    const handleAllPublicCommunity = async () => {
      try {
        const res = await communityChatApi.getAllPublicCommunity();
        setAllCommunity(res?.data?.data);
        console.log(res?.data?.data);
      } catch (error) {}
    };
    handleAllPublicCommunity();
  }, [communityCreated]);

  const handleJoinCommunity = async () => {
    try {
      const res = await communityChatApi.joinCommunity(selectedChat.id);

      setCommunityCreated((prev) => !prev);
    } catch (error) {}
  };

  useEffect(() => {
    if (selectedChat.id === "Select" || selectedChat.type === "user") return;
    const checkMember = async () => {
      setMemeberLoading(true);
      setLoading(true);
      try {
        if (!userid) {
          return;
        }
        const res = await communityChatApi.checkMember(selectedChat.id);
        setIsMember(res?.data?.member || false);
      } catch (error) {
      } finally {
        setLoading(false);
        setMemeberLoading(false);
      }
    };

    checkMember();
  }, [selectedChat, communityCreated]);

  const handleCreateCommunity = async () => {
    // TODO: Implement actual community creation
    if (!newCommunityDescription.trim() || !newCommunityName.trim()) {
      toast.error("Please give description and title");
    }
    try {
      const res = await communityChatApi.create({
        name: newCommunityName,
        description: newCommunityDescription,
        is_private: isPrivate,
      });
      toast.success("Community created successfully");
      setNewCommunityName("");
      setNewCommunityDescription("");
      setCreateModalOpen(false);
      setCommunityCreated((prev) => !prev);
    } catch (error) {
      toast.error("Something went wrong creating the community");
    }
  };

  useEffect(() => {
    if (page <= 2 && messages.length > 0 && lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "auto", block: "end" });
    }
  }, [messages, mesSend]);

  useEffect(() => {
    if (messages.length > 0 && lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "auto", block: "end" });
    }
  }, [mesSend]);
  return (
    <>
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Community</DialogTitle>
            <DialogDescription>
              Create a new community to connect with fellow aquarium
              enthusiasts.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Community Name</Label>
              <Input
                id="name"
                placeholder="Enter community name..."
                value={newCommunityName}
                onChange={(e) => setNewCommunityName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your community..."
                value={newCommunityDescription}
                onChange={(e) => setNewCommunityDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="flex gap-2 items-center pt-2">
              <Checkbox
                checked={isPrivate}
                onCheckedChange={(checked) => {
                  setIsPrivate(checked === true);
                }}
              />

              <span className="text-sm">Private Community ?</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="ocean"
              onClick={handleCreateCommunity}
              disabled={!newCommunityName.trim()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex h-[calc(100vh-130px)] min-h-[500px] border rounded-lg overflow-hidden bg-card">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-[400px] border-r flex-col bg-muted/30">
          <SidebarContent
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            communitySearch={communitySearch}
            setCommunitySearch={setCommunitySearch}
            userSearch={userSearch}
            setUserSearch={setUserSearch}
            userArray={userArray}
            joinedCom={joinedCom}
            allCommunity={allCommunity}
            onCreateCommunity={() => setCreateModalOpen(true)}
          />
        </div>

        {/* Chat Body */}

        {memberLoading ? (
          <div className="flex-1 flex flex-col justify-center">
            {" "}
            <CircularLoader />{" "}
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {selectedChat.id !== "Select" ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center gap-3">
                  {/* Mobile Menu Button */}
                  <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                      <SidebarContent
                        selectedChat={selectedChat}
                        setSelectedChat={setSelectedChat}
                        communitySearch={communitySearch}
                        setCommunitySearch={setCommunitySearch}
                        userSearch={userSearch}
                        setUserSearch={setUserSearch}
                        userArray={userArray}
                        joinedCom={joinedCom}
                        onCreateCommunity={() => setCreateModalOpen(true)}
                        allCommunity={allCommunity}
                        onSelectChat={() => setSheetOpen(false)}
                      />
                    </SheetContent>
                  </Sheet>

                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    {selectedChat.type === "community" ? (
                      <Users className="h-5 w-5 text-primary" />
                    ) : (
                      <span className="font-medium">
                        {selectedChat.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedChat.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedChat.type === "community"
                        ? "Community chat"
                        : "Online"}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4" ref={scrollRef}>
                    <div ref={topRef} className="h-1" />

                    {messages.map((msg, index) => (
                      <div
                        key={msg.id}
                        ref={
                          index === messages.length - 1 ? lastMessageRef : null
                        }
                        className={`flex ${
                          msg.isMe ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.isMe
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {!msg.isMe && (
                            <p className="text-xs font-medium mb-1 text-primary">
                              {msg.sender}
                            </p>
                          )}
                          <p className="text-sm">{msg.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.isMe
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}

                {!userid && (
                  <div className="p-4 border-t">
                    <div className="flex flex-col items-center justify-center gap-3 py-4">
                      <p className="text-muted-foreground text-sm">
                        Please login or register to participate
                      </p>
                    </div>
                  </div>
                )}

                {!memberLoading &&
                  !isMember &&
                  userid &&
                  selectedChat.type !== "user" && (
                    <div className="p-4 border-t">
                      <div className="flex flex-col items-center justify-center gap-3 py-4">
                        <p className="text-muted-foreground text-sm">
                          You haven't joined this community
                        </p>
                        <Button variant="ocean" onClick={handleJoinCommunity}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Join Community
                        </Button>
                      </div>
                    </div>
                  )}

                {!memberLoading &&
                  isMember &&
                  userid &&
                  selectedChat.type === "community" && (
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="flex-1"
                          onKeyPress={(e) =>
                            e.key === "Enter" && setMessage("")
                          }
                        />
                        <Button
                          variant="ocean"
                          size="icon"
                          onClick={sendMessage}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                {selectedChat.type === "user" && (
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1"
                        onKeyPress={(e) => e.key === "Enter" && setMessage("")}
                      />
                      <Button variant="ocean" size="icon" onClick={sendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  {/* Mobile Menu Button when no chat selected */}
                  <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="md:hidden mb-4">
                        Open Chats
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                      <SidebarContent
                        selectedChat={selectedChat}
                        setSelectedChat={setSelectedChat}
                        communitySearch={communitySearch}
                        setCommunitySearch={setCommunitySearch}
                        userSearch={userSearch}
                        setUserSearch={setUserSearch}
                        userArray={userArray}
                        joinedCom={joinedCom}
                        onCreateCommunity={() => setCreateModalOpen(true)}
                        allCommunity={allCommunity}
                        onSelectChat={() => setSheetOpen(false)}
                      />
                    </SheetContent>
                  </Sheet>
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a chat to start messaging</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CommunityChat;
