import React, { useState, useEffect, useRef } from "react";
import { simulationsData } from "../../../data/mockData";
import MathText from "../../common/MathText";
import { useAppProgress } from "../../../context/AppContext";
import QuizPanel from "../../quiz/QuizPanel";
import SimulationVideoButton from "../SimulationVideoButton";
import { Play, Pause, RotateCcw, Activity, HelpCircle } from "lucide-react";

export default function EnergyConservation() {
  const simId = "energy-conservation";
  const simInfo = simulationsData.find(s => s.id === simId)!;
  const { recordEvent, language, t } = useAppProgress();

  const [lengthM, setLengthM] = useState(2.0); // Pendulum length in meters
  const [initialAngleDeg, setInitialAngleDeg] = useState(40); // Release angle
  const [massKg, setMassKg] = useState(1.5); // Mass in kg
  const [damping, setDamping] = useState(0); // 0 for ideal conservation, >0 for realistic
  const [isPlaying, setIsPlaying] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef((initialAngleDeg * Math.PI) / 180);
  const omegaRef = useRef(0); // Angular velocity
  const timeRef = useRef(0);
  const reqRef = useRef<number | undefined>(undefined);

  const g = 9.8;
  const maxAngleRad = (initialAngleDeg * Math.PI) / 180;
  // Maximum theoretical potential energy: Wt_max = m * g * L * (1 - cos(alpha0))
  const maxTotalEnergy = massKg * g * lengthM * (1 - Math.cos(maxAngleRad));

  const [metrics, setMetrics] = useState({
    kinetic: 0,
    potential: maxTotalEnergy,
    velocity: 0,
    angleDeg: initialAngleDeg,
  });

  useEffect(() => {
    recordEvent({ type: "simulation_started", simulationId: simId, topic: simInfo.topic });
  }, []);

  const handleReset = () => {
    angleRef.current = (initialAngleDeg * Math.PI) / 180;
    omegaRef.current = 0;
    timeRef.current = 0;
    setMetrics({
      kinetic: 0,
      potential: maxTotalEnergy,
      velocity: 0,
      angleDeg: initialAngleDeg,
    });
  };

  useEffect(() => {
    handleReset();
  }, [lengthM, initialAngleDeg, massKg]);

  useEffect(() => {
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      let v = 0;
      let ep = maxTotalEnergy;
      let ek = 0;
      let theta = angleRef.current;

      if (isPlaying) {
        // Equation of motion: theta'' + (damping)*theta' + (g/L)*sin(theta) = 0
        const alpha = -(g / lengthM) * Math.sin(angleRef.current) - damping * omegaRef.current;
        omegaRef.current += alpha * dt;
        angleRef.current += omegaRef.current * dt;
        timeRef.current += dt;

        // Current physical metrics
        theta = angleRef.current;
        v = Math.abs(omegaRef.current * lengthM);
        const h = lengthM * (1 - Math.cos(theta));
        ep = Math.max(0, massKg * g * h);
        ek = Math.max(0, 0.5 * massKg * v * v);

        setMetrics({
          kinetic: ek,
          potential: ep,
          velocity: v,
          angleDeg: (theta * 180) / Math.PI,
        });
      }

      // Draw simulation canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const w = canvas.width;
          const h = canvas.height;

          // Pivot origin
          const pivotX = w / 2;
          const pivotY = 50;
          const bobRadius = 18 + massKg * 5;
          const maxHorizontalReach = lengthM * Math.sin(maxAngleRad);
          const scalePx = Math.min(
            140,
            (w / 2 - bobRadius - 24) / Math.max(maxHorizontalReach, 0.01),
            (h - pivotY - bobRadius - 55) / lengthM,
          );
          const bobDist = lengthM * scalePx;

          const bobX = pivotX + bobDist * Math.sin(angleRef.current);
          const bobY = pivotY + bobDist * Math.cos(angleRef.current);

          // Draw Ceiling Mount
          ctx.fillStyle = "#334155";
          ctx.fillRect(pivotX - 60, pivotY - 14, 120, 14);
          ctx.strokeStyle = "#475569";
          ctx.lineWidth = 2;
          ctx.strokeRect(pivotX - 60, pivotY - 14, 120, 14);

          // Draw Reference Vertical Center Line
          ctx.strokeStyle = "#475569";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([6, 6]);
          ctx.beginPath();
          ctx.moveTo(pivotX, pivotY);
          ctx.lineTo(pivotX, pivotY + bobDist + 40);
          ctx.stroke();

          // Draw Trajectory Arc
          ctx.strokeStyle = "rgba(99, 102, 241, 0.4)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(pivotX, pivotY, bobDist, Math.PI / 2 - maxAngleRad, Math.PI / 2 + maxAngleRad);
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw Pendulum Rod
          ctx.strokeStyle = "#e2e8f0";
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(pivotX, pivotY);
          ctx.lineTo(bobX, bobY);
          ctx.stroke();

          // Length label on rod
          const midRodX = (pivotX + bobX) / 2;
          const midRodY = (pivotY + bobY) / 2;
          ctx.fillStyle = "#cbd5e1";
          ctx.font = "bold 12px monospace";
          ctx.fillText(`l = ${lengthM}m`, midRodX + 10, midRodY);

          // Draw Pivot Pin
          ctx.fillStyle = "#6366f1";
          ctx.beginPath();
          ctx.arc(pivotX, pivotY, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.stroke();

          // Draw Bob with radial glow
          const grad = ctx.createRadialGradient(bobX, bobY, 4, bobX, bobY, bobRadius);
          grad.addColorStop(0, "#fb7185");
          grad.addColorStop(1, "#e11d48");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Velocity Vector with bold arrow
          if (Math.abs(omegaRef.current) > 0.05) {
            const currentV = Math.abs(omegaRef.current * lengthM);
            const vAngle = angleRef.current + (omegaRef.current > 0 ? Math.PI / 2 : -Math.PI / 2);
            const requestedVLen = Math.min(85, Math.max(35, currentV * 22));
            const vDirX = Math.cos(vAngle);
            const vDirY = Math.sin(vAngle);
            const availableX = vDirX < 0 ? bobX - 20 : w - 20 - bobX;
            const availableY = vDirY < 0 ? bobY - 20 : h - 20 - bobY;
            const vLen = Math.min(
              requestedVLen,
              availableX / Math.max(Math.abs(vDirX), 0.001),
              availableY / Math.max(Math.abs(vDirY), 0.001),
            );
            const vx = bobX + vLen * vDirX;
            const vy = bobY + vLen * vDirY;

            ctx.strokeStyle = "#34d399";
            ctx.fillStyle = "#34d399";
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.moveTo(bobX, bobY);
            ctx.lineTo(vx, vy);
            ctx.stroke();

            // Arrowhead
            const headLen = 10;
            ctx.beginPath();
            ctx.moveTo(vx, vy);
            ctx.lineTo(vx - headLen * Math.cos(vAngle - Math.PI / 6), vy - headLen * Math.sin(vAngle - Math.PI / 6));
            ctx.lineTo(vx - headLen * Math.cos(vAngle + Math.PI / 6), vy - headLen * Math.sin(vAngle + Math.PI / 6));
            ctx.closePath();
            ctx.fill();

            ctx.font = "bold 13px monospace";
            const velocityLabel = `v = ${currentV.toFixed(1)} m/s`;
            const labelWidth = ctx.measureText(velocityLabel).width;
            const labelX = Math.max(8 + labelWidth / 2, Math.min(w - 8 - labelWidth / 2, vx + 8));
            const labelY = Math.max(18, Math.min(h - 8, vy + 4));
            ctx.textAlign = "center";
            ctx.fillText(velocityLabel, labelX, labelY);
            ctx.textAlign = "left";
          }
        }
      }

      reqRef.current = requestAnimationFrame(loop);
    };

    reqRef.current = requestAnimationFrame(loop);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [isPlaying, lengthM, damping, massKg, initialAngleDeg, maxTotalEnergy]);

  const currentTotal = metrics.kinetic + metrics.potential;
  const effectiveTotal = Math.max(maxTotalEnergy, currentTotal, 0.0001);
  const pctKinetic = Math.min(100, Math.max(0, (metrics.kinetic / effectiveTotal) * 100));
  const pctPotential = Math.min(100, Math.max(0, (metrics.potential / effectiveTotal) * 100));

  return (
    <div className="simulation-page min-h-full flex flex-col space-y-6 pb-8">
      {/* Header */}
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
            <SimulationVideoButton href="https://www.youtube.com/watch?v=nEOEP3WwNxw" />
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
        {/* Main Canvas Area */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-lg">
          {/* Telemetry bar */}
          <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 px-4">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>{language === "VN" ? "Con lắc Đơn & Chuyển hóa Cơ năng" : "Mechanical Energy Lab"}</span>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono text-slate-300">
              <span>Wđ: <strong className="text-emerald-400">{metrics.kinetic.toFixed(2)} J</strong></span>
              <span>Wt: <strong className="text-rose-400">{metrics.potential.toFixed(2)} J</strong></span>
              <span>W: <strong className="text-indigo-400">{currentTotal.toFixed(2)} J</strong></span>
            </div>
          </div>

          <div className="w-full relative aspect-[16/10] sm:aspect-[16/9] min-h-[300px] max-h-[440px] bg-slate-950 flex items-center justify-center p-2">
            <canvas 
              ref={canvasRef} 
              width={760} 
              height={440} 
              className="w-full h-full object-contain block"
            />
          </div>

          {/* Energy Bar Graph Real-time Visualizer */}
          <div className="p-4 bg-slate-950/90 border-t border-slate-800 space-y-3">
            <div className="flex flex-wrap justify-between items-center text-xs text-slate-300 gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block shadow-sm"></span>
                <span>{language === "VN" ? "Động năng Wđ (½mv²)" : "Kinetic Wđ"}:</span>
                <span className="font-mono font-bold text-emerald-400">{metrics.kinetic.toFixed(2)} J ({pctKinetic.toFixed(0)}%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block shadow-sm"></span>
                <span>{language === "VN" ? "Thế năng Wt (mgh)" : "Potential Wt"}:</span>
                <span className="font-mono font-bold text-rose-400">{metrics.potential.toFixed(2)} J ({pctPotential.toFixed(0)}%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-indigo-400 font-bold">{language === "VN" ? "Cơ năng W:" : "Total W:"}</span>
                <span className="font-mono font-bold text-indigo-300">{currentTotal.toFixed(2)} J</span>
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

            {/* Dynamic individual meter gauges */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>Wđ = ½mv²</span>
                  <span className="text-emerald-400 font-bold">{metrics.kinetic.toFixed(2)} J</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${pctKinetic}%` }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>Wt = mgh</span>
                  <span className="text-rose-400 font-bold">{metrics.potential.toFixed(2)} J</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: `${pctPotential}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="p-4 bg-slate-950/95 border-t border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-11 h-11 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white transition-all cursor-pointer shadow-lg shadow-indigo-600/30"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <button 
                onClick={handleReset}
                className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <span className="text-xs text-slate-400 font-medium hidden sm:block">
                {isPlaying ? (language === "VN" ? "Đang dao động điều hòa..." : "Oscillating...") : (language === "VN" ? "Tạm dừng" : "Paused")}
              </span>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              <MathText text="v_max" /> = <strong className="text-emerald-400">{Math.sqrt(2 * g * lengthM * (1 - Math.cos(maxAngleRad))).toFixed(2)} m/s</strong>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
            <h3 className="font-bold text-slate-100 text-sm uppercase tracking-wider">
              {language === "VN" ? "Thông số Thí nghiệm" : "Experiment Controls"}
            </h3>

            <div>
              <div className="flex justify-between mb-1.5 text-xs">
                <span className="text-slate-400">{language === "VN" ? "Chiều dài dây treo (l)" : "String Length (l)"}</span>
                <span className="font-mono text-indigo-400 font-bold">{lengthM} m</span>
              </div>
              <input 
                type="range" min="0.5" max="3.5" step="0.1" value={lengthM}
                onChange={(e) => setLengthM(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5 text-xs">
                <span className="text-slate-400">{language === "VN" ? "Góc lệch ban đầu (α₀)" : "Initial Angle (α₀)"}</span>
                <span className="font-mono text-indigo-400 font-bold">{initialAngleDeg}°</span>
              </div>
              <input 
                type="range" min="5" max="60" value={initialAngleDeg}
                onChange={(e) => setInitialAngleDeg(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5 text-xs">
                <span className="text-slate-400">{language === "VN" ? "Khối lượng vật (m)" : "Bob Mass (m)"}</span>
                <span className="font-mono text-indigo-400 font-bold">{massKg} kg</span>
              </div>
              <input 
                type="range" min="0.5" max="5" step="0.5" value={massKg}
                onChange={(e) => setMassKg(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5 text-xs">
                <span className="text-slate-400">{language === "VN" ? "Hao phí ma sát" : "Friction Loss"}</span>
                <span className="font-mono text-amber-400 font-bold">
                  {damping === 0 ? (language === "VN" ? "Lý tưởng (0%)" : "Ideal (0%)") : `${damping * 100}%`}
                </span>
              </div>
              <input 
                type="range" min="0" max="0.3" step="0.05" value={damping}
                onChange={(e) => setDamping(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="font-bold text-slate-100 text-sm mb-3 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-indigo-400" />
              {language === "VN" ? "Định luật Bảo toàn Cơ năng" : "Energy Conservation Law"}
            </h3>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>
                {language === "VN" 
                  ? "Khi con lắc dao động trong trọng trường không có ma sát, động năng và thế năng biến đổi ngược pha, nhưng tổng cơ năng luôn không đổi:"
                  : "Under conservative gravitational forces with zero friction, kinetic and potential energy continuously interchange while total energy remains strictly constant:"}
              </p>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-emerald-400 font-mono text-[11px]">
                W = Wđ + Wt = ½mv² + mgh = const
              </div>
              <p className="text-slate-400 text-[11px] pt-1">
                {language === "VN"
                  ? <MathText text="Tại vị trí cân bằng (thấp nhất): Wt = 0, Wđ = W_max, vận tốc v đạt giá trị cực đại." />
                  : "At the lowest equilibrium point: Ep = 0, Ek is maximum, and velocity reaches peak value."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showQuiz && <QuizPanel simulationId={simId} onClose={() => setShowQuiz(false)} />}
    </div>
  );
}
