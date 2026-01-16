import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface FeedingScheduleProps {
  children: React.ReactNode;
}

const dietTypes = {
  "Betta Fish": "Carnivore",
  Goldfish: "Herbivore", // Mostly
  "Neon Tetra": "Omnivore",
  Guppy: "Omnivore",
  "Oscar Cichlid": "Carnivore",
  "Cherry Shrimp": "Herbivore", // Detritivore/Herbivore
};

interface Schedule {
  diet: string;
  frequency: string;
  quantity: string;
  notes: string;
  weekly: string[];
}

export const FeedingSchedule = ({ children }: FeedingScheduleProps) => {
  const [species, setSpecies] = useState<string>("");
  const [age, setAge] = useState<string>("adult");
  const [count, setCount] = useState<string>("1");
  const [schedule, setSchedule] = useState<Schedule | null>(null);

  const generateSchedule = () => {
    if (!species) return;

    const diet = dietTypes[species as keyof typeof dietTypes] || "Omnivore";
    const isFry = age === "fry";
    
    let frequency = "";
    let notes = "";
    const weekly: string[] = [];

    if (isFry) {
        frequency = "3-5 times daily";
        notes = "Feed very small 'dust' portions.";
        // Fry feed every day multiple times
        for(let i=0; i<7; i++) weekly.push("Small portions 3-5x");
    } else {
        if (diet === "Herbivore") {
            frequency = "2-3 times daily";
            notes = "Small stomachs, need to forage. Vegetable matter essential.";
            for(let i=0; i<7; i++) weekly.push("Veggie/Algae based flakes/pellets 2-3x");
        } else if (diet === "Carnivore") {
            frequency = "1-2 times daily";
            notes = "High protein. Include 1 fast day per week.";
            for(let i=0; i<6; i++) weekly.push("Protein rich pellets/frozen food 1-2x");
            weekly.push("Fasting Day (No food)");
        } else {
             // Omnivore
            frequency = "1-2 times daily";
            notes = "Balanced diet. Rotate flakes, pellets, and frozen treats.";
            for(let i=0; i<7; i++) weekly.push("Standard Flakes/Pellets 1-2x");
            weekly[2] = "Treat Day (Bloodworms/Brine Shrimp)"; // Wed
            weekly[6] = "Light feeding or Fasting"; // Sun
        }
    }

    setSchedule({
        diet,
        frequency,
        quantity: "Only what can be consumed in 2 to 3 minutes.",
        notes,
        weekly
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Feeding Schedule Generator
          </DialogTitle>
          <DialogDescription>
            Create a custom feeding plan.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Fish Species</Label>
              <Select value={species} onValueChange={setSpecies}>
                <SelectTrigger>
                  <SelectValue placeholder="Select species" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(dietTypes).map((fish) => (
                    <SelectItem key={fish} value={fish}>
                      {fish}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Age Stage</Label>
                <Select value={age} onValueChange={setAge}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fry">Fry (Baby)</SelectItem>
                    <SelectItem value="juvenile">Juvenile</SelectItem>
                    <SelectItem value="adult">Adult</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Number of Fish</Label>
                <Input type="number" min="1" value={count} onChange={(e) => setCount(e.target.value)} />
              </div>
            </div>
            <Button onClick={generateSchedule} disabled={!species} className="w-full" variant="ocean">
              Generate Schedule
            </Button>
          </div>
          <div className="space-y-4">
            {schedule && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold">Diet Type:</span>
                    <span>{schedule.diet}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-semibold">Frequency:</span>
                    <span>{schedule.frequency}</span>
                  </div>
                  <div className="space-y-1 border-b pb-2">
                    <span className="font-semibold block">Quantity Rule:</span>
                    <span className="text-sm text-muted-foreground">{schedule.quantity}</span>
                  </div>
                  <div className="space-y-2">
                    <span className="font-semibold block">Weekly Plan:</span>
                    <div className="grid grid-cols-1 gap-1 text-sm">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                        <div key={day} className="flex gap-2">
                          <span className="w-8 font-bold text-muted-foreground">{day}:</span>
                          <span>{schedule.weekly[i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-yellow-500/10 p-2 rounded text-xs text-yellow-600 dark:text-yellow-400">
                    <strong>Note:</strong> {schedule.notes}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
