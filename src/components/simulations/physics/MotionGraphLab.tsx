import React, { useState, useEffect, useRef } from "react";
import { simulationsData } from "../../../data/mockData";
import { useAppProgress } from "../../../context/AppContext";
import QuizPanel from "../../quiz/QuizPanel";
import {
  Play,
  Pause,
  RotateCcw,
  Activity,
  Gauge,
  HelpCircle,
  Layers,
  Sparkles,
  TrendingUp,
  Sliders,
  Maximize2
} from "lucide-react";

export default function MotionGraphLab() {
  const simId = "motion-graph";
  const simInfo = simulationsData.find((s) => s.id === simId) || {
    id: "motion-graph",
    title: "Đồ thị Chuyển động Thẳng Biến đổi đều (v-t, d-t, a-t)",
    titleEn: "Uniformly Accelerated Motion & Real-time Graphing Studio",
    topic: "Gia tốc a, đồ thị v-t, đồ thị d-t, chuyển động nhanh dần đều và chậm dần đều",
    topicEn: "Acceleration a, v-t and d-t graphs, speeding up vs slowing down dynamics"
  };

  const { recordEvent, language, t } = useAppProgress();
  const isVN = language === "VN";

  // Motion Parameters:
  const [v0, setV0] = useState<number>(0); // Initial velocity (m/s)
  const [accel, setAccel] = useState<number>(2.0); // Acceleration a (m/s^2)
  const [duration, setDuration] = useState<number>(6); // Duration (seconds)
  const [activeGraph, setActiveGraph] = useState<"all" | "vt" | "dt">("all");
  const [showQuiz, setShowQuiz] = useState<boolean>(false);

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    recordEvent({
      type: "simulation_started",
      simulationId: simId,
      topic: simInfo.topic
    });
  }, []);

  // Physics Calculations at currentTime:
  // v(t) = v0 + a * t
  // d(t) = v0 * t + 0.5 * a * t^2
  // a(t) = a
  const currentV = v0 + accel * currentTime;
  const currentD = v0 * currentTime + 0.5 * accel * currentTime * currentTime;
  const finalV = v0 + accel * duration;
  const finalD = v0 * duration + 0.5 * accel * duration * duration;

  // Sign of a * v analysis:
  const avProduct = accel * currentV;
  let motionTypeDesc = isVN ? "Chuyển động thẳng đều (a = 0)" : "Uniform linear motion (a = 0)";
  let motionColor = "text-slate-300";

  if (Math.abs(accel) < 0.01) {
    motionTypeDesc = isVN ? "Chuyển động thẳng đều (a = 0, v = hằng số)" : "Uniform linear motion (a = 0)";
    motionColor = "text-sky-400";
  } else if (avProduct > 0) {
    motionTypeDesc = isVN
      ? "Nhanh dần đều: a cùng chiều v (a·v > 0) -> tốc độ tăng"
      : "Speeding up: a and v have same direction (a·v > 0)";
    motionColor = "text-emerald-400";
  } else if (avProduct < 0) {
    motionTypeDesc = isVN
      ? "Chậm dần đều: a ngược chiều v (a·v < 0) -> tốc độ giảm"
      : "Slowing down: a and v have opposite directions (a·v < 0)";
    motionColor = "text-amber-400";
  } else if (currentV === 0) {
    motionTypeDesc = isVN ? "Đổi chiều chuyển động (v = 0)" : "Turning point (v = 0)";
    motionColor = "text-rose-400";
  }

  // Animation Loop
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + dt;
          if (next >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return next;
        });
      }

      drawScene();
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, currentTime, v0, accel, duration, activeGraph]);

  const drawScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width;
    const h = canvas.height;

    // Dark canvas background
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, w, h);

    // Layout: Top 30% is Real-Time Moving Vehicle Track; Bottom 70% is Graphs
    const trackH = 110;
    const graphTopY = trackH + 15;
    const graphH = h - graphTopY - 15;

    // 1. Draw Linear Track on Top
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, w, trackH);
    ctx.fillStyle = "#334155";
    ctx.fillRect(0, trackH - 12, w, 12);
    ctx.fillStyle = "#10b981";
    ctx.fillRect(0, trackH - 14, w, 2);

    // Track Distance Scale
    const trackPadX = 50;
    const maxTrackD = Math.max(20, Math.abs(finalD) * 1.25);
    const pxPerMeter = (w - 2 * trackPadX) / (2 * maxTrackD);

    // Distance ticks
    ctx.fillStyle = "#64748b";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    for (let d = -maxTrackD; d <= maxTrackD; d += maxTrackD > 50 ? 20 : 10) {
      const x = trackPadX + (d + maxTrackD) * pxPerMeter;
      ctx.beginPath();
      ctx.moveTo(x, trackH - 12);
      ctx.lineTo(x, trackH - 4);
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillText(`${d}m`, x, trackH - 18);
    }

    // Vehicle (Smart Cart with real-time vector arrows)
    const vehicleX = Math.min(w - 20, Math.max(trackPadX, trackPadX + (currentD + maxTrackD) * pxPerMeter));
    const vehicleY = trackH - 32;

    // Vehicle Body
    ctx.fillStyle = "#6366f1";
    ctx.strokeStyle = "#818cf8";
    ctx.lineWidth = 2;
    ctx.fillRect(vehicleX - 22, vehicleY, 44, 18);
    ctx.strokeRect(vehicleX - 22, vehicleY, 44, 18);

    // Wheels
    ctx.fillStyle = "#cbd5e1";
    ctx.beginPath();
    ctx.arc(vehicleX - 12, vehicleY + 18, 5, 0, Math.PI * 2);
    ctx.arc(vehicleX + 12, vehicleY + 18, 5, 0, Math.PI * 2);
    ctx.fill();

    // Helper: Draw Arrow
    const drawArrow = (fromX: number, fromY: number, toX: number, toY: number, color: string, width = 3) => {
      const angle = Math.atan2(toY - fromY, toX - fromX);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(toX, toY);
      ctx.lineTo(toX - 8 * Math.cos(angle - Math.PI / 6), toY - 8 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(toX - 8 * Math.cos(angle + Math.PI / 6), toY - 8 * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    };

    // Velocity Vector Arrow (Xanh lục)
    if (Math.abs(currentV) > 0.05) {
      const vArrowLen = currentV * 4;
      drawArrow(vehicleX, vehicleY - 8, vehicleX + vArrowLen, vehicleY - 8, "#10b981", 3);
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(`v (${currentV.toFixed(1)} m/s)`, vehicleX + vArrowLen / 2, vehicleY - 20);
    }

    // Acceleration Vector Arrow (Vàng cam)
    if (Math.abs(accel) > 0.05) {
      const aArrowLen = accel * 10;
      drawArrow(vehicleX, vehicleY + 9, vehicleX + aArrowLen, vehicleY + 9, "#f59e0b", 3);
      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(`a (${accel.toFixed(1)} m/s2)`, vehicleX + aArrowLen / 2, vehicleY + 42);
    }

    // 2. Draw Real-time Graphs (Bottom Section)
    if (activeGraph === "all") {
      // Split into 2 sub-canvases side by side: Left = v-t, Right = d-t
      const halfW = (w - 30) / 2;
      drawSingleGraph(ctx, 10, graphTopY, halfW, graphH, "vt");
      drawSingleGraph(ctx, 20 + halfW, graphTopY, halfW, graphH, "dt");
    } else if (activeGraph === "vt") {
      drawSingleGraph(ctx, 15, graphTopY, w - 30, graphH, "vt");
    } else if (activeGraph === "dt") {
      drawSingleGraph(ctx, 15, graphTopY, w - 30, graphH, "dt");
    }
  };

  const drawSingleGraph = (
    ctx: CanvasRenderingContext2D,
    gx: number,
    gy: number,
    gw: number,
    gh: number,
    type: "vt" | "dt"
  ) => {
    // Background panel
    ctx.fillStyle = "#0f172a";
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1.5;
    ctx.fillRect(gx, gy, gw, gh);
    ctx.strokeRect(gx, gy, gw, gh);

    const padLeft = 45;
    const padRight = 20;
    const padTop = 30;
    const padBottom = 30;

    const plotW = gw - padLeft - padRight;
    const plotH = gh - padTop - padBottom;
    const originPlotX = gx + padLeft;
    const originPlotY = gy + padTop + plotH; // bottom line

    // Grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;
    for (let t = 0; t <= duration; t += duration / 6) {
      const x = originPlotX + (t / duration) * plotW;
      ctx.beginPath();
      ctx.moveTo(x, gy + padTop);
      ctx.lineTo(x, originPlotY);
      ctx.stroke();

      ctx.fillStyle = "#64748b";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${t.toFixed(0)}s`, x, originPlotY + 14);
    }

    if (type === "vt") {
      // Title
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(isVN ? "Đồ thị Vận tốc - Thời gian (v - t)" : "Velocity - Time Graph (v - t)", gx + 15, gy + 20);

      // Max V scale
      const maxV = Math.max(10, Math.abs(finalV), Math.abs(v0)) * 1.25;

      // Y-axis ticks
      ctx.fillStyle = "#94a3b8";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "right";
      for (let vStep = 0; vStep <= maxV; vStep += maxV / 4) {
        const y = originPlotY - (vStep / maxV) * plotH;
        ctx.beginPath();
        ctx.moveTo(originPlotX - 4, y);
        ctx.lineTo(originPlotX + plotW, y);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
        ctx.stroke();
        ctx.fillText(`${vStep.toFixed(0)}`, originPlotX - 8, y + 3);
      }

      // Shaded Area Under v-t Curve (Diện tích hình thang = Độ dịch chuyển d)
      ctx.fillStyle = "rgba(99, 102, 241, 0.25)";
      ctx.beginPath();
      ctx.moveTo(originPlotX, originPlotY);
      for (let t = 0; t <= currentTime; t += duration / 60) {
        const v = v0 + accel * t;
        const x = originPlotX + (t / duration) * plotW;
        const y = originPlotY - (Math.max(0, v) / maxV) * plotH;
        ctx.lineTo(x, y);
      }
      const curX = originPlotX + (currentTime / duration) * plotW;
      ctx.lineTo(curX, originPlotY);
      ctx.closePath();
      ctx.fill();

      // Theoretical v-t line
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(originPlotX, originPlotY - (v0 / maxV) * plotH);
      for (let t = 0; t <= currentTime; t += duration / 60) {
        const v = v0 + accel * t;
        const x = originPlotX + (t / duration) * plotW;
        const y = originPlotY - (v / maxV) * plotH;
        ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Current point dot
      const curPtX = originPlotX + (currentTime / duration) * plotW;
      const curPtY = originPlotY - (currentV / maxV) * plotH;
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(curPtPtSafe(curPtX), curPtPtSafe(curPtY), 5, 0, Math.PI * 2);
      ctx.fill();

      // Slope tag (Độ dốc = Gia tốc a)
      ctx.fillStyle = "#a5b4fc";
      ctx.font = "13px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(
        isVN ? `Độ dốc k = a = ${accel.toFixed(1)} m/s2` : `Slope = a = ${accel.toFixed(1)} m/s2`,
        gx + gw - 15,
        gy + 20
      );
    } else if (type === "dt") {
      // Title
      ctx.fillStyle = "#a855f7";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(isVN ? "Đồ thị Độ dịch chuyển - Thời gian (d - t)" : "Displacement - Time Graph (d - t)", gx + 15, gy + 20);

      const maxD = Math.max(20, Math.abs(finalD), Math.abs(v0 * duration)) * 1.2;
      const minD = -maxD;

      // Y-axis ticks
      ctx.fillStyle = "#94a3b8";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "right";
      for (let dStep = minD; dStep <= maxD; dStep += (2 * maxD) / 4) {
        const y = originPlotY - ((dStep - minD) / (maxD - minD)) * plotH;
        ctx.beginPath();
        ctx.moveTo(originPlotX - 4, y);
        ctx.lineTo(originPlotX + plotW, y);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
        ctx.stroke();
        ctx.fillText(`${dStep.toFixed(0)}m`, originPlotX - 8, y + 3);
      }

      // Parabolic Curve for d(t) = v0*t + 1/2*a*t^2
      ctx.strokeStyle = "#c084fc";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(originPlotX, originPlotY);
      for (let t = 0; t <= currentTime; t += duration / 80) {
        const d = v0 * t + 0.5 * accel * t * t;
        const x = originPlotX + (t / duration) * plotW;
        const y = originPlotY - ((d - minD) / (maxD - minD)) * plotH;
        ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Current point dot
      const curPtX = originPlotX + (currentTime / duration) * plotW;
      const curPtY = originPlotY - ((currentD - minD) / (maxD - minD)) * plotH;
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(curPtPtSafe(curPtX), curPtPtSafe(curPtY), 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#e9d5ff";
      ctx.font = "13px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(
        `d = v0t + 0.5at2 = ${currentD.toFixed(1)} m`,
        gx + gw - 15,
        gy + 20
      );
    }

    // Coordinate Axes lines
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(originPlotX, gy + padTop - 5);
    ctx.lineTo(originPlotX, originPlotY);
    ctx.lineTo(originPlotX + plotW + 5, originPlotY);
    ctx.stroke();
  };

  const curPtPtSafe = (val: number) => (isNaN(val) ? 0 : val);

  const handleStart = () => {
    if (currentTime >= duration) {
      setCurrentTime(0);
    }
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handlePreset = (preset: "speedup" | "slowdown" | "uniform") => {
    handleReset();
    if (preset === "speedup") {
      setV0(0);
      setAccel(2.5);
    } else if (preset === "slowdown") {
      setV0(12);
      setAccel(-2.0);
    } else if (preset === "uniform") {
      setV0(5);
      setAccel(0);
    }
  };

  return (
    <div className="simulation-page max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Vật lí 10 • KNTT Bài 8 &amp; Bài 9 • CTST Bài 7 &amp; Bài 8</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isVN ? simInfo.title : simInfo.titleEn}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              {isVN
                ? "Khảo sát trực quan chuyển động thẳng biến đổi đều qua đồ thị v - t, d - t, a - t. Khám phá ý nghĩa diện tích hình thang dưới đường v-t chính là độ dịch chuyển d, và quy tắc dấu của tích a·v."
                : "Interactive graphing studio for uniformly accelerated motion: explore velocity-time, displacement-time curves, and sign of acceleration."}
            </p>
          </div>

          <button
            onClick={() => setShowQuiz(!showQuiz)}
            className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-lg transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{isVN ? "Luyện tập & Trắc nghiệm" : "Concept Quiz"}</span>
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400 flex items-center mr-2">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-400" />
            {isVN ? "Kịch bản nhanh:" : "Presets:"}
          </span>

          <button
            onClick={() => handlePreset("speedup")}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40 transition-all cursor-pointer"
          >
            1. Nhanh dần đều (v₀ = 0, a = +2.5 m/s²)
          </button>

          <button
            onClick={() => handlePreset("slowdown")}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-950/40 border border-amber-500/30 text-amber-300 hover:bg-amber-900/40 transition-all cursor-pointer"
          >
            2. Chậm dần đều (v₀ = 12 m/s, a = -2.0 m/s²)
          </button>

          <button
            onClick={() => handlePreset("uniform")}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-sky-950/40 border border-sky-500/30 text-sky-300 hover:bg-sky-900/40 transition-all cursor-pointer"
          >
            3. Thẳng đều (v₀ = 5 m/s, a = 0)
          </button>
        </div>
      </div>

      {showQuiz ? (
        <QuizPanel simulationId={simId} onClose={() => setShowQuiz(false)} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visualizer (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  <span>{isVN ? "Studio Đồ thị Động học Thời gian thực" : "Real-time Kinematic Graph Studio"}</span>
                </div>

                {/* Graph View Filter Tabs */}
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setActiveGraph("all")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeGraph === "all" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {isVN ? "Cả hai (v-t & d-t)" : "Both"}
                  </button>
                  <button
                    onClick={() => setActiveGraph("vt")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeGraph === "vt" ? "bg-sky-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    v - t
                  </button>
                  <button
                    onClick={() => setActiveGraph("dt")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activeGraph === "dt" ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    d - t
                  </button>
                </div>
              </div>

              {/* Canvas Viewport */}
              <div className="w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80 aspect-[16/11] relative">
                <canvas ref={canvasRef} width={760} height={500} className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Motion Dynamics & Core Formulas Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{isVN ? "Trạng thái Chuyển động & Quy tắc Dấu a·v" : "Motion State & Sign Analysis"}</span>
                </h3>
                <span className={`text-xs font-bold font-mono px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 ${motionColor}`}>
                  {motionTypeDesc}
                </span>
              </div>

              {/* Real-time Values Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block mb-1">Thời gian trôi qua (t):</span>
                  <span className="text-indigo-300 font-bold font-mono text-sm">{currentTime.toFixed(2)} s</span>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block mb-1">Vận tốc tức thời v(t):</span>
                  <span className="text-sky-300 font-bold font-mono text-sm">{currentV.toFixed(2)} m/s</span>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block mb-1">Độ dịch chuyển d(t):</span>
                  <span className="text-purple-300 font-bold font-mono text-sm">{currentD.toFixed(2)} m</span>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block mb-1">Gia tốc không đổi (a):</span>
                  <span className="text-amber-300 font-bold font-mono text-sm">{accel.toFixed(2)} m/s²</span>
                </div>
              </div>

              {/* 3 Core Textbook Formulas */}
              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs space-y-1.5">
                <span className="font-bold text-slate-200 block">Bộ 3 công thức cốt lõi (SGK KNTT tr.38 &amp; CTST tr.44):</span>
                <p className="text-slate-300">
                  1. Phương trình vận tốc: <strong className="text-sky-400 font-mono">v = v₀ + at</strong>
                </p>
                <p className="text-slate-300">
                  2. Phương trình độ dịch chuyển: <strong className="text-purple-400 font-mono">d = v₀t + ½at²</strong> (Bằng diện tích dưới đường v-t)
                </p>
                <p className="text-slate-300">
                  3. Hệ thức độc lập thời gian: <strong className="text-emerald-400 font-mono">v² - v₀² = 2ad</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Controls (1 Col) */}
          <div className="space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Gauge className="w-4 h-4 text-indigo-400" />
                <span>{isVN ? "Thông số Chuyển động" : "Kinematic Parameters"}</span>
              </h2>

              {/* Initial Velocity v0 Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{isVN ? "Vận tốc ban đầu (v₀):" : "Initial Velocity (v₀):"}</span>
                  <span className="text-sky-400 font-mono font-bold">{v0} m/s</span>
                </div>
                <input
                  type="range"
                  min={-10}
                  max={20}
                  step={1}
                  value={v0}
                  onChange={(e) => {
                    setV0(Number(e.target.value));
                    handleReset();
                  }}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              {/* Acceleration a Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{isVN ? "Gia tốc (a):" : "Acceleration (a):"}</span>
                  <span className="text-amber-400 font-mono font-bold">{accel} m/s²</span>
                </div>
                <input
                  type="range"
                  min={-5}
                  max={5}
                  step={0.5}
                  value={accel}
                  onChange={(e) => {
                    setAccel(Number(e.target.value));
                    handleReset();
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Duration Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{isVN ? "Thời gian khảo sát (t):" : "Duration (t):"}</span>
                  <span className="text-indigo-400 font-mono font-bold">{duration} s</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={12}
                  step={1}
                  value={duration}
                  onChange={(e) => {
                    setDuration(Number(e.target.value));
                    handleReset();
                  }}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex gap-2">
                <button
                  onClick={isPlaying ? () => setIsPlaying(false) : handleStart}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlaying ? (isVN ? "Tạm dừng" : "Pause") : isVN ? "Vẽ đồ thị" : "Start Plot"}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Curriculum Standard Card */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>{isVN ? "Chuẩn SGK Đối chiếu" : "Curriculum Standard"}</span>
              </div>
              <p className="text-xs text-slate-400">
                • <strong>KNTT:</strong> Bài 8 (tr. 35-37), Bài 9 (tr. 38-42)
              </p>
              <p className="text-xs text-slate-400">
                • <strong>CTST:</strong> Bài 7 (tr. 40-43), Bài 8 (tr. 44-49)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
