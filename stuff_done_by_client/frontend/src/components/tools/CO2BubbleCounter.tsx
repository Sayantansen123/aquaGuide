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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wind } from "lucide-react";

import { UnitConverter } from "./UnitConverter";

interface CO2BubbleCounterProps {
  children: React.ReactNode;
}

export const CO2BubbleCounter = ({ children }: CO2BubbleCounterProps) => {
  const [volume, setVolume] = useState("");
  const [lightLevel, setLightLevel] = useState("medium");
  const [result, setResult] = useState<{ bps: string; message: string } | null>(null);

  const calculate = () => {
    const vol = parseFloat(volume);

    if (vol > 0) {
      let multiplier = 1; // BPS per 20 gal
      
      if (lightLevel === "low") multiplier = 0.5;
      else if (lightLevel === "high") multiplier = 2.5; // Average of 2-3

      const bps = (vol / 20) * multiplier;
      
      setResult({
        bps: bps.toFixed(1),
        message: lightLevel === "high" ? "High demand. Monitor drop checker closely." : "Start low and adjust."
      });
    }
  };

  const reset = () => {
    setVolume("");
    setLightLevel("medium");
    setResult(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-primary" />
            CO2 Bubble Counter
          </DialogTitle>
          <DialogDescription>
            Calculate recommended CO2 injection rate.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="co2-vol">Tank Volume (Gallons)</Label>
              <Input
                id="co2-vol"
                type="number"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="e.g. 20"
              />
            </div>
            <div className="space-y-2">
              <Label>Light Intensity / Plant Mass</Label>
              <Select value={lightLevel} onValueChange={setLightLevel}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="low">Low Light</SelectItem>
                      <SelectItem value="medium">Medium Light (Standard)</SelectItem>
                      <SelectItem value="high">High Light / Heavily Planted</SelectItem>
                  </SelectContent>
              </Select>
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
            {result && (
              <Card className="bg-muted/50 border-none">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground">Recommended Rate</p>
                  <p className="text-3xl font-bold text-primary mb-2">
                    {result.bps} BPS
                  </p>
                  <p className="text-xs text-muted-foreground">
                    (Bubbles Per Second)
                  </p>
                  <p className="text-xs text-red-500 mt-2 font-medium">
                    Critical: Always use a Drop Checker to verify actual CO2 levels.
                  </p>
                </CardContent>
              </Card>
            )}
            <UnitConverter types={["volume"]} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
