import React, { useState, useEffect, useRef } from "react";
import { simulationsData } from "../../../data/mockData";
import { useAppProgress } from "../../../context/AppContext";
import QuizPanel from "../../quiz/QuizPanel";
import { Play, Pause, RotateCcw, Activity, HelpCircle } from "lucide-react";

export default function MomentumCollision() {
  const simId = "momentum-collision";
  const simInfo = simulationsData.find(s => s.id === simId)!;
  const { recordEvent, language, t } = useAppProgress();

  const [collisionType, setCollisionType] = useState<"elastic" | "inelastic">("elastic");
  const [m1, setM1] = useState(1.0); // kg
  const [v1Init, setV1Init] = useState(3.0); // m/s (moving right)
  const [m2, setM2] = useState(2.0); // kg
  const [v2Init, setV2Init] = useState(-1.5); // m/s (moving left)

  const [isPlaying, setIsPlaying] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  // Glider dynamic positions on 10m track
  const trackLengthM = 10;
  const [x1, setX1] = useState(2.0);
  const [x2, setX2] = useState(8.0);
  const [v1, setV1] = useState(v1Init);
  const [v2, setV2] = useState(v2Init);
  const [hasCollided, setHasCollided] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reqRef = useRef<number | undefined>(undefined);

  // Theoretical Final Velocities
  let v1Final = 0;
  let v2Final = 0;
  if (collisionType === "elastic") {
    // 1D Elastic Collision
    v1Final = ((m1 - m2) * v1Init + 2 * m2 * v2Init) / (m1 + m2);
    v2Final = ((m2 - m1) * v2Init + 2 * m1 * v1Init) / (m1 + m2);
  } else {
    // 1D Inelastic / Sticky Collision
    const vCommon = (m1 * v1Init + m2 * v2Init) / (m1 + m2);
    v1Final = vCommon;
    v2Final = vCommon;
  }

  // Momentum values
  const p1Init = m1 * v1Init;
  const p2Init = m2 * v2Init;
  const pTotalInit = p1Init + p2Init;

  const p1Curr = m1 * v1;
  const p2Curr = m2 * v2;
  const pTotalCurr = p1Curr + p2Curr;

  useEffect(() => {
    recordEvent({ type: "simulation_started", simulationId: simId, topic: simInfo.topic });
  }, []);

  const handleReset = () => {
    setIsPlaying(false);
    setX1(2.0);
    setX2(8.0);
    setV1(v1Init);
    setV2(v2Init);
    setHasCollided(false);
  };

  useEffect(() => {
    handleReset();
  }, [m1, v1Init, m2, v2Init, collisionType]);

  useEffect(() => {
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (isPlaying) {
        setX1(prevX1 => {
          let nextX1 = prevX1 + v1 * dt;
          return nextX1;
        });

        setX2(prevX2 => {
          let nextX2 = prevX2 + v2 * dt;
          return nextX2;
        });
      }

      reqRef.current = requestAnimationFrame(loop);
    };

    reqRef.current = requestAnimationFrame(loop);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [isPlaying, v1, v2]);

  // Collision detection check
  useEffect(() => {
    const gliderWidthM = 0.8;
    if (!hasCollided && x1 + gliderWidthM / 2 >= x2 - gliderWidthM / 2) {
      setHasCollided(true);
      const collisionCenter = (x1 + x2) / 2;
      setX1(collisionCenter - gliderWidthM / 2);
      setX2(collisionCenter + gliderWidthM / 2);
      setV1(v1Final);
      setV2(v2Final);
      recordEvent({ type: "simulation_completed", simulationId: simId, topic: simInfo.title });
    }
  }, [x1, x2, hasCollided, v1Final, v2Final]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width;
    const h = canvas.height;

    // Track Coordinates
    const trackY = h / 2 + 30;
    const trackMargin = 50;
    const trackWidthPx = w - trackMargin * 2;
    const mToPx = trackWidthPx / trackLengthM;

    // Air Track Body (Metallic Bar with air holes)
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(trackMargin, trackY, trackWidthPx, 22);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    ctx.strokeRect(trackMargin, trackY, trackWidthPx, 22);

    // Air holes
    ctx.fillStyle = "#0f172a";
    for (let x = trackMargin + 10; x < trackMargin + trackWidthPx; x += 15) {
      ctx.beginPath();
      ctx.arc(x, trackY + 11, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ruler Scale Ticks
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "bold 12px monospace";
    for (let meter = 0; meter <= trackLengthM; meter += 1) {
      const tx = trackMargin + meter * mToPx;
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(tx, trackY + 22);
      ctx.lineTo(tx, trackY + 34);
      ctx.stroke();
      ctx.fillText(`${meter}m`, tx - 8, trackY + 50);
    }

    // Photogates (Cổng quang điện A & B)
    const drawPhotogate = (gx: number, label: string) => {
      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2.5;
      ctx.fillRect(gx - 8, trackY - 60, 16, 60);
      ctx.strokeRect(gx - 8, trackY - 60, 16, 60);

      // Optical beam
      ctx.strokeStyle = "rgba(244, 63, 94, 0.85)";
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(gx, trackY - 45);
      ctx.lineTo(gx, trackY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label, gx, trackY - 68);
    };

    drawPhotogate(trackMargin + 3.5 * mToPx, language === "VN" ? "Cổng A" : "Gate A");
    drawPhotogate(trackMargin + 6.5 * mToPx, language === "VN" ? "Cổng B" : "Gate B");

    // Glider Drawing Helper
    const drawGlider = (gxM: number, mass: number, vel: number, color: string, label: string) => {
      const gWidthPx = 0.9 * mToPx;
      const gHeightPx = 42;
      const px = trackMargin + gxM * mToPx - gWidthPx / 2;
      const py = trackY - gHeightPx;

      // Glider Body
      ctx.fillStyle = color;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.fillRect(px, py, gWidthPx, gHeightPx);
      ctx.strokeRect(px, py, gWidthPx, gHeightPx);

      // Mass label
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${label} (${mass}kg)`, px + gWidthPx / 2, py + 26);

      // Velocity vector arrow with prominent head
      if (Math.abs(vel) > 0.1) {
        const arrowLen = vel * 28;
        const ax = px + gWidthPx / 2;
        const ay = py - 18;
        const targetX = ax + arrowLen;

        ctx.strokeStyle = "#38bdf8";
        ctx.fillStyle = "#38bdf8";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(targetX, ay);
        ctx.stroke();

        // Arrowhead
        const headDir = vel > 0 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(targetX, ay);
        ctx.lineTo(targetX - headDir * 9, ay - 6);
        ctx.lineTo(targetX - headDir * 9, ay + 6);
        ctx.closePath();
        ctx.fill();

        ctx.font = "bold 13px monospace";
        ctx.fillText(`v = ${vel.toFixed(1)} m/s`, ax + arrowLen / 2, ay - 9);
      }
    };

    // Glider 1 (Indigo) & Glider 2 (Rose)
    drawGlider(x1, m1, v1, "#6366f1", language === "VN" ? "Xe 1" : "Cart 1");
    drawGlider(x2, m2, v2, "#f43f5e", language === "VN" ? "Xe 2" : "Cart 2");
  }, [x1, x2, v1, v2, m1, m2, language]);

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
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>{language === "VN" ? "Băng đệm khí & Bảo toàn Động lượng" : "Air Track Collision Lab"}</span>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono text-slate-300">
              <span>p_tot: <strong className="text-emerald-400">{pTotalCurr.toFixed(2)} kg·m/s</strong></span>
              <span>v₁: <strong className="text-indigo-400">{v1.toFixed(2)} m/s</strong></span>
              <span>v₂: <strong className="text-rose-400">{v2.toFixed(2)} m/s</strong></span>
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

          {/* Collision Mode Switcher & Play Controls */}
          <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
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
              <span className="text-xs text-slate-400 font-medium">
                {hasCollided 
                  ? (language === "VN" ? "Đã xảy ra va chạm!" : "Collision occurred!") 
                  : (isPlaying ? (language === "VN" ? "Đang di chuyển tiếp cận..." : "Approaching...") : (language === "VN" ? "Sẵn sàng" : "Ready"))}
              </span>
            </div>

            {/* Type selector */}
            <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
              <button
                onClick={() => setCollisionType("elastic")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  collisionType === "elastic" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {language === "VN" ? "Va chạm Đàn hồi" : "Elastic"}
              </button>
              <button
                onClick={() => setCollisionType("inelastic")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  collisionType === "inelastic" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {language === "VN" ? "Va chạm Mềm (Dính)" : "Inelastic (Sticky)"}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
            <h3 className="font-bold text-slate-100 text-sm uppercase tracking-wider">
              {language === "VN" ? "Thông số Xe trượt" : "Glider Variables"}
            </h3>

            {/* Xe 1 */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-indigo-500/20 space-y-3">
              <div className="text-xs font-bold text-indigo-400 uppercase">
                {language === "VN" ? "Xe 1 (Trái → Phải)" : "Cart 1 (Left → Right)"}
              </div>
              <div>
                <div className="flex justify-between mb-1 text-xs">
                  <span className="text-slate-400">{language === "VN" ? "Khối lượng m₁" : "Mass m₁"}</span>
                  <span className="font-mono text-indigo-300 font-bold">{m1} kg</span>
                </div>
                <input 
                  type="range" min="0.5" max="5" step="0.5" value={m1}
                  onChange={(e) => setM1(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-xs">
                  <span className="text-slate-400">{language === "VN" ? "Vận tốc ban đầu v₁" : "Initial Velocity v₁"}</span>
                  <span className="font-mono text-indigo-300 font-bold">+{v1Init} m/s</span>
                </div>
                <input 
                  type="range" min="0.5" max="5" step="0.5" value={v1Init}
                  onChange={(e) => setV1Init(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Xe 2 */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-rose-500/20 space-y-3">
              <div className="text-xs font-bold text-rose-400 uppercase">
                {language === "VN" ? "Xe 2 (Phải ← Trái)" : "Cart 2 (Right ← Left)"}
              </div>
              <div>
                <div className="flex justify-between mb-1 text-xs">
                  <span className="text-slate-400">{language === "VN" ? "Khối lượng m₂" : "Mass m₂"}</span>
                  <span className="font-mono text-rose-300 font-bold">{m2} kg</span>
                </div>
                <input 
                  type="range" min="0.5" max="5" step="0.5" value={m2}
                  onChange={(e) => setM2(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-xs">
                  <span className="text-slate-400">{language === "VN" ? "Vận tốc ban đầu v₂" : "Initial Velocity v₂"}</span>
                  <span className="font-mono text-rose-300 font-bold">{v2Init} m/s</span>
                </div>
                <input 
                  type="range" min="-5" max="-0.5" step="0.5" value={v2Init}
                  onChange={(e) => setV2Init(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="font-bold text-slate-100 text-sm mb-3 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-indigo-400" />
              {language === "VN" ? "Kiểm chứng Bảo toàn Động lượng" : "Momentum Verification"}
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">{language === "VN" ? "Tổng động lượng trước p_trước" : "Initial Momentum p_init"}</span>
                <span className="text-emerald-400 font-bold">{pTotalInit.toFixed(2)} kg·m/s</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">{language === "VN" ? "Tổng động lượng sau p_sau" : "Final Momentum p_after"}</span>
                <span className="text-emerald-400 font-bold">{pTotalCurr.toFixed(2)} kg·m/s</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">{language === "VN" ? "Độ chênh lệch Δp" : "Momentum Drift Δp"}</span>
                <span className="text-slate-300">{(pTotalCurr - pTotalInit).toFixed(3)} kg·m/s</span>
              </div>
              <div className="text-[11px] text-slate-400 font-sans pt-2 leading-relaxed">
                {collisionType === "elastic"
                  ? (language === "VN" ? "✓ Va chạm đàn hồi: Bảo toàn cả động lượng p và động năng Wđ." : "✓ Elastic: Conserves both momentum and kinetic energy.")
                  : (language === "VN" ? "✓ Va chạm mềm: Động lượng p bảo toàn, hai xe gắn dính chuyển động cùng vận tốc v'." : "✓ Inelastic: Momentum is strictly conserved; gliders latch together.")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showQuiz && <QuizPanel simulationId={simId} onClose={() => setShowQuiz(false)} />}
    </div>
  );
}
