import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeartHandshake, AlertTriangle, CheckCircle, XCircle, Loader2 } from "lucide-react";
import config from "@/api/config";

interface CompatibilityMatrixProps {
  children: React.ReactNode;
}

type FishCategory = "Community" | "Semi-Aggressive" | "Aggressive" | "Invertebrate";

interface FishData {
  id: string;
  name: string;
  category: FishCategory;
  tempRange: [number, number]; // F
  phRange: [number, number];
  notes?: string;
}

interface RawSpecies {
  fish_id: string;
  common_name: string;
  temperament?: string;
  family?: string;
  min_temp?: number;
  max_temp?: number;
  min_ph?: string | number;
  max_ph?: string | number;
  compatibility_notes?: string;
}

export const CompatibilityMatrix = ({ children }: CompatibilityMatrixProps) => {
  const [fish1, setFish1] = useState<string>("");
  const [fish2, setFish2] = useState<string>("");
  const [result, setResult] = useState<{ status: "Compatible" | "Caution" | "Incompatible"; reason: string } | null>(null);
  const [fishDatabase, setFishDatabase] = useState<FishData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSpecies = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${config.baseUrl}/species/compatibility-options`);
        if (!response.ok) throw new Error("Failed to fetch species");
        const data = await response.json();
        
        const mappedData: FishData[] = (data as RawSpecies[]).map((s) => {
          // Map temperament to category
          let category: FishCategory = "Community";
          if (s.temperament === "aggressive" || s.temperament === "territorial") category = "Aggressive";
          else if (s.temperament === "semi_aggressive") category = "Semi-Aggressive";
          
          // Check for invertebrates based on family or common name
          if (s.family?.toLowerCase().includes("shrimp") || s.common_name.toLowerCase().includes("shrimp") || s.common_name.toLowerCase().includes("snail")) {
             category = "Invertebrate";
          }

          // Convert Celsius to Fahrenheit
          const minF = s.min_temp ? Math.round((s.min_temp * 9/5) + 32) : 70;
          const maxF = s.max_temp ? Math.round((s.max_temp * 9/5) + 32) : 80;

          return {
            id: s.fish_id,
            name: s.common_name,
            category,
            tempRange: [minF, maxF],
            phRange: [typeof s.min_ph === "number" ? s.min_ph : parseFloat(String(s.min_ph)) || 6.0,
                      typeof s.max_ph === "number" ? s.max_ph : parseFloat(String(s.max_ph)) || 8.0],
            notes: s.compatibility_notes
          };
        });

        setFishDatabase(mappedData);
      } catch (error) {
        console.error("Error fetching species:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecies();
  }, []);

  const checkCompatibility = () => {
    if (!fish1 || !fish2) return;
    if (fish1 === fish2) {
        setResult({ status: "Compatible", reason: "Same species are generally compatible (check male/female ratios for some)." });
        return;
    }

    const f1 = fishDatabase.find(f => f.id === fish1)!;
    const f2 = fishDatabase.find(f => f.id === fish2)!;

    const reasons: string[] = [];
    let status: "Compatible" | "Caution" | "Incompatible" = "Compatible";

    // 1. Water Parameters
    const tempOverlap = Math.max(f1.tempRange[0], f2.tempRange[0]) <= Math.min(f1.tempRange[1], f2.tempRange[1]);
    const phOverlap = Math.max(f1.phRange[0], f2.phRange[0]) <= Math.min(f1.phRange[1], f2.phRange[1]);

    if (!tempOverlap) {
        status = "Incompatible";
        reasons.push(`Temperature requirements do not match (${f1.name}: ${f1.tempRange.join("-")}°F, ${f2.name}: ${f2.tempRange.join("-")}°F).`);
    }
    if (!phOverlap) {
        status = "Incompatible"; // Or Caution? usually incompatible if ranges don't touch
        reasons.push(`pH requirements do not match.`);
    }

    // 2. Temperament
    if (f1.category === "Aggressive" || f2.category === "Aggressive") {
        if (f1.category !== f2.category) { // Aggressive vs Non-Aggressive
             status = "Incompatible";
             reasons.push("Aggressive species will likely attack or eat tank mates.");
        } else {
             status = "Caution";
             reasons.push("Aggressive species need careful monitoring and space.");
        }
    } else if (f1.category === "Semi-Aggressive" || f2.category === "Semi-Aggressive") {
        // Special case: Tiger Barbs vs Long fins (using name check)
        const isTigerBarb = (f: FishData) => f.name.toLowerCase().includes("tiger barb");
        const isLongFin = (f: FishData) => ["angelfish", "betta", "guppy"].some(n => f.name.toLowerCase().includes(n));

        if ((isTigerBarb(f1) && isLongFin(f2)) || (isTigerBarb(f2) && isLongFin(f1))) {
            status = "Incompatible";
            reasons.push("Tiger Barbs are fin nippers and will harass long-finned fish.");
        } else if (f1.category === "Invertebrate" || f2.category === "Invertebrate") {
             status = "Caution";
             reasons.push("Larger semi-aggressive fish may eat shrimp.");
        } else {
            status = status === "Incompatible" ? "Incompatible" : "Caution";
            reasons.push("Semi-aggressive fish may bully peaceful community fish.");
        }
    } else if (f1.category === "Invertebrate" || f2.category === "Invertebrate") {
        // Check for fish that eat inverts even if community (e.g. loaches, though loaches are often semi-aggressive)
        // For now, assume community fish are safe with inverts unless noted
    }

    // 3. Specific Notes
    if (f1.notes) reasons.push(`Note for ${f1.name}: ${f1.notes}`);
    if (f2.notes) reasons.push(`Note for ${f2.name}: ${f2.notes}`);

    if (status === "Compatible" && reasons.length === 0) {
        reasons.push("These species have compatible water parameters and temperaments.");
    }

    setResult({ status, reason: reasons.join(" ") });
  };

  const getStatusColor = (s: string) => {
      if (s === "Compatible") return "text-green-600";
      if (s === "Caution") return "text-yellow-600";
      return "text-red-600";
  };

  const getStatusIcon = (s: string) => {
      if (s === "Compatible") return <CheckCircle className="h-8 w-8 text-green-600" />;
      if (s === "Caution") return <AlertTriangle className="h-8 w-8 text-yellow-600" />;
      return <XCircle className="h-8 w-8 text-red-600" />;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-primary" />
            Species Compatibility
          </DialogTitle>
          <DialogDescription>
            Check if two species can live together.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fish Species 1</Label>
                <Select value={fish1} onValueChange={setFish1} disabled={loading}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {fishDatabase.map(f => (
                      <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fish Species 2</Label>
                <Select value={fish2} onValueChange={setFish2} disabled={loading}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {fishDatabase.map(f => (
                      <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={checkCompatibility} disabled={!fish1 || !fish2} className="w-full" variant="ocean">
              Check Compatibility
            </Button>
          </div>
          <div className="space-y-4">
            {loading && (
              <div className="flex items-center justify-center text-sm text-muted-foreground gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading species database...
              </div>
            )}
            {result && (
              <Card className="bg-muted/50 border-none">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  {getStatusIcon(result.status)}
                  <h3 className={`text-xl font-bold mt-2 ${getStatusColor(result.status)}`}>
                    {result.status}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {result.reason}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
