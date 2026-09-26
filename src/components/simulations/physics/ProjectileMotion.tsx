import React, { useState, useEffect, useRef } from "react";
import { simulationsData } from "../../../data/mockData";
import MathText, { drawMathText } from "../../common/MathText";
import { useAppProgress } from "../../../context/AppContext";
import QuizPanel from "../../quiz/QuizPanel";
import SimulationVideoButton from "../SimulationVideoButton";
import { Play, Pause, RotateCcw, Activity, HelpCircle, Compass } from "lucide-react";

export default function ProjectileMotion() {
  const simId = "projectile-motion";
  const simInfo = simulationsData.find(s => s.id === simId)!;
  const { recordEvent, language, t } = useAppProgress();

  const [velocity, setVelocity] = useState(20);
  const [angle, setAngle] = useState(45);
  const [gravity, setGravity] = useState(9.8);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | undefined>(undefined);

  // Physics Math
  const angleRad = (angle * Math.PI) / 180;
  const v0x = velocity * Math.cos(angleRad);
  const v0y = velocity * Math.sin(angleRad);
  
  const maxTime = (2 * v0y) / gravity;
  const apexTime = maxTime / 2;
  const maxHeight = (v0y * v0y) / (2 * gravity);
  const maxRange = v0x * maxTime;

  const currentX = v0x * time;
  const currentY = v0y * time - 0.5 * gravity * time * time;
  const clampedY = Math.max(0, currentY);

  // Real-time kinematic and energy breakdown (mass = 1kg standard)
  const projMass = 1.0;
  const currentVx = v0x;
  const currentVy = time === apexTime ? 0 : v0y - gravity * time;
  const currentSpeed = Math.hypot(currentVx, currentVy);
  const currentEk = 0.5 * projMass * currentSpeed * currentSpeed;
  const currentEp = projMass * gravity * clampedY;
  const totalEnergy = 0.5 * projMass * velocity * velocity;

  const pctKinetic = totalEnergy > 0 ? Math.min(100, Math.max(0, (currentEk / totalEnergy) * 100)) : 0;
  const pctPotential = totalEnergy > 0 ? Math.min(100, Math.max(0, (currentEp / totalEnergy) * 100)) : 0;
  const pctRange = maxRange > 0 ? Math.min(100, Math.max(0, (currentX / maxRange) * 100)) : 0;
  const pctHeight = maxHeight > 0 ? Math.min(100, Math.max(0, (clampedY / maxHeight) * 100)) : 0;
  const progressFraction = maxTime > 0 ? Math.min(1, time / maxTime) : 0;

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Scale mapping
    const scale = Math.min(canvas.width / (maxRange * 1.25 || 1), canvas.height / (maxHeight * 1.6 || 1));
    const groundY = canvas.height - 40;
    const startX = 40;

    // Helper to draw bold arrow
    const drawArrow = (fromX: number, fromY: number, toX: number, toY: number, color: string, width = 3.5, headLen = 10) => {
      const angle = Math.atan2(toY - fromY, toX - fromX);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();

      // Arrowhead
      ctx.beginPath();
      ctx.moveTo(toX, toY);
      ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    };

    // Draw Ground and Axes
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(canvas.width, groundY);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Origin Marker (Gốc tọa độ O)
    ctx.fillStyle = "#818cf8";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("O (0, 0)", startX - 10, groundY + 24);

    // Draw full theoretical trajectory (dashed)
    ctx.beginPath();
    for (let t = 0; t <= maxTime; t += maxTime / 50) {
      const x = startX + (v0x * t) * scale;
      const y = groundY - (v0y * t - 0.5 * gravity * t * t) * scale;
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw actual current path
    ctx.beginPath();
    for (let t = 0; t <= time; t += maxTime / 100) {
      const x = startX + (v0x * t) * scale;
      const y = groundY - (v0y * t - 0.5 * gravity * t * t) * scale;
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "#a5b4fc";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw Apex marker (H_max)
    const apexX = startX + (v0x * (maxTime / 2)) * scale;
    const apexY = groundY - maxHeight * scale;
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(apexX, apexY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = "bold 13px monospace";
    ctx.fillStyle = "#38bdf8";
    drawMathText(ctx, `H_max = ${maxHeight.toFixed(1)}m`, apexX - 45, apexY - 14);

    // Height vertical reference line
    ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(apexX, apexY);
    ctx.lineTo(apexX, groundY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Landing marker (L)
    const landX = startX + maxRange * scale;
    ctx.fillStyle = "#34d399";
    ctx.beginPath();
    ctx.arc(landX, groundY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 13px monospace";
    ctx.fillText(`L = ${maxRange.toFixed(1)}m`, landX - 35, groundY + 24);

    // Draw Projectile
    const projX = startX + currentX * scale;
    const projY = groundY - Math.max(0, currentY) * scale;
    
    // Draw real-time velocity vector on projectile
    const vScale = 1.4;
    const velocityDx = currentVx * vScale;
    const velocityDy = -currentVy * vScale;
    const availableX = velocityDx < 0 ? projX - 18 : canvas.width - 18 - projX;
    const availableY = velocityDy < 0 ? projY - 18 : canvas.height - 18 - projY;
    const velocityFit = Math.max(0, Math.min(
      1,
      availableX / Math.max(Math.abs(velocityDx), 0.001),
      availableY / Math.max(Math.abs(velocityDy), 0.001),
    ));
    const velocityEndX = projX + velocityDx * velocityFit;
    const velocityEndY = projY + velocityDy * velocityFit;
    drawArrow(projX, projY, velocityEndX, velocityEndY, "#fbbf24", 3.5, 10);

    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 12px monospace";
    const velocityLabelWidth = ctx.measureText("v").width;
    const velocityLabelX = Math.max(8 + velocityLabelWidth / 2, Math.min(canvas.width - 8 - velocityLabelWidth / 2, velocityEndX + 8));
    const velocityLabelY = Math.max(16, Math.min(canvas.height - 8, velocityEndY - 4));
    ctx.textAlign = "center";
    ctx.fillText("v", velocityLabelX, velocityLabelY);
    ctx.textAlign = "left";

    // Projectile Sphere
    ctx.beginPath();
    ctx.arc(projX, projY, 11, 0, Math.PI * 2);
    ctx.fillStyle = "#f43f5e";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.5;
    ctx.stroke();
  };

  useEffect(() => {
    draw();
  }, [velocity, angle, gravity, time, canvasRef]);

  const update = (deltaTime: number) => {
    setTime(prevTime => {
      const newTime = prevTime + deltaTime;
      if (prevTime < apexTime && newTime >= apexTime) {
        return apexTime;
      }
      if (newTime >= maxTime) {
        setIsPlaying(false);
        recordEvent({ type: "simulation_completed", simulationId: simId, topic: simInfo.title });
        return maxTime;
      }
      return newTime;
    });
  };

  useEffect(() => {
    let lastTime: number;
    const loop = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime;
      const deltaTime = (currentTime - lastTime) / 1000;
      
      if (isPlaying) {
        update(deltaTime);
      }
      
      lastTime = currentTime;
      requestRef.current = requestAnimationFrame(loop);
    };

    if (isPlaying) {
      requestRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, maxTime, apexTime]);

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
  };

  return (
    <div className="simulation-page min-h-full flex flex-col space-y-6 pb-12 overflow-y-auto">
      {/* Simulation Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 mb-1">
            <span>{simInfo.knttRef}</span>
            <span>•</span>
            <span>{simInfo.ctstRef}</span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            {language === "VN" ? simInfo.title : simInfo.titleEn}
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl">
            <MathText text={language === "VN" ? simInfo.description : simInfo.descriptionEn} />
          </p>
          <div className="mt-3">
            <SimulationVideoButton href="https://www.youtube.com/watch?v=txJP95lBv98" />
          </div>
        </div>
        <button 
          onClick={() => setShowQuiz(true)}
          className="w-fit bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-semibold transition-colors text-xs cursor-pointer shadow-md shrink-0 flex items-center space-x-1.5"
        >
          <HelpCircle className="w-4 h-4" />
          <span>{t("take_quiz")}</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Canvas & Physical 1D Track Container */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-lg">
          {/* Telemetry bar */}
          <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 px-4">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span>{language === "VN" ? "Quỹ đạo Ném xiên 2D (Oxy)" : "2D Trajectory Simulation"}</span>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono text-slate-300">
              <span>t: <strong className="text-indigo-400">{time.toFixed(2)}s</strong></span>
              <span>x: <strong className="text-emerald-400">{currentX.toFixed(1)}m</strong></span>
              <span>y: <strong className="text-rose-400">{Math.max(0, currentY).toFixed(1)}m</strong></span>
            </div>
          </div>
          
          {/* 2D Trajectory Viewport */}
          <div className="w-full relative aspect-[16/10] sm:aspect-[16/9] min-h-[260px] max-h-[420px] bg-slate-950 flex items-center justify-center p-2">
            <canvas 
              ref={canvasRef}
              width={800}
              height={480}
              className="w-full h-full object-contain block"
            />
          </div>

          {/* Real-time Dynamic Energy & Kinematics Visualizer Below Canvas */}
          <div className="p-4 bg-slate-950/95 border-t border-slate-800 space-y-4">
            {/* Energy Conversion Bar */}
            <div className="space-y-2">
              <div className="flex flex-wrap justify-between items-center text-xs text-slate-300 gap-2">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block shadow-sm"></span>
                  <span>{language === "VN" ? "Động năng Wđ (½mv²)" : "Kinetic Wđ"}:</span>
                  <span className="font-mono font-bold text-emerald-400">{currentEk.toFixed(1)} J ({pctKinetic.toFixed(0)}%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block shadow-sm"></span>
                  <span>{language === "VN" ? "Thế năng Wt (mgh)" : "Potential Wt"}:</span>
                  <span className="font-mono font-bold text-rose-400">{currentEp.toFixed(1)} J ({pctPotential.toFixed(0)}%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-indigo-400 font-bold">{language === "VN" ? "Cơ năng W:" : "Total W:"}</span>
                  <span className="font-mono font-bold text-indigo-300">{totalEnergy.toFixed(1)} J</span>
                </div>
              </div>

              {/* Dynamic Real-time Dual Proportion Bar */}
              <div className="w-full bg-slate-900 border border-slate-700/80 h-5 rounded-lg overflow-hidden flex shadow-inner">
                <div 
                  className="bg-emerald-500 h-full flex items-center justify-center text-[10px] font-bold text-slate-950 overflow-hidden select-none"
                  style={{ width: `${pctKinetic}%` }}
                >
                  {pctKinetic > 12 ? `${pctKinetic.toFixed(0)}%` : ""}
                </div>
                <div 
                  className="bg-rose-500 h-full flex items-center justify-center text-[10px] font-bold text-white overflow-hidden select-none"
                  style={{ width: `${pctPotential}%` }}
                >
                  {pctPotential > 12 ? `${pctPotential.toFixed(0)}%` : ""}
                </div>
              </div>
            </div>

            {/* Dedicated Physical 1D Horizontal Displacement Track (Ox) */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center space-x-1.5 font-semibold text-slate-300">
                  <Compass className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{language === "VN" ? "Tầm xa mặt đất Ox (x / L)" : "Horizontal Ground Track (x / L)"}</span>
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  x(t) = {currentX.toFixed(1)}m / {maxRange.toFixed(1)}m ({pctRange.toFixed(0)}%)
                </span>
              </div>

              {/* Visual 1D Track Runner */}
              <div className="relative w-full h-7 bg-slate-900 border border-slate-700/80 rounded-lg overflow-hidden flex items-center px-3">
                {/* Distance tick markers */}
                <div className="absolute inset-0 flex justify-between px-3 items-center pointer-events-none text-[10px] font-mono text-slate-600">
                  <span>0m</span>
                  <span>{(maxRange * 0.25).toFixed(0)}m</span>
                  <span>{(maxRange * 0.5).toFixed(0)}m</span>
                  <span>{(maxRange * 0.75).toFixed(0)}m</span>
                  <span className="text-indigo-400 font-bold">{maxRange.toFixed(0)}m (Đích L)</span>
                </div>

                {/* Progress Runner Fill */}
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-indigo-600/30 border-r-2 border-indigo-400"
                  style={{ width: `${progressFraction * 100}%` }}
                />

                {/* Moving Puck / Position Indicator on Track */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-rose-500 border-2 border-white shadow-md flex items-center justify-center -ml-2 z-10"
                  style={{ left: `${Math.max(2, Math.min(98, progressFraction * 100))}%` }}
                >
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Altitude & Speed Dual Meters */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span><MathText text={language === "VN" ? "Độ cao y(t) / H_max" : "Altitude y(t) / H_max"} /></span>
                  <span className="text-rose-400 font-bold">{clampedY.toFixed(1)}m / {maxHeight.toFixed(1)}m</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: `${pctHeight}%` }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>{language === "VN" ? "Tốc độ tức thời |v(t)|" : "Instant speed |v(t)|"}</span>
                  <span className="text-amber-400 font-bold">{currentSpeed.toFixed(1)} m/s</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${Math.min(100, (currentSpeed / (velocity * 1.2 || 1)) * 100)}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {language === "VN" ? "Thành phần vận tốc" : "Velocity components"}: vₓ {currentVx.toFixed(1)}, vᵧ {currentVy.toFixed(1)} m/s
                </div>
              </div>
            </div>
          </div>

          {/* Sticky/Prominent Play & Reset Controls Bar */}
          <div className="p-3.5 sm:p-4 bg-slate-950/95 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-10">
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-center sm:justify-start">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white transition-all cursor-pointer shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95"
                title={isPlaying ? "Tạm dừng" : "Bắn chuyển động ném xiên"}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <button 
                onClick={handleReset}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer hover:scale-105 active:scale-95 border border-slate-700"
                title="Đặt lại quỹ đạo"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <div className="text-xs text-slate-400 font-medium pl-1 hidden sm:block">
                {isPlaying 
                  ? (language === "VN" ? "Đang bay trong không gian..." : "Simulating motion...") 
                  : time > 0 
                  ? (language === "VN" ? "Tạm dừng" : "Paused") 
                  : (language === "VN" ? "Sẵn sàng phóng" : "Ready to launch")}
              </div>
            </div>

            {/* Time progress bar */}
            <div className="flex items-center space-x-2 w-full sm:w-auto flex-1 sm:max-w-xs">
              <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
                {language === "VN" ? "Tiến độ:" : "Progress:"}
              </span>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex-1">
                <div 
                  className="bg-indigo-500 h-full rounded-full"
                  style={{ width: `${progressFraction * 100}%` }}
                />
              </div>
              <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
                {(progressFraction * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-100 text-sm uppercase tracking-wider">
                {language === "VN" ? "Thông số Ném xiên" : "Variables"}
              </h3>
              {/* Quick launch/reset */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
                >
                  {isPlaying ? (language === "VN" ? "Dừng" : "Pause") : (language === "VN" ? "Bắn" : "Launch")}
                </button>
                <button
                  onClick={handleReset}
                  className="p-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Đặt lại"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1.5 text-xs">
                  <label className="font-medium text-slate-400">
                    {language === "VN" ? "Vận tốc ban đầu (v₀)" : "Velocity (v₀)"}
                  </label>
                  <span className="font-mono text-indigo-400 font-bold">{velocity} m/s</span>
                </div>
                <input 
                  type="range" min="5" max="45" value={velocity} 
                  onChange={(e) => { setVelocity(Number(e.target.value)); handleReset(); }}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-1.5 text-xs">
                  <label className="font-medium text-slate-400">
                    {language === "VN" ? "Góc ném (θ)" : "Angle (θ)"}
                  </label>
                  <span className="font-mono text-indigo-400 font-bold">{angle}°</span>
                </div>
                <input 
                  type="range" min="10" max="85" value={angle} 
                  onChange={(e) => { setAngle(Number(e.target.value)); handleReset(); }}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5 text-xs">
                  <label className="font-medium text-slate-400">
                    {language === "VN" ? "Gia tốc trọng trường (g)" : "Gravity (g)"}
                  </label>
                  <span className="font-mono text-indigo-400 font-bold">{gravity} m/s²</span>
                </div>
                <input 
                  type="range" min="1.6" max="24.8" step="0.1" value={gravity} 
                  onChange={(e) => { setGravity(Number(e.target.value)); handleReset(); }}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="font-bold text-slate-100 text-sm mb-3 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-rose-400" />
              {language === "VN" ? "Kết quả Tính toán (KNTT Bài 12 / CTST Bài 9)" : "Calculations"}
            </h3>
            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400"><MathText text={language === "VN" ? "Tầm bay cao H_max" : "Max Height"} /></span>
                <span className="text-emerald-400 font-bold">{maxHeight.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">{language === "VN" ? "Tầm bay xa L" : "Range L"}</span>
                <span className="text-indigo-400 font-bold">{maxRange.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400"><MathText text={language === "VN" ? "Thời gian bay t_bay" : "Flight Time"} /></span>
                <span className="text-amber-400 font-bold">{maxTime.toFixed(2)} s</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
             <h3 className="font-bold text-slate-100 text-sm mb-3">
               {language === "VN" ? "Công thức Vật lý Trọng tâm" : "Core Formulas"}
             </h3>
             <div className="space-y-2 text-xs font-mono bg-slate-950 p-3 rounded-xl text-emerald-400 border border-slate-800/80">
               <div><MathText text="H_max = (v₀ · sinθ)² / (2g)" /></div>
               <div>L = (v₀² · sin2θ) / g</div>
               <div><MathText text="t_bay = (2v₀ · sinθ) / g" /></div>
             </div>
          </div>
        </div>
      </div>

      {showQuiz && <QuizPanel simulationId={simId} onClose={() => setShowQuiz(false)} />}
    </div>
  );
}
