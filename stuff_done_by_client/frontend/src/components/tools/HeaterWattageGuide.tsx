import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Thermometer } from "lucide-react";

import { UnitConverter } from "./UnitConverter";

interface HeaterWattageGuideProps {
  children: React.ReactNode;
}

export const HeaterWattageGuide = ({ children }: HeaterWattageGuideProps) => {
  const [volume, setVolume] = useState("");
  const [roomTemp, setRoomTemp] = useState("");
  const [targetTemp, setTargetTemp] = useState("");
  const [recommendation, setRecommendation] = useState<{
    watts: number;
    message: string;
    details: string;
  } | null>(null);

  const calculate = () => {
    const vol = parseFloat(volume);
    const room = parseFloat(roomTemp);
    const target = parseFloat(targetTemp);

    if (vol > 0 && room > 0 && target > 0) {
      const diff = target - room; // Assuming Fahrenheit for calculation logic provided
      
      if (diff <= 0) {
        setRecommendation({
          watts: 0,
          message: "No heater needed",
          details: "Room temperature is equal to or higher than target temperature."
        });
        return;
      }

      let wattsPerGal = 0;
      if (diff <= 5) {
        wattsPerGal = 2.5;
      } else if (diff <= 10) {
        wattsPerGal = 5;
      } else {
        wattsPerGal = 10; // Using upper bound of 7.5-10 for safety
      }

      const totalWatts = vol * wattsPerGal;
      
      // Standard heater sizes
      const sizes = [25, 50, 75, 100, 150, 200, 300];
      
      let message = "";
      let details = "";

      if (vol > 50) {
        // Recommend two heaters
        const splitWatts = totalWatts / 2;
        // Find smallest heater >= splitWatts
        const size = sizes.find(s => s >= splitWatts) || 300;
        message = `Two ${size}W Heaters`;
        details = `For tanks over 50 gallons, using two smaller heaters (total ~${Math.ceil(totalWatts)}W) prevents single-point failure.`;
      } else {
        const size = sizes.find(s => s >= totalWatts) || 300;
         if (totalWatts > 300) {
             const splitWatts = totalWatts / 2;
             const splitSize = sizes.find(s => s >= splitWatts) || 300;
             message = `Two ${splitSize}W Heaters`;
             details = `High wattage required (~${Math.ceil(totalWatts)}W). Better to split between two heaters.`;
         } else {
             message = `One ${size}W Heater`;
             details = `Based on a temperature lift of ${diff.toFixed(1)}°F requiring ~${wattsPerGal} Watts/gallon.`;
         }
      }

      setRecommendation({ watts: totalWatts, message, details });
    }
  };

  const reset = () => {
    setVolume("");
    setRoomTemp("");
    setTargetTemp("");
    setRecommendation(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-primary" />
            Heater Wattage Guide
          </DialogTitle>
          <DialogDescription>
            Determine the right heater size for your aquarium.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="heat-vol">Tank Volume (Gallons)</Label>
              <Input
                id="heat-vol"
                type="number"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="e.g. 55"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room-temp">Room Temp (°F)</Label>
                <Input
                  id="room-temp"
                  type="number"
                  value={roomTemp}
                  onChange={(e) => setRoomTemp(e.target.value)}
                  placeholder="e.g. 70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-temp">Target Temp (°F)</Label>
                <Input
                  id="target-temp"
                  type="number"
                  value={targetTemp}
                  onChange={(e) => setTargetTemp(e.target.value)}
                  placeholder="e.g. 78"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={calculate} variant="ocean" className="flex-1">
                Calculate
              </Button>
              <Button onClick={reset} variant="outline">
                Reset
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            {recommendation && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground">Recommendation</p>
                  <p className="text-2xl font-bold text-primary mb-2">
                    {recommendation.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {recommendation.details}
                  </p>
                </CardContent>
              </Card>
            )}
            <UnitConverter types={["volume", "temperature"]} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
