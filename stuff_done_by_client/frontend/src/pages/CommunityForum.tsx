import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, Eye } from "lucide-react";
import { useCommunityForumPublic } from "@/hooks/useCommunityForumPublic";
import { useState } from "react";
import CircularLoader from "@/components/ui/CircularLoader";
import { useNavigate } from "react-router-dom";




const CommunityForum = () => {
  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading, isError } = useCommunityForumPublic(pageNumber);

  const navigate = useNavigate();

  const forumPosts = data?.data ?? [];
  const totalPages = data?.pagination?.total_pages ?? 1;

  const handleNextPage = () => {
    if (pageNumber < totalPages) setPageNumber((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  if (isLoading) return <CircularLoader />;
  if (isError) return <div className="text-red-600">Failed to load posts. Please try again later.</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Community Forum</h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-6">
          Ask questions, share advice, and showcase your aquariums! Join discussions with other hobbyists.
        </p>
        <Button variant="ocean" size="lg" className="w-full sm:w-auto">Start a Discussion</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {forumPosts.map(post => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={()=> navigate(`/view/forum/${post.id}`)}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg sm:text-xl hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="mt-2">Posted by {post.Creator_Username}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">{post.Total_Comments} replies</span>
                    <span className="sm:hidden">{post.Total_Comments}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    <span className="hidden sm:inline">{post.likes.length} likes</span>
                    <span className="sm:hidden">{post.likes.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-between mt-6 lg:col-span-3">
          <Button onClick={handlePrevPage} disabled={pageNumber === 1} variant="secondary">
            Previous
          </Button>
          <Button onClick={handleNextPage} disabled={pageNumber >= totalPages} variant="default">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommunityForum;
