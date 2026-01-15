import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Fish,
  Thermometer,
  Droplets,
  Ruler,
  MapPin,
  Heart,
  Utensils,
  Users,
  Eye,
  Leaf,
  Loader2,
} from "lucide-react";
import { speciesApi } from "@/api/modules/species";
import RangeBar from "@/components/RangeBar";

const ViewFish = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  console.log("Fetching fish with ID:", id);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["fish", id],
    queryFn: async () => {
      return await speciesApi.getSpeciesById(id!);
    },
    enabled: !!id,
    select: (res) => res.data,
  });

  const fish = data?.species;
  const [showPhInfo, setShowPhInfo] = useState(false);
  const [phTooltipPos, setPhTooltipPos] = useState({ x: 0, y: 0 });
  const [isHoveringTooltip, setIsHoveringTooltip] = useState(false);
  const hideTimer = React.useRef<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const barRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const InfoItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
  }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
      <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  );

  const Section = ({
    icon: Icon,
    title,
    content,
  }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    content: string;
  }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{content}</p>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !fish) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-destructive mb-4">Error loading fish data.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }
  const avgPh = (Number(fish.min_ph) + Number(fish.max_ph)) / 2;
  let phNature = "Neutral";
  if (avgPh < 6.8) phNature = "Acidic";
  else if (avgPh > 7.2) phNature = "Alkaline";

  const phInfo = {
    range: `${fish.min_ph} - ${fish.max_ph}`,
    description: "Light Green - Ideal for most community fish",
    note: "Match this color when testing your aquarium water",
    link: "/phguide", // Replace with your actual link
    nature: phNature,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            {/* Left: Name, Icon, Scientific Name, Care Badge */}
            <div className="flex flex-col items-center md:items-start flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Fish className="h-8 w-8 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {fish.common_name}
                </h1>
              </div>
              <p className="text-lg text-muted-foreground italic">
                {fish.scientific_name}
              </p>
              <Badge variant="secondary" className="mt-2 self-start">
                {fish.care_level} Care
              </Badge>
            </div>
            {/* Right: Species Image */}
            {fish.primary_image && (
              <div className="flex justify-center items-center flex-shrink-0">
                <div
                  className="rounded-xl overflow-hidden shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, #1e293b 60%, #334155 100%)",
                    padding: "1.5rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    maxWidth: "340px",
                    width: "100%",
                  }}
                >
                  <img
                    src={fish.primary_image}
                    alt={fish.common_name}
                    className="rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
                    style={{
                      boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
                      maxHeight: "200px",
                      width: "auto",
                      objectFit: "cover",
                      border: "2px solid #334155",
                      background: "#fff",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Basic Info Grid */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <InfoItem
                icon={Fish}
                label="Scientific Name"
                value={fish.scientific_name}
              />
              <InfoItem
                icon={Users}
                label="Family"
                value={fish.family || "N/A"}
              />
              <InfoItem
                icon={MapPin}
                label="Origin"
                value={fish.origin || "N/A"}
              />
              <InfoItem
                icon={Droplets}
                label="Water Type"
                value={fish.water_type}
              />
              <InfoItem
                icon={Ruler}
                label="Max Size"
                value={fish.max_size_cm ? `${fish.max_size_cm} cm` : "N/A"}
              />
              <InfoItem
                icon={Utensils}
                label="Diet Type"
                value={fish.diet_type || "N/A"}
              />
            </div>
            <div className="mt-6">
              {/* pH RangeBar with hoverable tooltip */}
              <div
                className="relative w-[600] m-0"
                ref={barRef}
                onMouseMove={(e) => {
                  const rect = barRef.current?.getBoundingClientRect();
                  const barWidth = rect ? rect.width : 600; // fallback
                  const tooltipWidth = 340;
                  let x = e.clientX - rect.left - tooltipWidth / 2;
                  // Clamp so the box stays within the bar
                  x = Math.max(0, Math.min(x, barWidth - tooltipWidth));
                  setPhTooltipPos({ x, y: e.clientY - rect.top });
                  setShowPhInfo(true);
                  if (hideTimer.current) clearTimeout(hideTimer.current);
                }}
                onMouseLeave={() => {
                  // Start a timer to hide the tooltip after 3.5s, unless hovering the tooltip
                  hideTimer.current = setTimeout(() => {
                    if (!isHoveringTooltip) setShowPhInfo(false);
                  }, 800);
                }}
                onClick={(e) => {
                  const rect = barRef.current?.getBoundingClientRect();
                  const barWidth = rect ? rect.width : 600;
                  const tooltipWidth = 340;
                  let x = e.clientX - rect.left - tooltipWidth / 2;
                  x = Math.max(0, Math.min(x, barWidth - tooltipWidth));
                  setPhTooltipPos({ x, y: e.clientY - rect.top });
                  setShowPhInfo((prev) => !prev);
                  if (hideTimer.current) clearTimeout(hideTimer.current);
                }}
              >
                <RangeBar
                  label="pH Range"
                  rangeMin={Number(fish.min_ph)}
                  rangeMax={Number(fish.max_ph)}
                  fixedScale={[4, 10]}
                  gradient="linear-gradient(90deg, #ff0000 0%, #ffff00 50%, #0000ff 100%)"
                  width={16}
                />
                {showPhInfo && (
                  <div
                    className="absolute z-20"
                    style={{
                      left: phTooltipPos.x,
                      top: 48, // or whatever fixed vertical offset you want
                      minWidth: 320,
                      maxWidth: 340,
                    }}
                    onMouseEnter={() => {
                      setIsHoveringTooltip(true);
                      if (hideTimer.current) clearTimeout(hideTimer.current);
                    }}
                    onMouseLeave={() => {
                      setIsHoveringTooltip(false);
                      hideTimer.current = setTimeout(
                        () => setShowPhInfo(false),
                        2000
                      );
                    }}
                  >
                    <div className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl shadow-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded bg-gradient-to-r from-red-500 via-green-400 to-blue-600 border" />
                        <div>
                          <div className="font-semibold text-base">
                            pH Range: {phInfo.range}
                          </div>
                          <div className="text-xs text-blue-500">
                            {phInfo.nature}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm bg-muted/50 rounded p-2 mb-2">
                        {phInfo.description}
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {phInfo.note}
                      </div>
                      <a
                        href={phInfo.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center mt-2 px-3 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition w-full"
                      >
                        to understand the pH click here
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <RangeBar
                label="Temperature Range"
                rangeMin={Number(fish.min_temp)}
                rangeMax={Number(fish.max_temp)}
                unit="°C"
                fixedScale={[10, 40]}
                gradient="linear-gradient(90deg, #00bfff 0%, #ffff00 50%, #ff0000 100%)"
              />
              <RangeBar
                label="Hardness Range"
                rangeMin={Number(fish.min_hardness)}
                rangeMax={Number(fish.max_hardness)}
                unit=" dGH"
                fixedScale={[0, 30]}
                gradient="linear-gradient(90deg, #b3e0ff 0%, #00ff00 50%, #a0522d 100%)"
              />
            </div>
          </CardContent>
        </Card>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Section
            icon={Eye}
            title="Overview"
            content={fish.description || ""}
          />
          <Section
            icon={Utensils}
            title="Care and Feeding"
            content={fish.diet_info || ""}
          />
          <Section
            icon={Heart}
            title="Breeding"
            content={fish.breeding_notes || ""}
          />
        </div>

        {/* Back to Home Button */}
        <div className="mt-8 flex justify-center">
          <Button onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewFish;
