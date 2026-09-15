import React, { useState, useEffect, useRef } from "react";
import { useAppProgress } from "../../../context/AppContext";
import { Play, Pause, RotateCcw, Activity, ArrowRight, Gauge, Clock, Compass } from "lucide-react";

interface Segment {
  tEnd: number;
  v: number;
  label: string;
}

export default function DisplacementTimeLab() {
  const { language, recordEvent } = useAppProgress();
  const isVN = language === "VN";

  // Simulation parameters
  const [vInput, setVInput] = useState<number>(3); // m/s
  const [d0Input, setD0Input] = useState<number>(0); // m
  const [motionPreset, setMotionPreset] = useState<"custom" | "positive" | "stationary" | "negative" | "multi">("multi");
  
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reqRef = useRef<number | undefined>(undefined);

  // Multi-stage motion definition (matching SGK KNTT Bài 7, trang 34):
  // 0 - 4s: Đi thẳng đều v = 4 m/s (d: 0 -> 16m)
  // 4 - 7s: Dừng lại nghỉ v = 0 m/s (d: 16m không đổi)
  // 7 - 10s: Đi ngược lại v = -4 m/s (d: 16m -> 4m)
  const multiSegments: Segment[] = [
    { tEnd: 4, v: 4, label: isVN ? "Giai đoạn 1: Đi đều theo chiều dương (v = +4 m/s)" : "Stage 1: Forward at +4 m/s" },
    { tEnd: 7, v: 0, label: isVN ? "Giai đoạn 2: Nghỉ chân dừng lại (v = 0 m/s)" : "Stage 2: Rest stationary (v = 0)" },
    { tEnd: 10, v: -4, label: isVN ? "Giai đoạn 3: Quay trở lại theo chiều âm (v = -4 m/s)" : "Stage 3: Return backward (v = -4 m/s)" }
  ];

  // Calculate current displacement d(t) and distance s(t)
  const getPhysicsAtTime = (t: number) => {
    if (motionPreset !== "multi") {
      const d = d0Input + vInput * t;
      const s = Math.abs(vInput * t);
      const v = vInput;
      return { d, s, v };
    }

    // Multi-segment calculation
    let currentD = 0;
    let currentS = 0;
    let currentV = 0;
    let prevTEnd = 0;

    for (let i = 0; i < multiSegments.length; i++) {
      const seg = multiSegments[i];
      const duration = seg.tEnd - prevTEnd;

      if (t <= seg.tEnd) {
        const dtInSeg = t - prevTEnd;
        currentD += seg.v * dtInSeg;
        currentS += Math.abs(seg.v * dtInSeg);
        currentV = seg.v;
        break;
      } else {
        currentD += seg.v * duration;
        currentS += Math.abs(seg.v * duration);
        prevTEnd = seg.tEnd;
        if (i === multiSegments.length - 1) {
          currentV = 0;
        }
      }
    }

    return { d: currentD, s: currentS, v: currentV };
  };

  const { d: currentD, s: currentS, v: currentV } = getPhysicsAtTime(currentTime);

  const maxDuration = motionPreset === "multi" ? 10 : 8;

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handlePresetChange = (preset: "custom" | "positive" | "stationary" | "negative" | "multi") => {
    setMotionPreset(preset);
    handleReset();
    if (preset === "positive") {
      setVInput(4);
      setD0Input(0);
    } else if (preset === "stationary") {
      setVInput(0);
      setD0Input(10);
    } else if (preset === "negative") {
      setVInput(-3);
      setD0Input(20);
    } else if (preset === "multi") {
      setVInput(4);
      setD0Input(0);
    }
  };

  // Animation Loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = ((now - lastTime) / 1000) * playbackSpeed;
      lastTime = now;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + dt;
          if (next >= maxDuration) {
            setIsPlaying(false);
            recordEvent({
              type: "simulation_completed",
              simulationId: "displacement-time",
              topic: "Đồ thị độ dịch chuyển – thời gian"
            });
            return maxDuration;
          }
          return next;
        });
      }

      reqRef.current = requestAnimationFrame(loop);
    };

    reqRef.current = requestAnimationFrame(loop);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [isPlaying, playbackSpeed, maxDuration]);

  // Canvas Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // ==========================================
    // TOP SECTION: 1D Track with moving cart
    // ==========================================
    const trackY = 65;
    const trackLeft = 50;
    const trackRight = w - 50;
    const trackWidth = trackRight - trackLeft;

    // Track Range in meters: -5m to +25m (span = 30m)
    const minM = -5;
    const maxM = 25;
    const rangeM = maxM - minM;
    const mToPx = (mVal: number) => trackLeft + ((mVal - minM) / rangeM) * trackWidth;

    // Track Background rail
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(trackLeft - 10, trackY - 14, trackWidth + 20, 28);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(trackLeft - 10, trackY - 14, trackWidth + 20, 28);

    // Track center metal slot
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(trackLeft, trackY - 3, trackWidth, 6);

    // Distance ticks and numbers
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "center";
    for (let m = minM; m <= maxM; m += 5) {
      const px = mToPx(m);
      ctx.strokeStyle = m === 0 ? "#818cf8" : "#64748b";
      ctx.lineWidth = m === 0 ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.moveTo(px, trackY - 12);
      ctx.lineTo(px, trackY + 12);
      ctx.stroke();

      ctx.fillStyle = m === 0 ? "#c7d2fe" : "#cbd5e1";
      ctx.fillText(`${m}m`, px, trackY + 28);
    }

    // Origin Flag at 0m
    const originPx = mToPx(0);
    ctx.fillStyle = "#818cf8";
    ctx.beginPath();
    ctx.moveTo(originPx, trackY - 14);
    ctx.lineTo(originPx + 16, trackY - 24);
    ctx.lineTo(originPx, trackY - 34);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#818cf8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(originPx, trackY - 14);
    ctx.lineTo(originPx, trackY - 36);
    ctx.stroke();

    ctx.fillStyle = "#a5b4fc";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText(isVN ? "GỐC O" : "ORIGIN O", originPx + 24, trackY - 24);

    // Render Cart at current position currentD
    const cartX = Math.max(trackLeft, Math.min(trackRight, mToPx(currentD)));
    const cartW = 48;
    const cartH = 26;
    const cartY = trackY - cartH / 2;

    // Cart wheels
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.arc(cartX - 14, trackY + 10, 5, 0, Math.PI * 2);
    ctx.arc(cartX + 14, trackY + 10, 5, 0, Math.PI * 2);
    ctx.fill();

    // Cart body
    ctx.fillStyle = "#6366f1";
    ctx.strokeStyle = "#e0e7ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cartX - cartW / 2, cartY - 3, cartW, cartH, 5);
    ctx.fill();
    ctx.stroke();

    // Cart Label
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px monospace";
    ctx.fillText(`${currentD.toFixed(1)}m`, cartX, cartY + 13);

    // Velocity Vector Arrow on the Cart
    if (Math.abs(currentV) > 0.1) {
      const arrowLength = currentV * 14;
      const vY = cartY - 14;
      const vColor = currentV > 0 ? "#10b981" : "#f43f5e";
      ctx.strokeStyle = vColor;
      ctx.fillStyle = vColor;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(cartX, vY);
      ctx.lineTo(cartX + arrowLength, vY);
      ctx.stroke();

      // Arrowhead
      const headDir = currentV > 0 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(cartX + arrowLength, vY);
      ctx.lineTo(cartX + arrowLength - headDir * 9, vY - 6);
      ctx.lineTo(cartX + arrowLength - headDir * 9, vY + 6);
      ctx.closePath();
      ctx.fill();

      ctx.font = "bold 13px monospace";
      ctx.fillText(`v = ${currentV > 0 ? "+" : ""}${currentV.toFixed(1)} m/s`, cartX + arrowLength / 2, vY - 9);
    } else {
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(isVN ? "Vật đứng yên (v = 0)" : "Resting (v = 0)", cartX, cartY - 14);
    }

    // ==========================================
    // BOTTOM SECTION: Real-time d - t Graph
    // ==========================================
    const graphLeft = 65;
    const graphRight = w - 40;
    const graphTop = 145;
    const graphBottom = h - 50;
    const graphW = graphRight - graphLeft;
    const graphH = graphBottom - graphTop;

    // Graph background with grid
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(graphLeft, graphTop, graphW, graphH);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;

    // Max axis limits
    const maxT = maxDuration;
    const minDGraph = -5;
    const maxDGraph = 25;
    const rangeDGraph = maxDGraph - minDGraph;

    const tToGraphX = (tVal: number) => graphLeft + (tVal / maxT) * graphW;
    const dToGraphY = (dVal: number) => graphBottom - ((dVal - minDGraph) / rangeDGraph) * graphH;

    // Grid lines - vertical (time)
    for (let t = 0; t <= maxT; t += 2) {
      const gx = tToGraphX(t);
      ctx.beginPath();
      ctx.moveTo(gx, graphTop);
      ctx.lineTo(gx, graphBottom);
      ctx.stroke();

      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${t}s`, gx, graphBottom + 18);
    }

    // Grid lines - horizontal (displacement d)
    for (let d = minDGraph; d <= maxDGraph; d += 5) {
      const gy = dToGraphY(d);
      ctx.beginPath();
      ctx.moveTo(graphLeft, gy);
      ctx.lineTo(graphRight, gy);
      ctx.stroke();

      ctx.fillStyle = d === 0 ? "#818cf8" : "#94a3b8";
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "right";
      ctx.fillText(`${d}m`, graphLeft - 10, gy + 4);
    }

    // Draw coordinate axes
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2.5;
    // t-axis (at d = 0)
    const zeroY = dToGraphY(0);
    ctx.beginPath();
    ctx.moveTo(graphLeft, zeroY);
    ctx.lineTo(graphRight + 15, zeroY);
    ctx.stroke();

    // d-axis (at t = 0)
    ctx.beginPath();
    ctx.moveTo(graphLeft, graphBottom + 10);
    ctx.lineTo(graphLeft, graphTop - 15);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(isVN ? "d (Độ dịch chuyển, m) ↑" : "d (Displacement, m) ↑", graphLeft + 10, graphTop - 8);
    ctx.fillText(isVN ? "t (Thời gian, s) →" : "t (Time, s) →", graphRight - 90, zeroY - 10);

    // Plot theoretical line up to currentTime
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    const steps = 150;
    const dtStep = currentTime / steps;

    for (let i = 0; i <= steps; i++) {
      const sampleT = i * dtStep;
      const { d: sampleD } = getPhysicsAtTime(sampleT);
      const gx = tToGraphX(sampleT);
      const gy = dToGraphY(sampleD);

      if (i === 0) ctx.moveTo(gx, gy);
      else ctx.lineTo(gx, gy);
    }
    ctx.stroke();

    // Draw active point on graph
    const activeGx = tToGraphX(currentTime);
    const activeGy = dToGraphY(currentD);

    // Slope Triangle demonstration on current stage
    if (currentTime > 0.5) {
      // Find start of current segment
      let segTStart = 0;
      let segTEnd = currentTime;
      if (motionPreset === "multi") {
        let prevEnd = 0;
        for (const seg of multiSegments) {
          if (currentTime <= seg.tEnd) {
            segTStart = prevEnd;
            segTEnd = currentTime;
            break;
          }
          prevEnd = seg.tEnd;
        }
      }

      const { d: startD } = getPhysicsAtTime(segTStart);
      const startGx = tToGraphX(segTStart);
      const startGy = dToGraphY(startD);

      // Delta t horizontal leg
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(startGx, startGy);
      ctx.lineTo(activeGx, startGy);
      ctx.stroke();

      // Delta d vertical leg
      ctx.strokeStyle = "#10b981";
      ctx.beginPath();
      ctx.moveTo(activeGx, startGy);
      ctx.lineTo(activeGx, activeGy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Delta labels
      const deltaT = currentTime - segTStart;
      const deltaD = currentD - startD;
      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`Δt = ${deltaT.toFixed(1)}s`, (startGx + activeGx) / 2, startGy + 13);

      ctx.fillStyle = "#10b981";
      ctx.textAlign = "left";
      ctx.fillText(`Δd = ${deltaD > 0 ? "+" : ""}${deltaD.toFixed(1)}m`, activeGx + 6, (startGy + activeGy) / 2);
    }

    // Highlight active point
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(activeGx, activeGy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Coordinates tooltip at current point
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`(${currentTime.toFixed(1)}s, ${currentD.toFixed(1)}m)`, activeGx + 10, activeGy - 8);
  }, [currentTime, currentD, currentV, motionPreset, vInput, d0Input, isVN]);

  return (
    <div className="space-y-5">
      {/* Simulation Container Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Telemetry Header Bar */}
        <div className="p-3.5 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 px-5">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{isVN ? "Phòng thí nghiệm Khảo sát Đồ thị d – t" : "Displacement - Time Graph Lab"}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
            <span className="bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              {isVN ? "Thời gian" : "Time"} t = <strong className="text-amber-400">{currentTime.toFixed(2)} s</strong>
            </span>
            <span className="bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              {isVN ? "Độ dịch chuyển" : "Displacement"} d = <strong className="text-emerald-400">{currentD.toFixed(2)} m</strong>
            </span>
            <span className="bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              {isVN ? "Vận tốc (độ dốc)" : "Velocity (slope)"} v = <strong className="text-sky-400">{currentV > 0 ? "+" : ""}{currentV.toFixed(2)} m/s</strong>
            </span>
            <span className="bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              {isVN ? "Quãng đường" : "Distance"} s = <strong className="text-indigo-300">{currentS.toFixed(2)} m</strong>
            </span>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="w-full relative bg-slate-950 flex items-center justify-center p-3">
          <canvas
            ref={canvasRef}
            width={760}
            height={430}
            className="w-full h-auto max-h-[460px] object-contain rounded-xl border border-slate-800/80 shadow-inner block"
          />
        </div>

        {/* Slope Calculation Callout Card below canvas */}
        <div className="px-5 py-3 bg-slate-950/60 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <span className="text-indigo-400 font-bold">💡 {isVN ? "Ý nghĩa vật lí của hệ số góc:" : "Physical Meaning of Slope:"}</span>
            <span className="font-mono text-slate-200">
              k = <span className="text-emerald-400">Δd</span> / <span className="text-amber-400">Δt</span> = <strong className="text-white">{currentV.toFixed(2)} m/s</strong>
            </span>
          </div>

          <div className="text-slate-400 font-medium">
            {currentV > 0 ? (
              <span className="text-emerald-400 font-semibold">↗ {isVN ? "Đồ thị dốc lên: Chuyển động thẳng đều cùng chiều dương (v > 0)" : "Slope > 0: Forward motion"}</span>
            ) : currentV < 0 ? (
              <span className="text-rose-400 font-semibold">↘ {isVN ? "Đồ thị dốc xuống: Chuyển động thẳng đều ngược chiều dương (v < 0)" : "Slope < 0: Reverse motion"}</span>
            ) : (
              <span className="text-amber-400 font-semibold">— {isVN ? "Đồ thị nằm ngang: Độ dốc k = 0, vật đứng yên (v = 0)" : "Horizontal line: Slope = 0, at rest"}</span>
            )}
          </div>
        </div>

        {/* Controls Bar */}
        <div className="p-4 bg-slate-950/95 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-11 h-11 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
              title={isPlaying ? (isVN ? "Tạm dừng" : "Pause") : (isVN ? "Chạy mô phỏng" : "Play")}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <button
              onClick={handleReset}
              className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700"
              title={isVN ? "Đặt lại ban đầu" : "Reset"}
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <span className="text-xs text-slate-400 font-medium hidden sm:block">
              {isPlaying
                ? isVN
                  ? "Đang vẽ đồ thị theo thời gian thực..."
                  : "Plotting d-t curve in real time..."
                : currentTime >= maxDuration
                ? isVN
                  ? "Hoàn thành quỹ đạo"
                  : "Completed"
                : isVN
                ? "Tạm dừng"
                : "Paused"}
            </span>
          </div>

          {/* Playback speed toggle */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">{isVN ? "Tốc độ:" : "Speed:"}</span>
            {[0.5, 1, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2.5 py-1 rounded-md font-mono text-xs cursor-pointer transition-colors ${
                  playbackSpeed === spd
                    ? "bg-indigo-600 text-white font-bold shadow-sm"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preset Scenario Selector & Parameters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md">
        <h3 className="font-bold text-slate-100 text-sm uppercase tracking-wider flex items-center justify-between">
          <span>{isVN ? "Kịch bản Chuyển động (Bài tập SGK)" : "Motion Scenarios (Textbook Exercises)"}</span>
          <span className="text-xs text-indigo-400 font-normal lowercase">{isVN ? "chọn kịch bản để quan sát dạng đồ thị" : "select preset"}</span>
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => handlePresetChange("multi")}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              motionPreset === "multi"
                ? "bg-indigo-950/40 border-indigo-500 text-white shadow-md shadow-indigo-950/50"
                : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <div className="font-bold text-xs mb-1 text-indigo-400">
              ⭐ {isVN ? "Hành trình SGK KNTT" : "KNTT Multi-stage"}
            </div>
            <div className="text-[11px] leading-relaxed">
              {isVN ? "Đi đều 0-4s (+4m/s) ➔ Nghỉ 4-7s (v=0) ➔ Quay về 7-10s (-4m/s)" : "0-4s (+4m/s) ➔ Rest 4-7s ➔ Return 7-10s (-4m/s)"}
            </div>
          </button>

          <button
            onClick={() => handlePresetChange("positive")}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              motionPreset === "positive"
                ? "bg-indigo-950/40 border-indigo-500 text-white shadow-md shadow-indigo-950/50"
                : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <div className="font-bold text-xs mb-1 text-emerald-400">
              ↗ {isVN ? "Thẳng đều chiều dương" : "Constant Velocity (+)"}
            </div>
            <div className="text-[11px] leading-relaxed">
              {isVN ? "Vận tốc v = +4 m/s. Đồ thị d-t dốc lên đều đặn." : "v = +4 m/s. d-t line slopes steadily upward."}
            </div>
          </button>

          <button
            onClick={() => handlePresetChange("stationary")}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              motionPreset === "stationary"
                ? "bg-indigo-950/40 border-indigo-500 text-white shadow-md shadow-indigo-950/50"
                : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <div className="font-bold text-xs mb-1 text-amber-400">
              — {isVN ? "Vật đứng yên" : "Stationary at Rest"}
            </div>
            <div className="text-[11px] leading-relaxed">
              {isVN ? "Vận tốc v = 0. Đồ thị d-t là đoạn thẳng nằm ngang." : "v = 0. d-t graph is a horizontal flat line."}
            </div>
          </button>

          <button
            onClick={() => handlePresetChange("negative")}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              motionPreset === "negative"
                ? "bg-indigo-950/40 border-indigo-500 text-white shadow-md shadow-indigo-950/50"
                : "bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
            }`}
          >
            <div className="font-bold text-xs mb-1 text-rose-400">
              ↘ {isVN ? "Thẳng đều chiều âm" : "Constant Velocity (-)"}
            </div>
            <div className="text-[11px] leading-relaxed">
              {isVN ? "Vận tốc v = -3 m/s. Đồ thị d-t dốc xuống tiến về trục Ot." : "v = -3 m/s. d-t line slopes downward."}
            </div>
          </button>
        </div>

        {/* Custom Controls when custom is selected */}
        {motionPreset !== "multi" && (
          <div className="grid sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
            <div>
              <div className="flex justify-between mb-1 text-xs">
                <span className="text-slate-400">{isVN ? "Vận tốc cài đặt (v):" : "Set Velocity (v):"}</span>
                <span className="font-mono text-indigo-400 font-bold">{vInput} m/s</span>
              </div>
              <input
                type="range"
                min="-6"
                max="6"
                step="0.5"
                value={vInput}
                onChange={(e) => {
                  setVInput(Number(e.target.value));
                  handleReset();
                }}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1 text-xs">
                <span className="text-slate-400">{isVN ? "Vị trí xuất phát (d₀):" : "Initial Position (d₀):"}</span>
                <span className="font-mono text-indigo-400 font-bold">{d0Input} m</span>
              </div>
              <input
                type="range"
                min="-5"
                max="20"
                step="1"
                value={d0Input}
                onChange={(e) => {
                  setD0Input(Number(e.target.value));
                  handleReset();
                }}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
