import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X, Trash2, Play, RefreshCcw } from "lucide-react";
import { VideoArray, VideoPayload } from "@/api/apiTypes";
import { toast } from "sonner";
import { videoApi } from "@/api/modules/video";
import CircularLoader from "../ui/CircularLoader";
import logo from "@/assets/logo_dict.webp";

const ManageVideoGuides = () => {
  // Use 'any' as a fallback to ensure data renders even if VideoArray type is slightly different
  const [videoArray, setVideoArray] = useState<any[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);

  // Form States
  const [youtubeLink, setYoutubeLink] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  // API Control States
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  // Extract YouTube ID for the Live Player and Thumbnails
  const extractVideoId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\s?]+)/
    );
    return match ? match[1] : null;
  };
  const previewVideoId = extractVideoId(youtubeLink);

  /**
   * FETCH VIDEOS
   * Fixed to point to res.data.video (singular) based on Network Tab
   */
  const fetchVideos = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await videoApi.getAllVideo();
      console.log("API Response Debug:", res.data);

      // Your backend returns the array inside the 'video' property
      const data = res?.data?.video || res?.data?.videos || [];
      
      setVideoArray(Array.isArray(data) ? data : []);
      setIsError(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setIsError(true);
      toast.error("Failed to load videos from server");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos, refreshTrigger]);

  // Bulk Selection Logic
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedVideos(videoArray.map((v) => v.id));
    } else {
      setSelectedVideos([]);
    }
  };

  const handleSelectVideo = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedVideos((prev) => [...prev, id]);
    } else {
      setSelectedVideos((prev) => prev.filter((vid) => vid !== id));
    }
  };

  // Bulk Actions (Approve, Reject, Delete)
  const handleBulkAction = async (action: "approve" | "reject" | "delete") => {
    if (selectedVideos.length === 0) return;
    try {
      const payload = { ids: selectedVideos };
      if (action === "delete") {
        await videoApi.setDelete(payload);
        toast.success(`${selectedVideos.length} videos deleted`);
      } else if (action === "approve") {
        await videoApi.setApprove(payload);
        toast.success(`${selectedVideos.length} videos approved`);
      } else {
        await videoApi.setReject(payload);
        toast.success(`${selectedVideos.length} videos rejected`);
      }
      setSelectedVideos([]);
      setRefreshTrigger((prev) => !prev);
    } catch (error) {
      toast.error("Action failed. Please try again.");
    }
  };

  // Post Video Logic
  const handlePostVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeLink.trim() || !videoTitle.trim()) {
      toast.error("URL and Title are required.");
      return;
    }

    try {
      const videoRequest: VideoPayload = {
        youtubeLink: youtubeLink.trim(),
        title: videoTitle.trim(),
        description: description.trim(),
        category: category.trim(),
      };

      await videoApi.create(videoRequest);
      toast.success("Video guide posted!");

      // Clear Form and Refresh List
      setYoutubeLink("");
      setVideoTitle("");
      setCategory("");
      setDescription("");
      setRefreshTrigger((prev) => !prev);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error adding video");
    }
  };

  // Helper for Status UI
  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || "pending";
    const variants: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      approved: "bg-green-500/10 text-green-600 border-green-500/20",
      rejected: "bg-red-500/10 text-red-600 border-red-500/20",
    };
    return (
      <Badge variant="outline" className={`${variants[s] || variants.pending} capitalize`}>
        {s}
      </Badge>
    );
  };

  if (isError) {
    return (
      <div className="p-20 text-center">
        <p className="text-red-500 mb-4">Could not connect to the video database.</p>
        <Button onClick={() => setRefreshTrigger(!refreshTrigger)}>
          <RefreshCcw className="mr-2 h-4 w-4" /> Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Manage Video Guides</h1>
        <Button variant="outline" size="sm" onClick={() => setRefreshTrigger(!refreshTrigger)}>
           <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* CREATE VIDEO FORM */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader><CardTitle className="text-lg">Add New Video Guide</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>YouTube Video Link *</Label>
                <Input 
                  placeholder="https://www.youtube.com/watch?v=..." 
                  value={youtubeLink} 
                  onChange={(e) => setYoutubeLink(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Video Title *</Label>
                <Input 
                  placeholder="Enter video title..." 
                  value={videoTitle} 
                  onChange={(e) => setVideoTitle(e.target.value)} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label>Category</Label>
                    <Input placeholder="e.g. Tutorial" value={category} onChange={(e) => setCategory(e.target.value)} />
                 </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  className="min-h-[80px]" 
                  placeholder="Optional details..." 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                />
              </div>
              <Button onClick={handlePostVideo} className="w-full">Post Video Guide</Button>
            </div>

            <div className="space-y-2">
              <Label>Live Player Preview</Label>
              <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border flex items-center justify-center shadow-inner relative">
                {previewVideoId ? (
                  <iframe 
                    src={`https://www.youtube-nocookie.com/embed/${previewVideoId}`} 
                    className="w-full h-full" 
                    allowFullScreen 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center opacity-20 grayscale text-center p-4">
                    <img src={logo} className="h-16 mb-2" />
                    <p className="text-xs font-bold uppercase tracking-widest">Preview Mode</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* BULK SELECTION ACTIONS */}
      {selectedVideos.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20 animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-medium self-center px-2 border-r mr-2">
            {selectedVideos.length} Selected
          </span>
          <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50" onClick={() => handleBulkAction("approve")}>
            <Check className="h-4 w-4 mr-1" /> Approve
          </Button>
          <Button size="sm" variant="outline" className="text-yellow-600 hover:bg-yellow-50" onClick={() => handleBulkAction("reject")}>
            <X className="h-4 w-4 mr-1" /> Reject
          </Button>
          <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleBulkAction("delete")}>
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      )}

      {/* VIDEO DATABASE TABLE */}
      <Card className="border-border bg-card overflow-hidden shadow-sm">
        <CardHeader className="bg-muted/10 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Video Library</CardTitle>
          <Badge variant="secondary">{videoArray.length} Records</Badge>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading && videoArray.length === 0 ? (
            <div className="py-20 flex justify-center"><CircularLoader /></div>
          ) : videoArray.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No videos found in the database.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">
                      <Checkbox 
                        checked={selectedVideos.length === videoArray.length && videoArray.length > 0} 
                        onCheckedChange={handleSelectAll} 
                      />
                    </TableHead>
                    <TableHead className="w-40">Thumbnail</TableHead>
                    <TableHead>Video Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videoArray.map((video) => (
                    <TableRow key={video.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell className="text-center">
                        <Checkbox 
                          checked={selectedVideos.includes(video.id)} 
                          onCheckedChange={(c) => handleSelectVideo(video.id, !!c)} 
                        />
                      </TableCell>
                      <TableCell>
                        <div className="relative aspect-video rounded-md overflow-hidden bg-black shadow-sm group">
                          <img 
                            src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`} 
                            className="w-full h-full object-cover" 
                            alt="thumbnail"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="h-6 w-6 text-white fill-white" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground leading-tight mb-1">{video.title}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[200px]">{video.youtubeLink}</span>
                          {video.category && <Badge className="w-fit mt-2 h-5 text-[10px] font-normal" variant="secondary">{video.category}</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(video.status)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {video.createdAt ? new Date(video.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : "N/A"}
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