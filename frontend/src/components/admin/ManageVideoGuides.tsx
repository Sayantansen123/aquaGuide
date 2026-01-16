import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Check, X, Trash2, Play, Youtube } from "lucide-react";
import { VideoArray, VideoPayload } from "@/api/apiTypes";
import { toast } from "sonner";
import { videoApi } from "@/api/modules/video";
import CircularLoader from "../ui/CircularLoader";

interface VideoGuide {
  id: string;
  channelIcon: string;
  thumbnail: string;
  title: string;
  status: "pending" | "approved" | "rejected";
  addedOn: string;
  category: string;
}

const mockVideos: VideoGuide[] = [
  {
    id: "1",
    channelIcon: "https://api.dicebear.com/7.x/initials/svg?seed=AQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    title: "Setting Up Your First Aquarium",
    status: "approved",
    addedOn: "2024-01-15",
    category: "Beginner",
  },
  {
    id: "2",
    channelIcon: "https://api.dicebear.com/7.x/initials/svg?seed=FT",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    title: "Advanced Filtration Systems",
    status: "pending",
    addedOn: "2024-01-12",
    category: "Equipment",
  },
  {
    id: "3",
    channelIcon: "https://api.dicebear.com/7.x/initials/svg?seed=RC",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    title: "Reef Tank Maintenance",
    status: "rejected",
    addedOn: "2024-01-10",
    category: "Saltwater",
  },
];

const categories = [
  "Beginner",
  "Equipment",
  "Freshwater",
  "Saltwater",
  "Maintenance",
  "Fish Care",
];

const ManageVideoGuides = () => {
  const [videos, setVideos] = useState<VideoGuide[]>(mockVideos);
  const [videoArray, setVideoArray] = useState<VideoArray[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [callApi, setCallApi] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? match[1] : null;
  };

  const videoId = extractVideoId(youtubeLink);

  useEffect(() => {
    const getVideos = async () => {
      try {
        const res = await videoApi.getAllVideo();
        const videoData: VideoArray[] = res?.data?.video || [];
        setVideoArray(videoData);
      } catch (error) {}
    };

    getVideos();
  }, [callApi]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedVideos(videoArray.map((v) => v.id));
      // console.log(selectedVideos);
    } else {
      setSelectedVideos([]);
    }
  };

  const handleSelectVideo = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedVideos([...selectedVideos, id]);
    } else {
      setSelectedVideos(selectedVideos.filter((vid) => vid !== id));
    }
  };

  const handleBulkAction = async (action: "approve" | "reject" | "delete") => {
    setCallApi(false);
    try {
      if (action === "delete") {
        const res = await videoApi.setDelete({
          ids: selectedVideos,
        });
        toast.success("Videos deleted successfully");
      } else if (action === "approve") {
        const res = await videoApi.setApprove({
          ids: selectedVideos,
        });
        toast.success("Videos deleted successfully");
      } else {
        const res = await videoApi.setReject({
          ids: selectedVideos,
        });
        toast.success("Videos rejected successfully");
      }
    } catch (error) {
      toast.error("Something wrong happened");
    } finally {
      setCallApi(true);
    }

    setSelectedVideos([]);
  };

  function isValidYouTubeUrl(url: string) {
    const regex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S+)?$/;

    return regex.test(url);
  }

  const handlePostVideo = async (e: any) => {
    e.preventDefault();
    setCallApi(true);
    try {
      if (!youtubeLink.trim() || !videoTitle.trim()) {
        toast.error("Please provide the required fields .");
        return;
      }

      if (!isValidYouTubeUrl(youtubeLink.trim())) {
        toast.error("Please provide a valid youtube url.");
        return;
      }

      const videoRequest: VideoPayload = {
        youtubeLink: youtubeLink,
        title: videoTitle,
        description: description,
        category: category,
      };

      const res = await videoApi.create(videoRequest);

      toast.success("Video guide uploaded succesfully");

      setYoutubeLink("");
      setVideoTitle("");
      setCategory("");
      setDescription("");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Error adding video guid ";
      toast.error(message);
    } finally {
      setCallApi(false);
    }
  };

  const getStatusBadge = (status: VideoGuide["status"]) => {
    const variants = {
      pending: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
      approved: "bg-green-500/20 text-green-600 border-green-500/30",
      rejected: "bg-red-500/20 text-red-600 border-red-500/30",
    };
    return (
      <Badge variant="outline" className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };
  if (isError)
    return (
      <div className="text-red-600">
        Failed to load guides. Please try again later.
      </div>
    );
  if (isLoading) {
    return <CircularLoader />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">
        Manage Video Guides
      </h1>

      {/* Create Video Form */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Add New Video Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="youtube-link">YouTube Video Link *</Label>
                <Input
                  id="youtube-link"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="video-title">Video Title *</Label>
                <Input
                  id="video-title"
                  placeholder="Enter video title..."
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="video-category">Category (Optional)</Label>
                <Input
                  id="video-category"
                  placeholder="Enter video category..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="video-description">
                  Description (Optional)
                </Label>
                <Textarea
                  id="video-description"
                  placeholder="Enter video description..."
                  className="min-h-[100px] resize-y"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Video Preview */}
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border flex items-center justify-center">
                {videoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="Video preview"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Youtube className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Enter a YouTube link to preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button onClick={handlePostVideo} className="w-full sm:w-auto">
            Post Video Guide
          </Button>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedVideos.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg border border-border">
          <span className="text-sm text-muted-foreground self-center mr-2">
            {selectedVideos.length} selected:
          </span>
          <Button
            size="sm"
            variant="outline"
            className="text-green-600 border-green-600 hover:bg-green-600/10"
            onClick={() => handleBulkAction("approve")}
          >
            <Check className="h-4 w-4 mr-1" /> Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-yellow-600 border-yellow-600 hover:bg-yellow-600/10"
            onClick={() => handleBulkAction("reject")}
          >
            <X className="h-4 w-4 mr-1" /> Reject
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-600/10"
            onClick={() => handleBulkAction("delete")}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      )}

      {/* Videos Table */}
      <Card className="border-border bg-card overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg">Video Guides</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {videoArray.length === 0 ? (
            <div className="text-center p-10 pb-20">No Videos to show</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          selectedVideos.length === videos.length &&
                          videos.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-12 hidden sm:table-cell">
                      Channel
                    </TableHead>
                    <TableHead className="w-24 hidden md:table-cell">
                      Thumbnail
                    </TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Added On
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Category
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videoArray.map((video) => (
                    <TableRow key={video.id} className="border-border">
                      <TableCell>
                        <Checkbox
                          checked={selectedVideos.includes(video.id)}
                          onCheckedChange={(checked) =>
                            handleSelectVideo(video.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <img
                          alt="Channel"
                          className="h-8 w-8 rounded-full"
                          src={video?.channelAvatarUrl || ""}
                        />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <a
                          href={`https://www.youtube.com/watch?v=${video.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group"
                        >
                          <div className="relative w-20 h-12 rounded overflow-hidden bg-muted">
                            <img
                              alt={video?.title || "Not available"}
                              src={`https://img.youtube.com/vi/${video.videoId}/0.jpg`}
                              className="w-full h-full object-cover"
                            />

                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Play className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        </a>
                      </TableCell>
                      <TableCell className="font-medium max-w-[120px] md:max-w-[200px] truncate">
                        {video?.title || "Not available"}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(video?.status || "pending")}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {video?.createdAt.split("T")[0] || "Not available"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="secondary">
                          {video?.category || "Aquaguide"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageVideoGuides;
