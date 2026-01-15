import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Calendar,
  Bell,
  Camera,
  Lock,
  MessageSquare,
  Reply,
  Heart,
  Bookmark,
  Video,
  FileText,
  Star,
} from "lucide-react";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import { toast } from "sonner";
import { User as UserField } from "@/api/apiTypes";
import { authApi } from "@/api/modules/auth";
import UploadPictureModal from "@/components/UploadPictureModal";
import CircularLoader from "@/components/ui/CircularLoader";

const Profile = () => {
  const { name, email } = useSelector((state: RootState) => state.user);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploadPictureOpen, setIsUploadPictureOpen] = useState(false);

  function formatMonthYear(isoDate: string): string {
    const date = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
    };
    return date.toLocaleDateString("en-US", options);
  }

  const handleUploadPicture = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImage(e.target?.result as string);
      toast.success("Profile picture updated successfully!");
    };
    reader.readAsDataURL(file);
  };

  const [userDetails, setUserDetails] = useState<any>({
    id: "N/A",
    userid: "",
    name: "N/A",
    email: "N/A",
    dob: "N/A", // ISO date string, e.g. "1990-01-01"
    gender: "male",
    role: "user",
    status: "active",
    community_rating: 0,
    createdAt: "N/A", // ISO date string
    videos_posted: 0,
    articles_posted: 0,
  });

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const res = await authApi.getUser();
        setUserDetails(res?.data);
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed get user details";

        toast.error(message); // ✅ show error
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  // Mock data for activity and contributions
  const activityData = {
    postsCreated: 0,
    postsReplied: 0,
    postsCommented: 0,
    postsFollowed: 0,
  };

  const memberSince = "January 2024";

  const handleSubscribe = () => {
    setIsSubscribed(true);
    toast.success("Successfully subscribed to newsletter!");
  };

  return (
    <>
      {loading ? (
        <div className="h-[80vh] flex items-center justify-center">
          <CircularLoader />
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <h1 className="text-3xl font-bold ocean-gradient bg-clip-text text-transparent mb-8">
            My Profile
          </h1>

          {/* Profile Header Card */}
          <Card className="mb-6 glass-effect">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-primary/20">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                    onClick={() => setIsUploadPictureOpen(true)}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="space-y-3">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-lg">
                        {name || "Aquarist"} ( {userDetails?.userid || "N/A"} )
                      </span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {email || "user@example.com"}
                      </span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Member since {formatMonthYear(userDetails.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Newsletter:{" "}
                      </span>
                      {isSubscribed ? (
                        <Badge
                          variant="secondary"
                          className="bg-green-500/20 text-green-600"
                        >
                          Subscribed
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-muted text-muted-foreground"
                          >
                            Not subscribed
                          </Badge>
                          <Button
                            size="sm"
                            variant="ocean"
                            onClick={handleSubscribe}
                          >
                            Subscribe
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsUploadPictureOpen(true)}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Update Picture
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsChangePasswordOpen(true)}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity & Contributions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Activity Overview */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Activity Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-full bg-primary/10">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {activityData.postsCreated}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Posts Created
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Reply className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {activityData.postsReplied}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Posts Replied
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Heart className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {activityData.postsCommented}
                      </p>
                      <p className="text-xs text-muted-foreground">Comments</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Bookmark className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {activityData.postsFollowed}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Posts Followed
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Contributions */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Star className="h-5 w-5 text-primary" />
                  User Contributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Video className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">Videos Posted</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {userDetails?.videos_posted || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">Articles Posted</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {userDetails?.articles_posted || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Star className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">Community Rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold">
                        {userDetails?.community_rating || 0}
                      </span>
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <ChangePasswordModal
            open={isChangePasswordOpen}
            onOpenChange={setIsChangePasswordOpen}
          />

          <UploadPictureModal
            isOpen={isUploadPictureOpen}
            onClose={() => setIsUploadPictureOpen(false)}
            onUpload={handleUploadPicture}
          />
        </div>
      )}
    </>
  );
};

export default Profile;
