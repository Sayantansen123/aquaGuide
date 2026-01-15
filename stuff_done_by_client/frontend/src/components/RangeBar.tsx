import React from "react";

interface RangeBarProps {
  label: string;
  rangeMin?: number;
  rangeMax?: number;
  unit?: string;
  decimals?: number;
  maxTicks?: number;
  fixedScale?: [number, number];
  gradient?: string;
  width?: number;
}

const RangeBar: React.FC<RangeBarProps> = ({
  label,
  rangeMin,
  rangeMax,
  unit,
  decimals = 1,
  maxTicks = 10,
  fixedScale,
  gradient,
  width = 10,
}) => {
  const format = (v?: number) =>
    typeof v === "number" && !isNaN(v) ? v.toFixed(decimals) : "N/A";
  const hasRange =
    typeof rangeMin === "number" &&
    typeof rangeMax === "number" &&
    !isNaN(rangeMin) &&
    !isNaN(rangeMax);

  // Use fixed scale if provided, else dynamic
  let min = 0,
    max = 1;
  if (fixedScale) {
    [min, max] = fixedScale;
  } else if (hasRange) {
    const padding = (rangeMax! - rangeMin!) * 0.2 || 1;
    min = Math.floor((rangeMin! - padding) * 10) / 10;
    max = Math.ceil((rangeMax! + padding) * 10) / 10;
    if (min === max) {
      min = Math.floor(rangeMin! - 1);
      max = Math.ceil(rangeMax! + 1);
    }
  }

  // Dynamically calculate tick step
  let tickStep = 1;
  if (hasRange) {
    const range = max - min;
    tickStep = Math.ceil(range / maxTicks);
    if (tickStep < 1) tickStep = 1;
  }

  // Generate scale ticks
  const ticks: number[] = [];
  if (hasRange) {
    for (let v = min; v <= max; v += tickStep) {
      ticks.push(Number(v.toFixed(decimals)));
    }
    if (ticks[ticks.length - 1] !== max)
      ticks.push(Number(max.toFixed(decimals)));
  }

  // Calculate highlight positions
  const left = hasRange ? ((rangeMin! - min) / (max - min)) * 100 : 0;
  const right = hasRange ? ((rangeMax! - min) / (max - min)) * 100 : 0;

  return (
    <div className="mb-6 ">
      <div className="flex justify-between text-xs mb-1 ">
        <span className="font-medium">{label}</span>
        {hasRange && (
          <span className="whitespace-nowrap">
            {format(rangeMin)}
            {unit} – {format(rangeMax)}
            {unit}
          </span>
        )}
      </div>
      <div
        className={`relative h-${width} mt-2 rounded-sm overflow-hidden `}
        style={{
          background: gradient || "var(--tw-bg-muted)",
        }}
      >
        {hasRange && (
          <>
            {/* Range box with border */}
            <div
              className="absolute"
              style={{
                left: `${left}%`,
                width: `${right - left}%`,
                top: "-2px",
                height: "12px",
                background: "rgba(255,255,255,0.18)",
                border: "1.5px solid #222",
                borderRadius: "6px",
                zIndex: 2,
                transition: "all 0.3s",
              }}
            />
            {/* Left marker as a thin pill/circle */}
            <div
              className="absolute"
              style={{
                left: `calc(${left}% - 4px)`,
                top: "-3px",
                width: "8px",
                height: "14px",
                background: "#fff",
                border: "1.5px solid #222",
                borderRadius: "4px",
                zIndex: 3,
              }}
            />
            {/* Right marker as a thin pill/circle */}
            <div
              className="absolute"
              style={{
                left: `calc(${right}% - 4px)`,
                top: "-3px",
                width: "8px",
                height: "14px",
                background: "#fff",
                border: "1.5px solid #222",
                borderRadius: "4px",
                zIndex: 3,
              }}
            />
          </>
        )}
      </div>
      {/* Scale ticks */}
      {hasRange && (
        <div className="flex justify-between text-xs mt-1 text-muted-foreground">
          {ticks.map((tick, i) => (
            <span key={i} style={{ minWidth: 16, textAlign: "center" }}>
              {tick}
            </span>
          ))}
        </div>
      )}
      {/* N/A label if no range */}
      {!hasRange && (
        <div className="text-center text-xs text-muted-foreground mt-1">
          N/A
        </div>
      )}
    </div>
  );
};

export default RangeBar;
