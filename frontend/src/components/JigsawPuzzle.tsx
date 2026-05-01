import { useState, useRef, useCallback, useEffect } from "react";
import { Sparkles } from "lucide-react";

interface PieceState { x: number; y: number; placed: boolean; }

const VB = 128;
const BASE = 100;

// 4 unique interlocking jigsaw paths (tabs & slots match between adjacent pieces)
const P_TL = `M0,0 L100,0 L100,35 C100,32 102,28 108,28 C118,28 122,38 122,50 C122,62 118,72 108,72 C102,72 100,68 100,65 L100,100 L65,100 C68,100 72,102 72,108 C72,118 62,122 50,122 C38,122 28,118 28,108 C28,102 32,100 35,100 L0,100 Z`;
const P_TR = `M0,0 L100,0 L100,100 L65,100 C68,100 72,102 72,108 C72,118 62,122 50,122 C38,122 28,118 28,108 C28,102 32,100 35,100 L0,100 L0,65 C0,68 2,72 8,72 C18,72 22,62 22,50 C22,38 18,28 8,28 C2,28 0,32 0,35 Z`;
const P_BL = `M0,0 L35,0 C32,0 28,2 28,8 C28,18 38,22 50,22 C62,22 72,18 72,8 C72,2 68,0 65,0 L100,0 L100,35 C100,32 102,28 108,28 C118,28 122,38 122,50 C122,62 118,72 108,72 C102,72 100,68 100,65 L100,100 L0,100 Z`;
const P_BR = `M0,0 L35,0 C32,0 28,2 28,8 C28,18 38,22 50,22 C62,22 72,18 72,8 C72,2 68,0 65,0 L100,0 L100,100 L0,100 L0,65 C0,68 2,72 8,72 C18,72 22,62 22,50 C22,38 18,28 8,28 C2,28 0,32 0,35 Z`;

const paths = [P_TL, P_TR, P_BL, P_BR];
const viewBox = `-4 -4 ${VB} ${VB}`;

// Each round has a different image, piece labels, and completion message
const rounds = [
  {
    image: "/jigsaw.jpg",
    labels: ["Care", "Community", "Knowledge", "Passion"],
    title: "You Completed It!",
    message: "Great pet care comes from Care, Community, Knowledge, and Passion.",
  },
  {
    image: "/jigsaw2.jpg",
    labels: ["Love", "Trust", "Joy", "Bond"],
    title: "Puzzle Solved!",
    message: "Every pet deserves Love, Trust, Joy, and a lifelong Bond.",
  },
  {
    image: "/jigsaw3.jpg",
    labels: ["Feed", "Play", "Train", "Heal"],
    title: "Well Done!",
    message: "The pillars of pet wellness: Feed well, Play often, Train gently, Heal with care.",
  },
  {
    image: "/jigsaw4.jpg",
    labels: ["Explore", "Learn", "Share", "Grow"],
    title: "Amazing!",
    message: "Your journey with pets is about Exploring, Learning, Sharing, and Growing together.",
  },
];


const lightFills = ["#E8524A", "#F0A830", "#E88DA0", "#2AA5A0"];
const lightStrokes = ["#c0392b", "#d4922a", "#c97080", "#1e8884"];
const darkFills = ["#0891b2", "#059669", "#7c3aed", "#0d9488"];
const darkStrokes = ["#067a96", "#047857", "#6d28d9", "#0f766e"];

// Responsive sizing helper
function useResponsive() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Mobile < 480, Tablet < 768, Desktop >= 768
  if (width < 480) return { pieceSize: 90, snap: 32, padX: 80, padY: 80, scatter: 0.3, fontSize: { icon: 15, label: 8, check: 6 } };
  if (width < 768) return { pieceSize: 110, snap: 36, padX: 110, padY: 100, scatter: 0.42, fontSize: { icon: 17, label: 9, check: 7 } };
  if (width < 1024) return { pieceSize: 140, snap: 42, padX: 200, padY: 160, scatter: 0.65, fontSize: { icon: 20, label: 10, check: 8 } };
  return { pieceSize: 170, snap: 48, padX: 420, padY: 300, scatter: 1, fontSize: { icon: 22, label: 11, check: 8 } };
}

export function JigsawPuzzle() {
  const cRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ i: number; ox: number; oy: number } | null>(null);
  const [dark, setDark] = useState(false);
  const [roundIdx, setRoundIdx] = useState(0);
  const resp = useResponsive();
  const round = rounds[roundIdx];

  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const fills = dark ? darkFills : lightFills;
  const strokes = dark ? darkStrokes : lightStrokes;

  const PD = resp.pieceSize;
  const basePixel = (BASE / VB) * PD;

  const targets = [
    { x: 0, y: 0 },
    { x: basePixel, y: 0 },
    { x: 0, y: basePixel },
    { x: basePixel, y: basePixel },
  ];

  const scatter = useCallback((): PieceState[] => {
    const s = resp.scatter;
    const zones = [
      { x: -170 * s, y: -20 * s },
      { x: 320 * s, y: -40 * s },
      { x: -150 * s, y: 250 * s },
      { x: 350 * s, y: 260 * s },
    ];
    return zones.map(z => ({
      x: z.x + Math.random() * 20 - 10,
      y: z.y + Math.random() * 20 - 10,
      placed: false,
    }));
  }, [resp.scatter]);

  const [pcs, setPcs] = useState<PieceState[]>(scatter);
  const [done, setDone] = useState(false);
  const [showMsg, setShowMsg] = useState(false);

  useEffect(() => {
    if (pcs.every(p => p.placed) && !done) {
      setDone(true);
      setTimeout(() => setShowMsg(true), 600);
    }
  }, [pcs, done]);

  const onDown = (e: React.PointerEvent, i: number) => {
    if (pcs[i].placed) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const r = cRef.current!.getBoundingClientRect();
    drag.current = { i, ox: e.clientX - r.left - pcs[i].x, oy: e.clientY - r.top - pcs[i].y };
  };

  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const r = cRef.current!.getBoundingClientRect();
    const { i, ox, oy } = drag.current;
    setPcs(p => { const u = [...p]; u[i] = { ...u[i], x: e.clientX - r.left - ox, y: e.clientY - r.top - oy }; return u; });
  };

  const onUp = () => {
    if (!drag.current) return;
    const { i } = drag.current;
    drag.current = null;
    setPcs(p => {
      const u = [...p];
      const t = targets[i];
      const d = Math.sqrt((u[i].x - t.x) ** 2 + (u[i].y - t.y) ** 2);
      if (d < resp.snap) u[i] = { x: t.x, y: t.y, placed: true };
      return u;
    });
  };

  const reset = () => { setDone(false); setShowMsg(false); setRoundIdx(prev => (prev + 1) % rounds.length); setPcs(scatter()); };

  const areaW = basePixel * 2 + resp.padX;
  const areaH = basePixel * 2 + resp.padY;
  const oL = (areaW - basePixel * 2) / 2;
  const oT = (areaH - basePixel * 2) / 2;

  return (
    <section className="py-12 sm:py-16 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4 xl:flex xl:justify-center xl:items-center">
        <div className="flex flex-col items-center gap-2 sm:gap-3 mb-8 sm:mb-10 md:mb-16">
          <div className="flex items-center gap-2 sm:gap-3">

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">Solve the Puzzle</h2>

          </div>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base text-center max-w-md">
            Drag and place the pieces together to reveal our secret message!
          </p>
        </div>

        <div className="flex justify-center overflow-visible">
          <div ref={cRef} className="relative select-none touch-none"
            style={{ width: areaW, height: areaH, maxWidth: "100%" }}
            onPointerMove={onMove} onPointerUp={onUp}>

            {/* Drop zone */}
            <div className="absolute rounded-xl sm:rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 transition-opacity duration-500"
              style={{ width: basePixel * 2, height: basePixel * 2, left: oL, top: oT, opacity: done ? 0 : 1 }}>
              <div className="absolute inset-0 flex items-center justify-center"><div className="w-px h-full bg-primary/10" /></div>
              <div className="absolute inset-0 flex items-center justify-center"><div className="h-px w-full bg-primary/10" /></div>
            </div>

            {/* Pieces */}
            {pcs.map((pc, i) => (
              <div key={i}
                className={pc.placed ? "absolute z-10" : "absolute z-20 hover:z-30"}
                style={{
                  width: PD, height: PD,
                  left: oL + pc.x, top: oT + pc.y,
                  transition: pc.placed ? "left .4s cubic-bezier(.4,0,.2,1), top .4s cubic-bezier(.4,0,.2,1)" : "none",
                  cursor: pc.placed ? "default" : "grab",
                  filter: pc.placed ? "drop-shadow(0 2px 6px rgba(0,0,0,.2))" : "drop-shadow(0 8px 20px rgba(0,0,0,.35))",
                }}
                onPointerDown={e => onDown(e, i)}>
                <svg viewBox={viewBox} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <clipPath id={`jpc${i}`}><path d={paths[i]} /></clipPath>
                  </defs>
                  <g clipPath={`url(#jpc${i})`}>
                    {/* Background image — offset so each piece shows its quadrant */}
                    <image
                      href={round.image}
                      x={i === 1 || i === 3 ? -BASE : 0}
                      y={i === 2 || i === 3 ? -BASE : 0}
                      width={BASE * 2}
                      height={BASE * 2}
                      preserveAspectRatio="xMidYMid slice"
                    />
                    {/* Slight overlay for text readability */}
                    <rect x="-4" y="-4" width={VB} height={VB} fill="rgba(0,0,0,0.25)" />
                  </g>
                  <path d={paths[i]} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinejoin="round" />

                  <text x="50" y="64" textAnchor="middle" fontSize={resp.fontSize.label} fontWeight="bold" fill="white" dominantBaseline="central" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>{round.labels[i]}</text>
                  {pc.placed && <text x="50" y="78" textAnchor="middle" fontSize={resp.fontSize.check} fill="rgba(255,255,255,.8)" dominantBaseline="central">✓ Placed</text>}
                </svg>
              </div>
            ))}

            {/* Completion */}
            {done && (
              <div className="absolute inset-0 flex items-center justify-center z-40" style={{ animation: "jfade .6s ease forwards" }}>
                <div className={`px-6 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12 rounded-2xl sm:rounded-3xl backdrop-blur-lg shadow-2xl text-center transition-all duration-700 max-w-[90vw] border ${dark
                  ? "bg-gradient-to-br from-[hsl(200,50%,12%)] via-[hsl(186,80%,18%)] to-[hsl(200,50%,12%)] border-white/15"
                  : "bg-gradient-to-br from-[hsl(34,80%,95%)] via-[hsl(30,60%,88%)] to-[hsl(34,80%,95%)] border-[hsl(32,40%,70%)]/40"
                  } ${showMsg ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>

                  <h3 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold mb-2 sm:mb-3 ${dark ? "text-white" : "text-[hsl(6,27%,23%)]"}`}>
                    {round.title}
                  </h3>
                  <p className={`text-xs sm:text-sm md:text-base max-w-xs mx-auto leading-relaxed mb-4 sm:mb-6 ${dark ? "text-white/80" : "text-[hsl(6,27%,23%)]/80"}`}>
                    {round.message}
                  </p>
                  <button onClick={reset} className={`px-5 py-2 sm:px-6 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm border transition-all duration-300 hover:scale-105 active:scale-95 ${dark
                    ? "bg-white/15 hover:bg-white/25 text-white border-white/25"
                    : "bg-[hsl(32,50%,55%)]/90 hover:bg-[hsl(32,50%,45%)] text-white border-[hsl(32,40%,50%)]/40"
                    }`}>
                    Play Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
      <style>{`@keyframes jfade { from { opacity:0; transform:scale(.9) } to { opacity:1; transform:scale(1) } }`}</style>
    </section>
  );
}
