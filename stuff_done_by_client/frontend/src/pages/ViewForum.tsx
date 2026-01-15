import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Send,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { useCommunityForumbyId, useCommunityForumPublic, useCommunityForumPublicInfinite } from "@/hooks/useCommunityForumPublic";
import CircularLoader from "@/components/ui/CircularLoader";
import { community_forum_api } from "@/api/modules/community_forum";
import { useMutation, useQueryClient } from "@tanstack/react-query";


const ViewForum = () => {
  const { id } = useParams<{ id: string }>();

  const isAuthenticated = !!localStorage.getItem("accessToken");
  console.log(isAuthenticated)
  
  const redirectToLogin = () => {
  navigate("/login", {
    state: { from: location.pathname },
  });
  };

  const {data: forumResponse, isLoading: isLoadingPost, isError: isErrorPost} = useCommunityForumbyId(id!);

  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [newComment, setNewComment] = useState("");

  const {
  data: forumListData,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading: isForumListLoading,
  isError: isForumListError,
} = useCommunityForumPublicInfinite();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: (type: "up" | "down") => {
      if (type === "up") {
        return community_forum_api.likeCommunity({ forum_id: id! });
      } else {
        return community_forum_api.dislikeCommunity({ forum_id: id! });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["communityForumbyId", id],
      });
    },
  })

  const addCommentMutation = useMutation({
  mutationFn: (content: string) =>
    community_forum_api.addComment({ content }, id!),

  onSuccess: () => {
    setNewComment("");

    queryClient.invalidateQueries({
      queryKey: ["communityForumbyId", forumPost.id],
    });
  },
});

  const forumPost = forumResponse?.data;
  const forumList = forumListData?.pages.flatMap(page => page.data) ?? [];
  const comments = forumResponse?.comments || [];

    if (isLoadingPost) {
    return <CircularLoader />;
  }

  if (isErrorPost) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">
          Failed to load the forum post. Please try again later.
        </h1>
        <Button onClick={() => navigate("/community-forum")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forum
        </Button>
      </div>
    );
  }


  if (!forumPost) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Forum post not found</h1>
        <Button onClick={() => navigate("/community-forum")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forum
        </Button>
      </div>
    );
  }



  const handlevote = (type: "up" | "down") => {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }
    setUserVote(prev => prev === type ? null : type);
    voteMutation.mutate(type);
  }

const handleSubmitComment = () => {
  if (!isAuthenticated) {
    redirectToLogin();
    return;
  }
  if (!newComment.trim()) return;

  addCommentMutation.mutate(newComment);
};
  return (
    <div className="container mx-auto px-4 py-8 lg:py-12">
      <Button
        variant="ghost"
        onClick={() => navigate("/community-forum")}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Forum
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Post Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-sm text-muted-foreground">
                  {forumPost.createdAt}
                </span>
              </div>
              <CardTitle className="text-xl sm:text-2xl">
                {forumPost.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Posted by {forumPost.Creator_Username}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed" dangerouslySetInnerHTML={{__html: forumPost.content}}/>
              {/* Vote Section */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant={userVote === "up" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlevote("up")}
                  className="gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{forumPost.likes.length}</span>
                </Button>
                <Button
                  type="button"
                  variant={userVote === "down" ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => handlevote("down")}
                  className="gap-2"
                >
                  <ThumbsDown className="h-4 w-4" onClick={() => handlevote("down")} />
                  <span>{forumPost.dislike.length}</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comment Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5" />
                Comments ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Comment */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 min-h-[80px]"
                />
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || addCommentMutation.isPending}
                  className="self-end"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Post
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-4 pt-4 border-t">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-medium text-sm">
                        {comment.UserId}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        • {comment.createdAt}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{comment.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Other Forums */}
        <div className="lg:col-span-1">
          <Card className="lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle className="text-base">Other Discussions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {isForumListLoading && <p>Loading other discussions...</p>}
              {isForumListError && <p>Error loading discussions</p>}

              {forumList.map((p) => (
                <Link key={p.id} to={`/view/forum/${p.id}`} className="block p-3 rounded-md hover:bg-accent transition-colors">
                  <p className="text-sm font-medium line-clamp-2 mb-1">{p.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{p.createdAt}</span>
                  </div>
                </Link>
              ))}
                {isFetchingNextPage && <CircularLoader />}
                {hasNextPage && !isFetchingNextPage && (
                  <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => fetchNextPage()}>
                    Load More
                  </Button>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewForum;
