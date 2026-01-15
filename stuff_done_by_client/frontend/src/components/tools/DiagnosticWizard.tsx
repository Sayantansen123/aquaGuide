import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, Sprout, AlertCircle, CheckCircle2 } from "lucide-react";

interface DiagnosticWizardProps {
  children: React.ReactNode;
}

type WizardMode = "plants" | "algae" | null;

export const DiagnosticWizard = ({ children }: DiagnosticWizardProps) => {
  const [mode, setMode] = useState<WizardMode>(null);
  const [step, setStep] = useState(0);
  
  // Plant State
  const [plantLocation, setPlantLocation] = useState<"new" | "old" | "">("");
  const [plantSymptom, setPlantSymptom] = useState<"yellowing" | "holes" | "death" | "">("");

  // Algae State
  const [algaeTexture, setAlgaeTexture] = useState<"slimy" | "hair" | "">("");
  const [algaeColor, setAlgaeColor] = useState<"blue-green" | "black-grey" | "">("");

  const reset = () => {
      setMode(null);
      setStep(0);
      setPlantLocation("");
      setPlantSymptom("");
      setAlgaeTexture("");
      setAlgaeColor("");
  };

  const getResult = () => {
      if (mode === "plants") {
          if (plantLocation === "new" && plantSymptom === "yellowing") {
              return { diagnosis: "Iron (Fe) Deficiency", solution: "Dose liquid iron fertilizer or root tabs.", color: "text-yellow-600" };
          }
          if (plantLocation === "old" && plantSymptom === "holes") {
              return { diagnosis: "Potassium (K) Deficiency", solution: "Add potassium supplement (K).", color: "text-orange-600" };
          }
          if (plantLocation === "old" && (plantSymptom === "yellowing" || plantSymptom === "death")) {
              return { diagnosis: "Nitrogen (N) Deficiency", solution: "Increase bioload or dose Nitrogen/Nitrates.", color: "text-red-600" };
          }
          return { diagnosis: "Unclear Diagnosis", solution: "Check water parameters and lighting.", color: "text-gray-600" };
      } else if (mode === "algae") {
          if (algaeTexture === "slimy" && algaeColor === "blue-green") {
              return { diagnosis: "Cyanobacteria (Blue-Green Algae)", solution: "Increase flow, check Nitrates, blackout tank for 3 days.", color: "text-teal-600" };
          }
          if (algaeTexture === "hair" && algaeColor === "black-grey") {
              return { diagnosis: "Black Beard Algae (BBA)", solution: "Spot treat with Excel/Glutaraldehyde, stabilize CO2 levels.", color: "text-gray-800" };
          }
          return { diagnosis: "Other Algae Type", solution: "Reduce light duration and check nutrient balance.", color: "text-green-600" };
      }
      return null;
  };

  const result = (step === 2) ? getResult() : null;

  return (
    <Dialog onOpenChange={(open) => !open && reset()}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            Visual Diagnostic Wizard
          </DialogTitle>
          <DialogDescription>
            Identify plant deficiencies and algae problems using visual cues.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
          <div className="space-y-6">
            {step === 0 && (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2 border-2 hover:border-primary/50"
                  onClick={() => { setMode("plants"); setStep(1); }}
                >
                  <Sprout className="h-8 w-8 text-green-600" />
                  <span>Plant Issues</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2 border-2 hover:border-primary/50"
                  onClick={() => { setMode("algae"); setStep(1); }}
                >
                  <AlertCircle className="h-8 w-8 text-red-500" />
                  <span>Algae Issues</span>
                </Button>
              </div>
            )}
            {step === 1 && mode === "plants" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Where is the damage located?</Label>
                    <Select onValueChange={(v) => setPlantLocation(v as "new" | "old")}>
                    <SelectTrigger><SelectValue placeholder="Select location..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New Growth (Top/Tips)</SelectItem>
                      <SelectItem value="old">Old Growth (Bottom/Older leaves)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {plantLocation && (
                  <div className="space-y-2">
                    <Label>What does it look like?</Label>
                    <Select onValueChange={(v) => setPlantSymptom(v as "yellowing" | "holes" | "death")}>
                      <SelectTrigger><SelectValue placeholder="Select symptom..." /></SelectTrigger>
                      <SelectContent>
                        {plantLocation === "new" ? (
                          <SelectItem value="yellowing">Yellowing / Pale</SelectItem>
                        ) : (
                          <>
                            <SelectItem value="holes">Pinholes</SelectItem>
                            <SelectItem value="yellowing">Yellowing / Dying off</SelectItem>
                            <SelectItem value="death">Turning Brown/Transparent</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button
                  className="w-full mt-4"
                  disabled={!plantLocation || !plantSymptom}
                  onClick={() => setStep(2)}
                >
                  Diagnose
                </Button>
              </div>
            )}
            {step === 1 && mode === "algae" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Texture</Label>
                  <Select onValueChange={(v) => setAlgaeTexture(v as "slimy" | "hair")}>
                    <SelectTrigger><SelectValue placeholder="Select texture..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slimy">Slimy / Sheet-like</SelectItem>
                      <SelectItem value="hair">Hair-like / Tuft / Fuzzy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Select onValueChange={(v) => setAlgaeColor(v as "blue-green" | "black-grey")}>
                    <SelectTrigger><SelectValue placeholder="Select color..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue-green">Blue-Green</SelectItem>
                      <SelectItem value="black-grey">Black / Grey / Dark Purple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="w-full mt-4"
                  disabled={!algaeTexture || !algaeColor}
                  onClick={() => setStep(2)}
                >
                  Identify Algae
                </Button>
              </div>
            )}
          </div>
          <div className="space-y-4">
            {step === 2 && result && (
              <Card className="bg-muted/50 border-none animate-in fade-in zoom-in duration-300">
                <CardContent className="pt-6 text-center">
                  <CheckCircle2 className={`h-12 w-12 mx-auto mb-2 ${result.color}`} />
                  <h3 className={`text-xl font-bold ${result.color}`}>{result.diagnosis}</h3>
                  <div className="mt-4 p-3 bg-background rounded-md border text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Solution: </span>
                    {result.solution}
                  </div>
                  <Button variant="ghost" onClick={reset} className="mt-4 text-xs">Start Over</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
