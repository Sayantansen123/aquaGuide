import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import speciesIcon from "@/assets/logo_dict.webp";
import { Loader2 } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { speciesApi } from "@/api/modules/species";
import type { SpeciesItem, SearchSpeciesParams } from "@/api/apiTypes";
import { useNavigate } from "react-router-dom";

const speciesCategories = [
  { name: "Aquatic Plants", position: "top-left", type: "aquaticplants" },
  { name: "Brackish Fish", position: "left", type: "brackish" },
  { name: "Marine Fish", position: "bottom-left", type: "marine" },
  { name: "Freshwater Fish", position: "bottom", type: "freshwater" },
];

const careCategories = [
  { name: "Very Easy Care", position: "top-right", type: "very_easy" },
  { name: "Easy Care", position: "right-top", type: "easy" },
  { name: "Moderate Care", position: "right", type: "moderate" },
  { name: "Difficult Care", position: "right-bottom", type: "difficult" },
  { name: "Expert Care", position: "bottom-right", type: "expert" },
];

const SpeciesDictionary = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {}, []);

  // Build params for API
  const params: SearchSpeciesParams = {
    page,
    limit: 20,
  };

  if (selectedCategory) {
    const speciesType = speciesCategories.find(
      (c) => c.type === selectedCategory
    );
    const careType = careCategories.find((c) => c.type === selectedCategory);

    if (speciesType) {
      params.waterType = selectedCategory;
    }
    if (careType) {
      params.careLevel = selectedCategory;
    }
  }
  if (searchTerm) params.query = searchTerm;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["species-dictionary", params],
    queryFn: () => speciesApi.searchSpecies(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });

  // Print the received data for debugging
  console.log("SpeciesDictionary data:", data);

  const speciesArray: SpeciesItem[] = data?.data.species || [];
  const totalPages: number = data?.data.totalPages || 1;

  const getPositionClasses = (position: string) => {
    const baseClasses = "absolute";
    switch (position) {
      case "top-left":
        return `${baseClasses} top-[20%] left-0 sm:top-14 sm:left-44 lg:top-12 lg:left-52`;
      case "left":
        return `${baseClasses} top-[36%]  left-0 sm:left-36 lg:left-40`;
      case "bottom-left":
        return `${baseClasses} bottom-[34%] left-0 sm:bottom-[34%] sm:left-36 lg:bottom-[34%] lg:left-40`;
      case "bottom":
        return `${baseClasses} bottom-[18%] left-0 lg:left-52  sm:bottom-12 sm:left-44 lg:bottom-12`;
      case "top-right":
        return `${baseClasses} top-[12%] right-0 sm:top-8 sm:right-44 lg:top-12 lg:right-52`;
      case "right-top":
        return `${baseClasses} top-[27%] lg:top-[27%] right-0 sm:right-40 lg:right-44`;
      case "right":
        return `${baseClasses} top-[43%] lg:top-[43%]  right-0 sm:right-36 lg:right-40`;
      case "right-bottom":
        return `${baseClasses} bottom-[28%] lg:bottom-[30%] right-0 sm:right-40 lg:right-44`;
      case "bottom-right":
        return `${baseClasses} bottom-[12%] right-0 sm:bottom-10 sm:right-48 lg:bottom-12 lg:right-56`;
      default:
        return baseClasses;
    }
  };

  const getCareColor = (care: string) => {
    switch (care) {
      case "Easy":
        return "bg-green-500/20 text-green-700 dark:text-green-400";
      case "Moderate":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
      case "Hard":
        return "bg-red-500/20 text-red-700 dark:text-red-400";
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
          Species Dictionary
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-8 text-center">
          Explore our comprehensive database of aquatic species
        </p>

        {/* Circular Category Selector */}
        <div className="relative w-full max-w-5xl mx-auto mb-12">
          <div className="relative h-[300px] sm:h-[350px] lg:h-[400px] flex items-center justify-center">
            {/* Central Image */}
            <div className="relative z-10 w-32 h-32 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full bg-background border-4 border-primary/20 shadow-2xl flex items-center justify-center overflow-hidden">
              <img
                src={speciesIcon}
                alt="Species Dictionary"
                className="w-32 h-32 sm:w-48 sm:h-48 lg:w-56 lg:h-56 object-contain"
              />
            </div>

            {/* Species Type Categories (Left Side) */}
            {speciesCategories.map((category) => (
              <Button
                key={category.name}
                variant={
                  selectedCategory === category.name ? "default" : "outline"
                }
                className={`${getPositionClasses(
                  category.position
                )} whitespace-nowrap text-xs sm:text-lg px-3 py-2 sm:px-4 sm:py-2 z-20`}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.type ? null : category.type
                  )
                }
              >
                {category.name}
              </Button>
            ))}

            {/* Care Level Categories (Right Side) */}
            {careCategories.map((category) => (
              <Button
                key={category.name}
                variant={
                  selectedCategory === category.type ? "default" : "outline"
                }
                className={`${getPositionClasses(
                  category.position
                )} whitespace-nowrap text-xs sm:text-lg px-3 py-2 sm:px-4 sm:py-2 z-20`}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.type ? null : category.type
                  )
                }
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search species..."
            className="pl-10 h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Active Filter Display */}
        {selectedCategory && (
          <div className="text-center mt-4">
            <Badge variant="secondary" className="text-sm">
              Filtering by: {selectedCategory}
              <button
                onClick={() => setSelectedCategory(null)}
                className="ml-2 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12 w-[90vw]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div>Error loading species.</div>
        ) : (
          speciesArray.map((fish) => (
            <Card
              key={fish.fish_id}
              className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
              onClick={()=> navigate(`/view/fish/${fish.fish_id}`)}
            >
              <CardHeader>
                <div className="text-5xl mb-4 text-center">
                  {/* Optionally render an icon or image */}
                  {fish.primary_image ? (
                    <img
                      src={fish.primary_image}
                      alt={fish.common_name}
                      className="mx-auto h-36 w-44 object-center rounded-md overflow-hidden"
                    />
                  ) : (
                    <span role="img" aria-label="fish">
                      🐟
                    </span>
                  )}
                </div>
                <CardTitle className="text-center">
                  {fish.common_name}
                </CardTitle>
                <CardDescription className="text-center">
                  <Badge variant="secondary" className="mt-2">
                    {fish.water_type}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Care Level:</span>
                  <Badge className={getCareColor(fish.care_level || "")}>
                    {fish.care_level}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Size:</span>
                  <span className="font-medium">
                    {fish.max_size_cm ? `${fish.max_size_cm} cm` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Origin:</span>
                  <span className="font-medium">{fish.origin || "N/A"}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-2 mt-6">
        <Button
          variant="outline"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </Button>
        <span className="px-4 py-2">{`Page ${page} of ${totalPages}`}</span>
        <Button
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SpeciesDictionary;
