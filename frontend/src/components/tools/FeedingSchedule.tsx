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
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface FeedingScheduleProps {
  children: React.ReactNode;
}

const feedingSchedules = {
  "Betta Fish": {
    small: {
      frequency: "1-2 times daily",
      amount: "2-3 pellets per feeding",
      notes: "Fast 1 day per week",
    },
    medium: {
      frequency: "2 times daily",
      amount: "3-4 pellets per feeding",
      notes: "Fast 1 day per week",
    },
    large: {
      frequency: "2 times daily",
      amount: "4-5 pellets per feeding",
      notes: "Fast 1 day per week",
    },
  },
  Goldfish: {
    small: {
      frequency: "2-3 times daily",
      amount: "Pinch of flakes",
      notes: "Feed only what they can consume in 2 minutes",
    },
    medium: {
      frequency: "2-3 times daily",
      amount: "Small pinch of flakes",
      notes: "Feed only what they can consume in 2 minutes",
    },
    large: {
      frequency: "2-3 times daily",
      amount: "Medium pinch of flakes",
      notes: "Feed only what they can consume in 2 minutes",
    },
  },
  "Neon Tetra": {
    small: {
      frequency: "1-2 times daily",
      amount: "Small pinch of micro pellets",
      notes: "Supplement with frozen foods weekly",
    },
    medium: {
      frequency: "2 times daily",
      amount: "Small pinch of micro pellets",
      notes: "Supplement with frozen foods weekly",
    },
    large: {
      frequency: "2 times daily",
      amount: "Medium pinch of micro pellets",
      notes: "Supplement with frozen foods weekly",
    },
  },
  Guppy: {
    small: {
      frequency: "2-3 times daily",
      amount: "Small pinch of flakes",
      notes: "Vary diet with frozen brine shrimp",
    },
    medium: {
      frequency: "2-3 times daily",
      amount: "Small pinch of flakes",
      notes: "Vary diet with frozen brine shrimp",
    },
    large: {
      frequency: "2-3 times daily",
      amount: "Medium pinch of flakes",
      notes: "Vary diet with frozen brine shrimp",
    },
  },
};

export const FeedingSchedule = ({ children }: FeedingScheduleProps) => {
  const [selectedFish, setSelectedFish] = useState<string>("");
  const [tankSize, setTankSize] = useState<string>("");

  const schedule =
    selectedFish && tankSize
      ? feedingSchedules[selectedFish as keyof typeof feedingSchedules]?.[
          tankSize as keyof (typeof feedingSchedules)["Betta Fish"]
        ]
      : null;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Feeding Schedule
          </DialogTitle>
          <DialogDescription>
            Plan your feeding routine based on fish species and tank size
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fish-type">Select Fish Species</Label>
            <Select value={selectedFish} onValueChange={setSelectedFish}>
              <SelectTrigger id="fish-type">
                <SelectValue placeholder="Choose a fish species" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(feedingSchedules).map((fish) => (
                  <SelectItem key={fish} value={fish}>
                    {fish}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tank-size">Tank Size</Label>
            <Select value={tankSize} onValueChange={setTankSize}>
              <SelectTrigger id="tank-size">
                <SelectValue placeholder="Choose tank size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small (&lt;20 gallons)</SelectItem>
                <SelectItem value="medium">Medium (20-50 gallons)</SelectItem>
                <SelectItem value="large">Large (&gt;50 gallons)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {schedule && (
            <Card className="bg-muted/50">
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold text-lg text-primary">
                  Recommended Schedule
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-start py-2 border-b">
                    <span className="text-sm font-medium">Frequency</span>
                    <span className="text-sm text-muted-foreground text-right">
                      {schedule.frequency}
                    </span>
                  </div>
                  <div className="flex justify-between items-start py-2 border-b">
                    <span className="text-sm font-medium">Amount</span>
                    <span className="text-sm text-muted-foreground text-right">
                      {schedule.amount}
                    </span>
                  </div>
                  <div className="flex justify-between items-start py-2">
                    <span className="text-sm font-medium">Notes</span>
                    <span className="text-sm text-muted-foreground text-right max-w-[60%]">
                      {schedule.notes}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
