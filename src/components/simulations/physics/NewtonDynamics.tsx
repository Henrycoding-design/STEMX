import React, { useState, useEffect, useRef } from "react";
import { simulationsData } from "../../../data/mockData";
import { useAppProgress } from "../../../context/AppContext";
import QuizPanel from "../../quiz/QuizPanel";
import { Play, Pause, RotateCcw, Activity, HelpCircle, ArrowRight } from "lucide-react";

export default function NewtonDynamics() {
  const simId = "newton-dynamics";
  const simInfo = simulationsData.find(s => s.id === simId)!;
  const { recordEvent, language, t } = useAppProgress();

  const [mass, setMass] = useState(2); // kg
  const [inclineAngle, setInclineAngle] = useState(20); // deg
  const [frictionCoeff, setFrictionCoeff] = useState(0.15); // mu
  const [appliedForce, setAppliedForce] = useState(0); // N (upward along plane)
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reqRef = useRef<number | undefined>(undefined);

  const g = 9.8; // m/s^2
  const angleRad = (inclineAngle * Math.PI) / 180;
  
  // Forces along and perpendicular to plane
  const pParallel = mass * g * Math.sin(angleRad); // downhill component
  const pPerp = mass * g * Math.cos(angleRad);
  const normalForce = pPerp;
  const maxFriction = frictionCoeff * normalForce;

  // Net force along plane (downhill positive)
  // If pushing up with appliedForce, downhill net:
  const drivingForce = pParallel - appliedForce;
  let netForce = 0;
  let frictionForce = 0;

  if (Math.abs(drivingForce) <= maxFriction) {
    // Static equilibrium
    netForce = 0;
    frictionForce = drivingForce;
  } else if (drivingForce > maxFriction) {
    // Accelerates downhill
    frictionForce = maxFriction;
    netForce = drivingForce - maxFriction;
  } else {
    // Accelerates uphill
    frictionForce = -maxFriction;
    netForce = drivingForce + maxFriction;
  }

  const acceleration = netForce / mass; // positive = downhill
  const trackLength = 15; // meters
  // position s along plane from top: s = 0.5 * a * t^2
  const currentPos = Math.min(trackLength, Math.max(0, 0.5 * acceleration * time * time));
  const currentVelocity = acceleration * time;

  useEffect(() => {
    recordEvent({ type: "simulation_started", simulationId: simId, topic: simInfo.topic });
  }, []);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width;
    const h = canvas.height;

    // Base coordinates for inclined wedge
    const originX = 60;
    const originY = h - 60;
    const rampLengthPx = w - 160;
    const baseW = rampLengthPx * Math.cos(angleRad);
    const topX = originX + baseW;
    const topY = originY - rampLengthPx * Math.sin(angleRad);

    // Draw Ground
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(10, originY);
    ctx.lineTo(w - 10, originY);
    ctx.stroke();

    // Draw Incline Wedge
    ctx.fillStyle = "#1e293b";
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(topX, originY);
    ctx.lineTo(topX, topY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Angle indicator
    ctx.strokeStyle = "#818cf8";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(originX, originY, 48, -angleRad, 0, false);
    ctx.stroke();
    ctx.fillStyle = "#c7d2fe";
    ctx.font = "bold 14px monospace";
    ctx.fillText(`α = ${inclineAngle}°`, originX + 56, originY - 14);

    // Position of block on ramp (moving from topX, topY towards originX, originY)
    const tFrac = currentPos / trackLength;
    const bx = topX - tFrac * (topX - originX);
    const by = topY + tFrac * (originY - topY);

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

    // Draw Sliding Block rotated by angle
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(-angleRad);

    // Block dimensions (bigger for clarity)
    const bW = 56;
    const bH = 34;
    ctx.fillStyle = "#6366f1";
    ctx.strokeStyle = "#e0e7ff";
    ctx.lineWidth = 2.5;
    ctx.fillRect(-bW / 2, -bH, bW, bH);
    ctx.strokeRect(-bW / 2, -bH, bW, bH);

    // Mass label on block
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${mass} kg`, 0, -bH / 2 + 5);

    // Draw vectors in rotated frame
    // Normal Force N upwards (perpendicular to surface, in -y rotated)
    const nLen = Math.min(85, Math.max(35, normalForce * 2.5));
    drawArrow(0, -bH / 2, 0, -bH / 2 - nLen, "#38bdf8", 3.5, 11);

    // Friction Force F_ms along surface
    if (Math.abs(frictionForce) > 0.1) {
      const fLen = Math.min(70, Math.max(30, Math.abs(frictionForce) * 2.8));
      const targetFx = frictionForce > 0 ? fLen : -fLen;
      drawArrow(0, -bH / 2, targetFx, -bH / 2, "#fbbf24", 3.5, 10);
    }

    ctx.restore();

    // Gravity vector P straight down
    const pLen = Math.min(95, Math.max(40, mass * g * 2.5));
    drawArrow(bx, by - 14, bx, by - 14 + pLen, "#f87171", 3.5, 11);

    // Vector Legend Labels - enlarged with sharp contrast
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "left";

    // P label
    ctx.fillStyle = "#f87171";
    ctx.fillText(`P = mg (${(mass * g).toFixed(1)} N)`, bx + 12, by + pLen / 2 + 10);

    // N label
    ctx.fillStyle = "#38bdf8";
    ctx.fillText(`N = ${(normalForce).toFixed(1)} N`, bx - 60, by - 48);

    // Fms label if present
    if (Math.abs(frictionForce) > 0.1) {
      ctx.fillStyle = "#fbbf24";
      ctx.fillText(`F_ms = ${(frictionForce).toFixed(1)} N`, bx + 24, by - 24);
    }
  };

  useEffect(() => {
    draw();
  }, [mass, inclineAngle, frictionCoeff, appliedForce, currentPos]);

  useEffect(() => {
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      if (isPlaying && acceleration !== 0) {
        setTime(prev => {
          const next = prev + dt;
          if (0.5 * acceleration * next * next >= trackLength) {
            setIsPlaying(false);
            recordEvent({ type: "simulation_completed", simulationId: simId, topic: simInfo.title });
            return Math.sqrt((2 * trackLength) / Math.abs(acceleration));
          }
          return next;
        });
      }
      reqRef.current = requestAnimationFrame(loop);
    };

    if (isPlaying) {
      reqRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [isPlaying, acceleration]);

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
  };

  return (
    <div className="min-h-full flex flex-col space-y-6 pb-8">
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
        </div>

        <button 
          onClick={() => setShowQuiz(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-semibold transition-colors text-xs cursor-pointer shadow-md shrink-0 flex items-center space-x-1.5"
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
              <span>{language === "VN" ? "Mô phỏng Động lực học Newton" : "Newton Dynamics Lab"}</span>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono text-slate-300">
              <span>a: <strong className="text-indigo-400">{acceleration.toFixed(2)} m/s²</strong></span>
              <span>v: <strong className="text-emerald-400">{currentVelocity.toFixed(2)} m/s</strong></span>
              <span>s: <strong className="text-amber-400">{currentPos.toFixed(2)} m</strong></span>
            </div>
          </div>

          <div className="w-full relative aspect-[16/10] sm:aspect-[16/9] min-h-[300px] max-h-[460px] bg-slate-950 flex items-center justify-center p-2">
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
                {acceleration === 0 
                  ? (language === "VN" ? "Vật đứng yên (Cân bằng)" : "Static Equilibrium") 
                  : (isPlaying ? (language === "VN" ? "Đang chuyển động..." : "Moving...") : (language === "VN" ? "Tạm dừng" : "Paused"))}
              </span>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              t = <strong className="text-white">{time.toFixed(2)}s</strong>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
            <h3 className="font-bold text-slate-100 text-sm uppercase tracking-wider">
              {language === "VN" ? "Thông số Thí nghiệm" : "Experimental Variables"}
            </h3>

            <div>
              <div className="flex justify-between mb-1.5 text-xs">
                <span className="text-slate-400">{language === "VN" ? "Góc nghiêng (α)" : "Incline Angle (α)"}</span>
                <span className="font-mono text-indigo-400 font-bold">{inclineAngle}°</span>
              </div>
              <input 
                type="range" min="0" max="60" value={inclineAngle}
                onChange={(e) => { setInclineAngle(Number(e.target.value)); handleReset(); }}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5 text-xs">
                <span className="text-slate-400">{language === "VN" ? "Khối lượng vật (m)" : "Block Mass (m)"}</span>
                <span className="font-mono text-indigo-400 font-bold">{mass} kg</span>
              </div>
              <input 
                type="range" min="0.5" max="10" step="0.5" value={mass}
                onChange={(e) => { setMass(Number(e.target.value)); handleReset(); }}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5 text-xs">
                <span className="text-slate-400">{language === "VN" ? "Hệ số ma sát trượt (μ)" : "Friction Coeff (μ)"}</span>
                <span className="font-mono text-indigo-400 font-bold">{frictionCoeff}</span>
              </div>
              <input 
                type="range" min="0" max="0.6" step="0.05" value={frictionCoeff}
                onChange={(e) => { setFrictionCoeff(Number(e.target.value)); handleReset(); }}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5 text-xs">
                <span className="text-slate-400">{language === "VN" ? "Lực kéo kéo lên (F)" : "Applied Pull Force (F)"}</span>
                <span className="font-mono text-indigo-400 font-bold">{appliedForce} N</span>
              </div>
              <input 
                type="range" min="0" max="40" value={appliedForce}
                onChange={(e) => { setAppliedForce(Number(e.target.value)); handleReset(); }}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="font-bold text-slate-100 text-sm mb-3 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-rose-400" />
              {language === "VN" ? "Lực tác dụng & Gia tốc" : "Force Telemetry"}
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-500">{language === "VN" ? "Trọng lực P" : "Gravity P"}</span>
                <span className="text-slate-200">{(mass * g).toFixed(1)} N</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-500">{language === "VN" ? "Thành phần kéo xuống P_sinα" : "Downhill Component P_sinα"}</span>
                <span className="text-slate-200">{pParallel.toFixed(1)} N</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-500">{language === "VN" ? "Phản lực N = P_cosα" : "Normal Force N = P_cosα"}</span>
                <span className="text-slate-200">{normalForce.toFixed(1)} N</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-500">{language === "VN" ? "Lực ma sát F_ms" : "Friction Force F_ms"}</span>
                <span className="text-amber-400">{frictionForce.toFixed(1)} N</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-indigo-400 font-bold">{language === "VN" ? "Hợp lực F_hl" : "Net Force F_net"}</span>
                <span className="text-indigo-300 font-bold">{netForce.toFixed(2)} N</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showQuiz && <QuizPanel simulationId={simId} onClose={() => setShowQuiz(false)} />}
    </div>
  );
}
