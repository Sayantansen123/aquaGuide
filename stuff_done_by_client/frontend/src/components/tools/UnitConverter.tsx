import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRightLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type UnitType = "length" | "volume" | "temperature" | "weight";

interface UnitConverterProps {
  types: UnitType[];
}

const CONVERSION_RATES: Record<string, number> = {
  // Length (base: cm)
  mm: 0.1,
  cm: 1,
  in: 2.54,
  ft: 30.48,

  // Volume (base: liters)
  ml: 0.001,
  l: 1,
  gal: 3.78541,
  cu_ft: 28.3168,

  // Weight (base: kg)
  g: 0.001,
  kg: 1,
  oz: 0.0283495,
  lb: 0.453592,
};

// Temperature is special
const convertTemp = (val: number, from: string, to: string): number => {
  if (from === to) return val;
  let c = val;
  if (from === "f") c = (val - 32) * (5 / 9);
  if (to === "f") return c * (9 / 5) + 32;
  return c;
};

const convert = (val: number, from: string, to: string, type: UnitType): number => {
  if (type === "temperature") return convertTemp(val, from, to);
  const fromRate = CONVERSION_RATES[from];
  const toRate = CONVERSION_RATES[to];
  const baseVal = val * fromRate;
  return baseVal / toRate;
};

const ConverterBlock = ({
  title,
  units,
  type,
}: {
  title: string;
  units: { label: string; value: string }[];
  type: UnitType;
}) => {
  const [val1, setVal1] = useState<string>("");
  const [unit1, setUnit1] = useState<string>(units[0].value);
  const [val2, setVal2] = useState<string>("");
  const [unit2, setUnit2] = useState<string>(units[1]?.value || units[0].value);

  const handleVal1Change = (v: string) => {
    setVal1(v);
    const num = parseFloat(v);
    if (!isNaN(num)) {
      setVal2(convert(num, unit1, unit2, type).toFixed(2));
    } else {
      setVal2("");
    }
  };

  const handleVal2Change = (v: string) => {
    setVal2(v);
    const num = parseFloat(v);
    if (!isNaN(num)) {
      setVal1(convert(num, unit2, unit1, type).toFixed(2));
    } else {
      setVal1("");
    }
  };

  // Re-calculate when units change
  useEffect(() => {
    const num = parseFloat(val1);
    if (!isNaN(num)) {
      setVal2(convert(num, unit1, unit2, type).toFixed(2));
    }
  }, [unit1, unit2]);

  return (
    <div className="space-y-2 border rounded-md p-3 bg-card/50">
      <Label className="text-xs font-semibold uppercase text-muted-foreground">
        {title}
      </Label>
      <div className="flex items-center gap-2">
        <div className="flex-1 space-y-1">
          <Input
            type="number"
            value={val1}
            onChange={(e) => handleVal1Change(e.target.value)}
            className="h-8"
            placeholder="0"
          />
          <Select value={unit1} onValueChange={setUnit1}>
            <SelectTrigger className="h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {units.map((u) => (
                <SelectItem key={u.value} value={u.value}>
                  {u.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ArrowRightLeft className="h-4 w-4 text-muted-foreground shrink-0" />
        <div className="flex-1 space-y-1">
          <Input
            type="number"
            value={val2}
            onChange={(e) => handleVal2Change(e.target.value)}
            className="h-8"
            placeholder="0"
          />
          <Select value={unit2} onValueChange={setUnit2}>
            <SelectTrigger className="h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {units.map((u) => (
                <SelectItem key={u.value} value={u.value}>
                  {u.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export const UnitConverter = ({ types }: UnitConverterProps) => {
  return (
    <div className="space-y-4 mt-6 pt-6 border-t">
      <h3 className="font-semibold flex items-center gap-2 text-sm">
        <ArrowRightLeft className="h-4 w-4" />
        Unit Helpers
      </h3>
      <div className="grid gap-3">
        {types.includes("length") && (
          <ConverterBlock
            title="Length"
            type="length"
            units={[
              { label: "Inches", value: "in" },
              { label: "Centimeters", value: "cm" },
              { label: "Millimeters", value: "mm" },
              { label: "Feet", value: "ft" },
            ]}
          />
        )}
        {types.includes("volume") && (
          <ConverterBlock
            title="Volume"
            type="volume"
            units={[
              { label: "Gallons", value: "gal" },
              { label: "Liters", value: "l" },
              { label: "Milliliters", value: "ml" },
              { label: "Cubic Feet", value: "cu_ft" },
            ]}
          />
        )}
        {types.includes("temperature") && (
          <ConverterBlock
            title="Temperature"
            type="temperature"
            units={[
              { label: "Fahrenheit", value: "f" },
              { label: "Celsius", value: "c" },
            ]}
          />
        )}
        {types.includes("weight") && (
          <ConverterBlock
            title="Weight"
            type="weight"
            units={[
              { label: "Pounds", value: "lb" },
              { label: "Kilograms", value: "kg" },
              { label: "Grams", value: "g" },
              { label: "Ounces", value: "oz" },
            ]}
          />
        )}
      </div>
    </div>
  );
};
