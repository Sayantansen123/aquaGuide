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
import { Scale, Plus, Trash2 } from "lucide-react";

import { UnitConverter } from "./UnitConverter";

interface BioloadCalculatorProps {
  children: React.ReactNode;
}

interface FishEntry {
  id: number;
  length: string; // cm
  count: string;
}

export const BioloadCalculator = ({ children }: BioloadCalculatorProps) => {
  const [volume, setVolume] = useState("");
  const [fishList, setFishList] = useState<FishEntry[]>([{ id: 1, length: "", count: "" }]);
  const [result, setResult] = useState<{ totalWeight: number; level: string; percent: number } | null>(null);

  const addFish = () => {
    setFishList([...fishList, { id: Date.now(), length: "", count: "" }]);
  };

  const removeFish = (id: number) => {
    setFishList(fishList.filter(f => f.id !== id));
  };

  const updateFish = (id: number, field: keyof FishEntry, value: string) => {
    setFishList(fishList.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const calculate = () => {
    const vol = parseFloat(volume);
    if (!vol || vol <= 0) return;

    let totalWeight = 0;
    fishList.forEach(fish => {
        const l = parseFloat(fish.length);
        const c = parseFloat(fish.count);
        if (l > 0 && c > 0) {
            // W = 0.02 * L^3
            const weight = 0.02 * Math.pow(l, 3);
            totalWeight += weight * c;
        }
    });

    // 100g / 100 gal = 1 g/gal (Light)
    // 350g / 100 gal = 3.5 g/gal (Moderate)
    // 1000g / 100 gal = 10 g/gal (Heavy)

    const gramsPerGal = totalWeight / vol;
    let level = "Light";
    let percent = 0; // Relative to "Heavy" limit (10g/gal)

    if (gramsPerGal <= 1) {
        level = "Light Stocking";
        percent = (gramsPerGal / 1) * 25; // Scale 0-25%
    } else if (gramsPerGal <= 3.5) {
        level = "Moderate Stocking";
        percent = 25 + ((gramsPerGal - 1) / 2.5) * 50; // Scale 25-75%
    } else if (gramsPerGal <= 10) {
        level = "Heavy Stocking";
        percent = 75 + ((gramsPerGal - 3.5) / 6.5) * 25; // Scale 75-100%
    } else {
        level = "Overstocked!";
        percent = 100;
    }

    setResult({ totalWeight, level, percent });
  };

  const reset = () => {
    setVolume("");
    setFishList([{ id: 1, length: "", count: "" }]);
    setResult(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Stocking Level (Bioload)
          </DialogTitle>
          <DialogDescription>
            Calculate bioload based on fish mass.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bio-vol">Tank Volume (Gallons)</Label>
              <Input
                id="bio-vol"
                type="number"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="e.g. 55"
              />
            </div>
            <div className="space-y-2">
              <Label>Fish List (Length in cm)</Label>
              {fishList.map((fish) => (
                <div key={fish.id} className="flex gap-2 items-center">
                  <Input
                    placeholder="Length (cm)"
                    type="number"
                    value={fish.length}
                    onChange={(e) => updateFish(fish.id, "length", e.target.value)}
                    className="w-1/3"
                  />
                  <Input
                    placeholder="Count"
                    type="number"
                    value={fish.count}
                    onChange={(e) => updateFish(fish.id, "count", e.target.value)}
                    className="w-1/3"
                  />
                  {fishList.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeFish(fish.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addFish} className="w-full mt-2">
                <Plus className="h-4 w-4 mr-2" /> Add Fish
              </Button>
            </div>
            <div className="flex gap-2">
              <Button onClick={calculate} variant="ocean" className="flex-1">
                Calculate Bioload
              </Button>
              <Button onClick={reset} variant="outline">
                Reset
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            {result && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground">Estimated Biomass</p>
                  <p className="text-xl font-bold text-primary">
                    {result.totalWeight.toFixed(1)} g
                  </p>
                  <div className="my-4">
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${result.level === "Overstocked!" ? "bg-red-500" : result.level === "Heavy Stocking" ? "bg-orange-500" : "bg-green-500"}`}
                        style={{ width: `${Math.min(result.percent, 100)}%` }}
                      />
                    </div>
                  </div>
                  <p className={`text-lg font-bold ${result.level === "Overstocked!" ? "text-red-500" : result.level === "Heavy Stocking" ? "text-orange-500" : "text-green-600"}`}>
                    {result.level}
                  </p>
                  {result.level === "Heavy Stocking" && (
                    <p className="text-xs text-muted-foreground mt-1">Requires professional-grade filtration.</p>
                  )}
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
