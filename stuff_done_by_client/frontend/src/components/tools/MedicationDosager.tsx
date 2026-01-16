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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Pill, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { UnitConverter } from "./UnitConverter";

interface MedicationDosagerProps {
  children: React.ReactNode;
}

const PRESETS = [
    { id: "custom", name: "Custom Medication", dosage: 1, unit: "ml", perGal: 10, copper: false },
    { id: "general_cure", name: "API General Cure", dosage: 1, unit: "packet", perGal: 10, copper: false },
    { id: "paracleanse", name: "Fritz Paracleanse", dosage: 1, unit: "packet", perGal: 10, copper: false },
    { id: "ich_x", name: "Hikari Ich-X", dosage: 5, unit: "ml", perGal: 10, copper: false }, // Formaldehyde/Methanol
    { id: "coppersafe", name: "Mardel CopperSafe", dosage: 5, unit: "ml", perGal: 4, copper: true }, // Chelated Copper
    { id: "cupramine", name: "Seachem Cupramine", dosage: 1, unit: "ml", perGal: 10.5, copper: true }, // 20 drops (1ml) per 40L (10.5g)
    { id: "erythromycin", name: "API E.M. Erythromycin", dosage: 1, unit: "packet", perGal: 10, copper: false },
];

export const MedicationDosager = ({ children }: MedicationDosagerProps) => {
  const [tankVol, setTankVol] = useState<string>("");
  const [displacement, setDisplacement] = useState<string>("");
  const [selectedMed, setSelectedMed] = useState<string>("custom");
  const [customDosage, setCustomDosage] = useState<string>("1");
  const [customUnit, setCustomUnit] = useState<string>("ml");
  const [customPerGal, setCustomPerGal] = useState<string>("10");
  const [hasInverts, setHasInverts] = useState<boolean>(false);
  
  const [result, setResult] = useState<{ dose: number; unit: string; warning?: string } | null>(null);

  const calculate = () => {
    const vol = parseFloat(tankVol) || 0;
    const disp = parseFloat(displacement) || 0;
    const netVol = Math.max(0, vol - disp);

    const med = PRESETS.find(p => p.id === selectedMed) || PRESETS[0];
    
    // Determine parameters to use
    let dosage = med.dosage;
    let unit = med.unit;
    let perGal = med.perGal;

    if (selectedMed === "custom") {
        dosage = parseFloat(customDosage) || 0;
        unit = customUnit;
        perGal = parseFloat(customPerGal) || 1;
    }

    // Formula: Dose = (Net Volume / Standard Volume) * Dosage
    // e.g. 25 gal / 10 gal * 1 packet = 2.5 packets
    const totalDose = (netVol / perGal) * dosage;

    let warning = undefined;
    if (hasInverts && med.copper) {
        warning = "WARNING: This medication contains Copper, which is lethal to shrimp, snails, and other invertebrates!";
    }

    setResult({
        dose: totalDose,
        unit,
        warning
    });
  };

  const isCustom = selectedMed === "custom";

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            Medication Dosager
          </DialogTitle>
          <DialogDescription>
            Calculate exact medication doses by accounting for displacement.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tank Volume (gal)</Label>
                <Input
                  type="number"
                  value={tankVol}
                  onChange={(e) => setTankVol(e.target.value)}
                  placeholder="e.g. 29"
                />
              </div>
              <div className="space-y-2">
                <Label>Displacement (gal)</Label>
                <Input
                  type="number"
                  value={displacement}
                  onChange={(e) => setDisplacement(e.target.value)}
                  placeholder="e.g. 4"
                />
                <p className="text-[10px] text-muted-foreground">From Hardscape Calc</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Medication</Label>
              <Select value={selectedMed} onValueChange={setSelectedMed}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRESETS.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isCustom && (
              <div className="p-3 bg-muted rounded-md space-y-3 text-sm">
                <p className="font-semibold text-xs text-muted-foreground uppercase">Custom Dosage Rules</p>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label className="text-xs">Dose Amount</Label>
                    <Input value={customDosage} onChange={(e) => setCustomDosage(e.target.value)} className="h-8" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs">Unit</Label>
                    <Input value={customUnit} onChange={(e) => setCustomUnit(e.target.value)} placeholder="ml/pkt" className="h-8" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs">Per Gallons</Label>
                    <Input value={customPerGal} onChange={(e) => setCustomPerGal(e.target.value)} className="h-8" />
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="inverts"
                checked={hasInverts}
                onCheckedChange={(c) => setHasInverts(!!c)}
              />
              <Label htmlFor="inverts" className="text-sm font-normal cursor-pointer">
                I have invertebrates (Snails, Shrimp, Crabs)
              </Label>
            </div>
            <Button onClick={calculate} className="w-full" variant="ocean">
              Calculate Dose
            </Button>
          </div>
          <div className="space-y-4">
            {result && (
              <Card className={`border-none ${result.warning ? 'bg-red-50' : 'bg-muted/50'}`}>
                <CardContent className="pt-6">
                  {result.warning && (
                    <div className="flex gap-2 items-start text-red-600 mb-3 bg-white/50 p-2 rounded border border-red-200">
                      <AlertTriangle className="h-5 w-5 shrink-0" />
                      <p className="text-sm font-bold leading-tight">{result.warning}</p>
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Recommended Dose:</p>
                    <p className="text-2xl font-bold text-primary">
                      {result.dose.toLocaleString(undefined, { maximumFractionDigits: 2 })} {result.unit}s
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      based on {Math.max(0, parseFloat(tankVol||"0") - parseFloat(displacement||"0")).toFixed(1)} gal net volume
                    </p>
                  </div>
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
