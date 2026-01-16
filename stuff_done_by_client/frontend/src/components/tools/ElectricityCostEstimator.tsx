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
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Zap, Info, Snowflake, Sun } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ElectricityCostEstimatorProps {
  children: React.ReactNode;
}

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "USD ($)" },
  { code: "EUR", symbol: "€", name: "EUR (€)" },
  { code: "GBP", symbol: "£", name: "GBP (£)" },
  { code: "INR", symbol: "₹", name: "INR (₹)" },
  { code: "CAD", symbol: "C$", name: "CAD (C$)" },
  { code: "AUD", symbol: "A$", name: "AUD (A$)" },
  { code: "JPY", symbol: "¥", name: "JPY (¥)" },
];

export const ElectricityCostEstimator = ({ children }: ElectricityCostEstimatorProps) => {
  const [watts, setWatts] = useState<string>("");
  const [hours, setHours] = useState<string>("");
  const [rate, setRate] = useState<string>("0.12"); // Default 0.12/kWh
  const [isHeater, setIsHeater] = useState(false);
  const [winterMode, setWinterMode] = useState(false);
  const [currency, setCurrency] = useState<string>("USD");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const w = parseFloat(watts) || 0;
    const r = parseFloat(rate) || 0;
    const h = parseFloat(hours) || 0;

    // Heater duty cycle: 0.25 (Summer/Standard) or 0.50 (Winter/Cold)
    let dutyCycle = 1.0;

    if (isHeater) {
        dutyCycle = winterMode ? 0.50 : 0.25;
    }
    
    // Formula: ((Watts * Hours * Duty_Cycle) / 1000) * Days * kWh_Rate
    const kwhPerMonth = ((w * h * dutyCycle) / 1000) * 30;
    const cost = kwhPerMonth * r;

    setResult(cost);
  };

  const selectedCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Electricity Cost Estimator
          </DialogTitle>
          <DialogDescription>
            Estimate the monthly running cost of aquarium equipment.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Calculator Controls */}
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Power (Watts)</Label>
                        <Input 
                            type="number" 
                            value={watts} 
                            onChange={(e) => setWatts(e.target.value)} 
                            placeholder="e.g. 50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Hours per Day</Label>
                        <Input 
                            type="number" 
                            value={hours} 
                            onChange={(e) => setHours(e.target.value)} 
                            placeholder="e.g. 24"
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 space-y-2">
                        <Label>Currency</Label>
                        <Select value={currency} onValueChange={setCurrency}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {CURRENCIES.map((c) => (
                                    <SelectItem key={c.code} value={c.code}>
                                        {c.code}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="col-span-2 space-y-2">
                        <Label>Cost per kWh</Label>
                        <div className="relative">
                            <div className="absolute left-3 top-2.5 text-muted-foreground font-medium text-sm">
                                {selectedCurrency.symbol}
                            </div>
                            <Input 
                                type="number" 
                                value={rate} 
                                onChange={(e) => setRate(e.target.value)} 
                                className="pl-9"
                                placeholder="0.12"
                            />
                        </div>
                    </div>
                </div>
                <p className="text-[10px] text-muted-foreground text-right -mt-4">
                    Check your utility bill (avg {selectedCurrency.symbol}0.12 - {selectedCurrency.symbol}0.20)
                </p>

                <div className="h-[220px] space-y-4 border rounded-lg p-4 bg-muted/20">
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="heater" 
                            checked={isHeater} 
                            onCheckedChange={(c) => {
                                const checked = !!c;
                                setIsHeater(checked);
                                if (checked) setHours("24");
                            }} 
                        />
                        <Label htmlFor="heater" className="text-sm font-normal cursor-pointer">
                            This is a Heater
                        </Label>
                    </div>

                    <div className={`space-y-4 pl-6 border-l-2 border-primary/20 transition-all duration-200 ${isHeater ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {winterMode ? <Snowflake className="h-4 w-4 text-blue-500" /> : <Sun className="h-4 w-4 text-orange-500" />}
                                <Label htmlFor="winter-mode" className="text-sm font-medium">
                                    {winterMode ? "Winter / Cold Room Mode" : "Summer / Standard Mode"}
                                </Label>
                            </div>
                            <Switch
                                id="winter-mode"
                                checked={winterMode}
                                onCheckedChange={setWinterMode}
                            />
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                            Applies {winterMode ? "50%" : "25%"} Duty Cycle. 
                            <HoverCard>
                                <HoverCardTrigger asChild>
                                    <span className="text-primary cursor-pointer hover:underline ml-1">
                                        Want to know why?
                                    </span>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80 max-h-[300px] overflow-y-auto">
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold">Why 25% is the "Golden Ratio"</h4>
                                        <ul className="text-xs space-y-2 list-disc pl-3">
                                            <li>
                                                <span className="font-semibold">Cycles, not Constant:</span> Heaters cycle ON/OFF. In a 68-72°F room, a heater only runs briefly to maintain 78°F.
                                            </li>
                                            <li>
                                                <span className="font-semibold">Specific Heat:</span> Water holds heat well, allowing long OFF periods.
                                            </li>
                                            <li>
                                                <span className="font-semibold">Prevent Bill Shock:</span> Calculating 24h runtime overestimates cost by 4x. 25% (~6h/day) is the industry average.
                                            </li>
                                        </ul>
                                        <h4 className="text-sm font-semibold mt-2">Winter Mode (50%)</h4>
                                        <p className="text-xs">
                                            Used for cold basements, drafty rooms, or open-top tanks where heat loss is rapid, forcing the heater to run ~30 mins per hour.
                                        </p>
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        </div>
                    </div>
                </div>

                <Button onClick={calculate} className="w-full" variant="ocean">
                    Calculate Monthly Cost
                </Button>
            </div>

            {/* Right Column: Educational Content & Pro Tips */}
            <div className="space-y-4">
                <div className="h-[140px]">
                    <Card className="bg-muted/50 border-none">
                        <CardContent className="pt-6 text-center">
                            <p className="text-sm text-muted-foreground">Estimated Monthly Cost</p>
                            <p className="text-3xl font-bold text-primary">
                                {selectedCurrency.symbol}{result?.toFixed(2) ?? '0.00'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {selectedCurrency.symbol}{((result || 0) * 12).toFixed(2)} per year
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-xs text-muted-foreground space-y-2 bg-yellow-50/50 p-4 rounded-md dark:bg-yellow-900/10 h-fit">
                    <p className="font-semibold text-yellow-700 dark:text-yellow-500 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Factors Affecting Cost:
                    </p>
                    <ul className="list-disc pl-4 space-y-2 pt-2">
                        <li>
                            <span className="font-medium text-foreground">Winter vs. Summer:</span> 
                            <span className="block mt-1">Cold basements can jump duty cycle to 50%+.</span>
                        </li>
                        <li>
                            <span className="font-medium text-foreground">Open Top vs. Lids:</span> 
                            <span className="block mt-1">No lids = faster heat loss due to evaporation.</span>
                        </li>
                        <li>
                            <span className="font-medium text-foreground">Extreme Differentials:</span> 
                            <span className="block mt-1">High temps (e.g., Discus 86°F) in cold rooms increase runtime significantly.</span>
                        </li>
                    </ul>
                </div>

                {/* Show Pro-Tip if Heater + Winter Mode selected, even before calculation to be proactive */}
                <div className="h-[120px]">
                    <Alert className={`bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 transition-all duration-200 ${isHeater && winterMode ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertTitle className="text-blue-800 dark:text-blue-300">Pro-Tip for the Aquarist</AlertTitle>
                        <AlertDescription className="text-blue-700 dark:text-blue-400 text-xs mt-2 leading-relaxed">
                            High winter costs? Adding a glass lid or polycarbonate cover can reduce the heater's duty cycle by up to 40% by trapping heat and stopping evaporative cooling.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
