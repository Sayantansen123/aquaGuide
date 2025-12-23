import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, Eye } from "lucide-react";
import { useCommunityForumPublic } from "@/hooks/useCommunityForumPublic";


let page_number = 1;


const CommunityForum = () => {

  const{
  data,
  isLoading,
  isError,
  }= useCommunityForumPublic(page_number++);

  const forumPosts = data?.data??[];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Community Forum</h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-6">
          Ask questions, share advice, and showcase your aquariums! Join discussions with other hobbyists – friendly, helpful, and all about fishkeeping.
        </p>
        <Button variant="ocean" size="lg" className="w-full sm:w-auto">Start a Discussion</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {forumPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg sm:text-xl hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Posted by {post.creator_id}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">{post.replies} replies</span>
                    <span className="sm:hidden">{post.replies}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    <span className="hidden sm:inline">{post.likes} likes</span>
                    <span className="sm:hidden">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">{post.views} views</span>
                    <span className="sm:hidden">{post.views}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityForum;
