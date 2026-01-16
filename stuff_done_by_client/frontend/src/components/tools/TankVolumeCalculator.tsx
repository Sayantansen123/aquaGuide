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
import { Calculator } from "lucide-react";

import { UnitConverter } from "./UnitConverter";

interface TankVolumeCalculatorProps {
  children: React.ReactNode;
}

export const TankVolumeCalculator = ({
  children,
}: TankVolumeCalculatorProps) => {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [volume, setVolume] = useState<number | null>(null);

  const calculateVolume = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);

    if (l > 0 && w > 0 && h > 0) {
      // Calculate volume in cubic inches, then convert to gallons
      const cubicInches = l * w * h;
      const gallons = cubicInches / 231; // 231 cubic inches = 1 gallon
      const liters = gallons * 3.78541;
      setVolume(gallons);
    }
  };

  const resetCalculator = () => {
    setLength("");
    setWidth("");
    setHeight("");
    setVolume(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Tank Volume Calculator
          </DialogTitle>
          <DialogDescription>
            Enter your tank dimensions in inches to calculate the volume
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="length">Length (inches)</Label>
              <Input
                id="length"
                type="number"
                placeholder="Enter length"
                value={length}
                onChange={(e) => setLength(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="width">Width (inches)</Label>
              <Input
                id="width"
                type="number"
                placeholder="Enter width"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (inches)</Label>
              <Input
                id="height"
                type="number"
                placeholder="Enter height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={calculateVolume}
                variant="ocean"
                className="flex-1"
              >
                Calculate
              </Button>
              <Button onClick={resetCalculator} variant="outline">
                Reset
              </Button>
            </div>
          </div>
 
          <div className="space-y-4">
            {volume !== null && (
              <Card className="bg-muted/50 border-none">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Tank Volume</p>
                    <p className="text-3xl font-bold text-primary">
                      {volume.toFixed(2)} gallons
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ({(volume * 3.78541).toFixed(2)} liters)
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            <UnitConverter types={["length", "volume"]} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
