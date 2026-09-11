import React, { useState, useEffect, useRef } from "react";
import { simulationsData } from "../../../data/mockData";
import { useAppProgress } from "../../../context/AppContext";
import QuizPanel from "../../quiz/QuizPanel";
import { Play, Pause, RotateCcw, Activity } from "lucide-react";

export default function ProjectileMotion() {
  const simId = "projectile-motion";
  const simInfo = simulationsData.find(s => s.id === simId)!;
  const { recordEvent } = useAppProgress();

  const [velocity, setVelocity] = useState(20);
  const [angle, setAngle] = useState(45);
  const [gravity, setGravity] = useState(9.8);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();

  // Physics Math
  const angleRad = (angle * Math.PI) / 180;
  const v0x = velocity * Math.cos(angleRad);
  const v0y = velocity * Math.sin(angleRad);
  
  const maxTime = (2 * v0y) / gravity;
  const maxHeight = (v0y * v0y) / (2 * gravity);
  const maxRange = v0x * maxTime;

  const currentX = v0x * time;
  const currentY = v0y * time - 0.5 * gravity * time * time;

  useEffect(() => {
    recordEvent({ type: "simulation_started", simulationId: simId, topic: simInfo.topic });
  }, []);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Scale mapping
    const scale = Math.min(canvas.width / (maxRange * 1.2 || 1), canvas.height / (maxHeight * 1.5 || 1));
    const groundY = canvas.height - 40;
    const startX = 40;

    // Draw Ground and Axes
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(canvas.width, groundY);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw full theoretical trajectory (dashed)
    ctx.beginPath();
    for (let t = 0; t <= maxTime; t += maxTime / 50) {
      const x = startX + (v0x * t) * scale;
      const y = groundY - (v0y * t - 0.5 * gravity * t * t) * scale;
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = "#4f46e5"; // Indigo 600
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
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
    ctx.strokeStyle = "#818cf8"; // Indigo 400
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw Projectile
    const projX = startX + currentX * scale;
    const projY = groundY - currentY * scale;
    
    ctx.beginPath();
    ctx.arc(projX, projY, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#f43f5e"; // Rose 500
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  useEffect(() => {
    draw();
  }, [velocity, angle, gravity, time, canvasRef]);

  const update = (deltaTime: number) => {
    setTime(prevTime => {
      const newTime = prevTime + deltaTime;
      if (newTime >= maxTime) {
        setIsPlaying(false);
        recordEvent({ type: "simulation_completed", simulationId: simId, topic: simInfo.topic });
        return maxTime;
      }
      return newTime;
    });
  };

  useEffect(() => {
    let lastTime: number;
    const loop = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime;
      const deltaTime = (currentTime - lastTime) / 1000; // in seconds
      
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
  }, [isPlaying, maxTime]);

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
  };

  return (
    <div className="min-h-full flex flex-col space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{simInfo.title}</h1>
          <p className="text-slate-400 text-sm">{simInfo.description}</p>
        </div>
        <button 
          onClick={() => setShowQuiz(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm cursor-pointer w-fit shadow-sm"
        >
          Take Quiz
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Canvas Area */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl flex flex-col relative overflow-hidden shadow-lg">
          {/* Top telemetry bar */}
          <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 px-4">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span>Trajectory Simulation</span>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono text-slate-300">
              <span>t: <strong className="text-indigo-400">{time.toFixed(2)}s</strong></span>
              <span>x: <strong className="text-emerald-400">{currentX.toFixed(1)}m</strong></span>
              <span>y: <strong className="text-rose-400">{Math.max(0, currentY).toFixed(1)}m</strong></span>
            </div>
          </div>
          
          {/* Canvas container with responsive bounds */}
          <div className="w-full relative aspect-[16/10] sm:aspect-[16/9] min-h-[280px] max-h-[460px] bg-slate-950 flex items-center justify-center p-2 overflow-hidden">
            <canvas 
              ref={canvasRef}
              width={800}
              height={500}
              className="w-full h-full object-contain block"
            />
          </div>

          {/* Sticky/Prominent Play & Reset Controls Bar */}
          <div className="p-3 sm:p-4 bg-slate-950/90 backdrop-blur border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-10">
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-center sm:justify-start">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white transition-all cursor-pointer shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95"
                title={isPlaying ? "Pause Simulation" : "Launch Projectile"}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <button 
                onClick={handleReset}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer hover:scale-105 active:scale-95 border border-slate-700"
                title="Reset Trajectory"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <div className="text-xs text-slate-400 font-medium pl-1 hidden sm:block">
                {isPlaying ? "Simulating motion..." : time > 0 ? "Paused" : "Ready to launch"}
              </div>
            </div>

            {/* Time progress bar */}
            <div className="flex items-center space-x-2 w-full sm:w-auto flex-1 sm:max-w-xs">
              <span className="text-xs font-mono text-slate-400 whitespace-nowrap">Progress:</span>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex-1">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-75"
                  style={{ width: `${Math.min(100, (time / (maxTime || 1)) * 100)}%` }}
                />
              </div>
              <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
                {maxTime > 0 ? `${((time / maxTime) * 100).toFixed(0)}%` : "0%"}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-100">Variables</h3>
              {/* Quick launch/reset in sidebar */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
                >
                  {isPlaying ? "Pause" : "Launch"}
                </button>
                <button
                  onClick={handleReset}
                  className="p-1 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Reset"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-400">Velocity (v₀)</label>
                  <span className="text-sm font-mono text-indigo-400 font-semibold">{velocity} m/s</span>
                </div>
                <input 
                  type="range" min="1" max="50" value={velocity} 
                  onChange={(e) => { setVelocity(Number(e.target.value)); handleReset(); }}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-400">Angle (θ)</label>
                  <span className="text-sm font-mono text-indigo-400 font-semibold">{angle}°</span>
                </div>
                <input 
                  type="range" min="0" max="90" value={angle} 
                  onChange={(e) => { setAngle(Number(e.target.value)); handleReset(); }}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-400">Gravity (g)</label>
                  <span className="text-sm font-mono text-indigo-400 font-semibold">{gravity} m/s²</span>
                </div>
                <input 
                  type="range" min="1" max="25" step="0.1" value={gravity} 
                  onChange={(e) => { setGravity(Number(e.target.value)); handleReset(); }}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-slate-100 mb-4 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-rose-400" />
              Calculations
            </h3>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">Max Height</span>
                <span className="text-slate-200">{maxHeight.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">Range</span>
                <span className="text-slate-200">{maxRange.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Flight Time</span>
                <span className="text-slate-200">{maxTime.toFixed(2)} s</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
             <h3 className="font-bold text-slate-100 mb-4">Formulas</h3>
             <div className="space-y-2 text-sm font-mono bg-slate-950 p-3 rounded-lg text-emerald-400">
               {simInfo.formula.map((f, i) => (
                 <div key={i}>{f}</div>
               ))}
             </div>
          </div>
        </div>
      </div>

      {showQuiz && <QuizPanel simulationId={simId} onClose={() => setShowQuiz(false)} />}
    </div>
  );
}
