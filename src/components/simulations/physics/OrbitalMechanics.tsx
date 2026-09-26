import React, { useEffect, useRef, useState } from "react";
import { simulationsData } from "../../../data/mockData";
import MathText from "../../common/MathText";
import { useAppProgress } from "../../../context/AppContext";
import QuizPanel from "../../quiz/QuizPanel";
import SimulationVideoButton from "../SimulationVideoButton";
import { Compass, HelpCircle, Pause, Play, RotateCcw } from "lucide-react";

type Planet = {
  id: string;
  name: string;
  nameEn: string;
  orbitAU: number;
  periodDays: number;
  massKg: number;
  radiusKm: number;
  color: string;
};

const planets: Planet[] = [
  { id: "earth", name: "Trái Đất", nameEn: "Earth", orbitAU: 1, periodDays: 365.25, massKg: 5.972e24, radiusKm: 6371, color: "#38bdf8" },
  { id: "mars", name: "Sao Hỏa", nameEn: "Mars", orbitAU: 1.524, periodDays: 686.98, massKg: 6.39e23, radiusKm: 3389.5, color: "#f97316" },
  { id: "jupiter", name: "Sao Mộc", nameEn: "Jupiter", orbitAU: 5.203, periodDays: 4332.59, massKg: 1.898e27, radiusKm: 69911, color: "#fbbf24" },
  { id: "neptune", name: "Sao Hải Vương", nameEn: "Neptune", orbitAU: 30.07, periodDays: 60190, massKg: 1.024e26, radiusKm: 24622, color: "#818cf8" }
];

const AU_KM = 149_597_870.7;
const SUN_GM_KM3_S2 = 1.32712440018e11;
const MAX_ORBIT_AU = planets[planets.length - 1].orbitAU;

export default function OrbitalMechanics() {
  const simId = "orbital-mechanics";
  const simInfo = simulationsData.find((simulation) => simulation.id === simId)!;
  const { language, recordEvent } = useAppProgress();
  const isVN = language === "VN";

  const [selectedPlanetId, setSelectedPlanetId] = useState("earth");
  const [velocityFactor, setVelocityFactor] = useState(1);
  const [animationSpeed, setAnimationSpeed] = useState(365);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showVectors, setShowVectors] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef<Record<string, number>>(
    Object.fromEntries(planets.map((planet, index) => [planet.id, index * 0.9]))
  );
  const reqRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    recordEvent({ type: "simulation_started", simulationId: simId, topic: simInfo.topic });
  }, []);

  const selectedPlanet = planets.find((planet) => planet.id === selectedPlanetId) || planets[0];
  const orbitalRadiusKm = selectedPlanet.orbitAU * AU_KM;
  const circularVelocity = Math.sqrt(SUN_GM_KM3_S2 / orbitalRadiusKm);
  const velocityKmS = circularVelocity * velocityFactor;
  const escapeVelocity = Math.sqrt(2 * SUN_GM_KM3_S2 / orbitalRadiusKm);
  const orbitalPeriodSec = 2 * Math.PI * Math.sqrt(Math.pow(orbitalRadiusKm, 3) / SUN_GM_KM3_S2);
  const orbitalPeriodDays = orbitalPeriodSec / 86400;
  const forceGravityN = (SUN_GM_KM3_S2 * 1e9 * selectedPlanet.massKg) / Math.pow(orbitalRadiusKm * 1000, 2);
  const speedRatio = velocityKmS / circularVelocity;

  let orbitStatus: { label: string; color: string; desc: string } = {
    label: isVN ? "Quỹ đạo tròn ổn định" : "Stable Circular Orbit",
    color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    desc: isVN ? "Vận tốc đang bằng vận tốc quỹ đạo tròn quanh Mặt Trời." : "The selected body is moving at its circular orbital speed."
  };
  if (speedRatio < 0.99) {
    orbitStatus = {
      label: isVN ? "Vận tốc dưới quỹ đạo tròn" : "Sub-Circular Speed",
      color: "text-rose-400 border-rose-500/30 bg-rose-500/10",
      desc: isVN ? "Mô hình minh họa quỹ đạo suy giảm khi vận tốc nhỏ hơn vận tốc tròn." : "The model illustrates a decaying path when speed is below circular speed."
    };
  } else if (speedRatio > 1.01 && speedRatio < Math.sqrt(2)) {
    orbitStatus = {
      label: isVN ? "Quỹ đạo elip" : "Elliptical Orbit",
      color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
      desc: isVN ? "Vận tốc lớn hơn vận tốc tròn nhưng nhỏ hơn vận tốc thoát." : "Speed is above circular speed but below escape speed."
    };
  } else if (speedRatio >= Math.sqrt(2)) {
    orbitStatus = {
      label: isVN ? "Quỹ đạo thoát li" : "Escape Trajectory",
      color: "text-purple-400 border-purple-500/30 bg-purple-500/10",
      desc: isVN ? "Vận tốc đạt hoặc vượt vận tốc thoát của quỹ đạo đang xét." : "Speed reaches or exceeds the escape speed for this orbit."
    };
  }

  useEffect(() => {
    let lastTime = performance.now();

    const drawArrow = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) => {
      const angle = Math.atan2(y2 - y1, x2 - x1);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 7 * Math.cos(angle - Math.PI / 6), y2 - 7 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(x2 - 7 * Math.cos(angle + Math.PI / 6), y2 - 7 * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    };

    const getOrbitRadius = (orbitAU: number, canvasWidth: number, canvasHeight: number) => {
      // Reserve enough room for the selected planet's stretched elliptical orbit.
      const ellipseExtent = speedRatio > 1.01 && speedRatio < Math.sqrt(2)
        ? 2 * (1 + (speedRatio - 1) * 0.8) - 1
        : 1;
      const maxRadius = Math.min(canvasWidth, canvasHeight) * 0.43 / ellipseExtent;
      const minRadius = 42;
      return minRadius + Math.sqrt(orbitAU / MAX_ORBIT_AU) * (maxRadius - minRadius);
    };

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (isPlaying) {
        planets.forEach((planet) => {
          const speedMultiplier = planet.id === selectedPlanetId ? velocityFactor : 1;
          const angularSpeed = (2 * Math.PI * animationSpeed * speedMultiplier) / planet.periodDays;
          angleRef.current[planet.id] = (angleRef.current[planet.id] + angularSpeed * dt) % (2 * Math.PI);
        });
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#020617";
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = "#ffffff";
        [12, 45, 89, 130, 180, 220, 280, 310, 360, 420, 490, 530, 580].forEach((seed, index) => {
          ctx.beginPath();
          ctx.arc((seed * 37) % w, (seed * 73) % h, index % 3 === 0 ? 1.5 : 1, 0, Math.PI * 2);
          ctx.fill();
        });

        const orbitRadii = new Map(planets.map((planet) => [planet.id, getOrbitRadius(planet.orbitAU, w, h)]));
        planets.forEach((planet) => {
          const orbitRadius = orbitRadii.get(planet.id) || 42;
          const isSelected = planet.id === selectedPlanetId;
          ctx.beginPath();
          if (isSelected && speedRatio >= Math.sqrt(2)) {
            ctx.arc(cx, cy, orbitRadius, -Math.PI / 3, Math.PI / 3);
          } else if (isSelected && speedRatio > 1.01) {
            const semiMajor = orbitRadius * (1 + (speedRatio - 1) * 0.8);
            ctx.ellipse(cx - (semiMajor - orbitRadius), cy, semiMajor, orbitRadius, 0, 0, Math.PI * 2);
          } else {
            ctx.arc(cx, cy, orbitRadius, 0, Math.PI * 2);
          }
          ctx.strokeStyle = isSelected ? "#a5b4fc" : "#334155";
          ctx.lineWidth = isSelected ? 2 : 1;
          ctx.setLineDash(isSelected ? [5, 4] : [2, 5]);
          ctx.stroke();
          ctx.setLineDash([]);
        });

        const sunRadius = 23;
        const sunGradient = ctx.createRadialGradient(cx - 6, cy - 6, 4, cx, cy, sunRadius);
        sunGradient.addColorStop(0, "#fef08a");
        sunGradient.addColorStop(0.65, "#f59e0b");
        sunGradient.addColorStop(1, "#ea580c");
        ctx.fillStyle = sunGradient;
        ctx.beginPath();
        ctx.arc(cx, cy, sunRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#fde68a";
        ctx.stroke();
        ctx.fillStyle = "#fef3c7";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(isVN ? "Mặt Trời" : "Sun", cx, cy + 42);

        planets.forEach((planet) => {
          const orbitRadius = orbitRadii.get(planet.id) || 42;
          const angle = angleRef.current[planet.id];
          const isSelected = planet.id === selectedPlanetId;
          const semiMajor = orbitRadius * (1 + (speedRatio - 1) * 0.8);
          const planetX = isSelected && speedRatio > 1.01 && speedRatio < Math.sqrt(2)
            ? cx - (semiMajor - orbitRadius) + semiMajor * Math.cos(angle)
            : cx + orbitRadius * Math.cos(angle);
          const planetY = cy + orbitRadius * Math.sin(angle);
          const planetRadius = planet.id === "jupiter" ? 9 : planet.id === "neptune" ? 8 : 5;

          ctx.fillStyle = planet.color;
          ctx.beginPath();
          ctx.arc(planetX, planetY, planetRadius, 0, Math.PI * 2);
          ctx.fill();
          if (planet.id === selectedPlanetId) {
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          ctx.fillStyle = "#e2e8f0";
          ctx.font = "12px sans-serif";
          ctx.textAlign = "left";
          ctx.fillText(isVN ? planet.name : planet.nameEn, planetX + planetRadius + 5, planetY + 4);

          if (planet.id === selectedPlanetId && showVectors) {
            const velocityLength = 30;
            const gravityLength = 25;
            drawArrow(ctx, planetX, planetY, planetX - Math.sin(angle) * velocityLength, planetY + Math.cos(angle) * velocityLength, "#34d399");
            drawArrow(ctx, planetX, planetY, planetX - Math.cos(angle) * gravityLength, planetY - Math.sin(angle) * gravityLength, "#fb7185");
            ctx.fillStyle = "#34d399";
            ctx.fillText("v", planetX - Math.sin(angle) * velocityLength + 5, planetY + Math.cos(angle) * velocityLength);
            ctx.fillStyle = "#fb7185";
            ctx.fillText("Fg", planetX - Math.cos(angle) * gravityLength + 5, planetY - Math.sin(angle) * gravityLength);
          }
        });
      }

      reqRef.current = requestAnimationFrame(render);
    };

    reqRef.current = requestAnimationFrame(render);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [animationSpeed, isPlaying, isVN, selectedPlanetId, showVectors, velocityFactor]);

  const reset = () => {
    setSelectedPlanetId("earth");
    setVelocityFactor(1);
    setAnimationSpeed(365);
    setIsPlaying(true);
    setShowVectors(true);
    angleRef.current = Object.fromEntries(planets.map((planet, index) => [planet.id, index * 0.9]));
  };

  return (
    <div className="simulation-page h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{simInfo.subject}</span>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-300">{isVN ? simInfo.difficulty : simInfo.difficultyEn}</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">{isVN ? simInfo.title : simInfo.titleEn}</h1>
          <p className="text-slate-400 text-sm"><MathText text={isVN ? simInfo.description : simInfo.descriptionEn} /></p>
          <div className="mt-3">
            <SimulationVideoButton href="https://www.youtube.com/watch?v=Hu2qtWMJIxg" />
          </div>
        </div>
        <button onClick={() => setShowQuiz(true)} className="w-fit inline-flex items-center bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-sm cursor-pointer">
          <HelpCircle className="w-4 h-4 mr-1.5" />
          {isVN ? "Kiểm tra kiến thức" : "Take Quiz"}
        </button>
      </div>

      <div className="flex-1 grid lg:grid-cols-3 gap-6 min-h-0">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className={`absolute top-4 left-4 z-10 px-3 py-1.5 rounded-lg border text-xs font-semibold ${orbitStatus.color}`}>{orbitStatus.label}</div>
          <button onClick={() => setShowVectors(!showVectors)} className={`absolute top-4 right-4 z-10 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${showVectors ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-950 text-slate-400 border-slate-800"}`}>
            {showVectors ? (isVN ? "Vectơ: BẬT" : "Vectors: ON") : (isVN ? "Vectơ: TẮT" : "Vectors: OFF")}
          </button>
          <canvas ref={canvasRef} width={640} height={400} className="w-full h-full max-h-[440px] rounded-lg border border-slate-800" />
          <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
            <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 mr-1.5" />{isVN ? "Mặt Trời" : "Sun"}</span>
            <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-1.5" />{isVN ? "Vận tốc v" : "Velocity v"}</span>
            <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-rose-400 mr-1.5" />{isVN ? "Lực hấp dẫn Fg" : "Gravity Fg"}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 text-center">{isVN ? "Khoảng cách quỹ đạo được nén theo tỉ lệ căn bậc hai để nhìn rõ các hành tinh; số liệu vật lí vẫn dùng giá trị thực." : "Orbit distances use a compressed square-root scale for visibility; the physics readouts use real values."}</p>
        </div>

        <div className="space-y-6 overflow-y-auto pr-1">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-slate-100 flex items-center"><Compass className="w-4 h-4 text-indigo-400 mr-2" />{isVN ? "Hệ Mặt Trời thu nhỏ" : "Compressed Solar System"}</h3>
              <button onClick={reset} className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center justify-center transition-colors cursor-pointer" title={isVN ? "Đặt lại" : "Reset"}><RotateCcw className="w-4 h-4" /></button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-5">
              {planets.map((planet) => (
                <button key={planet.id} onClick={() => setSelectedPlanetId(planet.id)} className={`px-3 py-2 rounded-lg border text-sm transition-colors cursor-pointer ${selectedPlanetId === planet.id ? "border-indigo-400 bg-indigo-500/15 text-white" : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"}`}>
                  {isVN ? planet.name : planet.nameEn}
                </button>
              ))}
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-slate-300 font-medium">{isVN ? "Tốc độ so với quỹ đạo tròn" : "Speed vs circular speed"}</span><span className="text-indigo-400 font-mono font-bold">{velocityFactor.toFixed(2)}x</span></div>
                <input type="range" min="0.8" max="1.5" step="0.01" value={velocityFactor} onChange={(event) => setVelocityFactor(Number(event.target.value))} className="w-full accent-indigo-500 cursor-pointer" />
                <div className="text-[11px] text-slate-500 mt-1">{isVN ? "Thay đổi để quan sát quỹ đạo tròn, elip và thoát li." : "Adjust to explore circular, elliptical, and escape trajectories."}</div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-slate-300 font-medium">{isVN ? "Tốc độ mô phỏng" : "Simulation speed"}</span><span className="text-indigo-400 font-mono font-bold">{animationSpeed} {isVN ? "ngày/s" : "days/s"}</span></div>
                <input type="range" min="50" max="2000" step="50" value={animationSpeed} onChange={(event) => setAnimationSpeed(Number(event.target.value))} className="w-full accent-amber-500 cursor-pointer" />
              </div>
            </div>

            <div className="flex space-x-2 mt-6">
              <button onClick={() => setIsPlaying(!isPlaying)} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg flex items-center justify-center font-medium transition-colors text-sm cursor-pointer">
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlaying ? (isVN ? "Tạm dừng" : "Pause") : (isVN ? "Chạy mô phỏng" : "Play")}
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="font-bold text-slate-100 mb-4">{isVN ? "Thông số của " : "Selected body: "}{isVN ? selectedPlanet.name : selectedPlanet.nameEn}</h3>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between p-3 bg-slate-950 rounded-lg border border-slate-800"><span className="text-slate-400">{isVN ? "Bán kính quỹ đạo" : "Orbital radius"}</span><span className="text-indigo-300 font-bold">{selectedPlanet.orbitAU.toFixed(3)} AU</span></div>
              <div className="flex justify-between p-3 bg-slate-950 rounded-lg border border-slate-800"><span className="text-slate-400">{isVN ? "Vận tốc tròn" : "Circular speed"}</span><span className="text-emerald-400 font-bold">{circularVelocity.toFixed(2)} km/s</span></div>
              <div className="flex justify-between p-3 bg-slate-950 rounded-lg border border-slate-800"><span className="text-slate-400">{isVN ? "Vận tốc thoát" : "Escape speed"}</span><span className="text-purple-400 font-bold">{escapeVelocity.toFixed(2)} km/s</span></div>
              <div className="flex justify-between p-3 bg-slate-950 rounded-lg border border-slate-800"><span className="text-slate-400">{isVN ? "Chu kì quỹ đạo" : "Orbital period"}</span><span className="text-amber-400 font-bold">{orbitalPeriodDays.toFixed(2)} {isVN ? "ngày" : "days"}</span></div>
              <div className="flex justify-between p-3 bg-slate-950 rounded-lg border border-slate-800"><span className="text-slate-400">{isVN ? "Lực hấp dẫn" : "Gravitational force"}</span><span className="text-rose-400 font-bold">{forceGravityN.toExponential(2)} N</span></div>
            </div>
            <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400">
              <strong className="block text-slate-200 mb-1">{isVN ? "Phân tích trạng thái:" : "State analysis:"}</strong>
              {orbitStatus.desc}
            </div>
            <div className="mt-3 text-xs text-slate-500 font-mono">T² = 4π²r³ / GM</div>
          </div>
        </div>
      </div>

      {showQuiz && <QuizPanel simulationId={simId} onClose={() => setShowQuiz(false)} />}
    </div>
  );
}
