import { TextGuide } from "@/api/apiTypes";
import { textApi } from "@/api/modules/text";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTextGuidePublic } from "@/hooks/useTextGuidePublic";
import { BookOpen, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const iconArray = ["🐠", "💧", "🏥", "🌿", "🌱", "🥚", "🌍"];

const guides = [
  {
    id: 1,
    title: "Complete Beginner's Guide to Fishkeeping",
    category: "Beginner",
    readTime: "15 min",
    icon: "🐠",
  },
  {
    id: 2,
    title: "The Ultimate Guide to Water Chemistry",
    category: "Water Parameters",
    readTime: "20 min",
    icon: "💧",
  },
  {
    id: 3,
    title: "Aquascaping 101: Create Stunning Underwater Landscapes",
    category: "Aquascaping",
    readTime: "25 min",
    icon: "🌿",
  },
  {
    id: 4,
    title: "Fish Health and Disease Prevention",
    category: "Health",
    readTime: "18 min",
    icon: "🏥",
  },
  {
    id: 5,
    title: "Setting Up a Planted Aquarium",
    category: "Plants",
    readTime: "22 min",
    icon: "🌱",
  },
  {
    id: 6,
    title: "Advanced Breeding Techniques",
    category: "Breeding",
    readTime: "30 min",
    icon: "🥚",
  },
  {
    id: 7,
    title: "Choosing the Right Filter System",
    category: "Equipment",
    readTime: "12 min",
    icon: "⚙️",
  },
  {
    id: 8,
    title: "Creating a Biotope Aquarium",
    category: "Advanced",
    readTime: "28 min",
    icon: "🌍",
  },
];

const TextGuides = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useTextGuidePublic(page);
  const textGuidesArray: TextGuide[] = data?.data || [];
  const navigate = useNavigate();

  const handleTextNavigate = (id: string) => {
    navigate(`/view/text/${id}`);
  };
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
    </div>
  );
};

export default TextGuides;
