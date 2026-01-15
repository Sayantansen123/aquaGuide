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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Layers } from "lucide-react";

import { UnitConverter } from "./UnitConverter";

interface SubstrateCalculatorProps {
  children: React.ReactNode;
}

export const SubstrateCalculator = ({ children }: SubstrateCalculatorProps) => {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");
  const [type, setType] = useState("gravel");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const d = parseFloat(depth);

    if (l > 0 && w > 0 && d > 0) {
      const volume = l * w * d;
      // Standard Gravel: 0.05 lbs/cubic inch
      // Sand/Fine Substrate: 0.055 lbs/cubic inch
      const weight = type === "sand" ? volume * 0.055 : volume * 0.05;
      setResult(weight);
    }
  };

  const reset = () => {
    setLength("");
    setWidth("");
    setDepth("");
    setType("gravel");
    setResult(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Substrate & Gravel Calculator
          </DialogTitle>
          <DialogDescription>
            Calculate how many pounds of substrate you need.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sub-length">Tank Length (in)</Label>
                <Input
                  id="sub-length"
                  type="number"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="e.g. 30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sub-width">Tank Width (in)</Label>
                <Input
                  id="sub-width"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="e.g. 12"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sub-depth">Desired Depth (in)</Label>
              <Input
                id="sub-depth"
                type="number"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                placeholder="Recommended: 2 inches"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sub-type">Substrate Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="sub-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gravel">Standard Gravel</SelectItem>
                  <SelectItem value="sand">Sand / Fine Substrate</SelectItem>
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
            {result !== null && (
              <Card className="bg-muted/50 border-none">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground">Required Amount</p>
                  <p className="text-3xl font-bold text-primary">
                    {result.toFixed(1)} lbs
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on {type === "sand" ? "0.055" : "0.05"} lbs/cubic inch
                    density
                  </p>
                </CardContent>
              </Card>
            )}
            <UnitConverter types={["length", "weight"]} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
