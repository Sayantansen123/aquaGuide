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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mountain, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface HardscapeCalculatorProps {
  children: React.ReactNode;
}

export const HardscapeCalculator = ({ children }: HardscapeCalculatorProps) => {
  const [rockWeight, setRockWeight] = useState<string>("");
  const [woodWeight, setWoodWeight] = useState<string>("");
  const [result, setResult] = useState<{ rockVol: number; woodVol: number; totalVol: number } | null>(null);

  const calculate = () => {
    const rocks = parseFloat(rockWeight) || 0;
    const wood = parseFloat(woodWeight) || 0;

    // Formulas:
    // Rock Volume (gal) = Weight (lbs) / 22 (assuming density ~2.6g/cm3)
    const rockVol = rocks / 22;

    // Wood Volume (gal) = (Weight (lbs) / 8.34) * 0.6 (assuming density factor)
    // Wait, the formula given was: Volume Lost = (Weight / 8.34) * 0.6
    // Water weighs 8.34 lbs/gal.
    // If wood floats, it's less dense. But "sinker" wood is waterlogged.
    // The prompt says: "Wood is less dense and porous; 0.6 is a common 'sinker' coefficient".
    // Formula: (Weight / 8.34) * 0.6.
    // Let's analyze: Weight / 8.34 gives volume IF it was water density (SG=1).
    // If SG < 1 (floats), it displaces its weight in water until it floats? No, we want volume of the object itself.
    // Volume = Mass / Density.
    // Water Density = 8.34 lbs/gal.
    // Wood Density approx 0.6 * Water Density? Or 1/0.6?
    // The formula provided is: (Weight / 8.34) * 0.6.
    // This implies Volume = (Mass / Density_Water) * 0.6.
    // This gives a smaller volume than if it was water. That implies Density_Wood > Density_Water / 0.6 ? No.
    // If I have 10 lbs of wood. 10 / 8.34 = 1.2 gal (if water).
    // Result * 0.6 = 0.72 gal.
    // This implies the wood is denser? No.
    // If volume is smaller, density is higher.
    // Maybe the user means: Volume = Weight / (8.34 * 0.6)?
    // Let's stick VERBATIM to the user's formula: "Volume Lost (Gallons) = (Weight of Wood / 8.34) * 0.6".
    // It might be an empirical adjustment for "effective displacement" considering porosity (water soaking in).
    // I will use the formula exactly as written.

    const woodVol = (wood / 8.34) * 0.6;

    setResult({
      rockVol,
      woodVol,
      totalVol: rockVol + woodVol
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mountain className="h-5 w-5 text-primary" />
            Hardscape Volume Displacer
          </DialogTitle>
          <DialogDescription>
            Calculate how much water your rocks and wood will displace.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label>Rock Weight (lbs)</Label>
                  <div className="relative">
                      <Scale className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                          type="number" 
                          placeholder="0" 
                          className="pl-9"
                          value={rockWeight}
                          onChange={(e) => setRockWeight(e.target.value)}
                      />
                  </div>
                  <p className="text-xs text-muted-foreground">e.g. Seiryu, Dragon Stone</p>
              </div>
              <div className="space-y-2">
                  <Label>Wood Weight (lbs)</Label>
                  <div className="relative">
                      <Scale className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                          type="number" 
                          placeholder="0" 
                          className="pl-9"
                          value={woodWeight}
                          onChange={(e) => setWoodWeight(e.target.value)}
                      />
                  </div>
                  <p className="text-xs text-muted-foreground">Dry weight before soaking</p>
              </div>
            </div>
            <Button onClick={calculate} className="w-full" variant="ocean">
              Calculate Displacement
            </Button>
          </div>
 
          <div className="space-y-4">
            {result && (
              <Card className="bg-muted/50 border-none">
                  <CardContent className="pt-6 text-center space-y-2">
                      <div className="flex justify-between text-sm">
                          <span>Rock Displacement:</span>
                          <span className="font-mono">{result.rockVol.toFixed(2)} gal</span>
                      </div>
                      <div className="flex justify-between text-sm">
                          <span>Wood Displacement:</span>
                          <span className="font-mono">{result.woodVol.toFixed(2)} gal</span>
                      </div>
                      <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg text-primary">
                          <span>Total Displaced:</span>
                          <span>{result.totalVol.toFixed(2)} Gallons</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                          Subtract this from your tank volume when dosing medications!
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
