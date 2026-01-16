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
import { Droplets } from "lucide-react";

interface WaterParametersProps {
  children: React.ReactNode;
}

const fishParameters = {
  "Betta Fish": {
    temperature: "75-80°F (24-27°C)",
    ph: "6.5-7.5",
    hardness: "5-20 dGH",
    ammonia: "0 ppm",
    nitrite: "0 ppm",
    nitrate: "< 20 ppm",
  },
  Goldfish: {
    temperature: "65-72°F (18-22°C)",
    ph: "7.0-8.0",
    hardness: "5-19 dGH",
    ammonia: "0 ppm",
    nitrite: "0 ppm",
    nitrate: "< 20 ppm",
  },
  "Neon Tetra": {
    temperature: "70-81°F (21-27°C)",
    ph: "6.0-7.0",
    hardness: "1-10 dGH",
    ammonia: "0 ppm",
    nitrite: "0 ppm",
    nitrate: "< 20 ppm",
  },
  Guppy: {
    temperature: "72-82°F (22-28°C)",
    ph: "6.8-7.8",
    hardness: "8-12 dGH",
    ammonia: "0 ppm",
    nitrite: "0 ppm",
    nitrate: "< 20 ppm",
  },
  Angelfish: {
    temperature: "75-82°F (24-28°C)",
    ph: "6.5-7.5",
    hardness: "3-8 dGH",
    ammonia: "0 ppm",
    nitrite: "0 ppm",
    nitrate: "< 20 ppm",
  },
  Clownfish: {
    temperature: "75-82°F (24-28°C)",
    ph: "8.0-8.4",
    hardness: "8-12 dKH",
    ammonia: "0 ppm",
    nitrite: "0 ppm",
    nitrate: "< 20 ppm",
  },
};

export const WaterParameters = ({ children }: WaterParametersProps) => {
  const [selectedFish, setSelectedFish] = useState<string>("");

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-primary" />
            Water Parameters
          </DialogTitle>
          <DialogDescription>
            Check ideal ranges for your fish species
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fish-species">Select Fish Species</Label>
              <Select value={selectedFish} onValueChange={setSelectedFish}>
                <SelectTrigger id="fish-species">
                  <SelectValue placeholder="Choose a fish species" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(fishParameters).map((fish) => (
                    <SelectItem key={fish} value={fish}>
                      {fish}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            {selectedFish && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6 space-y-3">
                  <h3 className="font-semibold text-lg text-primary mb-4">
                    Ideal Parameters for {selectedFish}
                  </h3>
                  {Object.entries(
                    fishParameters[selectedFish as keyof typeof fishParameters]
                  ).map(([param, value]) => (
                    <div
                      key={param}
                      className="flex justify-between items-center py-2 border-b last:border-0"
                    >
                      <span className="text-sm font-medium capitalize">
                        {param.replace("_", " ")}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {value}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
