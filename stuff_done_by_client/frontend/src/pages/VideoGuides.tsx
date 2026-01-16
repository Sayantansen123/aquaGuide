import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CircularLoader from "@/components/ui/CircularLoader";
import { useVideoUsers } from "@/hooks/useVideoUsers";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useState } from "react";

const videos = [
  {
    id: 1,
    title: "Setting Up Your First Aquarium",
    duration: "15:30",
    views: "25K",
    thumbnail: "🐠",
  },
  {
    id: 2,
    title: "Understanding the Nitrogen Cycle",
    duration: "12:45",
    views: "18K",
    thumbnail: "♻️",
  },
  {
    id: 3,
    title: "Aquascaping for Beginners",
    duration: "20:15",
    views: "32K",
    thumbnail: "🌿",
  },
  {
    id: 4,
    title: "Breeding Betta Fish",
    duration: "18:20",
    views: "15K",
    thumbnail: "🐟",
  },
  {
    id: 5,
    title: "Planted Tank Maintenance",
    duration: "14:50",
    views: "22K",
    thumbnail: "🌱",
  },
  {
    id: 6,
    title: "Common Fish Diseases",
    duration: "16:40",
    views: "28K",
    thumbnail: "🏥",
  },
  {
    id: 7,
    title: "Water Parameters Explained",
    duration: "13:25",
    views: "19K",
    thumbnail: "💧",
  },
  {
    id: 8,
    title: "Advanced CO2 Systems",
    duration: "22:10",
    views: "12K",
    thumbnail: "⚗️",
  },
];

const VideoGuides = () => {
  const [page, setPage] = useState(1);
  const { data, isError, isLoading } = useVideoUsers(page);
  const videoArray = data?.videos || [];
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Video Guides</h1>
        <p className="text-lg sm:text-xl text-muted-foreground">
          Learn from expert aquarists with our comprehensive video tutorials
        </p>
      </div>
      {isLoading ? (
        <CircularLoader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videoArray.map((video) => (
            <Card
              key={video.id}
              className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
              onClick={() => {
                window.open(
                  `${video.youtubeLink}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              <CardHeader className="p-0">
                <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.videoId}`}
                    title="Video preview"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg mb-2">{video.title}</CardTitle>
                {/* <CardDescription>{video.views} views</CardDescription> */}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-2 sm:gap-4 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="flex items-center gap-1 sm:gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base font-medium">
          <span className="px-2 py-1 bg-primary text-primary-foreground rounded-md min-w-[2rem] text-center">
            {page}
          </span>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">{totalPages}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="flex items-center gap-1 sm:gap-2"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default VideoGuides;
