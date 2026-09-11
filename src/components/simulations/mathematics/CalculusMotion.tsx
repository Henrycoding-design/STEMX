import React, { useState, useEffect, useRef } from "react";
import { simulationsData } from "../../../data/mockData";
import { useAppProgress } from "../../../context/AppContext";
import QuizPanel from "../../quiz/QuizPanel";
import { Play, Pause, RotateCcw, Activity, HelpCircle } from "lucide-react";

type MotionPreset = "cubic" | "harmonic" | "freefall";

export default function CalculusMotion() {
  const simId = "calculus-motion";
  const simInfo = simulationsData.find(s => s.id === simId)!;
  const { recordEvent } = useAppProgress();

  const [preset, setPreset] = useState<MotionPreset>("cubic");
  const [time, setTime] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reqRef = useRef<number>();

  useEffect(() => {
    recordEvent({ type: "simulation_started", simulationId: simId, topic: simInfo.topic });
  }, []);

  // Motion functions based on preset
  const getMotionValues = (t: number, selectedPreset = preset) => {
    if (selectedPreset === "cubic") {
      // s(t) = t^3 - 6t^2 + 9t
      // v(t) = 3t^2 - 12t + 9
      // a(t) = 6t - 12
      const s = Math.pow(t, 3) - 6 * Math.pow(t, 2) + 9 * t;
      const v = 3 * Math.pow(t, 2) - 12 * t + 9;
      const a = 6 * t - 12;
      return { s, v, a, formula: "s(t) = t³ - 6t² + 9t", tMax: 4.5 };
    } else if (selectedPreset === "harmonic") {
      // s(t) = 4 * sin(2t)
      // v(t) = 8 * cos(2t)
      // a(t) = -16 * sin(2t)
      const s = 4 * Math.sin(2 * t);
      const v = 8 * Math.cos(2 * t);
      const a = -16 * Math.sin(2 * t);
      return { s, v, a, formula: "s(t) = 4·sin(2t)", tMax: 5.0 };
    } else {
      // Free fall with initial velocity: s(t) = 15t - 4.9t^2
      // v(t) = 15 - 9.8t
      // a(t) = -9.8
      const s = 15 * t - 4.9 * Math.pow(t, 2);
      const v = 15 - 9.8 * t;
      const a = -9.8;
      return { s, v, a, formula: "s(t) = 15t - 4.9t²", tMax: 3.1 };
    }
  };

  const { s: currentS, v: currentV, a: currentA, tMax } = getMotionValues(time);

  // Status interpretation: Speeding up or slowing down
  const isSpeedingUp = (currentV > 0 && currentA > 0) || (currentV < 0 && currentA < 0);
  const isStationary = Math.abs(currentV) < 0.05;

  // Animation timer loop
  useEffect(() => {
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (isPlaying) {
        setTime(prev => {
          const next = prev + dt * 0.75;
          if (next >= tMax) return 0;
          return next;
        });
      }
      reqRef.current = requestAnimationFrame(tick);
    };

    reqRef.current = requestAnimationFrame(tick);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [isPlaying, tMax]);

  // Graph Canvas Plotting
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Dark canvas background
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, w, h);

    const padLeft = 45;
    const padRight = 20;
    const padTop = 20;
    const padBottom = 30;
    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;
    const midY = padTop + plotH / 2;

    // Grid lines
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padTop + (plotH / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(w - padRight, y);
      ctx.stroke();
    }

    // Zero baseline
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padLeft, midY);
    ctx.lineTo(w - padRight, midY);
    ctx.stroke();

    // Scale mapping functions
    const tToX = (tVal: number) => padLeft + (tVal / tMax) * plotW;
    const yMaxVal = preset === "harmonic" ? 18 : preset === "cubic" ? 12 : 20;
    const valToY = (val: number) => midY - (val / yMaxVal) * (plotH / 2);

    // Plot helper
    const drawCurve = (color: string, getter: (t: number) => number) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const steps = 150;
      for (let i = 0; i <= steps; i++) {
        const tVal = (i / steps) * tMax;
        const val = getter(tVal);
        const px = tToX(tVal);
        const py = Math.max(padTop, Math.min(padTop + plotH, valToY(val)));
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    };

    // 1. Position curve s(t)
    drawCurve("#6366f1", (t) => getMotionValues(t, preset).s);
    // 2. Velocity curve v(t) = s'(t)
    drawCurve("#10b981", (t) => getMotionValues(t, preset).v);
    // 3. Acceleration curve a(t) = v'(t)
    drawCurve("#f43f5e", (t) => getMotionValues(t, preset).a);

    // Vertical time marker
    const cursorX = tToX(time);
    ctx.strokeStyle = "#f8fafc";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cursorX, padTop);
    ctx.lineTo(cursorX, padTop + plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Highlight current values on graph
    const plotMarker = (color: string, val: number) => {
      const cy = Math.max(padTop, Math.min(padTop + plotH, valToY(val)));
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cursorX, cy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    plotMarker("#6366f1", currentS);
    plotMarker("#10b981", currentV);
    plotMarker("#f43f5e", currentA);

    // X axis labels
    ctx.fillStyle = "#64748b";
    ctx.font = "10px monospace";
    ctx.fillText("0s", padLeft, h - 12);
    ctx.fillText(`${(tMax / 2).toFixed(1)}s`, padLeft + plotW / 2 - 10, h - 12);
    ctx.fillText(`${tMax.toFixed(1)}s`, w - padRight - 16, h - 12);
  }, [time, preset, currentS, currentV, currentA, tMax]);

  return (
    <div className="min-h-full flex flex-col space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {simInfo.subject}
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-300">
              {simInfo.difficulty}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">{simInfo.title}</h1>
          <p className="text-slate-400 text-sm">{simInfo.description}</p>
        </div>

        <button
          onClick={() => setShowQuiz(true)}
          className="inline-flex items-center bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-sm cursor-pointer w-fit"
        >
          <HelpCircle className="w-4 h-4 mr-1.5" />
          Take Quiz
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Main Canvas & Physical Track Section */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 flex flex-col space-y-4 relative overflow-y-auto">
          {/* Preset buttons & Legend */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex space-x-1.5 bg-slate-950/80 border border-slate-800 rounded-lg p-1 w-fit">
              {(["cubic", "harmonic", "freefall"] as const).map(p => (
                <button
                  key={p}
                  onClick={() => { setPreset(p); setTime(0.5); }}
                  className={`px-3 py-1 rounded text-xs font-semibold capitalize transition-colors cursor-pointer ${
                    preset === p ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="flex items-center text-indigo-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-1.5 shrink-0"></span>s(t) Pos
              </span>
              <span className="flex items-center text-emerald-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5 shrink-0"></span>v(t) = s'
              </span>
              <span className="flex items-center text-rose-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-1.5 shrink-0"></span>a(t) = v'
              </span>
            </div>
          </div>

          {/* Graph Canvas Container */}
          <div className="w-full bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
            <canvas 
              ref={canvasRef} 
              width={640} 
              height={260} 
              className="w-full h-auto block" 
            />
          </div>

          {/* Physical 1D Track below the graphs */}
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
            <div className="text-xs font-mono text-slate-400 flex flex-wrap justify-between items-center gap-2">
              <span className="font-semibold text-slate-300">Physical 1D Particle Track</span>
              <div className="flex items-center space-x-3 text-xs">
                <span className="text-indigo-400 font-semibold">Position s = {currentS.toFixed(2)} m</span>
                <span className="text-emerald-400 font-semibold">v = {currentV.toFixed(2)} m/s</span>
              </div>
            </div>
            
            <div className="relative h-12 flex items-center px-4">
              {/* Central axis line */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full"></div>
              {/* Origin indicator */}
              <div className="absolute left-1/2 top-2 bottom-2 w-0.5 bg-slate-600"></div>
              <span className="absolute left-1/2 -bottom-0.5 text-[10px] text-slate-500 -translate-x-1/2 font-mono">0m</span>

              {/* Limit indicators */}
              <span className="absolute left-3 -bottom-0.5 text-[9px] text-slate-600 font-mono">-max</span>
              <span className="absolute right-3 -bottom-0.5 text-[9px] text-slate-600 font-mono">+max</span>

              {/* Moving Particle Dot */}
              <div 
                className="absolute w-5 h-5 rounded-full bg-indigo-500 border-2 border-white shadow-[0_0_12px_rgba(99,102,241,0.8)] -translate-x-1/2 transition-all duration-75 flex items-center justify-center"
                style={{ 
                  left: `calc(50% + ${Math.max(-45, Math.min(45, currentS * 6))}%)` 
                }}
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Quick Play/Reset & Scrubber Bar on Main Canvas */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 sm:flex-initial bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center justify-center font-medium transition-colors text-xs sm:text-sm cursor-pointer shadow-sm"
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-1.5" /> : <Play className="w-4 h-4 mr-1.5" />}
                {isPlaying ? "Pause" : "Play Motion"}
              </button>
              <button
                onClick={() => { setTime(0); setIsPlaying(false); }}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center justify-center transition-colors text-xs sm:text-sm cursor-pointer"
                title="Reset Time"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                <span>Reset</span>
              </button>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto flex-1 sm:max-w-xs">
              <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
                t: <strong className="text-indigo-400">{time.toFixed(2)}s</strong>
              </span>
              <input
                type="range"
                min="0"
                max={tMax}
                step="0.01"
                value={time}
                onChange={(e) => setTime(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Controls & Calculus Calculations */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-slate-100 mb-6 flex items-center">
              <Activity className="w-4 h-4 text-indigo-400 mr-2" />
              Time Variable
            </h3>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300 font-medium">Time (t)</span>
                  <span className="text-indigo-400 font-mono font-bold">{time.toFixed(2)} s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={tMax}
                  step="0.01"
                  value={time}
                  onChange={(e) => setTime(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Play/Pause & Reset */}
            <div className="flex space-x-2 mt-6">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg flex items-center justify-center font-medium transition-colors text-sm cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlaying ? "Pause Motion" : "Play Motion"}
              </button>
              <button
                onClick={() => { setTime(0); setIsPlaying(false); }}
                className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                title="Reset Time"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Real-time Calculus Readouts */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-slate-100 mb-4">Derivatives at t = {time.toFixed(2)}s</h3>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-indigo-400">Position s(t)</span>
                <span className="text-slate-100 font-bold">{currentS.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-emerald-400">Velocity v(t) = s'(t)</span>
                <span className="text-emerald-400 font-bold">{currentV.toFixed(2)} m/s</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-rose-400">Accel. a(t) = v'(t)</span>
                <span className="text-rose-400 font-bold">{currentA.toFixed(2)} m/s²</span>
              </div>
            </div>

            {/* Motion State Diagnostic */}
            <div className={`mt-4 p-3 rounded-lg border text-xs ${
              isStationary 
                ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                : isSpeedingUp
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-blue-500/10 border-blue-500/30 text-blue-300"
            }`}>
              <strong className="block mb-0.5">Motion State:</strong>
              {isStationary 
                ? "Instantaneously at rest (v = 0). Local extremum of position s(t)."
                : isSpeedingUp
                ? "Speeding Up: Velocity and acceleration vectors point in the SAME direction (v·a > 0)."
                : "Slowing Down: Velocity and acceleration vectors point in OPPOSITE directions (v·a < 0)."}
            </div>
          </div>
        </div>
      </div>

      {showQuiz && <QuizPanel simulationId={simId} onClose={() => setShowQuiz(false)} />}
    </div>
  );
}
