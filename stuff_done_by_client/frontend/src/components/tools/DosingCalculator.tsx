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
import { FlaskConical } from "lucide-react";

interface DosingCalculatorProps {
  children: React.ReactNode;
}

export const DosingCalculator = ({ children }: DosingCalculatorProps) => {
  const [volume, setVolume] = useState("");
  const [unit, setUnit] = useState("liters");
  const [targetPPM, setTargetPPM] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const vol = parseFloat(volume);
    const ppm = parseFloat(targetPPM);

    if (vol > 0 && ppm > 0) {
      // Amount (mg) = Volume (L) * ppm
      const liters = unit === "gallons" ? vol * 3.78541 : vol;
      const mg = liters * ppm;
      setResult(mg);
    }
  };

  const reset = () => {
    setVolume("");
    setTargetPPM("");
    setUnit("liters");
    setResult(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" />
            Dosing Calculator
          </DialogTitle>
          <DialogDescription>
            Calculate required dry fertilizer amount.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dose-vol">Tank Volume</Label>
                <Input
                  id="dose-vol"
                  type="number"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="liters">Liters</SelectItem>
                        <SelectItem value="gallons">Gallons</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dose-ppm">Desired Increase (ppm)</Label>
              <Input
                id="dose-ppm"
                type="number"
                value={targetPPM}
                onChange={(e) => setTargetPPM(e.target.value)}
                placeholder="e.g. 5"
              />
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
                  <p className="text-sm text-muted-foreground">Add to Tank</p>
                  <p className="text-3xl font-bold text-primary mb-1">
                    {result.toFixed(0)} mg
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ({(result / 1000).toFixed(2)} grams)
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    This is for the dry chemical (active ingredient).
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
