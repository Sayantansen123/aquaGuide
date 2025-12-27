import { TextGuide } from "@/api/apiTypes";
import { textApi } from "@/api/modules/text";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CircularLoader from "@/components/ui/CircularLoader";
import { useTextGuidePublic } from "@/hooks/useTextGuidePublic";
import { BookOpen, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const iconArray = ["🐠", "💧", "🏥", "🌿", "🌱", "🥚", "🌍"];

const TextGuides = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useTextGuidePublic(page);

  const textGuidesArray: TextGuide[] = data?.data || [];
  const totalPages: number = data?.pagination?.totalPages || 1;

  const navigate = useNavigate();

  const handleTextNavigate = (id: string) => {
    navigate(`/view/text/${id}`);
  };
  if (isLoading) return <CircularLoader />;
  if (isError)
    return (
      <div className="text-red-600">
        Failed to load guides. Please try again later.
      </div>
    );
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Text Guides</h1>
        <p className="text-lg sm:text-xl text-muted-foreground">
          Comprehensive written guides covering all aspects of fishkeeping
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {textGuidesArray.map((guide, index) => (
          <Card
            key={guide.id}
            className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
          >
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="text-4xl">{iconArray[index % 7]}</div>
                <div className="flex-1">
                  {/* <div className="text-xs font-medium text-primary mb-2">
                    {guide.category}
                  </div> */}
                  <CardTitle className="text-lg mb-2">{guide.title}</CardTitle>
                  <CardDescription className="flex  gap-2 flex-col">
                    <div>Author : {guide.authorUser.userid}</div>
                    <div>Published On : {guide.createdAt.split("T")[0]}</div>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="flex items-center gap-2 text-sm text-primary hover:underline"
                onClick={() => {
                  handleTextNavigate(guide.id);
                }}
              >
                <BookOpen className="h-4 w-4" />
                Read Guide
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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

export default TextGuides;
