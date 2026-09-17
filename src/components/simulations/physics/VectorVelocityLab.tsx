import React, { useState, useEffect, useRef } from "react";
import { simulationsData } from "../../../data/mockData";
import { useAppProgress } from "../../../context/AppContext";
import QuizPanel from "../../quiz/QuizPanel";
import {
  Play,
  Pause,
  RotateCcw,
  Activity,
  Compass,
  Navigation,
  Waves,
  HelpCircle,
  Layers,
  ArrowRight,
  Sparkles,
  Gauge
} from "lucide-react";

export default function VectorVelocityLab() {
  const simId = "vector-velocity";
  const simInfo = simulationsData.find((s) => s.id === simId) || {
    id: "vector-velocity",
    title: "Vận tốc tổng hợp & Thuyền qua sông",
    titleEn: "Relative Velocity & River Crossing Vector Lab",
    topic: "Vận tốc tuyệt đối, vận tốc tương đối, công thức cộng vectơ vận tốc",
    topicEn: "Absolute and relative velocity, Galilean velocity addition vector"
  };

  const { recordEvent, language, t } = useAppProgress();
  const isVN = language === "VN";

  // Physics parameters
  const [riverWidth, setRiverWidth] = useState<number>(100); // meters (river width)
  const [boatSpeed, setBoatSpeed] = useState<number>(4); // m/s (v12: boat speed relative to water)
  const [riverCurrent, setRiverCurrent] = useState<number>(3); // m/s (v23: water speed relative to bank, along +x)
  const [headingAngle, setHeadingAngle] = useState<number>(90); // degrees (90° = straight across perpendicular to bank)
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showTrajectory, setShowTrajectory] = useState<boolean>(true);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simTime, setSimTime] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    recordEvent({
      type: "simulation_started",
      simulationId: simId,
      topic: simInfo.topic
    });
  }, []);

  // Vector Decomposition Math:
  // Heading angle theta: 0° = downstream (+x), 90° = straight across (+y), 180° = upstream (-x)
  const thetaRad = (headingAngle * Math.PI) / 180;
  
  // v12 (Boat wrt water):
  const v12_x = boatSpeed * Math.cos(thetaRad);
  const v12_y = boatSpeed * Math.sin(thetaRad); // perpendicular crossing velocity

  // v23 (Water wrt riverbank):
  const v23_x = riverCurrent;
  const v23_y = 0;

  // v13 (Boat wrt riverbank - Absolute velocity):
  const v13_x = v12_x + v23_x;
  const v13_y = v12_y + v23_y;
  const totalSpeed = Math.sqrt(v13_x * v13_x + v13_y * v13_y);

  // Resultant ground track angle
  const resultantAngleDeg = (Math.atan2(v13_y, v13_x) * 180) / Math.PI;

  // Crossing Time & Drift:
  // Boat reaches opposite bank when y = riverWidth
  const crossingTime = v12_y > 0 ? riverWidth / v12_y : Infinity;
  const downstreamDrift = isFinite(crossingTime) ? v13_x * crossingTime : 0;
  const totalTraveledDistance = isFinite(crossingTime) ? totalSpeed * crossingTime : 0;

  // Optimal Angle to cross perpendicularly with ZERO downstream drift:
  // Requires v13_x = 0 => boatSpeed * cos(theta) + riverCurrent = 0 => cos(theta) = -riverCurrent / boatSpeed
  const canCrossPerpendicularly = boatSpeed >= riverCurrent;
  const optimalUpstreamAngleDeg = canCrossPerpendicularly
    ? (Math.acos(-riverCurrent / boatSpeed) * 180) / Math.PI
    : null;

  // Current Boat Position at simTime
  const clampedTime = Math.min(simTime, crossingTime);
  const currentX = v13_x * clampedTime;
  const currentY = v13_y * clampedTime;

  // Animation Loop
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        setSimTime((prev) => {
          const next = prev + dt;
          if (next >= crossingTime) {
            setIsPlaying(false);
            return crossingTime;
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
  }, [isPlaying, simTime, boatSpeed, riverCurrent, headingAngle, riverWidth, showVectors, showTrajectory]);

  const drawScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width;
    const h = canvas.height;

    const bankBottomY = h - 60;
    const bankTopY = 70;
    const riverHeightPx = bankBottomY - bankTopY;

    // 1. Water Background (River Flow)
    const waterGrad = ctx.createLinearGradient(0, bankTopY, 0, bankBottomY);
    waterGrad.addColorStop(0, "#0c4a6e");
    waterGrad.addColorStop(0.5, "#0284c7");
    waterGrad.addColorStop(1, "#075985");
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, bankTopY, w, riverHeightPx);

    // River animated flow lines / current arrows
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1.5;
    const flowPhase = (performance.now() / 400) * (riverCurrent / 2);
    for (let row = bankTopY + 25; row < bankBottomY; row += 35) {
      for (let col = -50; col < w + 50; col += 80) {
        const xPos = (col + flowPhase) % (w + 100);
        ctx.beginPath();
        ctx.moveTo(xPos, row);
        ctx.lineTo(xPos + 25, row);
        ctx.lineTo(xPos + 20, row - 3);
        ctx.stroke();
      }
    }

    // 2. Riverbanks (Bờ sông A & Bờ sông B)
    // Top Bank (Bờ bên kia - Bờ B)
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, w, bankTopY);
    ctx.fillStyle = "#10b981";
    ctx.fillRect(0, bankTopY - 6, w, 6);

    // Bottom Bank (Bờ xuất phát - Bờ A)
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, bankBottomY, w, h - bankBottomY);
    ctx.fillStyle = "#10b981";
    ctx.fillRect(0, bankBottomY, w, 6);

    // Bank Labels
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(isVN ? "BỜ BÊN KIA (BỜ B)" : "DESTINATION BANK (BANK B)", 20, bankTopY - 18);
    ctx.fillText(isVN ? "BỜ XUẤT PHÁT (BỜ A)" : "STARTING BANK (BANK A)", 20, bankBottomY + 25);

    // Scale mapping
    // Origin (0,0) starts at (w/2 - 150, bankBottomY)
    const originX = 140;
    const originY = bankBottomY;
    const scale = riverHeightPx / riverWidth; // px per meter

    // Draw Reference Axes (Ox song song bờ sông, Oy vuông góc)
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    // Oy axis (straight across)
    ctx.beginPath();
    ctx.moveTo(originX, bankBottomY + 30);
    ctx.lineTo(originX, bankTopY - 20);
    ctx.stroke();
    // Ox axis (along bank A)
    ctx.beginPath();
    ctx.moveTo(30, originY);
    ctx.lineTo(w - 30, originY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px sans-serif";
    ctx.fillText("O", originX - 12, originY + 16);
    ctx.fillText("+y", originX - 18, bankTopY - 10);
    ctx.fillText("+x (Dòng nước chảy)", originX + 160, originY + 16);

    // Helper: Draw Arrow
    const drawArrow = (
      fromX: number,
      fromY: number,
      toX: number,
      toY: number,
      color: string,
      lineWidth = 3,
      headSize = 9
    ) => {
      const angle = Math.atan2(toY - fromY, toX - fromX);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(toX, toY);
      ctx.lineTo(toX - headSize * Math.cos(angle - Math.PI / 6), toY - headSize * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(toX - headSize * Math.cos(angle + Math.PI / 6), toY - headSize * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    };

    // 3. Draw Projected Trajectory (Vết chuyển động thực tế đối với bờ)
    if (showTrajectory && isFinite(crossingTime)) {
      const destX = originX + downstreamDrift * scale;
      const destY = bankTopY;

      // Trajectory dashed line
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(destX, destY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Destination Landing Marker
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(destX, destY, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        isVN ? `Điểm cập bờ (${downstreamDrift.toFixed(1)}m)` : `Landing Point (${downstreamDrift.toFixed(1)}m)`,
        destX,
        destY - 12
      );

      // Drift bracket along top bank
      if (Math.abs(downstreamDrift) > 1) {
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(originX, bankTopY - 4);
        ctx.lineTo(destX, bankTopY - 4);
        ctx.stroke();

        ctx.fillStyle = "#38bdf8";
        ctx.fillText(
          isVN ? `Độ dạt hạ lưu x = ${downstreamDrift.toFixed(1)} m` : `Drift x = ${downstreamDrift.toFixed(1)} m`,
          (originX + destX) / 2,
          bankTopY + 16
        );
      }
    }

    // 4. Draw Current Boat Position
    const boatScreenX = originX + currentX * scale;
    const boatScreenY = originY - currentY * scale;

    ctx.save();
    ctx.translate(boatScreenX, boatScreenY);
    // Boat heading rotation
    ctx.rotate(-thetaRad + Math.PI / 2);

    // Boat Hull (Thân thuyền)
    ctx.fillStyle = "#f8fafc";
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -18); // Bow (mũi thuyền)
    ctx.quadraticCurveTo(12, -4, 10, 16);
    ctx.lineTo(-10, 16);
    ctx.quadraticCurveTo(-12, -4, 0, -18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cabin / Seat
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(-6, -2, 12, 10);

    ctx.restore();

    // 5. Draw Velocity Vector Triangle at Current Boat Position (Công thức cộng vận tốc)
    if (showVectors) {
      const vecScale = 14; // pixels per m/s

      // Vector 1: v12 (Thuyền đối với nước - Xanh lục)
      const v12_endX = boatScreenX + v12_x * vecScale;
      const v12_endY = boatScreenY - v12_y * vecScale;
      drawArrow(boatScreenX, boatScreenY, v12_endX, v12_endY, "#10b981", 3.5, 9);

      // Vector 2: v23 (Nước đối với bờ - Xanh dương)
      const v23_endX = v12_endX + v23_x * vecScale;
      const v23_endY = v12_endY - v23_y * vecScale;
      drawArrow(v12_endX, v12_endY, v23_endX, v23_endY, "#38bdf8", 3.5, 9);

      // Vector 3: v13 (Thuyền đối với bờ - Vàng cam - Resultant vector)
      drawArrow(boatScreenX, boatScreenY, v23_endX, v23_endY, "#f59e0b", 4, 10);

      // Vector text tags
      ctx.font = "bold 11px sans-serif";
      ctx.fillStyle = "#10b981";
      ctx.textAlign = "left";
      ctx.fillText(`v⃗₁₂ (${boatSpeed} m/s)`, v12_endX + 6, v12_endY - 6);

      ctx.fillStyle = "#38bdf8";
      ctx.fillText(`v⃗₂₃ (${riverCurrent} m/s)`, v23_endX + 6, v23_endY + 14);

      ctx.fillStyle = "#f59e0b";
      ctx.fillText(`v⃗₁₃ (${totalSpeed.toFixed(2)} m/s)`, v23_endX + 6, v23_endY - 6);
    }
  };

  const handleStart = () => {
    if (simTime >= crossingTime) {
      setSimTime(0);
    }
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setSimTime(0);
  };

  const handleSetOptimalAngle = () => {
    if (optimalUpstreamAngleDeg !== null) {
      setHeadingAngle(Number(optimalUpstreamAngleDeg.toFixed(1)));
      handleReset();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Vật lí 10 • KNTT Bài 5 • CTST Bài 5</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isVN ? simInfo.title : simInfo.titleEn}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              {isVN
                ? "Khảo sát chuyển động tương đối của thuyền qua sông có dòng nước chảy. Trực quan hóa công thức cộng vectơ vận tốc Galilei: v⃗₁₃ = v⃗₁₂ + v⃗₂₃, thời gian sang sông và độ dạt hạ lưu."
                : "Explore relative motion and Galilean velocity vector addition v⃗₁₃ = v⃗₁₂ + v⃗₂₃ for a boat crossing a river with water currents."}
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
      </div>

      {showQuiz ? (
        <QuizPanel simulationId={simId} onClose={() => setShowQuiz(false)} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visualizer Canvas (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
                  <Waves className="w-4 h-4 text-sky-400" />
                  <span>{isVN ? "Mô phỏng 2D Thuyền & Dòng nước" : "2D River Crossing Vector Simulation"}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowVectors(!showVectors)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      showVectors ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {isVN ? "Vectơ v⃗" : "Vectors"}
                  </button>
                  <button
                    onClick={() => setShowTrajectory(!showTrajectory)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      showTrajectory ? "bg-amber-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {isVN ? "Quỹ đạo" : "Trajectory"}
                  </button>
                </div>
              </div>

              {/* Canvas Viewport */}
              <div className="w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80 aspect-[16/10] relative">
                <canvas ref={canvasRef} width={760} height={460} className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Vector Legend & Physics Breakdown Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isVN ? "Công thức cộng Vận tốc Galilei" : "Galilean Velocity Addition Principle"}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-1">
                  <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                    <span>v⃗₁₂ (Vận tốc tương đối)</span>
                  </div>
                  <p className="text-slate-300">
                    Thuyền đối với Nước: <span className="font-mono font-bold text-emerald-300">{boatSpeed} m/s</span>
                  </p>
                  <p className="text-[11px] text-slate-400">Hướng mũi thuyền: {headingAngle}°</p>
                </div>

                <div className="p-3 bg-sky-950/20 border border-sky-500/30 rounded-xl space-y-1">
                  <div className="flex items-center space-x-1.5 text-sky-400 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span>
                    <span>v⃗₂₃ (Vận tốc kéo theo)</span>
                  </div>
                  <p className="text-slate-300">
                    Nước đối với Bờ: <span className="font-mono font-bold text-sky-300">{riverCurrent} m/s</span>
                  </p>
                  <p className="text-[11px] text-slate-400">Chảy xuôi dòng (+x)</p>
                </div>

                <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-1">
                  <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                    <span>v⃗₁₃ (Vận tốc tuyệt đối)</span>
                  </div>
                  <p className="text-slate-300">
                    Thuyền đối với Bờ: <span className="font-mono font-bold text-amber-300">{totalSpeed.toFixed(2)} m/s</span>
                  </p>
                  <p className="text-[11px] text-slate-400">Góc so với bờ: {resultantAngleDeg.toFixed(1)}°</p>
                </div>
              </div>

              {/* Kinematic Results Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block mb-1">Thời gian sang sông:</span>
                  <span className="text-indigo-300 font-bold font-mono text-sm">
                    {isFinite(crossingTime) ? `${crossingTime.toFixed(1)} s` : "∞"}
                  </span>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block mb-1">Độ dạt hạ lưu (x):</span>
                  <span className="text-amber-300 font-bold font-mono text-sm">
                    {downstreamDrift.toFixed(1)} m
                  </span>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block mb-1">Quãng đường đối với bờ:</span>
                  <span className="text-emerald-300 font-bold font-mono text-sm">
                    {totalTraveledDistance.toFixed(1)} m
                  </span>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
                  <span className="text-slate-400 block mb-1">Vận tốc sang bờ (vy):</span>
                  <span className="text-sky-300 font-bold font-mono text-sm">
                    {v12_y.toFixed(2)} m/s
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Controls (1 Col) */}
          <div className="space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-indigo-400" />
                <span>{isVN ? "Điều khiển Thuyền & Dòng chảy" : "Simulation Controls"}</span>
              </h2>

              {/* Heading Angle Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{isVN ? "Góc hướng mũi thuyền (α):" : "Boat Heading Angle (α):"}</span>
                  <span className="text-emerald-400 font-mono font-bold">{headingAngle}°</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={150}
                  step={1}
                  value={headingAngle}
                  onChange={(e) => {
                    setHeadingAngle(Number(e.target.value));
                    handleReset();
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>30° (Xuôi dòng)</span>
                  <span>90° (Thẳng góc)</span>
                  <span>150° (Ngược dòng)</span>
                </div>
              </div>

              {/* Boat Speed Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{isVN ? "Tốc độ thuyền v₁₂:" : "Boat Speed v₁₂:"}</span>
                  <span className="text-indigo-400 font-mono font-bold">{boatSpeed} m/s</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={0.5}
                  value={boatSpeed}
                  onChange={(e) => {
                    setBoatSpeed(Number(e.target.value));
                    handleReset();
                  }}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* River Current Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{isVN ? "Tốc độ dòng nước v₂₃:" : "River Current v₂₃:"}</span>
                  <span className="text-sky-400 font-mono font-bold">{riverCurrent} m/s</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={6}
                  step={0.5}
                  value={riverCurrent}
                  onChange={(e) => {
                    setRiverCurrent(Number(e.target.value));
                    handleReset();
                  }}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              {/* River Width Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{isVN ? "Bề rộng sông (d):" : "River Width (d):"}</span>
                  <span className="text-amber-400 font-mono font-bold">{riverWidth} m</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={200}
                  step={10}
                  value={riverWidth}
                  onChange={(e) => {
                    setRiverWidth(Number(e.target.value));
                    handleReset();
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Zero Drift Quick Preset Button */}
              {canCrossPerpendicularly && (
                <button
                  onClick={handleSetOptimalAngle}
                  className="w-full py-2 px-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/40 text-xs font-semibold transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>
                    {isVN
                      ? `Chỉnh góc không dạt: α = ${optimalUpstreamAngleDeg?.toFixed(1)}°`
                      : `Set Zero Drift Heading: α = ${optimalUpstreamAngleDeg?.toFixed(1)}°`}
                  </span>
                </button>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex gap-2">
                <button
                  onClick={isPlaying ? () => setIsPlaying(false) : handleStart}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlaying ? (isVN ? "Tạm dừng" : "Pause") : isVN ? "Khởi hành" : "Launch"}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Curriculum Reference Card */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>{isVN ? "Chuẩn SGK Đối chiếu" : "Curriculum Mapping"}</span>
              </div>
              <p className="text-xs text-slate-400">
                • <strong>KNTT:</strong> Bài 5: Tốc độ và vận tốc (Trang 26-30)
              </p>
              <p className="text-xs text-slate-400">
                • <strong>CTST:</strong> Bài 5: Tốc độ và vận tốc (Trang 30-35)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
