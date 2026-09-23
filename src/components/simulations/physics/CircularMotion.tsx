import React, { useState, useEffect, useRef } from "react";
import { simulationsData } from "../../../data/mockData";
import { useAppProgress } from "../../../context/AppContext";
import QuizPanel from "../../quiz/QuizPanel";
import SimulationVideoButton from "../SimulationVideoButton";
import { Play, Pause, RotateCcw, Activity, HelpCircle } from "lucide-react";

export default function CircularMotion() {
  const simId = "circular-motion";
  const simInfo = simulationsData.find(s => s.id === simId)!;
  const { recordEvent, language, t } = useAppProgress();

  const [radiusM, setRadiusM] = useState(2.5); // Radius in meters
  const [angularSpeedRadS, setAngularSpeedRadS] = useState(2.0); // Angular speed omega
  const [massKg, setMassKg] = useState(1.2); // Mass of object
  const [frictionCoeff, setFrictionCoeff] = useState(0.5); // Surface friction for slipping threshold
  const [isPlaying, setIsPlaying] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const reqRef = useRef<number | undefined>(undefined);

  const g = 9.8;
  // Calculations
  const linearVelocity = angularSpeedRadS * radiusM; // v = omega * r
  const centripetalAcc = angularSpeedRadS * angularSpeedRadS * radiusM; // a_ht = v^2/r = omega^2 * r
  const centripetalForce = massKg * centripetalAcc; // F_ht = m * a_ht
  const periodT = angularSpeedRadS > 0 ? (2 * Math.PI) / angularSpeedRadS : Infinity; // T = 2π / ω
  const frequency = angularSpeedRadS / (2 * Math.PI); // f = ω / 2π

  // Max safe linear velocity before slipping: v_max = sqrt(mu * g * r)
  const maxSafeVelocity = Math.sqrt(frictionCoeff * g * radiusM);
  const isSlipping = linearVelocity > maxSafeVelocity;

  useEffect(() => {
    recordEvent({ type: "simulation_started", simulationId: simId, topic: simInfo.topic });
  }, []);

  const handleReset = () => {
    angleRef.current = 0;
  };

  useEffect(() => {
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      if (isPlaying) {
        angleRef.current = (angleRef.current + angularSpeedRadS * dt) % (Math.PI * 2);
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const w = canvas.width;
          const h = canvas.height;
          const cx = w / 2;
          const cy = h / 2;

          const pxPerM = 65;
          const rPx = radiusM * pxPerM;

          // Turntable disk background
          ctx.fillStyle = "#0f172a";
          ctx.beginPath();
          ctx.arc(cx, cy, rPx + 40, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#334155";
          ctx.lineWidth = 2;
          ctx.stroke();

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

          // Circular orbit line
          ctx.strokeStyle = "#6366f1";
          ctx.lineWidth = 2.5;
          ctx.setLineDash([6, 6]);
          ctx.beginPath();
          ctx.arc(cx, cy, rPx, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);

          // Center spindle (Tâm quay O)
          ctx.fillStyle = "#6366f1";
          ctx.beginPath();
          ctx.arc(cx, cy, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = "#f1f5f9";
          ctx.font = "bold 13px sans-serif";
          ctx.fillText(language === "VN" ? "Tâm O" : "Center O", cx - 22, cy - 14);

          // Object position
          const th = angleRef.current;
          const ox = cx + rPx * Math.cos(th);
          const oy = cy + rPx * Math.sin(th);

          // Connecting arm / radius line
          ctx.strokeStyle = "#94a3b8";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(ox, oy);
          ctx.stroke();

          // Label radius r
          const midRx = cx + (rPx / 2) * Math.cos(th);
          const midRy = cy + (rPx / 2) * Math.sin(th);
          ctx.fillStyle = "#e2e8f0";
          ctx.font = "bold 13px monospace";
          ctx.fillText(`r = ${radiusM} m`, midRx + 8, midRy - 8);

          // Centripetal Acceleration Vector a_ht (towards center)
          const aLen = Math.min(rPx - 15, Math.max(35, centripetalAcc * 6));
          const ax = ox - aLen * Math.cos(th);
          const ay = oy - aLen * Math.sin(th);
          drawArrow(ox, oy, ax, ay, "#fbbf24", 3.5, 10);

          ctx.fillStyle = "#fbbf24";
          ctx.font = "bold 13px monospace";
          ctx.fillText(`a_ht = ${centripetalAcc.toFixed(1)} m/s2`, (ox + ax) / 2 - 25, (oy + ay) / 2 + 18);

          // Tangential Velocity Vector v (perpendicular to radius)
          const vAngle = th + Math.PI / 2;
          const vLen = Math.min(95, Math.max(40, linearVelocity * 12));
          const vx = ox + vLen * Math.cos(vAngle);
          const vy = oy + vLen * Math.sin(vAngle);
          drawArrow(ox, oy, vx, vy, "#34d399", 3.5, 10);

          ctx.fillStyle = "#34d399";
          ctx.font = "bold 13px monospace";
          ctx.fillText(`v = ${linearVelocity.toFixed(1)} m/s`, vx + 6, vy + 4);

          // Object (Vật chuyển động)
          ctx.fillStyle = isSlipping ? "#f43f5e" : "#38bdf8";
          ctx.beginPath();
          ctx.arc(ox, oy, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Slipping warning indicator
          if (isSlipping) {
            ctx.fillStyle = "#f43f5e";
            ctx.font = "bold 13px sans-serif";
            ctx.fillText(language === "VN" ? "⚠️ TRƯỢT VĂNG!" : "⚠️ SLIPPING!", ox - 45, oy - 24);
          }
        }
      }

      reqRef.current = requestAnimationFrame(loop);
    };

    reqRef.current = requestAnimationFrame(loop);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [isPlaying, radiusM, angularSpeedRadS, massKg, frictionCoeff, isSlipping, linearVelocity, centripetalAcc, language]);

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
            {language === "VN" ? simInfo.description : simInfo.descriptionEn}
          </p>
          <div className="mt-3">
            <SimulationVideoButton href="https://www.youtube.com/watch?v=FhM9SeQwsMw" />
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
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{language === "VN" ? "Chuyển động Tròn đều & Lực hướng tâm" : "Uniform Circular Motion Lab"}</span>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono text-slate-300">
              <span>v: <strong className="text-emerald-400">{linearVelocity.toFixed(2)} m/s</strong></span>
              <span>a_ht: <strong className="text-amber-400">{centripetalAcc.toFixed(2)} m/s²</strong></span>
              <span>F_ht: <strong className="text-indigo-400">{centripetalForce.toFixed(2)} N</strong></span>
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

          {/* Controls Bar */}
          <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-4">
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
                {isPlaying ? (language === "VN" ? "Đang quay tròn đều..." : "Rotating...") : (language === "VN" ? "Tạm dừng" : "Paused")}
              </span>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              {language === "VN" ? "Chu kì T" : "Period T"} = <strong className="text-white">{periodT.toFixed(2)}s</strong> | f = <strong className="text-white">{frequency.toFixed(2)}Hz</strong>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
            <h3 className="font-bold text-slate-100 text-sm uppercase tracking-wider">
              {language === "VN" ? "Thông số Chuyển động" : "Motion Parameters"}
            </h3>

            <div>
              <div className="flex justify-between mb-1.5 text-xs">
                <span className="text-slate-400">{language === "VN" ? "Bán kính quỹ đạo (r)" : "Radius (r)"}</span>
                <span className="font-mono text-indigo-400 font-bold">{radiusM} m</span>
              </div>
              <input 
                type="range" min="0.5" max="4.0" step="0.1" value={radiusM}
                onChange={(e) => setRadiusM(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5 text-xs">
                <span className="text-slate-400">{language === "VN" ? "Tốc độ góc (ω)" : "Angular Velocity (ω)"}</span>
                <span className="font-mono text-indigo-400 font-bold">{angularSpeedRadS} rad/s</span>
              </div>
              <input 
                type="range" min="0.5" max="5.0" step="0.1" value={angularSpeedRadS}
                onChange={(e) => setAngularSpeedRadS(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5 text-xs">
                <span className="text-slate-400">{language === "VN" ? "Khối lượng vật (m)" : "Object Mass (m)"}</span>
                <span className="font-mono text-indigo-400 font-bold">{massKg} kg</span>
              </div>
              <input 
                type="range" min="0.2" max="5.0" step="0.2" value={massKg}
                onChange={(e) => setMassKg(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5 text-xs">
                <span className="text-slate-400">{language === "VN" ? "Hệ số ma sát nghỉ (μ)" : "Static Friction (μ)"}</span>
                <span className="font-mono text-indigo-400 font-bold">{frictionCoeff}</span>
              </div>
              <input 
                type="range" min="0.1" max="1.0" step="0.05" value={frictionCoeff}
                onChange={(e) => setFrictionCoeff(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="font-bold text-slate-100 text-sm mb-3 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-indigo-400" />
              {language === "VN" ? "Điều kiện an toàn góc cua" : "Curvature Safety"}
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">{language === "VN" ? "Tốc độ an toàn tối đa v_max" : "Max Safe Speed v_max"}</span>
                <span className="text-emerald-400 font-bold">{maxSafeVelocity.toFixed(2)} m/s</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">{language === "VN" ? "Tốc độ hiện tại v" : "Current Speed v"}</span>
                <span className={`font-bold ${isSlipping ? "text-rose-400" : "text-emerald-400"}`}>
                  {linearVelocity.toFixed(2)} m/s
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-sans pt-2 leading-relaxed">
                {isSlipping
                  ? (language === "VN" ? "⚠️ Lực ma sát nghỉ cực đại không đủ đóng vai trò lực hướng tâm, vật sẽ bị trượt văng ra ngoài quỹ đạo!" : "⚠️ Net friction is insufficient to provide required centripetal force; the object slips outward!")
                  : (language === "VN" ? "✓ Lực ma sát nghỉ đóng vai trò lực hướng tâm giữ vật chuyển động tròn đều an toàn." : "✓ Static friction safely acts as centripetal force holding the circular trajectory.")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showQuiz && <QuizPanel simulationId={simId} onClose={() => setShowQuiz(false)} />}
    </div>
  );
}
