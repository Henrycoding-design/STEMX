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
  Droplets,
  Sliders,
  Scale
} from "lucide-react";

interface FluidOption {
  id: string;
  nameVn: string;
  nameEn: string;
  density: number; // kg/m^3
  color: string;
  surfaceColor: string;
}

export default function FluidPressureLab() {
  const simId = "fluid-pressure";
  const simInfo = simulationsData.find((s) => s.id === simId) || {
    id: "fluid-pressure",
    title: "Áp suất Thủy tĩnh & Lực đẩy Archimedes",
    titleEn: "Hydrostatic Fluid Pressure & Archimedes Principle Lab",
    topic: "Áp suất chất lỏng p = p0 + ρgh, áp kế chữ U, lực đẩy Archimedes",
    topicEn: "Hydrostatic pressure p = p0 + ρgh, U-tube manometer, Archimedes buoyancy"
  };

  const { recordEvent, language, t } = useAppProgress();
  const isVN = language === "VN";

  // Fluid types
  const fluids: FluidOption[] = [
    { id: "water", nameVn: "Nước nguyên chất", nameEn: "Fresh Water", density: 1000, color: "rgba(14, 165, 233, 0.4)", surfaceColor: "#0284c7" },
    { id: "seawater", nameVn: "Nước biển", nameEn: "Seawater", density: 1030, color: "rgba(6, 182, 212, 0.45)", surfaceColor: "#0891b2" },
    { id: "oil", nameVn: "Dầu ăn", nameEn: "Cooking Oil", density: 800, color: "rgba(234, 179, 8, 0.4)", surfaceColor: "#ca8a04" },
    { id: "honey", nameVn: "Mật ong / Glyxerin", nameEn: "Glycerin / Honey", density: 1260, color: "rgba(249, 115, 22, 0.4)", surfaceColor: "#ea580c" }
  ];

  const [selectedFluidId, setSelectedFluidId] = useState<string>("water");
  const [probeDepthCm, setProbeDepthCm] = useState<number>(40); // 40 cm = 0.4 m
  const [atmPressureKPa, setAtmPressureKPa] = useState<number>(101.3); // 101.3 kPa (1 atm)
  const [probeOrientation, setProbeOrientation] = useState<"down" | "up" | "side">("down");
  const [immersionVolumeCm3, setImmersionVolumeCm3] = useState<number>(100); // 100 cm^3 = 0.0001 m^3 object
  const [showArchimedes, setShowArchimedes] = useState<boolean>(true);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    recordEvent({
      type: "simulation_started",
      simulationId: simId,
      topic: simInfo.topic
    });
  }, []);

  const currentFluid = fluids.find((f) => f.id === selectedFluidId) || fluids[0];
  const g = 9.80; // m/s^2

  // Hydrostatic Calculations:
  // Gauge Pressure (Áp suất do cột chất lỏng gây ra): p_cl = rho * g * h
  const depthMeters = probeDepthCm / 100;
  const gaugePressurePa = currentFluid.density * g * depthMeters; // Pascals (N/m^2)
  const gaugePressureKPa = gaugePressurePa / 1000; // kPa

  // Absolute Pressure (Áp suất toàn phần tại độ sâu h): p = p0 + rho * g * h
  const absolutePressureKPa = atmPressureKPa + gaugePressureKPa;

  // U-tube Manometer column height difference (using water manometer with density 1000 kg/m^3):
  // delta_h = p_cl / (rho_mano * g) in meters
  const manometerDeltaH_cm = (gaugePressurePa / (1000 * g)) * 100;

  // Archimedes Buoyant Force:
  // F_A = rho_fluid * g * V_submerged
  const submergedVolM3 = immersionVolumeCm3 * 1e-6; // m^3
  const buoyantForceN = currentFluid.density * g * submergedVolM3;

  // Object in air (assuming brass cylinder density 8500 kg/m^3)
  const objectMassKg = 8500 * submergedVolM3;
  const gravityWeightN = objectMassKg * g;
  const apparentWeightN = Math.max(0, gravityWeightN - buoyantForceN);

  useEffect(() => {
    drawScene();
  }, [selectedFluidId, probeDepthCm, atmPressureKPa, probeOrientation, immersionVolumeCm3, showArchimedes]);

  const drawScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width;
    const h = canvas.height;

    // Dark background
    ctx.fillStyle = "#090d16";
    ctx.fillRect(0, 0, w, h);

    // 1. Water / Fluid Tank on Left
    const tankX = 50;
    const tankY = 60;
    const tankW = 280;
    const tankH = h - tankY - 45;
    const maxDepthMeters = 0.8; // 80 cm max depth
    const pxPerMeter = (tankH - 30) / maxDepthMeters;

    // Tank outline & glass walls
    ctx.fillStyle = currentFluid.color;
    ctx.fillRect(tankX, tankY + 20, tankW, tankH - 20);

    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(tankX, tankY + 10);
    ctx.lineTo(tankX, tankY + tankH);
    ctx.lineTo(tankX + tankW, tankY + tankH);
    ctx.lineTo(tankX + tankW, tankY + 10);
    ctx.stroke();

    // Liquid surface line
    ctx.strokeStyle = currentFluid.surfaceColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(tankX, tankY + 20);
    ctx.lineTo(tankX + tankW, tankY + 20);
    ctx.stroke();

    // Surface wave effect
    ctx.fillStyle = currentFluid.surfaceColor;
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(
      isVN ? `Mặt thoáng: p₀ = ${atmPressureKPa} kPa` : `Surface: p₀ = ${atmPressureKPa} kPa`,
      tankX + 10,
      tankY + 14
    );

    // Ruler graduations on tank
    ctx.fillStyle = "#64748b";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "right";
    for (let dCm = 0; dCm <= 80; dCm += 10) {
      const y = tankY + 20 + (dCm / 100) * pxPerMeter;
      ctx.beginPath();
      ctx.moveTo(tankX, y);
      ctx.lineTo(tankX - 8, y);
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillText(`${dCm}cm`, tankX - 12, y + 3);
    }

    // Pressure Sensor Probe (Hộp áp kế có màng cao su)
    const probeY = tankY + 20 + depthMeters * pxPerMeter;
    const probeX = tankX + 100;

    // Rod holding probe
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(probeX, tankY - 15);
    ctx.lineTo(probeX, probeY);
    ctx.stroke();

    // Sensor Capsule (Hộp cảm biến áp suất hình tròn)
    ctx.fillStyle = "#334155";
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(probeX, probeY, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Rubber membrane (Màng cao su biến dạng dưới áp lực thủy tĩnh)
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    if (probeOrientation === "down") {
      ctx.arc(probeX, probeY, 14, 0, Math.PI);
    } else if (probeOrientation === "up") {
      ctx.arc(probeX, probeY, 14, Math.PI, 0);
    } else {
      ctx.arc(probeX, probeY, 14, -Math.PI / 2, Math.PI / 2);
    }
    ctx.stroke();

    // Depth indicator dashed line
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(tankX, probeY);
    ctx.lineTo(tankX + tankW, probeY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`h = ${probeDepthCm} cm`, tankX + tankW - 10, probeY - 6);

    // 2. Archimedes Test Object in Tank (if enabled)
    if (showArchimedes) {
      const objX = tankX + 210;
      const objY = probeY;
      const objH = 34;
      const objW = 28;

      // Suspension wire from Spring Balance
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(objX, tankY - 30);
      ctx.lineTo(objX, objY - objH / 2);
      ctx.stroke();

      // Submerged solid metal block
      ctx.fillStyle = "#d97706";
      ctx.strokeStyle = "#fde68a";
      ctx.lineWidth = 2;
      ctx.fillRect(objX - objW / 2, objY - objH / 2, objW, objH);
      ctx.strokeRect(objX - objW / 2, objY - objH / 2, objW, objH);

      // Buoyancy Force Vector (F_A hướng thẳng đứng lên)
      const drawArrow = (fx: number, fy: number, tx: number, ty: number, color: string) => {
        const angle = Math.atan2(ty - fy, tx - fx);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx - 6 * Math.cos(angle - Math.PI / 6), ty - 6 * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(tx - 6 * Math.cos(angle + Math.PI / 6), ty - 6 * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
      };

      drawArrow(objX, objY, objX, objY - 38, "#10b981");
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`FA (${buoyantForceN.toFixed(2)} N)`, objX + 8, objY - 52);

      // Gravity Force Vector (P hướng thẳng đứng xuống)
      drawArrow(objX, objY, objX, objY + 38, "#ef4444");
      ctx.fillStyle = "#ef4444";
      ctx.fillText(`P (${gravityWeightN.toFixed(2)} N)`, objX + 8, objY + 58);
    }

    // 3. U-Tube Differential Manometer on Right (Áp kế hình chữ U)
    const manoX = w - 240;
    const manoY = 70;
    const manoW = 180;
    const manoH = h - 140;

    // Manometer panel box
    ctx.fillStyle = "#0f172a";
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.fillRect(manoX, manoY, manoW, manoH);
    ctx.strokeRect(manoX, manoY, manoW, manoH);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(isVN ? "ÁP KẾ CHỮ U (Đo chênh lệch dp)" : "U-TUBE MANOMETER", manoX + manoW / 2, manoY + 20);

    // Glass U-Tube path
    const uLeftX = manoX + 50;
    const uRightX = manoX + 130;
    const uBaseY = manoY + manoH - 40;
    const uTopY = manoY + 45;

    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(uLeftX, uTopY);
    ctx.lineTo(uLeftX, uBaseY - 15);
    ctx.arcTo(uLeftX, uBaseY, uLeftX + 15, uBaseY, 15);
    ctx.lineTo(uRightX - 15, uBaseY);
    ctx.arcTo(uRightX, uBaseY, uRightX, uBaseY - 15, 15);
    ctx.lineTo(uRightX, uTopY);
    ctx.stroke();

    // Red manometer liquid inside U-tube
    const centerFluidLevel = uBaseY - (manoH - 100) / 2;
    const levelDiffPx = Math.min(60, (manometerDeltaH_cm / 80) * 80);

    const leftColY = centerFluidLevel + levelDiffPx / 2; // Left column goes down under pressure
    const rightColY = centerFluidLevel - levelDiffPx / 2; // Right column rises

    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(uLeftX, leftColY);
    ctx.lineTo(uLeftX, uBaseY - 15);
    ctx.arcTo(uLeftX, uBaseY, uLeftX + 15, uBaseY, 15);
    ctx.lineTo(uRightX - 15, uBaseY);
    ctx.arcTo(uRightX, uBaseY, uRightX, uBaseY - 15, 15);
    ctx.lineTo(uRightX, rightColY);
    ctx.stroke();

    // Connecting silicone tubing from sensor probe to Left U-tube limb
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(probeX, tankY - 15);
    ctx.bezierCurveTo(probeX + 80, tankY - 40, uLeftX - 60, uTopY - 30, uLeftX, uTopY);
    ctx.stroke();

    // Manometer differential height marker
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(uLeftX + 12, leftColY);
    ctx.lineTo(uRightX + 22, leftColY);
    ctx.moveTo(uRightX + 12, rightColY);
    ctx.lineTo(uRightX + 22, rightColY);
    ctx.moveTo(uRightX + 20, leftColY);
    ctx.lineTo(uRightX + 20, rightColY);
    ctx.stroke();

    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`dh = ${manometerDeltaH_cm.toFixed(1)} cm`, uRightX - 25, rightColY - 8);
  };

  return (
    <div className="simulation-page max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 mb-2">
              <Droplets className="w-3.5 h-3.5" />
              <span>Vật lí 10 • KNTT Bài 34 • CTST Bài 33 &amp; Bài 34</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isVN ? simInfo.title : simInfo.titleEn}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              {isVN
                ? "Khảo sát áp suất thủy tĩnh trong chất lỏng theo công thức p = p₀ + ρgh bằng áp kế chữ U. Đo lực đẩy Archimedes F_A = ρ·g·V và trọng lượng biểu kiến khi nhúng chìm vật trong chất lưu."
                : "Explore hydrostatic fluid pressure p = p₀ + ρgh with a U-tube manometer, and verify Archimedes buoyant force F_A = ρgV."}
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

        {/* Fluid Selection Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400 flex items-center mr-2">
            <Droplets className="w-3.5 h-3.5 mr-1 text-sky-400" />
            {isVN ? "Chọn loại chất lỏng:" : "Select Fluid:"}
          </span>

          {fluids.map((fluid) => (
            <button
              key={fluid.id}
              onClick={() => setSelectedFluidId(fluid.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                selectedFluidId === fluid.id
                  ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                  : "bg-slate-800/70 text-slate-400 hover:text-white"
              }`}
            >
              <span>{isVN ? fluid.nameVn : fluid.nameEn}</span>
              <span className="text-[10px] opacity-80 font-mono">({fluid.density} kg/m³)</span>
            </button>
          ))}
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
                  <Activity className="w-4 h-4 text-sky-400" />
                  <span>{isVN ? "Bình Thủy tĩnh & Áp kế Chữ U" : "Hydrostatic Tank & U-tube Manometer"}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowArchimedes(!showArchimedes)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      showArchimedes ? "bg-amber-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {isVN ? "Khảo sát Lực đẩy Archimedes" : "Archimedes Buoyancy"}
                  </button>
                </div>
              </div>

              {/* Canvas Viewport */}
              <div className="w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80 aspect-[16/10] relative">
                <canvas ref={canvasRef} width={760} height={460} className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Live Analytics & Physics Formula Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isVN ? "Định luật Thủy tĩnh & Công thức Áp suất" : "Hydrostatic Law & Pressure Analysis"}</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block mb-1">Khối lượng riêng (ρ):</span>
                  <span className="text-sky-300 font-bold font-mono text-sm">{currentFluid.density} kg/m³</span>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block mb-1">Áp suất chất lỏng (p_cl):</span>
                  <span className="text-amber-300 font-bold font-mono text-sm">
                    {gaugePressureKPa.toFixed(2)} kPa ({gaugePressurePa.toFixed(0)} Pa)
                  </span>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block mb-1">Áp suất toàn phần (p):</span>
                  <span className="text-indigo-300 font-bold font-mono text-sm">
                    {absolutePressureKPa.toFixed(2)} kPa
                  </span>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block mb-1">Lực đẩy Archimedes:</span>
                  <span className="text-emerald-400 font-bold font-mono text-sm">
                    {buoyantForceN.toFixed(3)} N
                  </span>
                </div>
              </div>

              {/* Core Physical Insights */}
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs space-y-1">
                <span className="font-bold text-slate-200 block">Đặc điểm áp suất chất lỏng (SGK KNTT tr.132):</span>
                <p className="text-slate-300">
                  • Chất lỏng gây áp suất theo <strong>mọi phương</strong> lên các vật nằm trong lòng nó.
                </p>
                <p className="text-slate-300">
                  • Áp suất tại điểm có độ sâu h: <strong className="text-sky-400 font-mono">p = p₀ + ρ·g·h</strong>.
                </p>
                <p className="text-slate-300">
                  • Lực đẩy Archimedes: <strong className="text-emerald-400 font-mono">F_A = ρ·g·V</strong> (V: thể tích phần chất lỏng bị vật chiếm chỗ).
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Controls (1 Col) */}
          <div className="space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Gauge className="w-4 h-4 text-indigo-400" />
                <span>{isVN ? "Điều khiển Thí nghiệm" : "Experiment Controls"}</span>
              </h2>

              {/* Probe Depth Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{isVN ? "Độ sâu màng cảm biến (h):" : "Probe Depth (h):"}</span>
                  <span className="text-sky-400 font-mono font-bold">{probeDepthCm} cm</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={75}
                  step={1}
                  value={probeDepthCm}
                  onChange={(e) => setProbeDepthCm(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              {/* Probe Orientation Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  {isVN ? "Hướng của màng cao su cảm biến:" : "Membrane Orientation:"}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => setProbeOrientation("down")}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      probeOrientation === "down" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    Hướng xuống
                  </button>
                  <button
                    onClick={() => setProbeOrientation("up")}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      probeOrientation === "up" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    Hướng lên
                  </button>
                  <button
                    onClick={() => setProbeOrientation("side")}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      probeOrientation === "side" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    Phương ngang
                  </button>
                </div>
              </div>

              {/* Atmospheric Pressure */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{isVN ? "Áp suất khí quyển mặt thoáng (p₀):" : "Atmospheric Pressure (p₀):"}</span>
                  <span className="text-amber-400 font-mono font-bold">{atmPressureKPa} kPa</span>
                </div>
                <input
                  type="range"
                  min={90}
                  max={110}
                  step={0.5}
                  value={atmPressureKPa}
                  onChange={(e) => setAtmPressureKPa(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Submerged Volume */}
              {showArchimedes && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{isVN ? "Thể tích vật nhúng chìm (V):" : "Submerged Volume (V):"}</span>
                    <span className="text-emerald-400 font-mono font-bold">{immersionVolumeCm3} cm³</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={300}
                    step={10}
                    value={immersionVolumeCm3}
                    onChange={(e) => setImmersionVolumeCm3(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Curriculum Standard Card */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>{isVN ? "Chuẩn SGK Đối chiếu" : "Curriculum Standard"}</span>
              </div>
              <p className="text-xs text-slate-400">
                • <strong>KNTT:</strong> Bài 34: Khối lượng riêng. Áp suất chất lỏng (Trang 132-136)
              </p>
              <p className="text-xs text-slate-400">
                • <strong>CTST:</strong> Bài 33 &amp; Bài 34: Chất lưu và áp suất (Trang 145-152)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
