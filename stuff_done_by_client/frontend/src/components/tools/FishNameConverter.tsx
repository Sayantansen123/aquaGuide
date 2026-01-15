import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, BookOpen, Droplets, Thermometer, Ruler } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import config from "@/api/config";

interface FishNameConverterProps {
  children: React.ReactNode;
}

interface SpeciesResult {
  fish_id: string;
  common_name: string;
  scientific_name: string;
  min_tank_size_liters: number;
  min_ph: number;
  max_ph: number;
  min_temp: number;
  max_temp: number;
  primary_image?: string;
  water_type?: string;
  care_level?: string;
  family?: string;
  origin?: string;
}

export const FishNameConverter = ({ children }: FishNameConverterProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SpeciesResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const searchSpecies = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const url = `${config.baseUrl}/public/species/suggestions?q=${encodeURIComponent(debouncedQuery)}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setResults(data.suggestions || []);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Error searching species:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    searchSpecies();
  }, [debouncedQuery]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Fish Name Converter
          </DialogTitle>
          <DialogDescription>
            Search by common name to find scientific names and key care stats.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter fish name (e.g. Neon Tetra)..."
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-[300px] rounded-md border p-1 bg-muted/20">
              {loading ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Searching...
                </div>
              ) : results.length > 0 ? (
                <ScrollArea className="h-full">
                  <div className="space-y-2 p-2">
                    {results.map((fish) => (
                      <Card key={fish.fish_id} className="bg-card hover:bg-muted/50 transition-colors border-none shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex gap-3 items-start mb-2">
                              {fish.primary_image && (
                                <img
                                  src={fish.primary_image}
                                  alt={fish.common_name}
                                  className="w-14 h-14 object-cover rounded border"
                                />
                              )}
                              <div className="flex-1">
                                <h4 className="font-bold text-lg text-primary">{fish.common_name}</h4>
                                <p className="text-sm italic text-muted-foreground">{fish.scientific_name}</p>
                                <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                                  {fish.water_type && (
                                    <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground">{fish.water_type}</span>
                                  )}
                                  {fish.care_level && (
                                    <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground">{fish.care_level}</span>
                                  )}
                                  {fish.family && (
                                    <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground">{fish.family}</span>
                                  )}
                                  {fish.origin && (
                                    <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground">{fish.origin}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs mt-3 bg-muted p-2 rounded">
                              <div className="flex items-center gap-1" title="Minimum Tank Size">
                                <Ruler className="h-3 w-3" />
                                {fish.min_tank_size_liters}L ({Math.round(fish.min_tank_size_liters / 3.785)}g)
                              </div>
                              <div className="flex items-center gap-1" title="pH Range">
                                <Droplets className="h-3 w-3" />
                                pH {fish.min_ph ?? "?"} - {fish.max_ph ?? "?"}
                              </div>
                              <div className="flex items-center gap-1" title="Temperature Range">
                                <Thermometer className="h-3 w-3" />
                                {fish.min_temp != null && fish.max_temp != null
                                  ? `${Math.round(fish.min_temp * 1.8 + 32)}-${Math.round(fish.max_temp * 1.8 + 32)}°F`
                                  : "?"}
                              </div>
                            </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : query.length >= 2 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No species found.
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Type a name to start converting.
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
