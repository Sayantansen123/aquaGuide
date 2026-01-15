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
import { Sun } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { UnitConverter } from "./UnitConverter";

interface LightIntensityEstimatorProps {
  children: React.ReactNode;
}

export const LightIntensityEstimator = ({ children }: LightIntensityEstimatorProps) => {
  const [lumens, setLumens] = useState<string>("");
  const [distance, setDistance] = useState<string>("");
  const [lensAngle, setLensAngle] = useState<string>("");
  const [spectrum, setSpectrum] = useState<string>("");
  const [result, setResult] = useState<{ intensity: number; category: string } | null>(null);

  const degToRad = (deg: number) => (deg * Math.PI) / 180;
  const computeSpreadAreaInSqIn = (depthInches: number, lensAngleDegrees: number) => {
    const angleRad = degToRad(lensAngleDegrees);
    const radiusIn = depthInches * Math.tan(angleRad / 2);
    return Math.PI * radiusIn * radiusIn;
  };

  const calculate = () => {
    const l = parseFloat(lumens) || 0;
    const d = parseFloat(distance) || 0;
    const angle = parseFloat(lensAngle);

    if (d === 0) return;

    const spectrumFactors: Record<string, number> = {
      cool_white: 0.013,
      full_spectrum: 0.015,
      actinic_blue: 0.018,
    };
    const hasAdvanced = !isNaN(angle) && angle > 0 && spectrum in spectrumFactors;
    let value = 0;

    if (hasAdvanced) {
      const CoE = 0.85;
      const specFactor = spectrumFactors[spectrum];
      const areaIn2 = computeSpreadAreaInSqIn(d, angle);
      if (areaIn2 <= 0) return;
      const intensityPerIn2 = (l * CoE * specFactor) / areaIn2;
      value = intensityPerIn2 * 144;
    } else {
      const dFt = d / 12;
      const K = 0.025;
      value = (l * K) / (dFt * dFt);
    }

    let category = "Low Light (Anubias, Java Fern, Crypts)";
    if (value >= 30 && value < 80) category = "Medium Light (Amazon Swords, Stem plants)";
    else if (value >= 80 && value < 150) category = "High Light (Carpeting plants, high CO2 required)";
    else if (value >= 150) category = "Very High (Potential Algae Risk / Expert Level)";

    setResult({ intensity: value, category });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-primary" />
            Light Intensity (PAR) Estimator
          </DialogTitle>
          <DialogDescription>
            Estimate PAR at substrate level. Uses lens angle & spectrum when provided; otherwise falls back to inverse square model.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fixture Lumens</Label>
                <Input
                  type="number"
                  value={lumens}
                  onChange={(e) => setLumens(e.target.value)}
                  placeholder="e.g. 1000"
                />
              </div>
              <div className="space-y-2">
                <Label>Distance to Substrate (inches)</Label>
                <Input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="e.g. 18"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lens Angle (°)</Label>
                <Input
                  type="number"
                  value={lensAngle}
                  onChange={(e) => setLensAngle(e.target.value)}
                  placeholder="e.g. 90"
                />
              </div>
              <div className="space-y-2">
                <Label>Spectrum</Label>
                <Select value={spectrum} onValueChange={setSpectrum}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select spectrum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cool_white">Cool White (6500K)</SelectItem>
                    <SelectItem value="full_spectrum">Full Spectrum / Planted</SelectItem>
                    <SelectItem value="actinic_blue">Actinic / Blue (Marine)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic">
              Leave lens angle or spectrum blank to use the simplified inverse square model.
            </p>
            <Button onClick={calculate} className="w-full" variant="ocean">
              Estimate Intensity
            </Button>
          </div>
          <div className="space-y-4">
            {result && (
              <Card className="bg-muted/50 border-none">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground">PAR Estimate</p>
                  <p className="text-3xl font-bold text-primary">
                    {result.intensity.toFixed(1)}
                  </p>
                  <div className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    result.category.includes("High") ? "bg-red-100 text-red-800" :
                    result.category.includes("Medium") ? "bg-yellow-100 text-yellow-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {result.category}
                  </div>
                  <p className="text-xs text-red-500 font-medium mt-3">
                    PAR &lt; 30: Low Light • 30–80: Medium • 80–150: High • 150+: Very High
                  </p>
                </CardContent>
              </Card>
            )}
            <UnitConverter types={["length"]} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
