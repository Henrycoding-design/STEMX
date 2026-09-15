import React, { useState, useEffect, useRef } from "react";
import { simulationsData } from "../../../data/mockData";
import { useAppProgress } from "../../../context/AppContext";
import QuizPanel from "../../quiz/QuizPanel";
import { Play, Pause, RotateCcw, Compass, HelpCircle } from "lucide-react";

export default function OrbitalMechanics() {
  const simId = "orbital-mechanics";
  const simInfo = simulationsData.find(s => s.id === simId)!;
  const { language, recordEvent } = useAppProgress();
  const isVN = language === "VN";

  // Orbital variables
  const [altitudeKm, setAltitudeKm] = useState(1000); // Altitude above Earth surface (km)
  const [velocityKmS, setVelocityKmS] = useState(7.35); // Tangential speed (km/s)
  const [satelliteMassKg, setSatelliteMassKg] = useState(1000); // kg
  const [isPlaying, setIsPlaying] = useState(true);
  const [showVectors, setShowVectors] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const reqRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    recordEvent({ type: "simulation_started", simulationId: simId, topic: simInfo.topic });
  }, []);

  // Standard Constants (Scaled for Earth)
  const EARTH_RADIUS_KM = 6371; // km
  const GM = 398600.4418; // km^3 / s^2 (Standard gravitational parameter of Earth)
  
  const orbitalRadiusKm = EARTH_RADIUS_KM + altitudeKm;
  
  // Theoretical Circular and Escape Velocities at this altitude
  const circularVelocity = Math.sqrt(GM / orbitalRadiusKm); // km/s
  const escapeVelocity = Math.sqrt(2 * GM / orbitalRadiusKm); // km/s
  
  // Kepler's Third Law: Period T = 2π √(r³ / GM) in seconds
  const orbitalPeriodSec = 2 * Math.PI * Math.sqrt(Math.pow(orbitalRadiusKm, 3) / GM);
  const orbitalPeriodMin = orbitalPeriodSec / 60;

  // Gravitational Force F_g = G M m / r^2 in Newtons (GM * 1e9 * m / (r * 1000)^2)
  const forceGravityN = (GM * 1e9 * satelliteMassKg) / Math.pow(orbitalRadiusKm * 1000, 2);

  // Orbit classification
  let orbitStatus: { label: string; color: string; desc: string } = {
    label: isVN ? "Quỹ đạo tròn ổn định" : "Stable Circular Orbit",
    color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    desc: isVN ? "Lực hấp dẫn đóng vai trò lực hướng tâm hoàn hảo (F_hd = F_ht)." : "Centripetal acceleration equals gravitational acceleration."
  };

  const ratio = velocityKmS / circularVelocity;
  if (ratio < 0.88) {
    orbitStatus = {
      label: isVN ? "Quỹ đạo suy giảm (Rơi xuống)" : "Sub-Orbital (Re-entry)",
      color: "text-rose-400 border-rose-500/30 bg-rose-500/10",
      desc: isVN ? "Vận tốc không đủ duy trì quỹ đạo; quỹ đạo cắt tầng khí quyển Trái Đất." : "Velocity insufficient to sustain orbit; path intersects atmosphere."
    };
  } else if (ratio >= 0.88 && ratio <= 1.06) {
    orbitStatus = {
      label: isVN ? "Quỹ đạo tròn ổn định" : "Stable Circular Orbit",
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      desc: isVN ? "Chuyển động tròn đều quanh tâm Trái Đất với tốc độ vũ trụ cấp 1." : "Uniform circular motion around Earth center."
    };
  } else if (ratio > 1.06 && velocityKmS < escapeVelocity) {
    orbitStatus = {
      label: isVN ? "Quỹ đạo Elip" : "Elliptical Orbit",
      color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
      desc: isVN ? "Vận tốc lớn hơn vận tốc tròn; khoảng cách thay đổi liên tục giữa cận điểm và viễn điểm." : "Velocity exceeds circular speed; altitude varies from perigee to apogee."
    };
  } else {
    orbitStatus = {
      label: isVN ? "Thoát li hyperbol" : "Hyperbolic Escape",
      color: "text-purple-400 border-purple-500/30 bg-purple-500/10",
      desc: isVN ? "Vận tốc đạt hoặc vượt tốc độ vũ trụ cấp 2; thoát li khỏi trường hấp dẫn Trái Đất." : "Total energy > 0; satellite permanently escapes Earth's gravity well."
    };
  }

  // Animation loop
  useEffect(() => {
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        // Angular velocity ω = v / r (scaled for visual aesthetics)
        const omega = (velocityKmS / orbitalRadiusKm) * 15;
        angleRef.current = (angleRef.current + omega * dt) % (2 * Math.PI);
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

          // Space background with stars
          ctx.fillStyle = "#020617";
          ctx.fillRect(0, 0, w, h);

          // Render distant stars
          ctx.fillStyle = "#ffffff";
          const starSeeds = [12, 45, 89, 130, 180, 220, 280, 310, 360, 420, 490, 530, 580];
          starSeeds.forEach((s, idx) => {
            const sx = (s * 37) % w;
            const sy = (s * 73) % h;
            const r = (idx % 3 === 0) ? 1.5 : 1;
            ctx.beginPath();
            ctx.arc(sx, sy, r, 0, Math.PI * 2);
            ctx.fill();
          });

          // Canvas scale: Earth radius = 45px
          const visualEarthR = 45;
          const visualScale = visualEarthR / EARTH_RADIUS_KM;
          const visualOrbitalR = Math.min(w / 2 - 40, orbitalRadiusKm * visualScale * 1.5);

          // Draw Theoretical Orbit Trajectory
          ctx.beginPath();
          if (velocityKmS >= escapeVelocity) {
            // Hyperbolic branch indicator
            ctx.arc(cx, cy, visualOrbitalR, -Math.PI / 3, Math.PI / 3);
            ctx.strokeStyle = "#a855f7";
          } else if (ratio > 1.06) {
            // Ellipse
            const semiMajor = visualOrbitalR * (1 + (ratio - 1) * 0.5);
            ctx.ellipse(cx - (semiMajor - visualOrbitalR), cy, semiMajor, visualOrbitalR, 0, 0, Math.PI * 2);
            ctx.strokeStyle = "#f59e0b";
          } else {
            // Circle
            ctx.arc(cx, cy, visualOrbitalR, 0, Math.PI * 2);
            ctx.strokeStyle = ratio < 0.88 ? "#f43f5e" : "#4f46e5";
          }
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw Central Planet (Earth)
          // Atmosphere Glow
          const atmosGrad = ctx.createRadialGradient(cx, cy, visualEarthR * 0.9, cx, cy, visualEarthR * 1.3);
          atmosGrad.addColorStop(0, "rgba(56, 189, 248, 0.4)");
          atmosGrad.addColorStop(1, "rgba(56, 189, 248, 0)");
          ctx.fillStyle = atmosGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, visualEarthR * 1.3, 0, Math.PI * 2);
          ctx.fill();

          // Planet body
          const planetGrad = ctx.createRadialGradient(cx - 10, cy - 10, 5, cx, cy, visualEarthR);
          planetGrad.addColorStop(0, "#38bdf8"); // Ocean blue
          planetGrad.addColorStop(0.6, "#0284c7");
          planetGrad.addColorStop(1, "#0369a1");
          ctx.fillStyle = planetGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, visualEarthR, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#7dd3fc";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Continents sketch
          ctx.fillStyle = "#10b981";
          ctx.beginPath();
          ctx.arc(cx - 12, cy - 10, 14, 0, Math.PI * 1.5);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(cx + 15, cy + 12, 10, 0, Math.PI * 1.8);
          ctx.fill();

          // Planet label
          ctx.fillStyle = "#f8fafc";
          ctx.font = "bold 11px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(isVN ? "Trái Đất" : "Earth", cx, cy + 4);

          // Calculate Satellite Position
          const satAngle = angleRef.current;
          const satX = cx + visualOrbitalR * Math.cos(satAngle);
          const satY = cy + visualOrbitalR * Math.sin(satAngle);

          // Draw Satellite Body
          ctx.fillStyle = "#f8fafc";
          ctx.beginPath();
          ctx.arc(satX, satY, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#6366f1";
          ctx.lineWidth = 2;
          ctx.stroke();

          // Solar Panels
          ctx.fillStyle = "#38bdf8";
          ctx.fillRect(satX - 16, satY - 2, 8, 4);
          ctx.fillRect(satX + 8, satY - 2, 8, 4);

          // Vectors Overlay (Velocity & Gravity Force)
          if (showVectors) {
            // 1. Velocity vector (Tangential, perpendicular to position vector)
            const vx = -Math.sin(satAngle) * 35;
            const vy = Math.cos(satAngle) * 35;

            ctx.strokeStyle = "#10b981"; // Emerald for velocity
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(satX, satY);
            ctx.lineTo(satX + vx, satY + vy);
            ctx.stroke();

            // Velocity Arrow head
            ctx.fillStyle = "#10b981";
            ctx.beginPath();
            ctx.arc(satX + vx, satY + vy, 3, 0, Math.PI * 2);
            ctx.fill();

            // 2. Gravitational Force vector (Pointing directly to Earth center)
            const fx = -Math.cos(satAngle) * 30;
            const fy = -Math.sin(satAngle) * 30;

            ctx.strokeStyle = "#f43f5e"; // Rose for gravity
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(satX, satY);
            ctx.lineTo(satX + fx, satY + fy);
            ctx.stroke();

            // Force Arrow head
            ctx.fillStyle = "#f43f5e";
            ctx.beginPath();
            ctx.arc(satX + fx, satY + fy, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      reqRef.current = requestAnimationFrame(render);
    };

    reqRef.current = requestAnimationFrame(render);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [orbitalRadiusKm, velocityKmS, isPlaying, showVectors, ratio, escapeVelocity]);

  const snapToCircular = () => {
    setVelocityKmS(Number(circularVelocity.toFixed(2)));
  };

  return (
    <div className="h-full flex flex-col space-y-6">
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
          className="inline-flex items-center bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-sm cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 mr-1.5" />
          {isVN ? "Kiểm tra kiến thức" : "Take Quiz"}
        </button>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid lg:grid-cols-3 gap-6 min-h-0">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Status Badge */}
          <div className={`absolute top-4 left-4 z-10 px-3 py-1.5 rounded-lg border text-xs font-semibold ${orbitStatus.color}`}>
            {orbitStatus.label}
          </div>

          {/* Vector Toggle Button */}
          <button
            onClick={() => setShowVectors(!showVectors)}
            className={`absolute top-4 right-4 z-10 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              showVectors ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-950 text-slate-400 border-slate-800"
            }`}
          >
            {showVectors ? (isVN ? "Vectơ: BẬT" : "Vectors: ON") : (isVN ? "Vectơ: TẮT" : "Vectors: OFF")}
          </button>

          <canvas ref={canvasRef} width={640} height={400} className="w-full h-full max-h-[440px] rounded-lg border border-slate-800" />

          {/* Quick legend */}
          <div className="mt-3 flex items-center space-x-6 text-xs text-slate-400">
            <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-1.5"></span>{isVN ? "Vectơ vận tốc tiếp tuyến (v)" : "Velocity Vector (v)"}</span>
            <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-rose-400 mr-1.5"></span>{isVN ? "Lực hấp dẫn hướng tâm (F_hd)" : "Gravitational Force (Fg)"}</span>
          </div>
        </div>

        {/* Controls and Calculations */}
        <div className="space-y-6 overflow-y-auto pr-1">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-100 flex items-center">
                <Compass className="w-4 h-4 text-indigo-400 mr-2" />
                {isVN ? "Thông số Quỹ đạo" : "Orbital Parameters"}
              </h3>
              <button
                onClick={snapToCircular}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline cursor-pointer"
                title={isVN ? "Khóa về tốc độ quay tròn đều chính xác" : "Calculate and set exact stable circular velocity"}
              >
                {isVN ? "Khóa tốc độ tròn đều" : "Snap to Circular"}
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300 font-medium">{isVN ? "Độ cao so với mặt đất (h)" : "Altitude (h)"}</span>
                  <span className="text-indigo-400 font-mono font-bold">{altitudeKm.toLocaleString()} km</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="15000"
                  step="100"
                  value={altitudeKm}
                  onChange={(e) => setAltitudeKm(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="text-[11px] text-slate-500 mt-0.5">{isVN ? `Bán kính quỹ đạo r = ${orbitalRadiusKm.toLocaleString()} km` : `Orbital radius r = ${orbitalRadiusKm.toLocaleString()} km`}</div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300 font-medium">{isVN ? "Vận tốc phóng / quỹ đạo (v)" : "Orbital Velocity (v)"}</span>
                  <span className="text-indigo-400 font-mono font-bold">{velocityKmS.toFixed(2)} km/s</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="13"
                  step="0.05"
                  value={velocityKmS}
                  onChange={(e) => setVelocityKmS(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300 font-medium">{isVN ? "Khối lượng vệ tinh (m)" : "Satellite Mass (m)"}</span>
                  <span className="text-indigo-400 font-mono font-bold">{satelliteMassKg} kg</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={satelliteMassKg}
                  onChange={(e) => setSatelliteMassKg(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 mt-6">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg flex items-center justify-center font-medium transition-colors text-sm cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlaying ? (isVN ? "Tạm dừng chuyển động" : "Pause Orbit") : (isVN ? "Mô phỏng quỹ đạo" : "Simulate Orbit")}
              </button>
              <button
                onClick={() => {
                  setAltitudeKm(1000);
                  setVelocityKmS(7.35);
                  setSatelliteMassKg(1000);
                  setIsPlaying(true);
                }}
                className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                title={isVN ? "Đặt lại" : "Reset"}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calculations */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-slate-100 mb-4">{isVN ? "Đại lượng Vật lí Tính toán" : "Physics Readouts"}</h3>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">{isVN ? "Tốc độ tròn v_tròn = √(GM/r)" : "Target v_circ = √(GM/r)"}</span>
                <span className="text-emerald-400 font-bold">{circularVelocity.toFixed(2)} km/s</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">{isVN ? "Tốc độ vũ trụ cấp 2 v_esc" : "Escape Velocity v_esc"}</span>
                <span className="text-purple-400 font-bold">{escapeVelocity.toFixed(2)} km/s</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">{isVN ? "Chu kì quỹ đạo (T)" : "Orbital Period (T)"}</span>
                <span className="text-amber-400 font-bold">{orbitalPeriodMin.toFixed(1)} phút</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">{isVN ? "Lực hấp dẫn hướng tâm (F_hd)" : "Gravitational Force (Fg)"}</span>
                <span className="text-rose-400 font-bold">{forceGravityN.toFixed(0)} N</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400">
              <strong className="block text-slate-200 mb-1">{isVN ? "Phân tích trạng thái quỹ đạo:" : "State Analysis:"}</strong>
              {orbitStatus.desc}
            </div>
          </div>
        </div>
      </div>

      {showQuiz && <QuizPanel simulationId={simId} onClose={() => setShowQuiz(false)} />}
    </div>
  );
}
