import { useEffect, useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, AlertTriangle, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface WaterChangeCalculatorProps {
  children: React.ReactNode;
}

type CalculationResult = {
  percent: number;
  volume: number;
  target: number;
  message: string;
  type: "change" | "dose" | "good";
  warning?: string;
};

export const WaterChangeCalculator = ({ children }: WaterChangeCalculatorProps) => {
  // Common State
  const [tankVolume, setTankVolume] = useState("");
  const [currentNitrate, setCurrentNitrate] = useState("");
  const [mode, setMode] = useState("simple");

  // Predictive State
  const [foodWeightGrams, setFoodWeightGrams] = useState("");
  const [proteinPercentage, setProteinPercentage] = useState("");
  const [predictiveDaily, setPredictiveDaily] = useState<number | null>(null);

  // Mode Specific State
  const [simpleGoal, setSimpleGoal] = useState("");
  const [plantedLight, setPlantedLight] = useState("low");
  const [fishType, setFishType] = useState("hardy");
  const [phosphate, setPhosphate] = useState("");

  const [result, setResult] = useState<CalculationResult | null>(null);

  // Predictive Calculation
  useEffect(() => {
    const w = parseFloat(foodWeightGrams) || 0;
    let p = parseFloat(proteinPercentage) || 0;
    const v = parseFloat(tankVolume) || 0;
    if (p > 1) p = p / 100;
    
    // Formula: (Food_Weight * Protein_Pct * 7.1) / Tank_Volume
    const daily = v > 0 ? (w * p * 7.1) / v : 0;
    
    setPredictiveDaily(daily > 0 ? daily : null);
    
    // Auto-fill current nitrate if it's empty and we have a prediction
    if (daily > 0 && currentNitrate === "") {
      setCurrentNitrate(daily.toFixed(2));
    }
  }, [foodWeightGrams, proteinPercentage, tankVolume]);

  const getTarget = () => {
    let target = 0;
    switch (mode) {
      case "simple":
        target = parseFloat(simpleGoal);
        break;
      case "planted":
        if (plantedLight === "low") target = 7.5;
        else if (plantedLight === "medium") target = 15;
        else if (plantedLight === "high") target = 25;
        break;
      case "fish-only":
        if (fishType === "sensitive") target = 15;
        else if (fishType === "hardy") target = 40;
        else if (fishType === "invertebrate") target = 10;
        break;
      case "redfield":
        const po4 = parseFloat(phosphate);
        if (!isNaN(po4)) target = po4 * 10;
        break;
    }
    return isNaN(target) ? 0 : target;
  };

  const calculate = () => {
    const current = parseFloat(currentNitrate);
    const volume = parseFloat(tankVolume);

    if (isNaN(current) || current < 0) return; // Invalid current nitrate
    
    let target = getTarget();
    let maxThreshold = mode === "fish-only";

    // Safety: Prevent negative target
    if (target < 0) target = 0;

    // Logic Handling
    let percent = 0;
    let type: "change" | "dose" | "good" = "good";
    let message = "";
    let warning = undefined;

    if (mode === "fish-only") {
      // Fish Only: Only change if Current > Target (Max Threshold)
      if (current > target) {
        type = "change";
        // Percent to reduce to target: 1 - (Target / Current)
        percent = (1 - (target / current)) * 100;
        message = `Nitrate exceeds maximum threshold of ${target} ppm.`;
      } else {
        type = "good";
        message = `Nitrate levels are within safe limits (Max ${target} ppm).`;
      }
    } else {
      // Planted / Redfield / Simple (Target-based)
      if (current > target) {
        type = "change";
        percent = (1 - (target / current)) * 100;
        message = `Reduce Nitrate to reach target of ${target} ppm.`;
      } else if (current < target) {
        // Only for Planted/Redfield/Simple we might suggest dosing
        if (mode === "planted" || mode === "redfield") {
          type = "dose";
          message = `Nitrate is low (Target: ${target} ppm). Consider dosing fertilizer.`;
        } else {
          type = "good"; // Simple mode - usually implies user just wants to lower it, but strictly if current < goal, it's good.
          message = "Levels are below your goal.";
        }
      } else {
        type = "good";
        message = "Nitrate levels are exactly at target.";
      }
    }

    // Cap percentage at 100% (physically impossible to change more)
    if (percent > 100) percent = 100;

    // Volume Calculation
    const volumeToChange = !isNaN(volume) ? volume * (percent / 100) : 0;

    // Safety Warning (50% Rule)
    if (percent > 50) {
      warning = `Large water change required (${percent.toFixed(0)}%). To avoid Osmotic/pH Shock, split this into two sessions (e.g., today and tomorrow).`;
    }

    setResult({
      percent,
      volume: volumeToChange,
      target,
      message,
      type,
      warning
    });
  };

  const reset = () => {
    setCurrentNitrate("");
    setSimpleGoal("");
    setResult(null);
    setPredictiveDaily(null);
    // Don't reset tank volume or other preferences as they might be constant
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-primary" />
            Advanced Water Change Calculator
          </DialogTitle>
          <DialogDescription>
            Calculate water changes based on your specific ecosystem needs.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            
            {/* Common Inputs */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Tank Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tank-vol">Total Volume (gal)</Label>
                  <Input
                    id="tank-vol"
                    type="number"
                    min="0"
                    value={tankVolume}
                    onChange={(e) => setTankVolume(e.target.value)}
                    placeholder="e.g. 55"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current-no3">Current Nitrate (ppm)</Label>
                  <Input
                    id="current-no3"
                    type="number"
                    min="0"
                    disabled
                    className={`disabled:opacity-100 font-semibold ${
                      !currentNitrate ? "" : 
                      parseFloat(currentNitrate) > getTarget() 
                      ? "bg-red-50 text-red-700 border-red-200" 
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                    value={currentNitrate}
                    onChange={(e) => setCurrentNitrate(e.target.value)}
                    placeholder="Calculated from food input..."
                  />
                  {predictiveDaily !== null && (
                    <p className="text-[10px] text-emerald-600 font-medium">
                      Filled from prediction
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Predictive Section */}
            <div className="p-4 rounded-md bg-muted/30 border space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Predict Nitrate Increase
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="predict-food" className="text-xs">Food (g/day)</Label>
                  <Input
                    id="predict-food"
                    type="number"
                    className="h-8 text-sm"
                    value={foodWeightGrams}
                    onChange={(e) => setFoodWeightGrams(e.target.value)}
                    placeholder="1.5"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="predict-protein" className="text-xs">Protein (%)</Label>
                  <Input
                    id="predict-protein"
                    type="number"
                    className="h-8 text-sm"
                    value={proteinPercentage}
                    onChange={(e) => setProteinPercentage(e.target.value)}
                    placeholder="40"
                  />
                </div>
              </div>
              {predictiveDaily !== null && (
                <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                  Predicted Increase: <span className="font-bold text-foreground">{predictiveDaily.toFixed(2)} ppm/day</span>
                </div>
              )}
            </div>

            {/* Calculator Modes */}
            <Tabs value={mode} onValueChange={setMode} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="simple">Simple</TabsTrigger>
                <TabsTrigger value="planted">Planted</TabsTrigger>
                <TabsTrigger value="fish-only">Fish Only</TabsTrigger>
                <TabsTrigger value="redfield">Redfield</TabsTrigger>
              </TabsList>

              <TabsContent value="simple" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="simple-goal">Goal Nitrate (ppm)</Label>
                  <Input
                    id="simple-goal"
                    type="number"
                    min="0"
                    value={simpleGoal}
                    onChange={(e) => setSimpleGoal(e.target.value)}
                    placeholder="e.g. 20"
                  />
                  <p className="text-xs text-muted-foreground">
                    Custom target based on your preference.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="planted" className="space-y-4">
                <div className="space-y-2">
                  <Label>Lighting Condition (Estimative Index)</Label>
                  <Select value={plantedLight} onValueChange={setPlantedLight}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Light (Target 5-10 ppm)</SelectItem>
                      <SelectItem value="medium">Medium Light (Target 10-20 ppm)</SelectItem>
                      <SelectItem value="high">High Light + CO2 (Target 20-30 ppm)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Nitrate is a fertilizer. Targets prevent algae while feeding plants.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="fish-only" className="space-y-4">
                <div className="space-y-2">
                  <Label>Stock Sensitivity (Toxicity Ceiling)</Label>
                  <Select value={fishType} onValueChange={setFishType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sensitive">Sensitive (Discus, Wild) - Max 15 ppm</SelectItem>
                      <SelectItem value="hardy">Hardy (Goldfish, Livebearers) - Max 40 ppm</SelectItem>
                      <SelectItem value="invertebrate">Invertebrates (Shrimp) - Max 10 ppm</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Keeps nitrate below toxic levels for your specific livestock.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="redfield" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phosphate">Phosphate PO4 (ppm)</Label>
                  <Input
                    id="phosphate"
                    type="number"
                    min="0"
                    value={phosphate}
                    onChange={(e) => setPhosphate(e.target.value)}
                    placeholder="e.g. 1.0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maintains 10:1 Nitrate:Phosphate ratio to prevent Cyanobacteria.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 pt-2">
              <Button onClick={calculate} variant="ocean" className="flex-1">
                Calculate
              </Button>
              <Button onClick={reset} variant="outline">
                Reset
              </Button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {result ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className={`border-l-4 ${result.type === 'change' ? 'border-l-blue-500' : result.type === 'dose' ? 'border-l-green-500' : 'border-l-emerald-500'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Recommendation</span>
                      <span className="text-sm font-normal text-muted-foreground">Target: {result.target} ppm</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-2">
                      {result.type === "change" && (
                        <>
                          <p className="text-4xl font-bold text-primary mb-1">
                            {result.percent.toFixed(0)}%
                          </p>
                          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Water Change
                          </p>
                          {result.volume > 0 && (
                            <p className="text-sm mt-2 text-foreground font-semibold">
                              ≈ {result.volume.toFixed(1)} Gallons
                            </p>
                          )}
                        </>
                      )}
                      
                      {result.type === "dose" && (
                        <>
                          <p className="text-4xl font-bold text-green-600 mb-1">DOSE</p>
                          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Fertilizer Needed
                          </p>
                        </>
                      )}

                      {result.type === "good" && (
                        <>
                          <p className="text-4xl font-bold text-emerald-600 mb-1">OK</p>
                          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Levels Optimal
                          </p>
                        </>
                      )}
                    </div>

                    <div className="bg-muted/50 p-3 rounded-md text-sm text-center">
                      {result.message}
                    </div>
                  </CardContent>
                </Card>

                {result.warning && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Safety Warning (50% Rule)</AlertTitle>
                    <AlertDescription>
                      {result.warning}
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="text-xs text-muted-foreground space-y-1 p-2">
                   <p className="font-semibold">Calculation Logic:</p>
                   {mode === "fish-only" ? (
                     <p>Target is a maximum safe limit. Change required only if exceeded.</p>
                   ) : (
                     <p>Water_To_Change = Total_Volume × (1 - (Target / Current))</p>
                   )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                <Droplets className="h-12 w-12 mb-4 opacity-20" />
                <p>Enter details and click Calculate</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
